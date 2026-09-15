import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import Logo from '../components/common/Logo';
import LanguageSelector from '../components/common/LanguageSelector';
import { useAuth } from '../context/AuthContext';
import { LANGUAGES_LIST, useLanguage } from '../context/LanguageContext';
import api from '../api/client';

const DEFAULT_STATES = [
  "Maharashtra", "Uttar Pradesh", "Punjab", "Tamil Nadu", 
  "Karnataka", "Rajasthan", "West Bengal", "Bihar", "Gujarat", "Odisha"
];

const DEFAULT_DISTRICTS = {
  "Maharashtra": ["Pune", "Shirur", "Nagpur", "Nashik", "Mumbai"],
  "Uttar Pradesh": ["Baghpat", "Khekada", "Meerut", "Lucknow"],
  "Punjab": ["Moga", "Ludhiana", "Amritsar"],
  "Tamil Nadu": ["Erode", "Perundurai", "Chennai"],
  "Karnataka": ["Bengaluru Rural", "Devanahalli", "Mysuru"],
  "Rajasthan": ["Hanumangarh", "Sangaria", "Jaipur"],
  "West Bengal": ["Hooghly", "Singur", "Kolkata"],
  "Bihar": ["Nalanda", "Rajgir", "Patna"],
  "Gujarat": ["Ahmedabad", "Sanand", "Surat"],
  "Odisha": ["Jajpur", "Cuttack", "Bhubaneswar"]
};

export const SignupPage = () => {
  const { translate: t, setLang } = useLanguage();
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: '',
    mobile: '',
    email: '',
    password: '',
    confirm_password: '',
    preferred_language: 'en',
    state: 'Maharashtra',
    district: 'Pune',
    age_group: '25-34',
    education: 'Secondary',
    occupation: 'Self-employed',
    business_experience: '0-2 years'
  });

  const [states, setStates] = useState(DEFAULT_STATES);
  const [districts, setDistricts] = useState(DEFAULT_DISTRICTS["Maharashtra"]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch states from API with fallback
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const resp = await api.getStates();
        if (resp.data && resp.data.length > 0) {
          setStates(resp.data);
          setFormData(prev => ({ ...prev, state: resp.data[0] }));
        }
      } catch (err) {
        console.warn("Using default states list (API connection offline/loading):", err);
      }
    };
    fetchStates();
  }, []);

  // Fetch districts when state changes
  useEffect(() => {
    const fetchDistricts = async () => {
      if (formData.state) {
        try {
          const resp = await api.getDistricts(formData.state);
          if (resp.data && resp.data.length > 0) {
            setDistricts(resp.data);
            setFormData(prev => ({ ...prev, district: resp.data[0] }));
            return;
          }
        } catch (err) {
          console.warn("Using default district list for state:", formData.state);
        }
        const fallbackDist = DEFAULT_DISTRICTS[formData.state] || ["Pune", "District Center"];
        setDistricts(fallbackDist);
        setFormData(prev => ({ ...prev, district: fallbackDist[0] }));
      }
    };
    fetchDistricts();
  }, [formData.state]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match.');
      return;
    }

    if (!formData.state || !formData.district) {
      setError('Please select or enter your State and District.');
      return;
    }

    setLoading(true);
    try {
      await signup({
        full_name: formData.full_name,
        mobile: formData.mobile,
        email: formData.email,
        password: formData.password,
        preferred_language: formData.preferred_language,
        state: formData.state,
        district: formData.district,
        age_group: formData.age_group,
        education: formData.education,
        occupation: formData.occupation,
        business_experience: formData.business_experience
      });
      navigate('/dashboard');
    } catch (err) {
      console.error("Signup submission error:", err);
      const detailMsg = err.response?.data?.detail;
      if (detailMsg) {
        if (typeof detailMsg === 'string' && detailMsg.includes("already exists")) {
          setError("An account with this email address already exists. Click Log in below to access your account.");
        } else {
          setError(typeof detailMsg === 'string' ? detailMsg : 'Failed to create account. Please check inputs.');
        }
      } else {
        setError('Failed to create account. Please check inputs or try logging in.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex grid md:grid-cols-12">
      {/* Left Panel */}
      <div className="md:col-span-5 bg-turf-primary text-white p-8 md:p-12 flex flex-col justify-between hidden md:flex">
        <div>
          <Logo textClassName="text-xl font-bold text-white" />
          
          <div className="mt-16 space-y-6">
<<<<<<< HEAD
            <h2 className="text-2xl font-bold leading-snug text-white">
              Create your account to start evaluating business ideas.
=======
            <h2 className="text-2xl font-bold leading-snug text-blue-50">
              {t('Create your account to start evaluating business ideas.')}
>>>>>>> development
            </h2>

            <div className="space-y-3 text-xs text-white/90 font-medium">
              <div className="flex items-center gap-2.5">
<<<<<<< HEAD
                <CheckCircle2 className="w-4 h-4 text-turf-primary-light shrink-0" />
                <span>Instant village-level demand analysis</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-turf-primary-light shrink-0" />
                <span>Readiness preparation action plan</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-turf-primary-light shrink-0" />
                <span>Local legal office directory & checklists</span>
=======
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{t('Instant village-level demand analysis')}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{t('Readiness preparation action plan')}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{t('Local legal office directory & checklists')}</span>
>>>>>>> development
              </div>
            </div>
          </div>
        </div>

        {/* Footer Tag Requirement */}
        <div className="text-[11px] text-white/80 border-t border-white/20 pt-4">
          SIH26091 · Frontend Prototype
        </div>
      </div>

      {/* Right Panel (Form) */}
      <div className="md:col-span-7 p-6 sm:p-12 bg-white flex flex-col justify-center overflow-y-auto relative">
        <div className="absolute top-6 right-6">
          <LanguageSelector />
        </div>
        <div className="max-w-lg w-full mx-auto space-y-6">
          <div>
<<<<<<< HEAD
            <span className="eyebrow">Get started</span>
            <h2 className="text-2xl font-bold text-turf-text">Create your account</h2>
            <p className="text-xs text-turf-text-muted mt-1">
              Enter your details to generate personalized feasibility reports.
=======
            <span className="eyebrow">{t('GET STARTED')}</span>
            <h2 className="text-2xl font-bold text-gray-900">{t('Create your account')}</h2>
            <p className="text-xs text-gray-500 mt-1">
              {t('Enter your details to generate personalized feasibility reports.')}
>>>>>>> development
            </p>
          </div>

          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
<<<<<<< HEAD
                <label className="block text-xs font-semibold text-turf-text mb-1">Full name</label>
=======
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('Full Name')}</label>
>>>>>>> development
                <input
                  type="text"
                  required
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Kunal Ghadge"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-turf-border text-xs focus:outline-none focus:border-turf-primary bg-white text-turf-text"
                />
              </div>

              <div>
<<<<<<< HEAD
                <label className="block text-xs font-semibold text-turf-text mb-1">Mobile number</label>
=======
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('Mobile Number')}</label>
>>>>>>> development
                <input
                  type="tel"
                  required
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="9876543210"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-turf-border text-xs focus:outline-none focus:border-turf-primary bg-white text-turf-text stat-number"
                />
              </div>
            </div>

            <div>
<<<<<<< HEAD
              <label className="block text-xs font-semibold text-turf-text mb-1">Email address</label>
=======
              <label className="block text-xs font-semibold text-gray-700 mb-1">{t('Email Address')}</label>
>>>>>>> development
              <input
                type="email"
                required
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-turf-border text-xs focus:outline-none focus:border-turf-primary bg-white text-turf-text"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
<<<<<<< HEAD
                <label className="block text-xs font-semibold text-turf-text mb-1">Password</label>
=======
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('Password')}</label>
>>>>>>> development
                <input
                  type="password"
                  required
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-turf-border text-xs focus:outline-none focus:border-turf-primary bg-white text-turf-text"
                />
              </div>

              <div>
