import React from 'react';
import { TrendingUp, Sparkles, CheckCircle2, Zap, ArrowUpRight } from 'lucide-react';

interface BullishCatalystsCardProps {
  catalysts: string[];
}

export const BullishCatalystsCard: React.FC<BullishCatalystsCardProps> = ({ catalysts }) => {
  return (
    <div className="glass-panel rounded-xl p-5 border border-[#1e293b] flex flex-col justify-between h-full bg-[#141b2d]/60 backdrop-blur-md">
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-[#1e293b]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#f8fafc] flex items-center gap-2">
                Strategic Growth Catalysts & Bull Thesis
              </h2>
              <span className="text-[11px] font-mono text-[#94a3b8]">
                Multi-year expansion drivers & competitive moats
              </span>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 self-start sm:self-auto shadow-[0_0_10px_rgba(16,185,129,0.15)]">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            BULL CONVICTION
          </span>
        </div>

        {/* Catalysts List */}
        <div className="space-y-3">
          {catalysts && catalysts.length > 0 ? (
            catalysts.map((catalyst, idx) => (
              <div
                key={idx}
                className="bg-[#0b0f19]/80 rounded-lg p-3.5 border border-[#1e293b] hover:border-emerald-500/40 transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 text-xs font-mono font-bold group-hover:scale-105 transition-transform">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-200 leading-relaxed font-sans">
                      {catalyst}
                    </p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-emerald-400/50 group-hover:text-emerald-400 shrink-0 transition-colors" />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-xs text-[#94a3b8] font-mono">
              Analyzing growth catalysts...
            </div>
          )}
        </div>
      </div>

      {/* Institutional Takeaway Footer */}
      <div className="mt-4 pt-3 border-t border-[#1e293b] flex items-center justify-between text-[11px] font-mono text-[#94a3b8]">
        <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
          <Zap className="w-3.5 h-3.5" />
          High Operating Leverage Factor
        </span>
        <span className="text-slate-400">Verified by CIO Quantitative Model</span>
      </div>
    </div>
  );
};
