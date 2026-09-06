import React from 'react';
import { ViewTab, DemoMission } from '../../types/satquery';
import { DEMO_MISSIONS } from '../../data/demoMissions';
import {
  Satellite,
  Radio,
  Eye,
  GitCompare,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Activity,
  Compass
} from 'lucide-react';

interface MissionControlViewProps {
  setActiveTab: (tab: ViewTab) => void;
  onSelectMission: (mission: DemoMission) => void;
}

export const MissionControlView: React.FC<MissionControlViewProps> = ({
  setActiveTab,
  onSelectMission
}) => {
  return (
    <div className="space-y-8 pb-12">
      {/* MAIN HERO */}
      <section className="relative rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 border border-cyan-900/40 p-8 md:p-12 overflow-hidden shadow-2xl">
        {/* Background Orbital Lines Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>ISRO SIH 2026 Problem Statement 26167</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-teal-200 to-indigo-300">
              SATQUERY AI
            </span>
            "Ask Earth Observation Data Anything."
          </h1>

          <p className="text-sm md:text-base text-slate-300 leading-relaxed font-sans">
            An autonomous agentic vision-language assistant for remote sensing imagery. Upload GeoTIFF/TIFF or benchmark images and query in natural language. The system automatically classifies intent, selects specialized AI models, extracts visual evidence, and generates auditable execution traces.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => setActiveTab('scene-analysis')}
              className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg shadow-cyan-500/25 flex items-center space-x-2"
            >
              <Eye className="w-4 h-4 text-slate-950" />
              <span>Start Scene Analysis</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>

            <button
              onClick={() => setActiveTab('gallery')}
              className="px-6 py-3 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-semibold rounded-xl text-sm transition flex items-center space-x-2"
            >
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>Explore Precomputed Missions</span>
            </button>
          </div>
        </div>
      </section>

      {/* THREE MAIN WORKSPACE MODES */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2 font-mono">
            <Layers className="w-5 h-5 text-cyan-400" />
            <span>PRIMARY ANALYSIS WORKBENCHES</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">Select a workflow mode to begin</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Mode A: Single Image */}
          <div
            onClick={() => setActiveTab('scene-analysis')}
            className="group bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-6 transition cursor-pointer flex flex-col justify-between space-y-4 shadow-xl backdrop-blur-sm relative overflow-hidden"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition">
                <Eye className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold">MODE A</span>
                <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition">
                  SINGLE IMAGE ANALYSIS
                </h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                VQA, scene description, and text-guided region grounding on single GeoTIFF/TIFF scenes.
              </p>
              <div className="space-y-1 font-mono text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <div className="text-cyan-400">Sample Queries:</div>
                <div>• "What is visible in this scene?"</div>
                <div>• "Identify major land-cover types."</div>
                <div>• "Where are the solar panel arrays?"</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-mono font-bold text-cyan-400 group-hover:translate-x-1 transition pt-2 border-t border-slate-800">
              <span>Launch Single Image Workbench</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Mode B: Optical + SAR */}
          <div
            onClick={() => setActiveTab('optical-sar')}
            className="group bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/50 rounded-2xl p-6 transition cursor-pointer flex flex-col justify-between space-y-4 shadow-xl backdrop-blur-sm relative overflow-hidden"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-950 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-purple-400 font-bold">MODE B</span>
                <h3 className="text-base font-bold text-slate-100 group-hover:text-purple-300 transition">
                  OPTICAL + SAR FUSION
                </h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Co-registered optical and Synthetic Aperture Radar (SAR) imagery for cloud penetration and structural detection.
              </p>
              <div className="space-y-1 font-mono text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <div className="text-purple-400">Sample Queries:</div>
                <div>• "What does SAR reveal through cloud cover?"</div>
                <div>• "Identify maritime vessels across modalities."</div>
                <div>• "Analyze complementary radar backscatter."</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-mono font-bold text-purple-400 group-hover:translate-x-1 transition pt-2 border-t border-slate-800">
              <span>Launch Optical+SAR Workbench</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Mode C: Before + After */}
          <div
            onClick={() => setActiveTab('change-detection')}
            className="group bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 transition cursor-pointer flex flex-col justify-between space-y-4 shadow-xl backdrop-blur-sm relative overflow-hidden"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition">
                <GitCompare className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">MODE C</span>
                <h3 className="text-base font-bold text-slate-100 group-hover:text-emerald-300 transition">
                  BEFORE + AFTER CHANGE
                </h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Bitemporal change detection with interactive split slider and change overlay heatmaps.
              </p>
              <div className="space-y-1 font-mono text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <div className="text-emerald-400">Sample Queries:</div>
                <div>• "What changed between these images?"</div>
                <div>• "Where did flood inundation occur?"</div>
                <div>• "Describe major land-use alterations."</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-mono font-bold text-emerald-400 group-hover:translate-x-1 transition pt-2 border-t border-slate-800">
              <span>Launch Change Detection Workbench</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED DEMO MISSIONS GRID */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2 font-mono">
            <Compass className="w-5 h-5 text-cyan-400" />
            <span>FEATURED EARTH OBSERVATION MISSIONS</span>
          </h2>
          <button
            onClick={() => setActiveTab('gallery')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center space-x-1"
          >
            <span>View All Gallery Missions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {DEMO_MISSIONS.slice(0, 2).map((mission) => (
            <div
              key={mission.id}
              onClick={() => onSelectMission(mission)}
              className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-5 transition cursor-pointer space-y-4 shadow-xl flex flex-col justify-between group"
            >
              <div className="flex space-x-4">
                <img
                  src={mission.thumbnail}
                  alt={mission.title}
                  className="w-28 h-28 rounded-xl object-cover border border-slate-700 shrink-0"
                />
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                      {mission.domain}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{mission.sensor}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition">
                    {mission.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{mission.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span>Coordinates: <strong className="text-slate-300">{mission.coordinates}</strong></span>
                <span className="text-cyan-400 font-bold flex items-center space-x-1">
                  <span>Launch Mission</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
