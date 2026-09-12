import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, ArrowRight, Store, MapPin } from 'lucide-react';
import TopBar from '../components/common/TopBar';
import Sidebar from '../components/common/Sidebar';
import ScoreRing from '../components/common/ScoreRing';
import ScoreBar from '../components/common/ScoreBar';
import LocationMap from '../components/map/LocationMap';
import DisclaimerBanner from '../components/common/DisclaimerBanner';
import { useLanguage } from '../context/LanguageContext';
import api from '../api/client';

export const Dashboard = () => {
  const { lang, t } = useLanguage();
  const [latestAssessment, setLatestAssessment] = useState(null);
  const [report, setReport] = useState(null);
  const [marketMap, setMarketMap] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const listResp = await api.listAssessments();
        const assessments = listResp.data;
        const completed = assessments.filter(a => a.status === 'complete');
        
        if (completed.length > 0) {
          const latest = completed[0];
          setLatestAssessment(latest);

          const [reportResp, mapResp] = await Promise.all([
            api.getReport(latest.id, lang),
            api.getMarketMap(latest.id)
          ]);

          setReport(reportResp.data);
          setMarketMap(mapResp.data);
        }
      } catch (err) {
        console.error("Dashboard data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [lang]);

  return (
    <div className="min-h-screen bg-white flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="Decision Dashboard" />

        <main className="p-6 md:p-10 max-w-7xl mx-auto w-full space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="eyebrow">{t('Decision dashboard')}</span>
              <h1 className="text-2xl font-bold text-turf-text">{t('Your business assessment')}</h1>
              <p className="text-xs text-turf-text-muted mt-0.5">{t('Pre-investment advisory overview and village catchment intelligence.')}</p>
            </div>

            <Link
              to="/assessment/new"
              className="px-5 py-2.5 bg-turf-primary hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 w-fit transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t('New assessment')}</span>
            </Link>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-turf-text-muted">Loading dashboard intelligence...</div>
          ) : !latestAssessment || !report ? (
            /* Empty State */
            <div className="bg-white border border-turf-border rounded-2xl p-12 text-center space-y-4 max-w-md mx-auto my-8">
              <div className="w-16 h-16 rounded-2xl bg-turf-surface text-turf-primary flex items-center justify-center mx-auto border border-turf-border">
                <Store className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-turf-text">{t('No completed assessments yet')}</h3>
                <p className="text-xs text-turf-text-muted leading-relaxed">
                  Start your first business feasibility assessment to evaluate local village demand, readiness, and loan EMI affordability.
                </p>
              </div>
              <Link
                to="/assessment/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-turf-primary hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-colors"
              >
                <span>{t('Start your first assessment')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            /* Active Dashboard View */
            <div className="space-y-6">
              <div className="grid lg:grid-cols-12 gap-6">
                {/* Left Card: Latest Assessment Summary (Content Card) */}
                <div className="lg:col-span-7 bg-white border border-turf-border rounded-2xl p-6 md:p-8 space-y-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-turf-border pb-3">
                      <span className="text-[10px] font-semibold text-turf-primary bg-turf-surface border border-turf-border px-2.5 py-1 rounded-lg">
                        {t('Latest assessment')} · {latestAssessment.created_at?.slice(0, 10)}
                      </span>
                      <Link
                        to={`/assessments/${latestAssessment.id}/report`}
                        className="text-xs font-semibold text-turf-primary hover:underline flex items-center gap-1"
                      >
                        <span>{t('Full report')}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-turf-text">{report.category}</h2>
                      <p className="text-xs text-turf-text-muted flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-turf-text-muted" />
                        <span>Village ID: {latestAssessment.village_id}</span>
                      </p>
                    </div>

                    {/* Semicircular / Circular Score Ring (Data Sub-Card) */}
                    <div className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-2xl bg-turf-surface border border-turf-border">
                      <ScoreRing score={report.computed_scores?.overall_score || 75} size={110} strokeWidth={9} label={t('Feasibility')} />
                      <div className="space-y-1 text-center sm:text-left">
                        <div className="text-base font-bold text-turf-text">
                          {report.computed_scores?.verdict_title || 'Proceed after preparation'}
                        </div>
                        <div className="text-xs font-semibold text-turf-primary">
                          {t('Verdict Band')}: {report.computed_scores?.verdict_band || 'Promising'}
                        </div>
                        <p className="text-[11px] text-turf-text-muted max-w-xs leading-relaxed">
                          {report.computed_explanation?.score_narrative || "Feasibility rating derived from 3-way fit model."}
                        </p>
                      </div>
                    </div>

                    {/* Sub-Score Bars */}
                    <div className="space-y-3 pt-2">
                      <ScoreBar label={`${t('Local Market Fit')} (45%)`} score={report.computed_scores?.market_score || 70} color="bg-turf-primary" />
                      <ScoreBar label={`${t('Entrepreneur Readiness')} (30%)`} score={report.computed_scores?.readiness_score || 65} color="bg-turf-primary" />
                      <ScoreBar label={`${t('Financial Fit')} (25%)`} score={report.computed_scores?.financial_score || 80} color="bg-turf-primary-light" />
                    </div>
                  </div>

                  <DisclaimerBanner text="Recommendations use prototype data and deterministic calculation models. Guidance does not guarantee loan approval or business success." />
                </div>

                {/* Right Card: Local Catchment Leaflet Map (Data Card) */}
                <div className="lg:col-span-5 bg-turf-surface border border-turf-border rounded-2xl p-6 space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="eyebrow !mb-0">{t('Local catchment · 10 km')}</span>
                      <span className="text-[10px] font-semibold text-turf-text-muted bg-white border border-turf-border px-2 py-0.5 rounded-lg">{t('Map view')}</span>
                    </div>
                    <h3 className="text-sm font-bold text-turf-text">
                      Market around {marketMap?.center_village?.name || 'Village'}
                    </h3>
                  </div>

                  <div className="h-64">
                    <LocationMap 
                      lat={marketMap?.center_village?.latitude || 18.6984} 
                      lng={marketMap?.center_village?.longitude || 74.1236} 
                      villageName={marketMap?.center_village?.name || "Village"} 
                      competitors={marketMap?.competitor_breakdown?.band_0_2km ? [
                        ...(marketMap.competitor_breakdown.band_0_2km || []),
                        ...(marketMap.competitor_breakdown.band_2_5km || [])
                      ] : []}
                    />
                  </div>

                  <div className="p-3.5 bg-white border border-turf-border rounded-xl text-[11px] text-turf-text flex items-center justify-between">
                    <span>Nearby villages in 10km: <strong className="stat-number">{marketMap?.catchment_stats?.catchment_village_count || 1}</strong></span>
                    <span>Total population: <strong className="stat-number">{(marketMap?.catchment_stats?.total_population || 12000).toLocaleString()}</strong></span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
