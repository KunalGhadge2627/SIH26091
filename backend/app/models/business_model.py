from pydantic import BaseModel
from typing import List, Dict

class BusinessModelConfig(BaseModel):
    category: str  # Dairy, Poultry, Tailoring, Flour Mill, Two-Wheeler Repair
    display_name: str
    icon_key: str
    description: str
    capital_min: int  # in INR
    capital_max: int  # in INR
    demand_drivers: List[str]
    supply_signals: List[str]
    infrastructure_requirements: List[str]
    risk_factors: List[str]
    scoring_weights: Dict[str, float]

class CategoryResponse(BusinessModelConfig):
    pass
