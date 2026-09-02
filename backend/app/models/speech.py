from pydantic import BaseModel
from typing import Optional

class TranscriptionResponse(BaseModel):
    transcript: str
    detected_language: str = "en"
    confidence: Optional[float] = 0.95
