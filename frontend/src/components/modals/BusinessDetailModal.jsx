import React, { useEffect, useState } from 'react';
import { X, CheckCircle2, AlertTriangle } from 'lucide-react';
import api from '../../api/client';
import { useLanguage } from '../../context/LanguageContext';

export const BusinessDetailModal = ({ category, onClose }) => {
  const { translate: t } = useLanguage();
  const [model, setModel] = useState(null);

  useEffect(() => {
    if (category) {
      api.getBusinessModelCategory(category)
        .then(res => setModel(res.data))
        .catch(err => console.error(err));
    }
  }, [category]);

  if (!category) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 border border-turf-border relative">
        <div className="flex items-center justify-between border-b border-turf-border pb-4">
          <div>
<<<<<<< HEAD
            <span className="eyebrow">Category profile</span>
            <h2 className="text-xl font-bold text-turf-text">{model?.display_name || category}</h2>
=======
            <span className="eyebrow">{t('CATEGORY PROFILE')}</span>
            <h2 className="text-xl font-bold text-gray-900">{t(model?.display_name || category)}</h2>
>>>>>>> development
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full border border-turf-border text-turf-text-muted hover:text-turf-text hover:bg-turf-surface transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {model ? (
<<<<<<< HEAD
          <div className="space-y-6 text-xs text-turf-text">
            <p className="text-sm text-turf-text-muted leading-relaxed">{model.description}</p>

            <div className="p-4 rounded-2xl bg-turf-surface border border-turf-border flex items-center justify-between">
              <span className="font-semibold text-turf-text">Capital requirement:</span>
              <span className="stat-number text-turf-primary text-sm">
                ₹{(model.capital_min / 100000).toFixed(1)} Lakh – ₹{(model.capital_max / 100000).toFixed(1)} Lakh
=======
          <div className="space-y-6 text-xs text-gray-700">
            <p className="text-sm text-gray-600 leading-relaxed">{t(model.description)}</p>

            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center justify-between">
              <span className="font-semibold text-blue-900">{t('Capital Requirement:')}</span>
              <span className="font-extrabold text-primary-700 text-sm">
                ₹{(model.capital_min / 100000).toFixed(1)} {t('Lakh')} – ₹{(model.capital_max / 100000).toFixed(1)} {t('Lakh')}
>>>>>>> development
              </span>
            </div>

            <div className="space-y-2">
<<<<<<< HEAD
              <span className="font-semibold text-turf-text block text-xs">Demand drivers</span>
              <ul className="space-y-1.5 pl-2">
                {model.demand_drivers?.map((d, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-turf-primary shrink-0" />
                    <span>{d}</span>
=======
              <span className="font-bold text-gray-900 uppercase tracking-wider block text-[11px]">{t('Demand Drivers')}</span>
              <ul className="space-y-1.5 pl-2">
                {model.demand_drivers?.map((d, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{t(d)}</span>
>>>>>>> development
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
<<<<<<< HEAD
              <span className="font-semibold text-turf-text block text-xs">Supply signals</span>
              <ul className="space-y-1.5 pl-2">
                {model.supply_signals?.map((s, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-turf-primary shrink-0" />
                    <span>{s}</span>
=======
              <span className="font-bold text-gray-900 uppercase tracking-wider block text-[11px]">{t('Supply Signals')}</span>
              <ul className="space-y-1.5 pl-2">
                {model.supply_signals?.map((s, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary-600 shrink-0" />
                    <span>{t(s)}</span>
>>>>>>> development
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
<<<<<<< HEAD
              <span className="font-semibold text-turf-text block text-xs">Risk factors</span>
=======
              <span className="font-bold text-gray-900 uppercase tracking-wider block text-[11px]">{t('Risk Factors')}</span>
>>>>>>> development
              <ul className="space-y-1.5 pl-2">
                {model.risk_factors?.map((r, i) => (
                  <li key={i} className="flex items-center gap-2 text-turf-text-muted">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{t(r)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
<<<<<<< HEAD
          <div className="py-8 text-center text-xs text-turf-text-muted">Loading business category details...</div>
=======
          <div className="py-8 text-center text-xs text-gray-400">{t('Loading business category details...')}</div>
>>>>>>> development
        )}

        <div className="text-center pt-2">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-turf-primary hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-colors"
          >
            {t('Close Profile')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetailModal;
