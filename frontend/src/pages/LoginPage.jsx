import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import Logo from '../components/common/Logo';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const LoginPage = () => {
  const { login } = useAuth();
  const { translate: t } = useLanguage();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex grid md:grid-cols-12">
      {/* Left Panel (Reassurance & Brand) */}
      <div className="md:col-span-5 bg-primary-800 text-white p-8 md:p-12 flex flex-col justify-between hidden md:flex">
        <div>
          <Logo textClassName="text-xl font-bold text-white" />
          
          <div className="mt-16 space-y-6">
            <h2 className="text-2xl font-bold leading-snug text-blue-50">
              {t('Understand the opportunity before you commit your savings or take a loan.')}
            </h2>

            <div className="space-y-3 text-xs text-blue-100 font-medium">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{t('Deterministic 3-way fit scoring')}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{t('Village-level market & competition mapping')}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{t('Reducing-balance EMI & scheme matching')}</span>
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
      <div className="md:col-span-7 p-6 sm:p-12 flex flex-col justify-center bg-white">
        <div className="max-w-md w-full mx-auto space-y-6">
          <div>
            <span className="eyebrow">{t('WELCOME BACK')}</span>
            <h2 className="text-2xl font-bold text-gray-900">{t('Log in to your account')}</h2>
            <p className="text-xs text-gray-500 mt-1">
              {t('Access your saved assessments, improvement plans, and legal advice.')}
            </p>
          </div>

          {/* Demo Hint Banner */}
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-900 leading-relaxed">
            <span className="font-bold block mb-0.5">{t('Demo Tip:')}</span>
            {t('Create a new account via Signup, or log in with any existing registered user credentials.')}
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">{t('Email Address')}</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-gray-700">{t('Password')}</label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Password reset link available in production."); }} className="text-xs font-medium text-primary-600 hover:underline">
                  {t('Forgot password?')}
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="remember" className="text-xs text-gray-600 font-medium">{t('Remember me')}</label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors disabled:opacity-50"
            >
              {loading ? t('Logging in...') : t('Log in')}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500">
            {t("Don't have an account yet?")} {" "}
            <Link to="/signup" className="font-bold text-primary-600 hover:underline">
              {t('Create account')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
