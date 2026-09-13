import React, { useState } from 'react';
import { X, Code, Copy, Check, Download, Layers, Palette, FileText, CheckCircle2 } from 'lucide-react';
import { DESIGN_TOKENS } from '../data/mockStockData';

interface DesignTokensModalProps {
  isOpen: boolean;
  onClose: () => void;
  rawStockData: any;
}

export const DesignTokensModal: React.FC<DesignTokensModalProps> = ({
  isOpen,
  onClose,
  rawStockData,
}) => {
  const [activeTab, setActiveTab] = useState<'tokens' | 'hierarchy' | 'contract' | 'prototype'>('tokens');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [copiedJson, setCopiedJson] = useState(false);

  if (!isOpen) return null;

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedToken(code);
    setTimeout(() => setCopiedToken(null), 1500);
  };

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(JSON.stringify(rawStockData, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleDownloadPrototype = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Stock Crew AI - Standalone Prototype</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;800&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #0b0f19; color: #f8fafc; }
    .mono { font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body class="p-6">
  <div class="max-w-6xl mx-auto space-y-6">
    <header class="border-b border-[#1e293b] pb-4 flex justify-between items-center">
      <h1 class="text-2xl font-bold">Stock Crew AI - NVIDIA Corp ($NVDA)</h1>
      <span class="mono text-xs px-3 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">GEMINI 3.5 FLASH ENGINE</span>
    </header>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-[#141b2d] border border-[#1e293b] p-6 rounded-xl">
        <h2 class="text-xl font-bold mono">NVIDIA Corp (NASDAQ: NVDA)</h2>
        <div class="my-4 text-4xl mono font-extrabold text-emerald-400">BUY</div>
        <p class="text-sm text-slate-300">Spot: $132.50 | 12M Target: $165.00 (+24.53%) | Conviction: 92/100</p>
      </div>
      <div class="bg-[#141b2d] border border-[#1e293b] p-6 rounded-xl space-y-2 mono text-sm">
        <div class="p-2 bg-red-500/20 rounded">R2 Resistance: $150.00</div>
        <div class="p-2 bg-orange-500/20 rounded">R1 Resistance: $140.00</div>
        <div class="p-2 bg-emerald-500/30 font-bold border border-emerald-500 rounded">CURRENT: $132.50</div>
        <div class="p-2 bg-teal-500/20 rounded">S1 Support: $120.00</div>
        <div class="p-2 bg-slate-800 rounded">S2 Floor: $110.00</div>
      </div>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stock_analysis_dashboard.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b0f19]/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#141b2d] border border-[#1e293b] rounded-2xl shadow-2xl p-6 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1e293b]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#f8fafc] font-sans">
                Design Tokens & Open-Design Specification
              </h2>
              <p className="text-xs font-mono text-[#94a3b8]">
                Production Handoff Pack • Tokens, Component Hierarchy & API Payload Contract
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

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 pt-4 pb-2 border-b border-[#1e293b] overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setActiveTab('tokens')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${
              activeTab === 'tokens'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-[#94a3b8] hover:text-white hover:bg-[#0b0f19]'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            Design Tokens Table
          </button>

          <button
            onClick={() => setActiveTab('hierarchy')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${
              activeTab === 'hierarchy'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-[#94a3b8] hover:text-white hover:bg-[#0b0f19]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Component Hierarchy
          </button>

          <button
            onClick={() => setActiveTab('contract')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${
              activeTab === 'contract'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-[#94a3b8] hover:text-white hover:bg-[#0b0f19]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Backend JSON Contract (crew_stock.py)
          </button>

          <button
            onClick={() => setActiveTab('prototype')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${
              activeTab === 'prototype'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-[#94a3b8] hover:text-white hover:bg-[#0b0f19]'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            Handoff Deliverables
          </button>
        </div>

        {/* Tab Contents */}
        <div className="py-4 max-h-[65vh] overflow-y-auto pr-1">
          {/* 1. Design Tokens Table */}
          {activeTab === 'tokens' && (
            <div className="space-y-4">
              <div className="overflow-x-auto rounded-lg border border-[#1e293b]">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#0b0f19] border-b border-[#1e293b] text-[#94a3b8] uppercase">
                    <tr>
                      <th className="px-4 py-3">Token Name</th>
                      <th className="px-4 py-3">Preview</th>
                      <th className="px-4 py-3">Hex / Font</th>
                      <th className="px-4 py-3">Purpose</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e293b] bg-[#0f1524]">
                    {DESIGN_TOKENS.map((token) => (
                      <tr key={token.name} className="hover:bg-[#141b2d] transition-colors">
                        <td className="px-4 py-2.5 font-bold text-[#f8fafc]">{token.name}</td>
                        <td className="px-4 py-2.5">
                          {token.code.startsWith('#') ? (
                            <div
                              className="w-6 h-6 rounded border border-white/20 shadow-sm"
                              style={{ backgroundColor: token.code }}
                            />
                          ) : (
                            <span className="text-[11px] font-mono text-teal-400">AaBbCc</span>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-teal-300 font-bold">{token.code}</td>
                        <td className="px-4 py-2.5 text-[#94a3b8]">{token.purpose}</td>
                        <td className="px-4 py-2.5 text-right">
                          <button
                            onClick={() => handleCopyCode(token.code)}
                            className="p-1 px-2 rounded bg-[#0b0f19] hover:bg-[#1e293b] text-[11px] text-[#94a3b8] hover:text-white border border-[#1e293b] inline-flex items-center gap-1"
                          >
                            {copiedToken === token.code ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Aesthetic Philosophy Note */}
              <div className="p-3.5 bg-[#0b0f19] rounded-lg border border-[#1e293b] text-xs text-[#94a3b8]">
                <strong className="text-[#f8fafc] font-sans">Brutalist Dark Mode Philosophy: </strong>
                High-density financial layout optimized for rapid eye scanning. Clean, unadorned borders
                (#1e293b) frame elevated glassmorphic containers (#141b2d) on a deep midnight base (#0b0f19),
                with purposeful directional emerald (#10b981) and risk red (#ef4444) signals.
              </div>
            </div>
          )}

          {/* 2. Component Hierarchy */}
          {activeTab === 'hierarchy' && (
            <div className="space-y-3 font-mono text-xs">
              <div className="bg-[#070a11] p-4 rounded-lg border border-[#1e293b] text-slate-300 leading-relaxed overflow-x-auto">
                <pre>{`App.tsx (Root Container: bg-[#0b0f19], text-[#f8fafc])
 ├── Header.tsx
 │    ├── Logo & Title ("Stock Crew AI" + "Gemini 3.5 Flash Engine" Glowing Badge)
 │    ├── Search Bar (Monospace ticker input e.g. NVDA + "Analyze Stock (~5s)")
 │    └── Preset Bluechips Ticker Quick Switcher (NVDA, AAPL, TSLA, MSFT)
 ├── AgentTelemetryBar.tsx
 │    ├── Agent 1: Researcher (yfinance & DDG MCP Status Indicator)
 │    ├── Agent 2: Chief Investment Officer (DCF & Valuation Status)
 │    └── PostgreSQL DB Committed ✓ (Transaction Pulse)
 ├── Main Dashboard Grid (2-Column Responsive Layout)
 │    ├── Left Column: Primary Recommendation Hero Card
 │    │    ├── Stock Identity (NVIDIA Corp, NASDAQ: NVDA, Semiconductor)
 │    │    ├── Glow Verdict Badge (BUY, HOLD, SELL pulsing aura)
 │    │    ├── Key Valuation Highlight (Current Price, 12M Target, Upside %)
 │    │    ├── AI Conviction Score Meter (92/100 Progress Bar + AI Summary)
 │    │    └── Strategic Bullish Catalysts List
 │    └── Right Column: Financial Metrics & Technical Levels Grid
 │         ├── Financial Metrics Grid (4 Stat Cards)
 │         │    ├── YoY Revenue Growth (+94.0%)
 │         │    ├── Forward P/E Ratio (31.8x)
 │         │    ├── Gross Margin (75.1%)
 │         │    └── Free Cash Flow Margin (48.5%)
 │         └── Technical Entry & Exit Price Ladder (Vertical Stack)
 │              ├── R2 Resistance: $150.00 (All-Time High / Target)
 │              ├── R1 Resistance: $140.00 (Local Peak / Supply Zone)
 │              ├── CURRENT PRICE: $132.50 (Highlighted Active Row)
 │              ├── S1 Key Support: $120.00 (100-Day EMA)
 │              └── S2 Floor Support: $110.00 (200-Day SMA)
 ├── Bottom Section: Bear Case Risks & PostgreSQL Audit Log
 │    ├── BearCaseRisks.tsx (3 Threat Cards)
 │    │    ├── Threat 01: Hyperscaler Concentration
 │    │    ├── Threat 02: TSMC Geopolitical & CoWoS Bottlenecks
 │    │    └── Threat 03: Custom Cloud ASIC Competition
 │    └── PostgresReceiptCard.tsx
 │         ├── Confirmation Details (Host, Schema, Transaction ID, Status)
 │         ├── Terminal SQL Query Block (INSERT INTO investment_reports...)
 │         └── Cryptographic Audit Verification Hash (SHA-256)
 └── Modals & Inspection Drawers
      ├── ArchitectureModal.tsx (Mermaid System Flow)
      └── DesignTokensModal.tsx (Design Tokens & Handoff Deliverables)`}</pre>
              </div>
            </div>
          )}

          {/* 3. Backend JSON Contract */}
          {activeTab === 'contract' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#94a3b8]">
                  Live JSON Payload Output from crew_stock.py Backend
                </span>
                <button
                  onClick={handleCopyPayload}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0b0f19] hover:bg-[#1e293b] text-xs font-mono text-[#f8fafc] border border-[#1e293b]"
                >
                  {copiedJson ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied Payload</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Full JSON</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-[#070a11] p-3.5 rounded-lg border border-[#1e293b] font-mono text-[11px] text-slate-300 max-h-[50vh] overflow-y-auto overflow-x-auto">
                <pre>{JSON.stringify(rawStockData, null, 2)}</pre>
              </div>
            </div>
          )}

          {/* 4. Handoff Deliverables */}
          {activeTab === 'prototype' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#0b0f19] rounded-xl border border-[#1e293b] space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  Handoff Deliverables for Open-Design / Frontend Team
                </div>
                <ul className="text-xs text-[#94a3b8] space-y-2 list-disc pl-5">
                  <li>
                    <strong className="text-[#f8fafc]">Interactive Prototype: </strong>
                    <code className="text-teal-300 bg-[#141b2d] px-1.5 py-0.5 rounded border border-[#1e293b]">
                      stock_analysis_dashboard.html
                    </code>{' '}
                    — Standalone single-file HTML prototype matching tokens and layout.
                  </li>
                  <li>
                    <strong className="text-[#f8fafc]">Design Tokens & Hierarchy: </strong>
                    Complete CSS theme variables, color tokens, and brutalist card specs.
                  </li>
                  <li>
                    <strong className="text-[#f8fafc]">CrewAI Python Backend Contract: </strong>
                    Schema and endpoint specs for <code className="text-teal-300">crew_stock.py</code>.
                  </li>
                  <li>
                    <strong className="text-[#f8fafc]">SLA Verification: </strong>
                    Sub-5-second analysis response time benchmark across mobile and desktop.
                  </li>
                </ul>

                <div className="pt-2 flex gap-3">
                  <button
                    onClick={handleDownloadPrototype}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                  >
                    <Download className="w-4 h-4" />
                    Download stock_analysis_dashboard.html
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-[#1e293b] flex items-center justify-between text-xs font-mono text-[#94a3b8]">
          <span>Open-Design Ready Specification</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#0b0f19] border border-[#1e293b] text-[#f8fafc] hover:bg-[#1e293b] transition-all"
          >
            Close Specification
          </button>
        </div>
      </div>
    </div>
  );
};
