import React from 'react';
import { BarChart3, CheckCircle2, ShieldCheck, FileCheck, Layers, Database, Sparkles } from 'lucide-react';

export const EvaluationView: React.FC = () => {
  const evalFramework = [
    {
      module: 'Single Image VQA',
      evalTarget: 'Object counts, infrastructure status & condition assessment.',
      input: 'GeoTIFF / PNG single scene + Natural text question',
      output: 'Synthesized text answer & key findings',
      evidenceType: 'Grounding bounding boxes & feature highlights'
    },
    {
      module: 'Captioning & Grounding',
      evalTarget: 'ISRO Level 3 LULC taxonomy scene description & entity bounding box localization.',
      input: 'GeoTIFF single scene + Natural text query',
      output: 'Scientific land-cover paragraph & target coordinates',
      evidenceType: 'Bounding boxes with category labels & confidence'
    },
    {
      module: 'Temporal Change Understanding',
      evalTarget: 'Bitemporal surface alterations, flood inundation & structural additions.',
      input: 'T1 pre-event + T2 post-event GeoTIFF pair',
      output: 'Inundation footprint & change description',
      evidenceType: 'Synchronized split slider & change heatmap overlays'
    },
    {
      module: 'Optical + SAR Analysis',
      evalTarget: 'All-weather cloud penetration & complementary radar backscatter synthesis.',
      input: 'Optical RGB + RISAT-1 C-band SAR GeoTIFF pair',
      output: 'Complementary modal synthesis',
      evidenceType: 'Side-by-side radar cross-section (RCS) backscatter'
    },
    {
      module: 'Agentic Orchestration',
      evalTarget: 'Input validation, query classification & specialist tool routing.',
      input: 'Free-form text query + Remote sensing imagery',
      output: 'Autonomous workflow execution',
      evidenceType: 'Auditable execution trace log'
    }
  ];

  const benchmarkMatrix = [
    {
      name: 'VRSBench',
      task: 'RS Vision-Language Reasoning & VQA',
      metrics: 'Accuracy, CIDEr, BLEU-4',
      scope: 'Multi-choice VQA, Visual Grounding, Spatial Reasoning',
      status: 'READY',
      statusColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
    },
    {
      name: 'RSVQA',
      task: 'High-Resolution Aerial VQA (Sentinel-2 & Landsat)',
      metrics: 'Presence, Count, Comparison Accuracy',
      scope: 'Object Counting, Land Cover Classification, Proximity',
      status: 'CONNECTED',
      statusColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
    },
    {
      name: 'CDVQA',
      task: 'Bitemporal Change Detection VQA',
      metrics: 'Change F1-Score, Bounding Box IoU',
      scope: 'Urban Expansion, Flood Footprint, Deforestation',
      status: 'CONNECTED',
      statusColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
    },
    {
      name: 'ISRO / SAC Benchmark Set',
      task: 'ISRO Mission Test Cases (RISAT-1/2B, Cartosat-3)',
      metrics: 'Domain Expert Human Eval & CRS Precision',
      scope: 'Indian Topography, Disaster Response & LULC Level 3',
      status: 'NOT CONFIGURED (PLANNED)',
      statusColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30'
    }
  ];

  return (
    <div className="space-y-8 pb-12 font-sans">
      <div className="border-b border-slate-800 pb-3">
        <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2 font-mono">
          <BarChart3 className="w-5 h-5 text-cyan-400" />
          <span>SCIENTIFIC EVALUATION FRAMEWORK & BENCHMARK MATRIX</span>
        </h2>
        <p className="text-xs text-slate-400">
          Rigorous evaluation methodology & benchmark readiness for ISRO SIH 2026 Problem Statement 26167.
        </p>
      </div>

      {/* SECTION S BENCHMARK EVALUATION MATRIX */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono flex items-center space-x-2">
            <Database className="w-4 h-4" />
            <span>REMOTE SENSING BENCHMARK EVALUATION MATRIX (SECTION S)</span>
          </h3>
          <span className="text-[10px] font-mono text-slate-400">Evaluation Readiness</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl font-mono text-xs text-slate-300">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Benchmark Suite</th>
                  <th className="px-4 py-3">Target RS Task</th>
                  <th className="px-4 py-3">Evaluation Metrics</th>
                  <th className="px-4 py-3">Coverage & Scope</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {benchmarkMatrix.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3 font-bold text-cyan-300 whitespace-nowrap">{item.name}</td>
                    <td className="px-4 py-3 font-sans text-slate-200 text-[11px] max-w-xs">{item.task}</td>
                    <td className="px-4 py-3 text-slate-300 font-mono text-[11px]">{item.metrics}</td>
                    <td className="px-4 py-3 font-sans text-slate-400 text-[11px]">{item.scope}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${item.statusColor} inline-block whitespace-nowrap`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* TASK MODULE EVALUATION */}
      <section className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono flex items-center space-x-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>TASK MODULE EVALUATION CRITERIA</span>
        </h3>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl font-mono text-xs text-slate-300">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Task Module</th>
                  <th className="px-4 py-3">What is Evaluated</th>
                  <th className="px-4 py-3">Input Format</th>
                  <th className="px-4 py-3">Expected Output</th>
                  <th className="px-4 py-3">Visual Evidence Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {evalFramework.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3 font-bold text-cyan-300 whitespace-nowrap">{item.module}</td>
                    <td className="px-4 py-3 font-sans text-slate-200 max-w-xs">{item.evalTarget}</td>
                    <td className="px-4 py-3 text-slate-400 font-mono text-[11px]">{item.input}</td>
                    <td className="px-4 py-3 font-sans text-slate-300">{item.output}</td>
                    <td className="px-4 py-3 text-emerald-400 font-mono text-[11px]">{item.evidenceType}</td>
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

