import pytest
from app.services.finance import (
    select_scheme, calculate_margin_and_loan, calculate_emi, calculate_affordability
)

def test_select_scheme_micro_finance():
    scheme = select_scheme(120000.0)
    assert scheme["scheme_id"] == "scheme_micro_finance"
    assert scheme["interest_rate_pa"] == 6.5
    assert scheme["tenure_years"] == 3
    assert scheme["moratorium_months"] == 3

def test_select_scheme_term_loan():
    scheme = select_scheme(300000.0)
    assert scheme["scheme_id"] == "scheme_term_loan"
    assert scheme["interest_rate_pa"] == 8.0
    assert scheme["tenure_years"] == 7
    assert scheme["moratorium_months"] == 6

def test_calculate_margin_and_loan():
    # Micro finance: project cost ₹1,00,000, margin available ₹15,000
    res = calculate_margin_and_loan(100000.0, 15000.0)
    assert res["required_margin"] == 10000.0
    assert res["loan_amount"] == 90000.0
    assert res["is_margin_sufficient"] is True
    assert res["margin_deficit"] == 0.0

def test_calculate_margin_and_loan_insufficient():
    res = calculate_margin_and_loan(200000.0, 10000.0)
    assert res["required_margin"] == 20000.0
    assert res["is_margin_sufficient"] is False
    assert res["margin_deficit"] == 10000.0

def test_calculate_emi_reducing_balance_with_moratorium():
    # Principal ₹1,00,000, 10% rate, 3 years tenure, 3 months moratorium
    res = calculate_emi(100000.0, 10.0, 3, 3)
    assert res["principal"] == 100000.0
    assert res["moratorium_interest"] == 2500.0  # 100,000 * 0.10 * (3/12)
    assert res["repayment_principal"] == 102500.0
    assert res["monthly_emi"] > 0
    assert res["repayment_months"] == 33

def test_calculate_affordability_bands():
    good_res = calculate_affordability(3000.0, 1000.0, 5000.0, implied_capacity=25000.0)
    assert good_res["affordability_band"] == "Good"
    
    mod_res = calculate_affordability(6000.0, 2000.0, 6000.0, implied_capacity=25000.0)
    assert mod_res["affordability_band"] == "Moderate"
    
    poor_res = calculate_affordability(10000.0, 5000.0, 8000.0, implied_capacity=25000.0)
    assert poor_res["affordability_band"] == "Poor"
