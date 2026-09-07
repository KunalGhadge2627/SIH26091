import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, ArrowRight, ArrowLeft, Clock, ShieldCheck, 
  Store, UserCheck, Wallet, MapPin, Check, Save, Sparkles
} from 'lucide-react';
import TopBar from '../components/common/TopBar';
import Sidebar from '../components/common/Sidebar';
import DisclaimerBanner from '../components/common/DisclaimerBanner';
import LocationMap from '../components/map/LocationMap';
import { useLanguage } from '../context/LanguageContext';
import api from '../api/client';
import { INDIA_CENTER, STATE_CENTERS, getBlockCenter, getDistrictCenter } from '../data/locationCenters';

const DEFAULT_BUSINESS_MODELS = [
  { category: 'Dairy', display_name: 'Dairy Farming & Milk Collection', description: 'Small-scale dairy unit supplying milk to nearby households and collection centres.', capital_min: 300000, capital_max: 700000 },
  { category: 'Poultry', display_name: 'Small-scale Poultry Unit', description: 'Broiler or layer poultry farm supplying local markets and eateries.', capital_min: 150000, capital_max: 400000 },
  { category: 'Tailoring', display_name: 'Tailoring & Garment Shop', description: 'Custom tailoring, stitching, alterations, and garment sales for local households.', capital_min: 50000, capital_max: 200000 },
  { category: 'Flour Mill', display_name: 'Flour Mill (Atta Chakki)', description: 'Grain grinding mill serving village households with flour and spice processing.', capital_min: 200000, capital_max: 600000 },
  { category: 'Two-Wheeler Repair', display_name: 'Two-Wheeler Workshop & Spare Parts', description: 'Motorcycle and scooter servicing, repairs, tyres, and spare-parts retail.', capital_min: 100000, capital_max: 300000 }
];

const BUSINESS_CARD_COPY = {
  hi: {
    Dairy: ['डेयरी फार्मिंग और दूध संग्रह', 'पास के घरों और दूध संग्रह केंद्रों को दूध उपलब्ध कराने वाली छोटी डेयरी इकाई।'], Poultry: ['छोटा पोल्ट्री यूनिट', 'स्थानीय बाजारों और भोजनालयों को आपूर्ति करने वाला ब्रॉयलर या लेयर फार्म।'], Tailoring: ['सिलाई और परिधान की दुकान', 'स्थानीय परिवारों के लिए सिलाई, कपड़ों की मरम्मत और परिधान बिक्री।'], 'Flour Mill': ['आटा चक्की', 'गांव के परिवारों के लिए आटा और मसाले पीसने वाली मिल।'], 'Two-Wheeler Repair': ['दुपहिया वाहन कार्यशाला और स्पेयर पार्ट्स', 'मोटरसाइकिल और स्कूटर की सर्विस, मरम्मत और स्पेयर पार्ट्स की बिक्री।']
  },
  mr: {
    Dairy: ['दुग्ध व्यवसाय आणि दूध संकलन', 'जवळच्या कुटुंबांना आणि दूध संकलन केंद्रांना दूध पुरवणारी लघु डेअरी युनिट.'], Poultry: ['लघु कुक्कुटपालन युनिट', 'स्थानिक बाजारपेठा आणि खाद्यगृहांना पुरवठा करणारे ब्रॉयलर किंवा लेयर फार्म.'], Tailoring: ['शिंपीकाम आणि वस्त्र दुकान', 'स्थानिक कुटुंबांसाठी शिंपीकाम, दुरुस्ती आणि वस्त्र विक्री.'], 'Flour Mill': ['पिठाची गिरणी', 'गावातील कुटुंबांसाठी पीठ आणि मसाले दळणारी गिरणी.'], 'Two-Wheeler Repair': ['दुचाकी कार्यशाळा आणि सुटे भाग', 'मोटरसायकल व स्कूटरची सर्व्हिस, दुरुस्ती आणि सुटे भाग विक्री.']
  },
  ta: {
    Dairy: ['பால் பண்ணை மற்றும் பால் சேகரிப்பு', 'அருகிலுள்ள குடும்பங்கள் மற்றும் சேகரிப்பு மையங்களுக்கு பால் வழங்கும் சிறிய பால் பண்ணை.'], Poultry: ['சிறிய கோழிப்பண்ணை', 'உள்ளூர் சந்தைகள் மற்றும் உணவகங்களுக்கு வழங்கும் பிராய்லர் அல்லது லேயர் பண்ணை.'], Tailoring: ['தையல் மற்றும் ஆடை கடை', 'உள்ளூர் குடும்பங்களுக்கான தையல், திருத்தம் மற்றும் ஆடை விற்பனை.'], 'Flour Mill': ['மாவு ஆலை', 'கிராமக் குடும்பங்களுக்கு மாவு மற்றும் மசாலா அரைக்கும் ஆலை.'], 'Two-Wheeler Repair': ['இருசக்கர வாகன பணிமனை மற்றும் உதிரிபாகங்கள்', 'மோட்டார் சைக்கிள் மற்றும் ஸ்கூட்டர் சேவை, பழுது மற்றும் உதிரிபாக விற்பனை.']
  },
  te: {
    Dairy: ['పాల పశుపోషణ మరియు పాల సేకరణ', 'సమీప కుటుంబాలు మరియు సేకరణ కేంద్రాలకు పాలు అందించే చిన్న డెయిరీ యూనిట్.'], Poultry: ['చిన్న కోళ్ల పెంపకం యూనిట్', 'స్థానిక మార్కెట్లు మరియు ఆహారశాలలకు సరఫరా చేసే బ్రాయిలర్ లేదా లేయర్ ఫారం.'], Tailoring: ['టైలరింగ్ మరియు వస్త్ర దుకాణం', 'స్థానిక కుటుంబాల కోసం కుట్టుపని, మార్పులు మరియు వస్త్రాల విక్రయం.'], 'Flour Mill': ['పిండి మిల్లు', 'గ్రామ కుటుంబాలకు పిండి మరియు మసాలాలు తయారు చేసే మిల్లు.'], 'Two-Wheeler Repair': ['ద్విచక్ర వాహన వర్క్‌షాప్ మరియు విడిభాగాలు', 'మోటార్‌సైకిల్ మరియు స్కూటర్ సర్వీసింగ్, మరమ్మతులు, విడిభాగాల విక్రయం.']
  },
  kn: {
    Dairy: ['ಹೈನುಗಾರಿಕೆ ಮತ್ತು ಹಾಲು ಸಂಗ್ರಹ', 'ಹತ್ತಿರದ ಕುಟುಂಬಗಳು ಮತ್ತು ಸಂಗ್ರಹ ಕೇಂದ್ರಗಳಿಗೆ ಹಾಲು ನೀಡುವ ಸಣ್ಣ ಹೈನುಗಾರಿಕಾ ಘಟಕ.'], Poultry: ['ಸಣ್ಣ ಕೋಳಿ ಸಾಕಾಣಿಕೆ ಘಟಕ', 'ಸ್ಥಳೀಯ ಮಾರುಕಟ್ಟೆಗಳು ಮತ್ತು ಆಹಾರ ಮಳಿಗೆಗಳಿಗೆ ಪೂರೈಸುವ ಬ್ರಾಯ್ಲರ್ ಅಥವಾ ಲೇಯರ್ ಫಾರ್ಮ್.'], Tailoring: ['ಹೊಲಿಗೆ ಮತ್ತು ಬಟ್ಟೆ ಅಂಗಡಿ', 'ಸ್ಥಳೀಯ ಕುಟುಂಬಗಳಿಗೆ ಹೊಲಿಗೆ, ಬಟ್ಟೆ ಬದಲಾವಣೆ ಮತ್ತು ಉಡುಪು ಮಾರಾಟ.'], 'Flour Mill': ['ಹಿಟ್ಟು ಗಿರಣಿ', 'ಗ್ರಾಮದ ಕುಟುಂಬಗಳಿಗೆ ಹಿಟ್ಟು ಮತ್ತು ಮಸಾಲೆಗಳನ್ನು ತಯಾರಿಸುವ ಗಿರಣಿ.'], 'Two-Wheeler Repair': ['ದ್ವಿಚಕ್ರ ವಾಹನ ಕಾರ್ಯಾಗಾರ ಮತ್ತು ಬಿಡಿಭಾಗಗಳು', 'ಮೋಟಾರ್‌ಸೈಕಲ್ ಮತ್ತು ಸ್ಕೂಟರ್ ಸೇವೆ, ದುರಸ್ತಿ ಮತ್ತು ಬಿಡಿಭಾಗಗಳ ಮಾರಾಟ.']
  },
  bn: {
    Dairy: ['ডেইরি খামার ও দুধ সংগ্রহ', 'কাছাকাছি পরিবার ও সংগ্রহ কেন্দ্রে দুধ সরবরাহকারী ছোট ডেইরি ইউনিট।'], Poultry: ['ছোট পোলট্রি ইউনিট', 'স্থানীয় বাজার ও খাবারের দোকানে সরবরাহকারী ব্রয়লার বা লেয়ার খামার।'], Tailoring: ['সেলাই ও পোশাকের দোকান', 'স্থানীয় পরিবারের জন্য সেলাই, পরিবর্তন ও পোশাক বিক্রি।'], 'Flour Mill': ['আটা কল', 'গ্রামের পরিবারের জন্য আটা ও মশলা পেষাইয়ের কল।'], 'Two-Wheeler Repair': ['দুই চাকার গাড়ির ওয়ার্কশপ ও যন্ত্রাংশ', 'মোটরসাইকেল ও স্কুটারের সার্ভিস, মেরামত এবং যন্ত্রাংশ বিক্রি।']
  },
  gu: {
    Dairy: ['ડેરી ફાર્મિંગ અને દૂધ સંગ્રહ', 'નજીકના પરિવારો અને સંગ્રહ કેન્દ્રોને દૂધ આપતું નાનું ડેરી એકમ.'], Poultry: ['નાનું પોલ્ટ્રી યુનિટ', 'સ્થાનિક બજારો અને ભોજનાલયો માટે બ્રોઇલર અથવા લેયર ફાર્મ.'], Tailoring: ['ટેલરિંગ અને કપડાંની દુકાન', 'સ્થાનિક પરિવારો માટે સીવણ, ફેરફાર અને કપડાંનું વેચાણ.'], 'Flour Mill': ['લોટની ઘંટી', 'ગામના પરિવારો માટે લોટ અને મસાલા પીસતી મિલ.'], 'Two-Wheeler Repair': ['ટુ-વ્હીલર વર્કશોપ અને સ્પેર પાર્ટ્સ', 'મોટરસાઇકલ અને સ્કૂટરની સર્વિસ, સમારકામ અને સ્પેર પાર્ટ્સનું વેચાણ.']
  },
  pa: {
    Dairy: ['ਡੇਅਰੀ ਫਾਰਮਿੰਗ ਅਤੇ ਦੁੱਧ ਇਕੱਠਾ ਕਰਨਾ', 'ਨੇੜਲੇ ਪਰਿਵਾਰਾਂ ਅਤੇ ਦੁੱਧ ਕੇਂਦਰਾਂ ਨੂੰ ਦੁੱਧ ਦੇਣ ਵਾਲੀ ਛੋਟੀ ਡੇਅਰੀ ਇਕਾਈ।'], Poultry: ['ਛੋਟੀ ਪੋਲਟਰੀ ਇਕਾਈ', 'ਸਥਾਨਕ ਬਾਜ਼ਾਰਾਂ ਅਤੇ ਖਾਣ-ਪੀਣ ਦੀਆਂ ਥਾਵਾਂ ਨੂੰ ਸਪਲਾਈ ਕਰਨ ਵਾਲਾ ਬਰੌਇਲਰ ਜਾਂ ਲੇਅਰ ਫਾਰਮ।'], Tailoring: ['ਸਿਲਾਈ ਅਤੇ ਕੱਪੜਿਆਂ ਦੀ ਦੁਕਾਨ', 'ਸਥਾਨਕ ਪਰਿਵਾਰਾਂ ਲਈ ਸਿਲਾਈ, ਸੋਧ ਅਤੇ ਕੱਪੜਿਆਂ ਦੀ ਵਿਕਰੀ।'], 'Flour Mill': ['ਆਟਾ ਚੱਕੀ', 'ਪਿੰਡ ਦੇ ਪਰਿਵਾਰਾਂ ਲਈ ਆਟਾ ਅਤੇ ਮਸਾਲੇ ਪੀਸਣ ਵਾਲੀ ਮਿੱਲ।'], 'Two-Wheeler Repair': ['ਦੋ-ਪਹੀਆ ਵਰਕਸ਼ਾਪ ਅਤੇ ਸਪੇਅਰ ਪਾਰਟਸ', 'ਮੋਟਰਸਾਈਕਲ ਅਤੇ ਸਕੂਟਰ ਦੀ ਸਰਵਿਸ, ਮੁਰੰਮਤ ਅਤੇ ਪਾਰਟਸ ਦੀ ਵਿਕਰੀ।']
  }
};

