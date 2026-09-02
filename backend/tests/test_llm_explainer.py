import pytest
from app.services.llm_explainer import (
    generate_score_narrative, generate_swot, generate_improvement_actions,
    generate_financial_literacy_notes, generate_90_day_plan, generate_alternative_blurb,
    READINESS_POINT_VALUES
)

def test_generate_score_narrative_grounded():
    evidence = {
        "category": "Dairy",
        "verdict_title": "Proceed after preparation",
        "positive_factors": ["High market demand", "Good road connectivity"],
        "attention_areas": ["Needs cold chain access"]
    }
    narrative = generate_score_narrative(evidence)
    assert len(narrative) > 10
    assert isinstance(narrative, str)

def test_generate_swot_structure():
    evidence = {
        "category": "Poultry",
        "positive_factors": ["High demand", "Good market access"],
        "attention_areas": ["Feed cost fluctuations"]
    }
    swot = generate_swot(evidence)
    assert "strengths" in swot
    assert "weaknesses" in swot
    assert "opportunities" in swot
    assert "threats" in swot
    assert isinstance(swot["strengths"], list)
    assert len(swot["strengths"]) >= 1

def test_improvement_actions_deterministic_point_values():
    gaps = {
        "experience": 40.0,  # Below 80 threshold
        "skill": 95.0,        # Satisfied
        "resources": 45.0,    # Below 80 threshold
        "supplier": 40.0,     # Below 80 threshold
        "customer": 90.0,     # Satisfied
        "financial_preparedness": 30.0 # Below 80 threshold
    }
    actions = generate_improvement_actions(gaps, "Tailoring")
    assert len(actions) == 4
    
    dims_found = [a["dimension"].lower() for a in actions]
    assert "experience" in dims_found
    assert "resources" in dims_found
    
    # Verify point values are derived strictly from READINESS_POINT_VALUES lookup table
    for act in actions:
        dim_key = act["dimension"].lower().replace(" ", "_")
        assert act["impact_points"] == READINESS_POINT_VALUES[dim_key]

def test_generate_financial_literacy_notes():
    snapshot = {
        "monthly_emi": 3500.0,
        "project_cost": 200000.0,
        "affordability_band": "Good"
    }
    notes = generate_financial_literacy_notes(snapshot)
    assert "financial_notes" in notes
    assert "explainer_cards" in notes
    assert len(notes["explainer_cards"]) == 4

def test_generate_90_day_plan_phases():
    plan = generate_90_day_plan("Flour Mill", {}, {})
    assert "days_1_30" in plan
    assert "days_31_60" in plan
    assert "days_61_90" in plan
    assert len(plan["days_1_30"]) >= 2

def test_generate_alternative_blurb():
    alt_item = {
        "category": "Dairy",
        "display_name": "Dairy Farming",
        "market_fit_score": 90.0,
        "capital_fit_score": 85.0
    }
    blurb = generate_alternative_blurb(alt_item)
    assert "Dairy" in blurb or "dairy" in blurb.lower()
