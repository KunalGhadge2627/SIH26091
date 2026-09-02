import React from 'react';
import { X, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';
import ScoreRing from '../common/ScoreRing';

export const CompareModal = ({ asm1, asm2, onClose }) => {
  if (!asm1 || !asm2) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <span className="eyebrow">SIDE-BY-SIDE COMPARISON</span>
            <h2 className="text-xl font-bold text-gray-900">Compare Past Assessments</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2-Column Comparison Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Column 1 */}
          <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-4">
            <div className="border-b border-gray-200 pb-3">
              <span className="text-[10px] font-bold text-primary-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded">ASSESSMENT A</span>
              <h3 className="text-base font-bold text-gray-900 mt-1">{asm1.category}</h3>
              <p className="text-xs text-gray-500">Village ID: {asm1.village_id} · {asm1.created_at?.slice(0,10)}</p>
            </div>

            <div className="flex items-center gap-4 py-2">
              <ScoreRing score={asm1.computed_scores?.overall_score || 70} size={80} strokeWidth={8} />
              <div>
                <div className="text-xs font-bold text-gray-900">{asm1.computed_scores?.verdict_title || 'Promising'}</div>
                <div className="text-[11px] text-gray-500">Verdict Band: {asm1.computed_scores?.verdict_band}</div>
              </div>
            </div>

            <div className="space-y-2 text-xs border-t border-gray-200 pt-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Market Score:</span>
                <span className="font-bold text-gray-900">{asm1.computed_scores?.market_score}/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Readiness Score:</span>
                <span className="font-bold text-gray-900">{asm1.computed_scores?.readiness_score}/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Financial Score:</span>
                <span className="font-bold text-gray-900">{asm1.computed_scores?.financial_score}/100</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2 font-bold">
                <span className="text-gray-700">Project Cost:</span>
                <span className="text-primary-700">₹{asm1.project_cost?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Monthly EMI:</span>
                <span className="font-bold text-gray-900">₹{asm1.computed_finance?.monthly_emi?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Column 2 */}
          <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-4">
            <div className="border-b border-gray-200 pb-3">
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded">ASSESSMENT B</span>
              <h3 className="text-base font-bold text-gray-900 mt-1">{asm2.category}</h3>
              <p className="text-xs text-gray-500">Village ID: {asm2.village_id} · {asm2.created_at?.slice(0,10)}</p>
            </div>

            <div className="flex items-center gap-4 py-2">
              <ScoreRing score={asm2.computed_scores?.overall_score || 70} size={80} strokeWidth={8} />
              <div>
                <div className="text-xs font-bold text-gray-900">{asm2.computed_scores?.verdict_title || 'Promising'}</div>
                <div className="text-[11px] text-gray-500">Verdict Band: {asm2.computed_scores?.verdict_band}</div>
              </div>
            </div>

            <div className="space-y-2 text-xs border-t border-gray-200 pt-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Market Score:</span>
                <span className="font-bold text-gray-900">{asm2.computed_scores?.market_score}/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Readiness Score:</span>
                <span className="font-bold text-gray-900">{asm2.computed_scores?.readiness_score}/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Financial Score:</span>
                <span className="font-bold text-gray-900">{asm2.computed_scores?.financial_score}/100</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2 font-bold">
                <span className="text-gray-700">Project Cost:</span>
                <span className="text-primary-700">₹{asm2.project_cost?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Monthly EMI:</span>
                <span className="font-bold text-gray-900">₹{asm2.computed_finance?.monthly_emi?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center pt-2">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs rounded-xl"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompareModal;
