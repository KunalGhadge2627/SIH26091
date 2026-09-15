import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

<<<<<<< HEAD
export const DisclaimerBanner = ({ text, title = "Prototype guidance" }) => {
=======
export const DisclaimerBanner = ({ text, title = "PROTOTYPE GUIDANCE" }) => {
  const { translate: t } = useLanguage();
>>>>>>> development
  return (
    <div className="p-4 rounded-2xl bg-turf-surface border border-turf-border text-turf-text text-xs leading-relaxed flex items-start gap-3 my-4">
      <AlertTriangle className="w-5 h-5 text-turf-primary shrink-0 mt-0.5" />
      <div>
<<<<<<< HEAD
        <span className="font-semibold text-turf-primary block mb-0.5">{title}</span>
        <span className="text-turf-text-muted">{text || "Recommendations use prototype data and deterministic scoring models. Guidance does not guarantee business financial success or loan approval."}</span>
=======
        <span className="font-bold text-amber-800 uppercase tracking-wider block mb-0.5">{t(title)}</span>
        <span>{t(text || "Recommendations use prototype data and deterministic scoring models. Guidance does not guarantee business financial success or loan approval.")}</span>
>>>>>>> development
      </div>
    </div>
  );
};

export default DisclaimerBanner;
