import React, { useState } from 'react';
import { Satellite, ArrowRight, Shield, Key, Mail, Lock } from 'lucide-react';

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
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 font-sans">
      <div className="max-w-md w-full space-y-8 bg-slate-900/90 border border-slate-800 p-8 rounded-2xl shadow-2xl backdrop-blur-md">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-slate-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mx-auto shadow-lg shadow-cyan-500/10">
            <Satellite className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">
              SATQUERY AI
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Earth Observation Intelligence
            </p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
          <div className="space-y-1">
            <label className="text-slate-300 font-mono block">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-mono block">Password</label>
              <button
                type="button"
                className="text-[11px] text-cyan-400 hover:underline font-mono"
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
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition shadow-lg shadow-cyan-500/20 flex items-center justify-center space-x-2"
          >
            <span>{isCreatingAccount ? 'Create Research Account' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="relative border-t border-slate-800 pt-4 text-center">
          <button
            onClick={() => onLoginSuccess('demo-analyst@isro.gov.in', true)}
            className="w-full py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-mono text-xs rounded-xl transition flex items-center justify-center space-x-2"
          >
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>Continue as Demo Analyst</span>
          </button>

          <div className="mt-4 text-[11px] text-slate-400">
            {isCreatingAccount ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => setIsCreatingAccount(!isCreatingAccount)}
              className="text-cyan-400 font-semibold hover:underline"
            >
              {isCreatingAccount ? 'Sign In' : 'Create Account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
