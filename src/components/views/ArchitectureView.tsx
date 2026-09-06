import React from 'react';
import { SPECIALIST_MODELS } from '../../services/specialistRegistry';
import { Cpu, Layers, ArrowRight, ShieldCheck, Activity, Database, CheckCircle2, Sparkles } from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  const rsDatasets = [
    { name: 'BigEarthNet', desc: 'Multi-spectral Sentinel-2 & Sentinel-1 land cover dataset.' },
    { name: 'VRSBench', desc: 'Remote sensing vision-language reasoning & VQA benchmark.' },
    { name: 'RSVQA', desc: 'Visual question answering dataset for high-resolution aerial imagery.' },
    { name: 'CDVQA', desc: 'Bitemporal change detection visual question answering dataset.' },
  ];

  return (
    <div className="space-y-8 pb-12 font-sans">
      <div className="border-b border-slate-800 pb-3">
        <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2 font-mono">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <span>TECHNICAL ARCHITECTURE & AGENTIC PIPELINE</span>
        </h2>
        <p className="text-xs text-slate-400">
          Decoupled agentic orchestration framework for ISRO SIH 2026 Problem Statement 26167.
        </p>
      </div>

      {/* PIPELINE FLOWCHART */}
      <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl backdrop-blur-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono flex items-center space-x-2">
          <Sparkles className="w-4 h-4" />
          <span>Agentic Orchestration Execution Loop</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs font-mono">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-500 font-bold">1. QUERY & IMAGERY</span>
            <div className="text-slate-100 font-semibold">User Input</div>
            <div className="text-[10px] text-slate-400">Natural text query + GeoTIFF / TIFF / PNG input.</div>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-500 font-bold">2. VALIDATOR & INTENT</span>
            <div className="text-slate-100 font-semibold">Input Validation</div>
            <div className="text-[10px] text-slate-400">CRS EPSG:32643 verification + Intent Classifier.</div>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-500 font-bold">3. SPECIALIST ROUTER</span>
            <div className="text-slate-100 font-semibold">Model Registry</div>
            <div className="text-[10px] text-slate-400">Selects GeoVLM, GroundingDINO, ChangeFormer or FusionNet.</div>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-500 font-bold">4. EXECUTION</span>
            <div className="text-slate-100 font-semibold">Workflow Engine</div>
            <div className="text-[10px] text-slate-400">FP16 tensor evaluation & feature extraction.</div>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-500 font-bold">5. OUTPUT FUSION</span>
            <div className="text-slate-100 font-semibold">Evidence & Answer</div>
            <div className="text-[10px] text-slate-400">Answer, key findings, confidence & overlays.</div>
          </div>
        </div>
      </section>

      {/* REMOTE-SENSING INTELLIGENCE ADAPTATION */}
      <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl backdrop-blur-sm">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100 font-mono flex items-center space-x-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <span>REMOTE-SENSING INTELLIGENCE & DOMAIN ADAPTATION</span>
          </h3>
          <span className="text-[10px] text-cyan-400 font-mono">SIH Requirement Compliant</span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          SatQuery AI uses a dedicated <strong>Remote-Sensing Adaptation Layer</strong>. Specialist models are calibrated against remote sensing benchmarks rather than relying solely on generic LLMs/VLMs.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono pt-2">
          {rsDatasets.map((ds, i) => (
            <div key={i} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="text-cyan-300 font-bold">{ds.name}</span>
              <p className="text-[11px] text-slate-400 font-sans">{ds.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SPECIALIST MODEL REGISTRY TABLE */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-slate-100 font-mono flex items-center space-x-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>SPECIALIST MODEL REGISTRY ABSTRACTION</span>
        </h3>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl font-mono text-xs text-slate-300">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Model Name</th>
                  <th className="px-4 py-3">Provider</th>
                  <th className="px-4 py-3">Target RS Task</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {SPECIALIST_MODELS.map((model) => (
                  <tr key={model.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3 font-bold text-cyan-300">{model.name}</td>
                    <td className="px-4 py-3 font-sans text-slate-300">{model.provider}</td>
                    <td className="px-4 py-3 text-slate-400">{model.taskSuitability.join(', ')}</td>
                    <td className="px-4 py-3 text-center text-emerald-400 font-bold">{model.status.toUpperCase()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};
