import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import TopBar from '../components/common/TopBar';
import Sidebar from '../components/common/Sidebar';
import DisclaimerBanner from '../components/common/DisclaimerBanner';
import BusinessDetailModal from '../components/modals/BusinessDetailModal';
import { useLanguage } from '../context/LanguageContext';
import api from '../api/client';
import { getCachedRequest, readCachedData } from '../api/requestCache';

export const BusinessAlternativesPage = () => {
  const [searchParams] = useSearchParams();
  const assessmentId = searchParams.get('assessment') || 'ASM_DEFAULT';
<<<<<<< HEAD
  const { lang, t } = useLanguage();
=======
  const { lang, translate: t } = useLanguage();
>>>>>>> development

  const cacheKey = `alternatives:${assessmentId}`;
  const languageCacheKey = `${cacheKey}:${lang}`;
  const [alternatives, setAlternatives] = useState(() => readCachedData(cacheKey) || []);
  const [selectedCategoryModal, setSelectedCategoryModal] = useState(null);
  const [loading, setLoading] = useState(() => !readCachedData(cacheKey));

  useEffect(() => {
    const fetchAlternatives = async () => {
      if (!readCachedData(cacheKey)) setLoading(true);
      try {
        const alternativesData = await getCachedRequest(languageCacheKey, async () => {
          const resp = await api.getAlternatives(assessmentId, lang);
          return resp.data;
        });
        setAlternatives(alternativesData);
      } catch (err) {
        console.error("Alternatives fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (assessmentId) fetchAlternatives();
  }, [assessmentId, lang]);

  return (
    <div className="min-h-screen bg-white flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="Business Alternatives" />

        <main className="p-6 md:p-10 max-w-5xl mx-auto w-full space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-turf-border pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
<<<<<<< HEAD
                <span className="eyebrow !mb-0">Business ↔ Person ↔ Location</span>
                <span className="text-[10px] font-semibold text-turf-text-muted bg-turf-surface border border-turf-border px-2 py-0.5 rounded-lg">Demo estimates</span>
              </div>
              <h1 className="text-2xl font-bold text-turf-text">{t('Business Alternatives')}</h1>
              <p className="text-xs text-turf-text-muted mt-0.5">Ranked comparison of 5 business categories for your village location and capital.</p>
=======
                <span className="eyebrow !mb-0">{t('BUSINESS ↔ PERSON ↔ LOCATION')}</span>
                <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{t('DEMO ESTIMATES')}</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{t('Business Alternatives')}</h1>
              <p className="text-xs text-gray-500 mt-0.5">{t('Ranked comparison of 5 business categories for your village location and capital.')}</p>
>>>>>>> development
            </div>
            <Link
              to={`/assessments/${assessmentId}/report`}
              className="text-xs font-semibold text-turf-primary hover:underline flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('Back to results')}</span>
            </Link>
          </div>

          {loading ? (
<<<<<<< HEAD
            <div className="py-12 text-center text-xs text-turf-text-muted">Evaluating 5 business alternatives...</div>
=======
            <div className="py-12 text-center text-xs text-gray-400">{t('Evaluating 5 business alternatives...')}</div>
>>>>>>> development
          ) : (
            <div className="space-y-6">
              {/* Ranked #1..#5 Cards */}
              <div className="space-y-4">
                {alternatives.map((alt, idx) => {
                  const isBestFit = idx === 0;
                  return (
                    <div
                      key={alt.category}
                      className={`p-6 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                        isBestFit 
                          ? 'bg-turf-surface border-turf-border' 
                          : 'bg-white border-turf-border'
                      }`}
                    >
                      <div className="space-y-3 max-w-xl">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                            isBestFit ? 'bg-turf-primary text-white' : 'bg-white border border-turf-border text-turf-text'
                          }`}>
                            #{idx + 1}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
<<<<<<< HEAD
                              <h3 className="text-base font-bold text-turf-text">{alt.display_name}</h3>
                              {isBestFit && (
                                <span className="text-[10px] font-semibold text-white bg-turf-primary px-2 py-0.5 rounded-lg">
                                  Best fit
                                </span>
                              )}
                              <span className="text-[10px] font-semibold text-turf-primary bg-white border border-turf-border px-2 py-0.5 rounded-lg">
                                {alt.status_label}
=======
                              <h3 className="text-base font-bold text-gray-900">{t(alt.display_name)}</h3>
                              {isBestFit && (
                                <span className="text-[10px] font-extrabold text-white bg-primary-600 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                  {t('BEST FIT')}
                                </span>
                              )}
                              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                                {t(alt.status_label)}
>>>>>>> development
                              </span>
                            </div>
                          </div>
                        </div>

<<<<<<< HEAD
                        <p className="text-xs text-turf-text-muted leading-relaxed italic">
                          "{alt.explanation_blurb}"
=======
                        <p className="text-xs text-gray-600 leading-relaxed italic">
                          "{t(alt.explanation_blurb)}"
>>>>>>> development
                        </p>

                        {/* 3-Part Sub-Scores */}
                        <div className="grid grid-cols-3 gap-3 text-[11px] pt-1">
<<<<<<< HEAD
                          <div className="bg-white border border-turf-border rounded-xl p-2 text-center">
                            <span className="text-turf-text-muted block text-[9px] font-medium">Market Fit</span>
                            <span className="stat-number text-turf-text">{alt.market_fit_score}/100</span>
                          </div>
                          <div className="bg-white border border-turf-border rounded-xl p-2 text-center">
                            <span className="text-turf-text-muted block text-[9px] font-medium">Capital Fit</span>
                            <span className="stat-number text-turf-text">{alt.capital_fit_score}/100</span>
                          </div>
                          <div className="bg-white border border-turf-border rounded-xl p-2 text-center">
                            <span className="text-turf-text-muted block text-[9px] font-medium">Resource Fit</span>
                            <span className="stat-number text-turf-text">{alt.resource_fit_score}/100</span>
=======
                          <div className="bg-white/80 border border-gray-100 rounded-xl p-2 text-center">
                            <span className="text-gray-500 block text-[9px] uppercase font-bold">{t('Market Fit')}</span>
                            <span className="font-bold text-gray-900">{alt.market_fit_score}/100</span>
                          </div>
                          <div className="bg-white/80 border border-gray-100 rounded-xl p-2 text-center">
                            <span className="text-gray-500 block text-[9px] uppercase font-bold">{t('Capital Fit')}</span>
                            <span className="font-bold text-gray-900">{alt.capital_fit_score}/100</span>
                          </div>
                          <div className="bg-white/80 border border-gray-100 rounded-xl p-2 text-center">
                            <span className="text-gray-500 block text-[9px] uppercase font-bold">{t('Resource Fit')}</span>
                            <span className="font-bold text-gray-900">{alt.resource_fit_score}/100</span>
>>>>>>> development
                          </div>
                        </div>
                      </div>

                      {/* Right Overall Score & CTA */}
                      <div className="flex md:flex-col items-center justify-between md:justify-center gap-4 shrink-0 border-t md:border-t-0 md:border-l border-turf-border pt-4 md:pt-0 md:pl-6">
                        <div className="text-center">
<<<<<<< HEAD
                          <div className="text-3xl stat-number text-turf-primary">{alt.alternative_score}</div>
                          <div className="text-[9px] font-medium text-turf-text-muted">Fit score</div>
=======
                          <div className="text-3xl font-black text-primary-700">{alt.alternative_score}</div>
                          <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{t('FIT SCORE')}</div>
>>>>>>> development
                        </div>

                        <button
                          onClick={() => setSelectedCategoryModal(alt.category)}
                          className="px-4 py-2 bg-white hover:bg-turf-surface text-turf-primary font-semibold text-xs rounded-xl border border-turf-border transition-colors"
                        >
                          {t('Explore This Business')} →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <DisclaimerBanner text="Alternative scores are prototype comparisons for decision support. They do not guarantee business performance." />
            </div>
          )}
        </main>
      </div>

      {/* Business Model Detail Modal */}
      {selectedCategoryModal && (
        <BusinessDetailModal 
          category={selectedCategoryModal} 
          onClose={() => setSelectedCategoryModal(null)} 
        />
      )}
    </div>
  );
};

export default BusinessAlternativesPage;
