import React, { useState } from 'react';
import { GroundingBox, GeoMetadata } from '../../types/satquery';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Layers,
  MapPin,
  Eye,
  EyeOff,
  Crosshair,
  Compass
} from 'lucide-react';

interface InteractiveViewerProps {
  imageSrc: string;
  title?: string;
  groundingBoxes?: GroundingBox[];
  geoMetadata?: GeoMetadata;
  maskOverlayColor?: string;
  heightClass?: string;
}

export const InteractiveViewer: React.FC<InteractiveViewerProps> = ({
  imageSrc,
  title = 'Satellite Observation Canvas',
  groundingBoxes = [],
  geoMetadata,
  maskOverlayColor,
  heightClass = 'h-[440px]'
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [showGrounding, setShowGrounding] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [hoveredBox, setHoveredBox] = useState<GroundingBox | null>(null);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 1));
  const handleResetZoom = () => setZoom(1);

  return (
    <div className="bg-slate-950 border border-cyan-900/40 rounded-xl overflow-hidden shadow-2xl flex flex-col relative group">
      {/* Canvas Top Bar */}
      <div className="bg-slate-900/90 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <Compass className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-slate-200">{title}</span>
          {geoMetadata && (
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/60">
              {geoMetadata.sensor} ({geoMetadata.resolution})
            </span>
          )}
        </div>

        {/* View Controls */}
        <div className="flex items-center space-x-2">
          {groundingBoxes.length > 0 && (
            <button
              onClick={() => setShowGrounding(!showGrounding)}
              className={`px-2 py-1 rounded text-[11px] font-mono flex items-center space-x-1 transition ${
                showGrounding
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {showGrounding ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              <span>Grounding ({groundingBoxes.length})</span>
            </button>
          )}

          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-1 rounded transition ${showGrid ? 'text-cyan-400 bg-slate-800' : 'text-slate-500'}`}
            title="Toggle Map Grid Overlay"
          >
            <Layers className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center bg-slate-800 rounded border border-slate-700">
            <button onClick={handleZoomOut} className="p-1 text-slate-300 hover:text-cyan-400">
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-[10px] font-mono text-cyan-300">{Math.round(zoom * 100)}%</span>
            <button onClick={handleZoomIn} className="p-1 text-slate-300 hover:text-cyan-400">
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button onClick={handleResetZoom} className="p-1 text-slate-400 hover:text-white border-l border-slate-700">
              <Maximize2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Image Stage */}
      <div className={`relative ${heightClass} bg-slate-950 overflow-hidden flex items-center justify-center`}>
        {/* Map Grid Overlay */}
        {showGrid && (
          <div className="absolute inset-0 pointer-events-none z-10 grid grid-cols-6 grid-rows-6 opacity-20 border border-cyan-500/20">
            {Array.from({ length: 36 }).map((_, i) => (
              <div key={i} className="border border-cyan-500/30 text-[9px] font-mono text-cyan-500/60 p-1">
                {i === 0 && 'N 26°34\' E 93°10\''}
              </div>
            ))}
          </div>
        )}

        {/* Mask Overlay */}
        {maskOverlayColor && (
          <div
            className="absolute inset-0 pointer-events-none z-20 mix-blend-screen transition-opacity"
            style={{ backgroundColor: maskOverlayColor }}
          />
        )}

        {/* Satellite Base Image */}
        <div
          className="relative transition-transform duration-200 ease-out max-w-full max-h-full"
          style={{ transform: `scale(${zoom})` }}
        >
          <img src={imageSrc} alt={title} className="max-h-[420px] w-auto object-contain block mx-auto" />

          {/* Bounding Box Visual Evidence */}
          {showGrounding &&
            groundingBoxes.map((gb) => {
              const [xMin, yMin, xMax, yMax] = gb.box;
              const color = gb.color || '#10B981';
              const isHovered = hoveredBox?.id === gb.id;

              return (
                <div
                  key={gb.id}
                  onMouseEnter={() => setHoveredBox(gb)}
                  onMouseLeave={() => setHoveredBox(null)}
                  className="absolute border-2 rounded transition-all cursor-pointer z-30"
                  style={{
                    left: `${xMin}%`,
                    top: `${yMin}%`,
                    width: `${xMax - xMin}%`,
                    height: `${yMax - yMin}%`,
                    borderColor: color,
                    backgroundColor: isHovered ? `${color}33` : `${color}15`,
                    boxShadow: isHovered ? `0 0 15px ${color}` : `0 0 5px ${color}88`,
                  }}
                >
                  <div
                    className="absolute -top-6 left-0 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-950 rounded shadow-md whitespace-nowrap flex items-center space-x-1"
                    style={{ backgroundColor: color }}
                  >
                    <span>{gb.label}</span>
                    <span className="opacity-80">({gb.confidence}%)</span>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Hover Bounding Box Detail Tooltip */}
        {hoveredBox && (
          <div className="absolute bottom-4 left-4 z-40 bg-slate-900/95 border border-cyan-500/50 p-3 rounded-lg text-xs font-mono text-slate-200 max-w-xs shadow-xl backdrop-blur-md">
            <div className="flex items-center space-x-1.5 text-cyan-400 font-bold mb-1">
              <Crosshair className="w-3.5 h-3.5" />
              <span>{hoveredBox.label}</span>
            </div>
            <div className="text-[11px] text-slate-300">Category: {hoveredBox.category}</div>
            <div className="text-[11px] text-emerald-400 font-semibold">Model Grounding Confidence: {hoveredBox.confidence}%</div>
            <div className="text-[10px] text-slate-400 mt-1">
              BBox Norm: [{hoveredBox.box.join(', ')}]
            </div>
          </div>
        )}
      </div>

      {/* Footer Info Strip */}
      {geoMetadata && (
        <div className="bg-slate-900/90 px-4 py-1.5 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center space-x-3">
            <span>CRS: <strong className="text-cyan-300">{geoMetadata.crs}</strong></span>
            <span>Extents: <strong className="text-slate-300">{geoMetadata.bounds.join(', ')}</strong></span>
          </div>
          <div>Acquired: <strong className="text-slate-300">{geoMetadata.acquisitionDate}</strong></div>
        </div>
      )}
    </div>
  );
};
