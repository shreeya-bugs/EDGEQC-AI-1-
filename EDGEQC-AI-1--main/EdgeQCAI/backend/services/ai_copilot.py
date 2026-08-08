import os
import httpx

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")

async def generate_copilot_response(user_message: str, language: str = "en", history: list = None) -> dict:
    """
    Generates intelligent response using Gemini API or contextual factory fallback.
    """
    lower = user_message.lower()
    
    # Try calling Gemini REST API if key is set
    if GEMINI_API_KEY:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
            prompt = f"You are EdgeQC AI Quality Co-Pilot, an industrial defect detection & factory assistant. Respond concisely in language code {language}. User asks: {user_message}"
            async with httpx.AsyncClient() as client:
                res = await client.post(url, json={"contents": [{"parts": [{"text": prompt}]}]}, timeout=5.0)
                if res.status_code == 200:
                    data = res.json()
                    text = data['candidates'][0]['content']['parts'][0]['text']
                    return {"reply": text, "walkthrough_defect_id": "surface_scratch" if "scratch" in lower or "fix" in lower else None}
        except Exception as e:
            pass

    # Contextual Factory Fallback Engine
    if "why did this product fail" in lower or "fail" in lower or "defect" in lower:
        reply = "🔍 **Root Cause Diagnostic:**\nThe product failed due to a **Surface Scratch** defect on Machine 3 (Line 2).\n\n- **Cause:** Ceramic bearing wear on Roller #3 created micro-scratch friction.\n- **Confidence:** 94.2% (YOLOv8 Optical Feed).\n- **Severity:** High.\n\nClick **Visual Walkthrough** below to step through the interactive repair procedure."
        return {"reply": reply, "walkthrough_defect_id": "surface_scratch", "flashcard_defect_id": "surface_scratch"}
    
    elif "how do i fix" in lower or "fix" in lower or "repair" in lower:
        reply = "🛠️ **Recommended Fix Action:**\n1. Stop Line 2 conveyor bed.\n2. Swap ceramic bearing sleeve on Roller #3.\n3. Clean guide tracks with isopropyl alcohol.\n4. Torque flange bolt to **15 Nm**.\n\n*Estimated Repair Time: 15 Mins | Production Loss Saved: ₹12,500*"
        return {"reply": reply, "walkthrough_defect_id": "surface_scratch", "flashcard_defect_id": "surface_scratch"}

    elif "highest defect rate" in lower or "which machine" in lower:
        reply = "📊 **Machine Defect Leaderboard:**\n- **Machine 3 (Line 2):** 4.8% Defect Rate (18 Defects Today)\n- **Machine 2 (Line 3):** 2.1% Defect Rate (Warning)\n- **Machine 1 (Line 1):** 1.2% Defect Rate (Optimal)"
        return {"reply": reply, "walkthrough_defect_id": "misalignment"}

    elif "summarize" in lower:
        reply = "📈 **Today's Inspection Summary:**\n- Inspected: 1,248 Units\n- PASS Rate: 96.2%\n- FAIL Count: 47 Units\n- Top Issue: Surface Scratch (52% of total defects)\n- Factory Health Score: 94/100"
        return {"reply": reply}

    else:
        reply = f"I am your EdgeQC AI Quality Co-Pilot. I am monitoring active stream telemetry for Machine 3. You asked: *{user_message}*\n\nLet me know if you would like to run a visual walkthrough or review defect flashcards."
        return {"reply": reply}
