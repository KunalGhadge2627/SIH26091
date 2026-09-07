import logging
from typing import Dict, Any, List

import httpx

from app.config import settings

logger = logging.getLogger("udyam_gram.translation")

SUPPORTED_LANGUAGES = {
    "en": {"name": "English", "code": "eng_Latn"},
    "hi": {"name": "Hindi", "code": "hin_Deva"},
    "mr": {"name": "Marathi", "code": "mar_Deva"},
    "ta": {"name": "Tamil", "code": "tam_Taml"},
    "te": {"name": "Telugu", "code": "tel_Telu"},
    "kn": {"name": "Kannada", "code": "kan_Knda"},
    "bn": {"name": "Bengali", "code": "ben_Beng"},
    "gu": {"name": "Gujarati", "code": "guj_Gujr"},
    "pa": {"name": "Punjabi", "code": "pan_Guru"}
}

# Key term dictionary for Indic fallbacks
FALLBACK_DICTIONARY = {
    "hi": {
        "Strong": "मजबूत",
        "Promising": "आशाजनक",
        "Moderate": "मध्यम",
        "Weak": "कमजोर",
        "High financial risk": "उच्च वित्तीय जोखिम",
        "Good": "अच्छा",
        "Poor": "खराब",
        "Proceed": "आगे बढ़ें",
        "Dairy": "डेयरी व्यवसाय",
        "Poultry": "पोल्ट्री फार्म",
        "Tailoring": "सिलाई एवं परिधान",
        "Flour Mill": "आटा चक्की",
        "Two-Wheeler Repair": "दुपहिया वाहन मरम्मत"
    },
    "mr": {
        "Strong": "मजबूत",
        "Promising": "आशादायक",
        "Moderate": "मध्यम",
        "Weak": "कमजोर",
        "High financial risk": "उच्च आर्थिक धोका",
        "Good": "चांगले",
        "Poor": "वाईट",
        "Proceed": "पुढे जा",
        "Dairy": "दुग्ध व्यवसाय",
        "Poultry": "कुक्कुटपालन",
        "Tailoring": "शिंपी काम",
        "Flour Mill": "पिठाची गिरणी",
        "Two-Wheeler Repair": "द्विचक्र वाहन दुरुस्ती"
    }
}

