import React, { useState } from 'react';
import { ExecutionResult, GeoMetadata, TraceStep } from '../../types/satquery';
import { runAgentOrchestration } from '../../services/agentOrchestrator';
import { GeoTiffUploader } from '../common/GeoTiffUploader';
import { InteractiveViewer } from '../common/InteractiveViewer';
import { TraceVisualizer } from '../common/TraceVisualizer';
import { ResultCard } from '../common/ResultCard';
import {
  Layers,
  Send,
  Sparkles,
  HelpCircle,
  Clock,
  Radio
} from 'lucide-react';

interface OpticalSarViewProps {
  onGenerateReport: (res: ExecutionResult) => void;
}

export const OpticalSarView: React.FC<OpticalSarViewProps> = ({ onGenerateReport }) => {
  const [opticalSrc, setOpticalSrc] = useState<string>(
    '/assets/scenes/scene-01.jpg'
  );
  const [sarSrc, setSarSrc] = useState<string>(
    '/assets/scenes/scene-03.jpg'
  );
  const [query, setQuery] = useState<string>(
    'What information does SAR reveal that optical imagery misses due to cloud cover?'
  );
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [liveTrace, setLiveTrace] = useState<TraceStep[]>([]);
  const [opticalMeta, setOpticalMeta] = useState<GeoMetadata | undefined>();
  const [sarMeta, setSarMeta] = useState<GeoMetadata | undefined>();

  const sampleQueries = [
    'What information does SAR reveal that optical imagery misses due to cloud cover?',
    'Identify maritime vessels and container ships across both modalities.',
    'Analyze complementary structural details of port jetties and breakwaters.'
  ];

  const handleRunAnalysis = async (queryText?: string) => {
    const q = queryText || query;
    if (!q.trim() || !opticalSrc || !sarSrc) return;

    setIsAnalyzing(true);
    setLiveTrace([]);
    try {
      const res = await runAgentOrchestration(
        {
          mode: 'optical-sar',
          query: q,
          primaryImage: opticalSrc,
          secondaryImage: sarSrc,
          primaryMetadata: opticalMeta,
          secondaryMetadata: sarMeta
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
            <Layers className="w-5 h-5 text-purple-400" />
            <span>MODE B: CROSS-MODAL OPTICAL + SAR WORKBENCH</span>
          </h2>
          <p className="text-xs text-slate-400 font-sans">
            Co-registered Optical/Multispectral + Microwave Synthetic Aperture Radar (SAR) for cloud penetration and structural detection.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Input Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <GeoTiffUploader
              label="Optical (RGB + SWIR)"
              imageSrc={opticalSrc}
              onImageSelected={(src, meta) => {
                setOpticalSrc(src);
                if (meta) setOpticalMeta(meta);
              }}
            />
            <GeoTiffUploader
              label="SAR (C-Band VV/VH)"
              imageSrc={sarSrc}
              onImageSelected={(src, meta) => {
                setSarSrc(src);
                if (meta) setSarMeta(meta);
              }}
            />
          </div>

          {/* Fused Query Box */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3 backdrop-blur-sm">
            <label className="text-xs font-semibold text-purple-300 uppercase tracking-wider flex items-center space-x-1.5 font-mono">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Cross-Modal Fusion Query</span>
            </label>

            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about complementary optical and SAR features..."
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500/80 rounded-lg p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition resize-none font-sans"
            />

            {/* Suggested Queries */}
            <div className="space-y-1.5">
              <div className="text-[10px] text-slate-400 uppercase font-mono flex items-center space-x-1">
                <HelpCircle className="w-3 h-3 text-purple-400" />
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
                    className="text-[11px] bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/40 text-slate-300 px-2.5 py-1 rounded-lg transition text-left font-sans"
                  >
                    {sq}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleRunAnalysis()}
              disabled={isAnalyzing || !query.trim()}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-purple-500/20 flex items-center justify-center space-x-2"
            >
              {isAnalyzing ? (
                <>
                  <Clock className="w-4 h-4 text-white animate-spin" />
                  <span>Executing SAR-Opt-FusionNet...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-white" />
                  <span>Execute Optical+SAR Fusion</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Output Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InteractiveViewer
              imageSrc={opticalSrc}
              title="Optical Scene (Sentinel-2)"
              geoMetadata={opticalMeta}
              heightClass="h-[320px]"
            />
            <InteractiveViewer
              imageSrc={sarSrc}
              title="SAR C-Band (RISAT-1)"
              groundingBoxes={result?.groundingBoxes || []}
              geoMetadata={sarMeta}
              heightClass="h-[320px]"
            />
          </div>

          {isAnalyzing && liveTrace.length > 0 && (
            <div className="bg-slate-900/90 border border-purple-500/40 p-4 rounded-xl space-y-2 font-mono text-xs shadow-xl animate-pulse">
              <div className="text-purple-300 font-bold flex items-center space-x-2">
                <Clock className="w-4 h-4 text-purple-400 animate-spin" />
                <span>Executing SAR-Opt-FusionNet Pipeline...</span>
              </div>
              <div className="space-y-1.5 pl-2 border-l border-purple-500/30 text-[11px]">
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
