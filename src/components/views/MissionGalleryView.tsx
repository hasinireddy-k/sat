import React, { useState } from 'react';
import { DemoMission, ViewTab } from '../../types/satquery';
import { DEMO_MISSIONS } from '../../data/demoMissions';
import { Grid, ArrowRight, MapPin } from 'lucide-react';

interface MissionGalleryViewProps {
  onSelectMission: (mission: DemoMission) => void;
  setActiveTab: (tab: ViewTab) => void;
}

export const MissionGalleryView: React.FC<MissionGalleryViewProps> = ({
  onSelectMission,
}) => {
  const [selectedDomain, setSelectedDomain] = useState<string>('All');

  const domains = ['All', 'Disaster Assessment', 'Urban & Infrastructure', 'Maritime & Defense', 'Agriculture & Forestry'];

  const filteredMissions = selectedDomain === 'All'
    ? DEMO_MISSIONS
    : DEMO_MISSIONS.filter(m => m.domain === selectedDomain);

  return (
    <div className="space-y-6 pb-12 font-sans text-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2 font-mono uppercase tracking-wider">
            <Grid className="w-5 h-5 text-cyan-400" />
            <span>FEATURED SATELLITE MISSIONS</span>
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Curated ISRO, Sentinel, and Landsat remote sensing observations for instant multimodal demonstration.
          </p>
        </div>

        {/* Domain Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto py-1">
          {domains.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDomain(d)}
              className={`px-3 py-1 rounded text-xs font-mono transition ${
                selectedDomain === d
                  ? 'bg-cyan-600 text-slate-950 font-bold shadow'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono">
        {filteredMissions.map((mission) => (
          <div
            key={mission.id}
            onClick={() => onSelectMission(mission)}
            className="bg-[#0b0f19] hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-xl overflow-hidden transition cursor-pointer flex flex-col justify-between shadow-xl group"
          >
            <div className="relative h-48 overflow-hidden bg-[#070a12]">
              <img
                src={mission.thumbnail}
                alt={mission.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute top-3 left-3 bg-[#070a12]/90 border border-slate-800 px-2 py-0.5 rounded text-[9px] text-slate-300">
                {mission.domain.toUpperCase()}
              </div>
              <div className="absolute top-3 right-3 bg-[#070a12]/90 border border-slate-800 px-2 py-0.5 rounded text-[9px] text-slate-400">
                DEMO ANALYSIS
              </div>
              <div className="absolute bottom-3 left-3 bg-cyan-950/90 border border-cyan-800/80 px-2 py-0.5 rounded text-[9px] text-cyan-300 font-bold">
                {mission.mode.toUpperCase()} MODE
              </div>
            </div>

            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition">
                  {mission.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-3 font-sans leading-normal">
                  {mission.description}
                </p>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-800 text-xs">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{mission.location}</span>
                  </span>
                </div>
                <div className="text-[10px] text-slate-400">
                  SENSOR: <strong className="text-slate-300">{mission.sensor}</strong>
                </div>

                <button className="w-full py-2 bg-[#070a12] group-hover:bg-cyan-600 group-hover:text-slate-950 text-cyan-400 border border-slate-800 group-hover:border-cyan-400 font-bold text-xs rounded transition flex items-center justify-center space-x-2 mt-2">
                  <span>LAUNCH DEMO ANALYSIS</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

