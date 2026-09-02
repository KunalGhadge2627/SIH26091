from pydantic import BaseModel
from typing import Optional

class BusinessModel(BaseModel):
    business_id: str
    name: str
    category: str  # Dairy, Poultry, Tailoring, Flour Mill, Two-Wheeler Repair
    subcategory: str
    latitude: float
    longitude: float
    village_id: str
    source: str = "Mapped Business Data"
    confidence: float = 0.9
    last_updated: str = "2024-01-01"

class BusinessResponse(BusinessModel):
    distance_km: Optional[float] = None
