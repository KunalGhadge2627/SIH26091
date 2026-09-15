import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

<<<<<<< HEAD
export const Logo = ({ className = "h-8", textClassName = "text-xl font-bold text-turf-text" }) => {
=======
export const Logo = ({ className = "h-8", textClassName = "text-xl font-bold text-gray-900" }) => {
  const { translate: t } = useLanguage();
>>>>>>> development
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-xl bg-turf-primary flex items-center justify-center text-white font-extrabold text-lg">
        U
      </div>
      <span className={textClassName}>
<<<<<<< HEAD
        placeholder <span className="text-xs font-semibold px-2 py-0.5 bg-turf-surface text-turf-primary rounded-lg border border-turf-border">Prototype</span>
=======
        Udyam Gram <span className="text-xs font-semibold px-2 py-0.5 bg-primary-50 text-primary-700 rounded border border-primary-200 uppercase tracking-wider">{t('PROTOTYPE')}</span>
>>>>>>> development
      </span>
    </div>
  );
};

export default Logo;