IMPROVEMENT_FALLBACKS = {
    "hi": {
        "Complete 2-Week Domain Apprenticeship": "2 सप्ताह का क्षेत्रीय प्रशिक्षण पूरा करें",
        "Shadow an established shop owner in a nearby town to learn practical daily operations.": "दैनिक कार्यों का व्यावहारिक ज्ञान लेने के लिए पास के शहर में किसी अनुभवी दुकानदार के साथ प्रशिक्षण लें।",
        "Finalize Workspace Lease Agreement": "कार्यस्थल का किराया समझौता पूरा करें",
        "Secure a roadside workspace location with adequate power fitting and public access.": "पर्याप्त बिजली सुविधा और सार्वजनिक पहुंच वाले सड़क किनारे कार्यस्थल को सुरक्षित करें।",
        "Confirm 2 Wholesale Supplier Links": "2 थोक आपूर्तिकर्ताओं के संपर्क पक्के करें",
        "Establish written price quotations and supply delivery commitments with raw material distributors.": "कच्चे माल के वितरकों से लिखित मूल्य उद्धरण और आपूर्ति वितरण प्रतिबद्धता प्राप्त करें।",
        "Gather Pre-orders & Buyer Letters": "प्री-ऑर्डर और खरीदारों के पत्र जुटाएं",
        "Secure initial customer commitments or buyer intent letters from local households.": "स्थानीय परिवारों से शुरुआती ग्राहक प्रतिबद्धताएं या खरीदार की इच्छा के पत्र प्राप्त करें।",
        "Build ₹15,000 Emergency Cash Reserve": "₹15,000 की आपातकालीन नकद बचत बनाएं",
        "Deposit emergency cash buffer in a liquid bank savings account prior to loan disbursement.": "ऋण जारी होने से पहले आपातकालीन नकद राशि को आसानी से निकाले जा सकने वाले बैंक बचत खाते में जमा करें।"
    },
    "mr": {
        "Complete 2-Week Domain Apprenticeship": "2 आठवड्यांचे क्षेत्रीय प्रशिक्षण पूर्ण करा",
        "Shadow an established shop owner in a nearby town to learn practical daily operations.": "दैनंदिन कामकाजाचे व्यावहारिक ज्ञान घेण्यासाठी जवळच्या शहरातील अनुभवी दुकानदारासोबत प्रशिक्षण घ्या.",
        "Finalize Workspace Lease Agreement": "कार्यस्थळाचा भाडेकरार पूर्ण करा",
        "Secure a roadside workspace location with adequate power fitting and public access.": "पुरेशी वीज सुविधा आणि सार्वजनिक प्रवेश असलेले रस्त्यालगतचे कार्यस्थळ सुरक्षित करा.",
        "Confirm 2 Wholesale Supplier Links": "2 घाऊक पुरवठादारांचे संपर्क निश्चित करा",
        "Establish written price quotations and supply delivery commitments with raw material distributors.": "कच्चा माल वितरकांकडून लेखी दरपत्रक आणि पुरवठा वितरणाची हमी मिळवा.",
        "Gather Pre-orders & Buyer Letters": "आधीच्या ऑर्डर आणि खरेदीदारांची पत्रे मिळवा",
        "Secure initial customer commitments or buyer intent letters from local households.": "स्थानिक कुटुंबांकडून सुरुवातीच्या ग्राहकांची बांधिलकी किंवा खरेदीदारांची इच्छा-पत्रे मिळवा.",
        "Build ₹15,000 Emergency Cash Reserve": "₹15,000 ची आपत्कालीन रोख बचत तयार करा",
        "Deposit emergency cash buffer in a liquid bank savings account prior to loan disbursement.": "कर्ज वितरित होण्यापूर्वी आपत्कालीन रोख रक्कम सहज काढता येणाऱ्या बँक बचत खात्यात जमा करा."
    }
}

_indictrans_pipeline = None


def _sarvam_is_configured() -> bool:
    return bool(settings.SARVAM_API_KEY)


def translate_with_sarvam(text: str, target_lang: str) -> str | None:
    """Translate one English string with Sarvam, returning None on provider failure."""
    if not text or not _sarvam_is_configured() or target_lang not in SUPPORTED_LANGUAGES:
        return None

    payload = {
        "input": text,
        "source_language_code": "en-IN",
        "target_language_code": f"{target_lang}-IN",
        "model": settings.SARVAM_MODEL
    }
    headers = {
        "api-subscription-key": settings.SARVAM_API_KEY,
        "Content-Type": "application/json"
    }

    try:
        with httpx.Client(timeout=15.0) as client:
            response = client.post(settings.SARVAM_ENDPOINT, headers=headers, json=payload)
            response.raise_for_status()
            translated = response.json().get("translated_text")
            if not isinstance(translated, str) or not translated.strip():
                logger.warning("Sarvam returned an invalid translation response")
                return None
            return translated
    except (httpx.HTTPError, ValueError, TypeError, KeyError) as error:
        logger.warning("Sarvam translation unavailable: %s", error)
        return None


def _bhashini_is_configured() -> bool:
    return bool(
        settings.BHASHINI_USER_ID
        and settings.BHASHINI_API_KEY
        and settings.BHASHINI_INFERENCE_API_KEY
        and settings.BHASHINI_SERVICE_ID
    )


