import React, { useRef, useState } from 'react';
import { GeoMetadata } from '../../types/satquery';
import { parseAndValidateImageFile } from '../../services/geoTiffService';
import { Upload, FileCode, CheckCircle2, AlertTriangle, MapPin, X } from 'lucide-react';

interface GeoTiffUploaderProps {
  label: string;
  imageSrc: string | null;
  onImageSelected: (src: string, meta?: GeoMetadata) => void;
  acceptFormats?: string;
  subtitle?: string;
}

export const GeoTiffUploader: React.FC<GeoTiffUploaderProps> = ({
  label,
  imageSrc,
  onImageSelected,
  acceptFormats = '.tif, .tiff, .geotiff, .png, .jpg, .jpeg',
  subtitle = 'GeoTIFF / TIFF or PNG/JPEG benchmark imagery'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [detectedMeta, setDetectedMeta] = useState<GeoMetadata | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const handleFile = async (file: File) => {
    setErrorMessage(null);
    setIsValidating(true);

    try {
      const validation = await parseAndValidateImageFile(file);
      if (!validation.valid) {
        setErrorMessage(validation.errorMessage || 'Invalid remote sensing file format.');
        setIsValidating(false);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        setDetectedMeta(validation.metadata);
        onImageSelected(src, validation.metadata);
        setIsValidating(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setErrorMessage('Failed to parse file header.');
      setIsValidating(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col space-y-3 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-cyan-300 uppercase tracking-wider flex items-center space-x-1.5 font-mono">
          <FileCode className="w-3.5 h-3.5 text-cyan-400" />
          <span>{label}</span>
        </label>
        <span className="text-[10px] text-slate-400 font-mono">GeoTIFF / TIFF / PNG / JPG</span>
      </div>

      {errorMessage && (
        <div className="bg-rose-950/80 border border-rose-800 p-2.5 rounded-lg flex items-center justify-between text-xs text-rose-300 font-mono">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-rose-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {imageSrc ? (
        <div className="relative group rounded-lg overflow-hidden border border-cyan-500/30 bg-slate-950">
          <img src={imageSrc} alt={label} className="w-full h-44 object-cover" />
          <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center space-y-2 p-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-1.5 bg-cyan-500 text-slate-950 text-xs font-bold rounded shadow hover:bg-cyan-400 transition"
            >
              Replace Image File
            </button>
            {detectedMeta && (
              <div className="text-[10px] font-mono text-cyan-200 text-center">
                {detectedMeta.filename} | {detectedMeta.dimensions}
              </div>
            )}
          </div>

          <div className="p-2.5 bg-slate-950/90 border-t border-slate-800 text-[11px] font-mono flex flex-wrap justify-between items-center gap-1 text-slate-300">
            <div className="flex items-center space-x-1 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{detectedMeta?.format || 'GeoTIFF'} Passed</span>
            </div>
            <div className="text-slate-400">
              {detectedMeta?.crs || 'EPSG:32643'} ({detectedMeta?.resolution || '0.5m/px'})
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition flex flex-col items-center justify-center space-y-2 ${
            dragActive
              ? 'border-cyan-400 bg-cyan-950/30'
              : 'border-slate-800 hover:border-slate-700 bg-slate-950/50'
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center">
            <Upload className={`w-5 h-5 ${isValidating ? 'animate-bounce text-cyan-400' : 'text-cyan-400'}`} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-200">
              {isValidating ? 'Validating remote sensing file...' : 'Click or drop satellite imagery to upload'}
            </p>
            <p className="text-[10px] text-slate-400 mt-1">{subtitle}</p>
          </div>
          <div className="flex items-center space-x-2 text-[10px] text-slate-400 bg-slate-900 px-2.5 py-1 rounded-full border border-slate-800 font-mono">
            <MapPin className="w-3 h-3 text-cyan-400" />
            <span>Reads CRS tags, dimensions & multispectral bands</span>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptFormats}
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />
    </div>
  );
};
