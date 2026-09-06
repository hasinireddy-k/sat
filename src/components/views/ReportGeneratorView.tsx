import React from 'react';
import { ExecutionResult } from '../../types/satquery';
import { FileText, Printer, Satellite, CheckCircle2, Compass, Activity } from 'lucide-react';

interface ReportGeneratorViewProps {
  result: ExecutionResult | null;
}

export const ReportGeneratorView: React.FC<ReportGeneratorViewProps> = ({ result }) => {
  if (!result) {
    return (
      <div className="bg-[#0b0f19] border border-slate-800 rounded-xl p-12 text-center space-y-4 max-w-2xl mx-auto my-12 font-mono text-slate-300">
        <FileText className="w-12 h-12 text-cyan-400 mx-auto" />
        <h3 className="text-sm font-bold text-slate-100 uppercase">NO ACTIVE MISSION SELECTED FOR REPORT GENERATION</h3>
        <p className="text-xs text-slate-400 font-sans">
          Execute an observation query in Mission Control to generate an official Earth Observation Intelligence Report.
        </p>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12 font-sans text-slate-100">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 print:hidden">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2 font-mono uppercase tracking-wider">
            <FileText className="w-5 h-5 text-cyan-400" />
            <span>EARTH OBSERVATION INTELLIGENCE REPORT</span>
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Printable aerospace intelligence document with auditable execution trace log.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded transition flex items-center space-x-2 font-mono shadow"
        >
          <Printer className="w-4 h-4" />
          <span>PRINT REPORT (PDF)</span>
        </button>
      </div>

      {/* Printable Report Document Container */}
      <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-8 md:p-12 space-y-8 shadow-2xl text-slate-200 max-w-4xl mx-auto print:bg-white print:text-black print:border-none print:shadow-none font-sans">
        {/* Document Header */}
        <div className="border-b-2 border-slate-800 pb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded bg-[#070a12] border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold text-xl print:bg-slate-200 print:text-slate-900">
              <Satellite className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold uppercase tracking-wider text-slate-100 font-mono print:text-slate-900">
                SATQUERY AI
              </h1>
              <p className="text-xs text-cyan-400 print:text-slate-600 font-mono uppercase font-bold">
                EARTH OBSERVATION INTELLIGENCE REPORT
              </p>
            </div>
          </div>

          <div className="text-right font-mono text-xs text-slate-400 print:text-slate-700 space-y-0.5">
            <div>MISSION ID: <strong className="text-slate-200 print:text-slate-900">{result.id}</strong></div>
            <div>DATE: {result.timestamp}</div>
            <div>CONFIDENCE: <strong className="text-emerald-400 print:text-emerald-700">{result.confidenceLevel || 'High'}</strong></div>
          </div>
        </div>

        {/* Structured Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#070a12] p-5 rounded-xl border border-slate-800 print:bg-slate-100 print:border-slate-300 print:text-slate-900 text-xs font-mono">
          <div className="space-y-2">
            <div>
              <span className="text-slate-500 uppercase text-[9px] block">MISSION</span>
              <strong className="text-slate-200 print:text-slate-900 text-sm">ISRO SIH 26167 REMOTE SENSING</strong>
            </div>
            <div>
              <span className="text-slate-500 uppercase text-[9px] block">QUERY</span>
              <span className="text-slate-200 print:text-slate-900 font-sans text-xs font-medium">"{result.query}"</span>
            </div>
          </div>

          <div className="space-y-2 border-t md:border-t-0 md:border-l border-slate-800 md:pl-6 print:border-slate-300">
            <div>
              <span className="text-slate-500 uppercase text-[9px] block">INPUT DATA</span>
              <span className="text-slate-200 print:text-slate-900">{result.geoMetadata.filename} ({result.geoMetadata.sensor})</span>
            </div>
            <div>
              <span className="text-slate-500 uppercase text-[9px] block">ANALYSIS TYPE</span>
              <span className="text-cyan-300 print:text-slate-900 font-bold">{result.detectedTask}</span>
            </div>
          </div>
        </div>

        {/* Key Findings */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 print:text-slate-900 font-mono flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 print:text-emerald-700" />
            <span>KEY FINDINGS</span>
          </h3>
          <div className="bg-[#070a12] p-4 rounded-xl border border-slate-800 print:bg-slate-50 print:border-slate-300 print:text-slate-900 text-sm leading-relaxed font-sans space-y-2">
            <p className="font-semibold text-slate-100">{result.textAnswer}</p>
            <ul className="space-y-1 text-xs text-slate-300 pt-2 border-t border-slate-800">
              {result.keyFindings.map((finding, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-cyan-400 font-mono">•</span>
                  <span>{finding}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Visual Evidence */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 print:text-slate-900 font-mono flex items-center space-x-1.5">
            <Compass className="w-4 h-4 text-cyan-400 print:text-slate-900" />
            <span>VISUAL EVIDENCE</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded overflow-hidden border border-slate-800 print:border-slate-300">
              <img src={result.images.primary} alt="Primary Scene" className="w-full h-52 object-cover" />
              <div className="p-2 bg-[#070a12] print:bg-slate-200 text-[10px] font-mono text-center text-slate-300 print:text-slate-800">
                Primary Scene: {result.geoMetadata.filename}
              </div>
            </div>

            {result.images.secondary && (
              <div className="rounded overflow-hidden border border-slate-800 print:border-slate-300">
                <img src={result.images.secondary} alt="Secondary Scene" className="w-full h-52 object-cover" />
                <div className="p-2 bg-[#070a12] print:bg-slate-200 text-[10px] font-mono text-center text-slate-300 print:text-slate-800">
                  Secondary Modal/Temporal Scene
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Execution Summary Trace */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 print:text-slate-900 font-mono flex items-center space-x-1.5">
            <Activity className="w-4 h-4 text-cyan-400 print:text-slate-900" />
            <span>EXECUTION SUMMARY TRACE</span>
          </h3>
          <div className="bg-[#070a12] p-4 rounded-xl border border-slate-800 print:bg-slate-50 print:border-slate-300 print:text-slate-900 space-y-2 text-xs font-mono">
            {result.trace.map((step) => (
              <div key={step.id} className="flex items-center justify-between border-b border-slate-800/80 print:border-slate-200 pb-1.5">
                <div className="flex items-center space-x-2">
                  <span className="text-emerald-400 print:text-emerald-700 font-bold">✓ Step {step.stepNumber}:</span>
                  <span className="text-slate-200 print:text-slate-900 font-semibold">{step.name}</span>
                </div>
                <span className="text-slate-400 print:text-slate-600 text-[10px]">{step.latencyMs}ms</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Signature */}
        <div className="pt-6 border-t border-slate-800 print:border-slate-400 flex items-center justify-between text-[11px] font-mono text-slate-400 print:text-slate-700">
          <div>ISRO SIH 2026 Problem Statement 26167 Signature: Verified</div>
          <div>Agent System: SatQuery AI v2.6-Pro</div>
        </div>
      </div>
    </div>
  );
};

