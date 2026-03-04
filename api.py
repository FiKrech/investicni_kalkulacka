from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import yfinance as yf

app = FastAPI(title="VestPrimer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

KURZ_USD_CZK = 23.50

db_akcii = [
    # KONZUM
    {"ticker": "KO", "name": "Coca-Cola", "styl": "Dividenda", "riziko": "Nízké", "sektor": "Konzum", "duvod_base": "Když je krize, lidi pijí Colu.", "div_yield": 3.1, "div_months": ["Duben", "Červenec", "Říjen", "Prosinec"], "rule_40": False, "ps_ratio": 6.5},
    {"ticker": "PEP", "name": "PepsiCo", "styl": "Dividenda", "riziko": "Nízké", "sektor": "Konzum", "duvod_base": "Vlastní i chipsy Lays.", "div_yield": 3.0, "div_months": ["Leden", "Březen", "Červen", "Září"], "rule_40": False, "ps_ratio": 2.8},
    {"ticker": "COST", "name": "Costco", "styl": "Růst", "riziko": "Střední", "sektor": "Konzum", "duvod_base": "Velkoobchod, který lidé milují.", "div_yield": 0.6, "div_months": ["Únor", "Květen", "Srpen", "Listopad"], "rule_40": False, "ps_ratio": 1.2},
    # TECH
    {"ticker": "AAPL", "name": "Apple", "styl": "Růst", "riziko": "Střední", "sektor": "Tech", "duvod_base": "Ekosystém, ze kterého se neodchází.", "div_yield": 0.5, "div_months": ["Únor", "Květen", "Srpen", "Listopad"], "rule_40": True, "ps_ratio": 7.5},
    {"ticker": "MSFT", "name": "Microsoft", "styl": "Růst", "riziko": "Střední", "sektor": "Tech", "duvod_base": "Windows a Cloud drží svět.", "div_yield": 0.7, "div_months": ["Březen", "Červen", "Září", "Prosinec"], "rule_40": True, "ps_ratio": 12.0},
    {"ticker": "NVDA", "name": "Nvidia", "styl": "Růst", "riziko": "Vysoké", "sektor": "Tech", "duvod_base": "Mozky pro umělou inteligenci.", "div_yield": 0.0, "div_months": [], "rule_40": True, "ps_ratio": 35.0},
    {"ticker": "GOOGL", "name": "Google", "styl": "Růst", "riziko": "Střední", "sektor": "Tech", "duvod_base": "Internet bez něj nefunguje.", "div_yield": 0.0, "div_months": [], "rule_40": True, "ps_ratio": 6.0},
    {"ticker": "AMZN", "name": "Amazon", "styl": "Růst", "riziko": "Střední", "sektor": "Tech", "duvod_base": "Král e-shopů a serverů.", "div_yield": 0.0, "div_months": [], "rule_40": False, "ps_ratio": 3.0},
    # ZDRAVÍ
    {"ticker": "JNJ", "name": "J&J", "styl": "Dividenda", "riziko": "Nízké", "sektor": "Zdraví", "duvod_base": "Od náplastí po léky.", "div_yield": 2.9, "div_months": ["Březen", "Červen", "Září", "Prosinec"], "rule_40": False, "ps_ratio": 4.1},
    {"ticker": "PFE", "name": "Pfizer", "styl": "Dividenda", "riziko": "Střední", "sektor": "Zdraví", "duvod_base": "Farmaceutický gigant.", "div_yield": 5.8, "div_months": ["Březen", "Červen", "Září", "Prosinec"], "rule_40": False, "ps_ratio": 3.0},
    {"ticker": "LLY", "name": "Eli Lilly", "styl": "Růst", "riziko": "Střední", "sektor": "Zdraví", "duvod_base": "Léky na hubnutí a cukrovku.", "div_yield": 0.7, "div_months": ["Březen", "Červen", "Září", "Prosinec"], "rule_40": True, "ps_ratio": 20.0},
    # ENERGIE & PRŮMYSL
    {"ticker": "XOM", "name": "Exxon", "styl": "Dividenda", "riziko": "Střední", "sektor": "Energie", "duvod_base": "Svět stále potřebuje ropu.", "div_yield": 3.4, "div_months": ["Březen", "Červen", "Září", "Prosinec"], "rule_40": False, "ps_ratio": 1.2},
    {"ticker": "CVX", "name": "Chevron", "styl": "Dividenda", "riziko": "Střední", "sektor": "Energie", "duvod_base": "Energetická stálice.", "div_yield": 4.0, "div_months": ["Březen", "Červen", "Září", "Prosinec"], "rule_40": False, "ps_ratio": 1.4},
    {"ticker": "CAT", "name": "Caterpillar", "styl": "Dividenda", "riziko": "Střední", "sektor": "Průmysl", "duvod_base": "Staví svět (bagry).", "div_yield": 1.6, "div_months": ["Únor", "Květen", "Srpen", "Listopad"], "rule_40": False, "ps_ratio": 2.5},
    # FINANCE
    {"ticker": "JPM", "name": "JP Morgan", "styl": "Dividenda", "riziko": "Střední", "sektor": "Finance", "duvod_base": "Největší banka v USA.", "div_yield": 2.3, "div_months": ["Leden", "Duben", "Červenec", "Říjen"], "rule_40": False, "ps_ratio": 3.5},
    {"ticker": "V", "name": "Visa", "styl": "Růst", "riziko": "Nízké", "sektor": "Finance", "duvod_base": "Každé pípnutí kartou jim vydělá.", "div_yield": 0.8, "div_months": ["Březen", "Červen", "Září", "Prosinec"], "rule_40": True, "ps_ratio": 15.0},
    # NEMOVITOSTI
    {"ticker": "O", "name": "Realty Income", "styl": "Dividenda", "riziko": "Střední", "sektor": "Nemovitosti", "duvod_base": "Měsíční dividenda z nájmů.", "div_yield": 5.2, "div_months": ["Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"], "rule_40": False, "ps_ratio": 5.0}
]

def ziskej_data_yahoo(ticker):
    try:
        stock = yf.Ticker(ticker)
        hist = stock.history(period="1y")
        if hist.empty: return None
        return round(float(hist['Close'].iloc[-1]), 2)
    except Exception:
        return None

def get_position_status_rich(current_price, avg_buy_price):
    diff = current_price - avg_buy_price
    percent_change = (diff / avg_buy_price) * 100
    val_diff_czk = int(diff * KURZ_USD_CZK)
    if abs(percent_change) < 1.0:
        return {"style": "neutral", "icon": "⏳", "title": "PRÁVĚ NAKOUPENO", "subtitle": "Investice je čerstvá, dej jí čas.", "desc": "Trh se hýbe každý den. Klid, tvé peníze pracují."}
    elif percent_change >= 0:
        return {"style": "green", "icon": "📈", "title": "VŠECHNO ZELENÉ", "subtitle": f"Tvá investice vyrostla o {percent_change:.1f} %.", "desc": "Peníze pracují za tebe. Nedělej nic, jen se dívej."}
    else:
        return {"style": "blue", "icon": "🏷️", "title": f"AKCE: SLEVA {abs(percent_change):.1f} %", "subtitle": f"Nyní levnější o {abs(val_diff_czk)} Kč/ks.", "desc": "Trh ti nabízí stejnou firmu za méně peněz. Je to jako Black Friday."}

class UserPrefs(BaseModel):
    goal: str
    risk: str
    sectors: List[str]

class PortfolioItem(BaseModel):
    ticker: str
    ks: float
    buy_price_usd: float

@app.post("/api/recommend")
def get_recommendations(prefs: UserPrefs):
    # 1. Mapování cíle (Neprůstřelné)
    goal_str = prefs.goal.lower()
    cil = "Dividenda" if "dividend" in goal_str or "výplat" in goal_str else "Růst"
    
    # 2. Mapování rizika (Neprůstřelné)
    risk_str = prefs.risk.lower()
    if "zpanikařím" in risk_str or "panic" in risk_str or "prodám" in risk_str or "low" in risk_str:
        riziko = "Nízké"
    elif "nic" in risk_str or "vyroste" in risk_str or "hold" in risk_str or "medium" in risk_str:
        riziko = "Střední"
    else:
        riziko = "Vysoké"
        
    # 3. Mapování sektorů (Chytá češtinu, angličtinu i konkrétní názvy z tlačítek)
    mapped_sectors = []
    for s in prefs.sectors:
        s_low = s.lower()
        if "jídlo" in s_low or "food" in s_low or "cola" in s_low or "konzum" in s_low: mapped_sectors.append("Konzum")
        if "tech" in s_low or "apple" in s_low: mapped_sectors.append("Tech")
        if "zdraví" in s_low or "lék" in s_low or "pfizer" in s_low or "health" in s_low: mapped_sectors.append("Zdraví")
        if "energie" in s_low or "ropa" in s_low or "shell" in s_low or "energy" in s_low: mapped_sectors.append("Energie")
        if "bank" in s_low or "peníz" in s_low or "visa" in s_low or "finance" in s_low: mapped_sectors.append("Finance")
        if "stroj" in s_low or "stavb" in s_low or "caterpillar" in s_low or "industry" in s_low: mapped_sectors.append("Průmysl")

    # 4. FILTROVÁNÍ PŘESNĚ PODLE STREAMLITU
    vysledky_hledani = []
    for x in db_akcii:
        # Filtr Stylu
        if x['styl'] != cil:
            continue
            
        # Filtr Rizika (Kaskáda)
        risk_match = False
        if riziko == "Nízké" and x['riziko'] == "Nízké":
            risk_match = True
        elif riziko == "Střední" and x['riziko'] in ["Nízké", "Střední"]:
            risk_match = True
        elif riziko == "Vysoké":
            risk_match = True # Snesu vysoké riziko = snesu všechno
            
        if not risk_match:
            continue
            
        # Filtr Sektorů
        if mapped_sectors and x['sektor'] not in mapped_sectors:
            continue
            
        vysledky_hledani.append(x)
        
    # 5. FALLBACK (Kdyby byl filtr moc přísný, ukážeme alespoň něco ze zvoleného cíle)
    if not vysledky_hledani:
        vysledky_hledani = [x for x in db_akcii if x['styl'] == cil]
    
    # 6. PŘÍPRAVA VÝSTUPU
    vysledky = []
    for f in vysledky_hledani:
        cena = ziskej_data_yahoo(f['ticker']) or 100.0
        
        if cil == "Růst":
            duvod_text = f"{f['duvod_base']} 📈 Splňuje Pravidlo 40: {'Ano' if f.get('rule_40') else 'Těsně'}. P/S poměr: {f.get('ps_ratio')}."
        else:
            frekvence = "Měsíčně" if "Leden" in f.get('div_months', []) else "Čtvrtletně"
            duvod_text = f"{f['duvod_base']} 💰 Vyplácí dividendu: {frekvence}. Stabilní historie."
            
        vysledky.append({**f, "duvod": duvod_text, "aktualni_cena_usd": cena})
        
    return vysledky

@app.post("/api/portfolio")
def calculate_portfolio(items: List[PortfolioItem]):
    total_val = 0
    total_invested = 0
    rocni_divi = 0
    nejvetsi_sleva = 0
    akce_ticker = ""
    pozice_list = []
    
    kalendar_prijmu = {"Leden": 0, "Únor": 0, "Březen": 0, "Duben": 0, "Květen": 0, "Červen": 0, "Červenec": 0, "Srpen": 0, "Září": 0, "Říjen": 0, "Listopad": 0, "Prosinec": 0}

    for p in items:
        firma = next((x for x in db_akcii if x["ticker"] == p.ticker), None)
        if not firma: continue
        
        curr_price = ziskej_data_yahoo(p.ticker) or p.buy_price_usd
        val = p.ks * curr_price * KURZ_USD_CZK
        investice = p.ks * p.buy_price_usd * KURZ_USD_CZK

        total_val += val
        total_invested += investice
        
        annual_income = investice * (firma['div_yield'] / 100)
        rocni_divi += annual_income
        if firma['div_months']:
            castka_per_mesic = annual_income / len(firma['div_months'])
            for m in firma['div_months']:
                if m in kalendar_prijmu:
                    kalendar_prijmu[m] += castka_per_mesic

        diff_percent = ((curr_price - p.buy_price_usd) / p.buy_price_usd) * 100
        if diff_percent < -1.0 and diff_percent < nejvetsi_sleva:
            nejvetsi_sleva = diff_percent
            akce_ticker = firma['name']

        pozice_list.append({
            "ticker": p.ticker,
            "name": firma['name'],
            "hodnota_czk": int(val),
            "status": get_position_status_rich(curr_price, p.buy_price_usd)
        })

    zisk_procenta = ((total_val - total_invested) / total_invested) * 100 if total_invested > 0 else 0
    snehova_koule = [{"rok": str(rok), "hodnota": int(total_invested * (1.08 ** (rok - 2025)))} for rok in range(2025, 2045)]
    kalendar_graf = [{"mesic": k, "castka": int(v)} for k, v in kalendar_prijmu.items() if v > 0] or []

    return {
        "hodnota": int(total_val),
        "pasivni_prijem": int(rocni_divi),
        "investovano": int(total_invested),
        "zisk_procenta": round(zisk_procenta, 1),
        "akce_aktivni": nejvetsi_sleva < 0,
        "akce_sleva_procenta": round(abs(nejvetsi_sleva), 1),
        "akce_ticker": akce_ticker if akce_ticker else "Žádná",
        "pozice": pozice_list,
        "kalendar": kalendar_graf,
        "snehova_koule": snehova_koule
    }