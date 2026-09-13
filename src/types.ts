export type VerdictType = 'BUY' | 'HOLD' | 'SELL';

export interface AgentStep {
  id: string;
  name: string;
  role: string;
  tools: string[];
  status: 'pending' | 'running' | 'completed' | 'error';
  latencyMs?: number;
  summary?: string;
  outputPreview?: string;
}

export interface TechnicalLevel {
  id: string;
  level: string; // e.g., 'R2 Resistance', 'R1 Resistance', 'CURRENT PRICE', 'S1 Key Support', 'S2 Floor Support'
  price: number;
  description: string;
  type: 'r2' | 'r1' | 'current' | 's1' | 's2';
  distancePercent?: number;
}

export interface FinancialMetric {
  id: string;
  label: string;
  value: string;
  subtitle: string;
  trend?: 'up' | 'down' | 'neutral';
  highlightColor?: string;
}

export interface BearCaseRisk {
  id: string;
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  impactProbability: string;
  mitigation: string;
}

export interface PostgresReceipt {
  host: string;
  schema: string;
  transactionId: string;
  status: 'SUCCESS' | 'COMMITTED';
  executionTimeMs: number;
  timestamp: string;
  query: string;
  hash: string;
  table: string;
}

export interface StockAnalysisData {
  companyName: string;
  ticker: string;
  exchange: string;
  sector: string;
  verdict: VerdictType;
  verdictSubtitle: string;
  currentPrice: number;
  targetPrice: number;
  projectedUpside: number;
  convictionScore: number; // 0-100
  aiExecutiveSummary: string;
  bullishCatalysts: string[];
  metrics: FinancialMetric[];
  priceLadder: TechnicalLevel[];
  bearCaseRisks: BearCaseRisk[];
  postgresReceipt?: PostgresReceipt;
  lastUpdated: string;
  pipelineSteps: AgentStep[];
}

export interface DesignToken {
  name: string;
  code: string;
  rgb: string;
  purpose: string;
}
