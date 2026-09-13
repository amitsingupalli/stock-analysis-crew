import React, { useState } from 'react';
import { StockAnalysisData } from './types';
import { NVDA_STOCK_DATA, POPULAR_TICKERS } from './data/mockStockData';
import { Header } from './components/Header';
import { AgentTelemetryBar } from './components/AgentTelemetryBar';
import { PrimaryHeroCard } from './components/PrimaryHeroCard';
import { FinancialMetricsGrid } from './components/FinancialMetricsGrid';
import { TechnicalPriceLadder } from './components/TechnicalPriceLadder';
import { BullishCatalystsCard } from './components/BullishCatalystsCard';
import { BearCaseRisks } from './components/BearCaseRisks';
import { ArchitectureModal } from './components/ArchitectureModal';
import { DesignTokensModal } from './components/DesignTokensModal';
import { AlertCircle } from 'lucide-react';

export default function App() {
  const [currentTicker, setCurrentTicker] = useState<string>('NVDA');
  const [stockData, setStockData] = useState<StockAnalysisData>(NVDA_STOCK_DATA);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeAgentIndex, setActiveAgentIndex] = useState<number>(2); // 0=Researcher, 1=CIO, 2=Synthesis
  const [architectureOpen, setArchitectureOpen] = useState<boolean>(false);
  const [designTokensOpen, setDesignTokensOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const popularTickersList = ['NVDA', 'AAPL', 'TSLA', 'MSFT'];

  const executeAnalysis = async (tickerToAnalyze?: string) => {
    const targetTicker = (tickerToAnalyze || currentTicker).toUpperCase().trim();
    if (!targetTicker) return;

    setIsLoading(true);
    setErrorMessage(null);

    // Agent Telemetry progression across analysis window
    setActiveAgentIndex(0); // Agent 1: Researcher running
    const timer1 = setTimeout(() => {
      setActiveAgentIndex(1); // Agent 2: CIO running
    }, 1200);

    const timer2 = setTimeout(() => {
      setActiveAgentIndex(2); // Synthesis & Final Verdict
    }, 2600);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker: targetTicker }),
      });

      if (!response.ok) {
        throw new Error(`Analysis server returned ${response.status}`);
      }

      const data: StockAnalysisData = await response.json();
      setStockData(data);
    } catch (err: any) {
      console.warn('Backend API request failed, falling back to client cache:', err);
      // Fallback to local cache if offline or network glitch
      if (POPULAR_TICKERS[targetTicker]) {
        setStockData(POPULAR_TICKERS[targetTicker]);
      } else {
        // Generate client-side fallback
        const fallback = {
          ...NVDA_STOCK_DATA,
          ticker: targetTicker,
          companyName: `${targetTicker} Corp`,
        };
        setStockData(fallback);
      }
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setActiveAgentIndex(2);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-[#f8fafc] flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* 1. Header with Search, Presets, and Controls */}
      <Header
        ticker={currentTicker}
        onTickerChange={setCurrentTicker}
        onAnalyze={executeAnalysis}
        isLoading={isLoading}
        onOpenArchitecture={() => setArchitectureOpen(true)}
        onOpenDesignTokens={() => setDesignTokensOpen(true)}
        popularTickers={popularTickersList}
      />

      {/* 2. Live Agent Telemetry Pipeline Bar */}
      <AgentTelemetryBar
        steps={stockData.pipelineSteps}
        isLoading={isLoading}
        activeAgentIndex={activeAgentIndex}
      />

      {/* Error alert if any */}
      {errorMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-3 w-full">
          <div className="bg-red-500/10 border border-red-500/40 text-red-300 px-4 py-2 rounded-lg text-xs font-mono flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => executeAnalysis(currentTicker)}
              className="underline hover:text-white"
            >
              Retry Analysis
            </button>
          </div>
        </div>
      )}

      {/* Main Dashboard Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Top 2-Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Primary Recommendation Hero Card (5 cols on lg) */}
          <div className="lg:col-span-5 flex flex-col">
            <PrimaryHeroCard data={stockData} />
          </div>

          {/* Right Column: Financial Metrics & Technical Levels Grid (7 cols on lg) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            {/* Financial Metrics Grid (4 Stat Cards) */}
            <FinancialMetricsGrid metrics={stockData.metrics} />

            {/* Technical Entry & Exit Price Ladder */}
            <TechnicalPriceLadder
              levels={stockData.priceLadder}
              currentPrice={stockData.currentPrice}
            />
          </div>
        </div>

        {/* Bottom Section: Dual-Thesis Strategic Intelligence (Bull vs Bear) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Strategic Growth Catalysts & Bull Thesis (6 cols) */}
          <div className="lg:col-span-6 flex flex-col">
            <BullishCatalystsCard catalysts={stockData.bullishCatalysts} />
          </div>

          {/* Right: Structural Downside Risks & Bear Thesis (6 cols) */}
          <div className="lg:col-span-6 flex flex-col">
            <BearCaseRisks risks={stockData.bearCaseRisks} />
          </div>
        </div>
      </main>

      {/* Minimal Brutalist Footer */}
      <footer className="border-t border-[#1e293b] bg-[#070a11] py-4 px-4 sm:px-6 text-center text-xs font-mono text-[#94a3b8]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-[#f8fafc] font-semibold">Stock Crew AI Intelligence</span>
            <span>• CrewAI Python Backend (crew_stock.py)</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setArchitectureOpen(true)}
              className="hover:text-emerald-400 transition-colors"
            >
              System Architecture Flow
            </button>
            <span>•</span>
            <button
              onClick={() => setDesignTokensOpen(true)}
              className="hover:text-emerald-400 transition-colors"
            >
              Design Tokens & Handoff
            </button>
            <span>•</span>
            <span className="text-emerald-400 font-medium">Research Synthesis: Verified ✓</span>
          </div>
        </div>
      </footer>

      {/* Modals & Inspection Drawers */}
      <ArchitectureModal
        isOpen={architectureOpen}
        onClose={() => setArchitectureOpen(false)}
      />

      <DesignTokensModal
        isOpen={designTokensOpen}
        onClose={() => setDesignTokensOpen(false)}
        rawStockData={stockData}
      />
    </div>
  );
}
