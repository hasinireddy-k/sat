import React, { useState } from 'react';
import { ExecutionResult } from '../../types/satquery';
import { History, Search } from 'lucide-react';

interface AnalysisHistoryViewProps {
  historyLogs: ExecutionResult[];
  onSelectResult: (res: ExecutionResult) => void;
  onGenerateReport: (res: ExecutionResult) => void;
}

export const AnalysisHistoryView: React.FC<AnalysisHistoryViewProps> = ({
  historyLogs,
  onSelectResult,
  onGenerateReport
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredLogs = historyLogs.filter(
    (log) =>
      log.query.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.detectedTask.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.selectedModel.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12 font-sans text-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2 font-mono uppercase tracking-wider">
            <History className="w-5 h-5 text-cyan-400" />
            <span>ANALYSIS HISTORY</span>
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Complete historical registry of executed remote sensing observations, task modes, and confidence levels.
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
                <th className="px-4 py-3">DATE</th>
                <th className="px-4 py-3">INPUT</th>
                <th className="px-4 py-3">TASK</th>
                <th className="px-4 py-3 text-center">STATUS</th>
                <th className="px-4 py-3 text-center">CONFIDENCE</th>
                <th className="px-4 py-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-900/50 transition">
                  <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                    <div>05 SEP 2026</div>
                    <div className="text-[9px] text-slate-500">{log.id}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-200 font-sans max-w-xs truncate">
                    {log.mode === 'bitemporal' ? 'Bi-temporal optical imagery' : log.mode === 'optical-sar' ? 'Optical + SAR pair' : 'Single scene optical imagery'}
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
                    {log.confidenceLevel || 'High'}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap space-x-2">
                    <button
                      onClick={() => onSelectResult(log)}
                      className="px-2.5 py-1 bg-slate-950 hover:bg-slate-900 border border-slate-700 text-slate-200 rounded text-[11px] font-mono font-semibold transition"
                    >
                      OPEN
                    </button>
                    <button
                      onClick={() => onGenerateReport(log)}
                      className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded text-[11px] font-mono font-bold transition"
                    >
                      REPORT
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

