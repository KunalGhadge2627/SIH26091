import uuid
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from app.db import get_database
from app.auth.security import get_current_user
from app.models.assessment import (
    AssessmentCreate, AssessmentUpdate, AssessmentResponse, AssessmentModel,
    QuestionnaireAnswers, ComputedScores, ComputedFinance, ComputedExplanation,
    SWOTAnalysis, FinancialLiteracyExplainerCard, BusinessAlternativeItem, ImprovementActionItem
)
from app.services.geo import find_villages_within_radius, find_competitors_within_radius, find_nearest_legal_offices, aggregate_catchment_stats
from app.services.finance import calculate_margin_and_loan, calculate_emi, calculate_affordability, select_scheme
from app.services.scoring import calculate_market_score, calculate_readiness_score, calculate_financial_score, calculate_overall_feasibility, rank_business_alternatives
from app.services.llm_explainer import (
    generate_score_narrative, generate_swot, generate_improvement_actions,
    generate_financial_literacy_notes, generate_90_day_plan, generate_alternative_blurb
)
from app.services.translation import translate_report_payload, translate_batch, translate_text
from app.data.document_checklists import DOCUMENT_CHECKLISTS_DATA
from app.data.mock_villages import MOCK_VILLAGES
from app.data.mock_legal_offices import MOCK_LEGAL_OFFICES
from app.data.mock_business_stats import MOCK_VILLAGE_BUSINESS_STATS


router = APIRouter(prefix="/assessments", tags=["Assessments"])

# Fallback in-memory map & store
MOCK_VILLAGES_MAP = {v["village_id"]: v for v in MOCK_VILLAGES}
IN_MEMORY_ASSESSMENTS = {}

@router.post("", response_model=AssessmentResponse, status_code=status.HTTP_201_CREATED)
async def create_assessment(item: AssessmentCreate, current_user: dict = Depends(get_current_user)):
    db = get_database()
    village = None
    try:
        if db is not None:
            village = await db["villages"].find_one({"village_id": item.village_id})
    except Exception:
        pass
        
    if not village:
        village = MOCK_VILLAGES_MAP.get(item.village_id, MOCK_VILLAGES[0])
        
    asm_id = f"ASM_{uuid.uuid4().hex[:8].upper()}"
    now_iso = datetime.now(timezone.utc).isoformat()
    
    assessment_doc = {
        "id": asm_id,
        "user_id": current_user["id"],
        "status": "draft",
        "village_id": item.village_id,
        "category": item.category,
        "project_cost": item.project_cost or 200000.0,
        "available_margin": item.available_margin or 30000.0,
        "existing_emi": item.existing_emi or 0.0,
        "household_expenses": item.household_expenses or 8000.0,
        "questionnaire_answers": QuestionnaireAnswers().model_dump(),
        "computed_scores": None,
        "computed_finance": None,
        "computed_explanation": None,
        "translations": {},
        "created_at": now_iso,
        "updated_at": now_iso
    }
    
    try:
        if db is not None:
            await db["assessments"].insert_one(assessment_doc)
    except Exception as e:
        print(f"Notice: MongoDB offline during create assessment ({e})")
        
    IN_MEMORY_ASSESSMENTS[asm_id] = assessment_doc
    return AssessmentResponse(**assessment_doc)

@router.get("", response_model=List[AssessmentResponse])
async def list_user_assessments(current_user: dict = Depends(get_current_user)):
    db = get_database()
    items = []
    try:
        if db is not None:
            cursor = db["assessments"].find({"user_id": current_user["id"]}).sort("updated_at", -1)
            items = await cursor.to_list(length=100)
            for it in items:
                it["_id"] = str(it.get("_id"))
    except Exception as e:
        print(f"Notice: MongoDB offline during list assessments ({e})")
        
    if not items:
        user_asms = [a for a in IN_MEMORY_ASSESSMENTS.values() if a["user_id"] == current_user["id"]]
        user_asms.sort(key=lambda x: x["updated_at"], reverse=True)
        items = user_asms
        
    return items

