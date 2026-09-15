import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const LanguageSelector = ({ className = "" }) => {
  const { lang, setLang, languagesList } = useLanguage();

  return (
    <div className={`relative flex items-center gap-1.5 bg-gray-50/80 hover:bg-gray-100/80 border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs text-gray-700 transition-colors ${className}`}>
      <Globe className="w-4 h-4 text-primary-600 shrink-0" />
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value)}
        aria-label="Select Language"
        className="bg-transparent text-xs font-semibold text-gray-800 outline-none cursor-pointer pr-1"
      >
        {languagesList.map((item) => (
          <option key={item.code} value={item.code} className="bg-white text-gray-900">
            {item.native} ({item.code.toUpperCase()})
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
