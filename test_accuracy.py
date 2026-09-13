import urllib.request
import json
import yfinance as yf
import math

test_stocks = [
    {"symbol": "AAPL", "market": "US"},
    {"symbol": "NVDA", "market": "US"},
    {"symbol": "RELIANCE", "actual_yf": "RELIANCE.NS", "market": "India"},
    {"symbol": "TCS", "actual_yf": "TCS.NS", "market": "India"}
]

print("=" * 80)
print("STARTING INDEPENDENT ACCURACY BENCHMARK: 2 US & 2 INDIAN EQUITIES")
print("=" * 80)

for item in test_stocks:
    sym = item["symbol"]
    actual_yf_sym = item.get("actual_yf", sym)
    market = item["market"]
    
    print(f"\n>>> TESTING: {sym} ({market} Market) -> API query")
    
    # 1. Fetch from running API
    req = urllib.request.Request(
        'http://localhost:3000/api/analyze',
        data=json.dumps({'ticker': sym}).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(req) as resp:
        api_data = json.loads(resp.read().decode('utf-8'))
        
    # 2. Fetch directly from yfinance ground truth
    yf_stock = yf.Ticker(actual_yf_sym)
    yf_info = yf_stock.info or {}
    
    # Compare Spot Price
    api_price = api_data.get("currentPrice")
    yf_price = round(float(yf_info.get("currentPrice") or yf_info.get("regularMarketPrice") or 0.0), 2)
    price_match = abs(api_price - yf_price) < 0.1
    print(f" [Spot Price] API: {api_price} | Ground Truth: {yf_price} -> {'MATCH OK' if price_match else 'DIFF'}")
    
    # Compare 52-Week High (R2)
    api_r2 = [l for l in api_data.get("priceLadder", []) if l.get("type") == "r2"][0]["price"]
    yf_high = round(float(yf_info.get("fiftyTwoWeekHigh") or api_r2), 2)
    high_match = abs(api_r2 - yf_high) < 0.1
    print(f" [52W High / R2] API: {api_r2} | Ground Truth: {yf_high} -> {'MATCH OK' if high_match else 'DIFF'}")

    # Compare 52-Week Low (S2)
    api_s2 = [l for l in api_data.get("priceLadder", []) if l.get("type") == "s2"][0]["price"]
    yf_low = round(float(yf_info.get("fiftyTwoWeekLow") or api_s2), 2)
    low_match = abs(api_s2 - yf_low) < 0.1
    print(f" [52W Low / S2]  API: {api_s2} | Ground Truth: {yf_low} -> {'MATCH OK' if low_match else 'DIFF'}")

    # Compare Consensus Target Price
    api_target = api_data.get("targetPrice")
    yf_target_raw = yf_info.get("targetMeanPrice") or yf_info.get("targetMedianPrice")
    yf_target = round(float(yf_target_raw), 2) if yf_target_raw else None
    print(f" [12M Target] API: {api_target} | Ground Truth: {yf_target}")

    # Compare P/E Ratio
    api_pe = [m for m in api_data.get("metrics", []) if m.get("id") == "pe_ratio"][0]["value"]
    yf_pe_raw = yf_info.get("forwardPE") or yf_info.get("trailingPE")
    yf_pe = f"{round(float(yf_pe_raw), 1)}x" if yf_pe_raw else "N/A"
    print(f" [P/E Ratio]  API: {api_pe} | Ground Truth: {yf_pe}")

    # Compare Revenue Growth
    api_rev = [m for m in api_data.get("metrics", []) if m.get("id") == "rev_growth"][0]["value"]
    yf_rev_raw = yf_info.get("revenueGrowth")
    yf_rev = f"{'+' if yf_rev_raw and float(yf_rev_raw)>0 else ''}{round(float(yf_rev_raw)*100, 1)}%" if yf_rev_raw else "N/A"
    print(f" [Rev Growth] API: {api_rev} | Ground Truth: {yf_rev}")

    # Compare Margins
    api_gross = [m for m in api_data.get("metrics", []) if m.get("id") == "gross_margin"][0]["value"]
    yf_gross_raw = yf_info.get("grossMargins")
    yf_gross = f"{round(float(yf_gross_raw)*100, 1)}%" if yf_gross_raw else "N/A"
    print(f" [Gross Margin] API: {api_gross} | Ground Truth: {yf_gross}")

    # Compare Candles
    candles = api_data.get("candles", [])
    print(f" [Candles Count] API: {len(candles)} historical candles")
    if candles:
        print(f"   First Candle: {candles[0]['time']} (O:{candles[0]['open']} C:{candles[0]['close']})")
        print(f"   Last Candle:  {candles[-1]['time']} (O:{candles[-1]['open']} C:{candles[-1]['close']})")

    # Real News Headlines
    catalysts = api_data.get("bullishCatalysts", [])
    print(f" [Catalysts / News] Count: {len(catalysts)}")
    for i, c in enumerate(catalysts[:2], 1):
        print(f"   {i}. {c}")

print("\n" + "=" * 80)
print("ACCURACY BENCHMARK COMPLETE")
print("=" * 80)
