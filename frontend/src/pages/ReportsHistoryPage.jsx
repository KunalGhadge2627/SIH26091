import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, PlusCircle, Eye, Download, Layers } from 'lucide-react';
import TopBar from '../components/common/TopBar';
import Sidebar from '../components/common/Sidebar';
import CompareModal from '../components/modals/CompareModal';
import { useLanguage } from '../context/LanguageContext';
import api from '../api/client';

export const ReportsHistoryPage = () => {
  const { t } = useLanguage();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Compare modal state
  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const resp = await api.listAssessments();
        setAssessments(resp.data);
      } catch (err) {
        console.error("Reports history fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const toggleSelectForCompare = (asm) => {
    if (selectedForCompare.find(a => a.id === asm.id)) {
      setSelectedForCompare(prev => prev.filter(a => a.id !== asm.id));
    } else {
      if (selectedForCompare.length >= 2) {
        setSelectedForCompare([selectedForCompare[1], asm]);
      } else {
        setSelectedForCompare(prev => [...prev, asm]);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="Reports History" />

        <main className="p-6 md:p-10 max-w-6xl mx-auto w-full space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-turf-border pb-4">
            <div>
              <span className="eyebrow">{t('Assessment history')}</span>
              <h1 className="text-2xl font-bold text-turf-text">{t('Reports')}</h1>
              <p className="text-xs text-turf-text-muted mt-0.5">All your saved and completed business feasibility assessments.</p>
            </div>

            <div className="flex items-center gap-3">
              {selectedForCompare.length === 2 && (
                <button
                  onClick={() => setShowCompareModal(true)}
                  className="px-4 py-2.5 bg-turf-primary hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <Layers className="w-4 h-4" />
                  <span>Compare selected (2)</span>
                </button>
              )}

              <Link
                to="/assessment/new"
                className="px-4 py-2.5 bg-turf-primary hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                <span>New assessment</span>
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-turf-text-muted">Loading assessment history...</div>
          ) : assessments.length === 0 ? (
            <div className="bg-white border border-turf-border rounded-2xl p-12 text-center space-y-4 max-w-md mx-auto my-8">
              <FileText className="w-12 h-12 text-turf-text-muted mx-auto" />
              <h3 className="text-base font-bold text-turf-text">No reports generated yet</h3>
              <p className="text-xs text-turf-text-muted">Run a feasibility assessment to save and compare reports.</p>
              <Link to="/assessment/new" className="inline-block px-5 py-2.5 bg-turf-primary text-white font-semibold text-xs rounded-xl hover:bg-emerald-700 transition-colors">
                Start Assessment
              </Link>
            </div>
          ) : (
            <div className="bg-white border border-turf-border rounded-2xl overflow-hidden">
              <div className="p-4 bg-turf-surface border-b border-turf-border text-xs text-turf-text-muted flex items-center justify-between">
                <span>Select any 2 assessments to compare side-by-side.</span>
                <span className="font-semibold text-turf-primary stat-number">{assessments.length} Total Assessments</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-turf-surface text-turf-text-muted font-semibold border-b border-turf-border text-xs">
                    <tr>
                      <th className="p-4">Select</th>
                      <th className="p-4">Business category</th>
                      <th className="p-4">Village ID</th>
                      <th className="p-4">Feasibility score</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Date</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-turf-border text-turf-text">
                    {assessments.map((asm) => {
                      const isSelected = !!selectedForCompare.find(a => a.id === asm.id);
                      const isComplete = asm.status === 'complete';
                      return (
                        <tr key={asm.id} className="hover:bg-turf-surface/50 transition-colors">
                          <td className="p-4">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectForCompare(asm)}
                              className="rounded border-turf-border text-turf-primary focus:ring-turf-primary"
                            />
                          </td>
                          <td className="p-4 font-bold text-turf-text">{asm.category}</td>
                          <td className="p-4 font-mono text-turf-text-muted">{asm.village_id}</td>
                          <td className="p-4">
                            {isComplete && asm.computed_scores ? (
                              <span className="stat-number text-turf-primary text-sm">
                                {asm.computed_scores.overall_score}/100
                              </span>
                            ) : (
                              <span className="text-turf-text-muted font-mono">Draft</span>
                            )}
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border border-turf-border ${
                              isComplete ? 'bg-white text-turf-primary' : 'bg-turf-surface text-turf-text-muted'
                            }`}>
                              {asm.status}
                            </span>
                          </td>
                          <td className="p-4 text-turf-text-muted">{asm.created_at?.slice(0, 10)}</td>
                          <td className="p-4 text-right space-x-2">
                            <Link
                              to={`/assessments/${asm.id}/report`}
                              className="p-1.5 rounded-lg text-turf-text-muted hover:text-turf-primary hover:bg-turf-surface inline-block"
                              title="View Report"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => window.print()}
                              className="p-1.5 rounded-lg text-turf-text-muted hover:text-turf-text hover:bg-turf-surface inline-block"
                              title="Download Report"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Compare Modal */}
      {showCompareModal && selectedForCompare.length === 2 && (
        <CompareModal
          asm1={selectedForCompare[0]}
          asm2={selectedForCompare[1]}
          onClose={() => setShowCompareModal(false)}
        />
      )}
    </div>
  );
};

export default ReportsHistoryPage;
