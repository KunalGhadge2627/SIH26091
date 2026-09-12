import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Printer, ArrowLeft, Info } from 'lucide-react';
import TopBar from '../components/common/TopBar';
import Sidebar from '../components/common/Sidebar';
import DisclaimerBanner from '../components/common/DisclaimerBanner';
import { useLanguage } from '../context/LanguageContext';
import api from '../api/client';

export const FinancialPlanPage = () => {
  const [searchParams] = useSearchParams();
  const assessmentId = searchParams.get('assessment') || 'ASM_DEFAULT';
  const { lang, t } = useLanguage();

  const [finPlan, setFinPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlan = async () => {
      setLoading(true);
      try {
        const resp = await api.getFinancialPlan(assessmentId);
        setFinPlan(resp.data);
      } catch (err) {
        console.error("Financial plan fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (assessmentId) fetchPlan();
  }, [assessmentId]);

  const handlePrint = () => {
    window.print();
  };

  const scheme = finPlan?.scheme || {};
  const summary = finPlan?.financial_summary || {};

  return (
    <div className="min-h-screen bg-white flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="Financial Plan" />

        <main className="p-6 md:p-10 max-w-5xl mx-auto w-full space-y-8 print:p-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-turf-border pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="eyebrow !mb-0">Financial fit · Demo estimate</span>
                <span className="text-[10px] font-semibold text-turf-text-muted bg-turf-surface border border-turf-border px-2 py-0.5 rounded-lg">Scheme matching</span>
              </div>
              <h1 className="text-2xl font-bold text-turf-text">{t('Financial Plan')}</h1>
              <p className="text-xs text-turf-text-muted mt-0.5">Government loan scheme details, reducing-balance EMI calculation, and 90-day roadmap.</p>
            </div>

            <div className="flex items-center gap-2 print:hidden">
              <button
                onClick={handlePrint}
                className="px-4 py-2.5 bg-turf-surface border border-turf-border hover:bg-turf-surface-hover text-turf-text font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>{t('Print plan')}</span>
              </button>
              <Link
                to={`/assessments/${assessmentId}/report`}
                className="text-xs font-semibold text-turf-primary hover:underline flex items-center gap-1 ml-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t('Back to results')}</span>
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-turf-text-muted">Loading financial plan calculations...</div>
          ) : (
            <div className="space-y-6">
              {/* Summary Strip (Margin -> Cost -> Loan) (Data Card Fills) */}
              <div className="grid sm:grid-cols-3 gap-4 bg-turf-surface border border-turf-border rounded-2xl p-6">
                <div className="p-4 rounded-2xl bg-white border border-turf-border">
                  <span className="text-[10px] font-medium text-turf-text-muted block mb-1">Your margin</span>
                  <div className="text-2xl stat-number text-turf-primary">₹{(summary.margin_available || 50000).toLocaleString()}</div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-turf-border">
                  <span className="text-[10px] font-medium text-turf-text-muted block mb-1">Project cost</span>
                  <div className="text-2xl stat-number text-turf-text">₹{(summary.project_cost || 350000).toLocaleString()}</div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-turf-border">
                  <span className="text-[10px] font-medium text-turf-text-muted block mb-1">Indicative loan</span>
                  <div className="text-2xl stat-number text-turf-text">₹{(summary.loan_amount || 300000).toLocaleString()}</div>
                </div>
              </div>

              {/* Scheme Card & Affordability Grid */}
              <div className="grid md:grid-cols-12 gap-6">
                {/* Scheme Card */}
                <div className="md:col-span-7 bg-white border border-turf-border rounded-2xl p-6 md:p-8 space-y-4">
                  <div className="flex items-center justify-between border-b border-turf-border pb-3">
                    <span className="eyebrow !mb-0">Indicative scheme</span>
                    <span className="text-xs font-semibold text-turf-primary bg-turf-surface border border-turf-border px-2.5 py-0.5 rounded-lg">
                      Government tier
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-turf-text">{scheme.name || 'Government Rural Term Loan Scheme'}</h3>
                  <p className="text-xs text-turf-text-muted leading-relaxed">{scheme.description}</p>

                  <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                    <div className="p-3 bg-turf-surface border border-turf-border rounded-xl">
                      <span className="text-turf-text-muted text-[10px] font-medium block">Interest rate</span>
                      <span className="stat-number text-turf-text">{scheme.interest_rate_pa || 8.0}% p.a.</span>
                    </div>

                    <div className="p-3 bg-turf-surface border border-turf-border rounded-xl">
                      <span className="text-turf-text-muted text-[10px] font-medium block">Tenure</span>
                      <span className="stat-number text-turf-text">{scheme.tenure_years || 7} Years ({scheme.tenure_years * 12} Mos)</span>
                    </div>

                    <div className="p-3 bg-turf-surface border border-turf-border rounded-xl">
                      <span className="text-turf-text-muted text-[10px] font-medium block">Moratorium period</span>
                      <span className="stat-number text-turf-primary">{scheme.moratorium_months || 6} Months</span>
                    </div>

                    <div className="p-3 bg-turf-surface border border-turf-border rounded-xl">
                      <span className="text-turf-primary text-[10px] font-medium block">Monthly EMI</span>
                      <span className="stat-number text-turf-primary text-sm">₹{(summary.monthly_emi || 4500).toLocaleString()}</span>
                    </div>
                  </div>

                  <p className="text-[10.5px] text-turf-text-muted italic">
                    Scheme terms are illustrative and must be verified at your local bank branch before applying.
                  </p>
                </div>

                {/* Monthly Affordability Traffic-Light Card */}
                <div className="md:col-span-5 bg-turf-surface border border-turf-border rounded-2xl p-6 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="eyebrow !mb-0">Monthly affordability</span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-white border border-turf-border text-turf-primary">
                        {summary.affordability_band || 'Good'}
                      </span>
                    </div>

                    {/* Indicator Bar */}
                    <div className="space-y-1 pt-2">
                      <div className="h-3 w-full rounded-full bg-turf-border relative overflow-hidden">
                        <div 
                          className="h-full bg-turf-primary rounded-full transition-all"
                          style={{ width: `${Math.min(100, Math.max(10, (summary.disposable_income_ratio || 0.35) * 100))}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[9px] font-semibold text-turf-text-muted pt-1">
                        <span>Safe (&lt;40%)</span>
                        <span>Moderate (40-60%)</span>
                        <span>High Risk (&gt;60%)</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs pt-2">
                      <div className="flex justify-between">
                        <span className="text-turf-text-muted">Estimated EMI:</span>
                        <span className="stat-number text-turf-text">₹{(summary.monthly_emi || 4500).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-turf-text-muted">Household Expenses:</span>
                        <span className="stat-number text-turf-text">₹{(summary.household_expenses || 12000).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[10.5px] text-turf-text-muted italic">
                    This indicator highlights potential debt pressure; it is not loan approval.
                  </p>
                </div>
              </div>

              {/* Know Before You Borrow — 4 Explainer Cards */}
              <div className="bg-white border border-turf-border rounded-2xl p-6 md:p-8 space-y-4">
                <span className="eyebrow">Know before you borrow</span>
                <h2 className="text-xl font-bold text-turf-text">Financial Literacy Notes</h2>

                <div className="grid sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-turf-surface border border-turf-border space-y-1">
                    <div className="font-bold text-xs text-turf-text">What is EMI?</div>
                    <p className="text-xs text-turf-text-muted leading-relaxed">
                      Equated Monthly Installment is a fixed monthly payment covering principal and reducing-balance interest.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-turf-surface border border-turf-border space-y-1">
                    <div className="font-bold text-xs text-turf-text">What is a Moratorium?</div>
                    <p className="text-xs text-turf-text-muted leading-relaxed">
                      A grace period (3 to 6 months) allowing you to set up operations before monthly principal EMI begins.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-turf-surface border border-turf-border space-y-1">
                    <div className="font-bold text-xs text-turf-text">Repayment Risk</div>
                    <p className="text-xs text-turf-text-muted leading-relaxed">
                      Keeping total monthly debt payments under 40% of disposable capacity prevents default in low-income months.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-turf-surface border border-turf-border space-y-1">
                    <div className="font-bold text-xs text-turf-text">Emergency Reserve</div>
                    <p className="text-xs text-turf-text-muted leading-relaxed">
                      Maintain ₹15,000+ liquid reserve to cushion inventory spikes or equipment repairs without missing EMIs.
                    </p>
                  </div>
                </div>

                {/* Moratorium Interest Info Strip */}
                <div className="p-3.5 bg-turf-surface border border-turf-border rounded-xl text-xs text-turf-text flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-turf-primary shrink-0 mt-0.5" />
                  <span>
                    <strong>Moratorium interest note:</strong> Interest of ₹{(summary.moratorium_interest || 6000).toLocaleString()} accrues during the {scheme.moratorium_months || 6}-month moratorium and is capitalized into your principal prior to EMI calculation.
                  </span>
                </div>
              </div>

              {/* 90-Day Execution Roadmap */}
              <div className="bg-white border border-turf-border rounded-2xl p-6 md:p-8 space-y-4">
                <span className="eyebrow">From preparation to launch</span>
                <h2 className="text-xl font-bold text-turf-text">90-Day Execution Roadmap</h2>

                <div className="grid md:grid-cols-3 gap-6 pt-2">
                  {/* Days 1-30 */}
                  <div className="p-5 rounded-2xl bg-turf-surface border border-turf-border space-y-3">
                    <div className="font-semibold text-xs text-turf-primary">Days 1–30</div>
                    <ul className="space-y-2 text-xs text-turf-text">
                      <li className="flex items-start gap-2">• Submit loan application at bank branch.</li>
                      <li className="flex items-start gap-2">• Apply for Udyam MSME & Panchayat NOC.</li>
                      <li className="flex items-start gap-2">• Secure workspace lease agreement.</li>
                    </ul>
                  </div>

                  {/* Days 31-60 */}
                  <div className="p-5 rounded-2xl bg-turf-surface border border-turf-border space-y-3">
                    <div className="font-semibold text-xs text-turf-primary">Days 31–60</div>
                    <ul className="space-y-2 text-xs text-turf-text">
                      <li className="flex items-start gap-2">• Deposit entrepreneur margin contribution.</li>
                      <li className="flex items-start gap-2">• Procure machinery & raw material inventory.</li>
                      <li className="flex items-start gap-2">• Install equipment and test trials.</li>
                    </ul>
                  </div>

                  {/* Days 61-90 */}
                  <div className="p-5 rounded-2xl bg-turf-surface border border-turf-border space-y-3">
                    <div className="font-semibold text-xs text-turf-primary">Days 61–90</div>
                    <ul className="space-y-2 text-xs text-turf-text">
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
