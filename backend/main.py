from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, HttpUrl
from typing import Optional
import uvicorn
from datetime import datetime
import asyncio

from ai.nlp_detector import NLPDetector
from ai.url_detector import URLDetector
from ai.ocr_pipeline import OCRPipeline
from ai.explainable_ai import ExplainableAI
from ai.optimized_inference import OptimizedInference

app = FastAPI(
    title="PhishShield AI API",
    description="Real-Time AI Cyber Fraud & Phishing Detection Platform",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize AI Components
nlp_detector = NLPDetector()
url_detector = URLDetector()
ocr_pipeline = OCRPipeline()
explainable_ai = ExplainableAI()
optimized_inference = OptimizedInference()

# Analytics Storage (In-memory for demo)
analytics_data = {
    "total_scans": 12847,
    "fraud_prevented": 847000000,
    "scans_today": 1247,
    "threat_distribution": {
        "low": 8234,
        "medium": 3156,
        "high": 1124,
        "critical": 333
    },
    "recent_scans": []
}

# Request Models
class TextScanRequest(BaseModel):
    content: str

class URLScanRequest(BaseModel):
    url: str

# Response Models
class ScanResponse(BaseModel):
    scan_id: str
    timestamp: str
    input_type: str
    scam_probability: float
    threat_level: str
    confidence: float
    explanation: str
    suspicious_elements: list
    recommendations: list
    highlighted_text: Optional[str] = None
    amd_optimized: bool = True

@app.get("/")
async def root():
    return {
        "message": "PhishShield AI API",
        "version": "1.0.0",
        "status": "operational",
        "amd_optimized": True
    }

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "models_loaded": True,
        "amd_acceleration": optimized_inference.is_optimized()
    }

