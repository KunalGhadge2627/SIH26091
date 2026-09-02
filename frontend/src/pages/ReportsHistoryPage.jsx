import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, PlusCircle, ArrowRight, Eye, Download, Layers, CheckCircle2 } from 'lucide-react';
import TopBar from '../components/common/TopBar';
import Sidebar from '../components/common/Sidebar';
import CompareModal from '../components/modals/CompareModal';
import api from '../api/client';

export const ReportsHistoryPage = () => {
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
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="Reports History" />

        <main className="p-6 md:p-10 max-w-6xl mx-auto w-full space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
            <div>
              <span className="eyebrow">ASSESSMENT HISTORY</span>
              <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
              <p className="text-xs text-gray-500 mt-0.5">All your saved and completed business feasibility assessments.</p>
            </div>

            <div className="flex items-center gap-3">
              {selectedForCompare.length === 2 && (
                <button
                  onClick={() => setShowCompareModal(true)}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <Layers className="w-4 h-4" />
                  <span>Compare Selected (2)</span>
                </button>
              )}

              <Link
                to="/assessment/new"
                className="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>New assessment</span>
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-gray-400">Loading assessment history...</div>
          ) : assessments.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center space-y-4 max-w-md mx-auto my-8">
              <FileText className="w-12 h-12 text-gray-300 mx-auto" />
              <h3 className="text-base font-bold text-gray-900">No reports generated yet</h3>
              <p className="text-xs text-gray-500">Run a feasibility assessment to save and compare reports.</p>
              <Link to="/assessment/new" className="inline-block px-5 py-2.5 bg-primary-600 text-white font-bold text-xs rounded-xl">
                Start Assessment
              </Link>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-xs">
              <div className="p-4 bg-gray-50/50 border-b border-gray-100 text-xs text-gray-500 flex items-center justify-between">
                <span>Select any 2 assessments to compare side-by-side.</span>
                <span className="font-semibold text-primary-700">{assessments.length} Total Assessments</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold border-b border-gray-100 text-[10px]">
                    <tr>
                      <th className="p-4">Select</th>
                      <th className="p-4">Business Category</th>
                      <th className="p-4">Village ID</th>
                      <th className="p-4">Feasibility Score</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Date</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {assessments.map((asm) => {
                      const isSelected = !!selectedForCompare.find(a => a.id === asm.id);
                      const isComplete = asm.status === 'complete';
                      return (
                        <tr key={asm.id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="p-4">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectForCompare(asm)}
                              className="rounded text-primary-600 focus:ring-primary-500"
                            />
                          </td>
                          <td className="p-4 font-bold text-gray-900">{asm.category}</td>
                          <td className="p-4 font-mono text-gray-500">{asm.village_id}</td>
                          <td className="p-4">
                            {isComplete && asm.computed_scores ? (
                              <span className="font-extrabold text-primary-700 text-sm">
                                {asm.computed_scores.overall_score}/100
                              </span>
                            ) : (
                              <span className="text-gray-400 font-mono">Draft</span>
                            )}
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              isComplete ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {asm.status?.toUpperCase()}
                            </span>
                          </td>
                          <td className="p-4 text-gray-500">{asm.created_at?.slice(0, 10)}</td>
                          <td className="p-4 text-right space-x-2">
                            <Link
                              to={`/assessments/${asm.id}/report`}
                              className="p-1.5 rounded-lg text-gray-500 hover:text-primary-600 hover:bg-blue-50 inline-block"
                              title="View Report"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => window.print()}
                              className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 inline-block"
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
