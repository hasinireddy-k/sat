import React from 'react';
import { ExecutionResult } from '../../types/satquery';
import {
  FileText,
  CheckCircle2,
  ShieldCheck,
  Compass,
  Cpu,
  Layers,
  Sparkles,
  Printer,
  Share2
} from 'lucide-react';

interface ResultCardProps {
  result: ExecutionResult;
  onGenerateReport?: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result, onGenerateReport }) => {
  return (
    <div className="bg-slate-900/90 border border-cyan-900/50 rounded-xl p-5 space-y-5 shadow-2xl backdrop-blur-md">
      {/* Result Card Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
                Agentic Analysis Findings
              </h3>
              {(result as any).isDemoAnalysis && (
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded">
                  DEMO ANALYSIS
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Query: "{result.query}"
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 text-xs font-mono">
            <span className="text-slate-400">Confidence: </span>
            <strong className={result.confidence !== null && result.confidence !== undefined ? "text-emerald-400" : "text-slate-400"}>
              {result.confidence !== null && result.confidence !== undefined ? `${result.confidence}%` : 'Not available'}
            </strong>
          </div>

          {onGenerateReport && (
            <button
              onClick={onGenerateReport}
              className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-bold text-xs rounded-lg transition shadow-md shadow-cyan-500/20 flex items-center space-x-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Generate Mission Report</span>
            </button>
          )}
        </div>
      </div>

      {/* Primary Text Answer Box */}
      <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
        <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider font-mono flex items-center space-x-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Synthesized Answer</span>
        </div>
        <p className="text-sm text-slate-200 leading-relaxed font-sans font-medium">
          {result.textAnswer}
        </p>
      </div>

      {/* Key Findings & Evidence List */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center space-x-1.5">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Key Earth Observation Findings</span>
        </h4>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-sans">
          {result.keyFindings.map((finding, idx) => (
            <li
              key={idx}
              className="bg-slate-950/80 border border-slate-800 p-3 rounded-lg flex items-start space-x-2 text-slate-300"
            >
              <span className="w-4 h-4 rounded-full bg-cyan-950 text-cyan-400 font-mono text-[10px] flex items-center justify-center font-bold shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span>{finding}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Optical-SAR Modal Insight (if applicable) */}
      {result.opticalSarInsight && (
        <div className="bg-slate-950 border border-purple-900/40 p-4 rounded-xl space-y-3 font-mono text-xs">
          <div className="text-purple-300 font-bold uppercase flex items-center space-x-1.5">
            <Layers className="w-4 h-4 text-purple-400" />
            <span>Cross-Modal Optical + SAR Intelligence</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
            <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
              <span className="text-cyan-400 block font-bold mb-1">Optical Spectral Scene:</span>
              <p className="text-slate-300">{result.opticalSarInsight.opticalObservations}</p>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
              <span className="text-purple-400 block font-bold mb-1">SAR Radar Backscatter (C-Band):</span>
              <p className="text-slate-300">{result.opticalSarInsight.sarObservations}</p>
            </div>
          </div>
          <div className="bg-slate-900 p-2.5 rounded border border-purple-800/40 text-[11px] text-slate-200">
            <span className="text-emerald-400 font-bold block mb-1">Complementary Penetration Synthesis:</span>
            {result.opticalSarInsight.penetrationEvidence}
          </div>
        </div>
      )}

      {/* Spatial Interpretation & Model Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
          <div className="text-slate-400 uppercase text-[10px] flex items-center space-x-1">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>Spatial Interpretation</span>
          </div>
          <p className="text-slate-300 mt-1 font-sans text-xs">
            {result.spatialInterpretation}
          </p>
        </div>

        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-slate-400 uppercase text-[10px] flex items-center space-x-1">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span>Model / Specialist Tool Used</span>
            </div>
            <div className="text-cyan-300 font-bold mt-1">
              {result.selectedModel.name}
            </div>
            <div className="text-[10px] text-slate-400">
              Accuracy: {result.selectedModel.accuracy}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-slate-400">Latency</div>
            <div className="text-emerald-400 font-bold">{result.selectedModel.latencyAvg}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