@router.get("/{id}", response_model=AssessmentResponse)
async def get_assessment_by_id(id: str, current_user: dict = Depends(get_current_user)):
    db = get_database()
    asm = None
    try:
        if db is not None:
            asm = await db["assessments"].find_one({"id": id, "user_id": current_user["id"]})
    except Exception:
        pass
        
    if not asm:
        asm = IN_MEMORY_ASSESSMENTS.get(id)
        
    if not asm or asm.get("user_id") != current_user["id"]:
        raise HTTPException(status_code=404, detail=f"Assessment {id} not found")
        
    if "_id" in asm:
        asm["_id"] = str(asm.get("_id"))
    return asm

@router.put("/{id}", response_model=AssessmentResponse)
async def update_assessment(id: str, item: AssessmentUpdate, current_user: dict = Depends(get_current_user)):
    db = get_database()
    asm = None
    try:
        if db is not None:
            asm = await db["assessments"].find_one({"id": id, "user_id": current_user["id"]})
    except Exception:
        pass
        
    if not asm:
        asm = IN_MEMORY_ASSESSMENTS.get(id)
        
    if not asm:
        raise HTTPException(status_code=404, detail=f"Assessment {id} not found")
        
    update_data = {}
    if item.village_id is not None: update_data["village_id"] = item.village_id
    if item.category is not None: update_data["category"] = item.category
    if item.project_cost is not None: update_data["project_cost"] = item.project_cost
    if item.available_margin is not None: update_data["available_margin"] = item.available_margin
    if item.existing_emi is not None: update_data["existing_emi"] = item.existing_emi
    if item.household_expenses is not None: update_data["household_expenses"] = item.household_expenses
    if item.questionnaire_answers is not None: update_data["questionnaire_answers"] = item.questionnaire_answers.model_dump()
    
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    try:
        if db is not None:
            await db["assessments"].update_one({"id": id}, {"$set": update_data})
    except Exception:
        pass
        
    asm.update(update_data)
    IN_MEMORY_ASSESSMENTS[id] = asm
    
    if "_id" in asm:
        asm["_id"] = str(asm.get("_id"))
    return asm

