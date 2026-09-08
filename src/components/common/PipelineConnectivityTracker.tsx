import React from 'react';
import { Satellite, Database, Cpu, Compass, ShieldCheck, FileCheck2 } from 'lucide-react';

interface PipelineConnectivityTrackerProps {
  activeStage?: number; // 1 to 6
  compact?: boolean;
}

export const PipelineConnectivityTracker: React.FC<PipelineConnectivityTrackerProps> = ({
  activeStage = 1,
  compact = false,
}) => {
  const stages = [
    { id: 1, label: 'SATELLITE SENSOR', sub: 'Cartosat / RISAT / Sentinel', icon: Satellite, color: '#38bdf8' },
    { id: 2, label: 'EARTH OBS. DATA', sub: 'GeoTIFF / VNIR / C-Band', icon: Database, color: '#06b6d4' },
    { id: 3, label: 'AGENTIC ENGINE', sub: 'Intent & Modality Router', icon: Cpu, color: '#0ea5e9' },
    { id: 4, label: 'SPECIALIST MODEL', sub: 'BigEarthNet LoRA / VLM', icon: Compass, color: '#6366f1' },
    { id: 5, label: 'SPATIAL EVIDENCE', sub: 'UTM Bounds / Change Map', icon: ShieldCheck, color: '#10b981' },
    { id: 6, label: 'MISSION REPORT', sub: 'Intelligence Dossier', icon: FileCheck2, color: '#f59e0b' },
  ];

  return (
    <div className={`w-full bg-[#050811]/90 border border-slate-800/80 rounded-xl ${compact ? 'p-3' : 'p-5'} font-mono select-none relative overflow-hidden backdrop-blur-md shadow-xl`}>
      {/* Background scanline subtle sweep */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/[0.03] to-transparent animate-pulse pointer-events-none" />

      <div className="flex items-center justify-between mb-3 text-[10px] uppercase tracking-widest text-slate-400">
        <span className="flex items-center space-x-2 text-cyan-400 font-bold">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>REAL-TIME END-TO-END REMOTE SENSING PIPELINE</span>
        </span>
        <span className="text-slate-500">ISRO PS 26167 ARCHITECTURE</span>
      </div>

      <div className="relative flex items-center justify-between gap-1 overflow-x-auto py-2">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const isPassed = stage.id <= activeStage;
          const isCurrent = stage.id === activeStage;

          return (
            <React.Fragment key={stage.id}>
              {/* Node Card */}
              <div className="flex flex-col items-center min-w-[110px] text-center z-10 group">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-all duration-300 ${
                    isCurrent
                      ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.5)] scale-105'
                      : isPassed
                      ? 'border-slate-700 bg-slate-900 text-slate-300'
                      : 'border-slate-800/80 bg-slate-950 text-slate-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-[10px] font-bold mt-2 tracking-wider ${isCurrent ? 'text-cyan-300' : isPassed ? 'text-slate-200' : 'text-slate-600'}`}>
                  {stage.label}
                </span>
                {!compact && (
                  <span className="text-[8px] text-slate-500 tracking-tight mt-0.5 max-w-[100px] truncate">
                    {stage.sub}
                  </span>
                )}
              </div>

              {/* Connecting Pulse Line */}
              {idx < stages.length - 1 && (
                <div className="flex-1 min-w-[24px] max-w-[60px] h-[2px] relative flex items-center self-center my-auto -mt-4">
                  <div className="w-full h-[1px] bg-slate-800" />
                  <div
                    className="absolute inset-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                    style={{
                      animation: 'pulse-travel 2.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                      animationDelay: `${idx * 0.35}s`,
                    }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