const ASSESSMENT_HEADING_COPY = {
  hi: {
    'STEP 1 OF 5': 'चरण 1 / 5', 'Personal Profile & Resources': 'व्यक्तिगत प्रोफ़ाइल और संसाधन', 'Tell us about your background and available operational assets.': 'अपनी पृष्ठभूमि और उपलब्ध संचालन संसाधनों के बारे में बताएं।', 'Personal Background': 'व्यक्तिगत पृष्ठभूमि', 'Resources You Can Use (Multi-Select)': 'उपलब्ध संसाधन (एक से अधिक चुनें)', 'Time Commitment': 'समय प्रतिबद्धता', 'Age Group': 'आयु वर्ग', 'Education Level': 'शिक्षा स्तर', 'Current Occupation': 'वर्तमान व्यवसाय', 'Prior Business Experience': 'पिछला व्यावसायिक अनुभव', 'Existing Monthly Loan EMI (₹)': 'मौजूदा मासिक ऋण EMI (₹)', 'Own land': 'अपनी भूमि', 'Shop/workspace': 'दुकान/कार्यस्थल', 'Vehicle': 'वाहन', 'Electricity': 'बिजली', 'Storage': 'भंडारण', 'Machinery/equipment': 'मशीनरी/उपकरण', 'Family labour': 'पारिवारिक श्रम', 'Existing customers': 'मौजूदा ग्राहक'
  },
  mr: {
    'STEP 1 OF 5': 'पायरी 1 / 5', 'Personal Profile & Resources': 'वैयक्तिक प्रोफाइल आणि संसाधने', 'Tell us about your background and available operational assets.': 'तुमची पार्श्वभूमी आणि उपलब्ध कार्यकारी संसाधनांबद्दल सांगा.', 'Personal Background': 'वैयक्तिक पार्श्वभूमी', 'Resources You Can Use (Multi-Select)': 'तुम्ही वापरू शकता अशी संसाधने (अनेक निवडा)', 'Time Commitment': 'वेळेची बांधिलकी', 'Age Group': 'वयोगट', 'Education Level': 'शिक्षणाची पातळी', 'Current Occupation': 'सध्याचा व्यवसाय', 'Prior Business Experience': 'मागील व्यावसायिक अनुभव', 'Existing Monthly Loan EMI (₹)': 'सध्याचा मासिक कर्ज EMI (₹)', 'Own land': 'स्वतःची जमीन', 'Shop/workspace': 'दुकान/कार्यस्थळ', 'Vehicle': 'वाहन', 'Electricity': 'वीज', 'Storage': 'साठवणूक', 'Machinery/equipment': 'यंत्रसामग्री/उपकरणे', 'Family labour': 'कौटुंबिक श्रम', 'Existing customers': 'विद्यमान ग्राहक'
  },
  ta: {
    'STEP 1 OF 5': 'படி 1 / 5', 'Personal Profile & Resources': 'தனிப்பட்ட சுயவிவரம் மற்றும் வளங்கள்', 'Tell us about your background and available operational assets.': 'உங்கள் பின்னணி மற்றும் கிடைக்கும் செயல்பாட்டு வளங்களைப் பற்றி கூறுங்கள்.', 'Personal Background': 'தனிப்பட்ட பின்னணி', 'Resources You Can Use (Multi-Select)': 'நீங்கள் பயன்படுத்தக்கூடிய வளங்கள் (பல தேர்வு)', 'Time Commitment': 'நேர ஒதுக்கீடு', 'Age Group': 'வயது குழு', 'Education Level': 'கல்வி நிலை', 'Current Occupation': 'தற்போதைய தொழில்', 'Prior Business Experience': 'முந்தைய வணிக அனுபவம்', 'Existing Monthly Loan EMI (₹)': 'தற்போதைய மாதாந்திர கடன் EMI (₹)', 'Own land': 'சொந்த நிலம்', 'Shop/workspace': 'கடை/பணியிடம்', 'Vehicle': 'வாகனம்', 'Electricity': 'மின்சாரம்', 'Storage': 'சேமிப்பு', 'Machinery/equipment': 'இயந்திரங்கள்/உபகரணங்கள்', 'Family labour': 'குடும்ப உழைப்பு', 'Existing customers': 'தற்போதைய வாடிக்கையாளர்கள்'
  },
  te: {
    'STEP 1 OF 5': 'దశ 1 / 5', 'Personal Profile & Resources': 'వ్యక్తిగత ప్రొఫైల్ మరియు వనరులు', 'Tell us about your background and available operational assets.': 'మీ నేపథ్యం మరియు అందుబాటులో ఉన్న నిర్వహణ వనరుల గురించి చెప్పండి.', 'Personal Background': 'వ్యక్తిగత నేపథ్యం', 'Resources You Can Use (Multi-Select)': 'మీరు ఉపయోగించగల వనరులు (బహుళ ఎంపిక)', 'Time Commitment': 'సమయ నిబద్ధత', 'Age Group': 'వయస్సు వర్గం', 'Education Level': 'విద్యా స్థాయి', 'Current Occupation': 'ప్రస్తుత వృత్తి', 'Prior Business Experience': 'మునుపటి వ్యాపార అనుభవం', 'Existing Monthly Loan EMI (₹)': 'ప్రస్తుత నెలవారీ రుణ EMI (₹)', 'Own land': 'సొంత భూమి', 'Shop/workspace': 'దుకాణం/పని స్థలం', 'Vehicle': 'వాహనం', 'Electricity': 'విద్యుత్', 'Storage': 'నిల్వ', 'Machinery/equipment': 'యంత్రాలు/పరికరాలు', 'Family labour': 'కుటుంబ శ్రమ', 'Existing customers': 'ప్రస్తుత కస్టమర్లు'
  },
  kn: {
    'STEP 1 OF 5': 'ಹಂತ 1 / 5', 'Personal Profile & Resources': 'ವೈಯಕ್ತಿಕ ಪ್ರೊಫೈಲ್ ಮತ್ತು ಸಂಪನ್ಮೂಲಗಳು', 'Tell us about your background and available operational assets.': 'ನಿಮ್ಮ ಹಿನ್ನೆಲೆ ಮತ್ತು ಲಭ್ಯವಿರುವ ಕಾರ್ಯಾಚರಣಾ ಸಂಪನ್ಮೂಲಗಳ ಬಗ್ಗೆ ತಿಳಿಸಿ.', 'Personal Background': 'ವೈಯಕ್ತಿಕ ಹಿನ್ನೆಲೆ', 'Resources You Can Use (Multi-Select)': 'ನೀವು ಬಳಸಬಹುದಾದ ಸಂಪನ್ಮೂಲಗಳು (ಹಲವು ಆಯ್ಕೆ)', 'Time Commitment': 'ಸಮಯದ ಬದ್ಧತೆ', 'Age Group': 'ವಯೋಮಾನದ ಗುಂಪು', 'Education Level': 'ಶಿಕ್ಷಣದ ಮಟ್ಟ', 'Current Occupation': 'ಪ್ರಸ್ತುತ ಉದ್ಯೋಗ', 'Prior Business Experience': 'ಹಿಂದಿನ ವ್ಯವಹಾರ ಅನುಭವ', 'Existing Monthly Loan EMI (₹)': 'ಪ್ರಸ್ತುತ ಮಾಸಿಕ ಸಾಲ EMI (₹)', 'Own land': 'ಸ್ವಂತ ಭೂಮಿ', 'Shop/workspace': 'ಅಂಗಡಿ/ಕೆಲಸದ ಸ್ಥಳ', 'Vehicle': 'ವಾಹನ', 'Electricity': 'ವಿದ್ಯುತ್', 'Storage': 'ಸಂಗ್ರಹಣೆ', 'Machinery/equipment': 'ಯಂತ್ರೋಪಕರಣಗಳು', 'Family labour': 'ಕುಟುಂಬ ಕಾರ್ಮಿಕರು', 'Existing customers': 'ಅಸ್ತಿತ್ವದಲ್ಲಿರುವ ಗ್ರಾಹಕರು'
  },
  bn: {
    'STEP 1 OF 5': 'ধাপ ১ / ৫', 'Personal Profile & Resources': 'ব্যক্তিগত প্রোফাইল ও সম্পদ', 'Tell us about your background and available operational assets.': 'আপনার পটভূমি এবং উপলব্ধ পরিচালন সম্পদ সম্পর্কে বলুন।', 'Personal Background': 'ব্যক্তিগত পটভূমি', 'Resources You Can Use (Multi-Select)': 'আপনি ব্যবহার করতে পারেন এমন সম্পদ (একাধিক নির্বাচন)', 'Time Commitment': 'সময়ের প্রতিশ্রুতি', 'Age Group': 'বয়সের বিভাগ', 'Education Level': 'শিক্ষার স্তর', 'Current Occupation': 'বর্তমান পেশা', 'Prior Business Experience': 'পূর্ববর্তী ব্যবসায়িক অভিজ্ঞতা', 'Existing Monthly Loan EMI (₹)': 'বর্তমান মাসিক ঋণের EMI (₹)', 'Own land': 'নিজস্ব জমি', 'Shop/workspace': 'দোকান/কাজের জায়গা', 'Vehicle': 'যানবাহন', 'Electricity': 'বিদ্যুৎ', 'Storage': 'সংরক্ষণ', 'Machinery/equipment': 'যন্ত্রপাতি/সরঞ্জাম', 'Family labour': 'পরিবারের শ্রম', 'Existing customers': 'বর্তমান গ্রাহক'
  },
  gu: {
    'STEP 1 OF 5': 'પગલું 1 / 5', 'Personal Profile & Resources': 'વ્યક્તિગત પ્રોફાઇલ અને સંસાધનો', 'Tell us about your background and available operational assets.': 'તમારી પૃષ્ઠભૂમિ અને ઉપલબ્ધ કાર્યકારી સંસાધનો વિશે જણાવો.', 'Personal Background': 'વ્યક્તિગત પૃષ્ઠભૂમિ', 'Resources You Can Use (Multi-Select)': 'તમે ઉપયોગ કરી શકો તે સંસાધનો (એકથી વધુ પસંદ કરો)', 'Time Commitment': 'સમયની પ્રતિબદ્ધતા', 'Age Group': 'ઉંમર જૂથ', 'Education Level': 'શિક્ષણનું સ્તર', 'Current Occupation': 'વર્તમાન વ્યવસાય', 'Prior Business Experience': 'અગાઉનો વ્યવસાય અનુભવ', 'Existing Monthly Loan EMI (₹)': 'વર્તમાન માસિક લોન EMI (₹)', 'Own land': 'પોતાની જમીન', 'Shop/workspace': 'દુકાન/કાર્યસ્થળ', 'Vehicle': 'વાહન', 'Electricity': 'વીજળી', 'Storage': 'સંગ્રહ', 'Machinery/equipment': 'મશીનરી/સાધનો', 'Family labour': 'કુટુંબ શ્રમ', 'Existing customers': 'હાલના ગ્રાહકો'
  },
  pa: {
    'STEP 1 OF 5': 'ਪੜਾਅ 1 / 5', 'Personal Profile & Resources': 'ਨਿੱਜੀ ਪ੍ਰੋਫਾਈਲ ਅਤੇ ਸਰੋਤ', 'Tell us about your background and available operational assets.': 'ਆਪਣੀ ਪਿਛੋਕੜ ਅਤੇ ਉਪਲਬਧ ਕਾਰਜਕਾਰੀ ਸਰੋਤਾਂ ਬਾਰੇ ਦੱਸੋ।', 'Personal Background': 'ਨਿੱਜੀ ਪਿਛੋਕੜ', 'Resources You Can Use (Multi-Select)': 'ਤੁਸੀਂ ਵਰਤ ਸਕਦੇ ਸਰੋਤ (ਇੱਕ ਤੋਂ ਵੱਧ ਚੁਣੋ)', 'Time Commitment': 'ਸਮੇਂ ਦੀ ਵਚਨਬੱਧਤਾ', 'Age Group': 'ਉਮਰ ਸਮੂਹ', 'Education Level': 'ਸਿੱਖਿਆ ਪੱਧਰ', 'Current Occupation': 'ਮੌਜੂਦਾ ਕਿੱਤਾ', 'Prior Business Experience': 'ਪਿਛਲਾ ਕਾਰੋਬਾਰੀ ਤਜਰਬਾ', 'Existing Monthly Loan EMI (₹)': 'ਮੌਜੂਦਾ ਮਹੀਨਾਵਾਰ ਕਰਜ਼ਾ EMI (₹)', 'Own land': 'ਆਪਣੀ ਜ਼ਮੀਨ', 'Shop/workspace': 'ਦੁਕਾਨ/ਕੰਮ ਦੀ ਜਗ੍ਹਾ', 'Vehicle': 'ਵਾਹਨ', 'Electricity': 'ਬਿਜਲੀ', 'Storage': 'ਸਟੋਰੇਜ', 'Machinery/equipment': 'ਮਸ਼ੀਨਰੀ/ਉਪਕਰਨ', 'Family labour': 'ਪਰਿਵਾਰਕ ਮਜ਼ਦੂਰੀ', 'Existing customers': 'ਮੌਜੂਦਾ ਗਾਹਕ'
  }
};

