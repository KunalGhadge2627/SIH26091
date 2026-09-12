import React from 'react';
import { X } from 'lucide-react';
import ScoreRing from '../common/ScoreRing';

export const CompareModal = ({ asm1, asm2, onClose }) => {
  if (!asm1 || !asm2) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 border border-turf-border relative">
        <div className="flex items-center justify-between border-b border-turf-border pb-4">
          <div>
            <span className="eyebrow">Side-by-side comparison</span>
            <h2 className="text-xl font-bold text-turf-text">Compare Past Assessments</h2>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full border border-turf-border text-turf-text-muted hover:text-turf-text hover:bg-turf-surface transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2-Column Comparison Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Column 1 */}
          <div className="p-5 rounded-2xl bg-turf-surface border border-turf-border space-y-4">
            <div className="border-b border-turf-border pb-3">
              <span className="text-[10px] font-semibold text-turf-primary bg-white border border-turf-border px-2 py-0.5 rounded-lg">Assessment A</span>
              <h3 className="text-base font-bold text-turf-text mt-1.5">{asm1.category}</h3>
              <p className="text-xs text-turf-text-muted">Village ID: {asm1.village_id} · {asm1.created_at?.slice(0,10)}</p>
            </div>

            <div className="flex items-center gap-4 py-2">
              <ScoreRing score={asm1.computed_scores?.overall_score || 70} size={80} strokeWidth={8} />
              <div>
                <div className="text-xs font-bold text-turf-text">{asm1.computed_scores?.verdict_title || 'Promising'}</div>
                <div className="text-[11px] text-turf-text-muted">Verdict Band: {asm1.computed_scores?.verdict_band}</div>
              </div>
            </div>

            <div className="space-y-2 text-xs border-t border-turf-border pt-3">
              <div className="flex justify-between">
                <span className="text-turf-text-muted">Market Score:</span>
                <span className="stat-number text-turf-text">{asm1.computed_scores?.market_score}/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-turf-text-muted">Readiness Score:</span>
                <span className="stat-number text-turf-text">{asm1.computed_scores?.readiness_score}/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-turf-text-muted">Financial Score:</span>
                <span className="stat-number text-turf-text">{asm1.computed_scores?.financial_score}/100</span>
              </div>
              <div className="flex justify-between border-t border-turf-border pt-2 font-bold">
                <span className="text-turf-text">Project Cost:</span>
                <span className="stat-number text-turf-primary">₹{asm1.project_cost?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-turf-text-muted">Monthly EMI:</span>
                <span className="stat-number text-turf-text">₹{asm1.computed_finance?.monthly_emi?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Column 2 */}
          <div className="p-5 rounded-2xl bg-turf-surface border border-turf-border space-y-4">
            <div className="border-b border-turf-border pb-3">
              <span className="text-[10px] font-semibold text-turf-primary bg-white border border-turf-border px-2 py-0.5 rounded-lg">Assessment B</span>
              <h3 className="text-base font-bold text-turf-text mt-1.5">{asm2.category}</h3>
              <p className="text-xs text-turf-text-muted">Village ID: {asm2.village_id} · {asm2.created_at?.slice(0,10)}</p>
            </div>

            <div className="flex items-center gap-4 py-2">
              <ScoreRing score={asm2.computed_scores?.overall_score || 70} size={80} strokeWidth={8} />
              <div>
                <div className="text-xs font-bold text-turf-text">{asm2.computed_scores?.verdict_title || 'Promising'}</div>
                <div className="text-[11px] text-turf-text-muted">Verdict Band: {asm2.computed_scores?.verdict_band}</div>
              </div>
            </div>

            <div className="space-y-2 text-xs border-t border-turf-border pt-3">
              <div className="flex justify-between">
                <span className="text-turf-text-muted">Market Score:</span>
                <span className="stat-number text-turf-text">{asm2.computed_scores?.market_score}/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-turf-text-muted">Readiness Score:</span>
                <span className="stat-number text-turf-text">{asm2.computed_scores?.readiness_score}/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-turf-text-muted">Financial Score:</span>
                <span className="stat-number text-turf-text">{asm2.computed_scores?.financial_score}/100</span>
              </div>
              <div className="flex justify-between border-t border-turf-border pt-2 font-bold">
                <span className="text-turf-text">Project Cost:</span>
                <span className="stat-number text-turf-primary">₹{asm2.project_cost?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-turf-text-muted">Monthly EMI:</span>
                <span className="stat-number text-turf-text">₹{asm2.computed_finance?.monthly_emi?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center pt-2">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-800 hover:bg-gray-900 text-white font-semibold text-xs rounded-xl transition-colors"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompareModal;
