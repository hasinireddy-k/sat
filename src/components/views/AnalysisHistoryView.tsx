import React, { useState } from 'react';
import { ExecutionResult } from '../../types/satquery';
import { History, Search, FileSliders } from 'lucide-react';
import { MissionDetailFactorsView } from './MissionDetailFactorsView';

interface AnalysisHistoryViewProps {
  historyLogs?: ExecutionResult[];
  logs?: ExecutionResult[];
  onSelectResult?: (res: ExecutionResult) => void;
  onSelectLog?: (res: ExecutionResult) => void;
  onGenerateReport?: (res: ExecutionResult) => void;
}

export const AnalysisHistoryView: React.FC<AnalysisHistoryViewProps> = (props) => {
  const historyLogs = props.historyLogs || props.logs || [];
  const onSelectResult = props.onSelectResult || props.onSelectLog || (() => {});
  const onGenerateReport = props.onGenerateReport || (() => {});

  const [selectedDetail, setSelectedDetail] = useState<ExecutionResult | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredLogs = historyLogs.filter(
    (log) =>
      log.query?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.detectedTask?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.selectedModel?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // If a mission is selected, display the exact Hercules Input/Output Factors View
  if (selectedDetail) {
    return (
      <MissionDetailFactorsView
        result={selectedDetail}
        onBack={() => setSelectedDetail(null)}
        onOpenWorkspace={() => onSelectResult(selectedDetail)}
      />
    );
  }

  return (
    <div className="space-y-6 pb-12 font-sans text-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2 font-mono uppercase tracking-wider">
            <History className="w-5 h-5 text-cyan-400" />
            <span>ANALYSIS HISTORY</span>
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Complete historical registry of executed remote sensing observations, task modes, and confidence levels. Click any mission to inspect all Input/Output factors.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search history by query or task..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0b0f19] border border-slate-800 focus:border-cyan-500/60 rounded pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none font-mono"
          />
        </div>
      </div>

      <div className="bg-[#0b0f19] border border-slate-800 rounded-xl overflow-hidden shadow-xl font-mono">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#070a12] text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">DATE / ID</th>
                <th className="px-4 py-3">INPUT RASTER</th>
                <th className="px-4 py-3">TASK</th>
                <th className="px-4 py-3 text-center">STATUS</th>
                <th className="px-4 py-3 text-center">CONFIDENCE</th>
                <th className="px-4 py-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  onClick={() => setSelectedDetail(log)}
                  className="hover:bg-slate-900/60 transition cursor-pointer group"
                >
                  <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                    <div>{log.timestamp ? new Date(log.timestamp).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase() : '08 SEP 2026'}</div>
                    <div className="text-[9px] text-cyan-400/80 group-hover:text-cyan-300 font-mono">{log.id.slice(-12)}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-200 font-sans max-w-xs truncate">
                    <div className="font-semibold text-slate-100">{log.geoMetadata?.filename || 'Observation_Scene.tif'}</div>
                    <div className="text-[10px] text-slate-500 truncate">{log.query}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-950 text-cyan-300 border border-slate-800 font-bold uppercase">
                      {log.detectedTask}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-950 text-emerald-400 border border-slate-800 font-bold">
                      COMPLETED
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-cyan-400 whitespace-nowrap">
                    {typeof log.confidence === 'number' ? `${Math.round(log.confidence <= 1 ? log.confidence * 100 : log.confidence)}%` : (log.confidenceLevel || 'High')}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap space-x-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setSelectedDetail(log)}
                      className="px-2.5 py-1 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 rounded text-[11px] font-mono font-bold transition flex-inline items-center space-x-1"
                    >
                      <span>FACTORS</span>
                    </button>
                    <button
                      onClick={() => onSelectResult(log)}
                      className="px-2.5 py-1 bg-slate-950 hover:bg-slate-900 border border-slate-700 text-slate-300 rounded text-[11px] font-mono font-semibold transition"
                    >
                      VIEWER
                    </button>
                    <button
                      onClick={() => onGenerateReport(log)}
                      className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 rounded text-[11px] font-mono transition"
                    >
                      PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

