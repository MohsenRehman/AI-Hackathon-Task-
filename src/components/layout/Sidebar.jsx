import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Calendar, FileText, Brain, 
  Settings, LogOut, ChevronLeft, ChevronRight, Award, Crown, Megaphone
} from 'lucide-react';
import useUiStore from '../../store/uiStore.js';
import useAuthStore from '../../store/authStore.js';
import { useRole } from '../../hooks/useRole.js';
import { usePlan } from '../../hooks/usePlan.js';
import { ROLES } from '../../utils/constants.js';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarCollapsed, toggleSidebar } = useUiStore();
  const { user, clearAuth } = useAuthStore();
  const { role } = useRole();
  const { planName } = usePlan();

  const handleLogout = async () => {
    try {
      clearAuth();
      navigate('/login');
    } catch (e) {
      console.error(e);
    }
  };

  // Nav definitions
  const adminNav = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { label: 'Manage Users', icon: Users, path: '/admin/users' },
    { label: 'Marketing Hub', icon: Megaphone, path: '/admin/marketing' },
    { label: 'Analytics', icon: Crown, path: '/admin/analytics', isPremium: true },
    { label: 'System Logs', icon: Settings, path: '/admin/system' },
  ];

  const doctorNav = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/doctor/dashboard' },
    { label: 'Patients', icon: Users, path: '/doctor/patients' },
    { label: 'AI Diagnosis', icon: Brain, path: '/doctor/diagnosis', isPremium: true },
    { label: 'Prescriptions', icon: FileText, path: '/doctor/prescriptions' },
  ];

  const receptionistNav = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/receptionist/dashboard' },
    { label: 'Appointments', icon: Calendar, path: '/receptionist/appointments' },
  ];

  const patientNav = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/patient/dashboard' },
    { label: 'My Prescriptions', icon: FileText, path: '/patient/prescriptions' },
    { label: 'Appointments', icon: Calendar, path: '/patient/appointments' },
  ];

  const navs = {
    [ROLES.ADMIN]: adminNav,
    [ROLES.DOCTOR]: doctorNav,
    [ROLES.RECEPTIONIST]: receptionistNav,
    [ROLES.PATIENT]: patientNav,
  };

  const currentNav = navs[role] || [];

  return (
    <div 
      className={`fixed top-0 left-0 h-screen bg-slate-900 border-r border-slate-800 text-slate-300 z-40 transition-all duration-300 flex flex-col justify-between md:translate-x-0 ${
        sidebarCollapsed 
          ? 'w-16 -translate-x-full md:w-16' 
          : 'w-60 translate-x-0 md:w-60'
      }`}
    >
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between p-4 border-b border-slate-800 h-16">
          {!sidebarCollapsed && (
            <span className="text-xl font-bold font-display text-white tracking-wide">
              Cliniq<span className="text-primary-500">AI</span>
            </span>
          )}
          <button 
            onClick={toggleSidebar} 
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {currentNav.map((item, idx) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <button
                key={idx}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
                  isActive 
                    ? 'bg-primary-500 text-white shadow-md' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!sidebarCollapsed && (
                  <span className="flex-grow text-left flex items-center justify-between">
                    {item.label}
                    {item.isPremium && role !== ROLES.ADMIN && (
                      <span className="text-[10px] bg-medical-amber-light text-medical-amber font-extrabold uppercase px-1.5 py-0.5 rounded border border-amber-400/20">
                        PRO
                      </span>
                    )}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile Details */}
      <div className="p-3 border-t border-slate-800 space-y-3 bg-slate-950/40">
        {!sidebarCollapsed && user && (
          <div className="flex items-center gap-3 px-2">
            <div className="h-9 w-9 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold font-display text-sm border border-slate-700">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-grow min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user.name}</p>
              <div className="flex flex-col gap-1.5 items-start mt-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 border border-slate-700 px-1.5 py-0.5 rounded bg-slate-800">
                  {role === ROLES.ADMIN ? 'Unlimited Access' : `${planName} Plan`}
                </span>
                {role !== ROLES.ADMIN && planName === 'free' && (
                  <button 
                    onClick={() => navigate('/upgrade')}
                    className="text-[9px] text-primary-400 hover:text-white font-extrabold flex items-center gap-1 cursor-pointer bg-primary-500/10 border border-primary-500/20 px-1.5 py-0.5 rounded hover:bg-primary-500 transition-all duration-150 shrink-0"
                  >
                    Upgrade to Pro 🚀
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-red-950/20 hover:text-red-400 transition-colors duration-150 cursor-pointer`}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!sidebarCollapsed && <span className="text-left">Sign Out</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
