import React, { useState, useEffect } from 'react';
import { ExecutionResult } from '../../types/satquery';
import { agentController } from '../../services/agentController';
import { MinimalViewer } from '../common/MinimalViewer';
import { AnalysisDetailsDrawer } from '../common/AnalysisDetailsDrawer';
import { Send, CheckCircle2, FileText, ArrowLeft, Activity, Compass, Zap } from 'lucide-react';
import { DEMO_MISSIONS } from '../../data/demoMissions';

interface MainAnalysisWorkspaceProps {
  activeResult?: ExecutionResult | null;
  initialResult?: ExecutionResult | null;
  onGenerateReport?: (res: ExecutionResult) => void;
  onBackToHome?: () => void;
  onNewQuery?: (query: string) => void;
}

export const MainAnalysisWorkspace: React.FC<MainAnalysisWorkspaceProps> = ({
  activeResult,
  initialResult,
  onGenerateReport,
  onBackToHome,
  onNewQuery,
}) => {
  const defaultRes = activeResult || initialResult || DEMO_MISSIONS[0].precomputedResult;
  const [currentResult, setCurrentResult] = useState<ExecutionResult>(defaultRes);
  const [followUpQuery, setFollowUpQuery] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null);

  useEffect(() => {
    if (activeResult) {
      setCurrentResult(activeResult);
    } else if (initialResult) {
      setCurrentResult(initialResult);
    }
  }, [activeResult, initialResult]);

  const followUpPrompts = [
    'Explain this region',
    'What changed here?',
    'Compare this area',
    'Why is this significant?'
  ];

  const handleFollowUpSubmit = async (queryOverride?: string) => {
    const q = queryOverride || followUpQuery;
    if (!q.trim() || isProcessing) return;

    if (onNewQuery) {
      onNewQuery(q);
      setFollowUpQuery('');
      return;
    }

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

  const geoMeta = currentResult?.geoMetadata || {
    filename: 'Observation_Scene.tif',
    sensor: 'GeoTIFF Multispectral Sensor',
    resolution: '0.5m / pixel',
    crs: 'EPSG:32643',
    dimensions: '1024 × 1024 px'
  };

  return (
    <div className="space-y-5 pb-12 font-sans text-slate-100 animate-fade-slide-view">
      {/* TOP HEADER CONTROL STRIP */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0b0f19] border border-slate-800 p-3.5 rounded-xl shadow-md font-mono text-xs transition-panel">
        <div className="flex items-center space-x-3">
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="px-3 py-1.5 bg-slate-950 hover:bg-slate-900 border border-slate-700 text-slate-300 rounded font-mono transition-micro flex items-center space-x-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
              <span>+ ADD OBSERVATION</span>
            </button>
          )}
          <div>
            <h2 className="font-bold text-slate-100 flex items-center space-x-2">
              <span>{geoMeta.filename}</span>
              <span className="text-[10px] text-cyan-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 uppercase font-mono">
                {currentResult?.detectedTask || 'Satellite VQA'}
              </span>
            </h2>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="hidden md:flex items-center space-x-2 text-[10px] text-slate-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
            <span>MODALITY: <strong className="text-slate-200">{geoMeta.sensor}</strong></span>
            <span>•</span>
            <span>GSD: <strong className="text-slate-200">{geoMeta.resolution}</strong></span>
            <span>•</span>
            <span>CRS: <strong className="text-slate-200">{geoMeta.crs}</strong></span>
          </div>

          {onGenerateReport && (
            <button
              onClick={() => onGenerateReport(currentResult)}
              className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded shadow transition-micro flex items-center space-x-1.5 font-mono text-xs"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>GENERATE REPORT</span>
            </button>
          )}
        </div>
      </div>

      {/* 70 / 30 VISUAL SPLIT STAGE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[540px]">
        {/* Left Column: 70% Satellite Image Viewer */}
        <div className="lg:col-span-8 flex flex-col">
          <MinimalViewer
            mode={currentResult?.mode || 'single'}
            primaryImage={currentResult?.images?.primary || ''}
            secondaryImage={currentResult?.images?.secondary}
            groundingBoxes={currentResult?.groundingBoxes || []}
            changeAreas={currentResult?.changeAreas || []}
            selectedEvidenceId={selectedEvidenceId}
            onSelectEvidence={(id) => setSelectedEvidenceId(id)}
          />
        </div>

        {/* Right Column: 30% AI Observations & Inspection Panel */}
        <div className="lg:col-span-4 flex flex-col">
          <AnalysisDetailsDrawer
            result={currentResult}
            selectedEvidenceId={selectedEvidenceId}
            onSelectEvidence={(id) => setSelectedEvidenceId(id)}
          />
        </div>
      </div>

      {/* QUERY INTERACTION CONSOLE */}
      <div className="bg-[#0b0f19] border border-slate-800 p-4 rounded-xl shadow-md space-y-3 font-mono">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-cyan-400 flex items-center space-x-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>INTERACTIVE QUERY REFINEMENT CONSOLE</span>
          </span>
          <span className="text-[10px] text-slate-400">MODEL: {currentResult?.selectedModel?.name || 'GeoVLM'}</span>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleFollowUpSubmit();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={followUpQuery}
            onChange={(e) => setFollowUpQuery(e.target.value)}
            placeholder="Ask follow-up question or specify spatial region (e.g., 'Locate solar panels')..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
          />
          <button
            type="submit"
            disabled={isProcessing || !followUpQuery.trim()}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded text-xs transition-micro flex items-center space-x-1.5 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isProcessing ? 'PROCESSING...' : 'QUERY'}</span>
          </button>
        </form>

        <div className="flex flex-wrap gap-2 pt-1">
          <span className="text-[10px] text-slate-400 self-center mr-1">SUGGESTED REFINEMENTS:</span>
          {followUpPrompts.map((promptText, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleFollowUpSubmit(promptText)}
              className="text-[10px] bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-slate-300 px-2.5 py-1 rounded transition-micro"
            >
              + {promptText}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
