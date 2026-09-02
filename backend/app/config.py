import os
try:
    from pydantic_settings import BaseSettings
    class Settings(BaseSettings):
        PROJECT_NAME: str = "Udyam Gram Backend"
        MONGODB_URL: str = "mongodb://localhost:27017"
        DATABASE_NAME: str = "udyam_gram"
        SECRET_KEY: str = "udyam_gram_super_secret_jwt_key_change_in_production"
        ALGORITHM: str = "HS256"
        ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
        ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
        LLM_MODEL_NAME: str = os.getenv("LLM_MODEL_NAME", "claude-3-5-sonnet-20241022")

        class Config:
            env_file = ".env"
            extra = "ignore"
except ImportError:
    from pydantic import BaseModel
    class Settings(BaseModel):
        PROJECT_NAME: str = os.getenv("PROJECT_NAME", "Udyam Gram Backend")
        MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
        DATABASE_NAME: str = os.getenv("DATABASE_NAME", "udyam_gram")
        SECRET_KEY: str = os.getenv("SECRET_KEY", "udyam_gram_super_secret_jwt_key_change_in_production")
        ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
        ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
        ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
        LLM_MODEL_NAME: str = os.getenv("LLM_MODEL_NAME", "claude-3-5-sonnet-20241022")

settings = Settings()
