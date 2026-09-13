import React from 'react';
import { X, Activity, Cpu, ArrowDown, Database, Server, Sparkles, Terminal, CheckCircle2 } from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b0f19]/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#141b2d] border border-[#1e293b] rounded-2xl shadow-2xl p-6 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1e293b]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#f8fafc] font-sans">
                System Architecture & Flow Specification
              </h2>
              <p className="text-xs font-mono text-[#94a3b8]">
                CrewAI Python Backend (crew_stock.py) • Multi-Agent Pipeline & Database Telemetry
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#0b0f19] border border-[#1e293b] text-[#94a3b8] hover:text-[#f8fafc] hover:border-red-500/40 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-5 space-y-6 max-h-[75vh] overflow-y-auto pr-2">
          {/* Interactive Visual Mermaid Flow */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Mermaid Visual Architecture Diagram
              </span>
              <span className="text-[11px] font-mono text-[#94a3b8]">
                End-to-End Execution Flow (&lt;5s SLA)
              </span>
            </div>

            {/* Architecture Visual Diagram Canvas */}
            <div className="p-4 bg-[#070a11] rounded-xl border border-[#1e293b] space-y-3">
              {/* Step 1: User Request */}
              <div className="flex items-center justify-center">
                <div className="bg-[#141b2d] border border-[#1e293b] px-4 py-2 rounded-lg text-center max-w-sm">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">
                    Trigger Layer
                  </span>
                  <span className="text-xs font-mono font-bold text-[#f8fafc]">
                    User Search ($NVDA) → Analyze Stock (~5s)
                  </span>
                </div>
              </div>

              <div className="flex justify-center text-[#94a3b8]">
                <ArrowDown className="w-4 h-4 text-emerald-400" />
              </div>

              {/* Step 2: CrewAI Orchestration */}
              <div className="flex items-center justify-center">
                <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 border border-emerald-500/40 px-5 py-2.5 rounded-lg text-center shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                  <div className="flex items-center justify-center gap-2 mb-0.5">
                    <Cpu className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-mono font-bold text-[#f8fafc]">
                      CrewAI Backend Engine (crew_stock.py)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#94a3b8]">
                    Sequential Multi-Agent Task Delegation Pipeline
                  </span>
                </div>
              </div>

              <div className="flex justify-center text-[#94a3b8]">
                <ArrowDown className="w-4 h-4 text-teal-400" />
              </div>

              {/* Step 3: Multi-Agent Pipeline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Agent 1 */}
                <div className="bg-[#141b2d] border border-[#1e293b] p-3 rounded-lg relative">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-mono font-bold text-emerald-400">
                      Agent 1: Researcher
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#0b0f19] text-[#94a3b8]">
                      ~1.2s Latency
                    </span>
                  </div>
                  <p className="text-xs text-[#94a3b8] mb-2 font-sans">
                    Ingests live equity order book, fundamental ratios, balance sheets, and catalyst news.
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0b0f19] text-teal-300 border border-[#1e293b]">
                      yfinance MCP
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0b0f19] text-teal-300 border border-[#1e293b]">
                      DuckDuckGo Search MCP
                    </span>
                  </div>
                </div>

                {/* Agent 2 */}
                <div className="bg-[#141b2d] border border-teal-500/40 p-3 rounded-lg shadow-[0_0_12px_rgba(20,184,166,0.15)]">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-mono font-bold text-teal-300 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-teal-400" />
                      Agent 2: Chief Investment Officer
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#0b0f19] text-teal-400">
                      ~1.8s Latency
                    </span>
                  </div>
                  <p className="text-xs text-[#94a3b8] mb-2 font-sans">
                    Synthesizes DCF multiples, builds technical support/resistance ladders, and calculates conviction.
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0b0f19] text-emerald-300 border border-emerald-500/30">
                      Gemini 3.5 Flash Engine
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0b0f19] text-emerald-300 border border-emerald-500/30">
                      Technical Ladder Model
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center text-[#94a3b8]">
                <ArrowDown className="w-4 h-4 text-emerald-400" />
              </div>

              {/* Step 4: Storage & UI Verification */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-[#0b0f19] border border-emerald-500/40 p-3 rounded-lg flex items-center gap-3">
                  <Sparkles className="w-7 h-7 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-[11px] font-mono font-bold text-emerald-300 block">
                      Multi-Factor Synthesis Engine ✓
                    </span>
                    <span className="text-[10px] font-mono text-[#94a3b8]">
                      Dual-Thesis (Bull & Bear) Valuation & Rating Model
                    </span>
                  </div>
                </div>

                <div className="bg-[#0b0f19] border border-[#1e293b] p-3 rounded-lg flex items-center gap-3">
                  <Server className="w-7 h-7 text-teal-400 shrink-0" />
                  <div>
                    <span className="text-[11px] font-mono font-bold text-[#f8fafc] block">
                      Frontend Glassmorphic UI Dashboard
                    </span>
                    <span className="text-[10px] font-mono text-[#94a3b8]">
                      Reactive Render &lt;42ms • Brutalist Dark Theme
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Raw Mermaid Syntax Definition */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#94a3b8] font-bold">
                Raw Mermaid Diagram Syntax:
              </span>
            </div>
            <div className="bg-[#070a11] rounded-lg p-3 border border-[#1e293b] font-mono text-[11px] text-slate-300 overflow-x-auto">
              <pre>{`graph TD
    User([User Request / Ticker]) --> Header[Header & Search Bar]
    Header --> CrewAI[CrewAI Orchestrator: crew_stock.py]
    
    subgraph AgentPipeline [Multi-Agent Execution Pipeline]
      CrewAI --> Agent1[Agent 1: Researcher]
      Agent1 --> Tools1[yfinance MCP + DuckDuckGo MCP]
      Tools1 --> Agent1
      Agent1 --> Agent2[Agent 2: Chief Investment Officer]
      Agent2 --> Gemini[Gemini 3.5 Flash Engine]
      Gemini --> Agent2
    end
    
    Agent2 --> PostgresCommit[(PostgreSQL prod-portfolio-db.internal)]
    PostgresCommit --> Dashboard[React Glassmorphic UI Dashboard]
    Dashboard --> Hero[Primary Recommendation Hero Card]
    Dashboard --> Grid[Financial Metrics & Technical Price Ladder]
    Dashboard --> Risks[Bear Case Risks & Postgres Audit Log]`}</pre>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-[#1e293b] flex items-center justify-between text-xs font-mono text-[#94a3b8]">
          <span>CrewAI Multi-Agent Architecture v2.4</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#0b0f19] border border-[#1e293b] text-[#f8fafc] hover:bg-[#1e293b] transition-all"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
