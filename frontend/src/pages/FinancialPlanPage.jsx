import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Wallet, Printer, ArrowLeft, CheckCircle2, AlertCircle, Info, ShieldCheck } from 'lucide-react';
import TopBar from '../components/common/TopBar';
import Sidebar from '../components/common/Sidebar';
import DisclaimerBanner from '../components/common/DisclaimerBanner';
import { useLanguage } from '../context/LanguageContext';
import api from '../api/client';

export const FinancialPlanPage = () => {
  const [searchParams] = useSearchParams();
  const assessmentId = searchParams.get('assessment') || 'ASM_DEFAULT';
  const { lang } = useLanguage();

  const [finPlan, setFinPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlan = async () => {
      setLoading(true);
      try {
        const resp = await api.getFinancialPlan(assessmentId, lang);
        setFinPlan(resp.data);
      } catch (err) {
        console.error("Financial plan fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (assessmentId) fetchPlan();
  }, [assessmentId, lang]);

  const handlePrint = () => {
    window.print();
  };

  const scheme = finPlan?.scheme || {};
  const summary = finPlan?.financial_summary || {};
  const p90 = finPlan?.execution_milestones_90_days || {};

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="Financial Plan" />

        <main className="p-6 md:p-10 max-w-5xl mx-auto w-full space-y-8 print:p-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="eyebrow !mb-0">FINANCIAL FIT · DEMO ESTIMATE</span>
                <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">SCHEME MATCHING</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Financial Plan</h1>
              <p className="text-xs text-gray-500 mt-0.5">Government loan scheme details, reducing-balance EMI calculation, and 90-day roadmap.</p>
            </div>

            <div className="flex items-center gap-2 print:hidden">
              <button
                onClick={handlePrint}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print plan</span>
              </button>
              <Link
                to={`/assessments/${assessmentId}/report`}
                className="text-xs font-bold text-primary-600 hover:underline flex items-center gap-1 ml-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to results</span>
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-gray-400">Loading financial plan calculations...</div>
          ) : (
            <div className="space-y-6">
              {/* Summary Strip (Margin -> Cost -> Loan) */}
              <div className="grid sm:grid-cols-3 gap-4 bg-white border border-gray-200 rounded-3xl p-6 shadow-xs">
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest block mb-1">YOUR MARGIN</span>
                  <div className="text-2xl font-black text-emerald-700">₹{(summary.margin_available || 50000).toLocaleString()}</div>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100">
                  <span className="text-[10px] font-bold text-blue-800 uppercase tracking-widest block mb-1">PROJECT COST</span>
                  <div className="text-2xl font-black text-primary-700">₹{(summary.project_cost || 350000).toLocaleString()}</div>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100">
                  <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-widest block mb-1">INDICATIVE LOAN</span>
                  <div className="text-2xl font-black text-indigo-700">₹{(summary.loan_amount || 300000).toLocaleString()}</div>
                </div>
              </div>

              {/* Scheme Card & Affordability Grid */}
              <div className="grid md:grid-cols-12 gap-6">
                {/* Scheme Card */}
                <div className="md:col-span-7 bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <span className="eyebrow !mb-0">INDICATIVE SCHEME</span>
                    <span className="text-xs font-bold text-primary-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-100">
                      GOVERNMENT TIER
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900">{scheme.name || 'Government Rural Term Loan Scheme'}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{scheme.description}</p>

                  <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                    <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl">
                      <span className="text-gray-500 text-[10px] uppercase font-bold block">Interest Rate</span>
                      <span className="font-extrabold text-gray-900">{scheme.interest_rate_pa || 8.0}% p.a.</span>
                    </div>

                    <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl">
                      <span className="text-gray-500 text-[10px] uppercase font-bold block">Tenure</span>
                      <span className="font-extrabold text-gray-900">{scheme.tenure_years || 7} Years ({scheme.tenure_years * 12} Mos)</span>
                    </div>

                    <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl">
                      <span className="text-gray-500 text-[10px] uppercase font-bold block">Moratorium Period</span>
                      <span className="font-extrabold text-emerald-700">{scheme.moratorium_months || 6} Months</span>
                    </div>

                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
                      <span className="text-blue-800 text-[10px] uppercase font-bold block">Monthly EMI</span>
                      <span className="font-black text-primary-700 text-sm">₹{(summary.monthly_emi || 4500).toLocaleString()}</span>
                    </div>
                  </div>

                  <p className="text-[10.5px] text-gray-400 italic">
                    Scheme terms are illustrative and must be verified at your local bank branch before applying.
                  </p>
                </div>

                {/* Monthly Affordability Traffic-Light Card */}
                <div className="md:col-span-5 bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="eyebrow !mb-0">MONTHLY AFFORDABILITY</span>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded ${
                        summary.affordability_band === 'Good' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {summary.affordability_band || 'Good'}
                      </span>
                    </div>

                    {/* Traffic Light Gradient Bar */}
                    <div className="space-y-1 pt-2">
                      <div className="h-3 w-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 to-red-500 relative">
                        {/* Position Marker */}
                        <div 
                          className="w-4 h-4 bg-gray-900 border-2 border-white rounded-full absolute top-1/2 -translate-y-1/2 shadow-xs transition-all"
                          style={{ left: `${Math.min(95, Math.max(5, (summary.disposable_income_ratio || 0.35) * 100))}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[9px] font-bold text-gray-400 uppercase pt-1">
                        <span>Safe (&lt;40%)</span>
                        <span>Moderate (40-60%)</span>
                        <span>High Risk (&gt;60%)</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs pt-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Estimated EMI:</span>
                        <span className="font-bold text-gray-900">₹{(summary.monthly_emi || 4500).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Household Expenses:</span>
                        <span className="font-semibold text-gray-700">₹{(summary.household_expenses || 12000).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[10.5px] text-gray-400 italic">
                    This indicator highlights potential debt pressure; it is not loan approval.
                  </p>
                </div>
              </div>

              {/* Know Before You Borrow — 4 Explainer Cards */}
              <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-xs space-y-4">
                <span className="eyebrow">KNOW BEFORE YOU BORROW</span>
                <h2 className="text-xl font-bold text-gray-900">Financial Literacy Notes</h2>

                <div className="grid sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                    <div className="font-bold text-xs text-gray-900">What is EMI?</div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Equated Monthly Installment is a fixed monthly payment covering principal and reducing-balance interest.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                    <div className="font-bold text-xs text-gray-900">What is a Moratorium?</div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      A grace period (3 to 6 months) allowing you to set up operations before monthly principal EMI begins.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                    <div className="font-bold text-xs text-gray-900">Repayment Risk</div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Keeping total monthly debt payments under 40% of disposable capacity prevents default in low-income months.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                    <div className="font-bold text-xs text-gray-900">Emergency Reserve</div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Maintain ₹15,000+ liquid reserve to cushion inventory spikes or equipment repairs without missing EMIs.
                    </p>
                  </div>
                </div>

                {/* Moratorium Interest Info Strip */}
                <div className="p-3.5 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-900 flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Moratorium Interest Note:</strong> Interest of ₹{(summary.moratorium_interest || 6000).toLocaleString()} accrues during the {scheme.moratorium_months || 6}-month moratorium and is capitalized into your principal prior to EMI calculation.
                  </span>
                </div>
              </div>

              {/* 90-Day Execution Roadmap */}
              <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-xs space-y-4">
                <span className="eyebrow">FROM PREPARATION TO LAUNCH</span>
                <h2 className="text-xl font-bold text-gray-900">90-Day Execution Roadmap</h2>

                <div className="grid md:grid-cols-3 gap-6 pt-2">
                  {/* Days 1-30 */}
                  <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 relative overflow-hidden space-y-3">
                    <div className="absolute right-3 top-1 text-5xl font-black text-gray-200/50 select-none">30</div>
                    <div className="font-bold text-xs text-primary-700 uppercase tracking-wider">Days 1–30</div>
                    <ul className="space-y-2 text-xs text-gray-700">
                      <li className="flex items-start gap-2">• Submit loan application at bank branch.</li>
                      <li className="flex items-start gap-2">• Apply for Udyam MSME & Panchayat NOC.</li>
                      <li className="flex items-start gap-2">• Secure workspace lease agreement.</li>
                    </ul>
                  </div>

                  {/* Days 31-60 */}
                  <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 relative overflow-hidden space-y-3">
                    <div className="absolute right-3 top-1 text-5xl font-black text-gray-200/50 select-none">60</div>
                    <div className="font-bold text-xs text-primary-700 uppercase tracking-wider">Days 31–60</div>
                    <ul className="space-y-2 text-xs text-gray-700">
                      <li className="flex items-start gap-2">• Deposit entrepreneur margin contribution.</li>
                      <li className="flex items-start gap-2">• Procure machinery & raw material inventory.</li>
                      <li className="flex items-start gap-2">• Install equipment and test trials.</li>
                    </ul>
                  </div>

                  {/* Days 61-90 */}
                  <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 relative overflow-hidden space-y-3">
                    <div className="absolute right-3 top-1 text-5xl font-black text-gray-200/50 select-none">90</div>
                    <div className="font-bold text-xs text-primary-700 uppercase tracking-wider">Days 61–90</div>
                    <ul className="space-y-2 text-xs text-gray-700">
                      <li className="flex items-start gap-2">• Distribute local launch pamphlets.</li>
                      <li className="flex items-start gap-2">• Official commercial business launch.</li>
                      <li className="flex items-start gap-2">• Prepare for post-moratorium EMI repayment.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <DisclaimerBanner text="Financial calculations are demo estimates. Final loan approval and interest rates depend on bank credit appraisal." />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default FinancialPlanPage;