const PROFILE_OPTION_COPY = {
  hi: { 'Select age group': 'आयु वर्ग चुनें', '18–24 years': '18–24 वर्ष', '25–34 years': '25–34 वर्ष', '35–44 years': '35–44 वर्ष', '45+ years': '45+ वर्ष', 'Select education level': 'शिक्षा स्तर चुनें', 'Primary School': 'प्राथमिक विद्यालय', 'Secondary (Class 10/12)': 'माध्यमिक (कक्षा 10/12)', 'Graduate / Higher': 'स्नातक / उच्च', 'No Formal Education': 'कोई औपचारिक शिक्षा नहीं', 'e.g. Agriculture / Self-employed': 'जैसे कृषि / स्व-रोज़गार', 'Select experience': 'अनुभव चुनें', 'None (First-time)': 'कोई नहीं (पहली बार)', '0–2 years': '0–2 वर्ष', '3–5 years': '3–5 वर्ष', '5+ years': '5+ वर्ष' },
  mr: { 'Select age group': 'वयोगट निवडा', '18–24 years': '18–24 वर्षे', '25–34 years': '25–34 वर्षे', '35–44 years': '35–44 वर्षे', '45+ years': '45+ वर्षे', 'Select education level': 'शिक्षणाची पातळी निवडा', 'Primary School': 'प्राथमिक शाळा', 'Secondary (Class 10/12)': 'माध्यमिक (इयत्ता 10/12)', 'Graduate / Higher': 'पदवीधर / उच्च', 'No Formal Education': 'औपचारिक शिक्षण नाही', 'e.g. Agriculture / Self-employed': 'उदा. शेती / स्वयंरोजगार', 'Select experience': 'अनुभव निवडा', 'None (First-time)': 'काही नाही (पहिल्यांदा)', '0–2 years': '0–2 वर्षे', '3–5 years': '3–5 वर्षे', '5+ years': '5+ वर्षे' },
  ta: { 'Select age group': 'வயது குழுவைத் தேர்ந்தெடுக்கவும்', '18–24 years': '18–24 வயது', '25–34 years': '25–34 வயது', '35–44 years': '35–44 வயது', '45+ years': '45+ வயது', 'Select education level': 'கல்வி நிலையைத் தேர்ந்தெடுக்கவும்', 'Primary School': 'தொடக்கப் பள்ளி', 'Secondary (Class 10/12)': 'இடைநிலை (வகுப்பு 10/12)', 'Graduate / Higher': 'பட்டதாரி / உயர்', 'No Formal Education': 'முறையான கல்வி இல்லை', 'e.g. Agriculture / Self-employed': 'எ.கா. விவசாயம் / சுயதொழில்', 'Select experience': 'அனுபவத்தைத் தேர்ந்தெடுக்கவும்', 'None (First-time)': 'எதுவுமில்லை (முதல் முறை)', '0–2 years': '0–2 ஆண்டுகள்', '3–5 years': '3–5 ஆண்டுகள்', '5+ years': '5+ ஆண்டுகள்' },
  te: { 'Select age group': 'వయస్సు వర్గాన్ని ఎంచుకోండి', '18–24 years': '18–24 సంవత్సరాలు', '25–34 years': '25–34 సంవత్సరాలు', '35–44 years': '35–44 సంవత్సరాలు', '45+ years': '45+ సంవత్సరాలు', 'Select education level': 'విద్యా స్థాయిని ఎంచుకోండి', 'Primary School': 'ప్రాథమిక పాఠశాల', 'Secondary (Class 10/12)': 'మాధ్యమిక (10/12 తరగతి)', 'Graduate / Higher': 'గ్రాడ్యుయేట్ / ఉన్నత', 'No Formal Education': 'సాంప్రదాయిక విద్య లేదు', 'e.g. Agriculture / Self-employed': 'ఉదా. వ్యవసాయం / స్వయం ఉపాధి', 'Select experience': 'అనుభవాన్ని ఎంచుకోండి', 'None (First-time)': 'ఏదీ లేదు (మొదటిసారి)', '0–2 years': '0–2 సంవత్సరాలు', '3–5 years': '3–5 సంవత్సరాలు', '5+ years': '5+ సంవత్సరాలు' },
  kn: { 'Select age group': 'ವಯೋಮಾನದ ಗುಂಪನ್ನು ಆಯ್ಕೆಮಾಡಿ', '18–24 years': '18–24 ವರ್ಷಗಳು', '25–34 years': '25–34 ವರ್ಷಗಳು', '35–44 years': '35–44 ವರ್ಷಗಳು', '45+ years': '45+ ವರ್ಷಗಳು', 'Select education level': 'ಶಿಕ್ಷಣದ ಮಟ್ಟವನ್ನು ಆಯ್ಕೆಮಾಡಿ', 'Primary School': 'ಪ್ರಾಥಮಿಕ ಶಾಲೆ', 'Secondary (Class 10/12)': 'ಮಾಧ್ಯಮಿಕ (ತರಗತಿ 10/12)', 'Graduate / Higher': 'ಪದವೀಧರ / ಉನ್ನತ', 'No Formal Education': 'ಔಪಚಾರಿಕ ಶಿಕ್ಷಣವಿಲ್ಲ', 'e.g. Agriculture / Self-employed': 'ಉದಾ. ಕೃಷಿ / ಸ್ವಯಂ ಉದ್ಯೋಗ', 'Select experience': 'ಅನುಭವವನ್ನು ಆಯ್ಕೆಮಾಡಿ', 'None (First-time)': 'ಯಾವುದೂ ಇಲ್ಲ (ಮೊದಲ ಬಾರಿ)', '0–2 years': '0–2 ವರ್ಷಗಳು', '3–5 years': '3–5 ವರ್ಷಗಳು', '5+ years': '5+ ವರ್ಷಗಳು' },
  bn: { 'Select age group': 'বয়সের বিভাগ নির্বাচন করুন', '18–24 years': '১৮–২৪ বছর', '25–34 years': '২৫–৩৪ বছর', '35–44 years': '৩৫–৪৪ বছর', '45+ years': '৪৫+ বছর', 'Select education level': 'শিক্ষার স্তর নির্বাচন করুন', 'Primary School': 'প্রাথমিক বিদ্যালয়', 'Secondary (Class 10/12)': 'মাধ্যমিক (দশম/দ্বাদশ শ্রেণি)', 'Graduate / Higher': 'স্নাতক / উচ্চতর', 'No Formal Education': 'প্রাতিষ্ঠানিক শিক্ষা নেই', 'e.g. Agriculture / Self-employed': 'যেমন কৃষি / স্বনিয়োজিত', 'Select experience': 'অভিজ্ঞতা নির্বাচন করুন', 'None (First-time)': 'কোনও অভিজ্ঞতা নেই (প্রথমবার)', '0–2 years': '০–২ বছর', '3–5 years': '৩–৫ বছর', '5+ years': '৫+ বছর' },
  gu: { 'Select age group': 'ઉંમર જૂથ પસંદ કરો', '18–24 years': '18–24 વર્ષ', '25–34 years': '25–34 વર્ષ', '35–44 years': '35–44 વર્ષ', '45+ years': '45+ વર્ષ', 'Select education level': 'શિક્ષણનું સ્તર પસંદ કરો', 'Primary School': 'પ્રાથમિક શાળા', 'Secondary (Class 10/12)': 'માધ્યમિક (ધોરણ 10/12)', 'Graduate / Higher': 'સ્નાતક / ઉચ્ચ', 'No Formal Education': 'ઔપચારિક શિક્ષણ નથી', 'e.g. Agriculture / Self-employed': 'દા.ત. ખેતી / સ્વરોજગાર', 'Select experience': 'અનુભવ પસંદ કરો', 'None (First-time)': 'કોઈ નહીં (પ્રથમ વખત)', '0–2 years': '0–2 વર્ષ', '3–5 years': '3–5 વર્ષ', '5+ years': '5+ વર્ષ' },
  pa: { 'Select age group': 'ਉਮਰ ਸਮੂਹ ਚੁਣੋ', '18–24 years': '18–24 ਸਾਲ', '25–34 years': '25–34 ਸਾਲ', '35–44 years': '35–44 ਸਾਲ', '45+ years': '45+ ਸਾਲ', 'Select education level': 'ਸਿੱਖਿਆ ਪੱਧਰ ਚੁਣੋ', 'Primary School': 'ਪ੍ਰਾਇਮਰੀ ਸਕੂਲ', 'Secondary (Class 10/12)': 'ਸੈਕੰਡਰੀ (ਜਮਾਤ 10/12)', 'Graduate / Higher': 'ਗ੍ਰੈਜੂਏਟ / ਉੱਚ', 'No Formal Education': 'ਕੋਈ ਰਸਮੀ ਸਿੱਖਿਆ ਨਹੀਂ', 'e.g. Agriculture / Self-employed': 'ਜਿਵੇਂ ਖੇਤੀਬਾੜੀ / ਸਵੈ-ਰੋਜ਼ਗਾਰ', 'Select experience': 'ਤਜਰਬਾ ਚੁਣੋ', 'None (First-time)': 'ਕੋਈ ਨਹੀਂ (ਪਹਿਲੀ ਵਾਰ)', '0–2 years': '0–2 ਸਾਲ', '3–5 years': '3–5 ਸਾਲ', '5+ years': '5+ ਸਾਲ' }
};

const READINESS_QUESTION_COPY = {
  hi: {
    'Do you currently own cattle?': 'क्या आपके पास वर्तमान में मवेशी हैं?', 'How many cattle can you start with?': 'आप कितने मवेशियों के साथ शुरुआत कर सकते हैं?', 'Do you have a reliable fodder source?': 'क्या आपके पास चारे का भरोसेमंद स्रोत है?', 'Is adequate water available year-round?': 'क्या पूरे वर्ष पर्याप्त पानी उपलब्ध है?', 'Do you have access to refrigeration?': 'क्या आपके पास प्रशीतन की सुविधा है?', 'Is there a milk collection centre nearby?': 'क्या पास में दूध संग्रह केंद्र है?', 'How many reliable buyers have you identified?': 'आपने कितने भरोसेमंद खरीदारों की पहचान की है?',
    'Do you have prior poultry-rearing experience?': 'क्या आपको मुर्गी पालन का पूर्व अनुभव है?', 'How many birds can you start with?': 'आप कितने पक्षियों के साथ शुरुआत कर सकते हैं?', 'Do you have reliable feed supply access?': 'क्या आपके पास भरोसेमंद चारा आपूर्ति उपलब्ध है?', 'Do you have access to veterinary support?': 'क्या आपको पशु चिकित्सा सहायता उपलब्ध है?', 'Do you have a secure, ventilated shed/enclosure?': 'क्या आपके पास सुरक्षित और हवादार शेड या बाड़ा है?', 'Is there a nearby market or trader for sale?': 'क्या बिक्री के लिए पास में बाजार या व्यापारी है?', 'How many reliable buyers/traders have you identified?': 'आपने कितने भरोसेमंद खरीदारों या व्यापारियों की पहचान की है?',
    'Do you have tailoring/stitching skill or training?': 'क्या आपको सिलाई का कौशल या प्रशिक्षण है?', 'Do you own a sewing machine?': 'क्या आपके पास सिलाई मशीन है?', 'Do you have a dedicated workspace?': 'क्या आपके पास अलग कार्यस्थल है?', 'Do you have prior paid stitching orders/experience?': 'क्या आपको भुगतान वाले सिलाई ऑर्डर या अनुभव है?', 'Do you have a reliable fabric/material supplier?': 'क्या आपके पास भरोसेमंद कपड़ा या सामग्री आपूर्तिकर्ता है?', 'Is there demand for alteration/custom stitching nearby?': 'क्या आसपास कपड़ों की मरम्मत या कस्टम सिलाई की मांग है?', 'How many regular customers have you identified?': 'आपने कितने नियमित ग्राहकों की पहचान की है?',
    'Do you have prior milling experience?': 'क्या आपको मिल चलाने का पूर्व अनुभव है?', 'Do you have access to a suitable workspace/shed?': 'क्या आपके पास उपयुक्त कार्यस्थल या शेड उपलब्ध है?', 'Is reliable electricity available?': 'क्या भरोसेमंद बिजली उपलब्ध है?', 'Do you have funds/access for milling machinery?': 'क्या आपके पास मिल मशीनरी के लिए धन या पहुंच है?', 'Is there sufficient local grain-growing activity nearby?': 'क्या आसपास पर्याप्त स्थानीय अनाज उत्पादन होता है?', 'Do you have transport access for grain/flour?': 'क्या आपके पास अनाज या आटे के परिवहन की सुविधा है?', 'How many households have you confirmed as regular customers?': 'आपने कितने परिवारों को नियमित ग्राहक के रूप में निश्चित किया है?',
    'Do you have mechanical/repair training or experience?': 'क्या आपको मैकेनिक या मरम्मत का प्रशिक्षण या अनुभव है?', 'Do you own basic repair tools?': 'क्या आपके पास बुनियादी मरम्मत उपकरण हैं?', 'Do you have a workshop or roadside space secured?': 'क्या आपने कार्यशाला या सड़क किनारे की जगह सुरक्षित की है?', 'Do you have a reliable spare-parts supplier?': 'क्या आपके पास भरोसेमंद स्पेयर पार्ट्स आपूर्तिकर्ता है?', 'Is there significant two-wheeler traffic/ownership in the area?': 'क्या क्षेत्र में दोपहिया वाहनों की पर्याप्त आवाजाही या स्वामित्व है?', 'Do you have experience with common repair jobs?': 'क्या आपको सामान्य मरम्मत कार्यों का अनुभव है?'
  },
  mr: {
    'Do you have tailoring/stitching skill or training?': 'तुम्हाला शिंपीकामाचे कौशल्य किंवा प्रशिक्षण आहे का?', 'Do you own a sewing machine?': 'तुमच्याकडे शिवणयंत्र आहे का?', 'Do you have a dedicated workspace?': 'तुमच्याकडे स्वतंत्र कार्यस्थळ आहे का?', 'Do you have prior paid stitching orders/experience?': 'तुम्हाला सशुल्क शिंपीकामाच्या ऑर्डरचा किंवा अनुभव आहे का?', 'Do you have a reliable fabric/material supplier?': 'तुमच्याकडे विश्वासार्ह कापड किंवा साहित्य पुरवठादार आहे का?', 'Is there demand for alteration/custom stitching nearby?': 'जवळ कपडे दुरुस्ती किंवा कस्टम शिंपीकामाची मागणी आहे का?', 'How many regular customers have you identified?': 'तुम्ही किती नियमित ग्राहक ओळखले आहेत?'
  },
  ta: {
    'Do you have tailoring/stitching skill or training?': 'உங்களுக்கு தையல் திறன் அல்லது பயிற்சி உள்ளதா?', 'Do you own a sewing machine?': 'உங்களிடம் தையல் இயந்திரம் உள்ளதா?', 'Do you have a dedicated workspace?': 'உங்களுக்கென தனி பணியிடம் உள்ளதா?', 'Do you have prior paid stitching orders/experience?': 'கட்டண தையல் ஆர்டர்கள் அல்லது அனுபவம் உள்ளதா?', 'Do you have a reliable fabric/material supplier?': 'நம்பகமான துணி அல்லது பொருள் வழங்குநர் உள்ளாரா?', 'Is there demand for alteration/custom stitching nearby?': 'அருகில் ஆடை மாற்றம் அல்லது தனிப்பயன் தையலுக்கான தேவை உள்ளதா?', 'How many regular customers have you identified?': 'எத்தனை வழக்கமான வாடிக்கையாளர்களை அடையாளம் கண்டுள்ளீர்கள்?'
  },
  te: {
    'Do you have tailoring/stitching skill or training?': 'మీకు టైలరింగ్ లేదా కుట్టు నైపుణ్యం, శిక్షణ ఉందా?', 'Do you own a sewing machine?': 'మీ వద్ద కుట్టు యంత్రం ఉందా?', 'Do you have a dedicated workspace?': 'మీకు ప్రత్యేక పని స్థలం ఉందా?', 'Do you have prior paid stitching orders/experience?': 'మీకు చెల్లింపు కుట్టు ఆర్డర్లు లేదా అనుభవం ఉందా?', 'Do you have a reliable fabric/material supplier?': 'మీకు నమ్మకమైన వస్త్ర లేదా సామగ్రి సరఫరాదారు ఉన్నారా?', 'Is there demand for alteration/custom stitching nearby?': 'సమీపంలో మార్పులు లేదా కస్టమ్ కుట్టుకు డిమాండ్ ఉందా?', 'How many regular customers have you identified?': 'ఎంతమంది సాధారణ కస్టమర్లను గుర్తించారు?'
  },
  kn: {
    'Do you have tailoring/stitching skill or training?': 'ನಿಮಗೆ ಹೊಲಿಗೆ ಕೌಶಲ್ಯ ಅಥವಾ ತರಬೇತಿ ಇದೆಯೇ?', 'Do you own a sewing machine?': 'ನಿಮ್ಮ ಬಳಿ ಹೊಲಿಗೆ ಯಂತ್ರವಿದೆಯೇ?', 'Do you have a dedicated workspace?': 'ನಿಮಗೆ ಪ್ರತ್ಯೇಕ ಕೆಲಸದ ಸ್ಥಳವಿದೆಯೇ?', 'Do you have prior paid stitching orders/experience?': 'ಪಾವತಿಸಿದ ಹೊಲಿಗೆ ಆರ್ಡರ್ ಅಥವಾ ಅನುಭವವಿದೆಯೇ?', 'Do you have a reliable fabric/material supplier?': 'ವಿಶ್ವಾಸಾರ್ಹ ಬಟ್ಟೆ ಅಥವಾ ಸಾಮಗ್ರಿ ಪೂರೈಕೆದಾರರಿದ್ದಾರೆಯೇ?', 'Is there demand for alteration/custom stitching nearby?': 'ಹತ್ತಿರದಲ್ಲಿ ಬಟ್ಟೆ ಬದಲಾವಣೆ ಅಥವಾ ಕಸ್ಟಮ್ ಹೊಲಿಗೆಗೆ ಬೇಡಿಕೆಯಿದೆಯೇ?', 'How many regular customers have you identified?': 'ಎಷ್ಟು ನಿಯಮಿತ ಗ್ರಾಹಕರನ್ನು ಗುರುತಿಸಿದ್ದೀರಿ?'
  },
  bn: {
    'Do you have tailoring/stitching skill or training?': 'আপনার কি সেলাইয়ের দক্ষতা বা প্রশিক্ষণ আছে?', 'Do you own a sewing machine?': 'আপনার কি সেলাই মেশিন আছে?', 'Do you have a dedicated workspace?': 'আপনার কি নির্দিষ্ট কাজের জায়গা আছে?', 'Do you have prior paid stitching orders/experience?': 'আপনার কি পেইড সেলাইয়ের অর্ডার বা অভিজ্ঞতা আছে?', 'Do you have a reliable fabric/material supplier?': 'আপনার কি নির্ভরযোগ্য কাপড় বা উপকরণ সরবরাহকারী আছে?', 'Is there demand for alteration/custom stitching nearby?': 'কাছাকাছি কি পোশাক পরিবর্তন বা কাস্টম সেলাইয়ের চাহিদা আছে?', 'How many regular customers have you identified?': 'আপনি কতজন নিয়মিত গ্রাহক চিহ্নিত করেছেন?'
  },
  gu: {
    'Do you have tailoring/stitching skill or training?': 'શું તમારી પાસે ટેલરિંગનું કૌશલ્ય અથવા તાલીમ છે?', 'Do you own a sewing machine?': 'શું તમારી પાસે સીવણ મશીન છે?', 'Do you have a dedicated workspace?': 'શું તમારી પાસે અલગ કાર્યસ્થળ છે?', 'Do you have prior paid stitching orders/experience?': 'શું તમને ચૂકવેલ સીવણ ઓર્ડર અથવા અનુભવ છે?', 'Do you have a reliable fabric/material supplier?': 'શું તમારી પાસે વિશ્વસનીય કાપડ અથવા સામગ્રી સપ્લાયર છે?', 'Is there demand for alteration/custom stitching nearby?': 'શું નજીકમાં કપડાંના ફેરફાર અથવા કસ્ટમ સીવણની માંગ છે?', 'How many regular customers have you identified?': 'તમે કેટલા નિયમિત ગ્રાહકો ઓળખ્યા છે?'
  },
  pa: {
    'Do you have tailoring/stitching skill or training?': 'ਕੀ ਤੁਹਾਡੇ ਕੋਲ ਸਿਲਾਈ ਦਾ ਹੁਨਰ ਜਾਂ ਸਿਖਲਾਈ ਹੈ?', 'Do you own a sewing machine?': 'ਕੀ ਤੁਹਾਡੇ ਕੋਲ ਸਿਲਾਈ ਮਸ਼ੀਨ ਹੈ?', 'Do you have a dedicated workspace?': 'ਕੀ ਤੁਹਾਡੇ ਕੋਲ ਵੱਖਰੀ ਕੰਮ ਵਾਲੀ ਥਾਂ ਹੈ?', 'Do you have prior paid stitching orders/experience?': 'ਕੀ ਤੁਹਾਡੇ ਕੋਲ ਭੁਗਤਾਨ ਵਾਲੇ ਸਿਲਾਈ ਆਰਡਰ ਜਾਂ ਤਜਰਬਾ ਹੈ?', 'Do you have a reliable fabric/material supplier?': 'ਕੀ ਤੁਹਾਡੇ ਕੋਲ ਭਰੋਸੇਯੋਗ ਕੱਪੜੇ ਜਾਂ ਸਮੱਗਰੀ ਦਾ ਸਪਲਾਇਰ ਹੈ?', 'Is there demand for alteration/custom stitching nearby?': 'ਕੀ ਨੇੜੇ ਕੱਪੜਿਆਂ ਦੀ ਸੋਧ ਜਾਂ ਕਸਟਮ ਸਿਲਾਈ ਦੀ ਮੰਗ ਹੈ?', 'How many regular customers have you identified?': 'ਤੁਸੀਂ ਕਿੰਨੇ ਨਿਯਮਿਤ ਗਾਹਕ ਪਛਾਣੇ ਹਨ?'
  }
};

