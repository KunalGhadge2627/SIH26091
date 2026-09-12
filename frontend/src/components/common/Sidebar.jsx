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
  const { t } = useLanguage();

  const navItems = [
    { path: '/dashboard', label: t('Dashboard'), icon: LayoutDashboard },
    { path: '/assessment/new', label: t('New Assessment'), icon: PlusCircle, highlight: true },
    { path: '/reports', label: t('Reports History'), icon: FileText },
    { path: '/improvement-plan', label: t('Improvement Plan'), icon: CheckSquare },
    { path: '/alternatives', label: t('Business Alternatives'), icon: Layers },
    { path: '/financial-plan', label: t('Financial Plan'), icon: Wallet },
    { path: '/legal-advice', label: t('Legal Advice'), icon: Scale },
    { path: '/profile', label: t('Profile'), icon: User },
  ];

  return (
    <aside className="w-64 bg-white border-r border-turf-border flex flex-col justify-between h-screen sticky top-0 shrink-0 z-40">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-turf-border">
          <Logo />
          <p className="text-xs text-turf-text-muted mt-1">Rural Feasibility & Literacy</p>
        </div>

        {/* Section Eyebrow */}
        <div className="px-6 pt-5 pb-2">
          <span className="eyebrow">{t('Decision tools')}</span>
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
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-turf-surface text-turf-primary font-bold border border-turf-border'
                      : item.highlight
                      ? 'text-turf-primary bg-turf-surface/60 hover:bg-turf-surface font-semibold'
                      : 'text-turf-text-muted hover:bg-turf-surface/40 hover:text-turf-text'
                  }`
                }
              >
                <Icon className={`w-4 h-4 ${item.highlight ? 'text-turf-primary' : ''}`} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Pinned Callout & Logout */}
      <div className="p-4 border-t border-turf-border space-y-3">
        <div className="bg-turf-surface border border-turf-border rounded-2xl p-3.5 text-xs text-turf-text">
          <div className="flex items-center gap-1.5 font-semibold text-turf-primary mb-1">
            <Info className="w-4 h-4 text-turf-primary shrink-0" />
            <span>{t('Prototype data')}</span>
          </div>
          <p className="leading-relaxed text-[11px] text-turf-text-muted">
            Recommendations use prototype data and do not guarantee business success.
          </p>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-turf-text-muted hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>{t('Sign Out')}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
