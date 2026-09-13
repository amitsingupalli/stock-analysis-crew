import React, { useState } from 'react';
import { Search, TrendingUp } from 'lucide-react';

interface HeaderProps {
  ticker: string;
  onTickerChange: (ticker: string) => void;
  onAnalyze: (ticker?: string) => void;
  isLoading: boolean;
  popularTickers: string[];
}

export const Header: React.FC<HeaderProps> = ({
  ticker,
  onTickerChange,
  onAnalyze,
  isLoading,
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
            <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-[#f8fafc] font-sans">
                Stock Intelligence
              </span>
              <p className="text-xs text-[#94a3b8] font-mono hidden sm:block">
                Institutional Equity Research & Valuation
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
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
              id="analyze-stock-action-btn"
              type="submit"
              disabled={isLoading}
              className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#0b0f19] font-mono text-xs font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] disabled:opacity-50 disabled:cursor-not-allowed shrink-0 flex items-center gap-1.5"
            >
              {isLoading ? (
                <>
                  <span className="w-3 h-3 border-2 border-[#0b0f19] border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <span>Analyze Stock</span>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Quick Ticker Chips Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-2.5 flex items-center justify-between overflow-x-auto gap-2">
        <div className="flex items-center gap-1.5 text-xs text-[#94a3b8] font-mono shrink-0">
          <span className="text-[11px] uppercase tracking-wider text-[#94a3b8]/70">Popular:</span>
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
        </div>
      </div>
    </header>
  );
};
