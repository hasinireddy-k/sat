import React from 'react';
import { ViewTab, UserProfile } from '../../types/satquery';
import {
  HelpCircle,
  Sliders,
  User,
  ArrowLeft,
  Globe
} from 'lucide-react';

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
  demoMode,
  setDemoMode,
  hasLoadedImages,
  onResetUpload,
  user
}) => {
  return (
    <header className="bg-[#0b0f19]/95 border-b border-slate-800/80 sticky top-0 z-50 text-slate-100 font-sans backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Brand Logo & Back Button */}
        <div className="flex items-center space-x-3">
          {hasLoadedImages && activeTab !== 'mission-control' && activeTab !== 'login' && (
            <button
              onClick={onResetUpload}
              className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-lg text-xs transition flex items-center space-x-1 font-mono"
              title="Upload new imagery"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Upload Scene</span>
            </button>
          )}

          {/* Refined Aerospace Geometric Logo */}
          <div
            onClick={onResetUpload}
            className="flex items-center space-x-2.5 cursor-pointer select-none group"
          >
            <div className="relative w-8 h-8 rounded bg-slate-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 transition shadow-sm">
              <Globe className="w-4 h-4 text-cyan-400" />
              <div className="absolute inset-0 rounded border border-cyan-400/20 rotate-45 pointer-events-none" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-sm tracking-tight text-slate-100 font-mono">
                  SATQUERY <span className="text-cyan-400 font-bold">AI</span>
                </span>
                <span className="text-[9px] font-mono bg-slate-900 text-slate-400 px-1.5 py-0.2 rounded border border-slate-800 uppercase">
                  ISRO SIH 26167
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block font-mono">
                Ask Earth Observation Data Anything.
              </span>
            </div>
          </div>
        </div>

        {/* Center Main Nav Tabs */}
        <nav className="hidden md:flex items-center space-x-1 text-xs font-mono">
          <button
            onClick={() => setActiveTab('mission-control')}
            className={`px-3 py-1.5 rounded border transition ${
              activeTab === 'mission-control'
                ? 'bg-slate-800 text-cyan-300 border-cyan-500/40 font-bold'
                : 'bg-transparent text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            MISSION CONTROL
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-3 py-1.5 rounded border transition ${
              activeTab === 'gallery'
                ? 'bg-slate-800 text-cyan-300 border-cyan-500/40 font-bold'
                : 'bg-transparent text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            MISSIONS
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded border transition ${
              activeTab === 'history'
                ? 'bg-slate-800 text-cyan-300 border-cyan-500/40 font-bold'
                : 'bg-transparent text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            HISTORY
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`px-3 py-1.5 rounded border transition ${
              activeTab === 'reports'
                ? 'bg-slate-800 text-cyan-300 border-cyan-500/40 font-bold'
                : 'bg-transparent text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            REPORTS
          </button>

          <button
            onClick={() => setActiveTab('help')}
            className={`px-3 py-1.5 rounded border transition ${
              activeTab === 'help'
                ? 'bg-slate-800 text-cyan-300 border-cyan-500/40 font-bold'
                : 'bg-transparent text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            HELP
          </button>
        </nav>

        {/* Right Status & Controls */}
        <div className="flex items-center space-x-3 text-xs">
          {/* Subtle System Status */}
          <div className="hidden sm:flex items-center space-x-1.5 font-mono text-[11px] bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-semibold uppercase">
              {demoMode ? 'DEMO MODE' : 'SYSTEM OPERATIONAL'}
            </span>
          </div>

          <button
            onClick={() => setActiveTab('settings')}
            className="p-1.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 rounded transition"
            title="Settings"
          >
            <Sliders className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveTab(user.isAuthenticated ? 'profile' : 'login')}
            className="flex items-center space-x-1.5 px-2.5 py-1 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded text-slate-200 transition font-mono"
          >
            <User className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline font-semibold">{user.isAuthenticated ? user.name.split(' ')[0] : 'Sign In'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

