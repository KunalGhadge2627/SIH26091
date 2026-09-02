from pydantic import BaseModel
from typing import List, Optional

class LegalOfficeModel(BaseModel):
    office_id: str
    name: str
    address: str
    phone: str
    district: str
    state: str
    latitude: float
    longitude: float
    services_offered: List[str]
    office_type: str

class LegalOfficeResponse(LegalOfficeModel):
    distance_km: Optional[float] = None

class DocumentChecklistResponse(BaseModel):
    category: str
    document_list: List[str]
    regulatory_requirements: List[str]
