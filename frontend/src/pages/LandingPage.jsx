import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, ArrowRight, ShieldCheck, MapPin, Store, UserCheck, 
  Wallet, PieChart, HelpCircle, BarChart3, AlertCircle, Award
} from 'lucide-react';
import Logo from '../components/common/Logo';
import ThreeWayFitCard from '../components/common/ThreeWayFitCard';

export const LandingPage = () => {
  const featureGrid = [
    { icon: MapPin, title: "Hyper-Local Market Analysis", desc: "Evaluate demand drivers, competitor density, and infrastructure within 10 km radius." },
    { icon: UserCheck, title: "Entrepreneur Readiness", desc: "Assess domain skill, workspace access, supplier networks, and customer commitments." },
    { icon: Wallet, title: "Financial Fit & EMI Ratio", desc: "Verify disposable capacity against reducing-balance EMI to prevent loan default." },
    { icon: PieChart, title: "Business Alternatives", desc: "Rank 5 business categories to uncover stronger alternative opportunities." },
    { icon: AlertCircle, title: "Risk Awareness", desc: "Identify local market risk factors before committing margin capital." },
    { icon: HelpCircle, title: "Scheme Guidance", desc: "Match official government loan schemes (Micro Finance & Term Loan tiers)." },
    { icon: BarChart3, title: "Financial Literacy Notes", desc: "Plain-language explanations of EMI, moratorium interest, and cash reserves." },
    { icon: Award, title: "Explainable Recommendations", desc: "Clear positive factors and attention areas for every feasibility score." }
  ];

  const steps = [
    { step: "01", title: "Tell us about yourself", desc: "Share your business experience, available resources, and financial background." },
    { step: "02", title: "Select business & location", desc: "Choose from 5 business categories and pick your village location." },
    { step: "03", title: "Analyse local fit", desc: "Our deterministic engines process local market signals, readiness, and EMI capacity." },
    { step: "04", title: "Receive practical action plan", desc: "Get an actionable preparation checklist and legal office guidance." }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 1. Nav Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Logo />
          
          <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-gray-600">
            <a href="#how-it-works" className="hover:text-primary-600 transition-colors">How it works</a>
            <a href="#what-we-assess" className="hover:text-primary-600 transition-colors">What we assess</a>
            <a href="#why-it-matters" className="hover:text-primary-600 transition-colors">Why it matters</a>
          </div>

          <div className="flex items-center gap-3">
            <Link 
              to="/login" 
              className="px-4 py-2 text-xs font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Log in
            </Link>
            <Link 
              to="/signup" 
              className="px-4 py-2 text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>Start assessment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="py-16 md:py-24 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-primary-700">
              <ShieldCheck className="w-4 h-4 text-primary-600" />
              <span>Data-driven guidance before debt</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
              Make better business decisions <span className="text-primary-600">before</span> taking a loan.
            </h1>

            <p className="text-base text-gray-600 leading-relaxed max-w-2xl">
              Udyam Gram is a pre-investment advisory platform that tells a rural entrepreneur whether a specific business idea is viable at their village location, whether they are personally ready, and whether they can afford financing — before debt is taken.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link 
                to="/signup" 
                className="px-6 py-3 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-sm transition-all flex items-center gap-2"
              >
                <span>Start assessment</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a 
                href="#how-it-works" 
                className="px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                See how it works
              </a>
            </div>

            {/* 3 Checkmark Trust Markers */}
            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-gray-100 text-xs font-medium text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Clear recommendations</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Practical action plan</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>No guaranteed outcomes</span>
              </div>
            </div>
          </div>

          {/* Right Side 3-Way Fit Card Component */}
          <div className="md:col-span-5">
            <ThreeWayFitCard />
          </div>
        </div>
      </section>

      {/* 3. Three-Way Fit Explainer */}
      <section id="what-we-assess" className="py-16 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="eyebrow">THE THREE-WAY FIT</span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              A business can look good on paper and still be wrong for you.
            </h2>
            <p className="text-xs text-gray-600">
              We evaluate feasibility through three distinct, un-blended perspectives.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-3">
              <div className="text-xs font-black text-primary-600">01</div>
              <div className="p-3 rounded-xl bg-blue-50 text-primary-600 w-fit">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900">Business ↔ Location</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Is there sufficient unmet demand, local population, and road infrastructure in the 10km catchment?
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-3">
              <div className="text-xs font-black text-emerald-600">02</div>
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 w-fit">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900">Person ↔ Business</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Do you personally possess the skills, workspace, supplier links, and committed customers to run it?
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-3">
              <div className="text-xs font-black text-amber-600">03</div>
              <div className="p-3 rounded-xl bg-amber-50 text-amber-600 w-fit">
                <Wallet className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900">Person ↔ Finance</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Can your monthly disposable income support loan EMI repayments without straining household expenses?
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. 8-Item Feature Grid */}
      <section className="py-16 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="eyebrow">TRANSPARENT ADVISORY</span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Every recommendation shows its reasoning.
            </h2>
            <p className="text-xs text-gray-600">
              No black-box scoring. Every score comes with positive drivers and attention areas.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featureGrid.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} className="p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-all space-y-2">
                  <div className="p-2.5 rounded-xl bg-white border border-gray-200 w-fit text-primary-600 shadow-xs">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">{feat.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. How It Works */}
      <section id="how-it-works" className="py-16 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="eyebrow">SIMPLE 4-STEP PROCESS</span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">How it works</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((st, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-6 relative shadow-xs space-y-3">
                <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-xs">
                  {st.step}
                </div>
                <h3 className="text-sm font-bold text-gray-900">{st.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Why This Matters Quote Callout */}
      <section id="why-it-matters" className="py-16 bg-primary-800 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <span className="eyebrow !text-blue-300">OUR MISSION</span>
          <blockquote className="text-xl md:text-2xl font-serif italic text-blue-50 leading-relaxed">
            "Credit should support a good decision—not create an avoidable burden."
          </blockquote>
          <p className="text-xs text-blue-200 max-w-xl mx-auto leading-relaxed">
            Taking a loan for an unviable business in a low-demand village creates severe debt distress. Udyam Gram helps rural entrepreneurs verify feasibility before signing loan documents.
          </p>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10 border-t border-gray-800 text-xs">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo textClassName="text-lg font-bold text-white" />
          <div>SIH26091 · Hyper-Local Rural Business Feasibility Prototype</div>
          <div>&copy; 2026 Udyam Gram. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
