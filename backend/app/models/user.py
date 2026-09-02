from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime, timezone

SUPPORTED_LANGUAGES = ["en", "hi", "mr", "ta", "te", "kn", "bn", "gu"]

class UserSignup(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    mobile: str = Field(..., min_length=10, max_length=15)
    email: EmailStr
    password: str = Field(..., min_length=6)
    preferred_language: str = "en"
    state: str = "Maharashtra"
    district: str = "Pune"
    age_group: Optional[str] = "25-34"
    education: Optional[str] = "Secondary"
    occupation: Optional[str] = "Self-employed"
    business_experience: Optional[str] = "0-2 years"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    full_name: str
    mobile: str
    email: EmailStr
    preferred_language: str
    state: str
    district: str
    age_group: Optional[str] = None
    education: Optional[str] = None
    occupation: Optional[str] = None
    business_experience: Optional[str] = None
    created_at: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
