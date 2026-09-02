import React from 'react';
import { Store, UserCheck, Wallet, ArrowRight } from 'lucide-react';

export const ThreeWayFitCard = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
      <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
        <span className="eyebrow !mb-0">THREE-WAY FIT ANALYSIS</span>
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-gray-100 px-2 py-0.5 rounded">PROTOTYPE DATA</span>
      </div>

      <div className="space-y-3">
        {/* Node 1 */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50/70 border border-blue-100">
          <div className="p-2 rounded-lg bg-blue-600 text-white shrink-0">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-blue-900">1. Business ↔ Location</div>
            <div className="text-[11px] text-blue-700">Market Feasibility & Local Demand</div>
          </div>
        </div>

        {/* Node 2 */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50/70 border border-emerald-100">
          <div className="p-2 rounded-lg bg-emerald-600 text-white shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-emerald-900">2. Person ↔ Business</div>
            <div className="text-[11px] text-emerald-700">Entrepreneur Readiness & Resources</div>
          </div>
        </div>

        {/* Node 3 */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50/70 border border-amber-100">
          <div className="p-2 rounded-lg bg-amber-600 text-white shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-amber-900">3. Person ↔ Finance</div>
            <div className="text-[11px] text-amber-700">Financial Fit & Debt Capacity</div>
          </div>
        </div>
      </div>

      {/* Converging Result */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between bg-gray-900 text-white p-3.5 rounded-xl">
        <div className="text-xs font-medium">Converges Into</div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
          <span>Better Decision</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

export default ThreeWayFitCard;
