import json
import logging
from typing import Dict, Any, List
from app.config import settings

logger = logging.getLogger("udyam_gram.llm_explainer")

# Deterministic Point Values Lookup Table for Readiness Gaps
READINESS_POINT_VALUES = {
    "experience": 20,
    "skill": 20,
    "resources": 15,
    "supplier": 15,
    "customer": 15,
    "financial_preparedness": 15
}

STATIC_EXPLAINER_CARDS = [
    {
        "key": "emi_explainer",
        "title": "What is an EMI?",
        "explanation": "Equated Monthly Installment (EMI) is the fixed payment amount made by a borrower to a lender at a specified date each calendar month to pay off both interest and principal over the loan tenure."
    },
    {
        "key": "moratorium_explainer",
        "title": "What is a Moratorium Period?",
        "explanation": "A moratorium is a legal holiday on principal repayments granted during business setup (e.g. 3 to 6 months). Interest accrued during this period is capitalized into the loan principal before monthly EMI repayment begins."
    },
    {
        "key": "repayment_risk_explainer",
        "title": "Understanding Repayment Risk",
        "explanation": "Repayment risk measures the proportion of monthly household disposable income consumed by debt obligations. Keeping total monthly debt payments below 40% ensures financial stability during lean business months."
    },
    {
        "key": "emergency_reserve_explainer",
        "title": "Why Keep an Emergency Cash Reserve?",
        "explanation": "An emergency reserve (3 to 6 months of operating expenses) acts as a financial shock absorber to cover inventory, repair costs, or seasonal sales dips without defaulting on bank loan EMIs."
    }
]

SYSTEM_PROMPT = """You are the Udyam Gram Rural Business Analyst & Explainer.
Your role is strictly as an Analyst and Explainer — NOT a Database, Calculator, or Feasibility Decision-Maker.
Rules:
1. Use ONLY the supplied pre-computed evidence and numbers provided in the input prompt.
2. NEVER invent population figures, competitor counts, scores, EMI values, or scheme rules.
3. Translate already-computed facts into clear, encouraging, plain-language advisory text suitable for a rural entrepreneur in India.
4. Output clean JSON where requested without markdown commentary.
"""

def _call_anthropic_llm(prompt: str) -> str:
    """
    Calls Anthropic API if a valid key is available, returning text response.
    Returns empty string immediately if unconfigured or placeholder key is used.
    """
    api_key = getattr(settings, "ANTHROPIC_API_KEY", "")
    if not api_key or not api_key.startswith("sk-ant"):
        return ""

        
    try:
        import anthropic
        client = anthropic.Anthropic(api_key=api_key)
        response = client.messages.create(
            model=settings.LLM_MODEL_NAME,
            max_tokens=1000,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": prompt}]
        )
        if response and response.content:
            return response.content[0].text.strip()
    except Exception as e:
        logger.warning(f"Anthropic LLM call skipped/failed: {e}")
    return ""

def generate_score_narrative(evidence: dict) -> str:
    """
    Generates a 2-3 sentence plain-language verdict summary line.
    Grounded strictly in pre-computed scores and positive/attention factors.
    """
    verdict = evidence.get("verdict_title", "Assessment Complete")
    positives = evidence.get("positive_factors", [])
    attentions = evidence.get("attention_areas", [])
    
    pos_str = ", ".join(positives[:2]) if positives else "steady market signals"
    att_str = ", ".join(attentions[:2]) if attentions else "operational readiness preparation"
    
    prompt = f"""Generate a concise, encouraging 2-sentence verdict summary for a rural entrepreneur.
Category: {evidence.get('category', 'Business')}
Verdict Title: {verdict}
Positive Factors: {pos_str}
Attention Areas: {att_str}

Summary:"""
    
    llm_resp = _call_anthropic_llm(prompt)
    if llm_resp:
        return llm_resp
        
    # Sensible evidence-grounded fallback
    return f"Your {evidence.get('category', 'business')} feasibility is rated '{verdict}'. Key strengths include {pos_str}. To maximize success, focus on addressing {att_str} before starting operations."

def generate_swot(evidence: dict) -> dict:
    """
    Generates SWOT analysis strictly grounded in market snapshot, readiness, and risk factors.
    """
    positives = evidence.get("positive_factors", [])
    attentions = evidence.get("attention_areas", [])
    category = evidence.get("category", "Business")
    
    prompt = f"""Based on the following facts for a {category} unit, generate a SWOT analysis JSON with 2-3 items in each array:
Positives: {positives}
Attention Areas: {attentions}

Output JSON format:
{{"strengths": [...], "weaknesses": [...], "opportunities": [...], "threats": [...]}}
JSON:"""
    
    llm_resp = _call_anthropic_llm(prompt)
    if llm_resp:
        try:
            parsed = json.loads(llm_resp)
            if isinstance(parsed, dict) and "strengths" in parsed:
                return parsed
        except Exception:
            pass
            
    # Deterministic evidence-based fallback
    return {
        "strengths": positives[:3] if positives else [f"Identified demand for {category} in village catchment", "Accessible local market"],
        "weaknesses": attentions[:3] if attentions else ["Requires additional skill training", "Emergency reserve buffer needed"],
        "opportunities": [f"High repeat demand for daily {category} services in nearby Gram Panchayats", "Government loan subsidy eligibility under scheme"],
        "threats": [f"Competitor pricing pressure in 2-5km radius", "Seasonal raw material price fluctuations"]
    }

