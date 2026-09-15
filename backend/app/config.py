import os
try:
    from pydantic_settings import BaseSettings
    class Settings(BaseSettings):
        PROJECT_NAME: str = "Udyam Gram Backend"
        MONGODB_URL: str = "mongodb://localhost:27017"
        DATABASE_NAME: str = "udyam_gram"
        MOCK_DATA_ZIP: str = os.getenv("MOCK_DATA_ZIP", "")
        SECRET_KEY: str = "udyam_gram_super_secret_jwt_key_change_in_production"
        ALGORITHM: str = "HS256"
        ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
        ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
        LLM_MODEL_NAME: str = os.getenv("LLM_MODEL_NAME", "claude-3-5-sonnet-20241022")
        SARVAM_API_KEY: str = os.getenv("SARVAM_API_KEY", "")
        SARVAM_ENDPOINT: str = os.getenv("SARVAM_ENDPOINT", "https://api.sarvam.ai/translate")
        SARVAM_MODEL: str = os.getenv("SARVAM_MODEL", "sarvam-translate:v1")
        BHASHINI_USER_ID: str = os.getenv("BHASHINI_USER_ID", "")
        BHASHINI_API_KEY: str = os.getenv("BHASHINI_API_KEY", "")
        BHASHINI_INFERENCE_API_KEY: str = os.getenv("BHASHINI_INFERENCE_API_KEY", "")
        BHASHINI_SERVICE_ID: str = os.getenv("BHASHINI_SERVICE_ID", "ai4bharat/indictrans-v2-all-gpu--t4")
        BHASHINI_ENDPOINT: str = os.getenv("BHASHINI_ENDPOINT", "https://dhruva-api.bhashini.gov.in/services/inference/pipeline")

        class Config:
            env_file = ".env"
            extra = "ignore"
except ImportError:
    from pydantic import BaseModel
    class Settings(BaseModel):
        PROJECT_NAME: str = os.getenv("PROJECT_NAME", "Udyam Gram Backend")
        MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
        DATABASE_NAME: str = os.getenv("DATABASE_NAME", "udyam_gram")
        MOCK_DATA_ZIP: str = os.getenv("MOCK_DATA_ZIP", "")
        SECRET_KEY: str = os.getenv("SECRET_KEY", "udyam_gram_super_secret_jwt_key_change_in_production")
        ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
        ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
        ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
        LLM_MODEL_NAME: str = os.getenv("LLM_MODEL_NAME", "claude-3-5-sonnet-20241022")
        SARVAM_API_KEY: str = os.getenv("SARVAM_API_KEY", "")
        SARVAM_ENDPOINT: str = os.getenv("SARVAM_ENDPOINT", "https://api.sarvam.ai/translate")
        SARVAM_MODEL: str = os.getenv("SARVAM_MODEL", "sarvam-translate:v1")
        BHASHINI_USER_ID: str = os.getenv("BHASHINI_USER_ID", "")
        BHASHINI_API_KEY: str = os.getenv("BHASHINI_API_KEY", "")
        BHASHINI_INFERENCE_API_KEY: str = os.getenv("BHASHINI_INFERENCE_API_KEY", "")
        BHASHINI_SERVICE_ID: str = os.getenv("BHASHINI_SERVICE_ID", "ai4bharat/indictrans-v2-all-gpu--t4")
        BHASHINI_ENDPOINT: str = os.getenv("BHASHINI_ENDPOINT", "https://dhruva-api.bhashini.gov.in/services/inference/pipeline")

settings = Settings()
