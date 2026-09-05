import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Printer, PlusCircle, CheckCircle2, AlertTriangle, MapPin, 
  Store, UserCheck, Wallet, ArrowRight, ShieldCheck, Download
} from 'lucide-react';
import TopBar from '../components/common/TopBar';
import Sidebar from '../components/common/Sidebar';
import ScoreRing from '../components/common/ScoreRing';
import ScoreBar from '../components/common/ScoreBar';
import LocationMap from '../components/map/LocationMap';
import DisclaimerBanner from '../components/common/DisclaimerBanner';
import { useLanguage } from '../context/LanguageContext';
import api from '../api/client';

export const FeasibilityReport = () => {
  const { id } = useParams();
  const { lang } = useLanguage();
  const [report, setReport] = useState(null);
  const [marketMap, setMarketMap] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const [repResp, mapResp] = await Promise.all([
          api.getReport(id, lang),
          api.getMarketMap(id)
        ]);
        setReport(repResp.data);
        setMarketMap(mapResp.data);
      } catch (err) {
        console.error("Report fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchReport();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar title="Feasibility Report" />
          <div className="p-12 text-center text-xs text-gray-400">Loading full feasibility report payload...</div>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar title="Feasibility Report" />
          <div className="p-12 text-center text-xs text-gray-400">Assessment report not found.</div>
        </div>
      </div>
    );
  }

  const scores = report.computed_scores || {};
  const explanation = report.computed_explanation || {};
  const swot = explanation.swot || { strengths: [], weaknesses: [], opportunities: [], threats: [] };
  const stats = report.market_stats || {};
  const village = report.village || {};

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="Feasibility Report" />

        <main className="p-6 md:p-10 max-w-6xl mx-auto w-full space-y-8 print:p-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="eyebrow !mb-0">{report.category} · FOCUSED ASSESSMENT</span>
                <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">PROTOTYPE DATA</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">{report.category} Business Feasibility Report</h1>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                <span>{village.name || 'Village'}, {village.district || 'District'}, {village.state || 'State'} · Village ID: {village.village_id}</span>
              </p>
            </div>

            <div className="flex items-center gap-2 print:hidden">
              <button
                onClick={handlePrint}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Download report</span>
              </button>
              <Link
                to="/assessment/new"
                className="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>New assessment</span>
              </Link>
            </div>
          </div>

          {/* Section 1: Score Hero */}
          <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-xs text-center space-y-6">
            <div className="max-w-md mx-auto flex flex-col items-center space-y-3">
              <ScoreRing score={scores.overall_score || 75} size={150} strokeWidth={12} label="FEASIBILITY" />
              <div className="space-y-1">
                <h2 className="text-2xl font-extrabold text-gray-900">{scores.verdict_title || 'Proceed after preparation'}</h2>
                <div className="text-xs font-bold text-primary-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 w-fit mx-auto">
                  VERDICT BAND: {scores.verdict_band || 'Promising'}
                </div>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed italic max-w-lg">
                "{explanation.score_narrative || 'Your business feasibility rating is derived from a 3-way fit analysis.'}"
              </p>
            </div>

            <DisclaimerBanner text="This feasibility score supports better business decisions before taking on debt. It does not predict or guarantee business financial outcomes." />
          </div>

          {/* Section 2: Three Sub-Score Rings */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs flex items-center gap-4">
              <ScoreRing score={scores.market_score || 70} size={85} strokeWidth={8} />
              <div>
                <span className="eyebrow !mb-0">WEIGHT 45%</span>
                <h3 className="text-sm font-bold text-gray-900">Local Market Fit</h3>
                <p className="text-[11px] text-gray-500 mt-1">10km radius demand, competitor density & roads.</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs flex items-center gap-4">
              <ScoreRing score={scores.readiness_score || 65} size={85} strokeWidth={8} />
              <div>
                <span className="eyebrow !mb-0 !text-emerald-600">WEIGHT 30%</span>
                <h3 className="text-sm font-bold text-gray-900">Entrepreneur Readiness</h3>
                <p className="text-[11px] text-gray-500 mt-1">Skills, workspace, supplier links & customers.</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs flex items-center gap-4">
              <ScoreRing score={scores.financial_score || 80} size={85} strokeWidth={8} />
              <div>
                <span className="eyebrow !mb-0 !text-amber-600">WEIGHT 25%</span>
                <h3 className="text-sm font-bold text-gray-900">Financial Fit</h3>
                <p className="text-[11px] text-gray-500 mt-1">Margin capital coverage & monthly EMI capacity.</p>
              </div>
            </div>
          </div>

          {/* Section 3: Why This Score? (Positive vs Attention Areas) */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-xs space-y-4">
            <span className="eyebrow">EXPLAINABILITY SUMMARY</span>
            <h2 className="text-xl font-bold text-gray-900">Why this score?</h2>

            <div className="grid md:grid-cols-2 gap-6 pt-2">
              {/* Positive Factors */}
              <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-3">
                <div className="flex items-center gap-2 font-bold text-xs text-emerald-900 uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Supports This Business</span>
                </div>
                <ul className="space-y-2 text-xs text-emerald-950 font-medium">
                  {scores.positive_factors?.map((fact, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Attention Areas */}
              <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3">
                <div className="flex items-center gap-2 font-bold text-xs text-amber-900 uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Needs Attention</span>
                </div>
                <ul className="space-y-2 text-xs text-amber-950 font-medium">
                  {scores.attention_areas?.map((att, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{att}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Section 4: Hyper-Local Market Picture & Map */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
              <div>
                <span className="eyebrow">10 KM CATCHMENT RADIUS</span>
                <h2 className="text-xl font-bold text-gray-900">Hyper-local market picture</h2>
              </div>
              <span className="text-xs font-bold text-primary-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 w-fit">
                Competitor Pressure: {stats.competitor_breakdown?.total_competitors <= 2 ? 'Low' : 'Moderate'}
              </span>
            </div>

            {/* Map */}
            <div className="h-72">
              <LocationMap 
                lat={village.latitude || 18.6984} 
                lng={village.longitude || 74.1236} 
                villageName={village.name || "Village"}
              />
            </div>

            {/* Stat Summary Panel */}
            <div className="grid sm:grid-cols-5 gap-3 text-center">
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
                <div className="text-[10px] font-bold text-gray-500 uppercase">Villages</div>
                <div className="text-lg font-black text-gray-900">{marketMap?.catchment_stats?.catchment_village_count || 1}</div>
              </div>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
                <div className="text-[10px] font-bold text-gray-500 uppercase">Population</div>
                <div className="text-lg font-black text-gray-900">{(marketMap?.catchment_stats?.total_population || village.population || 12000).toLocaleString()}</div>
              </div>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
                <div className="text-[10px] font-bold text-gray-500 uppercase">Households</div>
                <div className="text-lg font-black text-gray-900">{(marketMap?.catchment_stats?.total_households || village.households || 2500).toLocaleString()}</div>
              </div>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
                <div className="text-[10px] font-bold text-gray-500 uppercase">Workers</div>
                <div className="text-lg font-black text-gray-900">{(marketMap?.catchment_stats?.total_workers || 5000).toLocaleString()}</div>
              </div>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
                <div className="text-[10px] font-bold text-gray-500 uppercase">Competitors</div>
                <div className="text-lg font-black text-primary-700">{stats.competitor_breakdown?.total_competitors || 3}</div>
              </div>
            </div>

            {/* Named Competitor Cards */}
            {stats.named_competitors && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-gray-800 uppercase tracking-wider block">Nearby Competitors</span>
                <div className="grid sm:grid-cols-3 gap-3">
                  {stats.named_competitors.map((comp, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs">
                      <div className="font-bold text-gray-900">{comp.name}</div>
                      <div className="text-gray-500 text-[11px] mt-0.5">Distance: {comp.distance_km} km · {comp.subcategory}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 5: Three Stat Tiles */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-3">
              <span className="eyebrow !mb-0">MARKET DEMAND</span>
              <h3 className="text-sm font-bold text-gray-900">Demand & Supply</h3>
              <div className="space-y-1.5 text-xs text-gray-700">
                <div className="flex justify-between">
                  <span className="text-gray-500">Daily Demand:</span>
                  <span className="font-bold text-emerald-700">{stats.demand_level || 'High'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Local Supply Gap:</span>
                  <span className="font-bold text-primary-700">{stats.supply_gap_level || 'High'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Repeat Purchase:</span>
                  <span className="font-semibold">{stats.repeat_purchase_likelihood || 'High'}</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-3">
              <span className="eyebrow !mb-0">INFRASTRUCTURE</span>
              <h3 className="text-sm font-bold text-gray-900">Infrastructure Signals</h3>
              <div className="space-y-1.5 text-xs text-gray-700">
                <div className="flex justify-between">
                  <span className="text-gray-500">Road Connectivity:</span>
                  <span className="font-semibold text-gray-900">{village.amenities?.road ? 'Good' : 'Fair'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Power Access:</span>
                  <span className="font-semibold text-gray-900">{stats.infrastructure_signals?.power || '18h/day'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Bank Branch:</span>
                  <span className="font-semibold text-gray-900">{village.amenities?.bank ? 'Available' : 'Nearby'}</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-3">
              <span className="eyebrow !mb-0">DATA EVIDENCE</span>
              <h3 className="text-sm font-bold text-gray-900">Evidence Confidence</h3>
              <div className="text-2xl font-black text-primary-700">{stats.evidence_confidence || 88}/100</div>
              <div className="flex flex-wrap gap-1">
                {stats.sources?.map((s, i) => (
                  <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium">{s}</span>
                ))}
              </div>
              <p className="text-[10px] text-gray-400 leading-tight">Confidence reflects dataset coverage—not business success probability.</p>
            </div>
          </div>

          {/* Section 6: SWOT Analysis (4-Quadrant Grid) */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-xs space-y-4">
            <span className="eyebrow">STRATEGIC ANALYSIS</span>
            <h2 className="text-xl font-bold text-gray-900">SWOT Analysis</h2>

            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              {/* Strengths */}
              <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                <div className="font-bold text-xs text-emerald-900 uppercase tracking-wider">Strengths</div>
                <ul className="space-y-1.5 text-xs text-emerald-950">
                  {swot.strengths?.map((s, i) => <li key={i}>• {s}</li>)}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                <div className="font-bold text-xs text-amber-900 uppercase tracking-wider">Weaknesses</div>
                <ul className="space-y-1.5 text-xs text-amber-950">
                  {swot.weaknesses?.map((w, i) => <li key={i}>• {w}</li>)}
                </ul>
              </div>

              {/* Opportunities */}
              <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2">
                <div className="font-bold text-xs text-blue-900 uppercase tracking-wider">Opportunities</div>
                <ul className="space-y-1.5 text-xs text-blue-950">
                  {swot.opportunities?.map((o, i) => <li key={i}>• {o}</li>)}
                </ul>
              </div>

              {/* Threats */}
              <div className="p-5 rounded-2xl bg-red-50/70 border border-red-200 space-y-2">
                <div className="font-bold text-xs text-red-900 uppercase tracking-wider">Threats</div>
                <ul className="space-y-1.5 text-xs text-red-950">
                  {swot.threats?.map((t, i) => <li key={i}>• {t}</li>)}
                </ul>
              </div>
            </div>
          </div>

          {/* Section 7: Entrepreneur Readiness Breakdown */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
            <div className="space-y-1">
              <span className="eyebrow">6 DIMENSIONS</span>
              <h2 className="text-xl font-bold text-gray-900">Entrepreneur Readiness Breakdown</h2>
              <p className="text-xs text-emerald-700 font-medium">Education is intentionally not scored or used to reduce readiness.</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <ScoreBar label="Domain Experience" score={70} color="bg-emerald-600" />
              <ScoreBar label="Technical Skill" score={85} color="bg-emerald-600" />
              <ScoreBar label="Workspace & Resources" score={60} color="bg-amber-500" />
              <ScoreBar label="Supplier Linkages" score={50} color="bg-amber-500" />
              <ScoreBar label="Customer Commitments" score={90} color="bg-emerald-600" />
              <ScoreBar label="Financial Preparedness" score={65} color="bg-emerald-600" />
            </div>
          </div>

          {/* Section 8: Footer Navigation Cards Hub */}
          <div className="grid md:grid-cols-4 gap-4 print:hidden">
            <Link
              to={`/improvement-plan?assessment=${id}`}
              className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-primary-600 transition-all shadow-xs space-y-2 group"
            >
              <div className="font-bold text-xs text-gray-900 group-hover:text-primary-600">Improvement Plan →</div>
              <p className="text-[11px] text-gray-500">Action items to raise your readiness score.</p>
            </Link>

            <Link
              to={`/alternatives?assessment=${id}`}
              className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-primary-600 transition-all shadow-xs space-y-2 group"
            >
              <div className="font-bold text-xs text-gray-900 group-hover:text-primary-600">Business Alternatives →</div>
              <p className="text-[11px] text-gray-500">Ranked 5 category comparisons for your village.</p>
            </Link>

            <Link
              to={`/financial-plan?assessment=${id}`}
              className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-primary-600 transition-all shadow-xs space-y-2 group"
            >
              <div className="font-bold text-xs text-gray-900 group-hover:text-primary-600">Financial Plan →</div>
              <p className="text-[11px] text-gray-500">Scheme details, EMI calculation & 90-day plan.</p>
            </Link>

            <Link
              to={`/legal-advice?assessment=${id}`}
              className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-primary-600 transition-all shadow-xs space-y-2 group"
            >
              <div className="font-bold text-xs text-gray-900 group-hover:text-primary-600">Legal Advice →</div>
              <p className="text-[11px] text-gray-500">Nearest legal offices & document checklist.</p>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FeasibilityReport;
