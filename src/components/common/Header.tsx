import React from 'react';
import { ViewTab, UserProfile } from '../../types/satquery';
import { LogOut, User } from 'lucide-react';

interface HeaderProps {
  activeTab: ViewTab;
  setActiveTab: (tab: ViewTab) => void;
  demoMode: boolean;
  setDemoMode: (val: boolean) => void;
  hasLoadedImages: boolean;
  onResetUpload: () => void;
  user: UserProfile;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onResetUpload,
  user,
  onLogout,
}) => {
  return (
    <aside className="w-[240px] flex-shrink-0 bg-[#050811]/92 backdrop-blur-xl border-r border-cyan-500/20 flex flex-col h-screen sticky top-0 z-50 select-none">
      {/* Brand Header */}
      <div className="p-5 pb-4 border-b border-white/5">
        <a
          href="#"
          id="sidebar-logo-link"
          onClick={(e) => {
            e.preventDefault();
            onResetUpload();
            setActiveTab('mission-control');
          }}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-[#0084ff] to-cyan-500 flex items-center justify-center rounded-lg shadow-[0_0_12px_rgba(0,132,255,0.4)]">
            <span className="text-white text-xl flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 7 9 3 5 7l4 4 4-4Z"/><path d="m17 11 4 4-4 4-4-4 4-4Z"/><path d="m8 12 4 4"/><path d="m13 17 3 3"/><path d="M7 18a4 4 0 0 0 4 4"/><path d="M3 14a8 8 0 0 1 8 8"/></svg>
            </span>
          </div>
          <div>
            <span className="mono font-bold text-base tracking-wider text-white block leading-tight">SATQUERY AI</span>
            <span className="text-[9px] font-mono text-cyan-400 tracking-widest block uppercase">ISRO PS 26167</span>
          </div>
        </a>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 space-y-1 mt-3 font-sans overflow-y-auto">
        <div className="text-[10px] text-slate-500 uppercase tracking-widest px-3 mb-2 mono">Navigation</div>
        
        <a
          href="#"
          id="nav-mission-control"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('mission-control');
          }}
          className={`${
            activeTab === 'mission-control' ? 'nav-item-active text-white' : 'nav-item-hover-dashed text-slate-400 hover:text-white'
          } flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
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
            activeTab === 'gallery' ? 'nav-item-active text-white' : 'nav-item-hover-dashed text-slate-400 hover:text-white'
          } flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-150`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
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
            activeTab === 'history' ? 'nav-item-active text-white' : 'nav-item-hover-dashed text-slate-400 hover:text-white'
          } flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-150`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
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
            activeTab === 'reports' ? 'nav-item-active text-white' : 'nav-item-hover-dashed text-slate-400 hover:text-white'
          } flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-150`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
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
            activeTab === 'architecture' ? 'nav-item-active text-white' : 'nav-item-hover-dashed text-slate-400 hover:text-white'
          } flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-150`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>
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
            activeTab === 'evaluation' ? 'nav-item-active text-white' : 'nav-item-hover-dashed text-slate-400 hover:text-white'
          } flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-150`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/></svg>
          <span>Evaluation Lab</span>
        </a>

        <div className="pt-4 pb-1.5 border-t border-white/5 mt-4 flex items-center justify-between px-3">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest mono">Systems</span>
        </div>

        <a
          href="#"
          id="nav-profile"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('profile');
          }}
          className={`${
            activeTab === 'profile' ? 'nav-item-active text-white' : 'text-slate-400 hover:text-white'
          } flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-150`}
        >
          <User className="w-4 h-4 text-cyan-400" />
          <span>Profile & Account</span>
        </a>

        <a
          href="#"
          id="nav-settings"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('settings');
          }}
          className={`${
            activeTab === 'settings' ? 'nav-item-active text-white' : 'text-slate-400 hover:text-white'
          } flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-150`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
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
            activeTab === 'help' ? 'nav-item-active text-white' : 'text-slate-400 hover:text-white'
          } flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-150`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
          <span>Help Support</span>
        </a>
      </nav>

      {/* Sidebar Footer with Status, Clean User Badge, and Single Sign Out */}
      <div className="p-3.5 border-t border-white/10 space-y-2.5">
        {/* System Status Banner */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 status-dot-glow"></span>
            </div>
            <span className="mono text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">AI Engine Online</span>
          </div>
          <span className="mono text-[9px] text-slate-500">v2.6</span>
        </div>

        {/* User Profile Card with Direct Click to Profile */}
        <div className="bg-[#070c18]/90 border border-slate-800/90 rounded-lg p-2.5 space-y-2 font-mono">
          <div 
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-2.5 cursor-pointer group hover:bg-slate-900/60 p-1 rounded transition"
            title="View Profile & Account"
          >
            <div className="w-7 h-7 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold text-xs shrink-0">
              {user.name ? user.name.charAt(0) : 'A'}
            </div>
            <div className="truncate flex-1 min-w-0">
              <div className="text-[10px] text-cyan-400 font-bold truncate group-hover:text-cyan-300 transition">
                {user.role || 'Analyst'}
              </div>
              <div className="text-[9px] text-slate-400 truncate" title={user.email}>
                {user.email}
              </div>
            </div>
          </div>

          {/* Single Dedicated Sign Out Button */}
          <button
            onClick={onLogout}
            className="w-full py-1.5 bg-rose-950/40 hover:bg-rose-900/80 border border-rose-800/50 hover:border-rose-600 text-rose-300 rounded text-[10px] font-mono flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm"
            title="Sign Out of Session"
          >
            <LogOut className="w-3 h-3" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