const POULTRY_QUESTION_COPY = {
  hi: { 'Do you have prior poultry-rearing experience?': 'क्या आपको मुर्गी पालन का पूर्व अनुभव है?', 'How many birds can you start with?': 'आप कितने पक्षियों के साथ शुरुआत कर सकते हैं?', 'Do you have reliable feed supply access?': 'क्या आपके पास भरोसेमंद चारा आपूर्ति उपलब्ध है?', 'Do you have access to veterinary support?': 'क्या आपको पशु चिकित्सा सहायता उपलब्ध है?', 'Do you have a secure, ventilated shed/enclosure?': 'क्या आपके पास सुरक्षित और हवादार शेड या बाड़ा है?', 'Is there a nearby market or trader for sale?': 'क्या बिक्री के लिए पास में बाजार या व्यापारी है?', 'How many reliable buyers/traders have you identified?': 'आपने कितने भरोसेमंद खरीदारों या व्यापारियों की पहचान की है?' },
  mr: { 'Do you have prior poultry-rearing experience?': 'तुम्हाला कुक्कुटपालनाचा पूर्व अनुभव आहे का?', 'How many birds can you start with?': 'तुम्ही किती पक्ष्यांपासून सुरुवात करू शकता?', 'Do you have reliable feed supply access?': 'तुमच्याकडे विश्वासार्ह खाद्यपुरवठ्याची सुविधा आहे का?', 'Do you have access to veterinary support?': 'तुम्हाला पशुवैद्यकीय मदत मिळू शकते का?', 'Do you have a secure, ventilated shed/enclosure?': 'तुमच्याकडे सुरक्षित आणि हवेशीर शेड किंवा कुंपण आहे का?', 'Is there a nearby market or trader for sale?': 'विक्रीसाठी जवळ बाजार किंवा व्यापारी आहे का?', 'How many reliable buyers/traders have you identified?': 'तुम्ही किती विश्वासार्ह खरेदीदार किंवा व्यापारी ओळखले आहेत?' },
  ta: { 'Do you have prior poultry-rearing experience?': 'உங்களுக்கு கோழி வளர்ப்பு அனுபவம் உள்ளதா?', 'How many birds can you start with?': 'எத்தனை பறவைகளுடன் தொடங்க முடியும்?', 'Do you have reliable feed supply access?': 'நம்பகமான தீவன விநியோகம் கிடைக்கிறதா?', 'Do you have access to veterinary support?': 'கால்நடை மருத்துவ உதவி கிடைக்கிறதா?', 'Do you have a secure, ventilated shed/enclosure?': 'பாதுகாப்பான காற்றோட்டமான கொட்டகை அல்லது கூண்டு உள்ளதா?', 'Is there a nearby market or trader for sale?': 'விற்பனைக்கு அருகில் சந்தை அல்லது வணிகர் உள்ளாரா?', 'How many reliable buyers/traders have you identified?': 'எத்தனை நம்பகமான வாங்குபவர்கள் அல்லது வணிகர்களை அடையாளம் கண்டுள்ளீர்கள்?' },
  te: { 'Do you have prior poultry-rearing experience?': 'మీకు కోళ్ల పెంపకంలో మునుపటి అనుభవం ఉందా?', 'How many birds can you start with?': 'మీరు ఎన్ని పక్షులతో ప్రారంభించగలరు?', 'Do you have reliable feed supply access?': 'మీకు నమ్మకమైన మేత సరఫరా అందుబాటులో ఉందా?', 'Do you have access to veterinary support?': 'పశువైద్య సహాయం మీకు అందుబాటులో ఉందా?', 'Do you have a secure, ventilated shed/enclosure?': 'మీకు సురక్షితమైన, గాలి ప్రసరణ ఉన్న షెడ్ లేదా ఆవరణ ఉందా?', 'Is there a nearby market or trader for sale?': 'విక్రయానికి సమీపంలో మార్కెట్ లేదా వ్యాపారి ఉన్నారా?', 'How many reliable buyers/traders have you identified?': 'ఎంతమంది నమ్మకమైన కొనుగోలుదారులు లేదా వ్యాపారులను గుర్తించారు?' },
  kn: { 'Do you have prior poultry-rearing experience?': 'ನಿಮಗೆ ಕೋಳಿ ಸಾಕಾಣಿಕೆಯ ಹಿಂದಿನ ಅನುಭವವಿದೆಯೇ?', 'How many birds can you start with?': 'ಎಷ್ಟು ಪಕ್ಷಿಗಳೊಂದಿಗೆ ಪ್ರಾರಂಭಿಸಬಹುದು?', 'Do you have reliable feed supply access?': 'ವಿಶ್ವಾಸಾರ್ಹ ಆಹಾರ ಪೂರೈಕೆ ಲಭ್ಯವಿದೆಯೇ?', 'Do you have access to veterinary support?': 'ಪಶುವೈದ್ಯಕೀಯ ಸಹಾಯ ಲಭ್ಯವಿದೆಯೇ?', 'Do you have a secure, ventilated shed/enclosure?': 'ಸುರಕ್ಷಿತ, ಗಾಳಿ ಹರಿಯುವ ಶೆಡ್ ಅಥವಾ ಆವರಣವಿದೆಯೇ?', 'Is there a nearby market or trader for sale?': 'ಮಾರಾಟಕ್ಕೆ ಹತ್ತಿರದಲ್ಲಿ ಮಾರುಕಟ್ಟೆ ಅಥವಾ ವ್ಯಾಪಾರಿ ಇದ್ದಾರೆಯೇ?', 'How many reliable buyers/traders have you identified?': 'ಎಷ್ಟು ವಿಶ್ವಾಸಾರ್ಹ ಖರೀದಿದಾರರು ಅಥವಾ ವ್ಯಾಪಾರಿಗಳನ್ನು ಗುರುತಿಸಿದ್ದೀರಿ?' },
  bn: { 'Do you have prior poultry-rearing experience?': 'আপনার কি পোলট্রি পালনের পূর্ব অভিজ্ঞতা আছে?', 'How many birds can you start with?': 'আপনি কতগুলি পাখি দিয়ে শুরু করতে পারেন?', 'Do you have reliable feed supply access?': 'আপনার কি নির্ভরযোগ্য খাদ্য সরবরাহের ব্যবস্থা আছে?', 'Do you have access to veterinary support?': 'আপনার কি পশুচিকিৎসা সহায়তা পাওয়ার সুযোগ আছে?', 'Do you have a secure, ventilated shed/enclosure?': 'আপনার কি নিরাপদ ও বায়ুচলাচলযুক্ত শেড বা ঘের আছে?', 'Is there a nearby market or trader for sale?': 'বিক্রির জন্য কি কাছাকাছি বাজার বা ব্যবসায়ী আছে?', 'How many reliable buyers/traders have you identified?': 'আপনি কতজন নির্ভরযোগ্য ক্রেতা বা ব্যবসায়ী চিহ্নিত করেছেন?' },
  gu: { 'Do you have prior poultry-rearing experience?': 'શું તમને મરઘાં ઉછેરનો અગાઉનો અનુભવ છે?', 'How many birds can you start with?': 'તમે કેટલા પક્ષીઓથી શરૂઆત કરી શકો છો?', 'Do you have reliable feed supply access?': 'શું તમારી પાસે વિશ્વસનીય ચારા પુરવઠાની સુવિધા છે?', 'Do you have access to veterinary support?': 'શું તમને પશુચિકિત્સા સહાય મળી શકે છે?', 'Do you have a secure, ventilated shed/enclosure?': 'શું તમારી પાસે સુરક્ષિત અને હવાવાળું શેડ અથવા ઘેરો છે?', 'Is there a nearby market or trader for sale?': 'શું વેચાણ માટે નજીકમાં બજાર અથવા વેપારી છે?', 'How many reliable buyers/traders have you identified?': 'તમે કેટલા વિશ્વસનીય ખરીદદારો અથવા વેપારીઓ ઓળખ્યા છે?' },
  pa: { 'Do you have prior poultry-rearing experience?': 'ਕੀ ਤੁਹਾਡੇ ਕੋਲ ਪੋਲਟਰੀ ਪਾਲਣ ਦਾ ਪਿਛਲਾ ਤਜਰਬਾ ਹੈ?', 'How many birds can you start with?': 'ਤੁਸੀਂ ਕਿੰਨੇ ਪੰਛੀਆਂ ਨਾਲ ਸ਼ੁਰੂ ਕਰ ਸਕਦੇ ਹੋ?', 'Do you have reliable feed supply access?': 'ਕੀ ਤੁਹਾਡੇ ਕੋਲ ਭਰੋਸੇਯੋਗ ਚਾਰੇ ਦੀ ਸਪਲਾਈ ਉਪਲਬਧ ਹੈ?', 'Do you have access to veterinary support?': 'ਕੀ ਤੁਹਾਨੂੰ ਪਸ਼ੂ ਡਾਕਟਰੀ ਸਹਾਇਤਾ ਮਿਲ ਸਕਦੀ ਹੈ?', 'Do you have a secure, ventilated shed/enclosure?': 'ਕੀ ਤੁਹਾਡੇ ਕੋਲ ਸੁਰੱਖਿਅਤ ਅਤੇ ਹਵਾਦਾਰ ਸ਼ੈੱਡ ਜਾਂ ਘੇਰਾ ਹੈ?', 'Is there a nearby market or trader for sale?': 'ਕੀ ਵਿਕਰੀ ਲਈ ਨੇੜੇ ਕੋਈ ਬਾਜ਼ਾਰ ਜਾਂ ਵਪਾਰੀ ਹੈ?', 'How many reliable buyers/traders have you identified?': 'ਤੁਸੀਂ ਕਿੰਨੇ ਭਰੋਸੇਯੋਗ ਖਰੀਦਦਾਰ ਜਾਂ ਵਪਾਰੀ ਪਛਾਣੇ ਹਨ?' }
};

