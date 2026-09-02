from pydantic import BaseModel

class SchemeModel(BaseModel):
    scheme_id: str
    name: str
    project_cost_min: float
    project_cost_max: float
    max_loan_pct: float
    max_loan_amount: float
    interest_rate_pa: float
    tenure_years: int
    moratorium_months: int
    description: str

class SchemeResponse(SchemeModel):
    pass