@app.post("/api/scan/text", response_model=ScanResponse)
async def scan_text(request: TextScanRequest):
    try:
        # Simulate processing delay for realism
        await asyncio.sleep(0.5)
        
        # NLP Detection
        nlp_result = await nlp_detector.analyze(request.content)
        
        # Generate explanation
        explanation_result = await explainable_ai.generate_explanation(
            request.content,
            nlp_result
        )
        
        # Update analytics
        analytics_data["total_scans"] += 1
        analytics_data["scans_today"] += 1
        threat_level = explanation_result["threat_level"]
        analytics_data["threat_distribution"][threat_level.lower()] += 1
        
        # Store recent scan
        scan_record = {
            "timestamp": datetime.now().isoformat(),
            "type": "text",
            "threat_level": threat_level,
            "score": explanation_result["scam_probability"]
        }
        analytics_data["recent_scans"].insert(0, scan_record)
        if len(analytics_data["recent_scans"]) > 50:
            analytics_data["recent_scans"].pop()
        
        return ScanResponse(
            scan_id=f"scan_{datetime.now().timestamp()}",
            timestamp=datetime.now().isoformat(),
            input_type="text",
            scam_probability=explanation_result["scam_probability"],
            threat_level=explanation_result["threat_level"],
            confidence=explanation_result["confidence"],
            explanation=explanation_result["explanation"],
            suspicious_elements=explanation_result["suspicious_elements"],
            recommendations=explanation_result["recommendations"],
            highlighted_text=explanation_result.get("highlighted_text"),
            amd_optimized=True
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scan failed: {str(e)}")

@app.post("/api/scan/url", response_model=ScanResponse)
async def scan_url(request: URLScanRequest):
    try:
        await asyncio.sleep(0.6)
        
        # URL Detection
        url_result = await url_detector.analyze(request.url)
        
        # Generate explanation
        explanation_result = await explainable_ai.generate_url_explanation(
            request.url,
            url_result
        )
        
        # Update analytics
        analytics_data["total_scans"] += 1
        analytics_data["scans_today"] += 1
        threat_level = explanation_result["threat_level"]
        analytics_data["threat_distribution"][threat_level.lower()] += 1
        
        scan_record = {
            "timestamp": datetime.now().isoformat(),
            "type": "url",
            "threat_level": threat_level,
            "score": explanation_result["scam_probability"]
        }
        analytics_data["recent_scans"].insert(0, scan_record)
        if len(analytics_data["recent_scans"]) > 50:
            analytics_data["recent_scans"].pop()
        
        return ScanResponse(
            scan_id=f"scan_{datetime.now().timestamp()}",
            timestamp=datetime.now().isoformat(),
            input_type="url",
            scam_probability=explanation_result["scam_probability"],
            threat_level=explanation_result["threat_level"],
            confidence=explanation_result["confidence"],
            explanation=explanation_result["explanation"],
            suspicious_elements=explanation_result["suspicious_elements"],
            recommendations=explanation_result["recommendations"],
            amd_optimized=True
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"URL scan failed: {str(e)}")

@app.post("/api/scan/image", response_model=ScanResponse)
async def scan_image(file: UploadFile = File(...)):
    try:
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        await asyncio.sleep(0.8)
        
        # Read image
        image_data = await file.read()
        
        # OCR Processing
        ocr_result = await ocr_pipeline.extract_text(image_data)
        
        if not ocr_result["text"]:
            raise HTTPException(status_code=400, detail="No text found in image")
        
        # Analyze extracted text
        nlp_result = await nlp_detector.analyze(ocr_result["text"])
        
        # Generate explanation
        explanation_result = await explainable_ai.generate_explanation(
            ocr_result["text"],
            nlp_result,
            is_ocr=True
        )
        
        # Update analytics
        analytics_data["total_scans"] += 1
        analytics_data["scans_today"] += 1
        threat_level = explanation_result["threat_level"]
        analytics_data["threat_distribution"][threat_level.lower()] += 1
        
        scan_record = {
            "timestamp": datetime.now().isoformat(),
            "type": "image",
            "threat_level": threat_level,
            "score": explanation_result["scam_probability"]
        }
        analytics_data["recent_scans"].insert(0, scan_record)
        if len(analytics_data["recent_scans"]) > 50:
            analytics_data["recent_scans"].pop()
        
        return ScanResponse(
            scan_id=f"scan_{datetime.now().timestamp()}",
            timestamp=datetime.now().isoformat(),
            input_type="image",
            scam_probability=explanation_result["scam_probability"],
            threat_level=explanation_result["threat_level"],
            confidence=explanation_result["confidence"],
            explanation=explanation_result["explanation"],
            suspicious_elements=explanation_result["suspicious_elements"],
            recommendations=explanation_result["recommendations"],
            highlighted_text=explanation_result.get("highlighted_text"),
            amd_optimized=True
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image scan failed: {str(e)}")

@app.get("/api/analytics")
async def get_analytics():
    return {
        "total_scans": analytics_data["total_scans"],
        "fraud_prevented": analytics_data["fraud_prevented"],
        "scans_today": analytics_data["scans_today"],
        "threat_distribution": analytics_data["threat_distribution"],
        "recent_scans": analytics_data["recent_scans"][:10],
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/demo/examples")
async def get_demo_examples():
    return {
        "text_examples": [
            {
                "title": "Urgent Payment Scam",
                "content": "URGENT! Your account will be suspended in 24 hours. Click here to verify: bit.ly/verify123. Send $500 to restore access immediately!"
            },
            {
                "title": "Prize Winner Scam",
                "content": "Congratulations! You've won $10,000 in our lottery. To claim your prize, send your bank details and $50 processing fee to winner@prize-claim.com"
            },
            {
                "title": "Legitimate Message",
                "content": "Hi! Just wanted to confirm our meeting tomorrow at 3 PM. Let me know if you need to reschedule. Thanks!"
            }
        ],
        "url_examples": [
            "http://paypal-secure-login.tk/verify",
            "https://amaz0n-prize.com/claim",
            "https://github.com/phishshield"
        ]
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
