import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Layers, ArrowLeft, ArrowRight, Award, CheckCircle2, Info } from 'lucide-react';
import TopBar from '../components/common/TopBar';
import Sidebar from '../components/common/Sidebar';
import DisclaimerBanner from '../components/common/DisclaimerBanner';
import BusinessDetailModal from '../components/modals/BusinessDetailModal';
import { useLanguage } from '../context/LanguageContext';
import api from '../api/client';

export const BusinessAlternativesPage = () => {
  const [searchParams] = useSearchParams();
  const assessmentId = searchParams.get('assessment') || 'ASM_DEFAULT';
  const { lang } = useLanguage();

  const [alternatives, setAlternatives] = useState([]);
  const [selectedCategoryModal, setSelectedCategoryModal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlternatives = async () => {
      setLoading(true);
      try {
        const resp = await api.getAlternatives(assessmentId, lang);
        setAlternatives(resp.data);
      } catch (err) {
        console.error("Alternatives fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (assessmentId) fetchAlternatives();
  }, [assessmentId, lang]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="Business Alternatives" />

        <main className="p-6 md:p-10 max-w-5xl mx-auto w-full space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="eyebrow !mb-0">BUSINESS ↔ PERSON ↔ LOCATION</span>
                <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">DEMO ESTIMATES</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Business Alternatives</h1>
              <p className="text-xs text-gray-500 mt-0.5">Ranked comparison of 5 business categories for your village location and capital.</p>
            </div>
            <Link
              to={`/assessments/${assessmentId}/report`}
              className="text-xs font-bold text-primary-600 hover:underline flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to results</span>
            </Link>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-gray-400">Evaluating 5 business alternatives...</div>
          ) : (
            <div className="space-y-6">
              {/* Ranked #1..#5 Cards */}
              <div className="space-y-4">
                {alternatives.map((alt, idx) => {
                  const isBestFit = idx === 0;
                  return (
                    <div
                      key={alt.category}
                      className={`p-6 rounded-3xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs ${
                        isBestFit 
                          ? 'bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border-primary-300 ring-2 ring-blue-100' 
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="space-y-3 max-w-xl">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${
                            isBestFit ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700'
                          }`}>
                            #{idx + 1}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-base font-bold text-gray-900">{alt.display_name}</h3>
                              {isBestFit && (
                                <span className="text-[10px] font-extrabold text-white bg-primary-600 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                  BEST FIT
                                </span>
                              )}
                              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                                {alt.status_label}
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="text-xs text-gray-600 leading-relaxed italic">
                          "{alt.explanation_blurb}"
                        </p>

                        {/* 3-Part Sub-Scores */}
                        <div className="grid grid-cols-3 gap-3 text-[11px] pt-1">
                          <div className="bg-white/80 border border-gray-100 rounded-xl p-2 text-center">
                            <span className="text-gray-500 block text-[9px] uppercase font-bold">Market Fit</span>
                            <span className="font-bold text-gray-900">{alt.market_fit_score}/100</span>
                          </div>
                          <div className="bg-white/80 border border-gray-100 rounded-xl p-2 text-center">
                            <span className="text-gray-500 block text-[9px] uppercase font-bold">Capital Fit</span>
                            <span className="font-bold text-gray-900">{alt.capital_fit_score}/100</span>
                          </div>
                          <div className="bg-white/80 border border-gray-100 rounded-xl p-2 text-center">
                            <span className="text-gray-500 block text-[9px] uppercase font-bold">Resource Fit</span>
                            <span className="font-bold text-gray-900">{alt.resource_fit_score}/100</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Overall Score & CTA */}
                      <div className="flex md:flex-col items-center justify-between md:justify-center gap-4 shrink-0 border-t md:border-t-0 md:border-l border-gray-200 pt-4 md:pt-0 md:pl-6">
                        <div className="text-center">
                          <div className="text-3xl font-black text-primary-700">{alt.alternative_score}</div>
                          <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">FIT SCORE</div>
                        </div>

                        <button
                          onClick={() => setSelectedCategoryModal(alt.category)}
                          className="px-4 py-2 bg-white hover:bg-gray-50 text-primary-600 font-bold text-xs rounded-xl border border-primary-200 transition-colors shadow-xs"
                        >
                          Explore This Business →
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
