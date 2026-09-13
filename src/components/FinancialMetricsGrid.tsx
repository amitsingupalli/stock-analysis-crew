import React from 'react';
import { FinancialMetric } from '../types';
import { TrendingUp, BarChart3, PieChart, Coins } from 'lucide-react';

interface FinancialMetricsGridProps {
  metrics: FinancialMetric[];
}

export const FinancialMetricsGrid: React.FC<FinancialMetricsGridProps> = ({ metrics }) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'rev_growth':
        return <TrendingUp className="w-4 h-4 text-emerald-400" />;
      case 'pe_ratio':
        return <BarChart3 className="w-4 h-4 text-teal-400" />;
      case 'gross_margin':
        return <PieChart className="w-4 h-4 text-emerald-400" />;
      case 'fcf_margin':
        return <Coins className="w-4 h-4 text-teal-400" />;
      default:
        return <BarChart3 className="w-4 h-4 text-[#94a3b8]" />;
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {metrics.map((m) => (
        <div
          key={m.id}
          className="glass-panel rounded-xl p-4 border border-[#1e293b] flex flex-col justify-between hover:border-[#94a3b8]/40 transition-all group"
        >
          <div className="flex items-center justify-between text-[#94a3b8]">
            <span className="text-xs font-mono tracking-wider uppercase text-[#94a3b8]">
              {m.label}
            </span>
            <div className="p-1.5 rounded-md bg-[#0b0f19] border border-[#1e293b] group-hover:border-teal-500/30 transition-all">
              {getIcon(m.id)}
            </div>
          </div>

          <div className="my-2.5">
            <div className="text-2xl sm:text-3xl font-mono font-extrabold text-[#f8fafc] tracking-tight">
              {m.value}
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#94a3b8] truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400/80 shrink-0"></span>
            <span className="truncate">{m.subtitle}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
