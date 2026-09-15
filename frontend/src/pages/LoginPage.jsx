import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import Logo from '../components/common/Logo';
import LanguageSelector from '../components/common/LanguageSelector';
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
    <div className="min-h-screen bg-white flex grid md:grid-cols-12">
      {/* Left Panel (Reassurance & Brand) */}
      <div className="md:col-span-5 bg-turf-primary text-white p-8 md:p-12 flex flex-col justify-between hidden md:flex">
        <div>
          <Logo textClassName="text-xl font-bold text-white" />
          
          <div className="mt-16 space-y-6">
<<<<<<< HEAD
            <h2 className="text-2xl font-bold leading-snug text-white">
              Understand the opportunity before you commit your savings or take a loan.
=======
            <h2 className="text-2xl font-bold leading-snug text-blue-50">
              {t('Understand the opportunity before you commit your savings or take a loan.')}
>>>>>>> development
            </h2>

            <div className="space-y-3 text-xs text-white/90 font-medium">
              <div className="flex items-center gap-2.5">
<<<<<<< HEAD
                <CheckCircle2 className="w-4 h-4 text-turf-primary-light shrink-0" />
                <span>Deterministic 3-way fit scoring</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-turf-primary-light shrink-0" />
                <span>Village-level market & competition mapping</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-turf-primary-light shrink-0" />
                <span>Reducing-balance EMI & scheme matching</span>
=======
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
      <div className="md:col-span-7 p-6 sm:p-12 flex flex-col justify-center bg-white relative">
        <div className="absolute top-6 right-6">
          <LanguageSelector />
        </div>
        <div className="max-w-md w-full mx-auto space-y-6">
          <div>
<<<<<<< HEAD
            <span className="eyebrow">Welcome back</span>
            <h2 className="text-2xl font-bold text-turf-text">Log in to your account</h2>
            <p className="text-xs text-turf-text-muted mt-1">
              Access your saved assessments, improvement plans, and legal advice.
=======
            <span className="eyebrow">{t('WELCOME BACK')}</span>
            <h2 className="text-2xl font-bold text-gray-900">{t('Log in to your account')}</h2>
            <p className="text-xs text-gray-500 mt-1">
              {t('Access your saved assessments, improvement plans, and legal advice.')}
>>>>>>> development
            </p>
          </div>

          {/* Demo Hint Banner */}
<<<<<<< HEAD
          <div className="p-3.5 bg-turf-surface border border-turf-border rounded-xl text-xs text-turf-text leading-relaxed">
            <span className="font-semibold block mb-0.5">Demo Tip:</span>
            Create a new account via Signup, or log in with any existing registered user credentials.
=======
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-900 leading-relaxed">
            <span className="font-bold block mb-0.5">{t('Demo Tip:')}</span>
            {t('Create a new account via Signup, or log in with any existing registered user credentials.')}
>>>>>>> development
          </div>

          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
<<<<<<< HEAD
              <label className="block text-xs font-semibold text-turf-text mb-1">Email address</label>
=======
              <label className="block text-xs font-semibold text-gray-700 mb-1">{t('Email Address')}</label>
>>>>>>> development
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-turf-border text-xs focus:outline-none focus:border-turf-primary bg-white text-turf-text"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
<<<<<<< HEAD
                <label className="text-xs font-semibold text-turf-text">Password</label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Password reset link available in production."); }} className="text-xs font-semibold text-turf-primary hover:underline">
                  Forgot password?
=======
                <label className="text-xs font-semibold text-gray-700">{t('Password')}</label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Password reset link available in production."); }} className="text-xs font-medium text-primary-600 hover:underline">
                  {t('Forgot password?')}
>>>>>>> development
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-turf-border text-xs focus:outline-none focus:border-turf-primary bg-white text-turf-text pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-turf-text-muted hover:text-turf-text"
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
                className="rounded border-turf-border text-turf-primary focus:ring-turf-primary"
              />
<<<<<<< HEAD
              <label htmlFor="remember" className="text-xs text-turf-text-muted font-medium">Remember me</label>
=======
              <label htmlFor="remember" className="text-xs text-gray-600 font-medium">{t('Remember me')}</label>
>>>>>>> development
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-turf-primary hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? t('Logging in...') : t('Log in')}
            </button>
          </form>

<<<<<<< HEAD
          <p className="text-center text-xs text-turf-text-muted">
            Don't have an account yet?{" "}
            <Link to="/signup" className="font-bold text-turf-primary hover:underline">
              Create account
=======
          <p className="text-center text-xs text-gray-500">
            {t("Don't have an account yet?")} {" "}
            <Link to="/signup" className="font-bold text-primary-600 hover:underline">
              {t('Create account')}
>>>>>>> development
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