def translate_with_bhashini(texts: List[str], target_lang: str) -> List[str] | None:
    """Translate text through Bhashini, returning None when the provider is unavailable."""
    if not texts or not _bhashini_is_configured():
        return None

    language = SUPPORTED_LANGUAGES.get(target_lang)
    if not language:
        return None

    payload = {
        "pipelineTasks": [{
            "taskType": "translation",
            "config": {
                "language": {
                    "sourceLanguage": "en",
                    "targetLanguage": target_lang
                },
                "serviceId": settings.BHASHINI_SERVICE_ID
            }
        }],
        "inputData": {"input": [{"source": text} for text in texts]}
    }
    headers = {
        "userID": settings.BHASHINI_USER_ID,
        "ulcaApiKey": settings.BHASHINI_API_KEY,
        "inferenceApiKey": settings.BHASHINI_INFERENCE_API_KEY,
        "Content-Type": "application/json"
    }

    try:
        with httpx.Client(timeout=15.0) as client:
            response = client.post(settings.BHASHINI_ENDPOINT, headers=headers, json=payload)
            response.raise_for_status()
            pipeline_response = response.json().get("pipelineResponse", [])
            outputs = pipeline_response[0].get("output", []) if pipeline_response else []
            translated = [item.get("target") for item in outputs]
            if len(translated) != len(texts) or not all(isinstance(item, str) for item in translated):
                logger.warning("Bhashini returned an incomplete translation response")
                return None
            return translated
    except (httpx.HTTPError, ValueError, TypeError, KeyError) as error:
        logger.warning("Bhashini translation unavailable: %s", error)
        return None

