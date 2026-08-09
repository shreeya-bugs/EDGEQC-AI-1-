import base64
import traceback
from typing import List, Optional

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from pydantic import BaseModel

from database import execute, fetch_all, init_db, insert_json_row
from services.ai_copilot import generate_copilot_response
from services.sample_loader import get_sample_dataset_images
from services.vision_engine import VisionEngine

app = FastAPI(
    title="EdgeQC AI Backend API",
    description="FastAPI backend with OpenCV + YOLO computer vision engine for EdgeQC AI",
    version="2.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

vision_engine: Optional[VisionEngine] = None


class ChatRequest(BaseModel):
    message: str
    language: Optional[str] = "en"
    conversation_history: Optional[List[dict]] = []


class WhatsAppRequest(BaseModel):
    recipient_phone: str
    machine_name: str
    defect_count: int
    top_issue: str
    recommended_action: str
    estimated_loss: float
    alert_type: str


class Base64InspectRequest(BaseModel):
    image_base64: str
    filename: Optional[str] = "upload.jpg"



@app.on_event("startup")
def startup_event():
    global vision_engine
    try:
        init_db()
    except Exception as e:
        print(f"[Startup Warning] MySQL unavailable, local dataset fallback still enabled: {e}")
    try:
        vision_engine = VisionEngine(model_name="yolov8n.pt")
        print("[Startup] Vision Engine (OpenCV + YOLO) initialized successfully.")
    except Exception as e:
        print(f"[Startup Warning] Could not load YOLO model: {e}")
        vision_engine = None


@app.get("/")
def read_root():
    return {
        "status": "online",
        "system": "EdgeQC AI Quality Co-Pilot & Vision Engine v2.1",
        "database": "mysql",
        "vision_engine_ready": vision_engine is not None,
    }


@app.post("/api/chat")
async def chat_endpoint(req: ChatRequest):
    response = await generate_copilot_response(
        req.message,
        req.language or "en",
        req.conversation_history,
    )
    insert_json_row(
        "chat_messages",
        {
            "user_message": req.message,
            "language": req.language or "en",
            "response_json": response,
        },
    )
    return response


@app.post("/api/whatsapp/send")
def send_whatsapp_report(req: WhatsAppRequest):
    row_id = execute(
        """
        INSERT INTO whatsapp_reports (
          recipient_phone, machine_name, defect_count, top_issue,
          recommended_action, estimated_loss, alert_type, status
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """,
        (
            req.recipient_phone,
            req.machine_name,
            req.defect_count,
            req.top_issue,
            req.recommended_action,
            req.estimated_loss,
            req.alert_type,
            "success",
        ),
    )
    return {
        "status": "success",
        "report_id": row_id,
        "message": f"Report sent to {req.recipient_phone}",
        "alert_type": req.alert_type,
        "summary": (
            f"{req.machine_name} - {req.defect_count} defects ({req.top_issue}). "
            f"Est loss: Rs. {req.estimated_loss}"
        ),
    }

@app.get("/api/factory-health")
def get_factory_health():
    machines = fetch_all(
        """
        SELECT id, name, line_name, status, defect_rate, throughput_ppm, pass_rate
        FROM machines
        ORDER BY id
        """
    )

    if not machines:
        return {
            "healthScore": 0,
            "activeMachines": 0,
            "totalMachines": 0,
            "avgPassRate": 0,
            "overallThroughputPpm": 0,
            "predictedDowntimeHours": 0,
            "machines": [],
        }

    total = len(machines)
    active = sum(1 for machine in machines if machine["status"] == "running")
    avg_pass_rate = round(sum(float(machine["pass_rate"]) for machine in machines) / total, 2)
    throughput = sum(int(machine["throughput_ppm"]) for machine in machines)
    avg_defect_rate = sum(float(machine["defect_rate"]) for machine in machines) / total
    health_score = max(0, min(100, round(avg_pass_rate - (avg_defect_rate * 0.75))))
    predicted_downtime = round(max(0.0, avg_defect_rate - 2.0) * 0.35, 2)

    return {
        "healthScore": health_score,
        "activeMachines": active,
        "totalMachines": total,
        "avgPassRate": avg_pass_rate,
        "overallThroughputPpm": throughput,
        "predictedDowntimeHours": predicted_downtime,
        "machines": [
            {
                "id": machine["id"],
                "name": f'{machine["name"]} ({machine["line_name"]})',
                "status": machine["status"],
                "defectRate": f'{float(machine["defect_rate"]):.1f}%',
            }
            for machine in machines
        ],
    }


@app.get("/api/dataset-samples")
def get_dataset_samples():
    try:
        rows = fetch_all(
            """
            SELECT id, name, image_base64, expected_issue
            FROM dataset_samples
            ORDER BY id DESC
            LIMIT 25
            """
        )
        if rows:
            samples = [
                {
                    "id": row["id"],
                    "name": row["name"],
                    "category": row["expected_issue"],
                    "filename": f"mysql_sample_{row['id']}.jpg",
                    "dataUrl": row["image_base64"],
                }
                for row in rows
            ]
            return {"status": "success", "source": "mysql", "count": len(samples), "samples": samples}
    except Exception as e:
        print(f"[Dataset Samples] MySQL unavailable, loading local dataset: {e}")

    samples = get_sample_dataset_images()
    return {"status": "success", "source": "local_dataset", "count": len(samples), "samples": samples}

@app.post("/api/inspect")
async def inspect_image_file(file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=400, detail="No image file uploaded.")

    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    return _run_and_store_inference(
        image_bytes=contents,
        filename=file.filename or "upload.jpg",
        source="file_upload",
    )


@app.post("/api/inspect/base64")
async def inspect_image_base64(req: Base64InspectRequest):
    if not req.image_base64:
        raise HTTPException(status_code=400, detail="Missing base64 image data.")

    try:
        b64_str = req.image_base64.split(",", 1)[1] if "," in req.image_base64 else req.image_base64
        image_bytes = base64.b64decode(b64_str)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid base64 image data.")

    return _run_and_store_inference(
        image_bytes=image_bytes,
        filename=req.filename or "base64_upload.jpg",
        source="base64",
    )


def _run_and_store_inference(image_bytes: bytes, filename: str, source: str):
    global vision_engine
    if vision_engine is None:
        try:
            vision_engine = VisionEngine(model_name="yolov8n.pt")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Vision Engine unavailable: {e}")

    try:
        result = vision_engine.run_inference(image_bytes, filename=filename)
        result["filename"] = filename
        try:
            inspection_id = _store_inspection_result(filename, source, result)
        except Exception as db_error:
            print(f"[Inspection Store Warning] MySQL unavailable, returning inspection without DB row: {db_error}")
            inspection_id = None
        result["inspection_id"] = inspection_id
        return result
    except ValueError as ve:
        try:
            _store_failed_inspection(filename, source, str(ve))
        except Exception as db_error:
            print(f"[Inspection Store Warning] Could not store failed inspection: {db_error}")
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        traceback.print_exc()
        try:
            _store_failed_inspection(filename, source, str(e))
        except Exception as db_error:
            print(f"[Inspection Store Warning] Could not store failed inspection: {db_error}")
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")


def _store_inspection_result(filename: str, source: str, result: dict) -> int:
    detections = result.get("detections") or []
    inspection_id = insert_json_row(
        "inspection_runs",
        {
            "filename": filename,
            "source": source,
            "status": result.get("status", "success"),
            "defect_type": result.get("defectType"),
            "severity": result.get("severity"),
            "confidence": result.get("confidence"),
            "defect_count": len(detections),
            "annotated_image_base64": result.get("annotatedImageBase64"),
            "raw_result": result,
        },
    )

    for detection in detections:
        bbox = detection.get("bbox") or []
        x1, y1, x2, y2 = (bbox + [None, None, None, None])[:4] if isinstance(bbox, list) else (None, None, None, None)
        insert_json_row(
            "detected_defects",
            {
                "inspection_run_id": inspection_id,
                "label": detection.get("class") or detection.get("label") or "defect",
                "confidence": detection.get("confidence"),
                "x1": x1,
                "y1": y1,
                "x2": x2,
                "y2": y2,
                "raw_detection": detection,
            },
        )

    return inspection_id


def _store_failed_inspection(filename: str, source: str, error_message: str) -> None:
    insert_json_row(
        "inspection_runs",
        {
            "filename": filename,
            "source": source,
            "status": "failed",
            "defect_count": 0,
            "raw_result": {"error": error_message},
            "error_message": error_message,
        },
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)






