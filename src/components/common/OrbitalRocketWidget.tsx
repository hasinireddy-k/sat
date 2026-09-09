import React, { useState } from 'react';
import { Rocket, Sparkles, Radio, ChevronUp, ChevronDown } from 'lucide-react';

export const OrbitalRocketWidget: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isBoosting, setIsBoosting] = useState<boolean>(false);

  const handleBoost = () => {
    setIsBoosting(true);
    setTimeout(() => setIsBoosting(false), 1200);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 select-none font-mono">
      {/* Expanded Telemetry Card */}
      {isExpanded && (
        <div className="mb-2 w-64 bg-[#070c18]/95 backdrop-blur-xl border border-cyan-500/40 rounded-xl p-3 shadow-[0_0_30px_rgba(0,132,255,0.25)] text-xs space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-[10px]">
              <Radio className="w-3 h-3 animate-pulse" />
              <span>ORBITAL TELEMETRY</span>
            </div>
            <span className="text-[9px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
              NOMINAL
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-[9.5px]">
            <div className="bg-[#050811] p-1.5 rounded border border-slate-800">
              <span className="text-slate-500 block">ALTITUDE</span>
              <span className="text-slate-200 font-bold">542.4 km (LEO)</span>
            </div>
            <div className="bg-[#050811] p-1.5 rounded border border-slate-800">
              <span className="text-slate-500 block">VELOCITY</span>
              <span className="text-slate-200 font-bold">7.61 km/s</span>
            </div>
            <div className="bg-[#050811] p-1.5 rounded border border-slate-800">
              <span className="text-slate-500 block">INCLINATION</span>
              <span className="text-slate-200 font-bold">97.4° SSO</span>
            </div>
            <div className="bg-[#050811] p-1.5 rounded border border-slate-800">
              <span className="text-cyan-400 font-bold">X-BAND 8.2 GHz</span>
              <span className="text-slate-500 block">DOWNLINK LINK</span>
            </div>
          </div>

          <button
            onClick={handleBoost}
            className="w-full py-1 bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 text-[9.5px] rounded flex items-center justify-center gap-1 transition cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>PULSE ATTITUDE THRUSTERS</span>
          </button>
        </div>
      )}

      {/* Main Rocket Badge Button */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center gap-2.5 px-3 py-2 bg-[#060a14]/90 hover:bg-[#091022] backdrop-blur-xl border ${
            isBoosting ? 'border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.5)]' : 'border-cyan-500/30 hover:border-cyan-400 shadow-[0_0_20px_rgba(0,132,255,0.2)]'
          } rounded-full transition-all duration-200 cursor-pointer group`}
          title="Orbital Satellite Platform Telemetry (Click to inspect)"
        >
          {/* Rocket Icon with Thruster Flame Animation */}
          <div className="relative flex items-center justify-center">
            {/* Thruster Plume Flame Glow */}
            <div
              className={`absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-gradient-to-tr from-amber-500 to-rose-500 rounded-full blur-xs transition-opacity duration-150 ${
                isBoosting ? 'opacity-100 scale-150 animate-ping' : 'opacity-70 group-hover:opacity-100 group-hover:scale-125'
              }`}
            />
            <Rocket
              className={`w-4 h-4 text-cyan-400 transition-all duration-300 ${
                isBoosting
                  ? 'text-amber-300 -translate-y-1.5 translate-x-1.5 scale-110'
                  : 'group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan-300'
              }`}
            />
          </div>

          <div className="flex flex-col text-left pr-1">
            <span className="text-[10px] font-bold text-slate-200 tracking-wider flex items-center gap-1 group-hover:text-cyan-300 transition">
              <span>SAT-1 ORBITER</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </span>
            <span className="text-[8.5px] text-slate-400 tracking-tight">LEO 540 KM • ORBITAL SENSING</span>
          </div>

          <div className="text-slate-500 group-hover:text-slate-300 pl-0.5">
            {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
          </div>
        </button>
      </div>
    </div>
  );
};
