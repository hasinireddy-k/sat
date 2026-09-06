import React from 'react';
import { BarChart3, CheckCircle2, ShieldCheck, FileCheck, Layers } from 'lucide-react';

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

  return (
    <div className="space-y-6 pb-12 font-sans">
      <div className="border-b border-slate-800 pb-3">
        <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2 font-mono">
          <BarChart3 className="w-5 h-5 text-cyan-400" />
          <span>SCIENTIFIC EVALUATION FRAMEWORK</span>
        </h2>
        <p className="text-xs text-slate-400">
          Evaluation methodology for ISRO SIH 2026 Problem Statement 26167.
        </p>
      </div>

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
    </div>
  );
};
