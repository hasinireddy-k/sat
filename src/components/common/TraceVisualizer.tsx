import React, { useState } from 'react';
import { ExecutionResult, TraceStep } from '../../types/satquery';
import {
  CheckCircle2,
  Clock,
  Cpu,
  Sliders,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Activity,
  Check,
  AlertCircle
} from 'lucide-react';

interface TraceVisualizerProps {
  result: ExecutionResult;
}

export const TraceVisualizer: React.FC<TraceVisualizerProps> = ({ result }) => {
  const [showParams, setShowParams] = useState<boolean>(false);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col space-y-4 shadow-xl backdrop-blur-sm">
      {/* Header Badge */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Auditable Agent Execution Trace
          </h3>
        </div>
        <div className="flex items-center space-x-2 font-mono text-[11px]">
          <span className="text-slate-400">Total Latency:</span>
          <span className="text-cyan-300 font-bold">{result.executionTimeTotalMs}ms</span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400 font-bold">Confidence {result.confidence}%</span>
        </div>
      </div>

      {/* Overview Metadata Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs font-mono">
        <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase">Detected Task Intent</div>
          <div className="text-cyan-300 font-bold mt-0.5">{result.detectedTask}</div>
        </div>

        <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase">Selected Specialist Model</div>
          <div className="text-emerald-400 font-bold mt-0.5">{result.selectedModel.name}</div>
          <div className="text-[9px] text-slate-400">{result.selectedModel.provider}</div>
        </div>

        <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-400 uppercase">Input Validation Status</div>
            <div className="text-cyan-300 font-bold mt-0.5 flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{result.validationResult.format} Passed</span>
            </div>
          </div>
          <button
            onClick={() => setShowParams(!showParams)}
            className="p-1 text-slate-400 hover:text-cyan-300 bg-slate-900 rounded border border-slate-700"
            title="Toggle Model Parameters"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Model Parameter Drawer */}
      {showParams && (
        <div className="bg-slate-950 p-3 rounded-lg border border-cyan-500/30 font-mono text-xs">
          <div className="text-[10px] text-cyan-400 font-bold uppercase mb-2 flex items-center space-x-1">
            <Sliders className="w-3 h-3" />
            <span>Permitted Model Parameters Configured:</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
            {Object.entries(result.configuredParameters).map(([k, v]) => (
              <div key={k} className="bg-slate-900 p-2 rounded border border-slate-800">
                <span className="text-slate-400 block text-[10px]">{k}</span>
                <span className="text-slate-200 font-bold">{String(v)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Observable Step-by-Step Execution Sequence */}
      <div className="space-y-2 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {result.trace.map((step) => {
          const isSuccess = step.status === 'success';
          return (
            <div
              key={step.id}
              className="relative flex items-start space-x-3 pl-1 text-xs font-mono"
            >
              {/* Status Indicator Icon */}
              <div className="z-10 bg-slate-950 rounded-full p-0.5 border border-slate-800">
                {isSuccess ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Clock className="w-5 h-5 text-cyan-400 animate-spin" />
                )}
              </div>

              {/* Step Content */}
              <div className="flex-1 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800/80 flex flex-col space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">
                    Step {step.stepNumber}: {step.name}
                  </span>
                  <span className="text-[10px] text-cyan-400 font-mono">
                    {step.latencyMs}ms
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 font-sans">{step.description}</p>
                {step.detail && (
                  <div className="text-[10px] text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-800 mt-1">
                    {step.detail}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
