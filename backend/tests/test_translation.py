import pytest
from app.services.translation import translate_text, translate_batch, translate_report_payload, SUPPORTED_LANGUAGES

def test_supported_languages_count():
    # Exactly 8 languages supported: English base + 7 Indic languages (or 9 total in dict)
    assert "en" in SUPPORTED_LANGUAGES
    assert "hi" in SUPPORTED_LANGUAGES
    assert "mr" in SUPPORTED_LANGUAGES
    assert "ta" in SUPPORTED_LANGUAGES
    assert "te" in SUPPORTED_LANGUAGES
    assert "kn" in SUPPORTED_LANGUAGES
    assert "bn" in SUPPORTED_LANGUAGES
    assert "gu" in SUPPORTED_LANGUAGES
    assert "pa" in SUPPORTED_LANGUAGES

def test_translate_english_pivot():
    text = "Proceed after preparation"
    # English pivot should return text unchanged
    assert translate_text(text, "en") == text

def test_translate_text_fallback():
    text = "Dairy"
    hi_trans = translate_text(text, "hi")
    assert hi_trans == "डेयरी व्यवसाय"

def test_translate_batch():
    texts = ["Dairy", "Poultry"]
    batch_res = translate_batch(texts, "hi")
    assert len(batch_res) == 2
    assert batch_res[0] == "डेयरी व्यवसाय"

def test_translate_report_payload_keeps_numbers():
    report = {
        "assessment_id": "ASM_123456",
        "status": "complete",
        "computed_scores": {
            "overall_score": 78,
            "verdict_title": "Proceed",
            "positive_factors": ["High demand"],
            "attention_areas": ["Requires skill"]
        },
        "computed_finance": {
            "project_cost": 200000.0,
            "monthly_emi": 3450.0
        }
    }
    
    translated = translate_report_payload(report, "hi")
    
    # Numbers and IDs must remain identical
    assert translated["assessment_id"] == "ASM_123456"
    assert translated["computed_scores"]["overall_score"] == 78
    assert translated["computed_finance"]["project_cost"] == 200000.0
    assert translated["computed_finance"]["monthly_emi"] == 3450.0
    
    # Text factors are translated
    assert translated["computed_scores"]["verdict_title"] == "आगे बढ़ें"
