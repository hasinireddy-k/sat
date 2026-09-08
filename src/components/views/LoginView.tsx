import React, { useState } from 'react';
import { ArrowRight, Shield, Mail, Lock } from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (email: string, isDemo?: boolean) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState<string>('analyst@satquery.isro.gov.in');
  const [password, setPassword] = useState<string>('••••••••••••');
  const [isCreatingAccount, setIsCreatingAccount] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    onLoginSuccess(email, false);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 font-sans relative">
      {/* Subtle Orbital Background Ambient Light Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#0084ff]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full relative z-10 bg-[#05090f] border border-white/15 p-8 rounded-xl shadow-2xl query-glow animate-[fade-slide-up_0.35s_ease-out_forwards]">
        {/* Brand Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="w-12 h-12 rounded-sm bg-[#0084ff] flex items-center justify-center text-white mx-auto shadow-lg shadow-[#0084ff]/30">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 7 9 3 5 7l4 4 4-4Z"/><path d="m17 11 4 4-4 4-4-4 4-4Z"/><path d="m8 12 4 4"/><path d="m13 17 3 3"/><path d="M7 18a4 4 0 0 0 4 4"/><path d="M3 14a8 8 0 0 1 8 8"/></svg>
          </div>
          <div>
            <h2 className="heading text-2xl font-bold text-white tracking-wider uppercase">
              SATQUERY AI
            </h2>
            <p className="text-xs text-slate-400 mono mt-1 tracking-widest uppercase">
              Earth Observation Intelligence
            </p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
          <div className="space-y-1.5">
            <label className="text-slate-300 mono text-[11px] uppercase tracking-wider block">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="analyst@satquery.isro.gov.in"
                className="w-full bg-black/60 border border-white/10 focus:border-[#0084ff] rounded-sm pl-9 pr-3 py-3 text-xs text-white placeholder-slate-600 focus:outline-none transition-all duration-200"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 mono text-[11px] uppercase tracking-wider block">Password</label>
              <button
                type="button"
                className="text-[10px] text-[#0084ff] hover:underline mono uppercase tracking-wider"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••••••"
                className="w-full bg-black/60 border border-white/10 focus:border-[#0084ff] rounded-sm pl-9 pr-3 py-3 text-xs text-white placeholder-slate-600 focus:outline-none transition-all duration-200"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#0084ff] hover:bg-blue-400 hover:scale-[1.02] text-white font-bold text-xs rounded-sm transition-all duration-200 shadow-lg shadow-[#0084ff]/30 flex items-center justify-center space-x-2 mono uppercase tracking-wider"
          >
            <span>{isCreatingAccount ? 'Create Research Account' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="relative border-t border-white/10 pt-4 mt-6 text-center">
          <button
            onClick={() => onLoginSuccess('demo-analyst@isro.gov.in', true)}
            className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 mono text-xs rounded-sm transition-all duration-200 flex items-center justify-center space-x-2 uppercase tracking-wider"
          >
            <Shield className="w-3.5 h-3.5 text-[#0084ff]" />
            <span>Continue as Demo Analyst</span>
          </button>

          <div className="mt-4 text-[11px] text-slate-400 font-sans">
            {isCreatingAccount ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => setIsCreatingAccount(!isCreatingAccount)}
              className="text-[#0084ff] font-semibold hover:underline ml-1"
            >
              {isCreatingAccount ? 'Sign In' : 'Create Account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