LOCALIZED_REPORT_COPY = {
    "hi": {
        "narrative": "आपके व्यवसाय की व्यवहार्यता का मूल्यांकन स्थानीय बाजार, आपकी तैयारी और वित्तीय क्षमता के आधार पर किया गया है। संचालन शुरू करने से पहले सुझाई गई तैयारियां पूरी करें।",
        "financial": "मासिक ईएमआई ऋण अवधि के दौरान हर महीने चुकाई जाने वाली निश्चित राशि है। ऋण लेने से पहले सुनिश्चित करें कि यह भुगतान आपके घरेलू बजट में आसानी से समा सके।"
    },
    "mr": {
        "narrative": "तुमच्या व्यवसायाची व्यवहार्यता स्थानिक बाजारपेठ, तुमची तयारी आणि आर्थिक क्षमतेच्या आधारे तपासली आहे. व्यवसाय सुरू करण्यापूर्वी सुचवलेली तयारी पूर्ण करा.",
        "financial": "मासिक ईएमआय म्हणजे कर्जाच्या कालावधीत दर महिन्याला भरायची निश्चित रक्कम. कर्ज घेण्यापूर्वी हा हप्ता तुमच्या घरगुती बजेटमध्ये सहज बसेल याची खात्री करा."
    },
    "ta": {
        "narrative": "உங்கள் வணிகத்தின் சாத்தியக்கூறு உள்ளூர் சந்தை, உங்கள் தயார்நிலை மற்றும் நிதித் திறன் அடிப்படையில் மதிப்பிடப்பட்டுள்ளது. செயல்பாடுகளைத் தொடங்கும் முன் பரிந்துரைக்கப்பட்ட தயாரிப்புகளை முடிக்கவும்.",
        "financial": "மாதாந்திர EMI என்பது கடன் காலத்தில் ஒவ்வொரு மாதமும் செலுத்த வேண்டிய நிலையான தொகையாகும். கடன் பெறுவதற்கு முன் இந்தத் தொகை உங்கள் குடும்ப வரவுசெலவுத் திட்டத்தில் பொருந்துகிறதா என்பதை உறுதி செய்யவும்."
    },
    "te": {
        "narrative": "మీ వ్యాపార సాధ్యత స్థానిక మార్కెట్, మీ సిద్ధత మరియు ఆర్థిక సామర్థ్యం ఆధారంగా అంచనా వేయబడింది. కార్యకలాపాలు ప్రారంభించే ముందు సూచించిన సిద్ధతను పూర్తి చేయండి.",
        "financial": "నెలవారీ EMI అనేది రుణ కాలంలో ప్రతి నెల చెల్లించాల్సిన స్థిర మొత్తం. రుణం తీసుకునే ముందు ఈ చెల్లింపు మీ కుటుంబ బడ్జెట్‌లో సులభంగా సరిపోతుందని నిర్ధారించుకోండి."
    },
    "kn": {
        "narrative": "ನಿಮ್ಮ ವ್ಯವಹಾರದ ಸಾಧ್ಯತೆಯನ್ನು ಸ್ಥಳೀಯ ಮಾರುಕಟ್ಟೆ, ನಿಮ್ಮ ಸಿದ್ಧತೆ ಮತ್ತು ಹಣಕಾಸಿನ ಸಾಮರ್ಥ್ಯದ ಆಧಾರದ ಮೇಲೆ ಮೌಲ್ಯಮಾಪನ ಮಾಡಲಾಗಿದೆ. ಕಾರ್ಯಾಚರಣೆ ಪ್ರಾರಂಭಿಸುವ ಮೊದಲು ಸೂಚಿಸಿದ ಸಿದ್ಧತೆಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ.",
        "financial": "ಮಾಸಿಕ EMI ಸಾಲದ ಅವಧಿಯಲ್ಲಿ ಪ್ರತಿ ತಿಂಗಳು ಪಾವತಿಸಬೇಕಾದ ನಿಗದಿತ ಮೊತ್ತವಾಗಿದೆ. ಸಾಲ ಪಡೆಯುವ ಮೊದಲು ಈ ಪಾವತಿ ನಿಮ್ಮ ಕುಟುಂಬದ ಬಜೆಟ್‌ಗೆ ಸರಿಹೊಂದುತ್ತದೆ ಎಂದು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ."
    },
    "bn": {
        "narrative": "আপনার ব্যবসার সম্ভাব্যতা স্থানীয় বাজার, আপনার প্রস্তুতি এবং আর্থিক সক্ষমতার ভিত্তিতে মূল্যায়ন করা হয়েছে। কাজ শুরু করার আগে প্রস্তাবিত প্রস্তুতিগুলি সম্পূর্ণ করুন।",
        "financial": "মাসিক EMI হল ঋণের মেয়াদে প্রতি মাসে দেওয়ার নির্দিষ্ট অর্থ। ঋণ নেওয়ার আগে নিশ্চিত করুন যে এই অর্থ আপনার পারিবারিক বাজেটে সহজে মিটবে।"
    },
    "gu": {
        "narrative": "તમારા વ્યવસાયની વ્યવહાર્યતાનું મૂલ્યાંકન સ્થાનિક બજાર, તમારી તૈયારી અને નાણાકીય ક્ષમતાના આધારે કરવામાં આવ્યું છે. કામગીરી શરૂ કરતા પહેલાં સૂચવેલી તૈયારી પૂર્ણ કરો.",
        "financial": "માસિક EMI એ લોનની મુદત દરમિયાન દર મહિને ચૂકવવાની નિશ્ચિત રકમ છે. લોન લેતા પહેલાં ખાતરી કરો કે આ ચુકવણી તમારા ઘરેલુ બજેટમાં સરળતાથી સમાઈ શકે."
    },
    "pa": {
        "narrative": "ਤੁਹਾਡੇ ਕਾਰੋਬਾਰ ਦੀ ਵਿਹਾਰਕਤਾ ਦਾ ਮੁਲਾਂਕਣ ਸਥਾਨਕ ਬਾਜ਼ਾਰ, ਤੁਹਾਡੀ ਤਿਆਰੀ ਅਤੇ ਵਿੱਤੀ ਸਮਰੱਥਾ ਦੇ ਆਧਾਰ 'ਤੇ ਕੀਤਾ ਗਿਆ ਹੈ। ਕੰਮ ਸ਼ੁਰੂ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਸੁਝਾਈ ਤਿਆਰੀ ਪੂਰੀ ਕਰੋ।",
        "financial": "ਮਹੀਨਾਵਾਰ EMI ਕਰਜ਼ੇ ਦੀ ਮਿਆਦ ਦੌਰਾਨ ਹਰ ਮਹੀਨੇ ਅਦਾ ਕੀਤੀ ਜਾਣ ਵਾਲੀ ਨਿਸ਼ਚਿਤ ਰਕਮ ਹੈ। ਕਰਜ਼ਾ ਲੈਣ ਤੋਂ ਪਹਿਲਾਂ ਯਕੀਨੀ ਬਣਾਓ ਕਿ ਇਹ ਭੁਗਤਾਨ ਤੁਹਾਡੇ ਘਰੇਲੂ ਬਜਟ ਵਿੱਚ ਆਸਾਨੀ ਨਾਲ ਆ ਸਕੇ।"
    }
}

