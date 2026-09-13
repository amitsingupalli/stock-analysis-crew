import React from 'react';
import { TechnicalLevel } from '../types';
import { Layers, ShieldCheck } from 'lucide-react';
import { Currency, formatPrice } from '../utils/currency';

interface TechnicalPriceLadderProps {
  levels: TechnicalLevel[];
  currentPrice: number;
  currency: Currency;
}

export const TechnicalPriceLadder: React.FC<TechnicalPriceLadderProps> = ({ levels, currentPrice, currency }) => {
  // Sort from highest price to lowest price
  const sortedLevels = [...levels].sort((a, b) => b.price - a.price);

  const getRowStyling = (type: TechnicalLevel['type']) => {
    switch (type) {
      case 'r2':
        return {
          bg: 'bg-red-500/10 border-red-500/30 hover:border-red-500/50',
          badge: 'bg-red-500/20 text-red-400 border border-red-500/40',
          priceColor: 'text-red-400',
          label: 'R2 Resistance',
          tagColor: 'text-red-400',
        };
      case 'r1':
        return {
          bg: 'bg-orange-500/10 border-orange-500/30 hover:border-orange-500/50',
          badge: 'bg-orange-500/20 text-orange-400 border border-orange-500/40',
          priceColor: 'text-orange-400',
          label: 'R1 Resistance',
          tagColor: 'text-orange-400',
        };
      case 'current':
        return {
          bg: 'bg-emerald-500/15 border-2 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.25)] relative z-10',
          badge: 'bg-emerald-500 text-slate-950 font-black',
          priceColor: 'text-emerald-300 font-black',
          label: 'CURRENT PRICE',
          tagColor: 'text-emerald-400',
        };
      case 's1':
        return {
          bg: 'bg-teal-500/10 border-teal-500/30 hover:border-teal-500/50',
          badge: 'bg-teal-500/20 text-teal-300 border border-teal-500/40',
          priceColor: 'text-teal-300',
          label: 'S1 Key Support',
          tagColor: 'text-teal-300',
        };
      case 's2':
        return {
          bg: 'bg-[#1e293b]/40 border-[#1e293b] hover:border-[#94a3b8]/40',
          badge: 'bg-[#1e293b] text-[#94a3b8] border border-[#334155]',
          priceColor: 'text-[#94a3b8]',
          label: 'S2 Floor Support',
          tagColor: 'text-[#94a3b8]',
        };
    }
  };

  return (
    <div className="glass-panel rounded-xl p-5 border border-[#1e293b]">
      <div className="flex items-center justify-between pb-3.5 border-b border-[#1e293b] mb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-teal-400" />
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#f8fafc]">
            Technical Entry & Exit Price Ladder
          </h2>
        </div>
        <span className="text-[11px] font-mono text-[#94a3b8]">Order Book Pivots</span>
      </div>

      <div className="space-y-2">
        {sortedLevels.map((lvl) => {
          const style = getRowStyling(lvl.type);
          const isCurrent = lvl.type === 'current';
          const distance =
            lvl.distancePercent !== undefined
              ? lvl.distancePercent
              : Math.round(((lvl.price - currentPrice) / currentPrice) * 10000) / 100;

          return (
            <div
              key={lvl.id}
              className={`p-3 rounded-lg border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${style.bg}`}
            >
              {/* Left: Level label & description */}
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-mono font-bold px-2.5 py-1 rounded uppercase tracking-wider shrink-0 ${style.badge}`}
                >
                  {lvl.level}
                </span>
                <span className="text-xs font-sans text-[#f8fafc] font-medium">
                  {lvl.description}
                </span>
              </div>

              {/* Right: Price & Distance Spread */}
              <div className="flex items-center justify-between sm:justify-end gap-3 pl-2 sm:pl-0">
                {!isCurrent && (
                  <span
                    className={`text-xs font-mono font-semibold ${
                      distance > 0 ? 'text-red-400' : 'text-teal-400'
                    }`}
                  >
                    {distance > 0 ? `+${distance.toFixed(2)}%` : `${distance.toFixed(2)}%`}
                  </span>
                )}
                {isCurrent && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/40 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    ACTIVE SPOT
                  </span>
                )}

                <div className="flex items-baseline gap-1">
                  <span className={`text-lg sm:text-xl font-mono ${style.priceColor}`}>
                    {formatPrice(lvl.price, currency)}
                  </span>
                  <span className="text-[10px] font-mono text-[#94a3b8]">{currency}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trade execution advice footer */}
      <div className="mt-4 pt-3 border-t border-[#1e293b] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-[#94a3b8]">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Execution Strategy:</span>
          <span className="text-emerald-300 font-semibold">Scale In at S1 ($120.00), Stop Below S2 ($110.00)</span>
        </div>
        <div className="flex items-center gap-1">
          <span>Target Exit:</span>
          <span className="text-red-400 font-semibold">R1-R2 Zone ($140 - $150)</span>
        </div>
      </div>
    </div>
  );
};
