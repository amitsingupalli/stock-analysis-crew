import React from 'react';
import { BearCaseRisk } from '../types';
import { AlertTriangle, Shield, CheckCircle, Info } from 'lucide-react';

interface BearCaseRisksProps {
  risks: BearCaseRisk[];
}

export const BearCaseRisks: React.FC<BearCaseRisksProps> = ({ risks }) => {
  const getSeverityBadge = (severity: BearCaseRisk['severity']) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'HIGH':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      case 'MEDIUM':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/40';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1e293b]">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#f8fafc]">
            Bear Case Risks (3 Structural Threats)
          </h2>
        </div>
        <span className="text-[11px] font-mono text-[#94a3b8]">Downside Stress Testing</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1">
        {risks.map((risk, index) => (
          <div
            key={risk.id}
            className="glass-panel rounded-xl p-4 border border-[#1e293b] flex flex-col justify-between hover:border-red-500/40 transition-all group"
          >
            <div>
              {/* Card Header & Severity Badge */}
              <div className="flex items-start justify-between gap-2 mb-2.5">
                <span className="text-xs font-mono font-bold text-red-400">
                  Threat 0{index + 1}
                </span>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getSeverityBadge(
                    risk.severity
                  )}`}
                >
                  {risk.severity} SEVERITY
                </span>
              </div>

              {/* Title */}
              <h3 className="text-sm font-bold text-[#f8fafc] group-hover:text-red-200 transition-colors mb-1.5 leading-snug">
                {risk.title}
              </h3>

              {/* Description */}
              <p className="text-xs text-[#94a3b8] leading-relaxed mb-3">
                {risk.description}
              </p>
            </div>

            {/* Probability & Mitigation Footer */}
            <div className="pt-2.5 border-t border-[#1e293b]/70 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-[#94a3b8]">Impact Probability:</span>
                <span className="text-[#f8fafc] font-semibold">{risk.impactProbability}</span>
              </div>

              {/* Mitigation */}
              <div className="bg-[#0b0f19]/70 rounded p-2 border border-[#1e293b] text-[11px] flex items-start gap-1.5">
                <Shield className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                <span className="text-[#94a3b8] leading-tight">
                  <strong className="text-teal-300 font-mono">Mitigation: </strong>
                  {risk.mitigation}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