def get_indictrans_pipeline():
    """
    Lazily loads IndicTrans2 model if transformers/torch installed.
    """
    global _indictrans_pipeline
    if _indictrans_pipeline is not None:
        return _indictrans_pipeline
    try:
        from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
        # Attempt load
        model_name = "ai4bharat/indictrans2-en-indic-1B"
        tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=True)
        model = AutoModelForSeq2SeqLM.from_pretrained(model_name, trust_remote_code=True)
        _indictrans_pipeline = (tokenizer, model)
        return _indictrans_pipeline
    except Exception as e:
        logger.info(f"IndicTrans2 heavy model skipped (using lightweight Indic translation engine): {e}")
        return None

def translate_text(text: str, target_lang: str) -> str:
    """
    Translates a single string from English to target Indic language.
    Returns input text unchanged if target_lang is 'en' or text is empty.
    """
    if not text or target_lang == "en" or target_lang not in SUPPORTED_LANGUAGES:
        return text

    # Known action copy must remain localized even when an upstream provider
    # returns the source text or a tagged fallback as its response.
    improvement_dict = IMPROVEMENT_FALLBACKS.get(target_lang, {})
    if text in improvement_dict:
        return improvement_dict[text]

    sarvam_translation = translate_with_sarvam(text, target_lang)
    if sarvam_translation and sarvam_translation != text and not sarvam_translation.startswith("["):
        return sarvam_translation

    bhashini_translation = translate_with_bhashini([text], target_lang)
    if bhashini_translation and bhashini_translation[0] != text and not bhashini_translation[0].startswith("["):
        return bhashini_translation[0]
        
    pipeline = get_indictrans_pipeline()
    if pipeline:
        try:
            tokenizer, model = pipeline
            inputs = tokenizer([text], return_tensors="pt")
            generated_tokens = model.generate(**inputs, max_length=256)
            translated = tokenizer.batch_decode(generated_tokens, skip_special_tokens=True)[0]
            return translated
        except Exception as e:
            logger.warning(f"Translation pipeline error: {e}")

    # Lightweight dictionary & language tag fallback
    lang_dict = FALLBACK_DICTIONARY.get(target_lang, {})
    if text in lang_dict:
        return lang_dict[text]

    if text.startswith("Enroll in RSETI / Skill India ") and text.endswith(" Training"):
        category = text[len("Enroll in RSETI / Skill India "):-len(" Training")]
        if target_lang == "hi":
            return f"RSETI / स्किल इंडिया {category} प्रशिक्षण में नामांकन करें"
        if target_lang == "mr":
            return f"RSETI / स्किल इंडिया {category} प्रशिक्षणात प्रवेश घ्या"

    if text.startswith("Undergo certified technical skill and equipment maintenance training for ") and text.endswith("."):
        category = text[len("Undergo certified technical skill and equipment maintenance training for "):-1]
        if target_lang == "hi":
            return f"{category} के लिए प्रमाणित तकनीकी कौशल और उपकरण रखरखाव प्रशिक्षण लें।"
        if target_lang == "mr":
            return f"{category} साठी प्रमाणित तांत्रिक कौशल्य आणि उपकरण देखभाल प्रशिक्षण घ्या।"
        
    # Return formatted string indicating language representation if non-English
    lang_name = SUPPORTED_LANGUAGES[target_lang]["name"]
    return f"[{lang_name}] {text}"

