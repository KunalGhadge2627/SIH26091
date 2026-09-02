import math
from typing import Dict, Any

SCHEME_MICRO_FINANCE = {
    "scheme_id": "scheme_micro_finance",
    "name": "Government Micro Finance Scheme",
    "project_cost_min": 0.0,
    "project_cost_max": 140000.0,
    "max_loan_pct": 0.90,
    "max_loan_amount": 125000.0,
    "interest_rate_pa": 6.5,
    "tenure_years": 3,
    "moratorium_months": 3,
    "description": "Targeted micro-enterprise loan for projects up to ₹1.40 Lakh with 6.5% interest rate and 3-month moratorium."
}

SCHEME_TERM_LOAN = {
    "scheme_id": "scheme_term_loan",
    "name": "Government Rural Term Loan Scheme",
    "project_cost_min": 140000.0,
    "project_cost_max": 5000000.0,
    "max_loan_pct": 0.90,
    "max_loan_amount": 4500000.0,
    "interest_rate_pa": 8.0,
    "tenure_years": 7,
    "moratorium_months": 6,
    "description": "Term loan for project setup between ₹1.40 Lakh and ₹50.00 Lakh with 8% interest rate and 6-month moratorium."
}

def select_scheme(project_cost: float) -> Dict[str, Any]:
    """
    Selects government loan scheme tier based on project cost.
    """
    if project_cost <= 140000.0:
        return SCHEME_MICRO_FINANCE
    else:
        return SCHEME_TERM_LOAN

def calculate_margin_and_loan(project_cost: float, available_margin: float) -> Dict[str, Any]:
    """
    Calculates minimum required margin (min 10%), maximum loan eligibility,
    and checks margin sufficiency.
    """
    scheme = select_scheme(project_cost)
    
    # Standard requirement: entrepreneur contributes at least 10%
    min_margin_ratio = 1.0 - scheme["max_loan_pct"]
    required_margin_by_pct = project_cost * min_margin_ratio
    
    # Calculate loan based on project cost up to scheme cap
    raw_loan_needed = project_cost * scheme["max_loan_pct"]
    actual_loan_amount = min(raw_loan_needed, scheme["max_loan_amount"])
    
    required_margin = max(required_margin_by_pct, project_cost - actual_loan_amount)
    margin_deficit = max(0.0, required_margin - available_margin)
    is_sufficient = available_margin >= required_margin
    
    return {
        "scheme": scheme,
        "project_cost": round(project_cost, 2),
        "required_margin": round(required_margin, 2),
        "available_margin": round(available_margin, 2),
        "loan_amount": round(actual_loan_amount, 2),
        "margin_deficit": round(margin_deficit, 2),
        "is_margin_sufficient": is_sufficient
    }

def calculate_emi(principal: float, annual_rate: float, tenure_years: int, moratorium_months: int) -> Dict[str, Any]:
    """
    Calculates monthly EMI using reducing balance formula post-moratorium.
    Interest accrued during moratorium is added to the principal balance prior
    to repayment period EMI calculation.
    """
    total_months = tenure_years * 12
    repayment_months = total_months - moratorium_months
    
    if repayment_months <= 0 or principal <= 0:
        return {
            "principal": principal,
            "moratorium_interest": 0.0,
            "repayment_principal": principal,
            "monthly_emi": 0.0,
            "total_repayment": 0.0,
            "total_interest": 0.0
        }
        
    monthly_rate = (annual_rate / 100.0) / 12.0
    
    # Simple interest accrual during moratorium
    moratorium_interest = principal * (annual_rate / 100.0) * (moratorium_months / 12.0)
    repayment_principal = principal + moratorium_interest
    
    # EMI formula: P * r * (1+r)^N / ((1+r)^N - 1)
    compound_factor = math.pow(1.0 + monthly_rate, repayment_months)
    monthly_emi = repayment_principal * (monthly_rate * compound_factor) / (compound_factor - 1.0)
    
    total_repayment = monthly_emi * repayment_months
    total_interest = total_repayment - principal
    
    return {
        "principal": round(principal, 2),
        "moratorium_interest": round(moratorium_interest, 2),
        "repayment_principal": round(repayment_principal, 2),
        "monthly_emi": round(monthly_emi, 2),
        "total_repayment": round(total_repayment, 2),
        "total_interest": round(total_interest, 2),
        "repayment_months": repayment_months
    }

def calculate_affordability(estimated_emi: float, existing_emi: float, household_expenses: float, implied_capacity: float = 25000.0) -> Dict[str, Any]:
    """
    Calculates affordability band (Good, Moderate, Poor) based on total debt
    and expense burden relative to disposable capacity.
    """
    total_monthly_obligations = estimated_emi + existing_emi + household_expenses
    ratio = total_monthly_obligations / implied_capacity if implied_capacity > 0 else 1.0
    
    if ratio <= 0.40:
        band = "Good"
        description = "Total monthly obligations (EMI + expenses) are well within safe capacity limit (<40%)."
    elif ratio <= 0.60:
        band = "Moderate"
        description = "Monthly obligations consume 40-60% of estimated household capacity. Manage cash flows tightly."
    else:
        band = "Poor"
        description = "High financial risk: Obligations exceed 60% of capacity. Reduce loan amount or build margin reserves."
        
    return {
        "estimated_emi": round(estimated_emi, 2),
        "existing_emi": round(existing_emi, 2),
        "household_expenses": round(household_expenses, 2),
        "total_obligations": round(total_monthly_obligations, 2),
        "disposable_ratio": round(ratio, 3),
        "affordability_band": band,
        "description": description
    }
