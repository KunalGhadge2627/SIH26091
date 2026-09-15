import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export const Logo = ({ className = "h-8", textClassName = "text-xl font-bold text-turf-text" }) => {
  const { t } = useLanguage();
  return (
    <div className="flex items-center gap-2.5">
      <img
        src="/gram-setu-logo.png"
        alt="Gram Setu"
        className={`${className} w-auto shrink-0 object-contain`}
      />
      <span className={textClassName}>
        Gram Setu <span className="text-xs font-semibold px-2 py-0.5 bg-turf-surface text-turf-primary rounded-lg border border-turf-border">{t('Prototype')}</span>
      </span>
    </div>
  );
};

export default Logo;