const OTHER_READINESS_QUESTION_COPY = {
  hi: {
    'Do you have prior milling experience?': 'क्या आपको मिल चलाने का पूर्व अनुभव है?', 'Do you have access to a suitable workspace/shed?': 'क्या आपके पास उपयुक्त कार्यस्थल या शेड उपलब्ध है?', 'Is reliable electricity available?': 'क्या भरोसेमंद बिजली उपलब्ध है?', 'Do you have funds/access for milling machinery?': 'क्या आपके पास मिल मशीनरी के लिए धन या पहुंच है?', 'Is there sufficient local grain-growing activity nearby?': 'क्या आसपास पर्याप्त स्थानीय अनाज उत्पादन होता है?', 'Do you have transport access for grain/flour?': 'क्या आपके पास अनाज या आटे के परिवहन की सुविधा है?', 'How many households have you confirmed as regular customers?': 'आपने कितने परिवारों को नियमित ग्राहक के रूप में निश्चित किया है?',
    'Do you have mechanical/repair training or experience?': 'क्या आपको मैकेनिक या मरम्मत का प्रशिक्षण या अनुभव है?', 'Do you own basic repair tools?': 'क्या आपके पास बुनियादी मरम्मत उपकरण हैं?', 'Do you have a workshop or roadside space secured?': 'क्या आपने कार्यशाला या सड़क किनारे की जगह सुरक्षित की है?', 'Do you have a reliable spare-parts supplier?': 'क्या आपके पास भरोसेमंद स्पेयर पार्ट्स आपूर्तिकर्ता है?', 'Is there significant two-wheeler traffic/ownership in the area?': 'क्या क्षेत्र में दोपहिया वाहनों की पर्याप्त आवाजाही या स्वामित्व है?', 'Do you have experience with common repair jobs?': 'क्या आपको सामान्य मरम्मत कार्यों का अनुभव है?', 'How many regular customers have you identified?': 'आपने कितने नियमित ग्राहकों की पहचान की है?'
  },
  mr: {
    'Do you have prior milling experience?': 'तुम्हाला गिरणी चालवण्याचा पूर्व अनुभव आहे का?', 'Do you have access to a suitable workspace/shed?': 'तुमच्याकडे योग्य कार्यस्थळ किंवा शेड उपलब्ध आहे का?', 'Is reliable electricity available?': 'विश्वासार्ह वीज उपलब्ध आहे का?', 'Do you have funds/access for milling machinery?': 'गिरणी यंत्रसामग्रीसाठी तुमच्याकडे निधी किंवा सुविधा आहे का?', 'Is there sufficient local grain-growing activity nearby?': 'जवळपास पुरेसे स्थानिक धान्य उत्पादन होते का?', 'Do you have transport access for grain/flour?': 'धान्य किंवा पिठाच्या वाहतुकीची सुविधा आहे का?', 'How many households have you confirmed as regular customers?': 'तुम्ही किती कुटुंबांना नियमित ग्राहक म्हणून निश्चित केले आहे?',
    'Do you have mechanical/repair training or experience?': 'तुम्हाला यांत्रिकी किंवा दुरुस्तीचे प्रशिक्षण किंवा अनुभव आहे का?', 'Do you own basic repair tools?': 'तुमच्याकडे मूलभूत दुरुस्तीची साधने आहेत का?', 'Do you have a workshop or roadside space secured?': 'तुम्ही कार्यशाळा किंवा रस्त्यालगतची जागा निश्चित केली आहे का?', 'Do you have a reliable spare-parts supplier?': 'तुमच्याकडे विश्वासार्ह सुटे भाग पुरवठादार आहे का?', 'Is there significant two-wheeler traffic/ownership in the area?': 'या परिसरात दुचाकींची लक्षणीय वाहतूक किंवा मालकी आहे का?', 'Do you have experience with common repair jobs?': 'तुम्हाला सामान्य दुरुस्तीच्या कामांचा अनुभव आहे का?', 'How many regular customers have you identified?': 'तुम्ही किती नियमित ग्राहक ओळखले आहेत?'
  },
  ta: {
    'Do you have prior milling experience?': 'உங்களுக்கு ஆலை இயக்கிய முன் அனுபவம் உள்ளதா?', 'Do you have access to a suitable workspace/shed?': 'பொருத்தமான பணியிடம் அல்லது கொட்டகை கிடைக்கிறதா?', 'Is reliable electricity available?': 'நம்பகமான மின்சாரம் கிடைக்கிறதா?', 'Do you have funds/access for milling machinery?': 'ஆலை இயந்திரங்களுக்கான நிதி அல்லது அணுகல் உள்ளதா?', 'Is there sufficient local grain-growing activity nearby?': 'அருகில் போதுமான உள்ளூர் தானிய உற்பத்தி உள்ளதா?', 'Do you have transport access for grain/flour?': 'தானியம் அல்லது மாவு போக்குவரத்து வசதி உள்ளதா?', 'How many households have you confirmed as regular customers?': 'எத்தனை குடும்பங்களை வழக்கமான வாடிக்கையாளர்களாக உறுதி செய்துள்ளீர்கள்?',
    'Do you have mechanical/repair training or experience?': 'இயந்திர அல்லது பழுதுபார்ப்பு பயிற்சி அல்லது அனுபவம் உள்ளதா?', 'Do you own basic repair tools?': 'அடிப்படை பழுதுபார்ப்பு கருவிகள் உங்களிடம் உள்ளதா?', 'Do you have a workshop or roadside space secured?': 'பணிமனை அல்லது சாலையோர இடத்தை உறுதி செய்துள்ளீர்களா?', 'Do you have a reliable spare-parts supplier?': 'நம்பகமான உதிரிபாக வழங்குநர் உள்ளாரா?', 'Is there significant two-wheeler traffic/ownership in the area?': 'இப்பகுதியில் இருசக்கர வாகன போக்குவரத்து அல்லது உரிமை அதிகமாக உள்ளதா?', 'Do you have experience with common repair jobs?': 'பொதுவான பழுதுபார்ப்பு பணிகளில் அனுபவம் உள்ளதா?', 'How many regular customers have you identified?': 'எத்தனை வழக்கமான வாடிக்கையாளர்களை அடையாளம் கண்டுள்ளீர்கள்?'
  },
  te: {
    'Do you have prior milling experience?': 'మీకు మిల్లింగ్‌లో మునుపటి అనుభవం ఉందా?', 'Do you have access to a suitable workspace/shed?': 'మీకు తగిన పని స్థలం లేదా షెడ్ అందుబాటులో ఉందా?', 'Is reliable electricity available?': 'నమ్మకమైన విద్యుత్ అందుబాటులో ఉందా?', 'Do you have funds/access for milling machinery?': 'మిల్లింగ్ యంత్రాలకు నిధులు లేదా ప్రాప్యత ఉందా?', 'Is there sufficient local grain-growing activity nearby?': 'సమీపంలో తగినంత స్థానిక ధాన్యం సాగు జరుగుతుందా?', 'Do you have transport access for grain/flour?': 'ధాన్యం లేదా పిండి రవాణా సౌకర్యం ఉందా?', 'How many households have you confirmed as regular customers?': 'ఎన్ని కుటుంబాలను సాధారణ కస్టమర్లుగా నిర్ధారించారు?',
    'Do you have mechanical/repair training or experience?': 'మీకు మెకానికల్ లేదా మరమ్మతు శిక్షణ, అనుభవం ఉందా?', 'Do you own basic repair tools?': 'మీ వద్ద ప్రాథమిక మరమ్మతు పరికరాలు ఉన్నాయా?', 'Do you have a workshop or roadside space secured?': 'మీరు వర్క్‌షాప్ లేదా రోడ్డు పక్క స్థలాన్ని ఏర్పాటు చేసుకున్నారా?', 'Do you have a reliable spare-parts supplier?': 'మీకు నమ్మకమైన విడిభాగాల సరఫరాదారు ఉన్నారా?', 'Is there significant two-wheeler traffic/ownership in the area?': 'ఈ ప్రాంతంలో ద్విచక్ర వాహనాల రాకపోకలు లేదా యాజమాన్యం ఎక్కువగా ఉందా?', 'Do you have experience with common repair jobs?': 'సాధారణ మరమ్మతు పనుల్లో మీకు అనుభవం ఉందా?', 'How many regular customers have you identified?': 'ఎంతమంది సాధారణ కస్టమర్లను గుర్తించారు?'
  },
  kn: {
    'Do you have prior milling experience?': 'ನಿಮಗೆ ಗಿರಣಿ ನಡೆಸಿದ ಹಿಂದಿನ ಅನುಭವವಿದೆಯೇ?', 'Do you have access to a suitable workspace/shed?': 'ಸೂಕ್ತ ಕೆಲಸದ ಸ್ಥಳ ಅಥವಾ ಶೆಡ್ ಲಭ್ಯವಿದೆಯೇ?', 'Is reliable electricity available?': 'ವಿಶ್ವಾಸಾರ್ಹ ವಿದ್ಯುತ್ ಲಭ್ಯವಿದೆಯೇ?', 'Do you have funds/access for milling machinery?': 'ಗಿರಣಿ ಯಂತ್ರಗಳಿಗೆ ಹಣ ಅಥವಾ ಪ್ರವೇಶವಿದೆಯೇ?', 'Is there sufficient local grain-growing activity nearby?': 'ಹತ್ತಿರದಲ್ಲಿ ಸಾಕಷ್ಟು ಸ್ಥಳೀಯ ಧಾನ್ಯ ಬೆಳೆಯಲಾಗುತ್ತದೆಯೇ?', 'Do you have transport access for grain/flour?': 'ಧಾನ್ಯ ಅಥವಾ ಹಿಟ್ಟಿನ ಸಾಗಣೆಗೆ ಸೌಲಭ್ಯವಿದೆಯೇ?', 'How many households have you confirmed as regular customers?': 'ಎಷ್ಟು ಕುಟುಂಬಗಳನ್ನು ನಿಯಮಿತ ಗ್ರಾಹಕರಾಗಿ ಖಚಿತಪಡಿಸಿದ್ದೀರಿ?',
    'Do you have mechanical/repair training or experience?': 'ನಿಮಗೆ ಮೆಕ್ಯಾನಿಕಲ್ ಅಥವಾ ದುರಸ್ತಿ ತರಬೇತಿ, ಅನುಭವವಿದೆಯೇ?', 'Do you own basic repair tools?': 'ನಿಮ್ಮ ಬಳಿ ಮೂಲಭೂತ ದುರಸ್ತಿ ಸಾಧನಗಳಿವೆಯೇ?', 'Do you have a workshop or roadside space secured?': 'ಕಾರ್ಯಾಗಾರ ಅಥವಾ ರಸ್ತೆಬದಿಯ ಸ್ಥಳವನ್ನು ಖಚಿತಪಡಿಸಿದ್ದೀರಾ?', 'Do you have a reliable spare-parts supplier?': 'ವಿಶ್ವಾಸಾರ್ಹ ಬಿಡಿಭಾಗಗಳ ಪೂರೈಕೆದಾರರಿದ್ದಾರೆಯೇ?', 'Is there significant two-wheeler traffic/ownership in the area?': 'ಈ ಪ್ರದೇಶದಲ್ಲಿ ದ್ವಿಚಕ್ರ ವಾಹನಗಳ ಸಂಚಾರ ಅಥವಾ ಮಾಲೀಕತ್ವ ಹೆಚ್ಚಿದೆಯೇ?', 'Do you have experience with common repair jobs?': 'ಸಾಮಾನ್ಯ ದುರಸ್ತಿ ಕೆಲಸಗಳಲ್ಲಿ ಅನುಭವವಿದೆಯೇ?', 'How many regular customers have you identified?': 'ಎಷ್ಟು ನಿಯಮಿತ ಗ್ರಾಹಕರನ್ನು ಗುರುತಿಸಿದ್ದೀರಿ?'
  },
  bn: {
    'Do you have prior milling experience?': 'আপনার কি মিল চালানোর পূর্ব অভিজ্ঞতা আছে?', 'Do you have access to a suitable workspace/shed?': 'আপনার কি উপযুক্ত কাজের জায়গা বা শেড আছে?', 'Is reliable electricity available?': 'নির্ভরযোগ্য বিদ্যুৎ কি পাওয়া যায়?', 'Do you have funds/access for milling machinery?': 'মিলের যন্ত্রপাতির জন্য আপনার কি অর্থ বা সুযোগ আছে?', 'Is there sufficient local grain-growing activity nearby?': 'কাছাকাছি কি পর্যাপ্ত স্থানীয় শস্য উৎপাদন হয়?', 'Do you have transport access for grain/flour?': 'শস্য বা আটা পরিবহনের সুবিধা কি আছে?', 'How many households have you confirmed as regular customers?': 'আপনি কতটি পরিবারকে নিয়মিত গ্রাহক হিসেবে নিশ্চিত করেছেন?',
    'Do you have mechanical/repair training or experience?': 'আপনার কি যান্ত্রিক বা মেরামতের প্রশিক্ষণ বা অভিজ্ঞতা আছে?', 'Do you own basic repair tools?': 'আপনার কি মৌলিক মেরামতের সরঞ্জাম আছে?', 'Do you have a workshop or roadside space secured?': 'আপনি কি ওয়ার্কশপ বা রাস্তার পাশের জায়গা নিশ্চিত করেছেন?', 'Do you have a reliable spare-parts supplier?': 'আপনার কি নির্ভরযোগ্য যন্ত্রাংশ সরবরাহকারী আছে?', 'Is there significant two-wheeler traffic/ownership in the area?': 'এলাকায় কি দুই চাকার যানবাহনের চলাচল বা মালিকানা বেশি?', 'Do you have experience with common repair jobs?': 'সাধারণ মেরামতের কাজে কি আপনার অভিজ্ঞতা আছে?', 'How many regular customers have you identified?': 'আপনি কতজন নিয়মিত গ্রাহক চিহ্নিত করেছেন?'
  },
  gu: {
    'Do you have prior milling experience?': 'શું તમને મિલિંગનો અગાઉનો અનુભવ છે?', 'Do you have access to a suitable workspace/shed?': 'શું તમારી પાસે યોગ્ય કાર્યસ્થળ અથવા શેડ છે?', 'Is reliable electricity available?': 'શું વિશ્વસનીય વીજળી ઉપલબ્ધ છે?', 'Do you have funds/access for milling machinery?': 'શું તમારી પાસે મિલિંગ મશીનરી માટે ભંડોળ અથવા પહોંચ છે?', 'Is there sufficient local grain-growing activity nearby?': 'શું નજીકમાં પૂરતી સ્થાનિક અનાજની ખેતી થાય છે?', 'Do you have transport access for grain/flour?': 'શું તમારી પાસે અનાજ અથવા લોટના પરિવહનની સુવિધા છે?', 'How many households have you confirmed as regular customers?': 'તમે કેટલા પરિવારોને નિયમિત ગ્રાહકો તરીકે નિશ્ચિત કર્યા છે?',
    'Do you have mechanical/repair training or experience?': 'શું તમને મિકેનિકલ અથવા સમારકામની તાલીમ કે અનુભવ છે?', 'Do you own basic repair tools?': 'શું તમારી પાસે મૂળભૂત સમારકામનાં સાધનો છે?', 'Do you have a workshop or roadside space secured?': 'શું તમે વર્કશોપ અથવા રસ્તા કિનારાની જગ્યા સુરક્ષિત કરી છે?', 'Do you have a reliable spare-parts supplier?': 'શું તમારી પાસે વિશ્વસનીય સ્પેર પાર્ટ્સ સપ્લાયર છે?', 'Is there significant two-wheeler traffic/ownership in the area?': 'શું આ વિસ્તારમાં ટુ-વ્હીલરની નોંધપાત્ર અવરજવર અથવા માલિકી છે?', 'Do you have experience with common repair jobs?': 'શું તમને સામાન્ય સમારકામના કામનો અનુભવ છે?', 'How many regular customers have you identified?': 'તમે કેટલા નિયમિત ગ્રાહકો ઓળખ્યા છે?'
  },
  pa: {
    'Do you have prior milling experience?': 'ਕੀ ਤੁਹਾਡੇ ਕੋਲ ਮਿੱਲ ਚਲਾਉਣ ਦਾ ਪਿਛਲਾ ਤਜਰਬਾ ਹੈ?', 'Do you have access to a suitable workspace/shed?': 'ਕੀ ਤੁਹਾਡੇ ਕੋਲ ਢੁਕਵੀਂ ਕੰਮ ਵਾਲੀ ਥਾਂ ਜਾਂ ਸ਼ੈੱਡ ਹੈ?', 'Is reliable electricity available?': 'ਕੀ ਭਰੋਸੇਯੋਗ ਬਿਜਲੀ ਉਪਲਬਧ ਹੈ?', 'Do you have funds/access for milling machinery?': 'ਕੀ ਤੁਹਾਡੇ ਕੋਲ ਮਿੱਲ ਮਸ਼ੀਨਰੀ ਲਈ ਫੰਡ ਜਾਂ ਪਹੁੰਚ ਹੈ?', 'Is there sufficient local grain-growing activity nearby?': 'ਕੀ ਨੇੜੇ ਕਾਫ਼ੀ ਸਥਾਨਕ ਅਨਾਜ ਦੀ ਖੇਤੀ ਹੁੰਦੀ ਹੈ?', 'Do you have transport access for grain/flour?': 'ਕੀ ਤੁਹਾਡੇ ਕੋਲ ਅਨਾਜ ਜਾਂ ਆਟੇ ਦੀ ਢੋਆ-ਢੁਆਈ ਦੀ ਸਹੂਲਤ ਹੈ?', 'How many households have you confirmed as regular customers?': 'ਤੁਸੀਂ ਕਿੰਨੇ ਪਰਿਵਾਰਾਂ ਨੂੰ ਨਿਯਮਿਤ ਗਾਹਕ ਵਜੋਂ ਪੱਕਾ ਕੀਤਾ ਹੈ?',
    'Do you have mechanical/repair training or experience?': 'ਕੀ ਤੁਹਾਡੇ ਕੋਲ ਮਕੈਨੀਕਲ ਜਾਂ ਮੁਰੰਮਤ ਦੀ ਸਿਖਲਾਈ ਜਾਂ ਤਜਰਬਾ ਹੈ?', 'Do you own basic repair tools?': 'ਕੀ ਤੁਹਾਡੇ ਕੋਲ ਬੁਨਿਆਦੀ ਮੁਰੰਮਤ ਦੇ ਸੰਦ ਹਨ?', 'Do you have a workshop or roadside space secured?': 'ਕੀ ਤੁਸੀਂ ਵਰਕਸ਼ਾਪ ਜਾਂ ਸੜਕ ਕਿਨਾਰੇ ਦੀ ਥਾਂ ਸੁਰੱਖਿਅਤ ਕੀਤੀ ਹੈ?', 'Do you have a reliable spare-parts supplier?': 'ਕੀ ਤੁਹਾਡੇ ਕੋਲ ਭਰੋਸੇਯੋਗ ਸਪੇਅਰ ਪਾਰਟਸ ਸਪਲਾਇਰ ਹੈ?', 'Is there significant two-wheeler traffic/ownership in the area?': 'ਕੀ ਇਲਾਕੇ ਵਿੱਚ ਦੋ-ਪਹੀਆ ਵਾਹਨਾਂ ਦੀ ਕਾਫ਼ੀ ਆਵਾਜਾਈ ਜਾਂ ਮਾਲਕੀ ਹੈ?', 'Do you have experience with common repair jobs?': 'ਕੀ ਤੁਹਾਨੂੰ ਆਮ ਮੁਰੰਮਤ ਦੇ ਕੰਮਾਂ ਦਾ ਤਜਰਬਾ ਹੈ?', 'How many regular customers have you identified?': 'ਤੁਸੀਂ ਕਿੰਨੇ ਨਿਯਮਿਤ ਗਾਹਕ ਪਛਾਣੇ ਹਨ?'
  }
};

