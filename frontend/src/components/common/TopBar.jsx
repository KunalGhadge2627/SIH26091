import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Globe } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export const TopBar = ({ title = "Dashboard" }) => {
  const { user } = useAuth();
  const { lang, setLang, languagesList, t } = useLanguage();
  const [showBellMenu, setShowBellMenu] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'UG';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header className="h-16 bg-white border-b border-turf-border px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Current Page Title */}
      <h1 className="text-lg font-bold text-turf-text">{t(title)}</h1>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Language Selector */}
        <div className="relative flex items-center gap-1.5 bg-turf-surface border border-turf-border rounded-xl px-3 py-1.5 text-xs text-turf-text">
          <Globe className="w-4 h-4 text-turf-primary shrink-0" />
          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value)}
            className="bg-transparent text-xs font-semibold text-turf-text outline-none cursor-pointer pr-1"
          >
            {languagesList.map((item) => (
              <option key={item.code} value={item.code}>
                {item.native} ({item.code.toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button 
            onClick={() => setShowBellMenu(!showBellMenu)}
            className="w-9 h-9 flex items-center justify-center rounded-full border border-turf-border text-turf-text-muted hover:text-turf-text hover:bg-turf-surface transition-colors relative"
            title={t('Notifications')}
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-turf-primary"></span>
          </button>

          {showBellMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-turf-border rounded-2xl p-4 z-50 text-xs text-turf-text-muted">
              <div className="font-semibold text-turf-text border-b border-turf-border pb-2 mb-2">{t('Notifications')}</div>
              <div className="text-center py-4 text-turf-text-muted">{t('No new notifications')}</div>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <Link to="/profile" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-full bg-turf-primary text-white flex items-center justify-center font-bold text-xs">
            {getInitials(user?.full_name)}
          </div>
          <span className="text-xs font-semibold text-turf-text hidden md:inline-block">
            {user?.full_name || 'User'}
          </span>
        </Link>
      </div>
    </header>
  );
};

export default TopBar;
