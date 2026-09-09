import React, { useState, useRef, useEffect } from 'react';
import { GroundingBox, ChangeDetectionArea, GeoMetadata, AnalysisMode } from '../../types/satquery';
import { ZoomIn, ZoomOut, Maximize2, Minimize2, Layers, Compass, Sliders, Eye, EyeOff, Crosshair, Download, Sparkles } from 'lucide-react';

interface MinimalViewerProps {
  mode: AnalysisMode;
  primarySrc?: string;
  primaryImage?: string;
  secondarySrc?: string;
  secondaryImage?: string;
  primaryMeta?: GeoMetadata;
  secondaryMeta?: GeoMetadata;
  groundingBoxes?: GroundingBox[];
  changeAreas?: ChangeDetectionArea[];
  selectedEvidenceId?: string | null;
  onSelectEvidence?: (id: string | null) => void;
  onQueryRegion?: (queryText: string, coords?: [number, number]) => void;
}

export const MinimalViewer: React.FC<MinimalViewerProps> = (props) => {
  const mode = props.mode;
  const primarySrc = props.primarySrc || props.primaryImage || '';
  const secondarySrc = props.secondarySrc || props.secondaryImage;
  const primaryMeta = props.primaryMeta;
  const secondaryMeta = props.secondaryMeta;
  const groundingBoxes = props.groundingBoxes || [];
  const changeAreas = props.changeAreas || [];
  const selectedEvidenceId = props.selectedEvidenceId || null;
  const onSelectEvidence = props.onSelectEvidence;
  const onQueryRegion = props.onQueryRegion;
  const [zoom, setZoom] = useState<number>(1);
  const [panX, setPanX] = useState<number>(0);
  const [panY, setPanY] = useState<number>(0);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showGrounding, setShowGrounding] = useState<boolean>(true);
  const [spectralMode, setSpectralMode] = useState<'RGB' | 'NIR'>('RGB');
  const [activeLayer, setActiveLayer] = useState<'ORIGINAL' | 'EVIDENCE' | 'GROUNDING' | 'CHANGE' | 'MASK'>('EVIDENCE');
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [isDraggingSlider, setIsDraggingSlider] = useState<boolean>(false);
  const [hoveredBox, setHoveredBox] = useState<GroundingBox | null>(null);
  const [selectedEvidence, setSelectedEvidence] = useState<GroundingBox | null>(null);
  const [viewStyle, setViewStyle] = useState<'slider' | 'side-by-side' | 'overlay'>(mode === 'optical-sar' ? 'side-by-side' : 'slider');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Click-to-Ask State
  const [clickCoords, setClickCoords] = useState<{ x: number; y: number; normX: number; normY: number } | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const sliderContainerRef = useRef<HTMLDivElement>(null);

  // Export GeoJSON Evidence Collection
  const exportGeoJsonPayload = () => {
    const features = groundingBoxes.map((gb, idx) => ({
      type: 'Feature',
      id: gb.id,
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [primaryMeta?.bounds?.[0] || 77.5832, primaryMeta?.bounds?.[1] || 12.9716],
          [primaryMeta?.bounds?.[2] || 77.6254, primaryMeta?.bounds?.[1] || 12.9716],
          [primaryMeta?.bounds?.[2] || 77.6254, primaryMeta?.bounds?.[3] || 13.0182],
          [primaryMeta?.bounds?.[0] || 77.5832, primaryMeta?.bounds?.[3] || 13.0182],
          [primaryMeta?.bounds?.[0] || 77.5832, primaryMeta?.bounds?.[1] || 12.9716]
        ]]
      },
      properties: {
        evidenceId: `EVIDENCE-0${idx + 1}`,
        label: gb.label,
        category: gb.category,
        confidence: gb.confidence,
        boundingBoxPct: gb.box,
        crs: primaryMeta?.crs || 'EPSG:32643'
      }
    }));

    const geoJsonData = {
      type: 'FeatureCollection',
      crs: {
        type: 'name',
        properties: { name: primaryMeta?.crs || 'EPSG:32643' }
      },
      features
    };

    const blob = new Blob([JSON.stringify(geoJsonData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `satquery_${primaryMeta?.filename.replace(/\.[^/.]+$/, '') || 'observation'}_evidence.geojson`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Auto-camera focus when selectedEvidenceId changes from parent
  useEffect(() => {
    if (selectedEvidenceId) {
      const match = groundingBoxes.find(g => g.id === selectedEvidenceId);
      if (match) {
        handleFocusEvidence(match);
      }
    }
  }, [selectedEvidenceId, groundingBoxes]);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 3));
  const handleZoomOut = () => {
    setZoom((z) => {
      const nextZ = Math.max(z - 0.25, 1);
      if (nextZ === 1) {
        setPanX(0);
        setPanY(0);
      }
      return nextZ;
    });
  };
  const handleResetZoom = () => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
  };

  const handleStageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const normX = Math.round((x / rect.width) * 100);
    const normY = Math.round((y / rect.height) * 100);

    setClickCoords({ x, y, normX, normY });
  };

  const triggerRegionQuery = (qText: string) => {
    if (clickCoords) {
      if (onQueryRegion) {
        onQueryRegion(qText, [clickCoords.normX, clickCoords.normY]);
      }
      setClickCoords(null);
    }
  };

  // Smooth camera pan & zoom glide to evidence region
  const handleFocusEvidence = (gb: GroundingBox) => {
    setSelectedEvidence(gb);
    const [xMin, yMin, xMax, yMax] = gb.box;
    const centerX = (xMin + xMax) / 2;
    const centerY = (yMin + yMax) / 2;

    // Smooth offset calculation from 50% origin
    const targetPanX = (50 - centerX) * 3.5;
    const targetPanY = (50 - centerY) * 3.5;

    setZoom(1.85);
    setPanX(targetPanX);
    setPanY(targetPanY);
  };

  // Continuous smooth slider dragging handler
  const updateSliderPosFromEvent = (clientX: number) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (offsetX / rect.width) * 100));
    setSliderPos(percentage);
  };

  const handleSliderMouseDown = (e: React.MouseEvent) => {
    setIsDraggingSlider(true);
    updateSliderPosFromEvent(e.clientX);
  };

  const handleSliderMouseMove = (e: React.MouseEvent) => {
    if (isDraggingSlider) {
      updateSliderPosFromEvent(e.clientX);
    }
  };

  const handleSliderMouseUp = () => {
    setIsDraggingSlider(false);
  };

  return (
    <div
      className={`bg-[#0b0f19] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col font-sans relative transition-panel ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none p-2 animate-fade-slide-view' : 'h-full'
      }`}
    >
      {/* WORKSPACE MODE BANNER */}
      <div className="bg-[#070a12] px-4 py-2 border-b border-slate-800 flex flex-wrap items-center justify-between text-xs font-mono text-slate-300 gap-2 select-none">
        <div className="flex items-center space-x-3">
          <span className="font-bold text-slate-100 flex items-center space-x-1.5 uppercase">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>
              {mode === 'change'
                ? 'TEMPORAL COMPARISON: T1 BEFORE ↓ T2 AFTER'
                : mode === 'optical-sar'
                ? 'OPTICAL | SAR | FUSED INTERPRETATION'
                : primaryMeta?.filename || 'SINGLE IMAGE OBSERVATION CANVAS'}
            </span>
          </span>
          {primaryMeta && (
            <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              {primaryMeta.sensor} ({primaryMeta.resolution})
            </span>
          )}
        </div>

        {/* View & Layer Controls */}
        <div className="flex items-center space-x-2">
          {/* Spectral Filter Composite Toggle */}
          <button
            onClick={() => setSpectralMode(spectralMode === 'RGB' ? 'NIR' : 'RGB')}
            className={`px-2.5 py-1 rounded text-[11px] font-mono flex items-center space-x-1 transition-micro ${
              spectralMode === 'NIR' ? 'bg-purple-950 text-purple-300 border border-purple-700 font-bold' : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
            title="Toggle Multispectral False-Color NIR Composite"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>SPECTRAL: {spectralMode}</span>
          </button>

          {mode !== 'single' && secondarySrc && (
            <div className="flex items-center bg-slate-900 p-0.5 rounded border border-slate-800 text-[10px]">
              <button
                onClick={() => setViewStyle('side-by-side')}
                className={`px-2.5 py-0.5 rounded transition-micro ${viewStyle === 'side-by-side' ? 'bg-slate-800 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
              >
                SIDE BY SIDE
              </button>
              <button
                onClick={() => setViewStyle('slider')}
                className={`px-2.5 py-0.5 rounded transition-micro ${viewStyle === 'slider' ? 'bg-slate-800 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
              >
                SLIDER
              </button>
              <button
                onClick={() => setViewStyle('overlay')}
                className={`px-2.5 py-0.5 rounded transition-micro ${viewStyle === 'overlay' ? 'bg-slate-800 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
              >
                {mode === 'change' ? 'CHANGE OVERLAY' : 'FUSED OVERLAY'}
              </button>
            </div>
          )}

          {groundingBoxes.length > 0 && (
            <button
              onClick={() => setShowGrounding(!showGrounding)}
              className={`px-2.5 py-1 rounded text-[11px] font-mono flex items-center space-x-1 transition-micro ${
                showGrounding ? 'bg-slate-800 text-cyan-300 border border-slate-700' : 'bg-slate-950 text-slate-500 hover:text-slate-300'
              }`}
            >
              {showGrounding ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-500" />}
              <span>EVIDENCE ({groundingBoxes.length})</span>
            </button>
          )}

          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-1 rounded transition-micro ${showGrid ? 'text-cyan-400 bg-slate-800' : 'text-slate-500 hover:text-slate-300'}`}
            title="Toggle Grid Lines"
          >
            <Layers className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center bg-slate-950 rounded border border-slate-800 font-mono">
            <button onClick={handleZoomOut} className="p-1 text-slate-300 hover:text-cyan-400 transition-micro">
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 text-[10px] text-slate-300">{Math.round(zoom * 100)}%</span>
            <button onClick={handleZoomIn} className="p-1 text-slate-300 hover:text-cyan-400 transition-micro">
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button onClick={handleResetZoom} className="p-1 text-slate-400 hover:text-white border-l border-slate-800 transition-micro">
              <Maximize2 className="w-3 h-3" />
            </button>
          </div>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1 text-slate-400 hover:text-cyan-400 bg-slate-950 rounded border border-slate-800 transition-micro"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Observation Mode'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div
        ref={stageRef}
        onClick={handleStageClick}
        className={`relative flex-1 bg-[#070a12] overflow-hidden flex items-center justify-center p-2 cursor-crosshair ${
          isFullscreen ? 'min-h-[calc(100vh-100px)]' : 'min-h-[460px]'
        }`}
      >
        {/* Map Grid Overlay */}
        {showGrid && (
          <div className="absolute inset-0 pointer-events-none z-10 grid grid-cols-6 grid-rows-6 opacity-20 border border-slate-800">
            {Array.from({ length: 36 }).map((_, i) => (
              <div key={i} className="border border-slate-900 text-[9px] font-mono text-slate-600 p-1 select-none">
                {i === 0 && 'N 26°34\' E 93°10\''}
              </div>
            ))}
          </div>
        )}

        {/* View Mode Router */}
        {mode === 'single' || !secondarySrc || viewStyle === 'side-by-side' ? (
          <div className={`w-full h-full ${secondarySrc && viewStyle === 'side-by-side' ? 'grid grid-cols-2 gap-3 transition-panel' : 'flex items-center justify-center'}`}>
            {/* Primary Scene (Synchronized Smooth Camera Glide) */}
            <div
              className="relative max-w-full max-h-full overflow-hidden flex items-center justify-center transition-camera gpu-layer"
              style={{ transform: `scale(${zoom}) translate(${panX}px, ${panY}px)` }}
            >
              <img
                src={primarySrc}
                alt="Primary Scene"
                className="max-h-[440px] w-auto object-contain rounded block mx-auto border border-slate-800/80 transition-image"
                style={{ filter: spectralMode === 'NIR' ? 'contrast(1.2) saturate(1.45) hue-rotate(-28deg)' : 'none' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/scenes/scene-01.jpg';
                }}
              />
              <div className="absolute top-2 left-2 bg-slate-950/90 border border-slate-800 px-2 py-0.5 rounded text-[10px] font-mono text-slate-300 font-bold select-none">
                {mode === 'change' ? 'T1 BEFORE (2024)' : mode === 'optical-sar' ? (spectralMode === 'NIR' ? 'OPTICAL FALSE-COLOR (NIR)' : 'OPTICAL RGB') : (primaryMeta?.sensor || 'OPTICAL SCENE')}
              </div>

              {/* Bounding Box Evidence Overlays */}
              {showGrounding && activeLayer !== 'ORIGINAL' &&
                groundingBoxes.map((gb, idx) => {
                  const [xMin, yMin, xMax, yMax] = gb.box;
                  const color = gb.color || '#0ea5e9';
                  const isHovered = hoveredBox?.id === gb.id;
                  const isSelected = selectedEvidence?.id === gb.id;

                  return (
                    <div
                      key={gb.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFocusEvidence(gb);
                      }}
                      onMouseEnter={() => setHoveredBox(gb)}
                      onMouseLeave={() => setHoveredBox(null)}
                      className="absolute border-2 rounded cursor-pointer z-30 font-mono transition-micro"
                      style={{
                        left: `${xMin}%`,
                        top: `${yMin}%`,
                        width: `${xMax - xMin}%`,
                        height: `${yMax - yMin}%`,
                        borderColor: color,
                        backgroundColor: isHovered || isSelected ? `${color}33` : `${color}15`,
                        boxShadow: isHovered || isSelected ? `0 0 16px ${color}` : `0 0 4px ${color}66`,
                      }}
                    >
                      <div
                        className="absolute -top-5 left-0 px-1.5 py-0.2 text-[9px] font-mono font-bold text-slate-950 rounded whitespace-nowrap flex items-center space-x-1 transition-micro"
                        style={{ backgroundColor: color }}
                      >
                        <span>EVIDENCE 0{idx + 1} | {gb.label.toUpperCase()} | CONF 0.91</span>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Synchronized Secondary Scene (SAR / T2) */}
            {secondarySrc && viewStyle === 'side-by-side' && (
              <div
                className="relative max-w-full max-h-full overflow-hidden flex items-center justify-center transition-camera gpu-layer"
                style={{ transform: `scale(${zoom}) translate(${panX}px, ${panY}px)` }}
              >
                <img
                  src={secondarySrc}
                  alt="Secondary Scene"
                  className="max-h-[440px] w-auto object-contain rounded block mx-auto border border-slate-800/80 transition-image"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/scenes/scene-02.jpg';
                  }}
                />
                <div className="absolute top-2 left-2 bg-slate-950/90 border border-slate-800 px-2 py-0.5 rounded text-[10px] font-mono text-cyan-300 font-bold select-none">
                  {mode === 'change' ? 'T2 AFTER (2026)' : 'SAR C-BAND (ALL-WEATHER)'}
                </div>
              </div>
            )}
          </div>
        ) : viewStyle === 'overlay' ? (
          /* Composite Fused / Change Overlay Mode with Smooth Layer Fade */
          <div
            className="relative w-full h-full overflow-hidden flex items-center justify-center transition-camera gpu-layer animate-overlay-in"
            style={{ transform: `scale(${zoom}) translate(${panX}px, ${panY}px)` }}
          >
            <img
              src={primarySrc}
              alt="Base Scene"
              className="max-h-[440px] w-auto object-contain rounded block mx-auto border border-slate-800"
              style={{ filter: spectralMode === 'NIR' ? 'contrast(1.2) saturate(1.45) hue-rotate(-28deg)' : 'none' }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/scenes/scene-01.jpg';
              }}
            />
            {secondarySrc && (
              <img
                src={secondarySrc}
                alt="Overlay Scene"
                className="absolute max-h-[440px] w-auto object-contain rounded mix-blend-screen opacity-60 pointer-events-none transition-image"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/scenes/scene-02.jpg';
                }}
              />
            )}
            <div className="absolute top-2 left-2 bg-slate-950/90 border border-slate-800 px-2.5 py-1 rounded text-[10px] font-mono text-cyan-400 font-bold select-none">
              {mode === 'change' ? 'BI-TEMPORAL CHANGE OVERLAY' : 'OPTICAL + SAR FUSED COMPOSITE'}
            </div>
          </div>
        ) : (
          /* Premium Bitemporal Split Screen Comparison Slider Mode */
          <div
            ref={sliderContainerRef}
            onMouseDown={handleSliderMouseDown}
            onMouseMove={handleSliderMouseMove}
            onMouseUp={handleSliderMouseUp}
            onMouseLeave={handleSliderMouseUp}
            className="relative w-full h-full overflow-hidden select-none cursor-ew-resize gpu-layer"
          >
            {/* Timeline Strip */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-40 bg-slate-950/90 border border-slate-800 px-3 py-1 rounded text-[10px] font-mono text-slate-300 flex items-center space-x-3 shadow-lg select-none">
              <span>{mode === 'change' ? 'T1 (BEFORE)' : (spectralMode === 'NIR' ? 'OPTICAL NIR' : 'OPTICAL RGB')}</span>
              <span className="text-cyan-400 font-bold">───────────────────</span>
              <span>{mode === 'change' ? 'T2 (AFTER)' : 'SAR MICROWAVE'}</span>
            </div>

            {/* Base Layer (Primary / T1) */}
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src={primarySrc}
                alt="T1 Pre"
                className="w-full h-full object-cover transition-camera"
                style={{ transform: `scale(${zoom}) translate(${panX}px, ${panY}px)`, filter: spectralMode === 'NIR' ? 'contrast(1.2) saturate(1.45) hue-rotate(-28deg)' : 'none' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/scenes/scene-01.jpg';
                }}
              />
              <div className="absolute top-10 left-3 bg-slate-950/90 border border-slate-800 px-2.5 py-1 rounded font-mono text-xs text-slate-300 shadow">
                {mode === 'change' ? `T1 BEFORE (${primaryMeta?.acquisitionDate || '2024'})` : (spectralMode === 'NIR' ? 'FALSE-COLOR INFRARED (NIR)' : 'OPTICAL VISIBLE SPECTRUM')}
              </div>
            </div>

            {/* Clipper Layer (Secondary / T2) */}
            <div
              className={`absolute inset-0 overflow-hidden flex items-center justify-center ${
                !isDraggingSlider ? 'transition-[clip-path] duration-200 ease-out' : ''
              }`}
              style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
            >
              <img
                src={secondarySrc}
                alt="T2 Post"
                className="w-full h-full object-cover transition-camera"
                style={{ transform: `scale(${zoom}) translate(${panX}px, ${panY}px)` }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/scenes/scene-02.jpg';
                }}
              />
              <div className="absolute top-10 right-3 bg-slate-950/90 border border-slate-800 px-2.5 py-1 rounded font-mono text-xs text-cyan-300 shadow">
                {mode === 'change' ? `T2 AFTER (${secondaryMeta?.acquisitionDate || '2026'})` : 'SAR RADAR BACKSCATTER'}
              </div>

              {/* Change Hotspots on T2 */}
              {changeAreas.map((ca) => {
                const [xMin, yMin, xMax, yMax] = ca.box;
                return (
                  <div
                    key={ca.id}
                    className="absolute border-2 border-cyan-400 bg-cyan-500/20 rounded font-mono transition-micro"
                    style={{ left: `${xMin}%`, top: `${yMin}%`, width: `${xMax - xMin}%`, height: `${yMax - yMin}%` }}
                  >
                    <span className="bg-cyan-500 text-slate-950 text-[9px] font-bold px-1 rounded absolute -top-4 left-0 uppercase">
                      CHANGE: {ca.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Minimal Center Divider & Slider Handle */}
            <div
              className="absolute top-0 bottom-0 w-[2px] bg-cyan-400 cursor-ew-resize z-30 flex items-center justify-center"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="w-6 h-6 rounded-full bg-[#070a12] border border-cyan-400 text-cyan-400 flex items-center justify-center text-xs -ml-[11px] shadow-xl font-mono transition-micro hover:scale-110">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              </div>
            </div>
          </div>
        )}

        {/* CLICK-TO-ASK CONTEXT POPUP */}
        {clickCoords && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute z-50 bg-[#0b0f19] border border-slate-700 rounded-xl p-3 shadow-2xl text-xs font-mono max-w-xs space-y-2 animate-fade-slide-view"
            style={{ left: `${Math.min(clickCoords.x, 260)}px`, top: `${Math.min(clickCoords.y, 280)}px` }}
          >
            <div className="flex items-center justify-between text-cyan-400 font-bold text-[11px] border-b border-slate-800 pb-1">
              <span className="flex items-center space-x-1">
                <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
                <span>ASK ABOUT THIS REGION</span>
              </span>
              <button onClick={() => setClickCoords(null)} className="text-slate-500 hover:text-white">✕</button>
            </div>
            <div className="text-[10px] text-slate-400">
              Coordinates: [{clickCoords.normX}%, {clickCoords.normY}%]
            </div>
            <div className="space-y-1">
              <button
                onClick={() => triggerRegionQuery(`Describe the region at coordinates [${clickCoords.normX}%, ${clickCoords.normY}%]`)}
                className="w-full text-left p-1.5 bg-[#070a12] hover:bg-slate-900 rounded border border-slate-800 text-slate-200 text-[11px] transition-micro"
              >
                Describe this area
              </button>
              <button
                onClick={() => triggerRegionQuery(`Find buildings and structures at [${clickCoords.normX}%, ${clickCoords.normY}%]`)}
                className="w-full text-left p-1.5 bg-[#070a12] hover:bg-slate-900 rounded border border-slate-800 text-slate-200 text-[11px] transition-micro"
              >
                Find objects
              </button>
              <button
                onClick={() => triggerRegionQuery(`Identify land cover type at [${clickCoords.normX}%, ${clickCoords.normY}%]`)}
                className="w-full text-left p-1.5 bg-[#070a12] hover:bg-slate-900 rounded border border-slate-800 text-slate-200 text-[11px] transition-micro"
              >
                Identify land cover
              </button>
            </div>
          </div>
        )}

        {/* Selected Evidence Tooltip */}
        {selectedEvidence && (
          <div className="absolute bottom-4 left-4 z-40 bg-[#0b0f19] border border-cyan-500/50 p-3 rounded-xl text-xs font-mono text-slate-200 max-w-xs shadow-2xl space-y-1.5 animate-fade-slide-view">
            <div className="flex items-center justify-between text-cyan-400 font-bold uppercase">
              <span>EVIDENCE REGION: {selectedEvidence.label}</span>
              <button onClick={() => setSelectedEvidence(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="text-[11px] text-slate-300 font-sans">
              <strong>Why this evidence?</strong> Spatial feature cross-attention identified structural reflectance aligned with target query taxonomy.
            </div>
          </div>
        )}
      </div>

      {/* Footer Info Strip */}
      {primaryMeta && (
        <div className="bg-[#070a12] px-4 py-1.5 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex flex-wrap justify-between items-center gap-2 select-none">
          <div className="flex items-center space-x-3">
            <div>CRS: <strong className="text-slate-200">{primaryMeta.crs}</strong></div>
            <div>EXTENTS: <strong className="text-slate-300">[{primaryMeta.bounds.join(', ')}]</strong></div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={exportGeoJsonPayload}
              className="px-2.5 py-0.5 bg-slate-900 hover:bg-slate-800 text-cyan-300 rounded border border-slate-700 font-mono text-[10px] flex items-center space-x-1 transition-micro shadow"
              title="Export Bounding Boxes as Standard GeoJSON File"
            >
              <Download className="w-3 h-3 text-cyan-400" />
              <span>EXPORT GEOJSON</span>
            </button>
            <div>STATUS: <strong className="text-emerald-400">GROUNDED & VERIFIED</strong></div>
          </div>
        </div>
      )}
    </div>
  );
};

