import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, ArrowRight, ArrowLeft, Clock, ShieldCheck, 
  Store, UserCheck, Wallet, MapPin, Check, Save, Sparkles
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

  // Cascading Location Dropdowns
  useEffect(() => {
    if (selectedState) {
      api.getDistricts(selectedState).then(res => setDistricts(res.data));
    }
  }, [selectedState]);

  useEffect(() => {
    if (selectedDistrict) {
      api.getBlocks(selectedDistrict).then(res => setBlocks(res.data));
    }
  }, [selectedDistrict]);

  useEffect(() => {
    if (selectedBlock) {
      api.getVillages(selectedBlock).then(res => {
        setVillages(res.data);
        if (res.data.length > 0) {
          setSelectedVillageId(res.data[0].village_id);
          setSelectedVillageObj(res.data[0]);
        }
      });
    }
  }, [selectedBlock]);

  useEffect(() => {
    if (selectedVillageId) {
      api.getVillageById(selectedVillageId).then(res => {
        if (res.data) setSelectedVillageObj(res.data);
      });
    }
  }, [selectedVillageId]);

  // Save Draft Helper
  const triggerAutosave = async (newStep) => {
    setSaving(true);
    try {
      if (!assessmentId) {
        const resp = await api.createAssessment({
          village_id: selectedVillageId,
          category: selectedCategory,
          project_cost: finance.project_cost,
          available_margin: finance.available_margin,
          existing_emi: profile.existing_emi,
          household_expenses: finance.household_expenses
        });
        setAssessmentId(resp.data.id);
      } else {
        await api.updateAssessment(assessmentId, {
          village_id: selectedVillageId,
          category: selectedCategory,
          project_cost: finance.project_cost,
          available_margin: finance.available_margin,
          existing_emi: profile.existing_emi,
          household_expenses: finance.household_expenses,
          questionnaire_answers: {
            experience_years: parseFloat(readinessAnswers.experience_years),
            has_relevant_skill: readinessAnswers.has_relevant_skill,
            has_workspace: readinessAnswers.has_workspace,
            has_supplier_contacts: readinessAnswers.has_supplier_contacts,
            has_committed_customers: readinessAnswers.has_committed_customers,
            emergency_savings: parseFloat(readinessAnswers.emergency_savings),
            category_specific_answers: readinessAnswers.category_specific_answers
          }
        });
      }
      setSavedIndicator(true);
      setTimeout(() => setSavedIndicator(false), 2000);
    } catch (err) {
      console.error("Autosave error:", err);
    } finally {
      setSaving(false);
      setCurrentStep(newStep);
    }
  };

  // Run Feasibility Engine
  const handleRunAnalysis = async () => {
    setCurrentStep(6); // Processing screen
    
    // Animate stages sequentially
    for (let i = 1; i <= 7; i++) {
      await new Promise(r => setTimeout(r, 600));
      setProcessingStage(i);
    }

    try {
      await api.runAssessment(assessmentId);
      navigate(`/assessments/${assessmentId}/report`);
    } catch (err) {
      console.error("Run analysis error:", err);
      // Navigate to report placeholder route even if backend mongo is offline
      navigate(`/assessments/${assessmentId || 'ASM_DEFAULT'}/report`);
    }
  };

  // Render Step 3 Category Readiness Questions
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
      <div className="space-y-4">
        {questions.map((qText, qIdx) => {
          const key = `q${qIdx + 1}`;
          const isNumeric = qIdx === 1 || qIdx === 6;
          const currentVal = readinessAnswers.category_specific_answers[key] || (isNumeric ? "3" : "Yes");

          return (
            <div key={key} className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs font-medium text-gray-800">
                <strong className="text-primary-600 mr-2">{qIdx + 1}.</strong>
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
                  className="w-24 px-3 py-1.5 rounded-lg border border-gray-200 text-xs bg-white focus:outline-none focus:border-primary-600"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setReadinessAnswers({
                      ...readinessAnswers,
                      category_specific_answers: { ...readinessAnswers.category_specific_answers, [key]: 'Yes' }
                    })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      currentVal === 'Yes' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white text-gray-600 border border-gray-200'
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
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      currentVal === 'No' ? 'bg-amber-600 text-white shadow-xs' : 'bg-white text-gray-600 border border-gray-200'
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
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="New Feasibility Assessment" />

        <main className="p-6 md:p-10 max-w-5xl mx-auto w-full space-y-8">
          {/* Stepper Header (Only for Steps 1..5) */}
          {currentStep >= 1 && currentStep <= 5 && (
            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="eyebrow !mb-0">ASSESSMENT PROGRESS</span>
                  {savedIndicator && (
                    <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 animate-pulse">
                      <Save className="w-3 h-3" /> Draft saved
                    </span>
                  )}
                </div>
                <span className="text-xs font-bold text-gray-500">Step {currentStep} of 5</span>
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
                        isDone ? 'bg-emerald-600 text-white' : (isCurrent ? 'bg-primary-600 text-white ring-4 ring-primary-100' : 'bg-gray-100 text-gray-400')
                      }`}>
                        {isDone ? <Check className="w-4 h-4" /> : st.step}
                      </div>
                      <span className={`text-[11px] font-semibold mt-1 hidden sm:inline-block ${
                        isCurrent ? 'text-primary-700' : 'text-gray-500'
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
            <div className="bg-white border border-gray-200 rounded-3xl p-8 md:p-12 shadow-sm space-y-8">
              <div className="space-y-3">
                <span className="eyebrow">PRE-INVESTMENT ADVISORY</span>
                <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
                  Business Feasibility Assessment
                </h1>
                <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
                  Answer a few questions about your background, intended business, and local village location. We evaluate your proposal across Market Feasibility, Entrepreneur Readiness, and Financial Fit before you take on debt.
                </p>
              </div>

              {/* Trust Markers */}
              <div className="flex flex-wrap items-center gap-6 text-xs font-semibold text-gray-600">
                <div className="flex items-center gap-2 bg-blue-50 text-blue-800 px-3 py-1.5 rounded-lg border border-blue-100">
                  <Clock className="w-4 h-4 text-primary-600" />
                  <span>Takes 5–7 minutes</span>
                </div>
                <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-lg border border-emerald-100">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Answers stored securely</span>
                </div>
              </div>

              {/* 3 Recap Mini-Cards */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-1">
                  <div className="text-xs font-bold text-primary-600">1. Market Feasibility</div>
                  <p className="text-[11px] text-gray-500">Evaluates 10km village demand, competitor density & infrastructure.</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-1">
                  <div className="text-xs font-bold text-emerald-600">2. Entrepreneur Readiness</div>
                  <p className="text-[11px] text-gray-500">Assesses your skills, workspace, supplier contacts & customers.</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-1">
                  <div className="text-xs font-bold text-amber-600">3. Financial Fit</div>
                  <p className="text-[11px] text-gray-500">Verifies margin sufficiency & monthly disposable EMI capacity.</p>
                </div>
              </div>

              <DisclaimerBanner text="This feasibility assessment provides prototype advisory guidance. Scores do not guarantee loan sanction or business financial outcomes." />

              <button
                onClick={() => triggerAutosave(1)}
                className="w-full sm:w-auto px-8 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Begin assessment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ---------------- STEP 1 — PROFILE ---------------- */}
          {currentStep === 1 && (
            <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-10 shadow-sm space-y-8">
              <div>
                <span className="eyebrow">STEP 1 OF 5</span>
                <h2 className="text-2xl font-bold text-gray-900">Personal Profile & Resources</h2>
                <p className="text-xs text-gray-500 mt-1">Tell us about your background and available operational assets.</p>
              </div>

              {/* Sub-Section 1: Personal Profile */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">
                  Personal Background
                </h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Age Group</label>
                    <select
                      value={profile.age_group}
                      onChange={(e) => setProfile({ ...profile, age_group: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:border-primary-600"
                    >
                      <option value="18-24">18–24 years</option>
                      <option value="25-34">25–34 years</option>
                      <option value="35-44">35–44 years</option>
                      <option value="45+">45+ years</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Education Level</label>
                    <select
                      value={profile.education}
                      onChange={(e) => setProfile({ ...profile, education: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:border-primary-600"
                    >
                      <option value="Primary">Primary School</option>
                      <option value="Secondary">Secondary (Class 10/12)</option>
                      <option value="Graduate">Graduate / Higher</option>
                      <option value="No Formal">No Formal Education</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Current Occupation</label>
                    <input
                      type="text"
                      value={profile.occupation}
                      onChange={(e) => setProfile({ ...profile, occupation: e.target.value })}
                      placeholder="e.g. Agriculture / Self-employed"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-primary-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Prior Business Experience</label>
                    <select
                      value={profile.business_experience}
                      onChange={(e) => setProfile({ ...profile, business_experience: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:border-primary-600"
                    >
                      <option value="None">None (First-time)</option>
                      <option value="0-2 years">0–2 years</option>
                      <option value="3-5 years">3–5 years</option>
                      <option value="5+ years">5+ years</option>
                    </select>
                  </div>
                </div>

                {/* Inline Green Guarantee Banner Requirement */}
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Education Guarantee:</strong> Education level does not reduce your feasibility score. It is used strictly to personalize explanation complexity, skill training guidance, and financial-literacy support.
                  </span>
                </div>
              </div>

              {/* Sub-Section 2: Resources You Can Use */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">
                  Resources You Can Use (Multi-Select)
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
                            ? 'bg-primary-600 text-white font-bold shadow-xs'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Time Commitment</label>
                  <select
                    value={profile.time_commitment}
                    onChange={(e) => setProfile({ ...profile, time_commitment: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-white"
                  >
                    <option value="Full-time">Full-time commitment</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Seasonal">Seasonal</option>
                    <option value="Family-managed">Family-managed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Existing Monthly Loan EMI (₹)</label>
                  <input
                    type="number"
                    value={profile.existing_emi}
                    onChange={(e) => setProfile({ ...profile, existing_emi: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                <button
                  onClick={() => setCurrentStep(0)}
                  className="px-4 py-2.5 text-xs font-semibold text-gray-600 hover:text-gray-900"
                >
                  Back
                </button>
                <button
                  onClick={() => triggerAutosave(2)}
                  className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <span>Continue to Business</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ---------------- STEP 2 — BUSINESS & LOCATION ---------------- */}
          {currentStep === 2 && (
            <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-10 shadow-sm space-y-8">
              <div>
                <span className="eyebrow">STEP 2 OF 5</span>
                <h2 className="text-2xl font-bold text-gray-900">Select Business Category & Location</h2>
                <p className="text-xs text-gray-500 mt-1">Pick your target business and village location for catchment analysis.</p>
              </div>

              {/* 5 Radio-Selectable Category Cards */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider">
                  Select Business Category
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
                            ? 'border-primary-600 bg-blue-50/40 ring-2 ring-blue-100 shadow-xs'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-2xl">{categoryIcons[bm.category] || "🏪"}</span>
                            {isSelected && <CheckCircle2 className="w-5 h-5 text-primary-600" />}
                          </div>
                          <div className="font-bold text-xs text-gray-900">{bm.display_name}</div>
                          <p className="text-[11px] text-gray-500 line-clamp-2">{bm.description}</p>
                        </div>
                        <div className="mt-3 pt-2 border-t border-gray-100 text-[10.5px] font-semibold text-primary-700">
                          Capital: ₹{(bm.capital_min/100000).toFixed(1)}L – ₹{(bm.capital_max/100000).toFixed(1)}L
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Cascading Location Selectors */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Target Village Location
                  </h3>
                  <button
                    type="button"
                    onClick={() => alert("Location set to Shikrapur, MS default demo village.")}
                    className="text-[11px] font-semibold text-primary-600 hover:underline flex items-center gap-1"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Use current location (Mock)</span>
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">State</label>
                    <select
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white"
                    >
                      {states.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">District</label>
                    <select
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white"
                    >
                      {districts.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Block / Sub-District</label>
                    <select
                      value={selectedBlock}
                      onChange={(e) => setSelectedBlock(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white"
                    >
                      {blocks.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Village</label>
                    <select
                      value={selectedVillageId}
                      onChange={(e) => setSelectedVillageId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white font-bold text-primary-700"
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
              <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2.5 text-xs font-semibold text-gray-600 hover:text-gray-900"
                >
                  Back
                </button>
                <button
                  onClick={() => triggerAutosave(3)}
                  className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <span>Continue to Readiness</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ---------------- STEP 3 — READINESS QUESTIONNAIRE ---------------- */}
          {currentStep === 3 && (
            <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-10 shadow-sm space-y-8">
              <div>
                <span className="eyebrow">STEP 3 OF 5</span>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{categoryIcons[selectedCategory]}</span>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedCategory} Readiness Questionnaire</h2>
                    <p className="text-xs text-gray-500 mt-0.5">Answer based on what is available today—not what you hope to arrange later.</p>
                  </div>
                </div>
              </div>

              {renderReadinessQuestions()}

              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                <strong>Readiness Advisory:</strong> Honest answers make the preparation guidance more useful. Entrepreneur readiness is scored separately from village market feasibility.
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2.5 text-xs font-semibold text-gray-600 hover:text-gray-900"
                >
                  Back
                </button>
                <button
                  onClick={() => triggerAutosave(4)}
                  className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <span>Continue to Finance</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ---------------- STEP 4 — FINANCE ---------------- */}
          {currentStep === 4 && (
            <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-10 shadow-sm space-y-8">
              <div>
                <span className="eyebrow">STEP 4 OF 5</span>
                <h2 className="text-2xl font-bold text-gray-900">Understand Your Financial Fit</h2>
                <p className="text-xs text-gray-500 mt-1">Provide your available capital and monthly household obligations.</p>
              </div>

              <div className="grid md:grid-cols-12 gap-6">
                {/* Left Form Inputs */}
                <div className="md:col-span-7 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Project Cost Estimate (₹)</label>
                    <input
                      type="number"
                      value={finance.project_cost}
                      onChange={(e) => setFinance({ ...finance, project_cost: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Available Entrepreneur Margin Capital (₹)</label>
                    <input
                      type="number"
                      value={finance.available_margin}
                      onChange={(e) => setFinance({ ...finance, available_margin: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Monthly Household Expenses (₹)</label>
                    <input
                      type="number"
                      value={finance.household_expenses}
                      onChange={(e) => setFinance({ ...finance, household_expenses: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs"
                    />
                  </div>

                  {/* Financial Understanding Self-Assessment */}
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3 pt-3">
                    <span className="eyebrow !mb-0">FINANCIAL UNDERSTANDING</span>
                    
                    <div className="space-y-2">
                      <label className="block text-xs text-gray-700 font-medium">Do you understand how EMI works?</label>
                      <div className="flex gap-2">
                        {["Yes", "Somewhat", "No"].map(opt => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setFinance({ ...finance, understands_emi: opt })}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                              finance.understands_emi === opt ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Card: Live Preview Calculation */}
                <div className="md:col-span-5 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <span className="eyebrow">PRELIMINARY DEMO ESTIMATE</span>
                    
                    <div className="space-y-3 border-b border-blue-200/50 pb-4">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Project Cost:</span>
                        <span className="font-bold text-gray-900">₹{finance.project_cost.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Your Available Margin:</span>
                        <span className="font-bold text-emerald-700">₹{finance.available_margin.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Min Margin Needed (10%):</span>
                        <span className="font-semibold text-gray-700">₹{(finance.project_cost * 0.1).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-xs text-gray-500 font-medium">Indicative Loan Amount</div>
                      <div className="text-2xl font-extrabold text-primary-700">
                        ₹{Math.max(0, finance.project_cost - finance.available_margin).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <p className="text-[10.5px] text-gray-500 italic mt-4">
                    Final calculations, reducing balance interest, moratorium period, and exact EMI figures will come from the financial engine when you click Run.
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-4 py-2.5 text-xs font-semibold text-gray-600 hover:text-gray-900"
                >
                  Back
                </button>
                <button
                  onClick={() => triggerAutosave(5)}
                  className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <span>Continue to Review</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ---------------- STEP 5 — REVIEW & SUBMIT ---------------- */}
          {currentStep === 5 && (
            <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-10 shadow-sm space-y-8">
              <div>
                <span className="eyebrow">STEP 5 OF 5</span>
                <h2 className="text-2xl font-bold text-gray-900">Review Your Inputs</h2>
                <p className="text-xs text-gray-500 mt-1">Check your assessment inputs before running the feasibility engine.</p>
              </div>

              {/* 5 Summary Cards */}
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-gray-900">1. Personal Profile</div>
                    <div className="text-[11.5px] text-gray-600">Age {profile.age_group} · {profile.education} · {profile.business_experience} experience</div>
                  </div>
                  <button onClick={() => setCurrentStep(1)} className="text-xs font-bold text-primary-600 hover:underline">Edit</button>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-gray-900">2. Business & Location</div>
                    <div className="text-[11.5px] text-gray-600">{selectedCategory} · {selectedVillageObj.name || 'Shikrapur'}, {selectedDistrict}, {selectedState}</div>
                  </div>
                  <button onClick={() => setCurrentStep(2)} className="text-xs font-bold text-primary-600 hover:underline">Edit</button>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-gray-900">3. {selectedCategory} Readiness</div>
                    <div className="text-[11.5px] text-gray-600">Category Questionnaire Completed</div>
                  </div>
                  <button onClick={() => setCurrentStep(3)} className="text-xs font-bold text-primary-600 hover:underline">Edit</button>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-gray-900">4. Financial Setup</div>
                    <div className="text-[11.5px] text-gray-600">Project Cost: ₹{finance.project_cost.toLocaleString()} · Available Margin: ₹{finance.available_margin.toLocaleString()}</div>
                  </div>
                  <button onClick={() => setCurrentStep(4)} className="text-xs font-bold text-primary-600 hover:underline">Edit</button>
                </div>
              </div>

              {/* Bottom Run Action */}
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 space-y-4">
                <div className="text-xs text-blue-900 leading-relaxed">
                  Ready to analyse? Our deterministic engines will evaluate 10km village catchment demand, entrepreneur readiness, loan scheme options, and EMI affordability.
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => setCurrentStep(4)}
                    className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleRunAnalysis}
                    className="px-8 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
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
            <div className="bg-white border border-gray-200 rounded-3xl p-12 shadow-sm text-center max-w-xl mx-auto space-y-8 my-8">
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-primary-100 border-t-primary-600 animate-spin"></div>
                <Sparkles className="w-8 h-8 text-primary-600" />
              </div>

              <div className="space-y-2">
                <span className="eyebrow">PROTOTYPE ANALYSIS</span>
                <h2 className="text-2xl font-extrabold text-gray-900">Building your feasibility picture</h2>
                <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
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
                    <div key={idx} className={`flex items-center gap-3 text-xs font-semibold transition-all ${
                      isFinished ? 'text-emerald-700 font-bold' : (isCurrent ? 'text-primary-600 font-extrabold animate-pulse' : 'text-gray-300')
                    }`}>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                        isFinished ? 'bg-emerald-600 text-white' : (isCurrent ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-400')
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
