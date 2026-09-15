import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const DisclaimerBanner = ({ text, title = "PROTOTYPE GUIDANCE" }) => {
  const { translate: t } = useLanguage();
  return (
    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed flex items-start gap-3 shadow-xs my-4">
      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
      <div>
        <span className="font-bold text-amber-800 uppercase tracking-wider block mb-0.5">{t(title)}</span>
        <span>{t(text || "Recommendations use prototype data and deterministic scoring models. Guidance does not guarantee business financial success or loan approval.")}</span>
      </div>
    </div>
  );
};

export default DisclaimerBanner;
