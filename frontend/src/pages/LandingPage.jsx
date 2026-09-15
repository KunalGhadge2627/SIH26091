import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, ArrowRight, ShieldCheck, MapPin, UserCheck, 
  Wallet, PieChart, HelpCircle, BarChart3, AlertCircle, Award, Store
} from 'lucide-react';
import Logo from '../components/common/Logo';
import ThreeWayFitCard from '../components/common/ThreeWayFitCard';
import LanguageSelector from '../components/common/LanguageSelector';
import { useLanguage } from '../context/LanguageContext';

export const LandingPage = () => {
  const { translate: t } = useLanguage();

  const featureGrid = [
    { icon: MapPin, title: t("Hyper-Local Market Analysis"), desc: t("Evaluate demand drivers, competitor density, and infrastructure within 10 km radius.") },
    { icon: UserCheck, title: t("Entrepreneur Readiness"), desc: t("Assess domain skill, workspace access, supplier networks, and customer commitments.") },
    { icon: Wallet, title: t("Financial Fit & EMI Ratio"), desc: t("Verify disposable capacity against reducing-balance EMI to prevent loan default.") },
    { icon: PieChart, title: t("Business Alternatives"), desc: t("Rank 5 business categories to uncover stronger alternative opportunities.") },
    { icon: AlertCircle, title: t("Risk Awareness"), desc: t("Identify local market risk factors before committing margin capital.") },
    { icon: HelpCircle, title: t("Scheme Guidance"), desc: t("Match official government loan schemes (Micro Finance & Term Loan tiers).") },
    { icon: BarChart3, title: t("Financial Literacy Notes"), desc: t("Plain-language explanations of EMI, moratorium interest, and cash reserves.") },
    { icon: Award, title: t("Explainable Recommendations"), desc: t("Clear positive factors and attention areas for every feasibility score.") }
  ];

  const steps = [
    { step: "01", title: t("Tell us about yourself"), desc: t("Share your business experience, available resources, and financial background.") },
    { step: "02", title: t("Select business & location"), desc: t("Choose from 5 business categories and pick your village location.") },
    { step: "03", title: t("Analyse local fit"), desc: t("Our deterministic engines process local market signals, readiness, and EMI capacity.") },
    { step: "04", title: t("Receive practical action plan"), desc: t("Get an actionable preparation checklist and legal office guidance.") }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 1. Nav Bar */}
      <header className="bg-white border-b border-turf-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Logo />
          
<<<<<<< HEAD
          <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-turf-text-muted">
            <a href="#how-it-works" className="hover:text-turf-primary transition-colors">How it works</a>
            <a href="#what-we-assess" className="hover:text-turf-primary transition-colors">What we assess</a>
            <a href="#why-it-matters" className="hover:text-turf-primary transition-colors">Why it matters</a>
=======
          <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-gray-600">
            <a href="#how-it-works" className="hover:text-primary-600 transition-colors">{t("How it works")}</a>
            <a href="#what-we-assess" className="hover:text-primary-600 transition-colors">{t("What we assess")}</a>
            <a href="#why-it-matters" className="hover:text-primary-600 transition-colors">{t("Why it matters")}</a>
>>>>>>> development
          </div>

          <div className="flex items-center gap-3">
            <LanguageSelector />
            <Link 
              to="/login" 
              className="px-4 py-2 text-xs font-semibold text-turf-text hover:bg-turf-surface rounded-xl transition-colors"
            >
              {t("Log in")}
            </Link>
            <Link 
              to="/signup" 
              className="px-4 py-2 text-xs font-semibold text-white bg-turf-primary hover:bg-emerald-700 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <span>{t("Start assessment")}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="py-16 md:py-24 bg-white border-b border-turf-border">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7 space-y-6">
<<<<<<< HEAD
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-turf-surface border border-turf-border text-xs font-semibold text-turf-primary">
              <ShieldCheck className="w-4 h-4 text-turf-primary" />
              <span>Data-driven guidance before debt</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-turf-text leading-tight tracking-tight">
              Make better business decisions <span className="text-turf-primary">before</span> taking a loan.
            </h1>

            <p className="text-base text-turf-text-muted leading-relaxed max-w-2xl">
              Udyam Gram is a pre-investment advisory platform that tells a rural entrepreneur whether a specific business idea is viable at their village location, whether they are personally ready, and whether they can afford financing — before debt is taken.
=======
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-primary-700">
              <ShieldCheck className="w-4 h-4 text-primary-600" />
              <span>{t("Data-driven guidance before debt")}</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
              {t("Make better business decisions")} <span className="text-primary-600">{t("before")}</span> {t("taking a loan.")}
            </h1>

            <p className="text-base text-gray-600 leading-relaxed max-w-2xl">
              {t("Udyam Gram is a pre-investment advisory platform that tells a rural entrepreneur whether a specific business idea is viable at their village location, whether they are personally ready, and whether they can afford financing — before debt is taken.")}
>>>>>>> development
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link 
                to="/signup" 
                className="px-6 py-3 text-sm font-semibold text-white bg-turf-primary hover:bg-emerald-700 rounded-xl transition-colors flex items-center gap-2"
              >
                <span>{t("Start assessment")}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a 
                href="#how-it-works" 
                className="px-6 py-3 text-sm font-semibold text-turf-text bg-turf-surface hover:bg-turf-surface-hover border border-turf-border rounded-xl transition-colors"
              >
                {t("See how it works")}
              </a>
            </div>

            {/* 3 Checkmark Trust Markers */}
            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-turf-border text-xs font-medium text-turf-text-muted">
              <div className="flex items-center gap-2">
<<<<<<< HEAD
                <CheckCircle2 className="w-4 h-4 text-turf-primary" />
                <span>Clear recommendations</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-turf-primary" />
                <span>Practical action plan</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-turf-primary" />
                <span>No guaranteed outcomes</span>
=======
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{t("Clear recommendations")}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{t("Practical action plan")}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{t("No guaranteed outcomes")}</span>
>>>>>>> development
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
      <section id="what-we-assess" className="py-16 bg-white border-b border-turf-border">
        <div className="max-w-7xl mx-auto px-6 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
<<<<<<< HEAD
            <span className="eyebrow">The three-way fit</span>
            <h2 className="text-2xl md:text-3xl font-bold text-turf-text">
              A business can look good on paper and still be wrong for you.
            </h2>
            <p className="text-xs text-turf-text-muted">
              We evaluate feasibility through three distinct, un-blended perspectives.
=======
            <span className="eyebrow">{t("THE THREE-WAY FIT")}</span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {t("A business can look good on paper and still be wrong for you.")}
            </h2>
            <p className="text-xs text-gray-600">
              {t("We evaluate feasibility through three distinct, un-blended perspectives.")}
>>>>>>> development
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-turf-surface border border-turf-border rounded-2xl p-6 space-y-3">
              <div className="text-xs font-bold text-turf-primary">01</div>
              <div className="p-3 rounded-xl bg-white border border-turf-border text-turf-primary w-fit">
                <Store className="w-6 h-6" />
              </div>
<<<<<<< HEAD
              <h3 className="text-base font-bold text-turf-text">Business ↔ Location</h3>
              <p className="text-xs text-turf-text-muted leading-relaxed">
                Is there sufficient unmet demand, local population, and road infrastructure in the 10km catchment?
=======
              <h3 className="text-base font-bold text-gray-900">{t("Business ↔ Location")}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {t("Is there sufficient unmet demand, local population, and road infrastructure in the 10km catchment?")}
>>>>>>> development
              </p>
            </div>

            <div className="bg-turf-surface border border-turf-border rounded-2xl p-6 space-y-3">
              <div className="text-xs font-bold text-turf-primary">02</div>
              <div className="p-3 rounded-xl bg-white border border-turf-border text-turf-primary w-fit">
                <UserCheck className="w-6 h-6" />
              </div>
<<<<<<< HEAD
              <h3 className="text-base font-bold text-turf-text">Person ↔ Business</h3>
              <p className="text-xs text-turf-text-muted leading-relaxed">
                Do you personally possess the skills, workspace, supplier links, and committed customers to run it?
=======
              <h3 className="text-base font-bold text-gray-900">{t("Person ↔ Business")}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {t("Do you personally possess the skills, workspace, supplier links, and committed customers to run it?")}
>>>>>>> development
              </p>
            </div>

            <div className="bg-turf-surface border border-turf-border rounded-2xl p-6 space-y-3">
              <div className="text-xs font-bold text-turf-primary">03</div>
              <div className="p-3 rounded-xl bg-white border border-turf-border text-turf-primary w-fit">
                <Wallet className="w-6 h-6" />
              </div>
<<<<<<< HEAD
              <h3 className="text-base font-bold text-turf-text">Person ↔ Finance</h3>
              <p className="text-xs text-turf-text-muted leading-relaxed">
                Can your monthly disposable income support loan EMI repayments without straining household expenses?
=======
              <h3 className="text-base font-bold text-gray-900">{t("Person ↔ Finance")}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {t("Can your monthly disposable income support loan EMI repayments without straining household expenses?")}
>>>>>>> development
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. 8-Item Feature Grid */}
      <section className="py-16 bg-white border-b border-turf-border">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
