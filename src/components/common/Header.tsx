import React from 'react';
import { ViewTab, UserProfile } from '../../types/satquery';

interface HeaderProps {
  activeTab: ViewTab;
  setActiveTab: (tab: ViewTab) => void;
  demoMode: boolean;
  setDemoMode: (val: boolean) => void;
  hasLoadedImages: boolean;
  onResetUpload: () => void;
  user: UserProfile;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onResetUpload,
}) => {
  return (
    <aside className="w-[240px] flex-shrink-0 bg-black border-r border-white/10 flex flex-col h-screen sticky top-0 z-50">
      <div className="p-6">
        <a
          href="#"
          id="sidebar-logo-link"
          onClick={(e) => {
            e.preventDefault();
            onResetUpload();
            setActiveTab('mission-control');
          }}
          className="flex items-center gap-2 group"
        >
          <div className="w-8 h-8 bg-[#0084ff] flex items-center justify-center rounded-sm">
            <span className="text-white text-xl flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 7 9 3 5 7l4 4 4-4Z"/><path d="m17 11 4 4-4 4-4-4 4-4Z"/><path d="m8 12 4 4"/><path d="m13 17 3 3"/><path d="M7 18a4 4 0 0 0 4 4"/><path d="M3 14a8 8 0 0 1 8 8"/></svg>
            </span>
          </div>
          <span className="mono font-bold text-lg tracking-tighter text-white">SATQUERY AI</span>
        </a>
      </div>

      <nav className="flex-1 px-3 space-y-1 mt-4 font-sans">
        <div className="text-[10px] text-slate-500 uppercase tracking-widest px-3 mb-2 mono">Navigation</div>
        
        <a
          href="#"
          id="nav-mission-control"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('mission-control');
          }}
          className={`${
            activeTab === 'mission-control' ? 'nav-item-active' : 'nav-item-hover-dashed text-slate-400 hover:text-white'
          } flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-sm transition-colors duration-150`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
          <span>Mission Control</span>
        </a>

        <a
          href="#"
          id="nav-missions"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('gallery');
          }}
          className={`${
            activeTab === 'gallery' ? 'nav-item-active' : 'nav-item-hover-dashed text-slate-400 hover:text-white'
          } flex items-center gap-3 px-3 py-2 text-sm rounded-sm transition-all duration-150`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
          <span>Missions</span>
        </a>

        <a
          href="#"
          id="nav-history"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('history');
          }}
          className={`${
            activeTab === 'history' ? 'nav-item-active' : 'nav-item-hover-dashed text-slate-400 hover:text-white'
          } flex items-center gap-3 px-3 py-2 text-sm rounded-sm transition-all duration-150`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
          <span>Analysis History</span>
        </a>

        <a
          href="#"
          id="nav-reports"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('reports');
          }}
          className={`${
            activeTab === 'reports' ? 'nav-item-active' : 'nav-item-hover-dashed text-slate-400 hover:text-white'
          } flex items-center gap-3 px-3 py-2 text-sm rounded-sm transition-all duration-150`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
          <span>Reports</span>
        </a>

        <a
          href="#"
          id="nav-model-intelligence"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('architecture');
          }}
          className={`${
            activeTab === 'architecture' ? 'nav-item-active' : 'nav-item-hover-dashed text-slate-400 hover:text-white'
          } flex items-center gap-3 px-3 py-2 text-sm rounded-sm transition-all duration-150`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>
          <span>Model Intelligence</span>
        </a>

        <a
          href="#"
          id="nav-lab"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('evaluation');
          }}
          className={`${
            activeTab === 'evaluation' ? 'nav-item-active' : 'nav-item-hover-dashed text-slate-400 hover:text-white'
          } flex items-center gap-3 px-3 py-2 text-sm rounded-sm transition-all duration-150`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/></svg>
          <span>Evaluation Lab</span>
        </a>

        <div className="pt-8 pb-2 border-t border-white/10 mt-6 flex items-center justify-between px-3">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest mono">Systems</span>
        </div>

        <a
          href="#"
          id="nav-settings"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('settings');
          }}
          className={`${
            activeTab === 'settings' ? 'nav-item-active' : 'text-slate-400 hover:text-white'
          } flex items-center gap-3 px-3 py-2 text-sm rounded-sm transition-all duration-150`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
          <span>Settings</span>
        </a>

        <a
          href="#"
          id="nav-help"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('help');
          }}
          className={`${
            activeTab === 'help' ? 'nav-item-active' : 'text-slate-400 hover:text-white'
          } flex items-center gap-3 px-3 py-2 text-sm rounded-sm transition-all duration-150`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
          <span>Help Support</span>
        </a>

        <a
          href="#"
          id="nav-login"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('login');
          }}
          className={`${
            activeTab === 'login' ? 'nav-item-active text-cyan-300' : 'text-slate-400 hover:text-white'
          } flex items-center gap-3 px-3 py-2 text-sm rounded-sm transition-all duration-150`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>
          <span>Analyst Login</span>
        </a>
      </nav>

      <div className="p-4 border-t border-white/10 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 status-dot-glow"></span>
            </div>
            <span className="mono text-[10px] text-slate-400 uppercase tracking-widest">AI Engine Online</span>
          </div>
          <button
            onClick={() => setActiveTab('login')}
            className="text-[10px] font-mono text-cyan-400 hover:underline"
            title="Switch Analyst / Sign Out"
          >
            Switch
          </button>
        </div>
        <div className="text-[10px] font-mono text-slate-500 truncate">
          {user?.email || 'analyst@isro.gov.in'}
        </div>
      </div>
    </aside>
  );
};
