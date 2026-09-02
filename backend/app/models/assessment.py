from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class QuestionnaireAnswers(BaseModel):
    experience_years: float = 0.0
    has_relevant_skill: bool = False
    has_workspace: bool = False
    has_supplier_contacts: bool = False
    has_committed_customers: bool = False
    emergency_savings: float = 0.0
    category_specific_answers: Dict[str, Any] = Field(default_factory=dict)

class ComputedScores(BaseModel):
    market_score: float
    readiness_score: float
    financial_score: float
    overall_score: int
    verdict_band: str
    verdict_title: str
    positive_factors: List[str]
    attention_areas: List[str]

class ComputedFinance(BaseModel):
    scheme_id: str
    scheme_name: str
    project_cost: float
    max_loan_allowed: float
    margin_required: float
    margin_available: float
    loan_amount: float
    interest_rate_pa: float
    tenure_years: int
    moratorium_months: int
    monthly_emi: float
    affordability_band: str
    disposable_income_ratio: float

class SWOTAnalysis(BaseModel):
    strengths: List[str]
    weaknesses: List[str]
    opportunities: List[str]
    threats: List[str]

class FinancialLiteracyExplainerCard(BaseModel):
    key: str
    title: str
    explanation: str

class ComputedExplanation(BaseModel):
    score_narrative: str
    swot: SWOTAnalysis
    financial_notes: str
    explainer_cards: List[FinancialLiteracyExplainerCard]
    plan_90_days: Dict[str, List[str]]  # days_1_30, days_31_60, days_61_90

class BusinessAlternativeItem(BaseModel):
    category: str
    display_name: str
    market_fit_score: float
    capital_fit_score: float
    resource_fit_score: float
    alternative_score: int
    status_label: str
    explanation_blurb: str

class ImprovementActionItem(BaseModel):
    dimension: str
    title: str
    description: str
    impact_points: int
    current_status: str

class AssessmentCreate(BaseModel):
    village_id: str
    category: str
    project_cost: Optional[float] = 200000.0
    available_margin: Optional[float] = 30000.0
    existing_emi: Optional[float] = 0.0
    household_expenses: Optional[float] = 8000.0

class AssessmentUpdate(BaseModel):
    village_id: Optional[str] = None
    category: Optional[str] = None
    project_cost: Optional[float] = None
    available_margin: Optional[float] = None
    existing_emi: Optional[float] = None
    household_expenses: Optional[float] = None
    questionnaire_answers: Optional[QuestionnaireAnswers] = None

class AssessmentModel(BaseModel):
    id: str
    user_id: str
    status: str = "draft"
    village_id: str
    category: str
    project_cost: float = 200000.0
    available_margin: float = 30000.0
    existing_emi: float = 0.0
    household_expenses: float = 8000.0
    questionnaire_answers: QuestionnaireAnswers = Field(default_factory=QuestionnaireAnswers)
    computed_scores: Optional[ComputedScores] = None
    computed_finance: Optional[ComputedFinance] = None
    computed_explanation: Optional[ComputedExplanation] = None
    translations: Dict[str, Any] = Field(default_factory=dict)
    created_at: str
    updated_at: str

class AssessmentResponse(AssessmentModel):
    pass
