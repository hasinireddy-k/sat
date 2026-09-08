import React, { useState } from 'react';
import { ExecutionResult, GeoMetadata, TraceStep } from '../../types/satquery';
import { runAgentOrchestration } from '../../services/agentOrchestrator';
import { GeoTiffUploader } from '../common/GeoTiffUploader';
import { SplitSliderViewer } from '../common/SplitSliderViewer';
import { TraceVisualizer } from '../common/TraceVisualizer';
import { ResultCard } from '../common/ResultCard';
import {
  GitCompare,
  Send,
  Sparkles,
  HelpCircle,
  Clock,
  ArrowRightLeft
} from 'lucide-react';

interface ChangeDetectionViewProps {
  onGenerateReport: (res: ExecutionResult) => void;
}

export const ChangeDetectionView: React.FC<ChangeDetectionViewProps> = ({
  onGenerateReport
}) => {
  const [t1Src, setT1Src] = useState<string>(
    '/assets/scenes/scene-01.jpg'
  );
  const [t2Src, setT2Src] = useState<string>(
    '/assets/scenes/scene-02.jpg'
  );
  const [query, setQuery] = useState<string>('What changed between these pre-flood and post-flood images?');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [liveTrace, setLiveTrace] = useState<TraceStep[]>([]);
  const [t1Meta, setT1Meta] = useState<GeoMetadata | undefined>();
  const [t2Meta, setT2Meta] = useState<GeoMetadata | undefined>();

  const sampleQueries = [
    'What changed between these pre-flood and post-flood images?',
    'Identify flooded regions and calculate total submerged area.',
    'Where did urban construction or land clearing occur?'
  ];

  const handleRunAnalysis = async (queryText?: string) => {
    const q = queryText || query;
    if (!q.trim() || !t1Src || !t2Src) return;

    setIsAnalyzing(true);
    setLiveTrace([]);
    try {
      const res = await runAgentOrchestration(
        {
          mode: 'change',
          query: q,
          primaryImage: t1Src,
          secondaryImage: t2Src,
          primaryMetadata: t1Meta,
          secondaryMetadata: t2Meta
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
            <GitCompare className="w-5 h-5 text-emerald-400" />
            <span>MODE C: MULTI-IMAGE TEMPORAL CHANGE WORKBENCH</span>
          </h2>
          <p className="text-xs text-slate-400 font-sans">
            Bitemporal change detection across T1 & T2 scenes with interactive split slider and change heatmaps.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Input Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <GeoTiffUploader
              label="T1 Image (Pre-Event)"
              imageSrc={t1Src}
              onImageSelected={(src, meta) => {
                setT1Src(src);
                if (meta) setT1Meta(meta);
              }}
            />
            <GeoTiffUploader
              label="T2 Image (Post-Event)"
              imageSrc={t2Src}
              onImageSelected={(src, meta) => {
                setT2Src(src);
                if (meta) setT2Meta(meta);
              }}
            />
          </div>

          {/* Natural Query Input */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3 backdrop-blur-sm">
            <label className="text-xs font-semibold text-emerald-300 uppercase tracking-wider flex items-center space-x-1.5 font-mono">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Temporal Change Query</span>
            </label>

            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about temporal changes between T1 and T2..."
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500/80 rounded-lg p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition resize-none font-sans"
            />

            {/* Suggested Queries */}
            <div className="space-y-1.5">
              <div className="text-[10px] text-slate-400 uppercase font-mono flex items-center space-x-1">
                <HelpCircle className="w-3 h-3 text-emerald-400" />
                <span>Suggested Questions:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {sampleQueries.map((sq, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setQuery(sq);
                      handleRunAnalysis(sq);
                    }}
                    className="text-[11px] bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-slate-300 px-2.5 py-1 rounded-lg transition text-left font-sans"
                  >
                    {sq}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleRunAnalysis()}
              disabled={isAnalyzing || !query.trim()}
              className="w-full py-3 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl transition shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2"
            >
              {isAnalyzing ? (
                <>
                  <Clock className="w-4 h-4 text-slate-950 animate-spin" />
                  <span>Executing Siam-ChangeFormer...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-slate-950" />
                  <span>Execute Change Analysis</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Output Column */}
        <div className="lg:col-span-7 space-y-6">
          <SplitSliderViewer
            t1Src={t1Src}
            t2Src={t2Src}
            t1Meta={result?.geoMetadata || t1Meta}
            t2Meta={result?.geoMetadataSecondary || t2Meta}
            changeAreas={result?.changeAreas || []}
          />

          {isAnalyzing && liveTrace.length > 0 && (
            <div className="bg-slate-900/90 border border-emerald-500/40 p-4 rounded-xl space-y-2 font-mono text-xs shadow-xl animate-pulse">
              <div className="text-emerald-300 font-bold flex items-center space-x-2">
                <Clock className="w-4 h-4 text-emerald-400 animate-spin" />
                <span>Executing Siam-ChangeFormer Pipeline...</span>
              </div>
              <div className="space-y-1.5 pl-2 border-l border-emerald-500/30 text-[11px]">
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
