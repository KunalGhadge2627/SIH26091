import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import Logo from '../components/common/Logo';
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
  const { translate: t } = useLanguage();
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
    <div className="min-h-screen bg-gray-50 flex grid md:grid-cols-12">
      {/* Left Panel */}
      <div className="md:col-span-5 bg-primary-800 text-white p-8 md:p-12 flex flex-col justify-between hidden md:flex">
        <div>
          <Logo textClassName="text-xl font-bold text-white" />
          
          <div className="mt-16 space-y-6">
            <h2 className="text-2xl font-bold leading-snug text-blue-50">
              {t('Create your account to start evaluating business ideas.')}
            </h2>

            <div className="space-y-3 text-xs text-blue-100 font-medium">
              <div className="flex items-center gap-2.5">
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
              </div>
            </div>
          </div>
        </div>

        {/* Footer Tag Requirement */}
        <div className="text-[11px] font-mono text-blue-300 border-t border-blue-700/50 pt-4">
          SIH26091 · Frontend Prototype
        </div>
      </div>

      {/* Right Panel (Form) */}
      <div className="md:col-span-7 p-6 sm:p-12 bg-white flex flex-col justify-center overflow-y-auto">
        <div className="max-w-lg w-full mx-auto space-y-6">
          <div>
            <span className="eyebrow">{t('GET STARTED')}</span>
            <h2 className="text-2xl font-bold text-gray-900">{t('Create your account')}</h2>
            <p className="text-xs text-gray-500 mt-1">
              {t('Enter your details to generate personalized feasibility reports.')}
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('Full Name')}</label>
                <input
                  type="text"
                  required
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Kunal Ghadge"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-primary-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('Mobile Number')}</label>
                <input
                  type="tel"
                  required
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="9876543210"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-primary-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">{t('Email Address')}</label>
              <input
                type="email"
                required
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-primary-600"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('Password')}</label>
                <input
                  type="password"
                  required
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-primary-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('Confirm Password')}</label>
                <input
                  type="password"
                  required
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-primary-600"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('Preferred Language')}</label>
                <select
                  name="preferred_language"
                  value={formData.preferred_language}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:border-primary-600"
                >
                  {LANGUAGES_LIST.map(lang => (
                    <option key={lang.code} value={lang.code}>{lang.native}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('State')}</label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:border-primary-600 font-medium"
                >
                  {states.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('District')}</label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:border-primary-600 font-medium"
                >
                  {districts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? t('Creating account...') : t('Create account')}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500">
            {t('Already have an account?')} {" "}
            <Link to="/login" className="font-bold text-primary-600 hover:underline">
              {t('Log in')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
