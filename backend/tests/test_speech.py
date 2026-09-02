import pytest
import io
from fastapi.testclient import TestClient
from app.main import app
from app.auth.security import get_current_user

client = TestClient(app)

def test_speech_transcribe_endpoint():
    audio_content = b"RIFF....WAVEfmt ....data...."
    files = {"file": ("test_audio.wav", io.BytesIO(audio_content), "audio/wav")}
    
    mock_user = {
        "id": "USR_TEST",
        "email": "test@example.com",
        "full_name": "Test User"
    }
    
    app.dependency_overrides[get_current_user] = lambda: mock_user
    try:
        headers = {"Authorization": "Bearer mock_token"}
        response = client.post("/speech/transcribe", files=files, headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert "transcript" in data
        assert "detected_language" in data
        assert "confidence" in data
    finally:
        app.dependency_overrides.clear()
