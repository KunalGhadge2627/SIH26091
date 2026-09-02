import pytest
from app.services.scoring import (
    calculate_market_score, calculate_readiness_score, calculate_financial_score,
    calculate_overall_feasibility, rank_business_alternatives
)

def test_calculate_readiness_excludes_education():
    # Test two users with identical skills/experience but different education answers
    ans1 = {
        "experience_years": 2.0,
        "has_relevant_skill": True,
        "has_workspace": True,
        "has_supplier_contacts": False,
        "has_committed_customers": True,
        "emergency_savings": 20000.0,
        "education": "Post Graduate"
    }
    ans2 = {
        "experience_years": 2.0,
        "has_relevant_skill": True,
        "has_workspace": True,
        "has_supplier_contacts": False,
        "has_committed_customers": True,
        "emergency_savings": 20000.0,
        "education": "No Formal Education"
    }
    
    score1 = calculate_readiness_score(ans1)
    score2 = calculate_readiness_score(ans2)
    
    assert score1["score"] == score2["score"]
    assert "education" not in score1["dimension_scores"]

def test_overall_verdict_mapping():
    market_high = {"score": 90.0, "positive_factors": ["High demand"], "attention_areas": []}
    readiness_high = {"score": 85.0, "positive_factors": ["Skilled"], "attention_areas": []}
    financial_high = {"score": 88.0, "positive_factors": ["Good margin"], "attention_areas": []}
    
    overall = calculate_overall_feasibility(market_high, readiness_high, financial_high)
    assert overall["overall_score"] >= 81
    assert overall["verdict_band"] == "Strong"

def test_rank_business_alternatives():
    village = {"name": "Shikrapur"}
    all_stats = {
        "Dairy": {"demand_level": "High", "supply_gap_level": "High"},
        "Poultry": {"demand_level": "Moderate", "supply_gap_level": "Moderate"},
        "Tailoring": {"demand_level": "Low", "supply_gap_level": "Low"},
        "Flour Mill": {"demand_level": "Moderate", "supply_gap_level": "High"},
        "Two-Wheeler Repair": {"demand_level": "High", "supply_gap_level": "Moderate"}
    }
    user_ans = {"has_relevant_skill": True}
    capital = 250000.0
    
    ranked = rank_business_alternatives(village, all_stats, user_ans, capital)
    assert len(ranked) == 5
    # Highest score category should be first
    assert ranked[0]["alternative_score"] >= ranked[4]["alternative_score"]
