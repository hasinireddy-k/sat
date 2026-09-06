import React from 'react';
import { ViewTab } from '../../types/satquery';
import {
  Compass,
  Eye,
  GitCompare,
  Layers,
  Grid,
  History,
  FileCheck,
  Cpu,
  BarChart3
} from 'lucide-react';

interface NavbarProps {
  activeTab: ViewTab;
  setActiveTab: (tab: ViewTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const tabs: { id: ViewTab; label: string; icon: React.ElementType; tag?: string }[] = [
    { id: 'mission-control', label: 'Mission Control', icon: Compass },
    { id: 'scene-analysis', label: 'Scene Analysis', icon: Eye, tag: 'Single' },
    { id: 'change-detection', label: 'Change Detection', icon: GitCompare, tag: 'T1 vs T2' },
    { id: 'optical-sar', label: 'Optical + SAR', icon: Layers, tag: 'Fusion' },
    { id: 'gallery', label: 'Mission Gallery', icon: Grid },
    { id: 'history', label: 'Analysis History', icon: History },
    { id: 'reports', label: 'Reports', icon: FileCheck },
    { id: 'architecture', label: 'Architecture', icon: Cpu },
    { id: 'evaluation', label: 'Evaluation', icon: BarChart3, tag: 'SIH Bench' },
  ];

  return (
    <nav className="bg-slate-900/90 border-b border-slate-800/80 px-4">
      <div className="max-w-7xl mx-auto flex items-center space-x-1 overflow-x-auto py-2 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-900/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.tag && (
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                    isActive ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {tab.tag}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
