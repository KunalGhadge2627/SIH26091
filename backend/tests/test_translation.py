import pytest
from app.services import translation
from app.services.translation import translate_text, translate_batch, translate_report_payload, SUPPORTED_LANGUAGES


@pytest.fixture(autouse=True)
def disable_external_translation(monkeypatch):
    monkeypatch.setattr(translation.settings, "SARVAM_API_KEY", "")
    monkeypatch.setattr(translation.settings, "BHASHINI_USER_ID", "")
    monkeypatch.setattr(translation.settings, "BHASHINI_API_KEY", "")
    monkeypatch.setattr(translation.settings, "BHASHINI_INFERENCE_API_KEY", "")


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


def test_sarvam_translation_provider(monkeypatch):
    class FakeResponse:
        def raise_for_status(self):
            return None

        def json(self):
            return {"translated_text": "आगे बढ़ें"}

    class FakeClient:
        def __enter__(self):
            return self

        def __exit__(self, exception_type, exception, traceback):
            return False

        def post(self, endpoint, headers, json):
            assert endpoint == translation.settings.SARVAM_ENDPOINT
            assert headers["api-subscription-key"] == "test-key"
            assert json["source_language_code"] == "en-IN"
            assert json["target_language_code"] == "hi-IN"
            return FakeResponse()

    monkeypatch.setattr(translation.settings, "SARVAM_API_KEY", "test-key")
    monkeypatch.setattr(translation.httpx, "Client", lambda timeout: FakeClient())

    assert translate_text("Proceed", "hi") == "आगे बढ़ें"


def test_improvement_action_fallback_is_localized(monkeypatch):
    monkeypatch.setattr(translation, "translate_with_sarvam", lambda text, language: None)
    monkeypatch.setattr(translation, "translate_with_bhashini", lambda texts, language: None)
    monkeypatch.setattr(translation, "get_indictrans_pipeline", lambda: None)

    assert translate_text("Complete 2-Week Domain Apprenticeship", "hi") == "2 सप्ताह का क्षेत्रीय प्रशिक्षण पूरा करें"
    assert translate_text("Finalize Workspace Lease Agreement", "hi") == "कार्यस्थल का किराया समझौता पूरा करें"
    assert translate_text("Enroll in RSETI / Skill India Dairy Training", "hi") == "RSETI / स्किल इंडिया Dairy प्रशिक्षण में नामांकन करें"


def test_tagged_provider_response_does_not_reach_cards(monkeypatch):
    monkeypatch.setattr(translation, "translate_with_sarvam", lambda text, language: "[Hindi] " + text)
    monkeypatch.setattr(translation, "translate_with_bhashini", lambda texts, language: ["[Hindi] " + text for text in texts])
    monkeypatch.setattr(translation, "get_indictrans_pipeline", lambda: None)

    assert translate_text("Complete 2-Week Domain Apprenticeship", "hi") == "2 सप्ताह का क्षेत्रीय प्रशिक्षण पूरा करें"
    assert translate_batch(["Complete 2-Week Domain Apprenticeship"], "hi") == ["2 सप्ताह का क्षेत्रीय प्रशिक्षण पूरा करें"]


def test_bhashini_translation_provider(monkeypatch):
    class FakeResponse:
        def raise_for_status(self):
            return None

        def json(self):
            return {"pipelineResponse": [{"output": [
                {"target": "आगे बढ़ें"}, {"target": "डेयरी व्यवसाय"}
            ]}]}

    class FakeClient:
        def __enter__(self):
            return self

        def __exit__(self, exception_type, exception, traceback):
            return False

        def post(self, endpoint, headers, json):
            assert endpoint == translation.settings.BHASHINI_ENDPOINT
            assert json["pipelineTasks"][0]["taskType"] == "translation"
            assert json["pipelineTasks"][0]["config"]["language"]["targetLanguage"] == "hi"
            return FakeResponse()

    monkeypatch.setattr(translation.settings, "BHASHINI_USER_ID", "user")
    monkeypatch.setattr(translation.settings, "BHASHINI_API_KEY", "api-key")
    monkeypatch.setattr(translation.settings, "BHASHINI_INFERENCE_API_KEY", "inference-key")
    monkeypatch.setattr(translation.httpx, "Client", lambda timeout: FakeClient())

    assert translate_batch(["Proceed", "Dairy"], "hi") == ["आगे बढ़ें", "डेयरी व्यवसाय"]

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
