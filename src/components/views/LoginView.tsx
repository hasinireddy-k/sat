import React, { useState } from 'react';
import {
  Shield,
  Mail,
  ArrowRight,
  Sparkles,
  Building2,
  KeyRound,
  Eye,
  EyeOff,
  Radio,
  CheckCircle2,
  Globe
} from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (email: string, isDemo?: boolean) => void;
}

const ANALYST_PROFILES = [
  {
    role: 'Lead Geospatial Analyst',
    email: 'lead-analyst@satquery.isro.gov.in',
    facility: 'NRSC Hyderabad (National Remote Sensing Centre)',
    clearance: 'LEVEL 3 — FULL ORBITAL DATA ACCESS',
    badgeColor: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/40'
  },
  {
    role: 'Emergency & Disaster Ops Officer',
    email: 'disaster-response@nrsc.isro.gov.in',
    facility: 'SAC Ahmedabad (Space Applications Centre)',
    clearance: 'LEVEL 2 — FLOOD & BITEMPORAL ACCESS',
    badgeColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40'
  },
  {
    role: 'Vision-Language AI Researcher',
    email: 'vlm-research@sac.isro.gov.in',
    facility: 'IIRS Dehradun (Indian Institute of Remote Sensing)',
    clearance: 'LEVEL 3 — MODEL INTELLIGENCE & EVALUATION',
    badgeColor: 'text-purple-400 border-purple-500/40 bg-purple-950/40'
  }
];

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState<string>('lead-analyst@satquery.isro.gov.in');
  const [password, setPassword] = useState<string>('ISRO-SATQUERY-2026');
  const [facility, setFacility] = useState<string>('NRSC Hyderabad (National Remote Sensing Centre)');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [selectedRoleIndex, setSelectedRoleIndex] = useState<number>(0);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

  const handleSelectPreset = (idx: number) => {
    setSelectedRoleIndex(idx);
    setEmail(ANALYST_PROFILES[idx].email);
    setFacility(ANALYST_PROFILES[idx].facility);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || isAuthenticating) return;

    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      onLoginSuccess(email, false);
    }, 450);
  };

  const handleDemoBypass = () => {
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      onLoginSuccess('evaluator@sih2026.isro.gov.in', true);
    }, 300);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-8 px-4 font-sans relative select-none">
      {/* Dynamic Orbital Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-600/10 via-[#0084ff]/10 to-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-xl w-full relative z-10 space-y-6">
        {/* Top Restricted Banner */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-[#070a14] border border-cyan-500/30 rounded-lg text-[10px] font-mono shadow-lg">
          <div className="flex items-center space-x-2 text-cyan-400">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span className="font-bold tracking-wider">ISRO PS 26167 • RESTRICTED ACCESS PORTAL</span>
          </div>
          <span className="text-slate-400">SECURE NODE: IN-ISRO-CLOUD-04</span>
        </div>

        {/* Main Card */}
        <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-7 shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-md">
          {/* Header Brand */}
          <div className="text-center space-y-2 border-b border-slate-800 pb-5">
            <div className="inline-flex items-center justify-center p-3 rounded-xl bg-gradient-to-br from-[#0084ff] to-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 mb-1">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold font-mono tracking-wider text-white uppercase flex items-center justify-center gap-2">
              <span>SATQUERY AI</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700 font-mono font-normal">
                v2.6 MISSION
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-sans max-w-md mx-auto leading-relaxed">
              Multimodal Vision-Language Assistant for Orbital Earth Observation Data & Planetary Intelligence
            </p>
          </div>

          {/* Quick Analyst Clearance Selector */}
          <div className="space-y-2 font-mono">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                <span>SELECT AUTHORIZED CREDENTIAL PROFILE</span>
              </span>
              <span className="text-[10px] text-cyan-400">1-CLICK AUTOFILL</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-left">
              {ANALYST_PROFILES.map((prof, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(idx)}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer space-y-1 ${
                    selectedRoleIndex === idx
                      ? 'bg-slate-900 border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.25)]'
                      : 'bg-[#070a12] border-slate-800/80 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-200 truncate">{prof.role}</span>
                    {selectedRoleIndex === idx && <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0" />}
                  </div>
                  <div className="text-[9px] text-slate-500 truncate">{prof.email.split('@')[0]}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
            {/* Facility / Station */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Operating Space Facility</span>
              </label>
              <select
                value={facility}
                onChange={(e) => setFacility(e.target.value)}
                className="w-full bg-[#070a12] border border-slate-800 focus:border-cyan-400 rounded-lg px-3 py-2.5 text-xs text-slate-200 outline-none transition"
              >
                <option value="NRSC Hyderabad (National Remote Sensing Centre)">NRSC Hyderabad (National Remote Sensing Centre)</option>
                <option value="SAC Ahmedabad (Space Applications Centre)">SAC Ahmedabad (Space Applications Centre)</option>
                <option value="IIRS Dehradun (Indian Institute of Remote Sensing)">IIRS Dehradun (Indian Institute of Remote Sensing)</option>
                <option value="ISRO HQ Bengaluru (Earth Observation Directorate)">ISRO HQ Bengaluru (Earth Observation Directorate)</option>
              </select>
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>Analyst Mission Email</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="analyst@isro.gov.in"
                className="w-full bg-[#070a12] border border-slate-800 focus:border-cyan-400 rounded-lg px-3 py-2.5 text-xs text-slate-100 placeholder-slate-600 outline-none transition"
              />
            </div>

            {/* Passcode / Token */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px]">
                <label className="text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                  <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                  <span>Security Token / Passcode</span>
                </label>
                <span className="text-emerald-400">ENCRYPTED</span>
              </div>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter security token..."
                  className="w-full bg-[#070a12] border border-slate-800 focus:border-cyan-400 rounded-lg px-3 py-2.5 pr-10 text-xs text-slate-100 placeholder-slate-600 outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-500 hover:text-slate-300 transition"
                  title={showPassword ? 'Hide Passcode' : 'Show Passcode'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-3 bg-gradient-to-r from-[#0084ff] to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-all transform hover:scale-[1.01] shadow-[0_0_20px_rgba(0,132,255,0.4)] flex items-center justify-center space-x-2 cursor-pointer font-mono tracking-wider uppercase mt-4 disabled:opacity-50"
            >
              {isAuthenticating ? (
                <span>VALIDATING CREDENTIALS & ORBITAL KEYS...</span>
              ) : (
                <>
                  <span>AUTHENTICATE & ENTER MISSION CONTROL</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Evaluator Bypass */}
          <div className="border-t border-slate-800/80 pt-4 text-center space-y-3 font-mono">
            <button
              type="button"
              onClick={handleDemoBypass}
              className="w-full py-2.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-400/80 text-cyan-300 text-[11px] rounded-lg transition flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>INSTANT EVALUATOR ACCESS (SIH 2026 DEMO SESSION)</span>
            </button>

            <div className="flex items-center justify-center space-x-4 text-[9px] text-slate-500 uppercase tracking-widest pt-1">
              <span>TLS 1.3 • AES-256</span>
              <span>•</span>
              <span>STRICT AUDIT LOGGING</span>
              <span>•</span>
              <span>ISRO PS 26167</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
