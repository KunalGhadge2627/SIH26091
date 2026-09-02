from pydantic import BaseModel
from typing import List, Dict

class CompetitorBreakdown(BaseModel):
    band_0_2km: int
    band_2_5km: int
    band_5_10km: int
    total_competitors: int

class NamedCompetitor(BaseModel):
    name: str
    distance_km: float
    subcategory: str

class VillageBusinessStatsModel(BaseModel):
    village_id: str
    category: str
    relevant_population: int
    target_households: int
    relevant_workers: int
    competitor_breakdown: CompetitorBreakdown
    named_competitors: List[NamedCompetitor]
    infrastructure_signals: Dict[str, str]  # e.g., {"road": "Good", "power": "18h/day", "cold_chain": "Available"}
    category_demand_proxy: Dict[str, float] # e.g., {"livestock_count": 450}
    demand_level: str  # High, Moderate, Low
    supply_gap_level: str # High, Moderate, Low
    repeat_purchase_likelihood: str # High, Medium, Low
    evidence_confidence: int  # 80-95
    sources: List[str]

class VillageBusinessStatsResponse(VillageBusinessStatsModel):
    pass
