import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import TopBar from '../components/common/TopBar';
import Sidebar from '../components/common/Sidebar';
import DisclaimerBanner from '../components/common/DisclaimerBanner';
import ScoreRing from '../components/common/ScoreRing';
import { useLanguage } from '../context/LanguageContext';
import api from '../api/client';

export const ImprovementPlanPage = () => {
  const [searchParams] = useSearchParams();
  const assessmentId = searchParams.get('assessment') || 'ASM_DEFAULT';
  const { lang, t } = useLanguage();

  const [actions, setActions] = useState([]);
  const [baseReadinessScore, setBaseReadinessScore] = useState(65);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const fetchPlan = async () => {
      setLoading(true);
      try {
        const [planResp, repResp] = await Promise.all([
          api.getImprovementPlan(assessmentId, lang),
          api.getReport(assessmentId, lang).catch(() => null)
        ]);

        setActions(planResp.data);
        if (repResp?.data?.computed_scores?.readiness_score) {
          setBaseReadinessScore(repResp.data.computed_scores.readiness_score);
        }
      } catch (err) {
        console.error("Improvement plan fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (assessmentId) fetchPlan();
  }, [assessmentId, lang]);

  // Handle status change & persist back to backend
  const handleStatusChange = async (dimKey, newStatus) => {
    const actionKey = dimKey.toLowerCase().replace(/ /g, '_');
    setUpdatingId(actionKey);

    // Optimistic UI update
    setActions(prev => prev.map(act => 
      act.dimension.toLowerCase().replace(/ /g, '_') === actionKey 
        ? { ...act, current_status: newStatus } 
        : act
    ));

    try {
      await api.updateImprovementAction(assessmentId, actionKey, newStatus);
    } catch (err) {
      console.error("Failed to update action status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Calculate live potential score
  const completedPoints = actions
    .filter(a => a.current_status === 'Completed')
    .reduce((sum, a) => sum + (a.impact_points || 0), 0);

  const completedCount = actions.filter(a => a.current_status === 'Completed').length;
  const potentialScore = Math.min(100, baseReadinessScore + completedPoints);

  return (
    <div className="min-h-screen bg-white flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="Improvement Plan" />

        <main className="p-6 md:p-10 max-w-5xl mx-auto w-full space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-turf-border pb-4">
            <div>
              <span className="eyebrow">Preparation before launch</span>
              <h1 className="text-2xl font-bold text-turf-text">{t('Improvement Plan')}</h1>
              <p className="text-xs text-turf-text-muted mt-0.5">Concrete action items to strengthen your entrepreneur readiness before starting.</p>
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
            <div className="py-12 text-center text-xs text-turf-text-muted">Loading readiness action items...</div>
          ) : (
            <div className="space-y-6">
              {/* Summary Strip (Data Card Fills) */}
              <div className="bg-turf-surface border border-turf-border rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <ScoreRing score={baseReadinessScore} size={85} strokeWidth={8} label="Current" />
                  <ArrowRight className="w-5 h-5 text-turf-primary hidden sm:block" />
                  <ScoreRing score={potentialScore} size={85} strokeWidth={8} label="Potential" />
                  <div>
                    <h3 className="text-sm font-bold text-turf-text">Potential Preparedness</h3>
                    <p className="text-xs text-turf-primary font-semibold mt-0.5 stat-number">
                      +{completedPoints} points gained from completed actions
                    </p>
                  </div>
                </div>

                <div className="bg-white text-turf-primary px-4 py-2 rounded-xl text-xs font-semibold border border-turf-border shrink-0 stat-number">
                  {completedCount} of {actions.length} Actions Completed
                </div>
              </div>

              {/* Numbered Action Cards */}
              <div className="space-y-4">
                <h2 className="text-xs font-semibold text-turf-text">Recommended Action Items</h2>

                {actions.map((act, idx) => {
                  const actKey = act.dimension.toLowerCase().replace(/ /g, '_');
                  const isCompleted = act.current_status === 'Completed';
                  const isInProgress = act.current_status === 'In Progress';

                  return (
                    <div
                      key={idx}
                      className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isCompleted 
                          ? 'bg-turf-surface border-turf-border' 
                          : isInProgress 
                          ? 'bg-turf-surface/50 border-turf-border' 
                          : 'bg-white border-turf-border'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                          isCompleted ? 'bg-turf-primary text-white' : 'bg-turf-surface text-turf-text border border-turf-border'
                        }`}>
                          {idx + 1}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-turf-text">{act.title}</span>
                            <span className="text-[10px] font-semibold text-turf-primary bg-white border border-turf-border px-2 py-0.5 rounded-lg stat-number">
                              +{act.impact_points} Readiness
                            </span>
                          </div>
                          <p className="text-xs text-turf-text-muted leading-relaxed">{act.description}</p>
                          <span className="text-[10px] font-medium text-turf-text-muted block pt-1">
                            Dimension: {act.dimension}
                          </span>
                        </div>
                      </div>

                      {/* Status Dropdown */}
                      <div className="shrink-0">
                        <select
                          value={act.current_status}
                          onChange={(e) => handleStatusChange(act.dimension, e.target.value)}
                          disabled={updatingId === actKey}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold outline-none cursor-pointer border ${
                            isCompleted 
                              ? 'bg-turf-primary text-white border-turf-primary' 
                              : isInProgress 
                              ? 'bg-gray-800 text-white border-gray-800' 
                              : 'bg-white text-turf-text border-turf-border'
                          }`}
                        >
                          <option value="Not Started" className="bg-white text-turf-text">Not Started</option>
                          <option value="In Progress" className="bg-white text-turf-text">In Progress</option>
                          <option value="Completed" className="bg-white text-turf-text">Completed</option>
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>

              <DisclaimerBanner text="This reflects improved preparedness, not guaranteed business financial success. The potential score assumes every listed action is completed." />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ImprovementPlanPage;