<<<<<<< HEAD
                <label className="block text-xs font-semibold text-turf-text mb-1">Confirm password</label>
=======
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('Confirm Password')}</label>
>>>>>>> development
                <input
                  type="password"
                  required
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-turf-border text-xs focus:outline-none focus:border-turf-primary bg-white text-turf-text"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
<<<<<<< HEAD
                <label className="block text-xs font-semibold text-turf-text mb-1">Preferred language</label>
                <select
                  name="preferred_language"
                  value={formData.preferred_language}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-turf-border text-xs bg-white focus:outline-none focus:border-turf-primary text-turf-text"
=======
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('Preferred Language')}</label>
                <select
                  name="preferred_language"
                  value={formData.preferred_language}
                  onChange={(e) => {
                    handleChange(e);
                    setLang(e.target.value);
                  }}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:border-primary-600 font-medium"
>>>>>>> development
                >
                  {LANGUAGES_LIST.map(item => (
                    <option key={item.code} value={item.code}>{item.native} ({item.code.toUpperCase()})</option>
                  ))}
                </select>
              </div>

              <div>
<<<<<<< HEAD
                <label className="block text-xs font-semibold text-turf-text mb-1">State</label>
=======
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('State')}</label>
>>>>>>> development
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-turf-border text-xs bg-white focus:outline-none focus:border-turf-primary text-turf-text"
                >
                  {states.map(s => <option key={s} value={s}>{t(s)}</option>)}
                </select>
              </div>

              <div>
<<<<<<< HEAD
                <label className="block text-xs font-semibold text-turf-text mb-1">District</label>
=======
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('District')}</label>
>>>>>>> development
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-turf-border text-xs bg-white focus:outline-none focus:border-turf-primary text-turf-text"
                >
                  {districts.map(d => <option key={d} value={d}>{t(d)}</option>)}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-turf-primary hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? t('Creating account...') : t('Create account')}
            </button>
          </form>

<<<<<<< HEAD
          <p className="text-center text-xs text-turf-text-muted">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-turf-primary hover:underline">
              Log in
=======
          <p className="text-center text-xs text-gray-500">
            {t('Already have an account?')} {" "}
            <Link to="/login" className="font-bold text-primary-600 hover:underline">
              {t('Log in')}
>>>>>>> development
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
