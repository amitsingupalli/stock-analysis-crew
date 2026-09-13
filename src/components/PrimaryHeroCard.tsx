import React from 'react';
import { StockAnalysisData } from '../types';
import { TrendingUp, TrendingDown, Target, Zap, Layers } from 'lucide-react';
import { Currency, formatPrice } from '../utils/currency';

interface PrimaryHeroCardProps {
  data: StockAnalysisData;
  currency: Currency;
}

export const PrimaryHeroCard: React.FC<PrimaryHeroCardProps> = ({ data, currency }) => {
  const isBuy = data.verdict === 'BUY';
  const isHold = data.verdict === 'HOLD';
  const isSell = data.verdict === 'SELL';

  // Glow Badge classes
  const getVerdictBadgeStyle = () => {
    if (isBuy) {
      return 'bg-emerald-500/15 border-emerald-500/70 text-emerald-400 shadow-[0_0_24px_rgba(16,185,129,0.35)]';
    }
    if (isHold) {
      return 'bg-amber-500/15 border-amber-500/70 text-amber-400 shadow-[0_0_24px_rgba(245,158,11,0.35)]';
    }
    return 'bg-red-500/15 border-red-500/70 text-red-400 shadow-[0_0_24px_rgba(239,68,68,0.35)]';
  };

  const getVerdictStyle = getVerdictBadgeStyle;

  const getVerdictDotColor = () => {
    if (isBuy) return 'bg-emerald-400';
    if (isHold) return 'bg-amber-400';
    return 'bg-red-400';
  };

  const baseCurrency: Currency =
    data.ticker.endsWith('.NS') || data.exchange === 'NSE' ? 'INR' : 'USD';

  return (
    <div className="glass-panel rounded-xl p-5 sm:p-6 flex flex-col justify-between h-full relative overflow-hidden border border-[#1e293b]">
      {/* Subtle background ambient gradient */}
      <div
        className={`absolute -top-24 -left-24 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none ${
          isBuy ? 'bg-emerald-500' : isHold ? 'bg-amber-500' : 'bg-red-500'
        }`}
      />

      <div>
        {/* Top Header: Identity & Verdict */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-[#1e293b]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-bold font-mono text-[#f8fafc]">
                {data.ticker}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-[#1e293b] font-mono text-[#94a3b8]">
                {data.exchange}
              </span>
              <span className="text-xs text-[#94a3b8] font-mono hidden md:inline">
                • {data.sector}
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-medium text-[#94a3b8] mt-0.5">
              {data.companyName}
            </h1>
          </div>

          {/* Institutional Verdict Pill */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <div
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono font-bold tracking-wider text-sm ${getVerdictStyle()}`}
              >
                <span className={`w-2 h-2 rounded-full animate-pulse ${getVerdictDotColor()}`} />
                {data.verdict}
              </div>
              <span className="text-[11px] font-mono text-[#94a3b8] mt-1 text-right">
                {data.verdictSubtitle}
              </span>
            </div>
          </div>
        </div>

        {/* Key Valuation Highlight Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 my-5">
          {/* Current Price */}
          <div className="bg-[#0b0f19]/80 rounded-lg p-3 border border-[#1e293b] flex flex-col justify-between overflow-hidden">
            <span className="text-[11px] font-mono text-[#94a3b8] uppercase tracking-wider truncate">
              Current Trading Price
            </span>
            <div className="mt-1.5 flex items-baseline gap-1 overflow-hidden">
              <span
                className="text-lg sm:text-base md:text-lg lg:text-base xl:text-xl font-mono font-bold text-[#f8fafc] truncate tracking-tight"
                title={formatPrice(data.currentPrice, currency, baseCurrency)}
              >
                {formatPrice(data.currentPrice, currency, baseCurrency)}
              </span>
              <span className="text-[10px] font-mono text-[#94a3b8] shrink-0">{currency}</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400/90 mt-1 flex items-center gap-1 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span> Live Spot
            </span>
          </div>

          {/* 12-Month Target Price */}
          <div className="bg-[#0b0f19]/80 rounded-lg p-3 border border-[#1e293b] flex flex-col justify-between overflow-hidden">
            <span className="text-[11px] font-mono text-[#94a3b8] uppercase tracking-wider flex items-center gap-1 truncate">
              <Target className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              12M Target Price
            </span>
            <div className="mt-1.5 flex items-baseline gap-1 overflow-hidden">
              <span
                className="text-lg sm:text-base md:text-lg lg:text-base xl:text-xl font-mono font-bold text-teal-400 truncate tracking-tight"
                title={formatPrice(data.targetPrice, currency, baseCurrency)}
              >
                {formatPrice(data.targetPrice, currency, baseCurrency)}
              </span>
              <span className="text-[10px] font-mono text-[#94a3b8] shrink-0">{currency}</span>
            </div>
            <span className="text-[10px] font-mono text-[#94a3b8] mt-1 truncate">
              Consensus Target
            </span>
          </div>

          {/* Projected Upside */}
          <div className="bg-[#0b0f19]/80 rounded-lg p-3 border border-[#1e293b] flex flex-col justify-between overflow-hidden">
            <span className="text-[11px] font-mono text-[#94a3b8] uppercase tracking-wider flex items-center gap-1 truncate">
              {data.projectedUpside >= 0 ? (
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-red-400 shrink-0" />
              )}
              Projected Upside
            </span>
            <div className="mt-1.5 flex items-baseline gap-1 overflow-hidden">
              <span
                className={`text-lg sm:text-base md:text-lg lg:text-base xl:text-xl font-mono font-bold truncate tracking-tight ${
                  data.projectedUpside >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {data.projectedUpside >= 0 ? `+${data.projectedUpside.toFixed(2)}%` : `${data.projectedUpside.toFixed(2)}%`}
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#94a3b8] mt-1 truncate">
              {data.projectedUpside > 15 ? 'High Potential' : 'Moderate'}
            </span>
          </div>
        </div>

        {/* Conviction Score Meter */}
        <div className="bg-[#0b0f19]/90 rounded-lg p-4 border border-[#1e293b]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-bold text-[#f8fafc] uppercase tracking-wider">
                Conviction Score
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-mono font-black text-emerald-400">
                {data.convictionScore}
              </span>
              <span className="text-xs font-mono text-[#94a3b8]">/100</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-[#141b2d] h-3 rounded-full overflow-hidden p-0.5 border border-[#1e293b]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.5)] transition-all duration-1000"
              style={{ width: `${Math.min(100, Math.max(0, data.convictionScore))}%` }}
            />
          </div>

          <div className="flex justify-between text-[10px] font-mono text-[#94a3b8] mt-1.5 px-0.5">
            <span>50 (Neutral)</span>
            <span>75 (High)</span>
            <span className="text-emerald-400 font-semibold">90+ (Strong Conviction)</span>
          </div>

          {/* Executive Summary */}
          <div className="mt-3 pt-3 border-t border-[#1e293b]/70 flex items-start gap-2.5">
            <p className="text-xs leading-relaxed text-[#f8fafc] font-sans font-medium">
              <strong className="text-teal-300 font-mono">Executive Summary: </strong>
              {data.aiExecutiveSummary}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