const FINANCE_INPUT_COPY = {
  hi: { 'Project Cost Estimate (₹)': 'परियोजना लागत (₹)', 'Available Entrepreneur Margin Capital (₹)': 'उपलब्ध उद्यमी मार्जिन पूंजी (₹)', 'Monthly Household Expenses (₹)': 'मासिक घरेलू खर्च (₹)' },
  mr: { 'Project Cost Estimate (₹)': 'प्रकल्प खर्चाचा अंदाज (₹)', 'Available Entrepreneur Margin Capital (₹)': 'उपलब्ध उद्योजक भांडवल (₹)', 'Monthly Household Expenses (₹)': 'मासिक घरगुती खर्च (₹)' },
  ta: { 'Project Cost Estimate (₹)': 'திட்டச் செலவு மதிப்பீடு (₹)', 'Available Entrepreneur Margin Capital (₹)': 'கிடைக்கும் தொழில்முனைவோர் மார்ஜின் மூலதனம் (₹)', 'Monthly Household Expenses (₹)': 'மாதாந்திர குடும்பச் செலவுகள் (₹)' },
  te: { 'Project Cost Estimate (₹)': 'ప్రాజెక్ట్ ఖర్చు అంచనా (₹)', 'Available Entrepreneur Margin Capital (₹)': 'అందుబాటులో ఉన్న వ్యాపారవేత్త మార్జిన్ మూలధనం (₹)', 'Monthly Household Expenses (₹)': 'నెలవారీ కుటుంబ ఖర్చులు (₹)' },
  kn: { 'Project Cost Estimate (₹)': 'ಯೋಜನೆಯ ವೆಚ್ಚದ ಅಂದಾಜು (₹)', 'Available Entrepreneur Margin Capital (₹)': 'ಲಭ್ಯವಿರುವ ಉದ್ಯಮಿ ಬಂಡವಾಳ (₹)', 'Monthly Household Expenses (₹)': 'ಮಾಸಿಕ ಕುಟುಂಬದ ವೆಚ್ಚಗಳು (₹)' },
  bn: { 'Project Cost Estimate (₹)': 'প্রকল্প খরচের অনুমান (₹)', 'Available Entrepreneur Margin Capital (₹)': 'উপলব্ধ উদ্যোক্তা মার্জিন মূলধন (₹)', 'Monthly Household Expenses (₹)': 'মাসিক পারিবারিক খরচ (₹)' },
  gu: { 'Project Cost Estimate (₹)': 'પ્રોજેક્ટ ખર્ચનો અંદાજ (₹)', 'Available Entrepreneur Margin Capital (₹)': 'ઉપલબ્ધ ઉદ્યોગસાહસિક મૂડી (₹)', 'Monthly Household Expenses (₹)': 'માસિક ઘરખર્ચ (₹)' },
  pa: { 'Project Cost Estimate (₹)': 'ਪ੍ਰੋਜੈਕਟ ਲਾਗਤ ਦਾ ਅੰਦਾਜ਼ਾ (₹)', 'Available Entrepreneur Margin Capital (₹)': 'ਉਪਲਬਧ ਉਦਮੀ ਮਾਰਜਿਨ ਪੂੰਜੀ (₹)', 'Monthly Household Expenses (₹)': 'ਮਹੀਨਾਵਾਰ ਘਰੇਲੂ ਖਰਚੇ (₹)' }
};

const ASSESSMENT_VALUE_COPY = {
  hi: { Somewhat: 'कुछ हद तक', 'Select time commitment': 'समय प्रतिबद्धता चुनें', 'Full-time commitment': 'पूर्णकालिक प्रतिबद्धता', 'Part-time': 'अंशकालिक', Seasonal: 'मौसमी', 'Family-managed': 'परिवार द्वारा संचालित' },
  mr: { Somewhat: 'काही प्रमाणात', 'Select time commitment': 'वेळेची बांधिलकी निवडा', 'Full-time commitment': 'पूर्णवेळ बांधिलकी', 'Part-time': 'अर्धवेळ', Seasonal: 'हंगामी', 'Family-managed': 'कुटुंबाद्वारे व्यवस्थापित' },
  ta: { Somewhat: 'ஓரளவு', 'Select time commitment': 'நேர ஒதுக்கீட்டைத் தேர்ந்தெடுக்கவும்', 'Full-time commitment': 'முழுநேர ஒதுக்கீடு', 'Part-time': 'பகுதிநேரம்', Seasonal: 'பருவகாலம்', 'Family-managed': 'குடும்ப நிர்வாகம்' },
  te: { Somewhat: 'కొంతవరకు', 'Select time commitment': 'సమయ నిబద్ధతను ఎంచుకోండి', 'Full-time commitment': 'పూర్తి సమయ నిబద్ధత', 'Part-time': 'పార్ట్ టైమ్', Seasonal: 'కాలానుగుణం', 'Family-managed': 'కుటుంబ నిర్వహణ' },
  kn: { Somewhat: 'ಸ್ವಲ್ಪಮಟ್ಟಿಗೆ', 'Select time commitment': 'ಸಮಯದ ಬದ್ಧತೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ', 'Full-time commitment': 'ಪೂರ್ಣ ಸಮಯದ ಬದ್ಧತೆ', 'Part-time': 'ಅರೆಕಾಲಿಕ', Seasonal: 'ಋತುಮಾನಿಕ', 'Family-managed': 'ಕುಟುಂಬ ನಿರ್ವಹಣೆ' },
  bn: { Somewhat: 'কিছুটা', 'Select time commitment': 'সময়ের প্রতিশ্রুতি নির্বাচন করুন', 'Full-time commitment': 'পূর্ণকালীন প্রতিশ্রুতি', 'Part-time': 'খণ্ডকালীন', Seasonal: 'মৌসুমি', 'Family-managed': 'পরিবার পরিচালিত' },
  gu: { Somewhat: 'કેટલાક અંશે', 'Select time commitment': 'સમયની પ્રતિબદ્ધતા પસંદ કરો', 'Full-time commitment': 'પૂર્ણ-સમયની પ્રતિબદ્ધતા', 'Part-time': 'અંશકાલિક', Seasonal: 'મોસમી', 'Family-managed': 'કુટુંબ દ્વારા સંચાલિત' },
  pa: { Somewhat: 'ਕੁਝ ਹੱਦ ਤੱਕ', 'Select time commitment': 'ਸਮੇਂ ਦੀ ਵਚਨਬੱਧਤਾ ਚੁਣੋ', 'Full-time commitment': 'ਪੂਰੇ ਸਮੇਂ ਦੀ ਵਚਨਬੱਧਤਾ', 'Part-time': 'ਪਾਰਟ-ਟਾਈਮ', Seasonal: 'ਮੌਸਮੀ', 'Family-managed': 'ਪਰਿਵਾਰ ਦੁਆਰਾ ਚਲਾਇਆ' }
};

