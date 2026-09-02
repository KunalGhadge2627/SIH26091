import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const LANGUAGES_LIST = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', native: 'கன்னட' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' }
];

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState(localStorage.getItem('preferred_language') || 'en');

  const setLang = (code) => {
    localStorage.setItem('preferred_language', code);
    setLangState(code);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, languagesList: LANGUAGES_LIST }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
