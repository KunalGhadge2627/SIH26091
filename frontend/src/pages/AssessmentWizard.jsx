import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, ArrowRight, Clock, ShieldCheck, 
  Store, Check, Save, Sparkles, MapPin
} from 'lucide-react';
import TopBar from '../components/common/TopBar';
import Sidebar from '../components/common/Sidebar';
import DisclaimerBanner from '../components/common/DisclaimerBanner';
import LocationMap from '../components/map/LocationMap';
import api from '../api/client';

export const AssessmentWizard = () => {
  const navigate = useNavigate();

  // Assessment & Wizard State
  const [assessmentId, setAssessmentId] = useState(null);
  const [currentStep, setCurrentStep] = useState(0); // 0 = Intro, 1..5 = Steps, 6 = Processing
  const [saving, setSaving] = useState(false);
  const [savedIndicator, setSavedIndicator] = useState(false);

  // Step 1 State (Profile & Resources)
  const [profile, setProfile] = useState({
    age_group: '25-34',
    education: 'Secondary',
    occupation: 'Self-employed',
    business_experience: '0-2 years',
    resources: ['Electricity', 'Storage'],
    time_commitment: 'Full-time',
    has_existing_loan: false,
    existing_emi: 0.0,
    emergency_reserve: '1-3 months'
  });

  // Step 2 State (Business & Location)
  const [businessModels, setBusinessModels] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Dairy');
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [villages, setVillages] = useState([]);
  const [selectedState, setSelectedState] = useState('Maharashtra');
  const [selectedDistrict, setSelectedDistrict] = useState('Pune');
  const [selectedBlock, setSelectedBlock] = useState('Shirur');
  const [selectedVillageId, setSelectedVillageId] = useState('VIL_270001');
  const [selectedVillageObj, setSelectedVillageObj] = useState({
    name: 'Shikrapur', latitude: 18.6984, longitude: 74.1236
  });

  // Step 3 State (Category-Specific Readiness)
  const [readinessAnswers, setReadinessAnswers] = useState({
    experience_years: 1.0,
    has_relevant_skill: true,
    has_workspace: true,
    has_supplier_contacts: false,
    has_committed_customers: true,
    emergency_savings: 15000.0,
    category_specific_answers: {
      q1: 'Yes', q2: '3', q3: 'Yes', q4: 'Yes', q5: 'No', q6: 'Yes', q7: '5'
    }
  });

  // Step 4 State (Finance)
  const [finance, setFinance] = useState({
    project_cost: 350000.0,
    available_margin: 50000.0,
    scale: 'Micro',
    household_expenses: 12000.0,
    working_capital: 20000.0,
    understands_emi: 'Yes',
    understands_risk: 'Yes'
  });

  // Processing Animation State
  const [processingStage, setProcessingStage] = useState(0);

  const categoryIcons = {
    Dairy: "🐄",
    Poultry: "🐔",
    Tailoring: "🧵",
    "Flour Mill": "🌾",
    "Two-Wheeler Repair": "🔧"
  };

  // Load initial data
  useEffect(() => {
    const initData = async () => {
      try {
        const modelsResp = await api.getBusinessModels();
        setBusinessModels(modelsResp.data);

        const statesResp = await api.getStates();
        setStates(statesResp.data);
      } catch (err) {
        console.error("Failed to load wizard setup data:", err);
      }
    };
    initData();
  }, []);

  // Cascading location loads
  useEffect(() => {
    if (selectedState) {
      api.getDistricts(selectedState).then(res => {
        setDistricts(res.data);
        if (res.data.length > 0) setSelectedDistrict(res.data[0]);
      }).catch(console.error);
    }
  }, [selectedState]);

  useEffect(() => {
    if (selectedState && selectedDistrict) {
      api.getBlocks(selectedState, selectedDistrict).then(res => {
        setBlocks(res.data);
        if (res.data.length > 0) setSelectedBlock(res.data[0]);
      }).catch(console.error);
    }
  }, [selectedState, selectedDistrict]);

  useEffect(() => {
    if (selectedState && selectedDistrict && selectedBlock) {
      api.getVillages(selectedState, selectedDistrict, selectedBlock).then(res => {
        setVillages(res.data);
        if (res.data.length > 0) {
          setSelectedVillageId(res.data[0].village_id);
          setSelectedVillageObj(res.data[0]);
        }
      }).catch(console.error);
    }
  }, [selectedState, selectedDistrict, selectedBlock]);

  useEffect(() => {
    const found = villages.find(v => v.village_id === selectedVillageId);
    if (found) setSelectedVillageObj(found);
  }, [selectedVillageId, villages]);

  // Autosave handler
  const triggerAutosave = async (nextStep) => {
    setSaving(true);
    try {
      if (!assessmentId) {
        // Create initial draft
        const createResp = await api.createAssessment({
          category: selectedCategory,
          village_id: selectedVillageId,
          project_cost: finance.project_cost
        });
        setAssessmentId(createResp.data.id);

        // Update step 1 profile & resources
        await api.saveAssessmentStep(createResp.data.id, 1, {
          profile: profile,
          resources: profile.resources
        });
      } else {
        // Save relevant step data
        let payload = {};
        if (currentStep === 1) payload = { profile: profile, resources: profile.resources };
        else if (currentStep === 2) payload = { category: selectedCategory, village_id: selectedVillageId };
        else if (currentStep === 3) payload = { readiness_answers: readinessAnswers };
        else if (currentStep === 4) payload = { finance_inputs: finance, project_cost: finance.project_cost };

        await api.saveAssessmentStep(assessmentId, currentStep, payload);
      }

      setSavedIndicator(true);
      setTimeout(() => setSavedIndicator(false), 2000);
      setCurrentStep(nextStep);
    } catch (err) {
      console.error("Autosave step error:", err);
      // Fallback transition if offline
      setCurrentStep(nextStep);
    } finally {
      setSaving(false);
    }
  };

  // Run full feasibility analysis
  const handleRunAnalysis = async () => {
    setCurrentStep(6);
    let stage = 0;
    const interval = setInterval(() => {
      stage += 1;
      setProcessingStage(stage);
      if (stage >= 7) {
        clearInterval(interval);
        setTimeout(async () => {
          try {
            if (assessmentId) {
              await api.runAssessmentAnalysis(assessmentId);
              navigate(`/assessments/${assessmentId}/report`);
            } else {
              // Create and run inline
              const createResp = await api.createAssessment({
                category: selectedCategory,
                village_id: selectedVillageId,
                project_cost: finance.project_cost
              });
              await api.runAssessmentAnalysis(createResp.data.id);
              navigate(`/assessments/${createResp.data.id}/report`);
            }
          } catch (err) {
            console.error("Analysis engine error:", err);
            // Navigate fallback demo
            navigate('/dashboard');
          }
        }, 800);
      }
    }, 600);
  };

  // Render readiness questions per category
  const renderReadinessQuestions = () => {
    const qMap = {
      Dairy: [
        "Do you currently own cattle?",
        "How many cattle can you start with?",
        "Do you have a reliable fodder source?",
        "Is adequate water available year-round?",
        "Do you have access to refrigeration?",
        "Is there a milk collection centre nearby?",
        "How many reliable buyers have you identified?"
      ],
      Poultry: [
        "Do you have prior poultry-rearing experience?",
        "How many birds can you start with?",
        "Do you have reliable feed supply access?",
        "Do you have access to veterinary support?",
        "Do you have a secure, ventilated shed/enclosure?",
        "Is there a nearby market or trader for sale?",
        "How many reliable buyers/traders have you identified?"
      ],
      Tailoring: [
        "Do you have tailoring/stitching skill or training?",
        "Do you own a sewing machine?",
        "Do you have a dedicated workspace?",
        "Do you have prior paid stitching orders/experience?",
        "Do you have a reliable fabric/material supplier?",
        "Is there demand for alteration/custom stitching nearby?",
        "How many regular customers have you identified?"
      ],
      "Flour Mill": [
        "Do you have prior milling experience?",
        "Do you have access to a suitable workspace/shed?",
        "Is reliable electricity available?",
        "Do you have funds/access for milling machinery?",
        "Is there sufficient local grain-growing activity nearby?",
        "Do you have transport access for grain/flour?",
        "How many households have you confirmed as regular customers?"
      ],
      "Two-Wheeler Repair": [
        "Do you have mechanical/repair training or experience?",
        "Do you own basic repair tools?",
        "Do you have a workshop or roadside space secured?",
        "Do you have a reliable spare-parts supplier?",
        "Is there significant two-wheeler traffic/ownership in the area?",
        "Do you have experience with common repair jobs?",
        "How many regular customers have you identified?"
      ]
    };

    const questions = qMap[selectedCategory] || qMap.Dairy;

    return (
      <div className="space-y-3">
        {questions.map((qText, qIdx) => {
          const key = `q${qIdx + 1}`;
          const isNumeric = qIdx === 1 || qIdx === 6;
          const currentVal = readinessAnswers.category_specific_answers[key] || (isNumeric ? "3" : "Yes");

          return (
            <div key={key} className="p-4 rounded-2xl bg-turf-surface border border-turf-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs font-medium text-turf-text">
                <strong className="text-turf-primary mr-2">{qIdx + 1}.</strong>
                {qText}
              </span>

              {isNumeric ? (
                <input
                  type="number"
                  value={currentVal}
                  onChange={(e) => setReadinessAnswers({
                    ...readinessAnswers,
                    category_specific_answers: { ...readinessAnswers.category_specific_answers, [key]: e.target.value }
                  })}
                  className="w-24 px-3 py-1.5 rounded-xl border border-turf-border text-xs bg-white focus:outline-none focus:border-turf-primary stat-number"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setReadinessAnswers({
                      ...readinessAnswers,
                      category_specific_answers: { ...readinessAnswers.category_specific_answers, [key]: 'Yes' }
                    })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      currentVal === 'Yes' ? 'bg-turf-primary text-white' : 'bg-white text-turf-text-muted border border-turf-border'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setReadinessAnswers({
                      ...readinessAnswers,
                      category_specific_answers: { ...readinessAnswers.category_specific_answers, [key]: 'No' }
                    })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      currentVal === 'No' ? 'bg-gray-800 text-white' : 'bg-white text-turf-text-muted border border-turf-border'
                    }`}
                  >
                    No
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="New Feasibility Assessment" />

        <main className="p-6 md:p-10 max-w-5xl mx-auto w-full space-y-8">
          {/* Stepper Header (Only for Steps 1..5) */}
          {currentStep >= 1 && currentStep <= 5 && (
            <div className="bg-white border border-turf-border rounded-2xl p-4">
              <div className="flex items-center justify-between border-b border-turf-border pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="eyebrow !mb-0">Assessment progress</span>
                  {savedIndicator && (
                    <span className="flex items-center gap-1 text-[11px] text-turf-primary font-semibold bg-turf-surface px-2 py-0.5 rounded-lg border border-turf-border animate-pulse">
                      <Save className="w-3 h-3" /> Draft saved
                    </span>
                  )}
                </div>
                <span className="text-xs font-semibold text-turf-text-muted">Step {currentStep} of 5</span>
              </div>

              {/* 5-Step Indicators */}
              <div className="grid grid-cols-5 gap-2">
                {[
                  { step: 1, label: 'Profile' },
                  { step: 2, label: 'Business' },
                  { step: 3, label: 'Readiness' },
                  { step: 4, label: 'Finance' },
                  { step: 5, label: 'Review' }
                ].map((st) => {
                  const isDone = currentStep > st.step;
                  const isCurrent = currentStep === st.step;
                  return (
                    <div key={st.step} className="flex flex-col items-center text-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isDone 
                          ? 'bg-turf-surface text-turf-primary border border-turf-border' 
                          : isCurrent 
                          ? 'bg-turf-primary text-white' 
                          : 'bg-gray-100 text-turf-text-muted'
                      }`}>
                        {isDone ? <Check className="w-4 h-4" /> : st.step}
                      </div>
                      <span className={`text-[11px] font-semibold mt-1 hidden sm:inline-block ${
                        isCurrent ? 'text-turf-primary' : 'text-turf-text-muted'
                      }`}>
                        {st.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ---------------- INTRO SCREEN (Step 0) ---------------- */}
          {currentStep === 0 && (
            <div className="bg-white border border-turf-border rounded-2xl p-8 md:p-12 space-y-8">
              <div className="space-y-3">
                <span className="eyebrow">Pre-investment advisory</span>
                <h1 className="text-3xl font-extrabold text-turf-text leading-tight">
                  Business Feasibility Assessment
                </h1>
                <p className="text-sm text-turf-text-muted leading-relaxed max-w-2xl">
                  Answer a few questions about your background, intended business, and local village location. We evaluate your proposal across Market Feasibility, Entrepreneur Readiness, and Financial Fit before you take on debt.
                </p>
              </div>

              {/* Trust Markers */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-turf-text">
                <div className="flex items-center gap-2 bg-turf-surface text-turf-primary px-3 py-2 rounded-xl border border-turf-border">
                  <Clock className="w-4 h-4 text-turf-primary" />
                  <span>Takes 5–7 minutes</span>
                </div>
                <div className="flex items-center gap-2 bg-turf-surface text-turf-primary px-3 py-2 rounded-xl border border-turf-border">
                  <ShieldCheck className="w-4 h-4 text-turf-primary" />
                  <span>Answers stored securely</span>
                </div>
              </div>

              {/* 3 Recap Mini Data Cards */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-turf-surface border border-turf-border space-y-1">
                  <div className="text-xs font-bold text-turf-primary">1. Market Feasibility</div>
                  <p className="text-[11px] text-turf-text-muted">Evaluates 10km village demand, competitor density & infrastructure.</p>
                </div>
                <div className="p-4 rounded-2xl bg-turf-surface border border-turf-border space-y-1">
                  <div className="text-xs font-bold text-turf-primary">2. Entrepreneur Readiness</div>
                  <p className="text-[11px] text-turf-text-muted">Assesses your skills, workspace, supplier contacts & customers.</p>
                </div>
                <div className="p-4 rounded-2xl bg-turf-surface border border-turf-border space-y-1">
                  <div className="text-xs font-bold text-turf-primary">3. Financial Fit</div>
                  <p className="text-[11px] text-turf-text-muted">Verifies margin sufficiency & monthly disposable EMI capacity.</p>
                </div>
              </div>

              <DisclaimerBanner text="This feasibility assessment provides prototype advisory guidance. Scores do not guarantee loan sanction or business financial outcomes." />

              <button
                onClick={() => triggerAutosave(1)}
                className="w-full sm:w-auto px-8 py-3.5 bg-turf-primary hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <span>Begin assessment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ---------------- STEP 1 — PROFILE ---------------- */}
          {currentStep === 1 && (
            <div className="bg-white border border-turf-border rounded-2xl p-6 md:p-10 space-y-8">
              <div>
                <span className="eyebrow">Step 1 of 5</span>
                <h2 className="text-2xl font-bold text-turf-text">Personal Profile & Resources</h2>
                <p className="text-xs text-turf-text-muted mt-1">Tell us about your background and available operational assets.</p>
              </div>

              {/* Sub-Section 1: Personal Profile */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-semibold text-turf-text border-b border-turf-border pb-2">
                  Personal background
                </h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-turf-text mb-1">Age group</label>
                    <select
                      value={profile.age_group}
                      onChange={(e) => setProfile({ ...profile, age_group: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-turf-border text-xs bg-white focus:outline-none focus:border-turf-primary"
                    >
                      <option value="18-24">18–24 years</option>
                      <option value="25-34">25–34 years</option>
                      <option value="35-44">35–44 years</option>
                      <option value="45+">45+ years</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-turf-text mb-1">Education level</label>
                    <select
                      value={profile.education}
                      onChange={(e) => setProfile({ ...profile, education: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-turf-border text-xs bg-white focus:outline-none focus:border-turf-primary"
                    >
                      <option value="Primary">Primary school</option>
                      <option value="Secondary">Secondary (Class 10/12)</option>
                      <option value="Graduate">Graduate / higher</option>
                      <option value="No Formal">No formal education</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-turf-text mb-1">Current occupation</label>
                    <input
                      type="text"
                      value={profile.occupation}
                      onChange={(e) => setProfile({ ...profile, occupation: e.target.value })}
                      placeholder="e.g. Agriculture / Self-employed"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-turf-border text-xs focus:outline-none focus:border-turf-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-turf-text mb-1">Prior business experience</label>
                    <select
                      value={profile.business_experience}
                      onChange={(e) => setProfile({ ...profile, business_experience: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-turf-border text-xs bg-white focus:outline-none focus:border-turf-primary"
                    >
                      <option value="None">None (First-time)</option>
                      <option value="0-2 years">0–2 years</option>
                      <option value="3-5 years">3–5 years</option>
                      <option value="5+ years">5+ years</option>
                    </select>
                  </div>
                </div>

                <div className="p-3.5 bg-turf-surface border border-turf-border rounded-xl text-xs text-turf-text flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-turf-primary shrink-0 mt-0.5" />
                  <span>
                    <strong>Education guarantee:</strong> Education level does not reduce your feasibility score. It is used strictly to personalize explanation complexity, skill training guidance, and financial-literacy support.
                  </span>
                </div>
              </div>

              {/* Sub-Section 2: Resources You Can Use */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-semibold text-turf-text border-b border-turf-border pb-2">
                  Resources you can use (multi-select)
                </h3>

                <div className="flex flex-wrap gap-2.5">
                  {[
                    "Own land", "Shop/workspace", "Vehicle", "Electricity", 
                    "Storage", "Machinery/equipment", "Family labour", "Existing customers"
                  ].map((res) => {
                    const isSelected = profile.resources.includes(res);
                    return (
                      <button
                        key={res}
                        type="button"
                        onClick={() => {
                          const updated = isSelected 
                            ? profile.resources.filter(r => r !== res)
                            : [...profile.resources, res];
                          setProfile({ ...profile, resources: updated });
                        }}
                        className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                          isSelected 
                            ? 'bg-turf-primary text-white font-bold'
                            : 'bg-turf-surface text-turf-text border border-turf-border hover:bg-turf-surface-hover'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        <span>{res}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Commitment & Financial Resilience */}
              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-turf-text mb-1">Time commitment</label>
                  <select
                    value={profile.time_commitment}
                    onChange={(e) => setProfile({ ...profile, time_commitment: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-turf-border text-xs bg-white"
                  >
                    <option value="Full-time">Full-time commitment</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Seasonal">Seasonal</option>
                    <option value="Family-managed">Family-managed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-turf-text mb-1">Existing monthly loan EMI (₹)</label>
                  <input
                    type="number"
                    value={profile.existing_emi}
                    onChange={(e) => setProfile({ ...profile, existing_emi: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-turf-border text-xs stat-number"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between border-t border-turf-border pt-6">
                <button
                  onClick={() => setCurrentStep(0)}
                  className="px-4 py-2.5 text-xs font-semibold text-turf-text-muted hover:text-turf-text"
                >
                  Back
                </button>
                <button
                  onClick={() => triggerAutosave(2)}
                  className="px-6 py-2.5 bg-turf-primary hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <span>Continue to business</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ---------------- STEP 2 — BUSINESS & LOCATION ---------------- */}
          {currentStep === 2 && (
            <div className="bg-white border border-turf-border rounded-2xl p-6 md:p-10 space-y-8">
              <div>
                <span className="eyebrow">Step 2 of 5</span>
                <h2 className="text-2xl font-bold text-turf-text">Select Business Category & Location</h2>
                <p className="text-xs text-turf-text-muted mt-1">Pick your target business and village location for catchment analysis.</p>
              </div>

              {/* 5 Radio-Selectable Category Cards */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-turf-text">
                  Select business category
                </label>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {businessModels.map((bm) => {
                    const isSelected = selectedCategory === bm.category;
                    return (
                      <div
                        key={bm.category}
                        onClick={() => setSelectedCategory(bm.category)}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected 
                            ? 'border-turf-primary bg-turf-surface'
                            : 'border-turf-border bg-white hover:border-turf-primary/50'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-2xl">{categoryIcons[bm.category] || "🏪"}</span>
                            {isSelected && <CheckCircle2 className="w-5 h-5 text-turf-primary" />}
                          </div>
                          <div className="font-bold text-xs text-turf-text">{bm.display_name}</div>
                          <p className="text-[11px] text-turf-text-muted line-clamp-2">{bm.description}</p>
                        </div>
                        <div className="mt-3 pt-2 border-t border-turf-border text-[10.5px] font-semibold text-turf-primary stat-number">
                          Capital: ₹{(bm.capital_min/100000).toFixed(1)}L – ₹{(bm.capital_max/100000).toFixed(1)}L
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Cascading Location Selectors */}
              <div className="space-y-4 pt-4 border-t border-turf-border">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-turf-text">
                    Target village location
                  </h3>
                  <button
                    type="button"
                    onClick={() => alert("Location set to Shikrapur, MS default demo village.")}
                    className="text-[11px] font-semibold text-turf-primary hover:underline flex items-center gap-1"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Use current location (Mock)</span>
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-turf-text-muted mb-1">State</label>
                    <select
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-turf-border text-xs bg-white"
                    >
                      {states.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-turf-text-muted mb-1">District</label>
                    <select
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-turf-border text-xs bg-white"
                    >
                      {districts.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-turf-text-muted mb-1">Block / Sub-District</label>
                    <select
                      value={selectedBlock}
                      onChange={(e) => setSelectedBlock(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-turf-border text-xs bg-white"
                    >
                      {blocks.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-turf-text-muted mb-1">Village</label>
                    <select
                      value={selectedVillageId}
                      onChange={(e) => setSelectedVillageId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-turf-border text-xs bg-white font-bold text-turf-primary"
                    >
                      {villages.map(v => <option key={v.village_id} value={v.village_id}>{v.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Live Leaflet Map */}
              <div className="pt-2">
                <LocationMap 
                  lat={selectedVillageObj.latitude || 18.6984} 
                  lng={selectedVillageObj.longitude || 74.1236} 
                  villageName={selectedVillageObj.name || "Shikrapur"} 
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between border-t border-turf-border pt-6">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2.5 text-xs font-semibold text-turf-text-muted hover:text-turf-text"
                >
                  Back
                </button>
                <button
                  onClick={() => triggerAutosave(3)}
                  className="px-6 py-2.5 bg-turf-primary hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <span>Continue to readiness</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ---------------- STEP 3 — READINESS QUESTIONNAIRE ---------------- */}
          {currentStep === 3 && (
            <div className="bg-white border border-turf-border rounded-2xl p-6 md:p-10 space-y-8">
              <div>
                <span className="eyebrow">Step 3 of 5</span>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{categoryIcons[selectedCategory]}</span>
                  <div>
                    <h2 className="text-2xl font-bold text-turf-text">{selectedCategory} Readiness Questionnaire</h2>
                    <p className="text-xs text-turf-text-muted mt-0.5">Answer based on what is available today—not what you hope to arrange later.</p>
                  </div>
                </div>
              </div>

              {renderReadinessQuestions()}

              <div className="p-3.5 bg-turf-surface border border-turf-border rounded-xl text-xs text-turf-text">
                <strong>Readiness Advisory:</strong> Honest answers make the preparation guidance more useful. Entrepreneur readiness is scored separately from village market feasibility.
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between border-t border-turf-border pt-6">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2.5 text-xs font-semibold text-turf-text-muted hover:text-turf-text"
                >
                  Back
                </button>
                <button
                  onClick={() => triggerAutosave(4)}
                  className="px-6 py-2.5 bg-turf-primary hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <span>Continue to finance</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ---------------- STEP 4 — FINANCE ---------------- */}
          {currentStep === 4 && (
            <div className="bg-white border border-turf-border rounded-2xl p-6 md:p-10 space-y-8">
              <div>
                <span className="eyebrow">Step 4 of 5</span>
                <h2 className="text-2xl font-bold text-turf-text">Understand Your Financial Fit</h2>
                <p className="text-xs text-turf-text-muted mt-1">Provide your available capital and monthly household obligations.</p>
              </div>

              <div className="grid md:grid-cols-12 gap-6">
                {/* Left Form Inputs */}
                <div className="md:col-span-7 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-turf-text mb-1">Project cost estimate (₹)</label>
                    <input
                      type="number"
                      value={finance.project_cost}
                      onChange={(e) => setFinance({ ...finance, project_cost: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-turf-border text-xs font-bold stat-number"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-turf-text mb-1">Available entrepreneur margin capital (₹)</label>
                    <input
                      type="number"
                      value={finance.available_margin}
                      onChange={(e) => setFinance({ ...finance, available_margin: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-turf-border text-xs font-bold text-turf-primary stat-number"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-turf-text mb-1">Monthly household expenses (₹)</label>
                    <input
                      type="number"
                      value={finance.household_expenses}
                      onChange={(e) => setFinance({ ...finance, household_expenses: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-turf-border text-xs stat-number"
                    />
                  </div>

                  {/* Financial Understanding Self-Assessment */}
                  <div className="p-4 rounded-2xl bg-turf-surface border border-turf-border space-y-3 pt-3">
                    <span className="eyebrow !mb-0">Financial understanding</span>
                    
                    <div className="space-y-2">
                      <label className="block text-xs text-turf-text font-medium">Do you understand how EMI works?</label>
                      <div className="flex gap-2">
                        {["Yes", "Somewhat", "No"].map(opt => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setFinance({ ...finance, understands_emi: opt })}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                              finance.understands_emi === opt ? 'bg-turf-primary text-white' : 'bg-white text-turf-text-muted border border-turf-border'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Card: Live Preview Calculation (Data Card) */}
                <div className="md:col-span-5 bg-turf-surface border border-turf-border rounded-2xl p-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <span className="eyebrow">Preliminary demo estimate</span>
                    
                    <div className="space-y-3 border-b border-turf-border pb-4">
                      <div className="flex justify-between text-xs">
                        <span className="text-turf-text-muted">Project cost:</span>
                        <span className="stat-number text-turf-text">₹{finance.project_cost.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-turf-text-muted">Your available margin:</span>
                        <span className="stat-number text-turf-primary">₹{finance.available_margin.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-turf-text-muted">Min margin needed (10%):</span>
                        <span className="stat-number text-turf-text">₹{(finance.project_cost * 0.1).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-xs text-turf-text-muted font-medium">Indicative loan amount</div>
                      <div className="text-2xl stat-number text-turf-primary">
                        ₹{Math.max(0, finance.project_cost - finance.available_margin).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <p className="text-[10.5px] text-turf-text-muted italic mt-4">
                    Final calculations, reducing balance interest, moratorium period, and exact EMI figures will come from the financial engine when you click Run.
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between border-t border-turf-border pt-6">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-4 py-2.5 text-xs font-semibold text-turf-text-muted hover:text-turf-text"
                >
                  Back
                </button>
                <button
                  onClick={() => triggerAutosave(5)}
                  className="px-6 py-2.5 bg-turf-primary hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <span>Continue to review</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ---------------- STEP 5 — REVIEW & SUBMIT ---------------- */}
          {currentStep === 5 && (
            <div className="bg-white border border-turf-border rounded-2xl p-6 md:p-10 space-y-8">
              <div>
                <span className="eyebrow">Step 5 of 5</span>
                <h2 className="text-2xl font-bold text-turf-text">Review Your Inputs</h2>
                <p className="text-xs text-turf-text-muted mt-1">Check your assessment inputs before running the feasibility engine.</p>
              </div>

              {/* 5 Summary Cards */}
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-turf-surface border border-turf-border flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-turf-text">1. Personal profile</div>
                    <div className="text-[11.5px] text-turf-text-muted">Age {profile.age_group} · {profile.education} · {profile.business_experience} experience</div>
                  </div>
                  <button onClick={() => setCurrentStep(1)} className="text-xs font-bold text-turf-primary hover:underline">Edit</button>
                </div>

                <div className="p-4 rounded-2xl bg-turf-surface border border-turf-border flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-turf-text">2. Business & location</div>
                    <div className="text-[11.5px] text-turf-text-muted">{selectedCategory} · {selectedVillageObj.name || 'Shikrapur'}, {selectedDistrict}, {selectedState}</div>
                  </div>
                  <button onClick={() => setCurrentStep(2)} className="text-xs font-bold text-turf-primary hover:underline">Edit</button>
                </div>

                <div className="p-4 rounded-2xl bg-turf-surface border border-turf-border flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-turf-text">3. {selectedCategory} readiness</div>
                    <div className="text-[11.5px] text-turf-text-muted">Category questionnaire completed</div>
                  </div>
                  <button onClick={() => setCurrentStep(3)} className="text-xs font-bold text-turf-primary hover:underline">Edit</button>
                </div>

                <div className="p-4 rounded-2xl bg-turf-surface border border-turf-border flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-turf-text">4. Financial setup</div>
                    <div className="text-[11.5px] text-turf-text-muted">Project cost: ₹{finance.project_cost.toLocaleString()} · Available margin: ₹{finance.available_margin.toLocaleString()}</div>
                  </div>
                  <button onClick={() => setCurrentStep(4)} className="text-xs font-bold text-turf-primary hover:underline">Edit</button>
                </div>
              </div>

              {/* Bottom Run Action */}
              <div className="bg-turf-surface border border-turf-border rounded-2xl p-6 space-y-4">
                <div className="text-xs text-turf-text leading-relaxed">
                  Ready to analyse? Our deterministic engines will evaluate 10km village catchment demand, entrepreneur readiness, loan scheme options, and EMI affordability.
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => setCurrentStep(4)}
                    className="px-4 py-2 text-xs font-semibold text-turf-text-muted hover:text-turf-text"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleRunAnalysis}
                    className="px-8 py-3.5 bg-turf-primary hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Run Feasibility Analysis →</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ---------------- STEP 6 — PROCESSING ANIMATED SCREEN ---------------- */}
          {currentStep === 6 && (
            <div className="bg-turf-surface border border-turf-border rounded-2xl p-12 text-center max-w-xl mx-auto space-y-8 my-8">
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-turf-border border-t-turf-primary animate-spin"></div>
                <Sparkles className="w-8 h-8 text-turf-primary" />
              </div>

              <div className="space-y-2">
                <span className="eyebrow">Prototype analysis</span>
                <h2 className="text-2xl font-bold text-turf-text">Building your feasibility picture</h2>
                <p className="text-xs text-turf-text-muted max-w-md mx-auto leading-relaxed">
                  Keeping market feasibility, entrepreneur readiness, and financial fit separate for clear explainability.
                </p>
              </div>

              {/* Sequential Animated Progress Checklist */}
              <div className="space-y-2.5 text-left max-w-sm mx-auto pt-2">
                {[
                  "Analysing local village demographics",
                  "Mapping nearby villages within 10km catchment",
                  "Evaluating local competitor density",
                  "Measuring road & power infrastructure signals",
                  "Assessing entrepreneur readiness & resources",
                  "Structuring reducing-balance finance scheme",
                  "Generating plain-language recommendations"
                ].map((txt, idx) => {
                  const isFinished = processingStage > idx;
                  const isCurrent = processingStage === idx + 1;
                  return (
                    <div key={idx} className={`flex items-center gap-3 text-xs font-medium transition-all ${
                      isFinished ? 'text-turf-primary font-bold' : (isCurrent ? 'text-turf-primary font-extrabold animate-pulse' : 'text-turf-text-muted')
                    }`}>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                        isFinished ? 'bg-turf-primary text-white' : (isCurrent ? 'bg-turf-primary text-white' : 'bg-white border border-turf-border text-turf-text-muted')
                      }`}>
                        {isFinished ? <Check className="w-3 h-3" /> : idx + 1}
                      </div>
                      <span>{txt}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AssessmentWizard;
