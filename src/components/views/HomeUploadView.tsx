import React, { useState, useRef } from 'react';
import { GeoMetadata, DemoMission } from '../../types/satquery';
import { DEMO_MISSIONS } from '../../data/demoMissions';
import { parseAndValidateImageFile } from '../../services/geoTiffService';
import { Upload, Send, ArrowRight, CheckCircle2, Globe, Layers, GitCompare, Eye, Cpu, Compass, Activity, ShieldCheck } from 'lucide-react';

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
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);

  const suggestionChips = [
    { label: 'Describe this scene', query: 'Describe the scene and summarize land cover density.' },
    { label: 'Find buildings', query: 'Where are the commercial office complexes and buildings?' },
    { label: 'Identify land cover', query: 'Identify major land cover types and vegetation zones.' },
    { label: 'What changed?', query: 'What changed between these pre-event and post-event images?' },
    { label: 'Compare optical and SAR', query: 'What information does SAR reveal that optical imagery misses?' },
  ];

  const executionSteps = [
    'INPUT DETECTED',
    'FORMAT VALIDATED',
    'MODALITY IDENTIFIED',
    'TEMPORAL RELATION CHECK',
    'TASK INTERPRETED',
    'SPECIALIST ANALYSIS SELECTED',
    'RESULT GENERATED'
  ];

  const handleFileUpload = async (file: File, isSecondary = false) => {
    setErrorMessage(null);
    setIsValidating(true);

    try {
      const validation = await parseAndValidateImageFile(file);
      if (!validation.valid) {
        setErrorMessage(validation.errorMessage || 'UNSUPPORTED FORMAT');
        setIsValidating(false);
        return;
      }

      const src = validation.previewUrl;
      if (isSecondary) {
        setSecondarySrc(src);
        setSecondaryMeta({
          ...validation.metadata,
          status: validation.status
        });
      } else {
        setPrimarySrc(src);
        setPrimaryMeta({
          ...validation.metadata,
          status: validation.status
        });
      }
      setIsValidating(false);
    } catch (err) {
      setErrorMessage('INGESTION FAILED\n\nThe file could not be processed. Please verify the file format and integrity.');
      setIsValidating(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files) {
      if (e.dataTransfer.files[0]) handleFileUpload(e.dataTransfer.files[0], false);
      if (e.dataTransfer.files[1]) handleFileUpload(e.dataTransfer.files[1], true);
    }
  };

  const handleSubmit = (queryOverride?: string) => {
    const q = queryOverride || query || 'Describe this satellite scene.';
    const defaultPrimary = primarySrc || DEMO_MISSIONS[0].precomputedResult.images.primary;
    const defaultSecondary = secondarySrc || (q.includes('change') || q.includes('SAR') ? DEMO_MISSIONS[0].precomputedResult.images.secondary : undefined);

    onStartAnalysis(defaultPrimary, q, defaultSecondary, primaryMeta, secondaryMeta);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-4 font-sans text-slate-100">
      {/* DEEP ORBIT CINEMATIC HERO */}
      <section className="relative rounded-3xl bg-[#040711] border border-slate-800/80 p-8 md:p-14 overflow-hidden shadow-2xl space-y-6 transition-smooth">
        {/* Subtle Atmospheric Earth Curvature Glow */}
        <div className="absolute -right-32 -bottom-48 w-[640px] h-[640px] rounded-full border border-cyan-500/20 bg-gradient-to-b from-cyan-500/10 to-transparent pointer-events-none blur-xl" />
        <div className="absolute -right-16 -bottom-32 w-[520px] h-[520px] rounded-full border border-sky-400/20 pointer-events-none" />

        {/* Orbit Telemetry Coordinates */}
        <div className="absolute right-10 top-8 text-[10px] font-mono text-slate-500 space-y-1 hidden md:block border-l border-slate-800/80 pl-3.5 select-none">
          <div>ORBIT PASS: <span className="text-slate-300">EOS-04 / PASS 0421</span></div>
          <div>SWATH LAT: <span className="text-slate-300">17.3850° N</span></div>
          <div>SWATH LON: <span className="text-slate-300">78.4867° E</span></div>
          <div>ALTITUDE: <span className="text-slate-300">542.8 km (SSO)</span></div>
          <div>SENSOR MODE: <span className="text-cyan-400">MULTIMODAL SYNTHESIS</span></div>
        </div>

        <div className="max-w-3xl space-y-5 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-950/80 border border-slate-800 text-slate-300 text-[11px] font-mono">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span className="uppercase tracking-wider font-semibold">ISRO SIH 2026 Problem Statement 26167</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight font-mono text-slate-100">
              SATQUERY <span className="text-cyan-400">AI</span>
            </h1>
            <h2 className="text-xl md:text-2xl text-slate-300 font-semibold tracking-wide">
              ASK EARTH OBSERVATION DATA ANYTHING
            </h2>
          </div>

          <p className="text-xs md:text-sm text-slate-400 font-sans leading-relaxed max-w-2xl">
            Understand satellite imagery through natural-language queries, visual evidence, and multimodal AI.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-xs">
            <button
              onClick={() => handleSubmit()}
              className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-lg shadow-md shadow-cyan-900/30 transition flex items-center space-x-2"
            >
              <span>START ANALYSIS</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onSelectDemoMission(DEMO_MISSIONS[0])}
              className="px-5 py-2.5 bg-slate-950 hover:bg-slate-900 border border-slate-700/80 text-slate-300 font-semibold rounded-lg transition flex items-center space-x-2"
            >
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>EXPLORE MISSIONS</span>
            </button>
          </div>
        </div>
      </section>

      {/* MISSION CONTROL DATA INGESTION & NATURAL LANGUAGE CONSOLE */}
      <section className="bg-[#0b0f19] border border-slate-800/80 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl relative">
        <div className="border-b border-slate-800/80 pb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-100 font-mono tracking-wider uppercase flex items-center space-x-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>MISSION CONTROL INGESTION</span>
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              Start a new observation. SatQuery AI automatically inspects files and selects the appropriate specialist workflow.
            </p>
          </div>

          <div className="text-[10px] font-mono text-slate-500 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
            AUTO-MODALITY ENGINE: <span className="text-emerald-400">ACTIVE</span>
          </div>
        </div>

        {/* QUERY INPUT CONSOLE */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block font-mono">
            ASK ABOUT THIS OBSERVATION
          </label>

          <div className="relative flex items-center">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder="What would you like to understand? (e.g. 'What changed between these images?' or 'Identify major built-up regions')..."
              rows={3}
              className="w-full bg-[#040711] border border-slate-800 focus:border-cyan-500/80 rounded-xl p-4 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition resize-none font-sans"
            />
            <button
              onClick={() => handleSubmit()}
              className="absolute right-3 bottom-3 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-lg transition flex items-center space-x-1.5 font-mono"
            >
              <span>ANALYZE</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* SUBTLE TEXT CHIPS (NO NEON/CARTOON BUTTONS) */}
          <div className="flex flex-wrap gap-2 text-xs pt-1">
            <span className="text-[10px] font-mono text-slate-500 self-center uppercase mr-1">SUGGESTED QUESTIONS:</span>
            {[
              { label: 'What objects are visible?', query: 'What objects and infrastructure are visible in this image?' },
              { label: 'Describe this scene.', query: 'Describe the scene and summarize land cover density.' },
              { label: 'Where is the built-up area?', query: 'Where are the commercial office complexes and built-up areas?' },
              { label: 'What changed between these images?', query: 'What changed between these pre-event and post-event images?' },
              { label: 'Compare the optical and SAR observations.', query: 'What information does SAR reveal that optical imagery misses?' },
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuery(chip.query);
                  handleSubmit(chip.query);
                }}
                className="px-3 py-1 rounded bg-[#040711] hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-xs text-slate-300 transition text-left font-mono"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* DATA INGESTION AREA */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-300">
            <span className="font-bold uppercase tracking-wider text-slate-400">+ ADD SATELLITE IMAGERY</span>
            <span className="text-[10px] text-slate-500">FORMATS: GeoTIFF • TIFF • PNG • JPEG (MAX 500 MB)</span>
          </div>

          {errorMessage && (
            <div className="bg-rose-950/90 border border-rose-800 p-4 rounded-xl text-xs text-rose-200 font-mono whitespace-pre-line shadow-lg">
              <div className="font-bold flex items-center space-x-2 text-rose-400 mb-1">
                <span>⚠️ INGESTION ERROR</span>
              </div>
              {errorMessage}
            </div>
          )}

          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border border-dashed rounded-xl p-6 text-center transition bg-[#040711] ${
              dragActive ? 'border-cyan-400 bg-slate-900/50' : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            {isValidating ? (
              <div className="py-8 space-y-2 font-mono text-xs text-cyan-400">
                <div className="animate-spin w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto" />
                <p>INSPECTING FILE HEADERS & GEOSPATIAL METADATA...</p>
              </div>
            ) : primarySrc ? (
              <div className="space-y-5">
                {/* INDIVIDUAL DATA CARDS FOR MULTI-IMAGE INGESTION */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                  {/* IMAGE 01 DATA CARD */}
                  <div className="bg-slate-950/90 border border-cyan-500/40 rounded-xl p-3.5 space-y-3 font-mono text-xs text-left shadow-lg relative overflow-hidden">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div>
                        <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">OBSERVATION 01</div>
                        <div className="text-xs text-slate-100 font-bold truncate max-w-[180px]">
                          {primaryMeta?.filename || 'Observation_Scene_1.tif'}
                        </div>
                      </div>
                      <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-bold uppercase">
                        {(primaryMeta as any)?.status || 'READY'}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <img src={primarySrc} alt="Image 01" className="w-20 h-16 rounded object-cover border border-slate-800 shrink-0" />
                      <div className="space-y-1 text-[11px] min-w-0 flex-1">
                        <div className="text-slate-300 font-semibold truncate">
                          SENSOR: <span className="text-cyan-300">{primaryMeta?.sensor || 'OPTICAL / SENTINEL-2'}</span>
                        </div>
                        <div className="text-slate-400 text-[10px]">FORMAT: {primaryMeta?.format || 'GeoTIFF'}</div>
                        <div className="text-slate-400 text-[10px]">SIZE: {primaryMeta?.fileSize || '12.45 MB'}</div>
                      </div>
                    </div>

                    <div className="pt-1 flex items-center justify-between border-t border-slate-900 text-[10px] text-slate-500">
                      <span>CRS: {primaryMeta?.crs || 'EPSG:32643'}</span>
                      <button
                        onClick={() => fileInputRef1.current?.click()}
                        className="text-cyan-400 hover:underline uppercase font-bold"
                      >
                        REPLACE
                      </button>
                    </div>
                  </div>

                  {/* IMAGE 02 DATA CARD OR + ADD OBSERVATION 02 */}
                  {secondarySrc ? (
                    <div className="bg-slate-950/90 border border-cyan-500/40 rounded-xl p-3.5 space-y-3 font-mono text-xs text-left shadow-lg relative overflow-hidden">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <div>
                          <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">OBSERVATION 02</div>
                          <div className="text-xs text-slate-100 font-bold truncate max-w-[180px]">
                            {secondaryMeta?.filename || 'Observation_Scene_2.tif'}
                          </div>
                        </div>
                        <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-bold uppercase">
                          {(secondaryMeta as any)?.status || 'READY'}
                        </span>
                      </div>

                      <div className="flex items-center space-x-3">
                        <img src={secondarySrc} alt="Image 02" className="w-20 h-16 rounded object-cover border border-slate-800 shrink-0" />
                        <div className="space-y-1 text-[11px] min-w-0 flex-1">
                          <div className="text-slate-300 font-semibold truncate">
                            SENSOR: <span className="text-cyan-300">{secondaryMeta?.sensor || 'SAR / SENTINEL-1'}</span>
                          </div>
                          <div className="text-slate-400 text-[10px]">FORMAT: {secondaryMeta?.format || 'GeoTIFF'}</div>
                          <div className="text-slate-400 text-[10px]">SIZE: {secondaryMeta?.fileSize || '14.10 MB'}</div>
                        </div>
                      </div>

                      <div className="pt-1 flex items-center justify-between border-t border-slate-900 text-[10px] text-slate-500">
                        <span>CRS: {secondaryMeta?.crs || 'EPSG:32643'}</span>
                        <button
                          onClick={() => fileInputRef2.current?.click()}
                          className="text-cyan-400 hover:underline uppercase font-bold"
                        >
                          REPLACE
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInputRef2.current?.click()}
                      className="bg-slate-950/60 hover:bg-slate-900 border border-dashed border-slate-700 hover:border-cyan-500/50 rounded-xl p-4 flex flex-col items-center justify-center space-y-2 text-left font-mono transition group"
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-900 group-hover:bg-cyan-950 border border-slate-800 flex items-center justify-center text-cyan-400">
                        <Upload className="w-4 h-4" />
                      </div>
                      <div className="text-center space-y-0.5">
                        <p className="text-xs font-bold text-slate-200 uppercase group-hover:text-cyan-300">
                          + ADD SECOND OBSERVATION
                        </p>
                        <p className="text-[10px] text-slate-400">
                          BI-TEMPORAL (T2) OR SAR C-BAND IMAGE
                        </p>
                      </div>
                    </button>
                  )}
                </div>

                {/* AUTOMATICALLY DETECTED WORKFLOW BADGE */}
                <div className="bg-slate-950/90 border border-emerald-500/30 rounded-xl p-3 max-w-xl mx-auto text-center font-mono text-xs space-y-1 shadow-inner">
                  <div className="flex items-center justify-center space-x-2 text-emerald-400 font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>AUTOMATIC WORKFLOW DETECTED:</span>
                    <span className="text-cyan-300 uppercase underline">
                      {secondarySrc
                        ? (secondaryMeta?.sensor.includes('SAR') || primaryMeta?.sensor.includes('SAR')
                          ? 'OPTICAL + SAR CROSS-MODAL ANALYSIS'
                          : 'BI-TEMPORAL CHANGE ANALYSIS (T1 vs T2)')
                        : 'SINGLE IMAGE ANALYSIS'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    No manual configuration needed. SatQuery AI automatically orchestrates the specialist workflow.
                  </p>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef1.current?.click()}
                className="cursor-pointer space-y-3 py-4"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center mx-auto text-cyan-400 shadow-inner">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">
                    Drop one or more satellite images or <span className="text-cyan-400 underline">SELECT FILES</span>
                  </p>
                  <p className="text-xs text-slate-400 font-mono">
                    Supported: GeoTIFF • TIFF • PNG • JPEG
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono">
                    Single Image • Bi-Temporal (T1 + T2) • Optical + SAR Cross-Modal
                  </p>
                </div>
              </div>
            )}

            <input ref={fileInputRef1} type="file" multiple accept=".tif,.tiff,.geotiff,.png,.jpg,.jpeg,image/tiff,image/x-tiff,image/png,image/jpeg" className="hidden" onChange={(e) => {
              if (e.target.files && e.target.files[0]) handleFileUpload(e.target.files[0], false);
              if (e.target.files && e.target.files[1]) handleFileUpload(e.target.files[1], true);
            }} />
            <input ref={fileInputRef2} type="file" accept=".tif,.tiff,.geotiff,.png,.jpg,.jpeg,image/tiff,image/x-tiff,image/png,image/jpeg" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], true)} />
          </div>
        </div>
      </section>

      {/* PRODUCT STORY SECTIONS (OPEN SPATIAL LAYOUT, NO CARD OVERLOAD) */}
      <section className="space-y-6 pt-4 font-mono">
        <div className="border-b border-slate-800/80 pb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
          EARTH OBSERVATION CAPABILITIES & WORKFLOW STORY
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="border-l-2 border-cyan-500/60 pl-3 space-y-1">
            <div className="text-[10px] text-cyan-400 font-bold">01 UNDERSTAND</div>
            <h4 className="text-xs font-bold text-slate-200 uppercase font-mono">NATURAL LANGUAGE Q&A</h4>
            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">Ask questions about satellite imagery naturally without complex GIS syntax.</p>
          </div>

          <div className="border-l-2 border-cyan-500/60 pl-3 space-y-1">
            <div className="text-[10px] text-cyan-400 font-bold">02 COMPARE</div>
            <h4 className="text-xs font-bold text-slate-200 uppercase font-mono">BEFORE → AFTER CHANGE</h4>
            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">Bi-temporal change detection with synchronized split sliders.</p>
          </div>

          <div className="border-l-2 border-cyan-500/60 pl-3 space-y-1">
            <div className="text-[10px] text-cyan-400 font-bold">03 FUSE</div>
            <h4 className="text-xs font-bold text-slate-200 uppercase font-mono">OPTICAL × SAR FUSION</h4>
            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">Combine optical imagery with all-weather microwave radar backscatter.</p>
          </div>

          <div className="border-l-2 border-cyan-500/60 pl-3 space-y-1">
            <div className="text-[10px] text-cyan-400 font-bold">04 EVIDENCE</div>
            <h4 className="text-xs font-bold text-slate-200 uppercase font-mono">VISUAL GROUNDING</h4>
            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">Every observation answer is directly tied to highlighted evidence bounding regions.</p>
          </div>

          <div className="border-l-2 border-cyan-500/60 pl-3 space-y-1">
            <div className="text-[10px] text-cyan-400 font-bold">05 ORCHESTRATE</div>
            <h4 className="text-xs font-bold text-slate-200 uppercase font-mono">SPECIALIST AGENT ROUTER</h4>
            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">SatQuery automatically selects and parameters the optimal specialist model.</p>
          </div>
        </div>
      </section>

      {/* FEATURED SATELLITE MISSIONS */}
      <section className="bg-[#0b0f19] border border-slate-800/80 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between text-xs font-mono text-slate-300">
          <span className="font-bold uppercase tracking-wider flex items-center space-x-2">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>FEATURED SATELLITE MISSIONS</span>
          </span>
          <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 uppercase">
            DEMO ANALYSIS
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {DEMO_MISSIONS.slice(0, 4).map((mission) => (
            <div
              key={mission.id}
              onClick={() => onSelectDemoMission(mission)}
              className="bg-[#040711] hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 rounded-xl p-3.5 flex items-center space-x-3 cursor-pointer transition group"
            >
              <img
                src={mission.thumbnail}
                alt={mission.title}
                className="w-16 h-16 rounded object-cover border border-slate-800 shrink-0"
              />
              <div className="space-y-1 flex-1 min-w-0 font-mono">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 truncate">
                    {mission.title}
                  </h4>
                  <span className="text-[9px] bg-slate-900 text-slate-400 px-1.5 py-0.2 rounded border border-slate-800">
                    DEMO ANALYSIS
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans truncate">{mission.location}</p>
                <div className="text-[10px] text-cyan-400">{mission.sensor}</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 shrink-0" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

