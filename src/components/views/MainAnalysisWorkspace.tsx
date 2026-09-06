import React, { useState } from 'react';
import { ExecutionResult } from '../../types/satquery';
import { agentController } from '../../services/agentController';
import { MinimalViewer } from '../common/MinimalViewer';
import { AnalysisDetailsDrawer } from '../common/AnalysisDetailsDrawer';
import { Send, CheckCircle2, FileText, ArrowLeft, Activity, Compass, Zap } from 'lucide-react';

interface MainAnalysisWorkspaceProps {
  initialResult: ExecutionResult;
  onGenerateReport: (res: ExecutionResult) => void;
  onBackToHome: () => void;
}

export const MainAnalysisWorkspace: React.FC<MainAnalysisWorkspaceProps> = ({
  initialResult,
  onGenerateReport,
  onBackToHome
}) => {
  const [currentResult, setCurrentResult] = useState<ExecutionResult>(initialResult);
  const [followUpQuery, setFollowUpQuery] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null);

  const followUpPrompts = [
    'Explain this region',
    'What changed here?',
    'Compare this area',
    'Why is this significant?'
  ];

  const handleFollowUpSubmit = async (queryOverride?: string) => {
    const q = queryOverride || followUpQuery;
    if (!q.trim() || isProcessing) return;

    setIsProcessing(true);
    try {
      const newResult = await agentController.runOrchestration({
        query: q,
        primaryImage: currentResult.images.primary,
        secondaryImage: currentResult.images.secondary,
        primaryMetadata: currentResult.geoMetadata,
        secondaryMetadata: currentResult.geoMetadataSecondary,
      });

      setCurrentResult(newResult);
      setFollowUpQuery('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-5 pb-12 font-sans text-slate-100 animate-fade-slide-view">
      {/* TOP HEADER CONTROL STRIP */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0b0f19] border border-slate-800 p-3.5 rounded-xl shadow-md font-mono text-xs transition-panel">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBackToHome}
            className="px-3 py-1.5 bg-slate-950 hover:bg-slate-900 border border-slate-700 text-slate-300 rounded font-mono transition-micro flex items-center space-x-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
            <span>+ ADD OBSERVATION</span>
          </button>
          <div>
            <h2 className="font-bold text-slate-100 flex items-center space-x-2">
              <span>{currentResult.geoMetadata.filename}</span>
              <span className="text-[10px] text-cyan-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 uppercase font-mono">
                {currentResult.detectedTask}
              </span>
            </h2>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="hidden md:flex items-center space-x-2 text-[10px] text-slate-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
            <span>MODALITY: <strong className="text-slate-200">{currentResult.geoMetadata.sensor}</strong></span>
            <span>•</span>
            <span>GSD: <strong className="text-slate-200">{currentResult.geoMetadata.resolution}</strong></span>
            <span>•</span>
            <span>CRS: <strong className="text-slate-200">{currentResult.geoMetadata.crs}</strong></span>
          </div>

          <button
            onClick={() => onGenerateReport(currentResult)}
            className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded shadow transition-micro flex items-center space-x-1.5 font-mono text-xs"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>GENERATE REPORT</span>
          </button>
        </div>
      </div>

      {/* 70 / 30 VISUAL SPLIT STAGE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[540px]">
        {/* Left Column: 70% Satellite Image Viewer */}
        <div className="lg:col-span-8 flex flex-col">
          <MinimalViewer
            mode={currentResult.mode}
            primarySrc={currentResult.images.primary}
            secondarySrc={currentResult.images.secondary}
            primaryMeta={currentResult.geoMetadata}
            secondaryMeta={currentResult.geoMetadataSecondary}
            groundingBoxes={currentResult.groundingBoxes}
            changeAreas={currentResult.changeAreas}
            selectedEvidenceId={selectedEvidenceId}
            onQueryRegion={(q) => handleFollowUpSubmit(q)}
          />
        </div>

        {/* Right Column: 30% AI Intelligence Panel */}
        <div className="lg:col-span-4 bg-[#0b0f19] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-4 shadow-xl font-sans transition-panel">
          <div className="space-y-4 overflow-y-auto max-h-[500px] pr-1 scrollbar-none">
            {/* Top Status Bar */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 font-mono text-[11px]">
              <span className="text-cyan-400 font-bold uppercase tracking-wider flex items-center space-x-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span>
                  {currentResult.mode === 'change'
                    ? 'CHANGE ANALYSIS'
                    : currentResult.mode === 'optical-sar'
                    ? 'OPTICAL + SAR FUSION'
                    : 'SINGLE IMAGE INTELLIGENCE'}
                </span>
              </span>
              <span className="text-slate-500 font-mono flex items-center space-x-1">
                <span className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
                <span>{isProcessing ? 'PROCESSING IMAGERY...' : 'OBSERVATION READY'}</span>
              </span>
            </div>

            {/* User Submitted Query */}
            <div className="bg-[#070a12] p-3 rounded-xl border border-slate-800 space-y-1 animate-reveal-1">
              <div className="text-[9px] font-mono text-slate-500 uppercase font-bold">NATURAL LANGUAGE QUERY</div>
              <div className="text-xs text-slate-100 font-medium font-sans">"{currentResult.query}"</div>
            </div>

            {/* Primary Answer */}
            <div className="space-y-1.5 animate-reveal-1">
              <div className="text-xs font-bold text-slate-200 font-mono flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>EXPLANATION</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-sans bg-[#070a12] p-3 rounded-xl border border-slate-800/90 shadow-sm">
                {currentResult.textAnswer}
              </p>
            </div>

            {/* Optical + SAR Multimodal Insights (If Optical-SAR Mode) */}
            {currentResult.mode === 'optical-sar' && currentResult.opticalSarInsight && (
              <div className="space-y-2 bg-[#070a12] p-3 rounded-xl border border-slate-800 text-xs font-mono animate-reveal-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <div className="text-cyan-400 font-bold uppercase text-[10px]">MULTIMODAL SYNTHESIS</div>
                  <span className="text-[9px] text-emerald-400 bg-slate-900 px-1.5 py-0.2 rounded border border-slate-800">
                    SEE WHAT OTHER SYSTEMS MISS
                  </span>
                </div>

                <div className="space-y-2 text-[11px] font-sans">
                  <div>
                    <strong className="text-cyan-400 font-mono text-[10px] block uppercase">OPTICAL OBSERVATION:</strong>
                    <p className="text-slate-300">{currentResult.opticalSarInsight.opticalObservations}</p>
                  </div>
                  <div>
                    <strong className="text-purple-400 font-mono text-[10px] block uppercase">SAR OBSERVATION:</strong>
                    <p className="text-slate-300">{currentResult.opticalSarInsight.sarObservations}</p>
                  </div>
                  <div>
                    <strong className="text-emerald-400 font-mono text-[10px] block uppercase">COMBINED INTERPRETATION:</strong>
                    <p className="text-slate-300">{currentResult.opticalSarInsight.complementarySynthesis}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Key Findings (or Key Changes) & Confidence Level */}
            <div className="space-y-2 animate-reveal-2">
              <div className="text-xs font-bold text-slate-300 font-mono flex items-center justify-between">
                <span>{currentResult.mode === 'change' ? 'KEY CHANGES DETECTED' : 'KEY FINDINGS'}</span>
                <span className="text-cyan-400 font-mono text-[11px]">
                  CONFIDENCE: <strong className="text-emerald-400">{currentResult.confidenceLevel || 'High'} ({currentResult.confidence}%)</strong>
                </span>
              </div>
              <div className="space-y-1.5 text-xs text-slate-300 font-mono">
                {currentResult.keyFindings.map((finding, i) => {
                  const matchingGb = currentResult.groundingBoxes[i];
                  return (
                    <div
                      key={i}
                      onClick={() => matchingGb && setSelectedEvidenceId(matchingGb.id)}
                      className={`bg-[#070a12] p-2.5 rounded-lg border border-slate-800 space-y-0.5 transition-micro cursor-pointer hover:border-cyan-500/50 hover:bg-slate-900/60 ${
                        matchingGb && selectedEvidenceId === matchingGb.id ? 'border-cyan-400 bg-slate-900' : ''
                      }`}
                    >
                      <div className="text-[10px] text-cyan-400 font-bold flex justify-between">
                        <span>0{i + 1} OBSERVATION ITEM</span>
                        {matchingGb && <span className="text-[9px] text-slate-500 hover:text-cyan-300">CLICK TO FOCUS →</span>}
                      </div>
                      <div className="text-[11px] text-slate-200 font-sans leading-snug">{finding}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Change Evidence Overlays (If Change Mode) */}
            {currentResult.mode === 'change' && currentResult.changeAreas && currentResult.changeAreas.length > 0 && (
              <div className="space-y-2 animate-reveal-3">
                <div className="text-xs font-bold text-slate-300 font-mono flex items-center justify-between">
                  <span>DETECTED CHANGE EVIDENCE</span>
                  <span className="text-[10px] text-cyan-400">{currentResult.changeAreas.length} REGIONS GROUNDED</span>
                </div>
                <div className="space-y-1.5 font-mono text-xs">
                  {currentResult.changeAreas.map((ca) => (
                    <div
                      key={ca.id}
                      onClick={() => setSelectedEvidenceId(ca.id)}
                      className="bg-[#070a12] p-2.5 rounded-lg border border-cyan-500/30 space-y-1 hover:border-cyan-400 cursor-pointer transition-micro"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-cyan-300 font-bold">{ca.label}</span>
                        <span className="text-[9px] bg-cyan-950 text-cyan-400 border border-cyan-800 px-1.5 py-0.2 rounded uppercase">
                          {ca.changeSeverity} severity
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 font-sans">{ca.description}</p>
                      <div className="text-[10px] text-slate-500 flex justify-between">
                        <span>AFFECTED AREA: <strong className="text-slate-300">{(ca.areaSqMeters / 10000).toFixed(2)} ha</strong></span>
                        <span className="text-cyan-400 font-mono">FOCUS REGION →</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Spatial Interpretation Context */}
            <div className="bg-[#070a12] p-3 rounded-xl border border-slate-800 space-y-1 text-xs animate-reveal-4">
              <div className="text-[10px] font-mono text-slate-400 font-bold uppercase">SPATIAL INTERPRETATION</div>
              <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                {currentResult.spatialInterpretation || `Evidence region grounded across coordinate extent [${currentResult.geoMetadata.bounds.join(', ')}]. Cross-modal feature attention maps verified structural alignment.`}
              </p>
            </div>
          </div>

          {/* Quick Follow-up Action Buttons */}
          <div className="pt-2 border-t border-slate-800 space-y-2 animate-reveal-4">
            <div className="text-[10px] font-mono text-slate-400 font-bold uppercase">FOLLOW-UP QUICK ACTIONS</div>
            <div className="grid grid-cols-2 gap-1.5">
              {followUpPrompts.map((promptText, idx) => (
                <button
                  key={idx}
                  onClick={() => handleFollowUpSubmit(promptText)}
                  className="px-2 py-1.5 bg-[#070a12] hover:bg-slate-900 border border-slate-800 rounded text-[10px] font-mono text-slate-300 text-left transition-micro truncate"
                >
                  {promptText}
                </button>
              ))}
            </div>

            {/* Follow-up Text Area */}
            <form onSubmit={(e) => { e.preventDefault(); handleFollowUpSubmit(); }} className="pt-1">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={followUpQuery}
                  onChange={(e) => setFollowUpQuery(e.target.value)}
                  placeholder="Ask follow-up question..."
                  className="w-full bg-[#070a12] border border-slate-800 focus:border-cyan-500/80 rounded-lg pl-3 pr-10 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition-micro font-sans"
                />
                <button
                  type="submit"
                  disabled={isProcessing || !followUpQuery.trim()}
                  className="absolute right-1 px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded transition-micro disabled:opacity-40"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* EXPANDABLE AGENTIC ORCHESTRATION & DATASET STATUS DRAWER */}
      <AnalysisDetailsDrawer result={currentResult} />
    </div>
  );
};


