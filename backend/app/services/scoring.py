from typing import Dict, Any, List
from app.services.finance import calculate_margin_and_loan, calculate_emi, calculate_affordability, select_scheme

CATEGORY_CAPITAL_RANGES = {
    "Dairy": {"min": 300000, "max": 700000},
    "Poultry": {"min": 150000, "max": 400000},
    "Tailoring": {"min": 50000, "max": 200000},
    "Flour Mill": {"min": 200000, "max": 600000},
    "Two-Wheeler Repair": {"min": 100000, "max": 300000}
}

def calculate_market_score(village_data: Dict[str, Any], stats_data: Dict[str, Any], competitor_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Computes Market Feasibility Score (0-100) using weighted features:
    demand 30% + supply-gap 20% + purchasing-power 15% + accessibility 15% + infra 10% + financial-fit 10%
    with distance-weighted competitor penalties.
    """
    positive_factors = []
    attention_areas = []
    
    # 1. Demand Score (30%)
    demand_level = stats_data.get("demand_level", "Moderate")
    demand_score = 90.0 if demand_level == "High" else (70.0 if demand_level == "Moderate" else 45.0)
    if demand_level == "High":
        positive_factors.append(f"High local market demand detected for {stats_data.get('category', 'business')}.")
    else:
        attention_areas.append(f"Moderate/Low local demand demand signal for {stats_data.get('category', 'business')}.")

    # 2. Competitor Pressure & Supply Gap (20%)
    weighted_comp = competitor_data.get("weighted_score", 0.0)
    supply_gap = stats_data.get("supply_gap_level", "Moderate")
    
    if weighted_comp <= 1.0:
        supply_score = 95.0
        positive_factors.append("Low local competitor density within 5km radius.")
    elif weighted_comp <= 3.0:
        supply_score = 75.0
        positive_factors.append("Manageable competition present within catchment radius.")
    else:
        supply_score = 45.0
        attention_areas.append("Significant existing competitor density within 2-5km radius.")
        
    if supply_gap == "High":
        supply_score = min(100.0, supply_score + 10.0)
        positive_factors.append("High local supply gap identified; unmet customer demand.")

    # 3. Purchasing Power Proxy (15%)
    worker_ratio = village_data.get("worker_ratio", 0.4)
    agri_share = village_data.get("agriculture_share", 0.5)
    literacy_rate = village_data.get("literacy_rate", 70.0)
    
    purchasing_score = min(100.0, max(30.0, (worker_ratio * 100 * 0.5) + (literacy_rate * 0.5)))
    if purchasing_score >= 70:
        positive_factors.append(f"Strong economic purchasing power (literacy {literacy_rate}%, worker ratio {int(worker_ratio*100)}%).")
    else:
        attention_areas.append("Lower average household purchasing power in catchment.")

    # 4. Accessibility Score (15%)
    amenities = village_data.get("amenities", {})
    access_score = 50.0
    if amenities.get("road", True): access_score += 25.0
    if amenities.get("market", True): access_score += 25.0
    
    if amenities.get("road", True) and amenities.get("market", True):
        positive_factors.append("Good road connectivity and accessible village market location.")
    else:
        attention_areas.append("Road/market access constraints present.")

    # 5. Infrastructure Score (10%)
    infra_signals = stats_data.get("infrastructure_signals", {})
    infra_score = 70.0
    if "cold_chain" in infra_signals and infra_signals["cold_chain"] == "Available":
        infra_score += 20.0
        positive_factors.append("Cold chain infrastructure accessible.")
    if "power" in infra_signals and "18h" in infra_signals["power"]:
        infra_score += 10.0

    # 6. Financial Fit of Market (10%)
    bank_available = amenities.get("bank", False)
    market_fin_score = 90.0 if bank_available else 65.0
    if bank_available:
        positive_factors.append("Local banking branch present in village.")

    # Weighted final market score
    raw_market_score = (
        0.30 * demand_score +
        0.20 * supply_score +
        0.15 * purchasing_score +
        0.15 * access_score +
        0.10 * infra_score +
        0.10 * market_fin_score
    )
    
    final_market_score = round(min(100.0, max(0.0, raw_market_score)), 1)
    return {
        "score": final_market_score,
        "positive_factors": positive_factors,
        "attention_areas": attention_areas
    }

def calculate_readiness_score(questionnaire_answers: Dict[str, Any]) -> Dict[str, Any]:
    """
    Computes Entrepreneur Readiness Score (0-100) across 6 dimensions:
    Experience, Skill, Resources, Supplier Readiness, Customer Readiness, Financial Preparedness.
    *EDUCATION IS EXPLICITLY EXCLUDED FROM SCORING.*
    """
    positive_factors = []
    attention_areas = []
    
    # Answers map
    exp_years = float(questionnaire_answers.get("experience_years", 0))
    has_skill = bool(questionnaire_answers.get("has_relevant_skill", False))
    has_workspace = bool(questionnaire_answers.get("has_workspace", False))
    has_suppliers = bool(questionnaire_answers.get("has_supplier_contacts", False))
    has_customers = bool(questionnaire_answers.get("has_committed_customers", False))
    savings = float(questionnaire_answers.get("emergency_savings", 0))
    
    # 1. Experience (20%)
    exp_score = 100.0 if exp_years >= 3 else (70.0 if exp_years >= 1 else 40.0)
    if exp_years >= 1:
        positive_factors.append(f"{exp_years} year(s) of relevant business experience.")
    else:
        attention_areas.append("First-time entrepreneur with under 1 year domain experience.")

    # 2. Skill (20%)
    skill_score = 95.0 if has_skill else 40.0
    if has_skill:
        positive_factors.append("Possesses core technical/operational skills for business execution.")
    else:
        attention_areas.append("Skills training or apprentice period recommended before starting.")

    # 3. Resources / Workspace (15%)
    res_score = 95.0 if has_workspace else 45.0
    if has_workspace:
        positive_factors.append("Workspace / land location already identified and secured.")
    else:
        attention_areas.append("Workspace not yet secured; shop rental required.")

    # 4. Supplier Readiness (15%)
    sup_score = 90.0 if has_suppliers else 40.0
    if has_suppliers:
        positive_factors.append("Established contacts with raw material/equipment suppliers.")
    else:
        attention_areas.append("No confirmed raw material suppliers established yet.")

    # 5. Customer Readiness (15%)
    cust_score = 95.0 if has_customers else 45.0
    if has_customers:
        positive_factors.append("Initial customer commitments / buyer linkages confirmed.")
    else:
        attention_areas.append("No pre-committed customers identified yet.")

    # 6. Financial Preparedness / Savings Reserve (15%)
    savings_score = 90.0 if savings >= 15000 else (65.0 if savings > 0 else 30.0)
    if savings >= 10000:
        positive_factors.append(f"Emergency cash reserve of ₹{int(savings):,} available.")
    else:
        attention_areas.append("Limited or zero emergency cash buffer reserve.")

    overall_readiness = (
        0.20 * exp_score +
        0.20 * skill_score +
        0.15 * res_score +
        0.15 * sup_score +
        0.15 * cust_score +
        0.15 * savings_score
    )
    
    return {
        "score": round(min(100.0, max(0.0, overall_readiness)), 1),
        "positive_factors": positive_factors,
        "attention_areas": attention_areas,
        "dimension_scores": {
            "experience": exp_score,
            "skill": skill_score,
            "resources": res_score,
            "supplier": sup_score,
            "customer": cust_score,
            "financial_preparedness": savings_score
        }
    }

def calculate_financial_score(project_cost: float, available_margin: float, existing_emi: float, household_expenses: float) -> Dict[str, Any]:
    """
    Computes Financial Fit Score (0-100) based on margin capital, EMI burden, and affordability band.
    """
    positive_factors = []
    attention_areas = []
    
    margin_calc = calculate_margin_and_loan(project_cost, available_margin)
    scheme = margin_calc["scheme"]
    loan_amount = margin_calc["loan_amount"]
    
    emi_calc = calculate_emi(loan_amount, scheme["interest_rate_pa"], scheme["tenure_years"], scheme["moratorium_months"])
    monthly_emi = emi_calc["monthly_emi"]
    
    affordability = calculate_affordability(monthly_emi, existing_emi, household_expenses)
    band = affordability["affordability_band"]
    
    # 1. Margin adequacy score (40%)
    if margin_calc["is_margin_sufficient"]:
        margin_score = 95.0
        positive_factors.append(f"Available margin (₹{int(available_margin):,}) covers minimum required margin (₹{int(margin_calc['required_margin']):,}).")
    else:
        deficit = margin_calc["margin_deficit"]
        margin_score = max(20.0, 95.0 - (deficit / margin_calc['required_margin'] * 70.0))
        attention_areas.append(f"Margin deficit of ₹{int(deficit):,}. Requires additional savings contribution.")

    # 2. Obligation & Affordability score (60%)
    if band == "Good":
        afford_score = 90.0
        positive_factors.append("Estimated EMI fits comfortably within projected monthly disposable capacity.")
    elif band == "Moderate":
        afford_score = 70.0
        positive_factors.append("EMI is manageable but tight relative to monthly household expenses.")
    else:
        afford_score = 35.0
        attention_areas.append("High debt burden ratio (>60%). Risk of loan default under income stress.")

    fin_score = round(0.40 * margin_score + 0.60 * afford_score, 1)
    
    return {
        "score": fin_score,
        "positive_factors": positive_factors,
        "attention_areas": attention_areas,
        "affordability_band": band,
        "finance_details": {
            "scheme_name": scheme["name"],
            "project_cost": project_cost,
            "loan_amount": loan_amount,
            "required_margin": margin_calc["required_margin"],
            "monthly_emi": monthly_emi,
            "moratorium_months": scheme["moratorium_months"]
        }
    }

def calculate_overall_feasibility(market_res: Dict[str, Any], readiness_res: Dict[str, Any], financial_res: Dict[str, Any]) -> Dict[str, Any]:
    """
    Combines Market (45%), Readiness (30%), Financial (25%) into Overall Feasibility Score (0-100).
    Maps to standard verdict bands.
    """
    m_score = market_res["score"]
    r_score = readiness_res["score"]
    f_score = financial_res["score"]
    
    overall = round(0.45 * m_score + 0.30 * r_score + 0.25 * f_score)
    
    if overall >= 81:
        verdict_band = "Strong"
        verdict_title = "Proceed — High Feasibility"
    elif overall >= 66:
        verdict_band = "Promising"
        verdict_title = "Proceed after preparation — Good Feasibility"
    elif overall >= 51:
        verdict_band = "Moderate"
        verdict_title = "Reconsider scale / business model — Moderate Risk"
    elif overall >= 36:
        verdict_band = "Weak"
        verdict_title = "Consider alternatives — High Operational Risk"
    else:
        verdict_band = "High financial risk"
        verdict_title = "Borrowing not recommended currently — High Financial Risk"

    # Merge factors
    positive_factors = market_res["positive_factors"] + readiness_res["positive_factors"] + financial_res["positive_factors"]
    attention_areas = market_res["attention_areas"] + readiness_res["attention_areas"] + financial_res["attention_areas"]

    return {
        "market_score": m_score,
        "readiness_score": r_score,
        "financial_score": f_score,
        "overall_score": overall,
        "verdict_band": verdict_band,
        "verdict_title": verdict_title,
        "positive_factors": positive_factors,
        "attention_areas": attention_areas
    }

def rank_business_alternatives(
    village_data: Dict[str, Any],
    all_stats: Dict[str, Dict[str, Any]],
    user_answers: Dict[str, Any],
    available_capital: float
) -> List[Dict[str, Any]]:
    """
    Scores all 5 business categories for the given village using 3-part decomposition:
    Market fit, Capital fit, Resource fit (each 0-100), ranked descending.
    """
    categories = ["Dairy", "Poultry", "Tailoring", "Flour Mill", "Two-Wheeler Repair"]
    display_names = {
        "Dairy": "Dairy Farming & Milk Collection",
        "Poultry": "Small-scale Poultry Unit",
        "Tailoring": "Tailoring & Garment Shop",
        "Flour Mill": "Flour Mill (Atta Chakki)",
        "Two-Wheeler Repair": "Two-Wheeler Workshop"
    }
    
    ranked_results = []
    
    for cat in categories:
        stats = all_stats.get(cat, {})
        cap_range = CATEGORY_CAPITAL_RANGES.get(cat, {"min": 100000, "max": 300000})
        
        # 1. Market Fit (0-100)
        d_level = stats.get("demand_level", "Moderate")
        m_fit = 90.0 if d_level == "High" else (70.0 if d_level == "Moderate" else 45.0)
        if stats.get("supply_gap_level") == "High":
            m_fit = min(100.0, m_fit + 10.0)
            
        # 2. Capital Fit (0-100)
        req_min = cap_range["min"]
        if available_capital >= req_min:
            c_fit = 95.0
        else:
            ratio = available_capital / req_min if req_min > 0 else 0
            c_fit = max(20.0, ratio * 90.0)
            
        # 3. Resource / Skill Fit (0-100)
        has_skill = bool(user_answers.get("has_relevant_skill", False))
        r_fit = 90.0 if has_skill else 55.0
        
        alt_score = round(0.40 * m_fit + 0.35 * c_fit + 0.25 * r_fit)
        
        if alt_score >= 80:
            status = "Strong Fit"
            blurb = f"High demand in {village_data.get('name', 'village')} with adequate capital alignment."
        elif alt_score >= 65:
            status = "Promising"
            blurb = f"Good market demand with moderate setup capital requirement."
        elif alt_score >= 50:
            status = "Moderate"
            blurb = f"Feasible business option but requires capital scale adjustment."
        else:
            status = "Weak"
            blurb = f"Higher capital barrier or lower demand gap in catchment."

        ranked_results.append({
            "category": cat,
            "display_name": display_names[cat],
            "market_fit_score": round(m_fit, 1),
            "capital_fit_score": round(c_fit, 1),
            "resource_fit_score": round(r_fit, 1),
            "alternative_score": alt_score,
            "status_label": status,
            "explanation_blurb": blurb
        })
        
    ranked_results.sort(key=lambda x: x["alternative_score"], reverse=True)
    return ranked_results
