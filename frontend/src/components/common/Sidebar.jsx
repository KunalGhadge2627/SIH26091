import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, PlusCircle, FileText, CheckSquare, 
  Layers, Wallet, Scale, User, Info, LogOut
} from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export const Sidebar = () => {
  const { logout } = useAuth();
  const { translate: t } = useLanguage();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/assessment/new', label: 'New Assessment', icon: PlusCircle, highlight: true },
    { path: '/reports', label: 'Reports History', icon: FileText },
    { path: '/improvement-plan', label: 'Improvement Plan', icon: CheckSquare },
    { path: '/alternatives', label: 'Business Alternatives', icon: Layers },
    { path: '/financial-plan', label: 'Financial Plan', icon: Wallet },
    { path: '/legal-advice', label: 'Legal Advice', icon: Scale },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between h-screen sticky top-0 shrink-0 z-40">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-gray-100">
          <Logo />
          <p className="text-[11px] text-gray-500 mt-1">{t('Rural Feasibility & Literacy')}</p>
        </div>

        {/* Section Eyebrow */}
        <div className="px-6 pt-5 pb-2">
          <span className="eyebrow">{t('DECISION TOOLS')}</span>
        </div>

        {/* Nav Links */}
        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 font-bold border border-primary-100 shadow-xs'
                      : item.highlight
                      ? 'text-primary-600 bg-blue-50/50 hover:bg-blue-50'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <Icon className={`w-4 h-4 ${item.highlight ? 'text-primary-600' : ''}`} />
                <span>{t(item.label)}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Pinned Callout & Logout */}
      <div className="p-4 border-t border-gray-100 space-y-3">
        <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 text-[11px] text-amber-900">
          <div className="flex items-center gap-1.5 font-bold text-amber-800 uppercase tracking-wider mb-1">
            <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>{t('PROTOTYPE DATA')}</span>
          </div>
          <p className="leading-tight text-[10.5px] text-amber-800">
            {t('Recommendations use prototype data and do not guarantee business success.')}
          </p>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>{t('Sign Out')}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
