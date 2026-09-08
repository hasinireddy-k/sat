import React, { useState, useEffect } from 'react';
import { ExecutionResult } from '../../types/satquery';
import { agentController } from '../../services/agentController';
import { satqueryApi } from '../../services/satqueryApi';
import { MinimalViewer } from '../common/MinimalViewer';
import { AnalysisDetailsDrawer } from '../common/AnalysisDetailsDrawer';
import { MissionDetailFactorsView } from './MissionDetailFactorsView';
import { Send, CheckCircle2, FileText, ArrowLeft, Activity, Compass, Zap, LayoutDashboard, Sliders } from 'lucide-react';
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
  const [activeMode, setActiveMode] = useState<'viewer' | 'factors'>('viewer');
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

  const [processingStage, setProcessingStage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const followUpPrompts = [
    'Describe this area',
    'Identify land cover',
    'Find buildings',
    'Find roads',
    'What changed between T1 and T2?',
    'Compare optical and SAR'
  ];

  const handleFollowUpSubmit = async (queryOverride?: string) => {
    const q = (queryOverride || followUpQuery).trim();
    if (!q || isProcessing) return;

    setIsProcessing(true);
    setErrorMessage(null);
    setProcessingStage('Processing → Validating remote-sensing query...');

    try {
      await new Promise(r => setTimeout(r, 200));
      setProcessingStage('Agent selected → Routing to specialist model...');

      await new Promise(r => setTimeout(r, 200));
      setProcessingStage('Model running → Executing PyTorch inference...');

      // Determine appropriate mode if query specifies change or optical-sar
      const qLower = q.toLowerCase();
      let mode = currentResult.mode;
      if (qLower.includes('change') || qLower.includes('t1 and t2') || qLower.includes('what changed')) {
        mode = 'change';
      } else if (qLower.includes('optical and sar') || qLower.includes('sar')) {
        mode = 'optical-sar';
      }

      const newResult = await satqueryApi.executeQuery({
        query: q,
        primaryImage: currentResult.images?.primary,
        secondaryImage: currentResult.images?.secondary,
        primaryMetadata: currentResult.geoMetadata,
        secondaryMetadata: currentResult.geoMetadataSecondary,
        fileId: currentResult.geoMetadata?.fileId,
        secondaryFileId: currentResult.geoMetadataSecondary?.fileId,
        forcedMode: mode,
      });

      setProcessingStage('Result');
      setCurrentResult(newResult);
      setFollowUpQuery('');
    } catch (err: any) {
      console.error('[Query Execution Error]', err);
      setErrorMessage(err?.message || 'Remote sensing backend inference failed.');
    } finally {
      setIsProcessing(false);
      setTimeout(() => setProcessingStage(''), 1000);
    }
  };

  const geoMeta = currentResult?.geoMetadata || {
    filename: 'Observation_Scene.tif',
    sensor: 'GeoTIFF Multispectral Sensor',
    resolution: '0.5m / pixel',
    crs: 'EPSG:32643',
    dimensions: '1024 × 1024 px'
  };

  if (activeMode === 'factors') {
    return (
      <MissionDetailFactorsView
        result={currentResult}
        onBack={onBackToHome}
        onOpenWorkspace={() => setActiveMode('viewer')}
      />
    );
  }

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

        {/* View Mode Toggle (Interactive Split Viewer vs Hercules Factors View) */}
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveMode('viewer')}
            className={`px-3 py-1 rounded text-xs font-mono transition flex items-center space-x-1.5 ${
              activeMode === 'viewer'
                ? 'bg-cyan-600 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3 h-3" />
            <span>SPLIT VIEWER</span>
          </button>
          <button
            onClick={() => setActiveMode('factors')}
            className={`px-3 py-1 rounded text-xs font-mono transition flex items-center space-x-1.5 ${
              activeMode === 'factors'
                ? 'bg-cyan-600 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutDashboard className="w-3 h-3" />
            <span>INPUT/OUTPUT FACTORS</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <div className="hidden xl:flex items-center space-x-2 text-[10px] text-slate-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
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
            primarySrc={currentResult?.images?.primary || ''}
            primaryImage={currentResult?.images?.primary || ''}
            secondarySrc={currentResult?.images?.secondary}
            secondaryImage={currentResult?.images?.secondary}
            primaryMeta={geoMeta}
            secondaryMeta={currentResult?.geoMetadataSecondary}
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

        {/* Live Processing Pipeline Feedback Banner */}
        {processingStage && (
          <div className="flex items-center space-x-2.5 px-3 py-2 bg-cyan-950/40 border border-cyan-500/40 rounded-lg text-xs font-mono text-cyan-300 animate-pulse">
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            <span>{processingStage}</span>
          </div>
        )}

        {/* Error Notification */}
        {errorMessage && (
          <div className="px-3 py-2 bg-rose-950/40 border border-rose-500/40 rounded-lg text-xs font-mono text-rose-300 flex items-center space-x-2">
            <span>⚠</span>
            <span>{errorMessage}</span>
          </div>
        )}

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
            disabled={isProcessing}
            placeholder="Type query (e.g. 'Describe this area', 'Find buildings', 'What changed between T1 and T2?')..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isProcessing || !followUpQuery.trim()}
            className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded text-xs transition-micro flex items-center space-x-1.5 disabled:opacity-50 shadow"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isProcessing ? 'ANALYZING...' : 'ANALYZE'}</span>
          </button>
        </form>

        <div className="flex flex-wrap gap-2 pt-1">
          <span className="text-[10px] text-slate-400 self-center mr-1">QUICK QUERIES:</span>
          {followUpPrompts.map((promptText, i) => (
            <button
              key={i}
              type="button"
              disabled={isProcessing}
              onClick={() => handleFollowUpSubmit(promptText)}
              className="text-[10px] bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-slate-300 px-2.5 py-1 rounded transition-micro disabled:opacity-50"
            >
              + {promptText}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
