import express from 'express';
import path from 'path';
import fs from 'fs';
import { execFile } from 'child_process';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

class GeminiKeyRotator {
  private keys: string[] = [];
  private currentIndex: number = 0;
  private exhaustedKeys = new Map<string, number>();
  private readonly cooldownMs = 3600 * 1000; // 1 hour cooldown

  constructor() {
    this.discoverKeys();
  }

  public discoverKeys(): string[] {
    const rawCandidates = [
      process.env.GEMINI_API_KEY,
      process.env.GEMINI_API_KEYS,
      process.env.GOOGLE_API_KEY,
      process.env.GOOGLE_API_KEYS,
    ];

    const discovered: string[] = [];

    // Parse comma or semicolon separated keys
    for (const raw of rawCandidates) {
      if (raw) {
        const parts = raw
          .replace(/;/g, ',')
          .replace(/\n/g, ',')
          .split(',')
          .map((k) => k.trim().replace(/^['"]|['"]$/g, ''))
          .filter((k) => k.length > 10);
        for (const p of parts) {
          if (!discovered.includes(p)) discovered.push(p);
        }
      }
    }

    // Numbered variables: GEMINI_API_KEY_1..20, GOOGLE_API_KEY_1..20
    for (const prefix of ['GEMINI_API_KEY_', 'GOOGLE_API_KEY_']) {
      for (let i = 1; i <= 20; i++) {
        const val = process.env[`${prefix}${i}`]?.trim()?.replace(/^['"]|['"]$/g, '');
        if (val && val.length > 10 && !discovered.includes(val)) {
          discovered.push(val);
        }
      }
    }

    this.keys = discovered;
    this.currentIndex = 0;
    if (this.keys.length > 0) {
      console.log(`[Gemini Rotator] Initialized with ${this.keys.length} API key(s) in pool.`);
    }
    return this.keys;
  }

  public maskKey(key: string): string {
    if (!key || key.length < 10) return '...';
    return `${key.slice(0, 6)}...${key.slice(-4)}`;
  }

  public getActiveKey(): string | null {
    if (this.keys.length === 0) {
      this.discoverKeys();
      if (this.keys.length === 0) return null;
    }

    const currentKey = this.keys[this.currentIndex];
    const exhaustedTime = this.exhaustedKeys.get(currentKey);
    if (exhaustedTime && Date.now() - exhaustedTime < this.cooldownMs) {
      return this.rotateKey('Current key in cooldown');
    }

    return currentKey;
  }

  public rotateKey(reason: string = 'Daily limit / Quota reached'): string | null {
    if (this.keys.length === 0) return null;

    const failedKey = this.keys[this.currentIndex];
    this.exhaustedKeys.set(failedKey, Date.now());
    console.warn(
      `[Gemini Rotator] Key #${this.currentIndex + 1} (${this.maskKey(failedKey)}) marked exhausted. Reason: ${reason}`
    );

    if (this.keys.length === 1) {
      return failedKey;
    }

    // Search next available key not in cooldown
    for (let i = 1; i < this.keys.length; i++) {
      const nextIdx = (this.currentIndex + i) % this.keys.length;
      const candidate = this.keys[nextIdx];
      const exTime = this.exhaustedKeys.get(candidate);
      if (!exTime || Date.now() - exTime >= this.cooldownMs) {
        this.currentIndex = nextIdx;
        console.log(
          `[Gemini Rotator] Rotated to Key #${nextIdx + 1}/${this.keys.length} (${this.maskKey(candidate)})`
        );
        return candidate;
      }
    }

    // Round-robin fallback if all hit quota
    this.currentIndex = (this.currentIndex + 1) % this.keys.length;
    const fallback = this.keys[this.currentIndex];
    console.warn(
      `[Gemini Rotator] All keys hit quota limits. Rotating round-robin to Key #${this.currentIndex + 1}/${this.keys.length}`
    );
    return fallback;
  }

  public get poolStats() {
    return {
      totalKeys: this.keys.length,
      currentIndex: this.currentIndex + 1,
      activeKeyMasked: this.keys.length > 0 ? this.maskKey(this.keys[this.currentIndex]) : null,
      exhaustedCount: Array.from(this.exhaustedKeys.values()).filter(
        (t) => Date.now() - t < this.cooldownMs
      ).length,
    };
  }
}

const keyRotator = new GeminiKeyRotator();

let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI | null {
  const activeKey = keyRotator.getActiveKey();
  if (activeKey) {
    return new GoogleGenAI({
      apiKey: activeKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return null;
}

// Executes Python CrewAI backend directly
function runCrewStockPython(ticker: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const venvPythonWin = path.join(process.cwd(), '.venv', 'Scripts', 'python.exe');
    const venvPythonPosix = path.join(process.cwd(), '.venv', 'bin', 'python');
    let pythonExe = 'python3';
    if (process.platform === 'win32') {
      pythonExe = fs.existsSync(venvPythonWin) ? venvPythonWin : 'python';
    } else {
      pythonExe = fs.existsSync(venvPythonPosix) ? venvPythonPosix : 'python3';
    }

    const scriptPath = path.join(process.cwd(), 'crew_stock.py');
    const activeKey = keyRotator.getActiveKey();

    execFile(
      pythonExe,
      [scriptPath, ticker, '--json'],
      {
        timeout: 20000,
        maxBuffer: 10 * 1024 * 1024,
        env: {
          ...process.env,
          ...(activeKey ? { GEMINI_API_KEY: activeKey, GOOGLE_API_KEY: activeKey } : {}),
        },
      },
      (error, stdout, stderr) => {
        try {
          const firstBrace = stdout.indexOf('{');
          const lastBrace = stdout.lastIndexOf('}');
          if (firstBrace !== -1 && lastBrace !== -1) {
            const jsonStr = stdout.substring(firstBrace, lastBrace + 1);
            const data = JSON.parse(jsonStr);
            if (data && data.ticker) {
              return resolve(data);
            }
          }
        } catch (parseErr) {
          // parse error
        }

        if (error) {
          return reject(error);
        }
        reject(new Error(`Invalid or empty response from market engine for ${ticker}`));
      }
    );
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    engine: 'Real-time Market Telemetry Engine (yfinance + SEC 10-Q)',
    pipeline: 'CrewAI Multi-Agent Architecture (crew_stock.py)',
    keyPool: keyRotator.poolStats,
    timestamp: new Date().toISOString(),
  });
});

// Architecture & Schema Endpoint
app.get('/api/architecture', (req, res) => {
  res.json({
    name: 'Stock Crew AI Intelligence Architecture',
    version: '2.5.0',
    backend: 'crew_stock.py (Python CrewAI + LangChain + LiteLLM)',
    llmEngine: 'Gemini 3.5 Flash Engine',
    agents: [
      {
        agent: 'Agent 1: Researcher',
        description: 'Gathers real-time financial telemetry, order book depth, news sentiment, and SEC filings.',
        tools: ['yfinance MCP', 'DuckDuckGo Search MCP'],
      },
      {
        agent: 'Agent 2: Chief Investment Officer',
        description: 'Performs multi-factor valuation modeling, DCF, technical price ladder calculations, and risk threat analysis.',
        tools: ['Gemini 3.5 Flash Engine', 'DCF Engine', 'Multi-Factor Risk Model'],
      },
      {
        agent: 'Multi-Factor Synthesis Engine',
        description: 'Compiles dual-thesis investment strategy balancing bullish catalysts against structural bear risks.',
        tools: ['Technical Ladder Model', 'Risk Evaluator'],
      },
    ],
    mermaidFlow: `graph TD
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
    
    Agent2 --> Synthesis[Multi-Factor Dual-Thesis Synthesis]
    Synthesis --> Dashboard[React Glassmorphic UI Dashboard]
    Dashboard --> Hero[Primary Recommendation Hero Card]
    Dashboard --> Grid[Financial Metrics & Technical Price Ladder]
    Dashboard --> Risks[Strategic Bull Catalysts & Structural Bear Risks]`,
  });
});

// Stock Analysis API: 100% Authentic Live Data
app.post('/api/analyze', async (req, res) => {
  const ticker = (req.body.ticker || 'NVDA').toUpperCase().trim();

  try {
    console.log(`[CrewAI Bridge] Fetching authentic live market data for ticker ${ticker}...`);
    const crewResult = await runCrewStockPython(ticker);
    if (crewResult && crewResult.ticker) {
      console.log(`[CrewAI Bridge] Successfully returned live market report for ${ticker} (Price: $${crewResult.currentPrice})`);
      return res.json(crewResult);
    }
    throw new Error(`Market data response incomplete for ${ticker}`);
  } catch (err: any) {
    console.error(`[CrewAI Bridge] Error fetching live data for ${ticker}:`, err?.message || err);
    return res.status(404).json({
      error: `Could not retrieve live market data for "${ticker}". Please verify the symbol (e.g. NVDA, TSLA, AAPL, MSFT, RELIANCE).`,
    });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Stock Crew AI server running on http://localhost:${PORT}`);
  });
}

startServer();
