import React from 'react';
import { HelpCircle } from 'lucide-react';

export const HelpView: React.FC = () => {
  const faqs = [
    {
      q: 'How do I upload imagery?',
      a: 'Drag and drop your satellite file directly into the upload area on Mission Control, or click "+ ADD OBSERVATION". You can upload single scenes, before/after pairs, or optical/SAR pairs.'
    },
    {
      q: 'What formats are supported?',
      a: 'GeoTIFF (.tif / .geotiff) and standard TIFF for geospatial data, plus PNG and JPEG for benchmark demo examples.'
    },
    {
      q: 'How does SatQuery select an analysis mode?',
      a: 'SatQuery automatically inspects query keywords and input images. 1 image runs Single Scene analysis; 2 temporal images run Change Analysis; 1 optical + 1 SAR image runs Cross-Modal Fusion.'
    },
    {
      q: 'What is optical imagery?',
      a: 'Optical imagery captures visible light and near-infrared reflectance (like standard camera photographs) showing land cover colors, vegetation vigor, and surface features.'
    },
    {
      q: 'What is SAR (Synthetic Aperture Radar)?',
      a: 'SAR uses microwave signals to image Earth through cloud cover, rain, and darkness. It measures physical surface roughness and metallic structure backscatter.'
    },
    {
      q: 'What is change analysis?',
      a: 'Bitemporal change analysis compares T1 (pre-event) and T2 (post-event) satellite scenes to identify new construction, flood inundation, or land-use alterations.'
    },
    {
      q: 'What does confidence mean?',
      a: 'Confidence (High / Medium / Low) reflects spatial feature agreement, signal-to-noise ratio, and IoU overlap across the visual grounding pipeline.'
    },
    {
      q: 'What is Demo Analysis?',
      a: 'Demo Analysis indicates pre-loaded, precomputed satellite datasets included for demonstration reliability.'
    }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-6 font-sans text-slate-100">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2 font-mono uppercase tracking-wider">
          <HelpCircle className="w-5 h-5 text-cyan-400" />
          <span>HELP & FAQ</span>
        </h2>
        <p className="text-xs text-slate-400 font-sans mt-0.5">
          Frequently asked questions regarding remote sensing modalities, GeoTIFF ingestion, and agent orchestration.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-[#0b0f19] border border-slate-800 rounded-xl p-5 space-y-2 shadow-xl">
            <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2 font-mono">
              <span className="text-cyan-400">Q:</span>
              <span>{faq.q}</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans pl-6">
              {faq.a}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

