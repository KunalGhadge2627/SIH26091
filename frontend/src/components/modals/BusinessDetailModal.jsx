import React, { useEffect, useState } from 'react';
import { X, CheckCircle2, AlertTriangle } from 'lucide-react';
import api from '../../api/client';

export const BusinessDetailModal = ({ category, onClose }) => {
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
            <span className="eyebrow">Category profile</span>
            <h2 className="text-xl font-bold text-turf-text">{model?.display_name || category}</h2>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full border border-turf-border text-turf-text-muted hover:text-turf-text hover:bg-turf-surface transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {model ? (
          <div className="space-y-6 text-xs text-turf-text">
            <p className="text-sm text-turf-text-muted leading-relaxed">{model.description}</p>

            <div className="p-4 rounded-2xl bg-turf-surface border border-turf-border flex items-center justify-between">
              <span className="font-semibold text-turf-text">Capital requirement:</span>
              <span className="stat-number text-turf-primary text-sm">
                ₹{(model.capital_min / 100000).toFixed(1)} Lakh – ₹{(model.capital_max / 100000).toFixed(1)} Lakh
              </span>
            </div>

            <div className="space-y-2">
              <span className="font-semibold text-turf-text block text-xs">Demand drivers</span>
              <ul className="space-y-1.5 pl-2">
                {model.demand_drivers?.map((d, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-turf-primary shrink-0" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <span className="font-semibold text-turf-text block text-xs">Supply signals</span>
              <ul className="space-y-1.5 pl-2">
                {model.supply_signals?.map((s, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-turf-primary shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <span className="font-semibold text-turf-text block text-xs">Risk factors</span>
              <ul className="space-y-1.5 pl-2">
                {model.risk_factors?.map((r, i) => (
                  <li key={i} className="flex items-center gap-2 text-turf-text-muted">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-turf-text-muted">Loading business category details...</div>
        )}

        <div className="text-center pt-2">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-turf-primary hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-colors"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetailModal;
