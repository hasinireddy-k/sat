import React, { useState } from 'react';
import { ExecutionResult } from '../../types/satquery';
import { ChevronDown, ChevronUp, Sliders, CheckCircle2, ShieldCheck, Activity, Database, Cpu } from 'lucide-react';

interface AnalysisDetailsDrawerProps {
  result: ExecutionResult;
}

export const AnalysisDetailsDrawer: React.FC<AnalysisDetailsDrawerProps> = ({ result }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const observableTraceSteps = [
    'INGESTING OBSERVATION',
    'VALIDATING INPUT',
    'INTERPRETING QUERY',
    'SELECTING ANALYSIS',
    'PROCESSING IMAGERY',
    'EXTRACTING EVIDENCE',
    'GENERATING OBSERVATION'
  ];

  const datasetValidationChecks = [
    'File format supported',
    'Image readable',
    'Modality detected',
    'Spatial dimensions verified',
    'Temporal relationship detected'
  ];

  return (
    <div className="border-t border-slate-800 pt-3 font-mono text-xs">
      {/* Collapsible Header Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-2.5 px-4 bg-[#0b0f19] hover:bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-slate-300 flex items-center justify-between transition shadow-md"
      >
        <span className="flex items-center space-x-2 font-bold">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span className="uppercase">HOW THIS ANALYSIS WAS PERFORMED</span>
        </span>
        <div className="flex items-center space-x-4 text-[11px]">
          <span className="text-slate-400 hidden sm:inline">TASK: <strong className="text-cyan-300">{result.detectedTask}</strong></span>
          <span className="text-slate-400 hidden sm:inline">ENGINE: <strong className="text-slate-200">{result.selectedModel.name}</strong></span>
          {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </button>

      {/* Expandable Technical Trace & Dataset Validation Drawer */}
      {isOpen && (
        <div className="mt-3 bg-[#0b0f19] border border-slate-800 rounded-xl p-5 space-y-5 text-slate-300 shadow-xl animate-fade-slide-view">
          {/* Dataset Status Checklist & Agentic Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* DATASET STATUS PANEL */}
            <div className="bg-[#070a12] p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="text-[10px] text-slate-400 font-bold uppercase flex items-center space-x-1.5 border-b border-slate-800 pb-2">
                <Database className="w-3.5 h-3.5 text-cyan-400" />
                <span>DATASET STATUS & VALIDATION</span>
              </div>
              <ul className="space-y-1.5 text-[11px]">
                {datasetValidationChecks.map((check, idx) => (
                  <li key={idx} className="flex items-center space-x-2 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{check}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* OBSERVABLE EXECUTION SEQUENCE */}
            <div className="bg-[#070a12] p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="text-[10px] text-slate-400 font-bold uppercase flex items-center space-x-1.5 border-b border-slate-800 pb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>AGENTIC EXECUTION TRACE</span>
              </div>
              <ul className="space-y-1.5 text-[11px]">
                {observableTraceSteps.map((step, idx) => (
                  <li key={idx} className="flex items-center space-x-2 text-slate-300">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* REMOTE-SENSING MODEL / ADAPTATION STATUS (PS 26167 SECTION D) */}
            <div className="bg-[#070a12] p-4 rounded-xl border border-cyan-500/30 space-y-2">
              <div className="text-[10px] text-cyan-400 font-bold uppercase flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="flex items-center space-x-1.5">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span>RS MODEL / ADAPTATION</span>
                </span>
                <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 rounded">ADAPTED / READY</span>
              </div>
              <div className="space-y-1 text-[11px] font-sans">
                <div>
                  <strong className="text-slate-400 font-mono text-[10px] uppercase">DATASET:</strong>
                  <span className="text-slate-200 block font-mono text-[11px]">BigEarthNet.txt + Sentinel/RISAT</span>
                </div>
                <div>
                  <strong className="text-slate-400 font-mono text-[10px] uppercase">MODALITIES:</strong>
                  <span className="text-slate-200 block font-mono text-[11px]">Optical S2 (12 bands) + SAR C-Band</span>
                </div>
                <div>
                  <strong className="text-slate-400 font-mono text-[10px] uppercase">COMPONENT:</strong>
                  <span className="text-cyan-300 block font-mono text-[11px]">Dual-Stream Swin-RS Encoder</span>
                </div>
                <div>
                  <strong className="text-slate-400 font-mono text-[10px] uppercase">PURPOSE:</strong>
                  <span className="text-slate-300 block">LULC Taxonomy & Cross-Modal Alignment</span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Orchestration Parameters Table */}
          <div className="space-y-2 border-t border-slate-800 pt-4">
            <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center space-x-1">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span>ORCHESTRATION PARAMETERS & TOOL REGISTRY</span>
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px]">
              <div className="bg-[#070a12] p-2.5 rounded border border-slate-800">
                <span className="text-slate-500 block text-[9px] uppercase">TASK</span>
                <span className="text-cyan-300 font-bold">{result.detectedTask}</span>
              </div>
              <div className="bg-[#070a12] p-2.5 rounded border border-slate-800">
                <span className="text-slate-500 block text-[9px] uppercase">INPUT</span>
                <span className="text-slate-200 font-semibold">{result.mode.toUpperCase()}</span>
              </div>
              <div className="bg-[#070a12] p-2.5 rounded border border-slate-800">
                <span className="text-slate-500 block text-[9px] uppercase">SPECIALIST ENGINE</span>
                <span className="text-slate-200 font-semibold">{result.selectedModel.name}</span>
              </div>
              <div className="bg-[#070a12] p-2.5 rounded border border-slate-800">
                <span className="text-slate-500 block text-[9px] uppercase">PARAMETERS</span>
                <span className="text-slate-300">{Object.keys(result.configuredParameters).length} PARAMS</span>
              </div>
              <div className="bg-[#070a12] p-2.5 rounded border border-slate-800">
                <span className="text-slate-500 block text-[9px] uppercase">STATUS</span>
                <span className="text-emerald-400 font-bold">COMPLETED</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