<<<<<<< HEAD
            <span className="eyebrow">Transparent advisory</span>
            <h2 className="text-2xl md:text-3xl font-bold text-turf-text">
              Every recommendation shows its reasoning.
            </h2>
            <p className="text-xs text-turf-text-muted">
              No black-box scoring. Every score comes with positive drivers and attention areas.
=======
            <span className="eyebrow">{t("TRANSPARENT ADVISORY")}</span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {t("Every recommendation shows its reasoning.")}
            </h2>
            <p className="text-xs text-gray-600">
              {t("No black-box scoring. Every score comes with positive drivers and attention areas.")}
>>>>>>> development
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featureGrid.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} className="p-5 rounded-2xl bg-white border border-turf-border hover:bg-turf-surface/40 transition-all space-y-2">
                  <div className="p-2.5 rounded-xl bg-turf-surface border border-turf-border w-fit text-turf-primary">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-turf-text">{feat.title}</h3>
                  <p className="text-xs text-turf-text-muted leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. How It Works */}
      <section id="how-it-works" className="py-16 bg-white border-b border-turf-border">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
<<<<<<< HEAD
            <span className="eyebrow">Simple 4-step process</span>
            <h2 className="text-2xl md:text-3xl font-bold text-turf-text">How it works</h2>
=======
            <span className="eyebrow">{t("SIMPLE 4-STEP PROCESS")}</span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{t("How it works")}</h2>
