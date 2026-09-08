import React, { useState, useRef, useEffect } from 'react';
import { GeoMetadata, DemoMission } from '../../types/satquery';
import { DEMO_MISSIONS } from '../../data/demoMissions';
import { satqueryApi } from '../../services/satqueryApi';

interface HomeUploadViewProps {
  onStartAnalysis: (
    primarySrc: string,
    query: string,
    secondarySrc?: string,
    primaryMeta?: GeoMetadata,
    secondaryMeta?: GeoMetadata
  ) => void;
  onSelectDemoMission: (mission: DemoMission) => void;
}

export const HomeUploadView: React.FC<HomeUploadViewProps> = ({
  onStartAnalysis,
  onSelectDemoMission
}) => {
  const [primarySrc, setPrimarySrc] = useState<string | null>(null);
  const [secondarySrc, setSecondarySrc] = useState<string | null>(null);
  const [primaryMeta, setPrimaryMeta] = useState<GeoMetadata | undefined>();
  const [secondaryMeta, setSecondaryMeta] = useState<GeoMetadata | undefined>();
  const [query, setQuery] = useState<string>('');
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [telemetryLat, setTelemetryLat] = useState<string>('-23.5521');
  const [telemetryLon, setTelemetryLon] = useState<string>('85.3402');
  const [telemetrySensor, setTelemetrySensor] = useState<'IDLE' | 'ACTIVE'>('IDLE');

  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetryLat((-23.5521 - Math.random() * 0.005).toFixed(4));
      setTelemetryLon((85.3402 + Math.random() * 0.005).toFixed(4));
      setTelemetrySensor(Math.random() > 0.8 ? 'ACTIVE' : 'IDLE');
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const [activeModality, setActiveModality] = useState<'OPTICAL' | 'MULTISPECTRAL' | 'SAR' | 'BITEMPORAL'>('OPTICAL');

  const handleFileUpload = async (file: File, isSecondary = false, modalityOverride?: any) => {
    setErrorMessage(null);
    setIsValidating(true);

    const mod = modalityOverride || activeModality;

    try {
      const uploadRes = await satqueryApi.uploadImage(file, isSecondary, mod);
      if (uploadRes.status === 'INCOMPATIBLE') {
        setErrorMessage(uploadRes.message || 'UNSUPPORTED FORMAT OR INCOMPATIBLE METADATA');
        setIsValidating(false);
        return;
      }

      if (isSecondary) {
        setSecondarySrc(uploadRes.url);
        setSecondaryMeta(uploadRes.metadata);
      } else {
        setPrimarySrc(uploadRes.url);
        setPrimaryMeta(uploadRes.metadata);
      }
      setIsValidating(false);
    } catch (err) {
      setErrorMessage('INGESTION FAILED. Please check file format.');
      setIsValidating(false);
    }
  };

  const handleSubmit = (queryOverride?: string) => {
    const q = queryOverride || query || 'Describe this satellite scene.';
    const defaultPrimary = primarySrc || DEMO_MISSIONS[0].precomputedResult.images.primary;
    const defaultSecondary = secondarySrc || (q.includes('change') || q.includes('SAR') ? DEMO_MISSIONS[0].precomputedResult.images.secondary : undefined);

    onStartAnalysis(defaultPrimary, q, defaultSecondary, primaryMeta, secondaryMeta);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-12">
      {/* Superdesign Hero Header */}
      <header className="mb-16 text-left animate-[fade-slide-up_0.6s_ease-out_forwards]">
        <h1 className="heading text-5xl lg:text-6xl font-bold text-white mb-6 uppercase tracking-tight">
          Earth Observation <br />Intelligence
        </h1>
        <p className="text-lg text-slate-400 font-medium max-w-2xl leading-[1.6] tracking-wide font-sans">
          INTELLIGENT VISION-LANGUAGE ASSISTANT FOR ORBITAL DATASETS.
        </p>
        <p className="text-base text-slate-300 font-normal max-w-3xl mt-4 leading-relaxed font-sans">
          Query global satellite datasets using natural language. Execute multispectral analysis, change detection, and SAR object grounding with mission-grade accuracy.
        </p>
      </header>

      {/* Data Ingestion Console */}
      <section className="mb-16 relative overflow-hidden animate-[fade-slide-up_0.6s_ease-out_0.2s_forwards]">
        <div className="scanline"></div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="mono text-xs text-slate-500 uppercase tracking-[0.2em] font-medium">Data Ingestion Console</h2>
          <div className="h-[1px] flex-1 bg-slate-800 ml-6"></div>
        </div>

        {errorMessage && (
          <div className="mb-4 bg-rose-950/80 border border-rose-800 p-3 rounded text-xs text-rose-300 mono">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Ingested Input Pictures Visual Preview Space */}
        {(primarySrc || secondarySrc) && (
          <div className="mb-6 p-4 bg-[#070a12] border border-cyan-500/40 rounded-xl space-y-3 shadow-lg font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-cyan-400 font-bold uppercase tracking-wider flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>LOADED INPUT IMAGERY PREVIEW</span>
              </span>
              <button
                onClick={() => {
                  setPrimarySrc(null);
                  setSecondarySrc(null);
                  setPrimaryMeta(undefined);
                  setSecondaryMeta(undefined);
                }}
                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-rose-400 text-[10px] rounded transition"
              >
                ✕ REMOVE INPUT IMAGERY
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 font-sans">
              {primarySrc && (
                <div className="flex space-x-3 bg-slate-950 p-3 rounded-lg border border-slate-800 items-center">
                  <img
                    src={primarySrc}
                    alt="Primary Input Scene"
                    className="w-24 h-20 rounded object-cover border border-cyan-500/30 shrink-0"
                  />
                  <div className="space-y-1 font-mono text-[11px] min-w-0">
                    <div className="text-cyan-300 font-bold truncate">
                      {primaryMeta?.filename || 'Primary_Scene.tif'}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      ROLE: <strong className="text-slate-200">PRIMARY / T1 SCENE</strong>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      SENSOR: <strong className="text-slate-200">{primaryMeta?.sensor || 'OPTICAL'}</strong>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      DIM: <strong className="text-slate-200">{primaryMeta?.dimensions || '2048x2048'}</strong> | CRS: <strong className="text-slate-200">{primaryMeta?.crs || 'EPSG:32643'}</strong>
                    </div>
                  </div>
                </div>
              )}

              {secondarySrc && (
                <div className="flex space-x-3 bg-slate-950 p-3 rounded-lg border border-slate-800 items-center">
                  <img
                    src={secondarySrc}
                    alt="Secondary Input Scene"
                    className="w-24 h-20 rounded object-cover border border-purple-500/30 shrink-0"
                  />
                  <div className="space-y-1 font-mono text-[11px] min-w-0">
                    <div className="text-purple-300 font-bold truncate">
                      {secondaryMeta?.filename || 'Secondary_Scene.tif'}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      ROLE: <strong className="text-slate-200">SECONDARY / T2 / SAR SCENE</strong>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      SENSOR: <strong className="text-slate-200">{secondaryMeta?.sensor || 'SAR / T2'}</strong>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      DIM: <strong className="text-slate-200">{secondaryMeta?.dimensions || '2048x2048'}</strong> | CRS: <strong className="text-slate-200">{secondaryMeta?.crs || 'EPSG:32643'}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 relative z-0 border border-white/15">
          {/* OPTICAL CARD */}
          <div
            onClick={() => {
              setActiveModality('OPTICAL');
              fileInputRef1.current?.click();
            }}
            className="group shimmer-trigger relative overflow-hidden border-r border-white/10 bg-white/[0.02] p-6 flex flex-col items-center justify-center gap-4 h-[180px] cursor-pointer hover:bg-[#0084ff]/10 hover:border-[#0084ff] hover:shadow-[0_0_20px_rgba(0,132,255,0.15)] transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover:text-[#0084ff] transition-colors"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
            <div className="flex flex-col items-center gap-1">
              <span className="mono text-[10px] font-semibold text-slate-400 tracking-widest group-hover:text-white">OPTICAL</span>
              <span className="mono text-[8px] text-slate-600 uppercase group-hover:text-blue-400 transition-colors">
                {primarySrc ? `LOADED: ${primaryMeta?.filename || 'SCENE 1'}` : 'OPTICAL: RGB Panchromatic'}
              </span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 opacity-0 group-hover:opacity-100 transition-all duration-300"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
          </div>

          {/* MULTISPECTRAL CARD */}
          <div
            onClick={() => {
              setActiveModality('MULTISPECTRAL');
              fileInputRef1.current?.click();
            }}
            className="group shimmer-trigger relative overflow-hidden border-r border-white/10 bg-white/[0.02] p-6 flex flex-col items-center justify-center gap-4 h-[180px] cursor-pointer hover:bg-[#0084ff]/10 hover:border-[#0084ff] hover:shadow-[0_0_20px_rgba(0,132,255,0.15)] transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover:text-[#0084ff] transition-colors"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>
            <div className="flex flex-col items-center gap-1">
              <span className="mono text-[10px] font-semibold text-slate-400 tracking-widest group-hover:text-white">MULTISPECTRAL</span>
              <span className="mono text-[8px] text-slate-600 uppercase group-hover:text-blue-400 transition-colors">8-13 BANDS (GeoTIFF)</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 opacity-0 group-hover:opacity-100 transition-all duration-300"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
          </div>

          {/* SAR CARD */}
          <div
            onClick={() => {
              setActiveModality('SAR');
              fileInputRef2.current?.click();
            }}
            className="group shimmer-trigger relative overflow-hidden border-r border-white/10 bg-white/[0.02] p-6 flex flex-col items-center justify-center gap-4 h-[180px] cursor-pointer hover:bg-[#0084ff]/10 hover:border-[#0084ff] hover:shadow-[0_0_20px_rgba(0,132,255,0.15)] transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover:text-[#0084ff] transition-colors"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/></svg>
            <div className="flex flex-col items-center gap-1">
              <span className="mono text-[10px] font-semibold text-slate-400 tracking-widest group-hover:text-white">SAR</span>
              <span className="mono text-[8px] text-slate-600 uppercase group-hover:text-blue-400 transition-colors">
                {secondarySrc ? `SAR LOADED: ${secondaryMeta?.filename}` : 'C-BAND HH/VV'}
              </span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 opacity-0 group-hover:opacity-100 transition-all duration-300"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
          </div>

          {/* BI-TEMPORAL CARD */}
          <div
            onClick={() => {
              setActiveModality('BITEMPORAL');
              if (!primarySrc) {
                fileInputRef1.current?.click();
              } else {
                fileInputRef2.current?.click();
              }
            }}
            className="group shimmer-trigger relative overflow-hidden border-r border-white/10 bg-white/[0.02] p-6 flex flex-col items-center justify-center gap-4 h-[180px] cursor-pointer hover:bg-[#0084ff]/10 hover:border-[#0084ff] hover:shadow-[0_0_20px_rgba(0,132,255,0.15)] transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover:text-[#0084ff] transition-colors"><path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/></svg>
            <div className="flex flex-col items-center gap-1">
              <span className="mono text-[10px] font-semibold text-slate-400 tracking-widest group-hover:text-white">BI-TEMPORAL</span>
              <span className="mono text-[8px] text-slate-600 uppercase group-hover:text-blue-400 transition-colors">
                {secondarySrc ? 'T1 + T2 PAIR LOADED' : primarySrc ? 'CLICK TO UPLOAD T2 (AFTER)' : 'CLICK TO UPLOAD T1 (BEFORE)'}
              </span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 opacity-0 group-hover:opacity-100 transition-all duration-300"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
          </div>
        </div>

        <input
          ref={fileInputRef1}
          type="file"
          multiple
          accept=".tif,.tiff,.geotiff,.png,.jpg,.jpeg"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) handleFileUpload(e.target.files[0], false, activeModality);
            if (e.target.files && e.target.files[1]) handleFileUpload(e.target.files[1], true, activeModality);
          }}
        />
        <input
          ref={fileInputRef2}
          type="file"
          accept=".tif,.tiff,.geotiff,.png,.jpg,.jpeg"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], true, activeModality)}
        />
      </section>

      {/* Mission Query Console */}
      <section className="animate-[fade-slide-up_0.6s_ease-out_0.4s_forwards]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="mono text-xs text-slate-500 uppercase tracking-[0.2em] font-medium">Mission Query Console</h2>
          <div className="h-[1px] flex-1 bg-slate-800 ml-6"></div>
        </div>

        <div className="relative query-glow p-[1px] rounded-sm flex items-center bg-white/10 group-focus-within:bg-[#0084ff]/20">
          <div className="pl-6">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] group-focus-within:bg-[#0084ff] group-focus-within:shadow-[0_0_8px_rgba(0,132,255,0.8)] transition-all"></div>
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || (e.key === 'Enter' && (e.metaKey || e.ctrlKey))) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="ENTER YOUR MISSION QUERY..."
            className="w-full bg-[#05090f] border-none px-4 py-7 text-white placeholder-slate-600 outline-none transition-all duration-300 font-medium text-lg rounded-sm"
          />

          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
            <span className="mono text-[10px] text-slate-500 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 8h.01"/><path d="M12 12h.01"/><path d="M14 16h.01"/><rect width="20" height="16" x="2" y="4" rx="2"/></svg>
              CMD + ENTER
            </span>
            <button
              id="cta-execute"
              onClick={() => handleSubmit()}
              className="bg-[#0084ff] hover:bg-blue-400 hover:scale-110 hover:shadow-[0_0_15px_rgba(0,132,255,0.5)] text-white p-3 rounded-sm transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
          </div>
        </div>

        {/* Suggestion Chips */}
        <div className="mt-6 flex flex-wrap gap-3 stagger-in font-sans">
          {[
            { id: 'suggest-1', label: 'What areas show recent deforestation?', query: 'What areas show recent deforestation?' },
            { id: 'suggest-2', label: 'Detect urban expansion in 2023-2024', query: 'Detect urban expansion in 2023-2024' },
            { id: 'suggest-3', label: 'SAR coherence analysis for stability', query: 'SAR coherence analysis for stability' },
            { id: 'suggest-4', label: 'Compare vegetation indices T1 vs T2', query: 'Compare vegetation indices T1 vs T2' },
          ].map((chip) => (
            <button
              key={chip.id}
              id={chip.id}
              onClick={() => {
                setQuery(chip.query);
                handleSubmit(chip.query);
              }}
              className="px-4 py-2 bg-transparent border border-white/20 hover:border-[#0084ff] hover:bg-[#0084ff]/10 hover:scale-105 transition-all text-xs text-white font-semibold tracking-wide rounded-full py-2.5"
            >
              {chip.label}
            </button>
          ))}
        </div>
      </section>

      {/* Telemetry Footer */}
      <footer className="mt-24 pt-8 border-t border-slate-900 flex justify-between items-center text-[10px] mono text-slate-500 tracking-widest uppercase">
        <div className="flex gap-8">
          <div className="telemetry-item flex items-center gap-2" style={{ animationDelay: '100ms' }}>
            <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse"></div>
            <span className="text-slate-500">LAT:</span> <span id="tel-lat" className="text-blue-400">{telemetryLat}</span>
          </div>
          <div className="telemetry-item flex items-center gap-2" style={{ animationDelay: '200ms' }}>
            <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse"></div>
            <span className="text-slate-500">LON:</span> <span id="tel-lon" className="text-blue-400">{telemetryLon}</span>
          </div>
          <div className="telemetry-item flex items-center gap-2" style={{ animationDelay: '300ms' }}>
            <div
              className={`w-1 h-1 rounded-full ${
                telemetrySensor === 'ACTIVE' ? 'bg-amber-500 animate-ping' : 'bg-emerald-500 animate-pulse'
              }`}
            ></div>
            <span className="text-slate-500">SENSOR:</span>{' '}
            <span className={telemetrySensor === 'ACTIVE' ? 'text-amber-400' : 'text-emerald-400'}>{telemetrySensor}</span>
          </div>
        </div>
        <div className="telemetry-item px-3 py-1 bg-white/5 border border-white/10 rounded-sm" style={{ animationDelay: '400ms' }}>
          Ver 0.4.2-ALPHA | ISRO/SIH 2026 STAGE
        </div>
      </footer>
    </div>
  );
};
