from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import base64
import traceback

from database import init_db, get_db_connection
from services.ai_copilot import generate_copilot_response
from services.vision_engine import VisionEngine
from services.sample_loader import get_sample_dataset_images

app = FastAPI(
    title="EdgeQC AI Backend API",
    description="FastAPI backend with OpenCV + YOLO computer vision engine for EdgeQC AI",
    version="2.0.0"
)

# Enable CORS for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Vision Engine instance
vision_engine: Optional[VisionEngine] = None

@app.on_event("startup")
def startup_event():
    global vision_engine
    init_db()
    try:
        vision_engine = VisionEngine(model_name="yolov8n.pt")
        print("[Startup] Vision Engine (OpenCV + YOLO) initialized successfully.")
    except Exception as e:
        print(f"[Startup Warning] Could not load YOLO model: {e}")
        vision_engine = None

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

@app.get("/")
def read_root():
    return {
        "status": "online",
        "system": "EdgeQC AI Quality Co-Pilot & Vision Engine v2.0",
        "vision_engine_ready": vision_engine is not None
    }

@app.post("/api/chat")
async def chat_endpoint(req: ChatRequest):
    response = await generate_copilot_response(req.message, req.language, req.conversation_history)
    return response

@app.post("/api/whatsapp/send")
def send_whatsapp_report(req: WhatsAppRequest):
    return {
        "status": "success",
        "message": f"Report sent to {req.recipient_phone}",
        "alert_type": req.alert_type,
        "summary": f"{req.machine_name} - {req.defect_count} defects ({req.top_issue}). Est loss: ₹{req.estimated_loss}"
    }

@app.get("/api/factory-health")
def get_factory_health():
    return {
        "healthScore": 94,
        "activeMachines": 3,
        "totalMachines": 3,
        "avgPassRate": 96.2,
        "overallThroughputPpm": 4170,
        "predictedDowntimeHours": 0.5,
        "machines": [
            {"id": "m1", "name": "Machine 1 (Line 1)", "status": "running", "defectRate": "1.2%"},
            {"id": "m2", "name": "Machine 2 (Line 3)", "status": "warning", "defectRate": "3.8%"},
            {"id": "m3", "name": "Machine 3 (Line 2)", "status": "running", "defectRate": "2.1%"}
        ]
    }

@app.get("/api/dataset-samples")
def get_dataset_samples():
    """Returns dataset sample images for 1-click testing in frontend."""
    samples = get_sample_dataset_images()
    return {"status": "success", "count": len(samples), "samples": samples}

@app.post("/api/inspect")
async def inspect_image_file(file: UploadFile = File(...)):
    """
    Primary OpenCV + YOLO Computer Vision API Endpoint.
    Accepts image file upload -> OpenCV preprocessing -> YOLO inference -> Annotated output.
    """
    global vision_engine
    if not file:
        raise HTTPException(status_code=400, detail="No image file uploaded.")
    
    if vision_engine is None:
        try:
            vision_engine = VisionEngine(model_name="yolov8n.pt")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Vision Engine unavailable: {e}")

    try:
        contents = await file.read()
        if not contents:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")
        
        result = vision_engine.run_inference(contents, filename=file.filename or "")
        result["filename"] = file.filename
        return result
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")

@app.post("/api/inspect/base64")
async def inspect_image_base64(req: Base64InspectRequest):
    """
    Alternative Base64 image endpoint for web app integration.
    """
    global vision_engine
    if not req.image_base64:
        raise HTTPException(status_code=400, detail="Missing base64 image data.")
    
    if vision_engine is None:
        try:
            vision_engine = VisionEngine(model_name="yolov8n.pt")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Vision Engine unavailable: {e}")

    try:
        # Strip data URL prefix if present
        b64_str = req.image_base64
        if "," in b64_str:
            b64_str = b64_str.split(",")[1]
            
        image_bytes = base64.b64decode(b64_str)
        result = vision_engine.run_inference(image_bytes, filename=req.filename or "base64_upload.jpg")
        return result
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Base64 inference error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