>>>>>>> development
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((st, idx) => (
              <div key={idx} className="bg-white border border-turf-border rounded-2xl p-6 space-y-3">
                <div className="w-8 h-8 rounded-full bg-turf-primary text-white flex items-center justify-center font-bold text-xs">
                  {st.step}
                </div>
                <h3 className="text-sm font-bold text-turf-text">{st.title}</h3>
                <p className="text-xs text-turf-text-muted leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Why This Matters Quote Callout */}
      <section id="why-it-matters" className="py-16 bg-turf-primary text-white">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
<<<<<<< HEAD
          <span className="eyebrow !text-white/80">Our mission</span>
          <blockquote className="text-xl md:text-2xl font-serif italic leading-relaxed">
            "Credit should support a good decision—not create an avoidable burden."
          </blockquote>
          <p className="text-xs text-white/90 max-w-xl mx-auto leading-relaxed">
            Taking a loan for an unviable business in a low-demand village creates severe debt distress. Udyam Gram helps rural entrepreneurs verify feasibility before signing loan documents.
=======
          <span className="eyebrow !text-blue-300">{t("OUR MISSION")}</span>
          <blockquote className="text-xl md:text-2xl font-serif italic text-blue-50 leading-relaxed">
            "{t("Credit should support a good decision—not create an avoidable burden.")}"
          </blockquote>
          <p className="text-xs text-blue-200 max-w-xl mx-auto leading-relaxed">
            {t("Taking a loan for an unviable business in a low-demand village creates severe debt distress. Udyam Gram helps rural entrepreneurs verify feasibility before signing loan documents.")}
>>>>>>> development
          </p>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="bg-turf-text text-white py-10 border-t border-turf-border text-xs">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo textClassName="text-lg font-bold text-white" />
<<<<<<< HEAD
          <div className="text-turf-border">SIH26091 · Hyper-Local Rural Business Feasibility Prototype</div>
          <div className="text-turf-border">&copy; 2026 Udyam Gram. All rights reserved.</div>
=======
          <div>{t("SIH26091 · Hyper-Local Rural Business Feasibility Prototype")}</div>
          <div>&copy; 2026 Udyam Gram. {t("All rights reserved.")}</div>
>>>>>>> development
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
