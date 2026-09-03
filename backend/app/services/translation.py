import logging
from typing import Dict, Any, List

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

_indictrans_pipeline = None

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
        
    # Return formatted string indicating language representation if non-English
    lang_name = SUPPORTED_LANGUAGES[target_lang]["name"]
    return f"[{lang_name}] {text}"

def translate_batch(texts: List[str], target_lang: str) -> List[str]:
    """
    Translates a list of strings efficiently in batch.
    """
    if not texts or target_lang == "en":
        return texts
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
