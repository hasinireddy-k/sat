import React, { useState } from 'react';
import { ChangeDetectionArea, GeoMetadata } from '../../types/satquery';
import { Sliders, Layers, Sparkles, AlertTriangle, ArrowRightLeft, ShieldAlert } from 'lucide-react';

interface SplitSliderViewerProps {
  t1Src: string;
  t2Src: string;
  t1Meta?: GeoMetadata;
  t2Meta?: GeoMetadata;
  changeAreas?: ChangeDetectionArea[];
}

export const SplitSliderViewer: React.FC<SplitSliderViewerProps> = ({
  t1Src,
  t2Src,
  t1Meta,
  t2Meta,
  changeAreas = []
}) => {
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [showOverlay, setShowOverlay] = useState<boolean>(true);
  const [activeArea, setActiveArea] = useState<ChangeDetectionArea | null>(null);

  return (
    <div className="bg-slate-950 border border-cyan-900/40 rounded-xl overflow-hidden shadow-2xl flex flex-col space-y-2">
      {/* Header Controls */}
      <div className="bg-slate-900/90 px-4 py-2 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-2">
          <ArrowRightLeft className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-slate-200">Synchronized Bitemporal Viewer (T1 vs T2)</span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowOverlay(!showOverlay)}
            className={`px-3 py-1 rounded text-xs font-medium font-mono flex items-center space-x-1.5 transition ${
              showOverlay
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Change Heatmap Overlay ({showOverlay ? 'ON' : 'OFF'})</span>
          </button>
        </div>
      </div>

      {/* Main Split Slider Canvas Stage */}
      <div className="relative h-[420px] bg-slate-950 overflow-hidden select-none">
        {/* T1 Base Image (Left side) */}
        <div className="absolute inset-0">
          <img src={t1Src} alt="T1 Pre-Event" className="w-full h-full object-cover" />
          <div className="absolute top-3 left-3 bg-slate-950/80 border border-slate-700 px-2.5 py-1 rounded font-mono text-xs text-slate-300 backdrop-blur-md">
            T1: PRE-EVENT ({t1Meta?.acquisitionDate || '12-APR-2025'})
          </div>
        </div>

        {/* T2 Overlay Image (Right side - clipped by slider position) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPos}%` }}
        >
          <img
            src={t2Src}
            alt="T2 Post-Event"
            className="absolute top-0 left-0 h-full object-cover"
            style={{ width: '100vw', maxWidth: 'none' }} // Ensure image lines up strictly with T1
          />
          <div className="absolute top-3 right-3 bg-cyan-950/90 border border-cyan-500/50 px-2.5 py-1 rounded font-mono text-xs text-cyan-300 backdrop-blur-md">
            T2: POST-EVENT ({t2Meta?.acquisitionDate || '28-JUL-2025'})
          </div>

          {/* Change Area Hotspot Markers */}
          {showOverlay &&
            changeAreas.map((ca) => {
              const [xMin, yMin, xMax, yMax] = ca.box;
              const severityColor =
                ca.changeSeverity === 'high'
                  ? '#EF4444'
                  : ca.changeSeverity === 'medium'
                  ? '#F59E0B'
                  : '#06B6D4';

              return (
                <div
                  key={ca.id}
                  onClick={() => setActiveArea(ca)}
                  className="absolute border-2 border-dashed rounded cursor-pointer transition-all animate-pulse"
                  style={{
                    left: `${xMin}%`,
                    top: `${yMin}%`,
                    width: `${xMax - xMin}%`,
                    height: `${yMax - yMin}%`,
                    borderColor: severityColor,
                    backgroundColor: `${severityColor}22`,
                  }}
                >
                  <div
                    className="absolute -top-5 left-0 px-1.5 py-0.2 rounded text-[9px] font-mono font-bold text-slate-950"
                    style={{ backgroundColor: severityColor }}
                  >
                    {ca.label}
                  </div>
                </div>
              );
            })}
        </div>

        {/* Vertical Divider Slider Handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.8)] cursor-ew-resize z-30 flex items-center justify-center"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="w-7 h-7 rounded-full bg-slate-950 border-2 border-cyan-400 text-cyan-400 flex items-center justify-center shadow-lg -ml-[1px]">
            <Sliders className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Range Slider Control Input overlay */}
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPos}
          onChange={(e) => setSliderPos(Number(e.target.value))}
          className="absolute inset-0 opacity-0 cursor-ew-resize z-40 w-full h-full"
        />
      </div>

      {/* Active Area Details Banner */}
      {activeArea && (
        <div className="bg-slate-900/90 border border-slate-800 p-3 mx-3 my-1 rounded-lg flex items-center justify-between text-xs font-mono text-slate-200">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <div>
              <strong className="text-cyan-300">{activeArea.label}</strong>
              <span className="text-slate-400 ml-2">({activeArea.description})</span>
            </div>
          </div>
          <div className="text-cyan-400 font-bold">
            {(activeArea.areaSqMeters / 10000).toFixed(2)} Hectares
          </div>
        </div>
      )}
    </div>
  );
};
