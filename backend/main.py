from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from datetime import datetime
import google.generativeai as genai
import os
from typing import Literal
import base64
from PIL import Image
import io
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="GovSense API", version="1.0.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable is required")

genai.configure(api_key=GEMINI_API_KEY)

# Models
text_model = genai.GenerativeModel('gemini-2.0-flash')
vision_model = genai.GenerativeModel('gemini-2.0-flash')


class TextInput(BaseModel):
    text: str = Field(..., min_length=1, max_length=2000)


class ClassificationResponse(BaseModel):
    classification: Literal["constructive", "neutral", "hate_speech", "unrelated"]
    confidence: float = Field(..., ge=0.0, le=1.0)
    explanation: str
    raw_output: str
    timestamp: str


@app.on_event("startup")
async def startup_event():
    """Initialize API on startup"""
    print("🚀 GovSense API started successfully")
    print(f"📅 Server time: {datetime.now().isoformat()}")


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "online",
        "service": "GovSense API",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    }


@app.post("/classify_text", response_model=ClassificationResponse)
async def classify_text(input_data: TextInput):
    """
    Classify text as constructive, neutral, hate_speech, or unrelated
    """
    try:
        # Build structured prompt
        prompt = f"""Analyze the following text and classify it into ONE of these categories:
- constructive: Content that offers criticism or suggestions to improve government services or policies
- neutral: Factual statements or questions without strong sentiment
- hate_speech: Content containing threats, slurs, or hateful rhetoric toward government institutions or officials
- unrelated: Content not related to government or public policy

Text to analyze: "{input_data.text}"

Respond in this EXACT format:
CLASSIFICATION: [category]
CONFIDENCE: [0.0-1.0]
EXPLANATION: [brief reasoning in one sentence]
"""

        # Send to Gemini
        response = text_model.generate_content(prompt)
        raw_output = response.text

        # Parse response
        lines = raw_output.strip().split('\n')
        classification = None
        confidence = 0.0
        explanation = ""

        for line in lines:
            if line.startswith("CLASSIFICATION:"):
                classification = line.split(":", 1)[1].strip().lower()
            elif line.startswith("CONFIDENCE:"):
                try:
                    confidence = float(line.split(":", 1)[1].strip())
                except ValueError:
                    confidence = 0.75  # Default confidence
            elif line.startswith("EXPLANATION:"):
                explanation = line.split(":", 1)[1].strip()

        # Validate classification
        valid_classifications = ["constructive", "neutral", "hate_speech", "unrelated"]
        if classification not in valid_classifications:
            # Fallback: try to extract from raw output
            raw_lower = raw_output.lower()
            for cat in valid_classifications:
                if cat in raw_lower:
                    classification = cat
                    break
            if classification not in valid_classifications:
                classification = "neutral"

        if not explanation:
            explanation = raw_output[:200]  # Use first 200 chars if parsing fails

        return ClassificationResponse(
            classification=classification,
            confidence=min(max(confidence, 0.0), 1.0),
            explanation=explanation,
            raw_output=raw_output,
            timestamp=datetime.now().isoformat()
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Classification error: {str(e)}")


@app.post("/classify_image", response_model=ClassificationResponse)
async def classify_image(file: UploadFile = File(...)):
    """
    Classify image content as constructive, neutral, hate_speech, or unrelated
    """
    try:
        # Validate file type
        allowed_types = ["image/jpeg", "image/jpg", "image/png"]
        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail="Invalid image format. Only JPG and PNG are supported."
            )

        # Read and validate file size (5MB limit)
        contents = await file.read()
        if len(contents) > 5 * 1024 * 1024:
            raise HTTPException(
                status_code=400,
                detail="Image size exceeds 5MB limit."
            )

        # Open image
        image = Image.open(io.BytesIO(contents))

        # Build prompt for vision model
        prompt = """Analyze this image and classify it into ONE of these categories:
- constructive: Image contains text, symbols, or content offering criticism or suggestions to improve government
- neutral: Image shows factual content or neutral government-related imagery
- hate_speech: Image contains slurs, threats, hateful symbols, or offensive gestures directed at government
- unrelated: Image is not related to government or public policy

Respond in this EXACT format:
CLASSIFICATION: [category]
CONFIDENCE: [0.0-1.0]
EXPLANATION: [brief description of what you see and why you classified it this way]
"""

        # Send to Gemini Vision
        response = vision_model.generate_content([prompt, image])
        raw_output = response.text

        # Parse response
        lines = raw_output.strip().split('\n')
        classification = None
        confidence = 0.0
        explanation = ""

        for line in lines:
            if line.startswith("CLASSIFICATION:"):
                classification = line.split(":", 1)[1].strip().lower()
            elif line.startswith("CONFIDENCE:"):
                try:
                    confidence = float(line.split(":", 1)[1].strip())
                except ValueError:
                    confidence = 0.75
            elif line.startswith("EXPLANATION:"):
                explanation = line.split(":", 1)[1].strip()

        # Validate classification
        valid_classifications = ["constructive", "neutral", "hate_speech", "unrelated"]
        if classification not in valid_classifications:
            raw_lower = raw_output.lower()
            for cat in valid_classifications:
                if cat in raw_lower:
                    classification = cat
                    break
            if classification not in valid_classifications:
                classification = "neutral"

        if not explanation:
            explanation = raw_output[:200]

        return ClassificationResponse(
            classification=classification,
            confidence=min(max(confidence, 0.0), 1.0),
            explanation=explanation,
            raw_output=raw_output,
            timestamp=datetime.now().isoformat()
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image classification error: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
