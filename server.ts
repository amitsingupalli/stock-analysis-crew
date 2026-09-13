import express from 'express';
import path from 'path';
import fs from 'fs';
import { execFile } from 'child_process';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Executes Python CrewAI backend directly
function runCrewStockPython(ticker: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const venvPythonWin = path.join(process.cwd(), '.venv', 'Scripts', 'python.exe');
    const venvPythonPosix = path.join(process.cwd(), '.venv', 'bin', 'python');
    const pythonExe = fs.existsSync(venvPythonWin)
      ? venvPythonWin
      : fs.existsSync(venvPythonPosix)
      ? venvPythonPosix
      : 'python';

    const scriptPath = path.join(process.cwd(), 'crew_stock.py');

    execFile(
      pythonExe,
      [scriptPath, ticker, '--json'],
      { timeout: 20000, maxBuffer: 10 * 1024 * 1024 },
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
  if (process.env.NODE_ENV !== 'production') {
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