@router.post("/{id}/run", response_model=AssessmentResponse)
async def run_assessment_engine(id: str, current_user: dict = Depends(get_current_user)):
    db = get_database()
    asm = None
    try:
        if db is not None:
            asm = await db["assessments"].find_one({"id": id, "user_id": current_user["id"]})
    except Exception:
        pass
        
    if not asm:
        asm = IN_MEMORY_ASSESSMENTS.get(id)
        
    if not asm:
        raise HTTPException(status_code=404, detail=f"Assessment {id} not found")
        
    village_id = asm["village_id"]
    category = asm["category"]
    project_cost = float(asm["project_cost"])
    available_margin = float(asm["available_margin"])
    existing_emi = float(asm["existing_emi"])
    household_expenses = float(asm["household_expenses"])
    answers = asm.get("questionnaire_answers", {})
    
    village = None
    try:
        if db is not None:
            village = await db["villages"].find_one({"village_id": village_id})
    except Exception:
        pass
        
    if not village:
        village = MOCK_VILLAGES_MAP.get(village_id, MOCK_VILLAGES[0])
        
    stats = None
    try:
        if db is not None:
            stats = await db["village_business_stats"].find_one({"village_id": village_id, "category": category})
    except Exception:
        pass
        
    if not stats:
        stats = next((s for s in MOCK_VILLAGE_BUSINESS_STATS if s["village_id"] == village_id and s["category"] == category), {
            "village_id": village_id,
            "category": category,
            "demand_level": "Moderate",
            "supply_gap_level": "Moderate",
            "repeat_purchase_likelihood": "Medium",
            "infrastructure_signals": {"road": "Good", "power": "18h/day"}
        })
        
    competitor_data = {"band_0_2km": [], "band_2_5km": [], "band_5_10km": [], "total_count": 3}
    try:
        if db is not None:
            competitor_data = await find_competitors_within_radius(db, village["latitude"], village["longitude"], category, radius_km=10.0)
    except Exception:
        pass
    
    # 1. Deterministic Engines Execution
    market_res = calculate_market_score(village, stats, competitor_data)
    readiness_res = calculate_readiness_score(answers)
    financial_res = calculate_financial_score(project_cost, available_margin, existing_emi, household_expenses)
    overall_res = calculate_overall_feasibility(market_res, readiness_res, financial_res)
    
    margin_calc = calculate_margin_and_loan(project_cost, available_margin)
    scheme = margin_calc["scheme"]
    loan_amt = margin_calc["loan_amount"]
    emi_calc = calculate_emi(loan_amt, scheme["interest_rate_pa"], scheme["tenure_years"], scheme["moratorium_months"])
    affordability = calculate_affordability(emi_calc["monthly_emi"], existing_emi, household_expenses)
    
    # 2. Intelligence Layer Execution (LLM Explainer)
    evidence_payload = {
        "category": category,
        "village_name": village.get("name", "Village"),
        "verdict_title": overall_res["verdict_title"],
        "positive_factors": overall_res["positive_factors"],
        "attention_areas": overall_res["attention_areas"],
        "market_score": overall_res["market_score"],
        "readiness_score": overall_res["readiness_score"],
        "financial_score": overall_res["financial_score"]
    }
    
    financial_snapshot = {
        "monthly_emi": emi_calc["monthly_emi"],
        "project_cost": project_cost,
        "affordability_band": affordability["affordability_band"]
    }
    
    narrative_text = generate_score_narrative(evidence_payload)
    swot_dict = generate_swot(evidence_payload)
    fin_notes = generate_financial_literacy_notes(financial_snapshot)
    p90_dict = generate_90_day_plan(category, readiness_res.get("dimension_scores", {}), evidence_payload)
    
    computed_scores = ComputedScores(
        market_score=overall_res["market_score"],
        readiness_score=overall_res["readiness_score"],
        financial_score=overall_res["financial_score"],
        overall_score=overall_res["overall_score"],
        verdict_band=overall_res["verdict_band"],
        verdict_title=overall_res["verdict_title"],
        positive_factors=overall_res["positive_factors"],
        attention_areas=overall_res["attention_areas"]
    )
    
    computed_finance = ComputedFinance(
        scheme_id=scheme["scheme_id"],
        scheme_name=scheme["name"],
        project_cost=project_cost,
        max_loan_allowed=scheme["max_loan_amount"],
        margin_required=margin_calc["required_margin"],
        margin_available=available_margin,
        loan_amount=loan_amt,
        interest_rate_pa=scheme["interest_rate_pa"],
        tenure_years=scheme["tenure_years"],
        moratorium_months=scheme["moratorium_months"],
        monthly_emi=emi_calc["monthly_emi"],
        affordability_band=affordability["affordability_band"],
        disposable_income_ratio=affordability["disposable_ratio"]
    )
    
    computed_explanation = ComputedExplanation(
        score_narrative=narrative_text,
        swot=SWOTAnalysis(**swot_dict),
        financial_notes=fin_notes["financial_notes"],
        explainer_cards=[FinancialLiteracyExplainerCard(**c) for c in fin_notes["explainer_cards"]],
        plan_90_days=p90_dict
    )
    
    update_doc = {
        "status": "complete",
        "computed_scores": computed_scores.model_dump(),
        "computed_finance": computed_finance.model_dump(),
        "computed_explanation": computed_explanation.model_dump(),
        "translations": {},
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    try:
        if db is not None:
            await db["assessments"].update_one({"id": id}, {"$set": update_doc})
    except Exception:
        pass
        
    asm.update(update_doc)
    IN_MEMORY_ASSESSMENTS[id] = asm
    
    if "_id" in asm:
        asm["_id"] = str(asm.get("_id"))
    return asm

@router.get("/{id}/report")
async def get_assessment_report(
    id: str,
    lang: str = Query("en", description="Target Language Code"),
    current_user: dict = Depends(get_current_user)
):
    db = get_database()
    asm = None
    try:
        if db is not None:
            asm = await db["assessments"].find_one({"id": id, "user_id": current_user["id"]})
    except Exception:
        pass
        
    if not asm:
        asm = IN_MEMORY_ASSESSMENTS.get(id)
        
    if not asm:
        raise HTTPException(status_code=404, detail=f"Assessment {id} not found")
        
    village = MOCK_VILLAGES_MAP.get(asm["village_id"], MOCK_VILLAGES[0])
    stats = next((s for s in MOCK_VILLAGE_BUSINESS_STATS if s["village_id"] == asm["village_id"] and s["category"] == asm["category"]), MOCK_VILLAGE_BUSINESS_STATS[0])
    
    base_report = {
        "assessment_id": asm["id"],
        "status": asm["status"],
        "village": village,
        "category": asm["category"],
        "computed_scores": asm.get("computed_scores"),
        "computed_finance": asm.get("computed_finance"),
        "computed_explanation": asm.get("computed_explanation"),
        "market_stats": stats,
        "created_at": asm["created_at"],
        "updated_at": asm["updated_at"]
    }
    
    if lang == "en":
        return base_report
        
    return translate_report_payload(base_report, lang)

@router.get("/{id}/market-map")
async def get_assessment_market_map(id: str, current_user: dict = Depends(get_current_user)):
    db = get_database()
    asm = None
    try:
        if db is not None:
            asm = await db["assessments"].find_one({"id": id, "user_id": current_user["id"]})
    except Exception:
        pass
        
    if not asm:
        asm = IN_MEMORY_ASSESSMENTS.get(id)
        
    if not asm:
        raise HTTPException(status_code=404, detail=f"Assessment {id} not found")
        
    village = MOCK_VILLAGES_MAP.get(asm["village_id"], MOCK_VILLAGES[0])
    
    return {
        "center_village": village,
        "catchment_radius_km": 10.0,
        "nearby_villages": [village],
        "competitor_breakdown": {
            "band_0_2km": [],
            "band_2_5km": [],
            "band_5_10km": [],
            "total_count": 2
        },
        "catchment_stats": {
            "catchment_village_count": 1,
            "total_population": village.get("population", 12000),
            "total_households": village.get("households", 2500),
            "total_workers": 5000
        }
    }

@router.get("/{id}/alternatives", response_model=List[BusinessAlternativeItem])
async def get_assessment_alternatives(
    id: str,
    lang: str = Query("en"),
    current_user: dict = Depends(get_current_user)
):
    asm = IN_MEMORY_ASSESSMENTS.get(id)
    if not asm:
        db = get_database()
        try:
            if db is not None:
                asm = await db["assessments"].find_one({"id": id})
        except Exception:
            pass
            
    if not asm:
        asm = {
            "id": id, "village_id": "VIL_270001", "category": "Dairy",
            "available_margin": 50000.0, "project_cost": 350000.0, "questionnaire_answers": {}
        }
        
    village = MOCK_VILLAGES_MAP.get(asm.get("village_id"), MOCK_VILLAGES[0])
    all_stats_map = {s["category"]: s for s in MOCK_VILLAGE_BUSINESS_STATS if s["village_id"] == village["village_id"]}
    
    answers = asm.get("questionnaire_answers", {})
    capital = float(asm.get("available_margin", 30000.0)) + float(asm.get("project_cost", 200000.0)) * 0.2
    
    ranked_alternatives = rank_business_alternatives(village, all_stats_map, answers, capital)
    
    for alt in ranked_alternatives:
        alt["explanation_blurb"] = generate_alternative_blurb(alt)
        if lang != "en":
            alt["explanation_blurb"] = translate_text(alt["explanation_blurb"], lang)
            alt["display_name"] = translate_text(alt["display_name"], lang)
            alt["status_label"] = translate_text(alt["status_label"], lang)
            
    return ranked_alternatives

@router.get("/{id}/improvement-plan", response_model=List[ImprovementActionItem])
async def get_assessment_improvement_plan(
    id: str,
    lang: str = Query("en"),
    current_user: dict = Depends(get_current_user)
):
    asm = IN_MEMORY_ASSESSMENTS.get(id)
    if not asm:
        db = get_database()
        try:
            if db is not None:
                asm = await db["assessments"].find_one({"id": id})
        except Exception:
            pass
            
    if not asm:
        asm = {"category": "Dairy", "questionnaire_answers": {}, "action_item_statuses": {}}
        
    answers = asm.get("questionnaire_answers", {})
    readiness_res = calculate_readiness_score(answers)
    gaps = readiness_res.get("dimension_scores", {})
    
    raw_actions = generate_improvement_actions(gaps, asm.get("category", "Dairy"))
    saved_statuses = asm.get("action_item_statuses", {})
    
    items = []
    for idx, a in enumerate(raw_actions):
        act_key = a["dimension"].lower().replace(" ", "_")
        status_val = saved_statuses.get(act_key, a["current_status"])
        item = ImprovementActionItem(
            dimension=a["dimension"],
            title=translate_text(a["title"], lang) if lang != "en" else a["title"],
            description=translate_text(a["description"], lang) if lang != "en" else a["description"],
            impact_points=a["impact_points"],
            current_status=status_val
        )
        items.append(item)
        
    return items

@router.put("/{id}/improvement-plan/{action_id}")
async def update_improvement_action_status(
    id: str,
    action_id: str,
    payload: dict,
    current_user: dict = Depends(get_current_user)
):
    status_val = payload.get("status", "Pending")
    act_key = action_id.lower().replace(" ", "_")
    
    if id in IN_MEMORY_ASSESSMENTS:
        statuses = IN_MEMORY_ASSESSMENTS[id].get("action_item_statuses", {})
        statuses[act_key] = status_val
        IN_MEMORY_ASSESSMENTS[id]["action_item_statuses"] = statuses
        
    db = get_database()
    try:
        if db is not None:
            await db["assessments"].update_one({"id": id}, {"$set": {f"action_item_statuses.{act_key}": status_val}})
    except Exception:
        pass
        
    return {"status": status_val, "action_id": action_id, "updated": True}

@router.get("/{id}/financial-plan")
async def get_assessment_financial_plan(id: str, current_user: dict = Depends(get_current_user)):
    asm = IN_MEMORY_ASSESSMENTS.get(id)
    if not asm:
        db = get_database()
        try:
            if db is not None:
                asm = await db["assessments"].find_one({"id": id})
        except Exception:
            pass
            
    if not asm:
        asm = {
            "project_cost": 350000.0, "available_margin": 50000.0,
            "existing_emi": 0.0, "household_expenses": 12000.0, "category": "Dairy"
        }
        
    project_cost = float(asm.get("project_cost", 350000.0))
    available_margin = float(asm.get("available_margin", 50000.0))
    existing_emi = float(asm.get("existing_emi", 0.0))
    household_expenses = float(asm.get("household_expenses", 12000.0))
    
    margin_calc = calculate_margin_and_loan(project_cost, available_margin)
    scheme = margin_calc["scheme"]
    loan_amt = margin_calc["loan_amount"]
    emi_calc = calculate_emi(loan_amt, scheme["interest_rate_pa"], scheme["tenure_years"], scheme["moratorium_months"])
    affordability = calculate_affordability(emi_calc["monthly_emi"], existing_emi, household_expenses)
    
    explanation = asm.get("computed_explanation")
    p90 = explanation.get("plan_90_days") if explanation else generate_90_day_plan(asm.get("category", "Dairy"), {}, {})
    
    return {
        "scheme": scheme,
        "financial_summary": {
            "project_cost": project_cost,
            "margin_required": margin_calc["required_margin"],
            "margin_available": available_margin,
            "margin_deficit": margin_calc["margin_deficit"],
            "loan_amount": loan_amt,
            "monthly_emi": emi_calc["monthly_emi"],
            "moratorium_months": scheme["moratorium_months"],
            "moratorium_interest": emi_calc["moratorium_interest"],
            "total_interest": emi_calc["total_interest"],
            "total_repayment": emi_calc["total_repayment"],
            "affordability_band": affordability["affordability_band"],
            "disposable_income_ratio": affordability["disposable_ratio"]
        },
        "execution_milestones_90_days": p90
    }

@router.get("/{id}/legal-offices")
async def get_assessment_legal_offices(id: str, current_user: dict = Depends(get_current_user)):
    category = "Dairy"
    if id in IN_MEMORY_ASSESSMENTS:
        category = IN_MEMORY_ASSESSMENTS[id].get("category", "Dairy")
        
    nearest_offices = MOCK_LEGAL_OFFICES[:3]
    checklist_doc = next((item for item in DOCUMENT_CHECKLISTS_DATA if item["category"] == category), DOCUMENT_CHECKLISTS_DATA[0])
    
    return {
        "nearest_legal_offices": nearest_offices,
        "document_checklist": checklist_doc
    }
