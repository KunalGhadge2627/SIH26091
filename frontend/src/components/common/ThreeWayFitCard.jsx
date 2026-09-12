import React from 'react';
import { Store, UserCheck, Wallet, ArrowRight } from 'lucide-react';

export const ThreeWayFitCard = () => {
  return (
    <div className="bg-turf-surface border border-turf-border rounded-2xl p-6 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4 border-b border-turf-border pb-3">
        <span className="eyebrow !mb-0">Three-way fit analysis</span>
        <span className="text-[10px] font-semibold text-turf-text-muted bg-white border border-turf-border px-2 py-0.5 rounded-lg">Prototype data</span>
      </div>

      <div className="space-y-3">
        {/* Node 1 */}
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-turf-border">
          <div className="p-2 rounded-lg bg-turf-primary text-white shrink-0">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-turf-text">1. Business ↔ Location</div>
            <div className="text-[11px] text-turf-text-muted">Market feasibility & local demand</div>
          </div>
        </div>

        {/* Node 2 */}
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-turf-border">
          <div className="p-2 rounded-lg bg-turf-primary text-white shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-turf-text">2. Person ↔ Business</div>
            <div className="text-[11px] text-turf-text-muted">Entrepreneur readiness & resources</div>
          </div>
        </div>

        {/* Node 3 */}
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-turf-border">
          <div className="p-2 rounded-lg bg-turf-primary text-white shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-turf-text">3. Person ↔ Finance</div>
            <div className="text-[11px] text-turf-text-muted">Financial fit & debt capacity</div>
          </div>
        </div>
      </div>

      {/* Converging Result */}
      <div className="mt-4 pt-3 border-t border-turf-border flex items-center justify-between bg-turf-text text-white p-3.5 rounded-xl">
        <div className="text-xs font-medium">Converges into</div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-turf-primary-light">
          <span>Better Decision</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

export default ThreeWayFitCard;
