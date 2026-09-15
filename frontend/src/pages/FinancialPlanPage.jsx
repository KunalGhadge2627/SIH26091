import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Printer, ArrowLeft, Info } from 'lucide-react';
import TopBar from '../components/common/TopBar';
import Sidebar from '../components/common/Sidebar';
import DisclaimerBanner from '../components/common/DisclaimerBanner';
import { useLanguage } from '../context/LanguageContext';
import api from '../api/client';
import { getCachedRequest, readCachedData } from '../api/requestCache';

export const FinancialPlanPage = () => {
  const [searchParams] = useSearchParams();
  const assessmentId = searchParams.get('assessment') || 'ASM_DEFAULT';
<<<<<<< HEAD
  const { lang, t } = useLanguage();
=======
  const { lang, translate: t } = useLanguage();
>>>>>>> development

  const cacheKey = `financial-plan:${assessmentId}`;
  const languageCacheKey = `${cacheKey}:${lang}`;
  const [finPlan, setFinPlan] = useState(() => readCachedData(cacheKey));
  const [loading, setLoading] = useState(() => !readCachedData(cacheKey));

  useEffect(() => {
    const fetchPlan = async () => {
      if (!readCachedData(cacheKey)) setLoading(true);
      try {
        const plan = await getCachedRequest(languageCacheKey, async () => {
          const resp = await api.getFinancialPlan(assessmentId, lang);
          return resp.data;
        });
        setFinPlan(plan);
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

  return (
    <div className="min-h-screen bg-white flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title={t('Financial Plan')} />

        <main className="p-6 md:p-10 max-w-5xl mx-auto w-full space-y-8 print:p-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-turf-border pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
<<<<<<< HEAD
                <span className="eyebrow !mb-0">Financial fit · Demo estimate</span>
                <span className="text-[10px] font-semibold text-turf-text-muted bg-turf-surface border border-turf-border px-2 py-0.5 rounded-lg">Scheme matching</span>
              </div>
              <h1 className="text-2xl font-bold text-turf-text">{t('Financial Plan')}</h1>
              <p className="text-xs text-turf-text-muted mt-0.5">Government loan scheme details, reducing-balance EMI calculation, and 90-day roadmap.</p>
=======
                <span className="eyebrow !mb-0">{t('FINANCIAL FIT · DEMO ESTIMATE')}</span>
                <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{t('SCHEME MATCHING')}</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{t('Financial Plan')}</h1>
              <p className="text-xs text-gray-500 mt-0.5">{t('Government loan scheme details, reducing-balance EMI calculation, and 90-day roadmap.')}</p>
>>>>>>> development
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
<<<<<<< HEAD
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
=======
            <div className="py-12 text-center text-xs text-gray-400">{t('Loading financial plan calculations...')}</div>
          ) : (
            <div className="space-y-6">
              {/* Summary Strip (Margin -> Cost -> Loan) */}
              <div className="grid sm:grid-cols-3 gap-4 bg-white border border-gray-200 rounded-3xl p-6 shadow-xs">
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest block mb-1">{t('YOUR MARGIN')}</span>
                  <div className="text-2xl font-black text-emerald-700">₹{(summary.margin_available || 50000).toLocaleString()}</div>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100">
                  <span className="text-[10px] font-bold text-blue-800 uppercase tracking-widest block mb-1">{t('PROJECT COST')}</span>
                  <div className="text-2xl font-black text-primary-700">₹{(summary.project_cost || 350000).toLocaleString()}</div>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100">
                  <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-widest block mb-1">{t('INDICATIVE LOAN')}</span>
                  <div className="text-2xl font-black text-indigo-700">₹{(summary.loan_amount || 300000).toLocaleString()}</div>
>>>>>>> development
                </div>
              </div>

              {/* Scheme Card & Affordability Grid */}
              <div className="grid md:grid-cols-12 gap-6">
                {/* Scheme Card */}
<<<<<<< HEAD
                <div className="md:col-span-7 bg-white border border-turf-border rounded-2xl p-6 md:p-8 space-y-4">
                  <div className="flex items-center justify-between border-b border-turf-border pb-3">
                    <span className="eyebrow !mb-0">Indicative scheme</span>
                    <span className="text-xs font-semibold text-turf-primary bg-turf-surface border border-turf-border px-2.5 py-0.5 rounded-lg">
                      Government tier
=======
                <div className="md:col-span-7 bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <span className="eyebrow !mb-0">{t('INDICATIVE SCHEME')}</span>
                    <span className="text-xs font-bold text-primary-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-100">
                      {t('GOVERNMENT TIER')}
>>>>>>> development
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-turf-text">{scheme.name || 'Government Rural Term Loan Scheme'}</h3>
                  <p className="text-xs text-turf-text-muted leading-relaxed">{scheme.description}</p>

                  <div className="grid grid-cols-2 gap-3 text-xs pt-2">
<<<<<<< HEAD
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
=======
                    <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl">
                      <span className="text-gray-500 text-[10px] uppercase font-bold block">{t('Interest Rate')}</span>
                        <span className="font-extrabold text-gray-900">{scheme.interest_rate_pa || 8.0}% {t('p.a.')}</span>
                    </div>

                    <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl">
                      <span className="text-gray-500 text-[10px] uppercase font-bold block">{t('Tenure')}</span>
                        <span className="font-extrabold text-gray-900">{scheme.tenure_years || 7} {t('Years')} ({scheme.tenure_years * 12} {t('Mos')})</span>
                    </div>

                    <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl">
                      <span className="text-gray-500 text-[10px] uppercase font-bold block">{t('Moratorium Period')}</span>
                        <span className="font-extrabold text-emerald-700">{scheme.moratorium_months || 6} {t('Months')}</span>
                    </div>

                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
                      <span className="text-blue-800 text-[10px] uppercase font-bold block">{t('Monthly EMI')}</span>
                      <span className="font-black text-primary-700 text-sm">₹{(summary.monthly_emi || 4500).toLocaleString()}</span>
                    </div>
                  </div>

                  <p className="text-[10.5px] text-gray-400 italic">
                    {t('Scheme terms are illustrative and must be verified at your local bank branch before applying.')}
>>>>>>> development
                  </p>
                </div>

                {/* Monthly Affordability Traffic-Light Card */}
                <div className="md:col-span-5 bg-turf-surface border border-turf-border rounded-2xl p-6 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
<<<<<<< HEAD
                      <span className="eyebrow !mb-0">Monthly affordability</span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-white border border-turf-border text-turf-primary">
                        {summary.affordability_band || 'Good'}
=======
                      <span className="eyebrow !mb-0">{t('MONTHLY AFFORDABILITY')}</span>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded ${
                        summary.affordability_band === 'Good' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {summary.affordability_band || t('Good')}
>>>>>>> development
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
<<<<<<< HEAD
                      <div className="flex justify-between text-[9px] font-semibold text-turf-text-muted pt-1">
                        <span>Safe (&lt;40%)</span>
                        <span>Moderate (40-60%)</span>
                        <span>High Risk (&gt;60%)</span>
=======
                      <div className="flex justify-between text-[9px] font-bold text-gray-400 uppercase pt-1">
                        <span>{t('Safe (<40%)')}</span>
                        <span>{t('Moderate (40-60%)')}</span>
                        <span>{t('High Risk (>60%)')}</span>
>>>>>>> development
                      </div>
                    </div>

                    <div className="space-y-2 text-xs pt-2">
                      <div className="flex justify-between">
<<<<<<< HEAD
                        <span className="text-turf-text-muted">Estimated EMI:</span>
                        <span className="stat-number text-turf-text">₹{(summary.monthly_emi || 4500).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-turf-text-muted">Household Expenses:</span>
                        <span className="stat-number text-turf-text">₹{(summary.household_expenses || 12000).toLocaleString()}</span>
=======
                        <span className="text-gray-500">{t('Estimated EMI:')}</span>
                        <span className="font-bold text-gray-900">₹{(summary.monthly_emi || 4500).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">{t('Household Expenses:')}</span>
                        <span className="font-semibold text-gray-700">₹{(summary.household_expenses || 12000).toLocaleString()}</span>
>>>>>>> development
                      </div>
                    </div>
                  </div>

<<<<<<< HEAD
                  <p className="text-[10.5px] text-turf-text-muted italic">
                    This indicator highlights potential debt pressure; it is not loan approval.
=======
                  <p className="text-[10.5px] text-gray-400 italic">
                    {t('This indicator highlights potential debt pressure; it is not loan approval.')}
>>>>>>> development
                  </p>
                </div>
              </div>

              {/* Know Before You Borrow — 4 Explainer Cards */}
<<<<<<< HEAD
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
=======
              <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-xs space-y-4">
                <span className="eyebrow">{t('KNOW BEFORE YOU BORROW')}</span>
                <h2 className="text-xl font-bold text-gray-900">{t('Financial Literacy Notes')}</h2>

                <div className="grid sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                    <div className="font-bold text-xs text-gray-900">{t('What is EMI?')}</div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {t('Equated Monthly Installment is a fixed monthly payment covering principal and reducing-balance interest.')}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                    <div className="font-bold text-xs text-gray-900">{t('What is a Moratorium?')}</div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {t('A grace period (3 to 6 months) allowing you to set up operations before monthly principal EMI begins.')}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                    <div className="font-bold text-xs text-gray-900">{t('Repayment Risk')}</div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {t('Keeping total monthly debt payments under 40% of disposable capacity prevents default in low-income months.')}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                    <div className="font-bold text-xs text-gray-900">{t('Emergency Reserve')}</div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {t('Maintain ₹15,000+ liquid reserve to cushion inventory spikes or equipment repairs without missing EMIs.')}
>>>>>>> development
                    </p>
                  </div>
                </div>

                {/* Moratorium Interest Info Strip */}
                <div className="p-3.5 bg-turf-surface border border-turf-border rounded-xl text-xs text-turf-text flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-turf-primary shrink-0 mt-0.5" />
                  <span>
<<<<<<< HEAD
                    <strong>Moratorium interest note:</strong> Interest of ₹{(summary.moratorium_interest || 6000).toLocaleString()} accrues during the {scheme.moratorium_months || 6}-month moratorium and is capitalized into your principal prior to EMI calculation.
=======
                    <strong>{t('Moratorium Interest Note:')}</strong> {t('Interest of')} ₹{(summary.moratorium_interest || 6000).toLocaleString()} {t('accrues during the')} {scheme.moratorium_months || 6} {t('month moratorium and is capitalized into your principal prior to EMI calculation.')}
>>>>>>> development
                  </span>
                </div>
              </div>

              {/* 90-Day Execution Roadmap */}
<<<<<<< HEAD
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
=======
              <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-xs space-y-4">
                <span className="eyebrow">{t('FROM PREPARATION TO LAUNCH')}</span>
                <h2 className="text-xl font-bold text-gray-900">{t('90-Day Execution Roadmap')}</h2>

                <div className="grid md:grid-cols-3 gap-6 pt-2">
                  {/* Days 1-30 */}
                  <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 relative overflow-hidden space-y-3">
                    <div className="absolute right-3 top-1 text-5xl font-black text-gray-200/50 select-none">30</div>
                    <div className="font-bold text-xs text-primary-700 uppercase tracking-wider">{t('Days 1–30')}</div>
                    <ul className="space-y-2 text-xs text-gray-700">
                      {(p90.days_1_30 || []).map((item) => <li key={item} className="flex items-start gap-2">• {item}</li>)}
>>>>>>> development
                    </ul>
                  </div>

                  {/* Days 31-60 */}
<<<<<<< HEAD
                  <div className="p-5 rounded-2xl bg-turf-surface border border-turf-border space-y-3">
                    <div className="font-semibold text-xs text-turf-primary">Days 31–60</div>
                    <ul className="space-y-2 text-xs text-turf-text">
                      <li className="flex items-start gap-2">• Deposit entrepreneur margin contribution.</li>
                      <li className="flex items-start gap-2">• Procure machinery & raw material inventory.</li>
                      <li className="flex items-start gap-2">• Install equipment and test trials.</li>
=======
                  <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 relative overflow-hidden space-y-3">
                    <div className="absolute right-3 top-1 text-5xl font-black text-gray-200/50 select-none">60</div>
                    <div className="font-bold text-xs text-primary-700 uppercase tracking-wider">{t('Days 31–60')}</div>
                    <ul className="space-y-2 text-xs text-gray-700">
                      {(p90.days_31_60 || []).map((item) => <li key={item} className="flex items-start gap-2">• {item}</li>)}
>>>>>>> development
                    </ul>
                  </div>

                  {/* Days 61-90 */}
<<<<<<< HEAD
                  <div className="p-5 rounded-2xl bg-turf-surface border border-turf-border space-y-3">
                    <div className="font-semibold text-xs text-turf-primary">Days 61–90</div>
                    <ul className="space-y-2 text-xs text-turf-text">
                      <li className="flex items-start gap-2">• Distribute local launch pamphlets.</li>
                      <li className="flex items-start gap-2">• Official commercial business launch.</li>
                      <li className="flex items-start gap-2">• Prepare for post-moratorium EMI repayment.</li>
=======
                  <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 relative overflow-hidden space-y-3">
                    <div className="absolute right-3 top-1 text-5xl font-black text-gray-200/50 select-none">90</div>
                    <div className="font-bold text-xs text-primary-700 uppercase tracking-wider">{t('Days 61–90')}</div>
                    <ul className="space-y-2 text-xs text-gray-700">
                      {(p90.days_61_90 || []).map((item) => <li key={item} className="flex items-start gap-2">• {item}</li>)}
>>>>>>> development
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
