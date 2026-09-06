import React from 'react';
import { AppSettings } from '../../types/satquery';
import { Sliders, Trash2, Info } from 'lucide-react';

interface SettingsViewProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onClearHistory: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onClearHistory
}) => {
  return (
    <div className="max-w-3xl mx-auto space-y-6 py-6 font-sans text-slate-100">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2 font-mono uppercase tracking-wider">
          <Sliders className="w-5 h-5 text-cyan-400" />
          <span>SETTINGS</span>
        </h2>
        <p className="text-xs text-slate-400 font-sans mt-0.5">
          General preferences, display options, analysis parameters, notifications, data management, and system parameters.
        </p>
      </div>

      {/* 1. GENERAL */}
      <section className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl font-mono text-xs">
        <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider border-b border-slate-800 pb-2">
          1. GENERAL
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-slate-300 block">THEME MODE</label>
            <select
              value={settings.theme}
              onChange={(e) => onUpdateSettings({ theme: e.target.value as any })}
              className="w-full bg-[#070a12] border border-slate-800 rounded p-2 text-xs text-slate-200 focus:outline-none"
            >
              <option value="dark">Aerospace Dark (ISRO Standard)</option>
              <option value="system">System Default</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 block">PRIMARY LANGUAGE</label>
            <input
              type="text"
              value={settings.language}
              disabled
              className="w-full bg-[#070a12] border border-slate-800 rounded p-2 text-xs text-slate-400 cursor-not-allowed font-mono"
            />
          </div>
        </div>
      </section>

      {/* 2. DISPLAY */}
      <section className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl font-mono text-xs">
        <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider border-b border-slate-800 pb-2">
          2. DISPLAY
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-slate-200 block font-semibold">Visual Evidence Overlays</span>
              <span className="text-[11px] text-slate-400 font-sans">Display grounded bounding boxes and evidence markers</span>
            </div>
            <input
              type="checkbox"
              checked={settings.showVisualEvidence}
              onChange={(e) => onUpdateSettings({ showVisualEvidence: e.target.checked })}
              className="w-4 h-4 accent-cyan-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between border-t border-slate-800 pt-3">
            <div>
              <span className="text-slate-200 block font-semibold">Confidence Display</span>
              <span className="text-[11px] text-slate-400 font-sans">Display confidence evaluation levels (High / Medium / Low)</span>
            </div>
            <input
              type="checkbox"
              checked={settings.showConfidence}
              onChange={(e) => onUpdateSettings({ showConfidence: e.target.checked })}
              className="w-4 h-4 accent-cyan-500 cursor-pointer"
            />
          </div>
        </div>
      </section>

      {/* 3. ANALYSIS */}
      <section className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl font-mono text-xs">
        <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider border-b border-slate-800 pb-2">
          3. ANALYSIS
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-300 font-semibold">Response Detail Level</span>
            <div className="flex bg-[#070a12] p-1 rounded border border-slate-800 text-[10px]">
              {(['Concise', 'Balanced', 'Detailed'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => onUpdateSettings({ responseDetail: lvl })}
                  className={`px-3 py-1 rounded transition ${
                    settings.responseDetail === lvl ? 'bg-cyan-600 text-slate-950 font-bold' : 'text-slate-400'
                  }`}
                >
                  {lvl.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-800 pt-3">
            <div>
              <span className="text-slate-200 block font-semibold">Automatic Task Classification</span>
              <span className="text-[11px] text-slate-400 font-sans">Automatically route queries to VQA, Grounding, Change, or SAR Fusion</span>
            </div>
            <input
              type="checkbox"
              checked={settings.autoDetectModality}
              onChange={(e) => onUpdateSettings({ autoDetectModality: e.target.checked })}
              className="w-4 h-4 accent-cyan-500 cursor-pointer"
            />
          </div>
        </div>
      </section>

      {/* 4. NOTIFICATIONS */}
      <section className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl font-mono text-xs">
        <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider border-b border-slate-800 pb-2">
          4. NOTIFICATIONS
        </h3>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-slate-200 block font-semibold">System Audit Alerts</span>
            <span className="text-[11px] text-slate-400 font-sans">Receive audio/visual cues upon completion of long-running SAR fusion tasks</span>
          </div>
          <input
            type="checkbox"
            checked={settings.notificationsEnabled}
            onChange={(e) => onUpdateSettings({ notificationsEnabled: e.target.checked })}
            className="w-4 h-4 accent-cyan-500 cursor-pointer"
          />
        </div>
      </section>

      {/* 5. DATA */}
      <section className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl font-mono text-xs">
        <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider border-b border-slate-800 pb-2">
          5. DATA MANAGEMENT
        </h3>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-slate-200 block font-semibold">Clear Local Session History</span>
            <span className="text-[11px] text-slate-400 font-sans">Purge cached observations from browser memory</span>
          </div>
          <button
            onClick={onClearHistory}
            className="px-3.5 py-1.5 bg-[#070a12] hover:bg-rose-950 border border-slate-800 text-rose-300 font-mono text-xs rounded transition flex items-center space-x-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>CLEAR HISTORY</span>
          </button>
        </div>
      </section>

      {/* 6. SYSTEM */}
      <section className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-5 space-y-3 font-mono text-xs shadow-xl">
        <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center space-x-1.5">
          <Info className="w-4 h-4" />
          <span>6. SYSTEM PARAMETERS</span>
        </h3>
        <div className="space-y-1 text-slate-300">
          <div>SYSTEM PLATFORM: <strong className="text-cyan-300">SATQUERY AI v2.6-PRO</strong></div>
          <div>ISRO PROBLEM STATEMENT: <strong className="text-slate-200">26167</strong></div>
          <div>FRAMEWORK: <strong className="text-slate-200">React 19, TypeScript, Vite, Tailwind CSS</strong></div>
          <div>AGENT ORCHESTRATOR: <strong className="text-emerald-400">ONLINE & READY</strong></div>
        </div>
      </section>
    </div>
  );
};

