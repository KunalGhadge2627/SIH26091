import React, { useEffect, useState } from 'react';
import { X, CheckCircle2, AlertTriangle, Store, ShieldCheck } from 'lucide-react';
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
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <span className="eyebrow">CATEGORY PROFILE</span>
            <h2 className="text-xl font-bold text-gray-900">{model?.display_name || category}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {model ? (
          <div className="space-y-6 text-xs text-gray-700">
            <p className="text-sm text-gray-600 leading-relaxed">{model.description}</p>

            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center justify-between">
              <span className="font-semibold text-blue-900">Capital Requirement:</span>
              <span className="font-extrabold text-primary-700 text-sm">
                ₹{(model.capital_min / 100000).toFixed(1)} Lakh – ₹{(model.capital_max / 100000).toFixed(1)} Lakh
              </span>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-gray-900 uppercase tracking-wider block text-[11px]">Demand Drivers</span>
              <ul className="space-y-1.5 pl-2">
                {model.demand_drivers?.map((d, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-gray-900 uppercase tracking-wider block text-[11px]">Supply Signals</span>
              <ul className="space-y-1.5 pl-2">
                {model.supply_signals?.map((s, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary-600 shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-gray-900 uppercase tracking-wider block text-[11px]">Risk Factors</span>
              <ul className="space-y-1.5 pl-2">
                {model.risk_factors?.map((r, i) => (
                  <li key={i} className="flex items-center gap-2 text-amber-900">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-gray-400">Loading business category details...</div>
        )}

        <div className="text-center pt-2">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetailModal;