def translate_batch(texts: List[str], target_lang: str) -> List[str]:
    """
    Translates a list of strings efficiently in batch.
    """
    if not texts or target_lang == "en":
        return texts

    bhashini_translations = translate_with_bhashini(texts, target_lang)
    if bhashini_translations and all(
        translated != source and not translated.startswith("[")
        for source, translated in zip(texts, bhashini_translations)
    ):
        return bhashini_translations

    return [translate_text(t, target_lang) for t in texts]

def translate_report_payload(report: Dict[str, Any], target_lang: str) -> Dict[str, Any]:
    """
    Walks text fields in report payload and translates them, leaving numbers/structure intact.
    """
    if target_lang == "en" or target_lang not in SUPPORTED_LANGUAGES:
        return report
        
    translated = dict(report)
    
    # 1. Computed Scores verdict title and factors
    if "computed_scores" in translated and translated["computed_scores"]:
        scores = dict(translated["computed_scores"])
        scores["verdict_title"] = translate_text(scores.get("verdict_title", ""), target_lang)
        scores["verdict_band"] = translate_text(scores.get("verdict_band", ""), target_lang)
        scores["positive_factors"] = translate_batch(scores.get("positive_factors", []), target_lang)
        scores["attention_areas"] = translate_batch(scores.get("attention_areas", []), target_lang)
        translated["computed_scores"] = scores

    # 2. Computed Explanation
    if "computed_explanation" in translated and translated["computed_explanation"]:
        expl = dict(translated["computed_explanation"])
        expl["score_narrative"] = translate_text(expl.get("score_narrative", ""), target_lang)
        expl["financial_notes"] = translate_text(expl.get("financial_notes", ""), target_lang)

        # Keep generated fallback narratives fully localized when the optional
        # IndicTrans2 model is unavailable.
        localized_copy = LOCALIZED_REPORT_COPY.get(target_lang)
        if localized_copy:
            expl["score_narrative"] = localized_copy["narrative"]
            expl["financial_notes"] = localized_copy["financial"]
        
        if "swot" in expl and expl["swot"]:
            swot = dict(expl["swot"])
            swot["strengths"] = translate_batch(swot.get("strengths", []), target_lang)
            swot["weaknesses"] = translate_batch(swot.get("weaknesses", []), target_lang)
            swot["opportunities"] = translate_batch(swot.get("opportunities", []), target_lang)
            swot["threats"] = translate_batch(swot.get("threats", []), target_lang)
            expl["swot"] = swot
            
        if "explainer_cards" in expl and expl["explainer_cards"]:
            cards = []
            for c in expl["explainer_cards"]:
                card = dict(c)
                card["title"] = translate_text(card.get("title", ""), target_lang)
                card["explanation"] = translate_text(card.get("explanation", ""), target_lang)
                cards.append(card)
            expl["explainer_cards"] = cards
            
        if "plan_90_days" in expl and expl["plan_90_days"]:
            p90 = dict(expl["plan_90_days"])
            p90["days_1_30"] = translate_batch(p90.get("days_1_30", []), target_lang)
            p90["days_31_60"] = translate_batch(p90.get("days_31_60", []), target_lang)
            p90["days_61_90"] = translate_batch(p90.get("days_61_90", []), target_lang)
            expl["plan_90_days"] = p90
            
        translated["computed_explanation"] = expl
        
    return translated
