import React from 'react';
import { UserProfile } from '../../types/satquery';
import { User, Building, Calendar, Key, LogOut, Activity } from 'lucide-react';

interface ProfileViewProps {
  user: UserProfile;
  onSignOut: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, onSignOut }) => {
  return (
    <div className="max-w-3xl mx-auto space-y-6 py-6 font-sans text-slate-100">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2 font-mono uppercase tracking-wider">
          <User className="w-5 h-5 text-cyan-400" />
          <span>PROFILE & ACCOUNT</span>
        </h2>
        <p className="text-xs text-slate-400 font-sans mt-0.5">
          Earth Observation Intelligence Workspace credentials and activity log.
        </p>
      </div>

      <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
        <div className="flex items-center space-x-4 border-b border-slate-800 pb-6">
          <div className="w-14 h-14 rounded bg-[#070a12] border border-cyan-500/40 flex items-center justify-center text-cyan-400 text-xl font-bold font-mono">
            {user.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 font-mono">{user.name}</h3>
            <p className="text-xs text-cyan-400 font-mono uppercase font-semibold">{user.role}</p>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="bg-[#070a12] p-3 rounded border border-slate-800 space-y-1">
            <span className="text-slate-500 block text-[9px] uppercase">ORGANIZATION</span>
            <span className="text-slate-200 font-semibold flex items-center space-x-1.5">
              <Building className="w-3.5 h-3.5 text-cyan-400" />
              <span>{user.organization}</span>
            </span>
          </div>

          <div className="bg-[#070a12] p-3 rounded border border-slate-800 space-y-1">
            <span className="text-slate-500 block text-[9px] uppercase">JOINED DATE</span>
            <span className="text-slate-200 font-semibold flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>{user.joinedDate}</span>
            </span>
          </div>
        </div>

        {/* Recent Missions & Analysis Activity */}
        <div className="space-y-3 font-mono text-xs border-t border-slate-800 pt-6">
          <div className="text-[10px] text-slate-400 font-bold uppercase flex items-center space-x-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>RECENT MISSIONS & ANALYSIS ACTIVITY</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="bg-[#070a12] p-3 rounded border border-slate-800 flex justify-between items-center">
              <div>
                <strong className="text-slate-200 block">Urban Change Analysis (Kaziranga & Delhi)</strong>
                <span className="text-slate-500 text-[10px]">05 SEP 2026 • Bi-temporal Optical</span>
              </div>
              <span className="text-emerald-400 text-[10px] font-bold">COMPLETED</span>
            </div>

            <div className="bg-[#070a12] p-3 rounded border border-slate-800 flex justify-between items-center">
              <div>
                <strong className="text-slate-200 block">Optical + SAR Cross-Modal Fusion</strong>
                <span className="text-slate-500 text-[10px]">04 SEP 2026 • All-Weather SAR</span>
              </div>
              <span className="text-emerald-400 text-[10px] font-bold">COMPLETED</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-800">
          <button className="px-4 py-2 bg-[#070a12] hover:bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 rounded transition flex items-center space-x-1.5">
            <Key className="w-3.5 h-3.5 text-cyan-400" />
            <span>Update API Keys</span>
          </button>

          <button
            onClick={onSignOut}
            className="px-4 py-2 bg-slate-950 hover:bg-rose-950/80 border border-slate-800 text-xs font-mono text-rose-300 rounded transition flex items-center space-x-1.5 ml-auto"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

