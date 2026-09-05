from pydantic import BaseModel, Field
from typing import Optional, Dict

class WorkersBreakdown(BaseModel):
    total: int
    main: int
    marginal: int
    cultivators: int
    agricultural_labourers: int

class VillageAmenities(BaseModel):
    road: bool = True
    electricity: bool = True
    bank: bool = False
    market: bool = True

class VillageModel(BaseModel):
    village_id: str
    lgd_code: str
    census_code: str
    name: str
    gram_panchayat: str
    block: str
    district: str
    state: str
    latitude: float
    longitude: float
    population: int
    households: int
    workers: WorkersBreakdown
    literacy_rate: float
    amenities: VillageAmenities
    data_year: int = 2024
    source: str = "Census & LGD Data"
    sc_population: int = 0
    st_population: int = 0
    literate_population: int = 0
    match_status: str = ""
    
    # Derived fields
    worker_ratio: float = 0.0
    agriculture_share: float = 0.0
    average_household_size: float = 0.0

class VillageResponse(VillageModel):
    distance_km: Optional[float] = None
