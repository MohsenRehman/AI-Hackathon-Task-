import React from 'react';
import { Sun, Moon, Bell, Menu } from 'lucide-react';
import useUiStore from '../../store/uiStore.js';
import { useAuth } from '../../hooks/useAuth.js';

const Navbar = ({ title }) => {
  const { theme, toggleTheme, toggleSidebar } = useUiStore();
  const { user } = useAuth();

  return (
    <header className="h-16 border-b border-surface-border bg-white flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button 
          onClick={toggleSidebar} 
          className="p-2 rounded-lg hover:bg-slate-50 border border-surface-border text-slate-500 hover:text-slate-700 md:hidden transition-colors cursor-pointer"
        >
          <Menu className="h-4 w-4" />
        </button>
        <h2 className="text-xl font-bold font-display text-slate-800 tracking-tight">
          {title || 'CliniqAI Dashboard'}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Toggle Theme */}
        <button 
          onClick={toggleTheme} 
          className="p-2 rounded-lg hover:bg-slate-50 border border-surface-border text-slate-500 hover:text-slate-700 transition-colors"
        >
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>

        {/* Notifications */}
        <button 
          className="p-2 rounded-lg hover:bg-slate-50 border border-surface-border text-slate-500 hover:text-slate-700 relative transition-colors"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-medical-red animate-pulse"></span>
        </button>

        <div className="h-8 w-px bg-surface-border"></div>

        {/* User Card */}
        {user && (
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 bg-primary-100 text-primary-700 font-bold rounded-full flex items-center justify-center text-sm uppercase">
              {user.name?.charAt(0)}
            </div>
            <div className="text-left hidden md:block">
              <p className="text-xs font-bold text-slate-800 leading-none">{user.name}</p>
              <span className="text-[10px] text-slate-400 capitalize">{user.role}</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