export const AssessmentWizard = () => {
  const navigate = useNavigate();
  const { translate: t, lang } = useLanguage();
  const at = (key) => READINESS_QUESTION_COPY[lang]?.[key] || POULTRY_QUESTION_COPY[lang]?.[key] || OTHER_READINESS_QUESTION_COPY[lang]?.[key] || FINANCE_INPUT_COPY[lang]?.[key] || ASSESSMENT_VALUE_COPY[lang]?.[key] || ASSESSMENT_HEADING_COPY[lang]?.[key] || PROFILE_OPTION_COPY[lang]?.[key] || t(key);
  const profileValue = (value) => ({
    '18-24': at('18–24 years'),
    '25-34': at('25–34 years'),
    '35-44': at('35–44 years'),
    '45+': at('45+ years'),
    Primary: at('Primary School'),
    Secondary: at('Secondary (Class 10/12)'),
    Graduate: at('Graduate / Higher'),
    'No Formal': at('No Formal Education'),
    None: at('None (First-time)'),
    '0-2 years': at('0–2 years'),
    '3-5 years': at('3–5 years'),
    '5+ years': at('5+ years')
  }[value] || value);

  // Assessment & Wizard State
  const [assessmentId, setAssessmentId] = useState(null);
  const [currentStep, setCurrentStep] = useState(0); // 0 = Intro, 1..5 = Steps, 6 = Processing
  const [saving, setSaving] = useState(false);
  const [savedIndicator, setSavedIndicator] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');

  // Step 1 State (Profile & Resources)
  const [profile, setProfile] = useState({
    age_group: '',
    education: '',
    occupation: '',
    business_experience: '',
    resources: [],
    time_commitment: '',
    has_existing_loan: false,
    existing_emi: '',
    emergency_reserve: ''
  });

  // Step 2 State (Business & Location)
  const [businessModels, setBusinessModels] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [villages, setVillages] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('');
  const [selectedVillageId, setSelectedVillageId] = useState('');
  const [selectedVillageObj, setSelectedVillageObj] = useState({});
  const [mapView, setMapView] = useState({
    ...INDIA_CENTER,
    zoom: 5,
    label: 'India',
    showVillageMarker: false,
    showCatchment: false,
  });

  // Step 3 State (Category-Specific Readiness)
  const [readinessAnswers, setReadinessAnswers] = useState({
    experience_years: '',
    has_relevant_skill: '',
    has_workspace: '',
    has_supplier_contacts: false,
    has_committed_customers: '',
    emergency_savings: '',
    category_specific_answers: {
      q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: ''
    }
  });

  // Step 4 State (Finance)
  const [finance, setFinance] = useState({
    project_cost: '',
    available_margin: '',
    scale: 'Micro',
    household_expenses: '',
    working_capital: '',
    understands_emi: '',
    understands_risk: ''
  });

  // Processing Animation State
  const [processingStage, setProcessingStage] = useState(0);

  const categoryIcons = {
    Dairy: "🐄",
    Poultry: "🐔",
    Tailoring: "🧵",
    "Flour Mill": "🌾",
    "Two-Wheeler Repair": "🔧"
  };

  const validateStep = (step) => {
    if (step === 1) {
      const fields = [
        [profile.age_group, 'Age Group'],
        [profile.education, 'Education Level'],
        [profile.occupation.trim(), 'Current Occupation'],
        [profile.business_experience, 'Prior Business Experience'],
        [profile.time_commitment, 'Time Commitment']
      ];
      const missing = fields.find(([value]) => !value);
      if (missing) return `${t('Please complete this required field before continuing:')} ${t(missing[1])}`;
    }
    if (step === 2) {
      const fields = [
        [selectedCategory, 'Select Business Category'],
        [selectedState, 'State'],
        [selectedDistrict, 'District'],
        [selectedBlock, 'Block / Sub-District'],
        [selectedVillageId, 'Village']
      ];
      const missing = fields.find(([value]) => !value);
      if (missing) return `${t('Please complete this required field before continuing:')} ${t(missing[1])}`;
    }
    if (step === 3) {
      const answers = readinessAnswers.category_specific_answers;
      const missingIndex = Object.values(answers).findIndex(value => value === '' || value === null || value === undefined);
      if (missingIndex !== -1) return `${t('Please answer readiness question')} ${missingIndex + 1} ${t('before continuing.')}`;
      if ([answers.q2, answers.q7].some(value => Number.isNaN(Number(value)))) return t('Please enter valid numbers for the numeric readiness questions.');
    }
    if (step === 4) {
      const fields = [
        [finance.project_cost, 'Project Cost Estimate (₹)'],
        [finance.available_margin, 'Available Entrepreneur Margin Capital (₹)'],
        [finance.household_expenses, 'Monthly Household Expenses (₹)'],
        [finance.understands_emi, 'Do you understand how EMI works?']
      ];
      const missing = fields.find(([value]) => value === '' || value === null || value === undefined);
      if (missing) return `${t('Please complete this required field before continuing:')} ${t(missing[1])}`;
      if ([finance.project_cost, finance.available_margin, finance.household_expenses].some(value => Number(value) < 0)) return t('Financial amounts cannot be negative.');
    }
    return '';
  };

  // Load initial data
  useEffect(() => {
    api.getBusinessModels()
      .then(res => setBusinessModels(res.data?.length ? res.data : DEFAULT_BUSINESS_MODELS))
      .catch(err => {
        console.error("Failed to load business models:", err);
        setBusinessModels(DEFAULT_BUSINESS_MODELS);
      });

    api.getStates()
      .then(res => setStates(res.data))
      .catch(err => console.error("Failed to load states:", err));
  }, []);

  // Cascading Location Dropdowns
  useEffect(() => {
    if (selectedState) {
      api.getDistricts(selectedState).then(res => {
        setDistricts(res.data);
      });
    } else {
      setDistricts([]);
    }
  }, [selectedState]);

  useEffect(() => {
    if (selectedDistrict) {
      api.getBlocks(selectedState, selectedDistrict).then(res => {
        setBlocks(res.data);
      });
    } else {
      setBlocks([]);
    }
  }, [selectedState, selectedDistrict]);

  useEffect(() => {
    if (selectedBlock) {
      api.getVillages(selectedState, selectedDistrict, selectedBlock).then(res => {
        setVillages(res.data);
      });
    } else {
      setVillages([]);
    }
  }, [selectedState, selectedDistrict, selectedBlock]);

  useEffect(() => {
    if (selectedVillageId) {
      api.getVillageById(selectedVillageId).then(res => {
        if (res.data) setSelectedVillageObj(res.data);
      });
    }
  }, [selectedVillageId]);

  // Save Draft Helper
  const triggerAutosave = async (newStep) => {
    const message = validateStep(currentStep);
    if (message) {
      setValidationMessage(message);
      return;
    }
    setValidationMessage('');
    setSaving(true);
    try {
      if (!assessmentId) {
        const resp = await api.createAssessment({
          village_id: selectedVillageId,
          category: selectedCategory,
          project_cost: finance.project_cost,
          available_margin: finance.available_margin,
          existing_emi: parseFloat(profile.existing_emi) || 0,
          household_expenses: finance.household_expenses
        });
        setAssessmentId(resp.data.id);
      } else {
        await api.updateAssessment(assessmentId, {
          village_id: selectedVillageId,
          category: selectedCategory,
          project_cost: finance.project_cost,
          available_margin: finance.available_margin,
          existing_emi: parseFloat(profile.existing_emi) || 0,
          household_expenses: finance.household_expenses,
          questionnaire_answers: {
            experience_years: parseFloat(readinessAnswers.experience_years),
            has_relevant_skill: readinessAnswers.has_relevant_skill,
            has_workspace: readinessAnswers.has_workspace,
            has_supplier_contacts: readinessAnswers.has_supplier_contacts,
            has_committed_customers: readinessAnswers.has_committed_customers,
            emergency_savings: parseFloat(readinessAnswers.emergency_savings),
            category_specific_answers: readinessAnswers.category_specific_answers
          }
        });
      }
      setSavedIndicator(true);
      setTimeout(() => setSavedIndicator(false), 2000);
    } catch (err) {
      console.error("Autosave error:", err);
    } finally {
      setSaving(false);
      setCurrentStep(newStep);
    }
  };

  // Run Feasibility Engine
  const handleRunAnalysis = async () => {
    const firstInvalidStep = [1, 2, 3, 4].find(step => validateStep(step));
    if (firstInvalidStep) {
      setValidationMessage(validateStep(firstInvalidStep));
      setCurrentStep(firstInvalidStep);
      return;
    }
    setValidationMessage('');
    setCurrentStep(6); // Processing screen
    
    // Animate stages sequentially
    for (let i = 1; i <= 7; i++) {
      await new Promise(r => setTimeout(r, 600));
      setProcessingStage(i);
    }

    try {
      await api.runAssessment(assessmentId);
      navigate(`/assessments/${assessmentId}/report`);
    } catch (err) {
      console.error("Run analysis error:", err);
      // Navigate to report placeholder route even if backend mongo is offline
      navigate(`/assessments/${assessmentId || 'ASM_DEFAULT'}/report`);
    }
  };

  // Render Step 3 Category Readiness Questions
  const renderReadinessQuestions = () => {
    const qMap = {
      Dairy: [
        "Do you currently own cattle?",
        "How many cattle can you start with?",
        "Do you have a reliable fodder source?",
        "Is adequate water available year-round?",
        "Do you have access to refrigeration?",
        "Is there a milk collection centre nearby?",
        "How many reliable buyers have you identified?"
      ],
      Poultry: [
        "Do you have prior poultry-rearing experience?",
        "How many birds can you start with?",
        "Do you have reliable feed supply access?",
        "Do you have access to veterinary support?",
        "Do you have a secure, ventilated shed/enclosure?",
        "Is there a nearby market or trader for sale?",
        "How many reliable buyers/traders have you identified?"
      ],
      Tailoring: [
        "Do you have tailoring/stitching skill or training?",
        "Do you own a sewing machine?",
        "Do you have a dedicated workspace?",
        "Do you have prior paid stitching orders/experience?",
        "Do you have a reliable fabric/material supplier?",
        "Is there demand for alteration/custom stitching nearby?",
        "How many regular customers have you identified?"
      ],
      "Flour Mill": [
        "Do you have prior milling experience?",
        "Do you have access to a suitable workspace/shed?",
        "Is reliable electricity available?",
        "Do you have funds/access for milling machinery?",
        "Is there sufficient local grain-growing activity nearby?",
        "Do you have transport access for grain/flour?",
        "How many households have you confirmed as regular customers?"
      ],
      "Two-Wheeler Repair": [
        "Do you have mechanical/repair training or experience?",
        "Do you own basic repair tools?",
        "Do you have a workshop or roadside space secured?",
        "Do you have a reliable spare-parts supplier?",
        "Is there significant two-wheeler traffic/ownership in the area?",
        "Do you have experience with common repair jobs?",
        "How many regular customers have you identified?"
      ]
    };

    const questions = qMap[selectedCategory] || qMap.Dairy;

    return (
      <div className="space-y-4">
        {questions.map((qText, qIdx) => {
          const key = `q${qIdx + 1}`;
          const isNumeric = qIdx === 1 || qIdx === 6;
          const currentVal = readinessAnswers.category_specific_answers[key];

          return (
            <div key={key} className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs font-medium text-gray-800">
                <strong className="text-primary-600 mr-2">{qIdx + 1}.</strong>
                {at(qText)} <span className="text-red-600" aria-hidden="true">*</span>
              </span>

              {isNumeric ? (
                <input
                  type="number"
                  required
                  value={currentVal}
                  onChange={(e) => setReadinessAnswers({
                    ...readinessAnswers,
                    category_specific_answers: { ...readinessAnswers.category_specific_answers, [key]: e.target.value }
                  })}
                  className="w-24 px-3 py-1.5 rounded-lg border border-gray-200 text-xs bg-white focus:outline-none focus:border-primary-600"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setReadinessAnswers({
                      ...readinessAnswers,
                      category_specific_answers: { ...readinessAnswers.category_specific_answers, [key]: 'Yes' }
                    })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      currentVal === 'Yes' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white text-gray-600 border border-gray-200'
                    }`}
                  >
                    {t('Yes')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setReadinessAnswers({
                      ...readinessAnswers,
                      category_specific_answers: { ...readinessAnswers.category_specific_answers, [key]: 'No' }
                    })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      currentVal === 'No' ? 'bg-amber-600 text-white shadow-xs' : 'bg-white text-gray-600 border border-gray-200'
                    }`}
                  >
                    {t('No')}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title={t('New Feasibility Assessment')} />

        <main className="p-6 md:p-10 max-w-5xl mx-auto w-full space-y-8">
          {/* Stepper Header (Only for Steps 1..5) */}
          {currentStep >= 1 && currentStep <= 5 && (
            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="eyebrow !mb-0">{t('ASSESSMENT PROGRESS')}</span>
                  {savedIndicator && (
                        <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 animate-pulse">
                          <Save className="w-3 h-3" /> {t('Draft saved')}
                    </span>
                  )}
                </div>
                <span className="text-xs font-bold text-gray-500">{t('Step')} {currentStep} {t('of 5')}</span>
              </div>
              {validationMessage && (
                <div role="alert" aria-live="assertive" className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
                  {validationMessage}
                </div>
              )}

              {/* 5-Step Indicators */}
              <div className="grid grid-cols-5 gap-2">
                {[
                  { step: 1, label: t('Profile') },
                  { step: 2, label: t('Business') },
                  { step: 3, label: t('Readiness') },
                  { step: 4, label: t('Finance') },
                  { step: 5, label: t('Review') }
                ].map((st) => {
                  const isDone = currentStep > st.step;
                  const isCurrent = currentStep === st.step;
                  return (
                    <div key={st.step} className="flex flex-col items-center text-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isDone ? 'bg-emerald-600 text-white' : (isCurrent ? 'bg-primary-600 text-white ring-4 ring-primary-100' : 'bg-gray-100 text-gray-400')
                      }`}>
                        {isDone ? <Check className="w-4 h-4" /> : st.step}
                      </div>
                      <span className={`text-[11px] font-semibold mt-1 hidden sm:inline-block ${
                        isCurrent ? 'text-primary-700' : 'text-gray-500'
                      }`}>
                        {st.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ---------------- INTRO SCREEN (Step 0) ---------------- */}
          {currentStep === 0 && (
            <div className="bg-white border border-gray-200 rounded-3xl p-8 md:p-12 shadow-sm space-y-8">
              <div className="space-y-3">
                <span className="eyebrow">{t('PRE-INVESTMENT ADVISORY')}</span>
                <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
                  {t('Business Feasibility Assessment')}
                </h1>
                <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">{t('Answer a few questions about your background, intended business, and local village location. We evaluate your proposal across Market Feasibility, Entrepreneur Readiness, and Financial Fit before you take on debt.')}</p>
              </div>

              {/* Trust Markers */}
              <div className="flex flex-wrap items-center gap-6 text-xs font-semibold text-gray-600">
                <div className="flex items-center gap-2 bg-blue-50 text-blue-800 px-3 py-1.5 rounded-lg border border-blue-100">
                  <Clock className="w-4 h-4 text-primary-600" />
                  <span>{t('Takes 5–7 minutes')}</span>
                </div>
                <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-lg border border-emerald-100">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{t('Answers stored securely')}</span>
                </div>
              </div>

              {/* 3 Recap Mini-Cards */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-1">
                  <div className="text-xs font-bold text-primary-600">{t('1. Market Feasibility')}</div>
                  <p className="text-[11px] text-gray-500">{t('Evaluates 10km village demand, competitor density & infrastructure.')}</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-1">
                  <div className="text-xs font-bold text-emerald-600">{t('2. Entrepreneur Readiness')}</div>
                  <p className="text-[11px] text-gray-500">{t('Assesses your skills, workspace, supplier contacts & customers.')}</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-1">
                  <div className="text-xs font-bold text-amber-600">{t('3. Financial Fit')}</div>
                  <p className="text-[11px] text-gray-500">{t('Verifies margin sufficiency & monthly disposable EMI capacity.')}</p>
                </div>
              </div>

              <DisclaimerBanner text="This feasibility assessment provides prototype advisory guidance. Scores do not guarantee loan sanction or business financial outcomes." />

              <button
                onClick={() => triggerAutosave(1)}
                className="w-full sm:w-auto px-8 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>{t('Begin assessment')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ---------------- STEP 1 — PROFILE ---------------- */}
          {currentStep === 1 && (
            <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-10 shadow-sm space-y-8">
              <div>
                <span className="eyebrow">{at('STEP 1 OF 5')}</span>
                <h2 className="text-2xl font-bold text-gray-900">{at('Personal Profile & Resources')}</h2>
                <p className="text-xs text-gray-500 mt-1">{at('Tell us about your background and available operational assets.')}</p>
              </div>

              {/* Sub-Section 1: Personal Profile */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">
                  {at('Personal Background')}
                </h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">{at('Age Group')} <span className="text-red-600" aria-hidden="true">*</span></label>
                    <select
                      required
                      value={profile.age_group}
                      onChange={(e) => setProfile({ ...profile, age_group: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:border-primary-600"
                    >
                      <option value="">{at('Select age group')}</option>
                      <option value="18-24">{at('18–24 years')}</option>
                      <option value="25-34">{at('25–34 years')}</option>
                      <option value="35-44">{at('35–44 years')}</option>
                      <option value="45+">{at('45+ years')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">{at('Education Level')} <span className="text-red-600" aria-hidden="true">*</span></label>
                    <select
                      required
                      value={profile.education}
                      onChange={(e) => setProfile({ ...profile, education: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:border-primary-600"
                    >
                      <option value="">{at('Select education level')}</option>
                      <option value="Primary">{at('Primary School')}</option>
                      <option value="Secondary">{at('Secondary (Class 10/12)')}</option>
                      <option value="Graduate">{at('Graduate / Higher')}</option>
                      <option value="No Formal">{at('No Formal Education')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">{at('Current Occupation')} <span className="text-red-600" aria-hidden="true">*</span></label>
                    <input
                      type="text"
                      required
                      value={profile.occupation}
                      onChange={(e) => setProfile({ ...profile, occupation: e.target.value })}
                      placeholder={at('e.g. Agriculture / Self-employed')}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-primary-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">{at('Prior Business Experience')} <span className="text-red-600" aria-hidden="true">*</span></label>
                    <select
                      required
                      value={profile.business_experience}
                      onChange={(e) => setProfile({ ...profile, business_experience: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:border-primary-600"
                    >
                      <option value="">{at('Select experience')}</option>
                      <option value="None">{at('None (First-time)')}</option>
                      <option value="0-2 years">{at('0–2 years')}</option>
                      <option value="3-5 years">{at('3–5 years')}</option>
                      <option value="5+ years">{at('5+ years')}</option>
                    </select>
                  </div>
                </div>

                {/* Inline Green Guarantee Banner Requirement */}
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>{t('Education Guarantee')}:</strong> {t('Education level does not reduce your feasibility score. It is used strictly to personalize explanation complexity, skill training guidance, and financial-literacy support.')}
                  </span>
                </div>
              </div>

              {/* Sub-Section 2: Resources You Can Use */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">
                  {at('Resources You Can Use (Multi-Select)')}
                </h3>

                <div className="flex flex-wrap gap-2.5">
                  {[
                    "Own land", "Shop/workspace", "Vehicle", "Electricity", 
                    "Storage", "Machinery/equipment", "Family labour", "Existing customers"
                  ].map((res) => {
                    const isSelected = profile.resources.includes(res);
                    return (
                      <button
                        key={res}
                        type="button"
                        onClick={() => {
                          const updated = isSelected 
                            ? profile.resources.filter(r => r !== res)
                            : [...profile.resources, res];
                          setProfile({ ...profile, resources: updated });
                        }}
                        className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                          isSelected 
                            ? 'bg-primary-600 text-white font-bold shadow-xs'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        <span>{at(res)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Commitment & Financial Resilience */}
              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">{at('Time Commitment')} <span className="text-red-600" aria-hidden="true">*</span></label>
                  <select
                    required
                    value={profile.time_commitment}
                    onChange={(e) => setProfile({ ...profile, time_commitment: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-white"
                  >
                    <option value="">{at('Select time commitment')}</option>
                    <option value="Full-time">{at('Full-time commitment')}</option>
                    <option value="Part-time">{at('Part-time')}</option>
                    <option value="Seasonal">{at('Seasonal')}</option>
                    <option value="Family-managed">{at('Family-managed')}</option>
                  </select>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">{at('Existing Monthly Loan EMI (₹)')}</label>
                  <input
                    type="number"
                    value={profile.existing_emi}
                    onChange={(e) => setProfile({ ...profile, existing_emi: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                <button
                  onClick={() => setCurrentStep(0)}
                  className="px-4 py-2.5 text-xs font-semibold text-gray-600 hover:text-gray-900"
                >
                  {t('Back')}
                </button>
                <button
                  onClick={() => triggerAutosave(2)}
                  className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <span>{t('Continue to Business')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ---------------- STEP 2 — BUSINESS & LOCATION ---------------- */}
          {currentStep === 2 && (
            <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-10 shadow-sm space-y-8">
              <div>
                <span className="eyebrow">{t('STEP 2 OF 5')}</span>
                <h2 className="text-2xl font-bold text-gray-900">{t('Select Business Category & Location')}</h2>
                <p className="text-xs text-gray-500 mt-1">{t('Pick your target business and village location for catchment analysis.')}</p>
              </div>

              {/* 5 Radio-Selectable Category Cards */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider">
                  {t('Select Business Category')} <span className="text-red-600" aria-hidden="true">*</span>
                </label>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {businessModels.map((bm) => {
                    const isSelected = selectedCategory === bm.category;
                    const localizedCard = BUSINESS_CARD_COPY[lang]?.[bm.category];
                    return (
                      <div
                        key={bm.category}
                        onClick={() => setSelectedCategory(bm.category)}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected 
                            ? 'border-primary-600 bg-blue-50/40 ring-2 ring-blue-100 shadow-xs'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-2xl">{categoryIcons[bm.category] || "🏪"}</span>
                            {isSelected && <CheckCircle2 className="w-5 h-5 text-primary-600" />}
                          </div>
                          <div className="font-bold text-xs text-gray-900">{localizedCard?.[0] || t(bm.display_name)}</div>
                          <p className="text-[11px] text-gray-500 line-clamp-2">{localizedCard?.[1] || t(bm.description)}</p>
                        </div>
                        <div className="mt-3 pt-2 border-t border-gray-100 text-[10.5px] font-semibold text-primary-700">
                          {t('Capital')}: ₹{(bm.capital_min/100000).toFixed(1)}L – ₹{(bm.capital_max/100000).toFixed(1)}L
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Cascading Location Selectors */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    {t('Target Village Location')} <span className="text-red-600" aria-hidden="true">*</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => alert("Location set to Shikrapur, MS default demo village.")}
                    className="text-[11px] font-semibold text-primary-600 hover:underline flex items-center gap-1"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{t('Use current location (Mock)')}</span>
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">{t('State')} <span className="text-red-600" aria-hidden="true">*</span></label>
                    <select
                      required
                      value={selectedState}
                      onChange={(e) => {
                        const state = e.target.value;
                        const center = STATE_CENTERS[state] || INDIA_CENTER;
                        setSelectedState(state);
                        setSelectedDistrict('');
                        setSelectedBlock('');
                        setSelectedVillageId('');
                        setSelectedVillageObj({});
                        setMapView({ ...center, zoom: 7, radiusKm: 150, label: state, showVillageMarker: false, showCatchment: true });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white"
                    >
                      <option value="">Select state</option>
                      {states.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">{t('District')} <span className="text-red-600" aria-hidden="true">*</span></label>
                    <select
                      required
                      value={selectedDistrict}
                      disabled={!selectedState}
                      onChange={(e) => {
                        const district = e.target.value;
                        const districtIndex = districts.indexOf(district);
                        setSelectedDistrict(district);
                        setSelectedBlock('');
                        setSelectedVillageId('');
                        setSelectedVillageObj({});
                        setMapView({ ...getDistrictCenter(selectedState, districtIndex), zoom: 9, radiusKm: 60, label: district, showVillageMarker: false, showCatchment: true });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white"
                    >
                      <option value="">Select district</option>
                      {districts.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">{t('Block / Sub-District')} <span className="text-red-600" aria-hidden="true">*</span></label>
                    <select
                      required
                      value={selectedBlock}
                      disabled={!selectedDistrict}
                      onChange={(e) => {
                        const block = e.target.value;
                        const blockIndex = blocks.indexOf(block);
                        const districtIndex = districts.indexOf(selectedDistrict);
                        setSelectedBlock(block);
                        setSelectedVillageId('');
                        setSelectedVillageObj({});
                        setMapView({ ...getBlockCenter(selectedState, districtIndex, blockIndex), zoom: 11, radiusKm: 25, label: block, showVillageMarker: false, showCatchment: true });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white"
                    >
                      <option value="">Select sub-district</option>
                      {blocks.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">{t('Village')} <span className="text-red-600" aria-hidden="true">*</span></label>
                    <select
                      required
                      value={selectedVillageId}
                      disabled={!selectedBlock}
                      onChange={(e) => {
                        const villageId = e.target.value;
                        const village = villages.find(item => item.village_id === villageId);
                        setSelectedVillageId(villageId);
                        if (village) {
                          setMapView({ lat: village.latitude, lng: village.longitude, zoom: 14, radiusKm: 10, label: village.name, showVillageMarker: true, showCatchment: true });
                        }
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white font-bold text-primary-700"
                    >
                      <option value="">Select village</option>
                      {villages.map(v => <option key={v.village_id} value={v.village_id}>{v.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Live Leaflet Map */}
              <div className="pt-2">
                <LocationMap 
                  lat={mapView.lat}
                  lng={mapView.lng}
                  zoom={mapView.zoom}
                  radiusKm={mapView.radiusKm}
                  villageName={mapView.label}
                  showVillageMarker={mapView.showVillageMarker}
                  showCatchment={mapView.showCatchment}
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2.5 text-xs font-semibold text-gray-600 hover:text-gray-900"
                >
                  {t('Back')}
                </button>
                <button
                  onClick={() => triggerAutosave(3)}
                  className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <span>{t('Continue to Readiness')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ---------------- STEP 3 — READINESS QUESTIONNAIRE ---------------- */}
          {currentStep === 3 && (
            <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-10 shadow-sm space-y-8">
              <div>
                <span className="eyebrow">{t('STEP 3 OF 5')}</span>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{categoryIcons[selectedCategory]}</span>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{t(selectedCategory)} {t('Readiness Questionnaire')}</h2>
                    <p className="text-xs text-gray-500 mt-0.5">{t('Answer based on what is available today—not what you hope to arrange later.')}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold text-gray-600">{t('All questions are required')} <span className="text-red-600" aria-hidden="true">*</span></p>
                {renderReadinessQuestions()}
              </div>

              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                <strong>{t('Readiness Advisory')}:</strong> {t('Honest answers make the preparation guidance more useful. Entrepreneur readiness is scored separately from village market feasibility.')}
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2.5 text-xs font-semibold text-gray-600 hover:text-gray-900"
                >
                  {t('Back')}
                </button>
                <button
                  onClick={() => triggerAutosave(4)}
                  className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <span>{t('Continue to Finance')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ---------------- STEP 4 — FINANCE ---------------- */}
          {currentStep === 4 && (
            <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-10 shadow-sm space-y-8">
              <div>
                <span className="eyebrow">{t('STEP 4 OF 5')}</span>
                <h2 className="text-2xl font-bold text-gray-900">{t('Understand Your Financial Fit')}</h2>
                <p className="text-xs text-gray-500 mt-1">{t('Provide your available capital and monthly household obligations.')}</p>
              </div>

              <div className="grid md:grid-cols-12 gap-6">
                {/* Left Form Inputs */}
                <div className="md:col-span-7 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">{at('Project Cost Estimate (₹)')} <span className="text-red-600" aria-hidden="true">*</span></label>
                    <input
                      type="number"
                      required
                      value={finance.project_cost}
                      onChange={(e) => setFinance({ ...finance, project_cost: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">{at('Available Entrepreneur Margin Capital (₹)')} <span className="text-red-600" aria-hidden="true">*</span></label>
                    <input
                      type="number"
                      required
                      value={finance.available_margin}
                      onChange={(e) => setFinance({ ...finance, available_margin: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">{at('Monthly Household Expenses (₹)')} <span className="text-red-600" aria-hidden="true">*</span></label>
                    <input
                      type="number"
                      required
                      value={finance.household_expenses}
                      onChange={(e) => setFinance({ ...finance, household_expenses: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs"
                    />
                  </div>

                  {/* Financial Understanding Self-Assessment */}
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3 pt-3">
                    <span className="eyebrow !mb-0">{t('FINANCIAL UNDERSTANDING')}</span>
                    
                    <div className="space-y-2">
                      <label className="block text-xs text-gray-700 font-medium">{t('Do you understand how EMI works?')} <span className="text-red-600" aria-hidden="true">*</span></label>
                      <div className="flex gap-2">
                        {["Yes", "Somewhat", "No"].map(opt => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setFinance({ ...finance, understands_emi: opt })}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                              finance.understands_emi === opt ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200'
                            }`}
                          >
                            {at(opt)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Card: Live Preview Calculation */}
                <div className="md:col-span-5 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <span className="eyebrow">{t('PRELIMINARY DEMO ESTIMATE')}</span>
                    
                    <div className="space-y-3 border-b border-blue-200/50 pb-4">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">{t('Project Cost:')}</span>
                        <span className="font-bold text-gray-900">₹{(Number(finance.project_cost) || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">{t('Your Available Margin:')}</span>
                        <span className="font-bold text-emerald-700">₹{(Number(finance.available_margin) || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">{t('Min Margin Needed (10%):')}</span>
                        <span className="font-semibold text-gray-700">₹{((Number(finance.project_cost) || 0) * 0.1).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-xs text-gray-500 font-medium">{t('Indicative Loan Amount')}</div>
                      <div className="text-2xl font-extrabold text-primary-700">
                        ₹{Math.max(0, (Number(finance.project_cost) || 0) - (Number(finance.available_margin) || 0)).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <p className="text-[10.5px] text-gray-500 italic mt-4">
                    {t('Final calculations, reducing balance interest, moratorium period, and exact EMI figures will come from the financial engine when you click Run.')}
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-4 py-2.5 text-xs font-semibold text-gray-600 hover:text-gray-900"
                >
                  {t('Back')}
                </button>
                <button
                  onClick={() => triggerAutosave(5)}
                  className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <span>{t('Continue to Review')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ---------------- STEP 5 — REVIEW & SUBMIT ---------------- */}
          {currentStep === 5 && (
            <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-10 shadow-sm space-y-8">
              <div>
                <span className="eyebrow">{t('STEP 5 OF 5')}</span>
                <h2 className="text-2xl font-bold text-gray-900">{t('Review Your Inputs')}</h2>
                <p className="text-xs text-gray-500 mt-1">{t('Check your assessment inputs before running the feasibility engine.')}</p>
              </div>

              {/* 5 Summary Cards */}
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-gray-900">{t('1. Personal Profile')}</div>
                    <div className="text-[11.5px] text-gray-600">{t('Age')} {profileValue(profile.age_group)} · {profileValue(profile.education)} · {profileValue(profile.business_experience)} {t('experience')}</div>
                  </div>
                  <button onClick={() => setCurrentStep(1)} className="text-xs font-bold text-primary-600 hover:underline">{t('Edit')}</button>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-gray-900">{t('2. Business & Location')}</div>
                    <div className="text-[11.5px] text-gray-600">{at(selectedCategory)} · {selectedVillageObj.name || 'Shikrapur'}, {selectedDistrict}, {selectedState}</div>
                  </div>
                  <button onClick={() => setCurrentStep(2)} className="text-xs font-bold text-primary-600 hover:underline">{t('Edit')}</button>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-gray-900">3. {t(selectedCategory)} {t('Readiness')}</div>
                    <div className="text-[11.5px] text-gray-600">{t('Category Questionnaire Completed')}</div>
                  </div>
                  <button onClick={() => setCurrentStep(3)} className="text-xs font-bold text-primary-600 hover:underline">{t('Edit')}</button>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-gray-900">{t('4. Financial Setup')}</div>
                    <div className="text-[11.5px] text-gray-600">{t('Project Cost:')} ₹{(Number(finance.project_cost) || 0).toLocaleString()} · {t('Your Available Margin:')} ₹{(Number(finance.available_margin) || 0).toLocaleString()}</div>
                  </div>
                  <button onClick={() => setCurrentStep(4)} className="text-xs font-bold text-primary-600 hover:underline">{t('Edit')}</button>
                </div>
              </div>

              {/* Bottom Run Action */}
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 space-y-4">
                <div className="text-xs text-blue-900 leading-relaxed">
                  {t('Ready to analyse? Our deterministic engines will evaluate 10km village catchment demand, entrepreneur readiness, loan scheme options, and EMI affordability.')}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => setCurrentStep(4)}
                    className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900"
                  >
                    {t('Back')}
                  </button>
                  <button
                    onClick={handleRunAnalysis}
                    className="px-8 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{t('Run Feasibility Analysis')} →</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ---------------- STEP 6 — PROCESSING ANIMATED SCREEN ---------------- */}
          {currentStep === 6 && (
            <div className="bg-white border border-gray-200 rounded-3xl p-12 shadow-sm text-center max-w-xl mx-auto space-y-8 my-8">
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-primary-100 border-t-primary-600 animate-spin"></div>
                <Sparkles className="w-8 h-8 text-primary-600" />
              </div>

              <div className="space-y-2">
                <span className="eyebrow">{t('PROTOTYPE ANALYSIS')}</span>
                <h2 className="text-2xl font-extrabold text-gray-900">{t('Building your feasibility picture')}</h2>
                <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">{t('Keeping market feasibility, entrepreneur readiness, and financial fit separate for clear explainability.')}</p>
              </div>

              {/* Sequential Animated Progress Checklist */}
              <div className="space-y-2.5 text-left max-w-sm mx-auto pt-2">
                {[
                  "Analysing local village demographics",
                  "Mapping nearby villages within 10km catchment",
                  "Evaluating local competitor density",
                  "Measuring road & power infrastructure signals",
                  "Assessing entrepreneur readiness & resources",
                  "Structuring reducing-balance finance scheme",
                  "Generating plain-language recommendations"
                ].map((txt, idx) => {
                  const isFinished = processingStage > idx;
                  const isCurrent = processingStage === idx + 1;
                  return (
                    <div key={idx} className={`flex items-center gap-3 text-xs font-semibold transition-all ${
                      isFinished ? 'text-emerald-700 font-bold' : (isCurrent ? 'text-primary-600 font-extrabold animate-pulse' : 'text-gray-300')
                    }`}>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                        isFinished ? 'bg-emerald-600 text-white' : (isCurrent ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-400')
                      }`}>
                        {isFinished ? <Check className="w-3 h-3" /> : idx + 1}
                      </div>
                      <span>{t(txt)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AssessmentWizard;
