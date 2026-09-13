import React, { useState } from 'react';
import { Sparkles, Search, Activity, Cpu, Database, Code, ShieldCheck, ArrowRight } from 'lucide-react';

interface HeaderProps {
  ticker: string;
  onTickerChange: (ticker: string) => void;
  onAnalyze: (ticker?: string) => void;
  isLoading: boolean;
  onOpenArchitecture: () => void;
  onOpenDesignTokens: () => void;
  popularTickers: string[];
}

export const Header: React.FC<HeaderProps> = ({
  ticker,
  onTickerChange,
  onAnalyze,
  isLoading,
  onOpenArchitecture,
  onOpenDesignTokens,
  popularTickers,
}) => {
  const [localInput, setLocalInput] = useState(ticker);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localInput.trim()) {
      onTickerChange(localInput.trim().toUpperCase());
      onAnalyze(localInput.trim().toUpperCase());
    }
  };

  const handleQuickSelect = (t: string) => {
    setLocalInput(t);
    onTickerChange(t);
    onAnalyze(t);
  };

  return (
    <header className="border-b border-[#1e293b] bg-[#0b0f19]/90 sticky top-0 z-30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-[#f8fafc] font-sans">
                  Stock Crew AI
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)] animate-pulse">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  Gemini 3.5 Flash Engine
                </span>
              </div>
              <p className="text-xs text-[#94a3b8] font-mono hidden sm:block">
                CrewAI Multi-Agent Pipeline • Autonomous Equity Research
              </p>
            </div>
          </div>

          {/* Quick Handoff & Architecture Buttons on Mobile */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              onClick={onOpenArchitecture}
              className="p-1.5 rounded-md text-xs font-mono bg-[#141b2d] border border-[#1e293b] text-[#94a3b8] hover:text-white"
              title="System Flow"
            >
              <Activity className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenDesignTokens}
              className="p-1.5 rounded-md text-xs font-mono bg-[#141b2d] border border-[#1e293b] text-[#94a3b8] hover:text-white"
              title="Tokens & Spec"
            >
              <Code className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Bar & Quick Ticker Selector */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto">
          <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94a3b8]">
                <Search className="w-4 h-4" />
              </div>
              <input
                id="stock-ticker-search-input"
                type="text"
                value={localInput}
                onChange={(e) => setLocalInput(e.target.value.toUpperCase())}
                placeholder="Ticker e.g. NVDA"
                maxLength={8}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#141b2d] border border-[#1e293b] text-[#f8fafc] placeholder-[#94a3b8] font-mono text-sm font-semibold tracking-wider focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all uppercase"
              />
              <span className="absolute right-2.5 top-2 text-[10px] font-mono text-[#94a3b8] bg-[#0b0f19] px-1.5 py-0.5 rounded border border-[#1e293b]">
                USD
              </span>
            </div>

            <button
              id="analyze-stock-btn"
              type="submit"
              disabled={isLoading}
              className="relative inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-sans font-bold text-xs tracking-wide transition-all shadow-[0_0_16px_rgba(16,185,129,0.35)] disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing (~5s)...</span>
                </>
              ) : (
                <>
                  <span>Analyze Stock (~5s)</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
                </>
              )}
            </button>
          </form>

          {/* Architecture and Open-Design Spec Modals */}
          <div className="hidden md:flex items-center gap-2">
            <button
              id="architecture-flow-btn"
              onClick={onOpenArchitecture}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141b2d] border border-[#1e293b] hover:border-teal-500/50 text-xs font-mono text-[#94a3b8] hover:text-[#f8fafc] transition-all hover:bg-[#1e293b]/50"
            >
              <Activity className="w-3.5 h-3.5 text-teal-400" />
              <span>System Flow</span>
            </button>

            <button
              id="design-tokens-spec-btn"
              onClick={onOpenDesignTokens}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141b2d] border border-[#1e293b] hover:border-emerald-500/50 text-xs font-mono text-[#94a3b8] hover:text-[#f8fafc] transition-all hover:bg-[#1e293b]/50"
            >
              <Code className="w-3.5 h-3.5 text-emerald-400" />
              <span>Design Tokens & Spec</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Ticker Chips Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-2.5 flex items-center justify-between overflow-x-auto gap-2">
        <div className="flex items-center gap-1.5 text-xs text-[#94a3b8] font-mono shrink-0">
          <span className="text-[11px] uppercase tracking-wider text-[#94a3b8]/70">Preset Bluechips:</span>
          {popularTickers.map((t) => (
            <button
              key={t}
              onClick={() => handleQuickSelect(t)}
              className={`px-2.5 py-0.5 rounded text-xs font-mono font-medium transition-all ${
                ticker === t
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.25)]'
                  : 'bg-[#141b2d] text-[#94a3b8] border border-[#1e293b] hover:border-[#94a3b8]/50 hover:text-[#f8fafc]'
              }`}
            >
              ${t}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0 text-[11px] font-mono text-[#94a3b8]">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            Live Market Feed
          </span>
          <span className="text-[#1e293b]">|</span>
          <span>Target Response: &lt;5s</span>
        </div>
      </div>
    </header>
  );
};
