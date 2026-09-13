import React, { useState } from 'react';
import { StockAnalysisData } from './types';
import { NVDA_STOCK_DATA, POPULAR_TICKERS } from './data/mockStockData';
import { Header } from './components/Header';
import { PrimaryHeroCard } from './components/PrimaryHeroCard';
import { FinancialMetricsGrid } from './components/FinancialMetricsGrid';
import { TechnicalPriceLadder } from './components/TechnicalPriceLadder';
import { BullishCatalystsCard } from './components/BullishCatalystsCard';
import { BearCaseRisks } from './components/BearCaseRisks';
import { StockPriceChart } from './components/StockPriceChart';
import { AlertCircle } from 'lucide-react';
import { Currency } from './utils/currency';

export default function App() {
  const [currentTicker, setCurrentTicker] = useState<string>('NVDA');
  const [stockData, setStockData] = useState<StockAnalysisData>(NVDA_STOCK_DATA);
  const [currency, setCurrency] = useState<Currency>('USD');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const popularTickersList = ['NVDA', 'AAPL', 'TSLA', 'MSFT'];

  // Auto-load authentic live market telemetry on first render
  React.useEffect(() => {
    executeAnalysis('NVDA');
  }, []);

  const executeAnalysis = async (tickerToAnalyze?: string) => {
    const targetTicker = (tickerToAnalyze || currentTicker).toUpperCase().trim();
    if (!targetTicker) return;
    if (tickerToAnalyze) setCurrentTicker(tickerToAnalyze);

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker: targetTicker }),
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        throw new Error(errorJson.error || `Analysis request returned status ${response.status}`);
      }

      const data: StockAnalysisData = await response.json();
      setStockData(data);
    } catch (err: any) {
      console.warn('Backend API request failed:', err);
      setErrorMessage(err?.message || `Could not fetch live market data for "${targetTicker}". Please verify ticker.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-[#f8fafc] flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* 1. Header with Search and Presets */}
      <Header
        ticker={currentTicker}
        onTickerChange={setCurrentTicker}
        onAnalyze={executeAnalysis}
        isLoading={isLoading}
        popularTickers={popularTickersList}
        currency={currency}
        onCurrencyChange={setCurrency}
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
            <PrimaryHeroCard data={stockData} currency={currency} />
          </div>

          {/* Right Column: Financial Metrics & Technical Levels Grid (7 cols on lg) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            {/* Financial Metrics Grid (4 Stat Cards) */}
            <FinancialMetricsGrid metrics={stockData.metrics} />

            {/* Technical Entry & Exit Price Ladder */}
            <TechnicalPriceLadder
              levels={stockData.priceLadder}
              currentPrice={stockData.currentPrice}
              currency={currency}
              baseCurrency={stockData.ticker.endsWith('.NS') || stockData.exchange === 'NSE' ? 'INR' : 'USD'}
            />
          </div>
        </div>

        {/* Full-Width Interactive Stock Chart & Technical Targets */}
        <div className="w-full">
          <StockPriceChart
            candles={stockData.candles}
            ticker={stockData.ticker}
            companyName={stockData.companyName}
            currentPrice={stockData.currentPrice}
            targetPrice={stockData.targetPrice}
            priceLadder={stockData.priceLadder}
            currency={currency}
            baseCurrency={stockData.ticker.endsWith('.NS') || stockData.exchange === 'NSE' ? 'INR' : 'USD'}
          />
        </div>

        {/* Bottom Section: Strategic Catalysts & Risks */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Strategic Growth Catalysts & Drivers (6 cols) */}
          <div className="lg:col-span-6 flex flex-col">
            <BullishCatalystsCard catalysts={stockData.bullishCatalysts} />
          </div>

          {/* Right: Structural Downside Risks (6 cols) */}
          <div className="lg:col-span-6 flex flex-col">
            <BearCaseRisks risks={stockData.bearCaseRisks} />
          </div>
        </div>
      </main>

      {/* Minimal Clean Footer */}
      <footer className="border-t border-[#1e293b] bg-[#070a11] py-4 px-4 sm:px-6 text-center text-xs font-mono text-[#94a3b8]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-[#f8fafc] font-semibold">Stock Intelligence Dashboard</span>
            <span>• Real-time Equity Analysis</span>
          </div>

          <div className="flex items-center gap-4 text-[#94a3b8]">
            <span>Market Data: Live Feed</span>
            <span>•</span>
            <span className="text-emerald-400 font-medium">Updated Real-Time ✓</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
