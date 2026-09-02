import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, FileText } from 'lucide-react';
import TopBar from '../components/common/TopBar';
import Sidebar from '../components/common/Sidebar';
import DisclaimerBanner from '../components/common/DisclaimerBanner';
import api from '../api/client';

export const ReportPlaceholder = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);

  useEffect(() => {
    if (id && id !== 'ASM_DEFAULT') {
      api.getReport(id).then(res => setReport(res.data)).catch(err => console.error(err));
    }
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="Feasibility Report" />
        <main className="p-6 md:p-10 max-w-4xl mx-auto w-full space-y-6">
          <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <span className="eyebrow">ASSESSMENT COMPLETED</span>
                <h1 className="text-2xl font-bold text-gray-900">Feasibility Report Overview</h1>
                <p className="text-xs text-gray-500 font-mono mt-0.5">Assessment ID: {id}</p>
              </div>
            </div>

            <DisclaimerBanner text="This report payload was calculated by Phase 1 & 2 deterministic engines and LLM explainer services. Detailed visual report dashboards, radar charts, and interactive tabs will be rendered in Phase 4." />

            {report && report.computed_scores && (
              <div className="grid sm:grid-cols-3 gap-4 border-t border-b border-gray-100 py-6">
                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100">
                  <div className="text-xs font-semibold text-blue-900">Market Score</div>
                  <div className="text-2xl font-black text-primary-700">{report.computed_scores.market_score}/100</div>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                  <div className="text-xs font-semibold text-emerald-900">Readiness Score</div>
                  <div className="text-2xl font-black text-emerald-700">{report.computed_scores.readiness_score}/100</div>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100">
                  <div className="text-xs font-semibold text-amber-900">Financial Score</div>
                  <div className="text-2xl font-black text-amber-700">{report.computed_scores.financial_score}/100</div>
                </div>
              </div>
            )}

            <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-gray-600 space-y-2">
              <div className="font-bold text-gray-900">Phase 4 Dashboard & Report Pages</div>
              <p>The full interactive report dashboard, 10km Leaflet competitor map, 90-day improvement plan, legal office directory, and business alternatives breakdown will be fully wired in Phase 4.</p>
            </div>

            <div className="flex gap-3 pt-2">
              <Link to="/assessment/new" className="px-5 py-2.5 bg-primary-600 text-white font-bold text-xs rounded-xl hover:bg-primary-700">
                New Assessment
              </Link>
              <Link to="/" className="px-5 py-2.5 bg-gray-100 text-gray-700 font-semibold text-xs rounded-xl hover:bg-gray-200">
                Home
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReportPlaceholder;