def generate_improvement_actions(readiness_gaps: dict, category: str) -> list:
    """
    Generates action items for readiness gaps.
    Point values are strictly pulled from READINESS_POINT_VALUES lookup table.
    """
    action_items = []
    
    dim_titles = {
        "experience": ("Complete 2-Week Domain Apprenticeship", "Shadow an established shop owner in a nearby town to learn practical daily operations."),
        "skill": (f"Enroll in RSETI / Skill India {category} Training", f"Undergo certified technical skill and equipment maintenance training for {category}."),
        "resources": ("Finalize Workspace Lease Agreement", "Secure a roadside workspace location with adequate power fitting and public access."),
        "supplier": ("Confirm 2 Wholesale Supplier Links", "Establish written price quotations and supply delivery commitments with raw material distributors."),
        "customer": ("Gather Pre-orders & Buyer Letters", "Secure initial customer commitments or buyer intent letters from local households."),
        "financial_preparedness": ("Build ₹15,000 Emergency Cash Reserve", "Deposit emergency cash buffer in a liquid bank savings account prior to loan disbursement.")
    }
    
    for dim, pts in READINESS_POINT_VALUES.items():
        score = readiness_gaps.get(dim, 100.0)
        if score < 80.0:
            default_title, default_desc = dim_titles.get(dim, (f"Improve {dim}", f"Strengthen {dim} readiness."))
            action_items.append({
                "dimension": dim.replace("_", " ").title(),
                "title": default_title,
                "description": default_desc,
                "impact_points": pts,
                "current_status": "Pending"
            })
            
    return action_items

def generate_financial_literacy_notes(financial_snapshot: dict) -> dict:
    """
    Generates plain-language financial explanations tailored to the user's figures.
    """
    emi = financial_snapshot.get("monthly_emi", 0.0)
    cost = financial_snapshot.get("project_cost", 0.0)
    band = financial_snapshot.get("affordability_band", "Good")
    
    prompt = f"""Explain in 2 plain-language sentences what a monthly EMI of ₹{int(emi):,} on a ₹{int(cost):,} project cost means for a rural entrepreneur with an affordability rating of '{band}'.
Explanation:"""

    llm_resp = _call_anthropic_llm(prompt)
    narrative = llm_resp if llm_resp else f"Your estimated monthly EMI of ₹{int(emi):,} represents the fixed installment payable post-moratorium. With an affordability rating of '{band}', your projected income capacity covers this obligation safely."
    
    return {
        "financial_notes": narrative,
        "explainer_cards": STATIC_EXPLAINER_CARDS
    }

def generate_90_day_plan(category: str, readiness_gaps: dict, evidence: dict) -> dict:
    """
    Generates a 3-phase 90-day checklist structure: days_1_30, days_31_60, days_61_90.
    """
    return {
        "days_1_30": [
            f"Submit government loan application for {category} setup at local bank branch.",
            "Complete registration on Udyam portal and apply for Gram Panchayat trade NOC.",
            "Finalize shop / workspace rental agreement and inspect power/water connections."
        ],
        "days_31_60": [
            "Receive bank loan sanction order and deposit entrepreneur margin contribution.",
            f"Procure core equipment, machinery, and raw material inventory for {category}.",
            "Install machinery and conduct test trials and safety inspections."
        ],
        "days_61_90": [
            "Distribute launch pamphlets and inform local Gram Panchayat households.",
            f"Official commercial launch of {category} business.",
            "Monitor weekly cash flows and prepare for post-moratorium EMI repayments."
        ]
    }

def generate_alternative_blurb(alt_item: dict) -> str:
    """
    Generates a one-sentence blurb explaining why a business alternative scored the way it did.
    """
    cat = alt_item.get("display_name", alt_item.get("category", "Business"))
    m_score = alt_item.get("market_fit_score", 70)
    c_score = alt_item.get("capital_fit_score", 70)
    
    if m_score >= 80 and c_score >= 80:
        return f"{cat} demonstrates strong local market demand in the village with excellent capital alignment."
    elif m_score >= 70:
        return f"{cat} offers good local demand opportunity, though requiring moderate capital setup adjustment."
    else:
        return f"{cat} represents a viable secondary alternative requiring higher setup capital or specialized skills."
