from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
from app.auth.security import get_current_user
from app.models.speech import TranscriptionResponse
from app.services.speech import transcribe_audio

router = APIRouter(prefix="/speech", tags=["Speech Recognition"])

@router.post("/transcribe", response_model=TranscriptionResponse)
async def transcribe_speech(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    """
    Accepts uploaded audio file (WAV, MP3, M4A, OGG), runs Whisper transcription,
    and returns detected text and language.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No audio file uploaded")
        
    file_bytes = await file.read()
    result = transcribe_audio(file_bytes, file.filename)
    
    return TranscriptionResponse(
        transcript=result.get("transcript", ""),
        detected_language=result.get("detected_language", "en"),
        confidence=result.get("confidence", 0.95)
    )
