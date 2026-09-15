import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export const Logo = ({ className = "h-8", textClassName = "text-xl font-bold text-gray-900" }) => {
  const { translate: t } = useLanguage();
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-black text-lg shadow-sm">
        U
      </div>
      <span className={textClassName}>
        Udyam Gram <span className="text-xs font-semibold px-2 py-0.5 bg-primary-50 text-primary-700 rounded border border-primary-200 uppercase tracking-wider">{t('PROTOTYPE')}</span>
      </span>
    </div>
  );
};

export default Logo;
