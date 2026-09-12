import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Eye, LogOut, CheckCircle2, Save, Edit3 } from 'lucide-react';
import TopBar from '../components/common/TopBar';
import Sidebar from '../components/common/Sidebar';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../api/client';

export const ProfilePage = () => {
  const { user, logout } = useAuth();
  const { lang, setLang, languagesList, t } = useLanguage();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: '',
    mobile: '',
    email: '',
    preferred_language: 'en',
    state: '',
    district: '',
    age_group: '25-34',
    education: 'Secondary',
    occupation: 'Self-employed',
    business_experience: '0-2 years'
  });

  const [saving, setSaving] = useState(false);

  // Accessibility settings (UI local state)
  const [accessibility, setAccessibility] = useState({
    textSize: localStorage.getItem('pref_text_size') || 'normal',
    highContrast: localStorage.getItem('pref_high_contrast') === 'true',
    reducedMotion: localStorage.getItem('pref_reduced_motion') === 'true'
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        full_name: user.full_name || '',
        mobile: user.mobile || '',
        email: user.email || '',
        preferred_language: user.preferred_language || 'en',
        state: user.state || 'Maharashtra',
        district: user.district || 'Pune',
        age_group: user.age_group || '25-34',
        education: user.education || 'Secondary',
        occupation: user.occupation || 'Self-employed',
        business_experience: user.business_experience || '0-2 years'
      });
    }
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateMe(profileData);
      setIsEditing(false);
    } catch (err) {
      console.error("Profile save error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleAccessibilityToggle = (key, val) => {
    const updated = { ...accessibility, [key]: val };
    setAccessibility(updated);
    localStorage.setItem(`pref_${key}`, val);
  };

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  const getInitials = (name) => {
    if (!name) return 'UG';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-white flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="User Profile" />

        <main className="p-6 md:p-10 max-w-5xl mx-auto w-full space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-turf-border pb-4">
            <div>
              <span className="eyebrow">Account</span>
              <h1 className="text-2xl font-bold text-turf-text">{t('User Profile')}</h1>
              <p className="text-xs text-turf-text-muted mt-0.5">Manage your personal details, language preferences, and accessibility settings.</p>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-turf-primary hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              <span>{isEditing ? t('Cancel editing') : t('Edit profile')}</span>
            </button>
          </div>

          <div className="grid md:grid-cols-12 gap-6">
            {/* Left Summary Card (Data Card Fill) */}
            <div className="md:col-span-4 bg-turf-surface border border-turf-border rounded-2xl p-6 text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-turf-primary text-white font-bold text-2xl flex items-center justify-center mx-auto">
                {getInitials(profileData.full_name)}
              </div>

              <div>
                <h3 className="text-base font-bold text-turf-text">{profileData.full_name || 'User'}</h3>
                <span className="text-xs font-semibold text-turf-primary bg-white border border-turf-border px-2.5 py-0.5 rounded-lg inline-block mt-1">
                  Rural Micro-Entrepreneur
                </span>
              </div>

              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-turf-primary bg-white px-3 py-1 rounded-xl border border-turf-border">
                  <CheckCircle2 className="w-4 h-4 text-turf-primary" />
                  <span>Profile Complete</span>
                </span>
              </div>
            </div>

            {/* Right Profile Details / Edit Form Card */}
            <div className="md:col-span-8 bg-white border border-turf-border rounded-2xl p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-turf-border pb-3">
                <h3 className="text-xs font-semibold text-turf-text">Profile details</h3>
                <span className="text-xs text-turf-text-muted">ID: {user?.id}</span>
              </div>

              {isEditing ? (
                <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-turf-text mb-1">Full name</label>
                      <input
                        type="text"
                        value={profileData.full_name}
                        onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-turf-border text-turf-text bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-turf-text mb-1">Mobile</label>
                      <input
                        type="text"
                        value={profileData.mobile}
                        onChange={(e) => setProfileData({ ...profileData, mobile: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-turf-border text-turf-text bg-white stat-number"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-turf-text mb-1">State</label>
                      <input
                        type="text"
                        value={profileData.state}
                        onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-turf-border text-turf-text bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-turf-text mb-1">District</label>
                      <input
                        type="text"
                        value={profileData.district}
                        onChange={(e) => setProfileData({ ...profileData, district: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-turf-border text-turf-text bg-white"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-2.5 bg-turf-primary hover:bg-emerald-700 text-white font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span>{saving ? "Saving..." : "Save changes"}</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid sm:grid-cols-2 gap-6 text-xs">
                  <div>
                    <span className="text-turf-text-muted font-medium block">Full name</span>
                    <span className="font-bold text-turf-text text-sm">{profileData.full_name}</span>
                  </div>

                  <div>
                    <span className="text-turf-text-muted font-medium block">Email address</span>
                    <span className="font-bold text-turf-text text-sm">{profileData.email}</span>
                  </div>

                  <div>
                    <span className="text-turf-text-muted font-medium block">Mobile number</span>
                    <span className="font-bold text-turf-text text-sm stat-number">{profileData.mobile}</span>
                  </div>

                  <div>
                    <span className="text-turf-text-muted font-medium block">Preferred language</span>
                    <span className="font-bold text-turf-text text-sm">
                      {languagesList.find(l => l.code === profileData.preferred_language)?.native || 'English'}
                    </span>
                  </div>

                  <div>
                    <span className="text-turf-text-muted font-medium block">State & district</span>
                    <span className="font-bold text-turf-text text-sm">{profileData.district}, {profileData.state}</span>
                  </div>

                  <div>
                    <span className="text-turf-text-muted font-medium block">Prior business experience</span>
                    <span className="font-bold text-turf-text text-sm">{profileData.business_experience}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Preferences Section */}
          <div className="bg-white border border-turf-border rounded-2xl p-6 md:p-8 space-y-6">
            <span className="eyebrow">Preferences & accessibility</span>
            <h2 className="text-xl font-bold text-turf-text">App Preferences</h2>

            <div className="space-y-4 divide-y divide-turf-border text-xs">
              {/* Language Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-turf-primary shrink-0" />
                  <div>
                    <div className="font-bold text-turf-text">App language</div>
                    <div className="text-turf-text-muted">English, Hindi and 7 more Indic languages supported</div>
                  </div>
                </div>

                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-turf-border font-semibold bg-white text-xs text-turf-text"
                >
                  {languagesList.map(l => (
                    <option key={l.code} value={l.code}>{l.native} ({l.name})</option>
                  ))}
                </select>
              </div>

              {/* Accessibility Preferences Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-turf-primary shrink-0" />
                  <div>
                    <div className="font-bold text-turf-text">Accessibility preferences</div>
                    <div className="text-turf-text-muted">High-contrast visuals and reduced animation settings</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 font-semibold text-turf-text">
                    <input
                      type="checkbox"
                      checked={accessibility.highContrast}
                      onChange={(e) => handleAccessibilityToggle('highContrast', e.target.checked)}
                      className="rounded border-turf-border text-turf-primary focus:ring-turf-primary"
                    />
                    <span>High contrast</span>
                  </label>

                  <label className="flex items-center gap-2 font-semibold text-turf-text">
                    <input
                      type="checkbox"
                      checked={accessibility.reducedMotion}
                      onChange={(e) => handleAccessibilityToggle('reducedMotion', e.target.checked)}
                      className="rounded border-turf-border text-turf-primary focus:ring-turf-primary"
                    />
                    <span>Reduced motion</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Sign Out Card */}
          <div className="bg-turf-surface border border-turf-border rounded-2xl p-6 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-turf-text">Sign Out of Account</h3>
              <p className="text-xs text-turf-text-muted mt-0.5">Clears active session token from browser local storage.</p>
            </div>

            <button
              onClick={handleSignOut}
              className="px-6 py-2.5 bg-gray-800 hover:bg-gray-900 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
