import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Globe, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export const TopBar = ({ title = "Dashboard" }) => {
  const { user } = useAuth();
  const { lang, setLang, languagesList } = useLanguage();
  const [showBellMenu, setShowBellMenu] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'UG';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Current Page Title */}
      <h1 className="text-lg font-bold text-gray-900">{title}</h1>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Language Selector */}
        <div className="relative flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-700">
          <Globe className="w-4 h-4 text-gray-500" />
          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value)}
            className="bg-transparent text-xs font-semibold text-gray-800 outline-none cursor-pointer pr-1"
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
            className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary-600"></span>
          </button>

          {showBellMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg p-4 z-50 text-xs text-gray-500">
              <div className="font-semibold text-gray-900 border-b border-gray-100 pb-2 mb-2">Notifications</div>
              <div className="text-center py-4 text-gray-400">No new notifications</div>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            {getInitials(user?.full_name)}
          </div>
          <span className="text-xs font-semibold text-gray-800 hidden md:inline-block">
            {user?.full_name || 'User'}
          </span>
        </Link>
      </div>
    </header>
  );
};

export default TopBar;
