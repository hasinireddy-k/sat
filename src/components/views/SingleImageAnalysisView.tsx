import React, { useState } from 'react';
import { ExecutionResult, GeoMetadata, TraceStep } from '../../types/satquery';
import { runAgentOrchestration } from '../../services/agentOrchestrator';
import { GeoTiffUploader } from '../common/GeoTiffUploader';
import { InteractiveViewer } from '../common/InteractiveViewer';
import { TraceVisualizer } from '../common/TraceVisualizer';
import { ResultCard } from '../common/ResultCard';
import {
  Eye,
  Send,
  Sparkles,
  HelpCircle,
  Clock,
  CheckCircle2,
  Sliders,
  Layers,
  FileCode
} from 'lucide-react';

interface SingleImageAnalysisViewProps {
  onGenerateReport: (res: ExecutionResult) => void;
}

export const SingleImageAnalysisView: React.FC<SingleImageAnalysisViewProps> = ({
  onGenerateReport
}) => {
  const [imageSrc, setImageSrc] = useState<string>(
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80'
  );
  const [query, setQuery] = useState<string>('Where are the commercial office complexes and tech parks?');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [liveTrace, setLiveTrace] = useState<TraceStep[]>([]);
  const [geoMetadata, setGeoMetadata] = useState<GeoMetadata>({
    filename: 'Bengaluru_ORR_Sector_03.tif',
    fileSize: '62.4 MB',
    dimensions: '3072 x 3072 px',
    crs: 'EPSG:32643 (UTM Zone 43N)',
    resolution: '0.3 m / pixel',
    sensor: 'Cartosat-2E High-Res',
    acquisitionDate: '15-JAN-2026',
    bands: ['Red', 'Green', 'Blue', 'NIR'],
    bounds: [77.67, 12.91, 77.69, 12.93],
    format: 'GeoTIFF'
  });

  const sampleQueries = [
    { label: 'VQA', text: 'How many primary commercial office blocks are visible?' },
    { label: 'Captioning', text: 'Describe the scene and summarize land cover density.' },
    { label: 'Grounding', text: 'Where are the commercial office complexes and tech parks?' },
    { label: 'Renewable', text: 'Identify solar roof installations and water retention bodies.' }
  ];

  const handleRunAnalysis = async (queryText?: string) => {
    const q = queryText || query;
    if (!q.trim() || !imageSrc) return;

    setIsAnalyzing(true);
    setLiveTrace([]);
    try {
      const res = await runAgentOrchestration(
        {
          mode: 'single',
          query: q,
          primaryImage: imageSrc,
          primaryMetadata: geoMetadata
        },
        (steps) => setLiveTrace(steps)
      );
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Workbench Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2 font-mono">
            <Eye className="w-5 h-5 text-cyan-400" />
            <span>MODE A: SINGLE IMAGE ANALYSIS WORKBENCH</span>
          </h2>
          <p className="text-xs text-slate-400 font-sans">
            Submit natural language queries for VQA, Scene Captioning, or Text-Guided Region Grounding.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Input Column */}
        <div className="lg:col-span-5 space-y-5">
          <GeoTiffUploader
            label="Input Satellite Imagery"
            imageSrc={imageSrc}
            onImageSelected={(src, meta) => {
              setImageSrc(src);
              if (meta) setGeoMetadata(meta);
            }}
          />

          {/* Natural Language Query Input */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3 backdrop-blur-sm">
            <label className="text-xs font-semibold text-cyan-300 uppercase tracking-wider flex items-center space-x-1.5 font-mono">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Natural Language Query</span>
            </label>

            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything about this satellite scene..."
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/80 rounded-lg p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition resize-none font-sans"
            />

            {/* Suggested Queries Chips with Task Categories */}
            <div className="space-y-1.5">
              <div className="text-[10px] text-slate-400 uppercase font-mono flex items-center space-x-1">
                <HelpCircle className="w-3 h-3 text-cyan-400" />
                <span>Sample Task Queries:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {sampleQueries.map((sq, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setQuery(sq.text);
                      handleRunAnalysis(sq.text);
                    }}
                    className="text-[11px] bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 px-2.5 py-1 rounded-lg transition text-left font-sans flex items-center space-x-1.5"
                  >
                    <span className="text-[9px] font-mono font-bold bg-cyan-950 text-cyan-300 px-1 py-0.2 rounded border border-cyan-800">
                      {sq.label}
                    </span>
                    <span className="truncate">{sq.text}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleRunAnalysis()}
              disabled={isAnalyzing || !query.trim()}
              className="w-full py-3 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl transition shadow-lg shadow-cyan-500/20 flex items-center justify-center space-x-2"
            >
              {isAnalyzing ? (
                <>
                  <Clock className="w-4 h-4 text-slate-950 animate-spin" />
                  <span>Agent Executing Workflow...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-slate-950" />
                  <span>Execute Agentic Query</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Output Column */}
        <div className="lg:col-span-7 space-y-6">
          <InteractiveViewer
            imageSrc={imageSrc}
            title="Single Scene Visual Evidence Canvas"
            groundingBoxes={result?.groundingBoxes || []}
            geoMetadata={result?.geoMetadata || geoMetadata}
          />

          {/* Real-time Streaming Execution Trace */}
          {isAnalyzing && liveTrace.length > 0 && (
            <div className="bg-slate-900/90 border border-cyan-500/40 p-4 rounded-xl space-y-2 font-mono text-xs shadow-xl animate-pulse">
              <div className="text-cyan-300 font-bold flex items-center space-x-2">
                <Clock className="w-4 h-4 text-cyan-400 animate-spin" />
                <span>Agentic Execution Trace Streaming...</span>
              </div>
              <div className="space-y-1.5 pl-2 border-l border-cyan-500/30 text-[11px]">
                {liveTrace.map((step) => (
                  <div key={step.id} className="flex items-center justify-between text-slate-300">
                    <span className={step.status === 'success' ? 'text-emerald-400 font-semibold' : 'text-cyan-300'}>
                      {step.status === 'success' ? '✓' : '⟳'} Step {step.stepNumber}: {step.name}
                    </span>
                    <span className="text-[10px] text-slate-400">{step.latencyMs}ms</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result && !isAnalyzing && (
            <div className="space-y-6">
              <ResultCard result={result} onGenerateReport={() => onGenerateReport(result)} />
              <TraceVisualizer result={result} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
