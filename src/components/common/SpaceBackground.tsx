import React from 'react';

export const SpaceBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 font-sans relative overflow-x-hidden selection:bg-cyan-500 selection:text-slate-950">
      {/* Subtle Aerospace Telemetry Grid Layer */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.025] bg-[linear-gradient(to_right,#0ea5e9_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e9_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" />

      {/* Orbit Geometry Lines */}
      <div className="fixed -top-48 -right-48 w-[750px] h-[750px] rounded-full border border-sky-500/10 pointer-events-none z-0" />
      <div className="fixed -bottom-48 -left-48 w-[850px] h-[850px] rounded-full border border-slate-700/15 pointer-events-none z-0" />

      {/* Corner Telemetry Micro-Labels */}
      <div className="fixed top-2 left-4 text-[9px] font-mono text-slate-600 pointer-events-none z-40 hidden lg:block tracking-widest uppercase">
        SYS.LOC: 17.3850° N, 78.4867° E | ORBIT PASS 0421
      </div>
      <div className="fixed top-2 right-4 text-[9px] font-mono text-slate-600 pointer-events-none z-40 hidden lg:block tracking-widest uppercase">
        GROUND STATION: ISRO ISRO-NRSC ACQ.01
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  );
};

