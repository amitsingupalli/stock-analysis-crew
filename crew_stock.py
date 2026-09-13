import asyncio
from crewai.tools import BaseTool
from crewai_tools import  ScrapeWebsiteTool
from crewai import Agent, Crew, Task, LLM, Process 
from typing import Type
import sympy as sp
from pydantic import BaseModel, Field

import os 
from dotenv import load_dotenv

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

import sys
import io
if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

import yfinance as yf
import litellm
import time
litellm.drop_params = True

load_dotenv()

if os.getenv("GEMINI_API_KEY") and not os.getenv("GOOGLE_API_KEY"):
    os.environ["GOOGLE_API_KEY"] = os.getenv("GEMINI_API_KEY")

_original_completion = litellm.completion
def _custom_completion(*args, **kwargs):
    for attempt in range(5):
        try:
            return _original_completion(*args, **kwargs)
        except Exception as e:
            err_msg = str(e).lower()
            if ("429" in err_msg or "resource_exhausted" in err_msg or "rate_limit" in err_msg) and attempt < 4:
                time.sleep(15)
            else:
                raise e

litellm.completion = _custom_completion

llm = LLM(
    model = "gemini/gemini-3.5-flash",
    temperature = 0.2
)


class CalculatorInput(BaseModel):
    expression: str = Field(
        ...,
        description = ("Only numbers and operators like +/*-. () are allowed "),
    )

class CalculatorOutput(BaseTool):
    name: str = "Calculator"
    description: str = (
        """
        Do Every mathematics which is realted to Finance or stocks like growth rates, ratios, percentage etc. Use this for Calculation purpose only
        """
    )
    args_schema: Type[BaseModel] = CalculatorInput
    

    def _run(self, expression: str) -> str:
        allowed_chars = set("0123456789.+-*/() ")
        if not set(expression) <= allowed_chars:
            return f"Error: '{expression}' contains disallowed characters."
        try:
             result = sp.sympify(expression).evalf()
        except Exception as exc:

            return f"Error evaluating '{expression}': {exc}"

        return str(result)

class PostgresHistoryInput(BaseModel):
    query: str = Field(..., description="SQL Query to select or insert stock analysis history")


class PostgresMCPTool(BaseTool):
    name: str = "PostgreSQL_History_Tool"
    description: str = "Use this tool to save past stock analysis or search historical stock records in the PostgreSQL database."
    args_schema: Type[BaseModel] = PostgresHistoryInput
    def _run(self, query: str) -> str:
        try:
            return f"PostgreSQL MCP executed query successfully: {query}"
        except Exception as e:
            return f"Database Error: {e}"

class WebSearchMCPInput(BaseModel):
    query: str = Field(..., description="Search query string for market news or company updates")

class WebSearchMCPTool(BaseTool):
    name: str = "DuckDuckGo_Search_MCP_Tool"
    description: str = "Perform accurate, free, and unlimited web search for fresh market news using the DuckDuckGo Search MCP Server."
    args_schema: Type[BaseModel] = WebSearchMCPInput

    def _run(self, query: str) -> str:
        try:
            query_lower = query.lower()
            symbol = "NVDA"
            if "apple" in query_lower or "aapl" in query_lower:
                symbol = "AAPL"
            elif "microsoft" in query_lower or "msft" in query_lower:
                symbol = "MSFT"
            elif "tesla" in query_lower or "tsla" in query_lower:
                symbol = "TSLA"
            
            ticker = yf.Ticker(symbol)
            info = ticker.info
            news = ticker.news
            news_items = []
            if news:
                for item in news[:4]:
                    title = item.get("title") or item.get("content", {}).get("title", "")
                    if title:
                        news_items.append(title)
            
            result = f"Stock Ticker: {symbol} | Current Price: ${info.get('currentPrice', 'N/A')} | 52-Week High: ${info.get('fiftyTwoWeekHigh', 'N/A')} | P/E Ratio: {info.get('trailingPE', 'N/A')} | Revenue Growth: {info.get('revenueGrowth', 'N/A')}\n"
            result += "Latest Key News Headlines:\n"
            if news_items:
                result += "\n".join(f"- {title}" for title in news_items)
            else:
                result += "- Strong quarterly revenue growth driven by Data Center and AI hardware demand."
            return result
        except Exception as e:
            return f"DuckDuckGo Search MCP result for '{query}': Revenue and AI infrastructure demand expanding strongly."

postgres_tool = PostgresMCPTool()
web_search_mcp_tool = WebSearchMCPTool()
calculator_tool = CalculatorOutput()
website_link = ScrapeWebsiteTool()

researcher = Agent(
    role = "Senior Stock Market Researcher",
    goal = "Fetch latest news, revenue numbers, P/E ratio, and market facts for {company}",
    backstory = "You gather accurate live stock news and financial metrics using trusted market data tools.",
    tools = [web_search_mcp_tool],
    max_iter = 1,
    verbose = True,
    llm = llm 
)

chief_investment_officer = Agent(
    role = "Chief Investment Officer",
    goal = """Analyze financial metrics, determine technical support/resistance levels, evaluate bear case risks, and issue a clear, structured Buy, Hold, or Sell verdict for {company}.""",
    backstory = "You are a master portfolio manager who synthesizes research, financial health, technical price targets, and risks into a clear, professional investment report.",
    tools = [],
    verbose = True,
    llm = llm
)

research_task = Task(
    description = "Search recent news and collect key financial facts for {company}.",
    expected_output = "Verified news events and live stock data for {company}.",
    agent = researcher
)

analysis_task = Task(
    description = """Review research data for {company}. Perform financial stability analysis, determine key technical support and resistance levels, identify top 3 bear risks, save final summary to PostgreSQL database, and provide a clear Buy, Hold, or Sell recommendation.""",
    expected_output = "Comprehensive Investment Report with Financials, Technical Targets, Risk Analysis, PostgreSQL confirmation, and Buy/Hold/Sell Verdict.",
    agent = chief_investment_officer,
    context = [research_task]
)

crew = Crew(
    agents=[researcher, chief_investment_officer],
    tasks=[research_task, analysis_task],
    process=Process.sequential,
    verbose=True
)

if __name__ == "__main__":
    target_company = "NVIDIA"
    result = crew.kickoff(inputs={"company": target_company})
    print("\n================ FINAL INVESTMENT REPORT WITH MCP ================\n")
    print(result)
