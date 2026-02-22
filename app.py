import streamlit as st
import pandas as pd
import numpy as np
import time
from datetime import datetime
import yfinance as yf
import base64
import os

# --- 0. POMOCNÉ FUNKCE PRO OBRÁZKY 🖼️ ---
def get_img_as_base64(file_path):
    """Načte lokální obrázek a převede ho na base64 pro HTML zobrazení"""
    if not os.path.exists(file_path):
        return None
    with open(file_path, "rb") as f:
        data = f.read()
    return base64.b64encode(data).decode()

# --- 1. CONFIG & CHAMELEON SETUP 🦎 ---
PARTNERS = {
    "default": {
        "name": "VestPrimer",
        "color_primary": "#8b5cf6", 
        "color_bg": "#0e1117",
        "cta_text": "Otevřít účet u Brokera",
        "cta_link": "https://www.xtb.com/cz",
        "logo_file": None, 
        "logo_emoji": "🧮" # Změna: Kalkulačka místo Jednorožce
    },
    "xtb": {
        "name": "XTB Guide",
        "color_primary": "#29a643", 
        "color_bg": "#000000",
        "cta_text": "Pokračovat do xStation",
        "cta_link": "https://www.xtb.com/cz",
        "logo_file": "logos/xtb.png", 
        "logo_emoji": "💹"
    },
    "t212": {
        "name": "Trading 212 Learn",
        "color_primary": "#3399ff",
        "color_bg": "#1e3a8a",
        "cta_text": "Přejít do Trading 212",
        "cta_link": "https://www.trading212.com",
        "logo_file": "logos/t212.png",
        "logo_emoji": "🔵"
    },
    "etoro": {
        "name": "eToro Academy",
        "color_primary": "#66cc33", 
        "color_bg": "#14532d",
        "cta_text": "Investovat na eToro",
        "cta_link": "https://www.etoro.com",
        "logo_file": "logos/etoro.png",
        "logo_emoji": "🐂"
    }
}

query_params = st.query_params
active_partner_key = query_params.get("partner", "default")
if active_partner_key not in PARTNERS: active_partner_key = "default"
current_partner = PARTNERS[active_partner_key]

st.set_page_config(page_title=current_partner["name"], page_icon=current_partner["logo_emoji"], layout="wide")

st.markdown(f"""
    <style>
    .stApp {{ background: linear-gradient(to bottom right, {current_partner['color_bg']}, #111); color: #e0e0e0; }}
    .card-highlight {{ background-color: rgba(255, 255, 255, 0.05); padding: 15px; border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.1); margin-bottom: 10px; }}
    
    /* Anti-Panic Big Card */
    .panic-card {{
        padding: 20px; border-radius: 12px; text-align: center; margin-top: 10px; margin-bottom: 20px;
        border: 2px solid; box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    }}
    .panic-growth {{ background-color: rgba(5, 150, 105, 0.2); border-color: #059669; color: #34d399; }}
    .panic-discount {{ background-color: rgba(37, 99, 235, 0.2); border-color: #3b82f6; color: #60a5fa; }}
    
    div.stButton > button:first-child {{ background-color: {current_partner['color_primary']} !important; color: white !important; border: none !important; }}
    </style>
""", unsafe_allow_html=True)

if 'page' not in st.session_state: st.session_state.page = "intro" 
if 'moje_portfolio' not in st.session_state: st.session_state.moje_portfolio = []
if 'user_name' not in st.session_state: st.session_state.user_name = "Návštěvník"
if 'lead_captured' not in st.session_state: st.session_state.lead_captured = False

KURZ_USD_CZK = 23.50

# --- 2. DATA ENGINE (Yahoo + Simulace) ---

def apply_market_sentiment(price):
    factor = st.session_state.get('market_factor', 1.0) 
    return price * factor

# Simulace (Záloha)
def ziskej_data_simulace(ticker, styl):
    seed = sum(ord(c) for c in ticker)
    np.random.seed(seed)
    base_price = np.random.randint(50, 400)
    base_price = apply_market_sentiment(base_price)
    points = 30 
    trend = np.linspace(0, 50 if styl == "Růst" else 10, points)
    volatilita = np.random.normal(0, 5 if styl == "Růst" else 2, points)
    krivka = [float(x) for x in (base_price + trend + volatilita)]
    graf_data = pd.DataFrame(krivka, columns=['Close'])
    return round(krivka[-1], 2), "USD", graf_data

# Reálná Data
@st.cache_data(ttl=3600, show_spinner=False) 
def ziskej_data_yahoo(ticker):
    try:
        stock = yf.Ticker(ticker)
        hist = stock.history(period="1y")
        if hist.empty: return None
        cena = hist['Close'].iloc[-1]
        graf_data = hist[['Close']].reset_index(drop=True)
        return round(float(cena), 2), "USD", graf_data
    except Exception:
        return None

# Hlavní chytrá funkce
def ziskej_data_smart(ticker, styl):
    raw_data = ziskej_data_yahoo(ticker)
    if raw_data:
        cena_real, mena, graf = raw_data
        cena_simulated = apply_market_sentiment(cena_real)
        return cena_simulated, mena, graf
    else:
        return ziskej_data_simulace(ticker, styl)

def get_position_status_rich(current_price, avg_buy_price):
    diff = current_price - avg_buy_price
    percent_change = (diff / avg_buy_price) * 100
    val_diff_czk = int(diff * KURZ_USD_CZK)
    
    if percent_change >= 0:
        return {
            "class": "panic-growth",
            "icon": "📈",
            "title": "VŠECHNO ZELENÉ",
            "subtitle": f"Tvá investice vyrostla o {percent_change:.1f} %.",
            "desc": "Peníze pracují za tebe. Nedělej nic, jen se dívej."
        }
    else:
        return {
            "class": "panic-discount",
            "icon": "🏷️",
            "title": f"AKCE: SLEVA {abs(percent_change):.1f} %",
            "subtitle": f"Nyní levnější o {abs(val_diff_czk)} Kč/ks než při nákupu.",
            "desc": "Trh ti nabízí stejnou firmu za méně peněz. Je to jako Black Friday."
        }

# --- 3. ROZŠÍŘENÁ DATABÁZE ---
db_akcii = [
    # KONZUM
    {"ticker": "KO", "name": "Coca-Cola", "styl": "Dividenda", "riziko": "Nízké", "sektor": "Konzum", "duvod": "Když je krize, lidi pijí Colu.", "div_yield": 3.1, "div_months": ["Duben", "Červenec", "Říjen", "Prosinec"]},
    {"ticker": "PEP", "name": "PepsiCo", "styl": "Dividenda", "riziko": "Nízké", "sektor": "Konzum", "duvod": "Vlastní i chipsy Lays.", "div_yield": 3.0, "div_months": ["Leden", "Březen", "Červen", "Září"]},
    {"ticker": "COST", "name": "Costco", "styl": "Růst", "riziko": "Střední", "sektor": "Konzum", "duvod": "Velkoobchod, který lidé milují.", "div_yield": 0.6, "div_months": ["Únor", "Květen", "Srpen", "Listopad"]},
    # TECH
    {"ticker": "AAPL", "name": "Apple", "styl": "Růst", "riziko": "Střední", "sektor": "Tech", "duvod": "Ekosystém, ze kterého se neodchází.", "div_yield": 0.5, "div_months": ["Únor", "Květen", "Srpen", "Listopad"]},
    {"ticker": "MSFT", "name": "Microsoft", "styl": "Růst", "riziko": "Střední", "sektor": "Tech", "duvod": "Windows a Cloud drží svět.", "div_yield": 0.7, "div_months": ["Březen", "Červen", "Září", "Prosinec"]},
    {"ticker": "NVDA", "name": "Nvidia", "styl": "Růst", "riziko": "Vysoké", "sektor": "Tech", "duvod": "Mozky pro umělou inteligenci.", "div_yield": 0.0, "div_months": []},
    {"ticker": "GOOGL", "name": "Google", "styl": "Růst", "riziko": "Střední", "sektor": "Tech", "duvod": "Internet bez něj nefunguje.", "div_yield": 0.0, "div_months": []},
    {"ticker": "AMZN", "name": "Amazon", "styl": "Růst", "riziko": "Střední", "sektor": "Tech", "duvod": "Král e-shopů a serverů.", "div_yield": 0.0, "div_months": []},
    # ZDRAVÍ
    {"ticker": "JNJ", "name": "J&J", "styl": "Dividenda", "riziko": "Nízké", "sektor": "Zdraví", "duvod": "Od náplastí po léky.", "div_yield": 2.9, "div_months": ["Březen", "Červen", "Září", "Prosinec"]},
    {"ticker": "PFE", "name": "Pfizer", "styl": "Dividenda", "riziko": "Střední", "sektor": "Zdraví", "duvod": "Farmaceutický gigant.", "div_yield": 5.8, "div_months": ["Březen", "Červen", "Září", "Prosinec"]},
    {"ticker": "LLY", "name": "Eli Lilly", "styl": "Růst", "riziko": "Střední", "sektor": "Zdraví", "duvod": "Léky na hubnutí a cukrovku.", "div_yield": 0.7, "div_months": ["Březen", "Červen", "Září", "Prosinec"]},
    # ENERGIE & PRŮMYSL
    {"ticker": "XOM", "name": "Exxon", "styl": "Dividenda", "riziko": "Střední", "sektor": "Energie", "duvod": "Svět stále potřebuje ropu.", "div_yield": 3.4, "div_months": ["Březen", "Červen", "Září", "Prosinec"]},
    {"ticker": "CVX", "name": "Chevron", "styl": "Dividenda", "riziko": "Střední", "sektor": "Energie", "duvod": "Energetická stálice.", "div_yield": 4.0, "div_months": ["Březen", "Červen", "Září", "Prosinec"]},
    {"ticker": "CAT", "name": "Caterpillar", "styl": "Dividenda", "riziko": "Střední", "sektor": "Průmysl", "duvod": "Staví svět (bagry).", "div_yield": 1.6, "div_months": ["Únor", "Květen", "Srpen", "Listopad"]},
    # FINANCE
    {"ticker": "JPM", "name": "JP Morgan", "styl": "Dividenda", "riziko": "Střední", "sektor": "Finance", "duvod": "Největší banka v USA.", "div_yield": 2.3, "div_months": ["Leden", "Duben", "Červenec", "Říjen"]},
    {"ticker": "V", "name": "Visa", "styl": "Růst", "riziko": "Nízké", "sektor": "Finance", "duvod": "Každé pípnutí kartou jim vydělá.", "div_yield": 0.8, "div_months": ["Březen", "Červen", "Září", "Prosinec"]},
    # NEMOVITOSTI
    {"ticker": "O", "name": "Realty Income", "styl": "Dividenda", "riziko": "Střední", "sektor": "Nemovitosti", "duvod": "Měsíční dividenda z nájmů.", "div_yield": 5.2, "div_months": ["Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"]},
]

# --- 4. MODÁL NÁKUPU ---
@st.dialog("Nastavení investice")
def nakupni_okno(firma, cena_usd):
    st.subheader(f"Kupuješ: {firma['name']}")
    col_img, col_info = st.columns([1, 3])
    with col_img: st.image(f"https://financialmodelingprep.com/image-stock/{firma['ticker']}.png", width=50)
    with col_info: st.metric("Aktuální cena", f"{cena_usd:.2f} USD", f"{int(cena_usd * KURZ_USD_CZK)} Kč")
    
    st.markdown("---")
    typ_nakupu = st.radio("Jak chceš nakoupit?", ["Chci investovat částku (Kč)", "Chci konkrétní počet kusů (ks)"])
    if "částku" in typ_nakupu:
        investice_czk = st.number_input("Kolik chceš investovat (Kč)?", min_value=100, value=1000, step=100)
        investice_usd = investice_czk / KURZ_USD_CZK
        pocet_akcii = investice_usd / cena_usd
        st.info(f"💡 Za **{investice_czk} Kč** dostaneš **{pocet_akcii:.4f} ks** akcie.")
    else:
        pocet_akcii = st.number_input("Kolik akcií?", min_value=0.1, value=1.0, step=0.1)
        investice_czk = pocet_akcii * cena_usd * KURZ_USD_CZK
        st.info(f"💡 **{pocet_akcii} ks** tě bude stát cca **{int(investice_czk)} Kč**.")
    
    st.warning("ℹ️ **Spread (Poplatek):** Cca 0.5 %. To je normální, nelekni se malého mínusu po nákupu.")
    
    if st.button("✅ Potvrdit", type="primary"):
        st.session_state.moje_portfolio.append({
            "ticker": firma['ticker'], 
            "name": firma['name'], 
            "ks": pocet_akcii, 
            "investice_czk": investice_czk,
            "buy_price_usd": cena_usd, 
            "yield": firma.get('div_yield', 0),
            "months": firma.get('div_months', [])
        })
        st.toast(f"{firma['name']} přidána do portfolia!", icon="🎒")
        time.sleep(1)
        st.rerun()

# --- 5. UI FLOW ---

with st.sidebar:
    st.header(f"⚙️ God Mode")
    market_sentiment = st.slider("Nálada trhu", 0.5, 1.5, 1.0, 0.1)
    st.session_state.market_factor = market_sentiment
    if market_sentiment < 1.0: st.info(f"📉 Simulace: Pokles o {int((1-market_sentiment)*100)} %")

if st.session_state.page == "intro":
    c1, c2 = st.columns([2, 1])
    with c1:
        # LOGIKA PRO LOGO Z DISKU (S BÍLÝM POZADÍM)
        logo_b64 = None
        if current_partner['logo_file']:
            logo_b64 = get_img_as_base64(current_partner['logo_file'])
            
        if logo_b64:
            # HTML trik: Bílý kontejner pro logo, aby bylo vidět i černé na tmavém
            # Změna: width z 200 na 100
            st.markdown(
                f'<div style="background-color: white; padding: 15px; border-radius: 10px; display: inline-block; margin-bottom: 20px;">'
                f'<img src="data:image/png;base64,{logo_b64}" width="100">' 
                f'</div>', 
                unsafe_allow_html=True
            )
        else:
            # Defaultní text (Kalkulačka)
            st.title(f"{current_partner['logo_emoji']} {current_partner['name']}")
            
        st.markdown("### Investování konečně lidsky.")
        st.write("Zapomeň na složité grafy. Vyber si strategii podle toho, co ti dává smysl v běžném životě.")
        
        c_btn1, c_btn2 = st.columns(2)
        with c_btn1:
            if st.button("🚀 Sestavit můj plán", type="primary", use_container_width=True):
                st.session_state.page = "wizard_1"
                st.rerun()
        with c_btn2:
             if st.button("🎓 Rychlokurz (3 min)", type="secondary", use_container_width=True):
                st.session_state.page = "education"
                st.rerun()
            
        st.caption("ℹ️ Zabere to cca 2 minuty. Na konci dostaneš seznam firem na míru.")
        
    with c2:
        st.image("https://cdn-icons-png.flaticon.com/512/3135/3135715.png", width=200)

elif st.session_state.page == "education":
    st.title("🎓 Rychlokurz investora")
    st.write("Pár minut čtení, které ti změní pohled na peníze.")
    
    tab1, tab2, tab3, tab4 = st.tabs(["Kráva vs. Tele", "Teorie Benzínu", "Pizza Teorie", "Sněhová koule"])
    
    with tab1:
        st.subheader("Dividenda vs. Růst")
        st.info("🥛 **Sběrači (Dividenda):** Chtějí 'krávu na mléko'. Firma jim posílá část zisku na účet.")
        st.warning("🐂 **Lovci (Růst):** Chtějí 'tele, co vyroste'. Firma zisk neposílá, ale investuje do sebe.")
    
    with tab2:
        st.subheader("Proč trhy kolísají? (Teorie Benzínu ⛽)")
        st.write("Když přijedeš na pumpu a benzín stojí 25 Kč místo 40 Kč, co uděláš?")
        st.success("Většina lidí by natankovala plnou. S akciemi je to **podobné**. Pokud firma hospodaří zdravě, červená čísla znamenají slevu.")
    
    with tab3:
        st.subheader("Teorie Pizzy 🍕")
        st.write("Dvě firmy můžou být stejně hodnotné (stejně velká pizza), ale jedna bude mít 'levnější' akcii jen proto, že pizzu rozkrájela na více dílků.")
        st.info("💡 **Poučení:** Nekoukej na cenu akcie, koukej na hodnotu firmy.")
        
    with tab4:
        st.subheader("Sněhová koule (Složené úročení) ❄️")
        st.write("Albert Einstein to prý nazval osmým divem světa.")
        st.write("Když zisky nevybereš, ale necháš je vydělávat další zisky, tvoje peníze se začnou nabalovat jako koule ze svahu.")
        st.markdown("**100 Kč** ➡️ (+10%) ➡️ **110 Kč** ➡️ (+10%) ➡️ **121 Kč**... a za pár let je to lavina.")

    if st.button("⬅️ Jdeme na to", type="secondary"):
        st.session_state.page = "intro"
        st.rerun()

elif st.session_state.page == "wizard_1":
    st.progress(25)
    st.subheader("1. Co od peněz očekáváš?")
    volba = st.radio("Vyber jednu možnost:", ["🅰️ Pravidelná výplata (Dividenda)", "🅱️ Budování velkého majetku (Růst)"])
    
    if "Dividenda" in volba:
        st.success("👉 **Co se stane:** Ukážu ti stabilní firmy (jako Cola), které ti budou posílat 'nájem' (dividendy) přímo na účet.")
    else:
        st.info("👉 **Co se stane:** Ukážu ti dravé firmy (jako Tesla), které zisk investují zpět do rozvoje.")

    with st.expander("🍕 Co když je akcie drahá? (Teorie Pizzy)"):
        st.write("Neboj se ceny. Akcie za 50 Kč není 'levnější' než ta za 2000 Kč. Záleží na tom, jak velký kus firmy (pizzy) kupuješ.")

    if st.button("Dále ➡️", type="primary"):
        st.session_state.temp_cil = "Dividenda" if "Dividenda" in volba else "Růst"
        st.session_state.page = "wizard_2"
        st.rerun()

elif st.session_state.page == "wizard_2":
    st.progress(50)
    st.subheader("2. Jak zvládáš stres?")
    st.write("Investoval jsi 10 000 Kč. Ráno se vzbudíš a máš tam jen 8 000 Kč. Co uděláš?")
    
    reakce = st.radio("Upřímně:", ["😱 Zpanikařím a všechno prodám.", "😐 Nic. Vím, že to zase vyroste.", "🤩 Mám radost! Nakoupím víc ve slevě."])
    
    if "Zpanikařím" in reakce:
        st.warning("👉 **Filtr:** Vybereme ti jen ty nejbezpečnější giganty (Betonové základy), abys mohl klidně spát.")
    elif "Nic" in reakce:
        st.info("👉 **Filtr:** Namícháme to vyváženě.")
    else:
        st.success("👉 **Filtr:** Ukážeme ti i divočejší firmy, kde je šance na velký zisk.")

    with st.expander("⛽ Proč červená čísla nevadí? (Teorie Benzínu)"):
        st.write("Když zlevní benzín, taky nepanikaříš, ale natankuješ plnou. U akcií je pokles ceny vlastně **výprodej**.")

    if st.button("Dále ➡️", type="primary"):
        if "Prodám" in reakce: st.session_state.temp_riziko = "Nízké"
        elif "Nic" in reakce: st.session_state.temp_riziko = "Střední"
        else: st.session_state.temp_riziko = "Vysoké"
        st.session_state.page = "wizard_3"
        st.rerun()

elif st.session_state.page == "wizard_3":
    st.progress(75)
    st.subheader("3. Čemu rozumíš?")
    st.write("Warren Buffett říká: *Investuj jen do toho, co znáš.*")
    
    sektory_human = {
        "Konzum": "🛒 Jídlo a nákupy (Cola, Costco)", 
        "Tech": "📱 Technologie (Apple, Google)", 
        "Zdraví": "💊 Zdraví a léky (Pfizer)", 
        "Energie": "⚡ Energie a Ropa (Shell)", 
        "Finance": "💳 Banky a Peníze (Visa)",
        "Průmysl": "🏗️ Stroje a stavby (Caterpillar)"
    }
    vyber = st.multiselect("Vyber oblasti, které ti jsou blízké:", list(sektory_human.keys()), format_func=lambda x: sektory_human[x])
    
    if st.button("🎉 Ukázat moje portfolio", type="primary"):
        st.session_state.temp_sektory = vyber
        st.session_state.page = "results"
        st.rerun()

elif st.session_state.page == "results":
    st.progress(100)
    cil = st.session_state.temp_cil
    riziko = st.session_state.temp_riziko
    sektory = st.session_state.temp_sektory
    
    nalezeno = [x for x in db_akcii if x['styl'] == cil]
    temp = [x for x in nalezeno if x['riziko'] == riziko]
    if len(temp) >= 2: nalezeno = temp
    if sektory:
        temp = [x for x in nalezeno if x['sektor'] in sektory]
        if temp: nalezeno = temp
        else: st.warning(f"V sektorech {', '.join(sektory)} jsme nenašli shodu. Zde jsou alternativy.")

    st.subheader(f"Tvůj plán na míru ({len(nalezeno)} firem)")
    
    for firma in nalezeno:
        cena_usd, mena, graf_data = ziskej_data_smart(firma['ticker'], firma['styl'])
        
        with st.container():
            st.markdown(f'<div class="card-highlight">', unsafe_allow_html=True)
            c1, c2, c3 = st.columns([1, 3, 2])
            with c1: st.image(f"https://financialmodelingprep.com/image-stock/{firma['ticker']}.png", width=60)
            with c2:
                st.markdown(f"### {firma['name']}")
                st.caption(f"{firma['sektor']} • {firma['duvod']}")
            with c3:
                if st.button(f"🛒 Koupit", key=f"btn_{firma['ticker']}", type="secondary", use_container_width=True):
                    nakupni_okno(firma, cena_usd)
            
            st.area_chart(graf_data, height=80, color=current_partner['color_primary'])
            st.markdown('</div>', unsafe_allow_html=True)

    if st.session_state.moje_portfolio:
        st.success(f"Máš vybráno {len(st.session_state.moje_portfolio)} firem.")
        
        # Lead Capture (PDF Unlock)
        if not st.session_state.lead_captured:
            st.markdown("### 🔒 Odemknout analýzu a uložit")
            col_mail, col_btn = st.columns([3, 1])
            with col_mail: email = st.text_input("Tvůj email (pošleme ti tam PDF):", placeholder="petr@email.cz")
            with col_btn: 
                st.write("")
                st.write("")
                if st.button("Odemknout", type="primary"):
                    if "@" in email:
                        st.session_state.lead_captured = True
                        st.session_state.user_name = email.split("@")[0]
                        st.session_state.page = "dashboard"
                        st.rerun()
        else:
             if st.button("🚀 Přejít na Dashboard", type="primary", use_container_width=True):
                 st.session_state.page = "dashboard"
                 st.rerun()

elif st.session_state.page == "dashboard":
    st.balloons()
    st.title(f"Portfolio: {st.session_state.user_name}")
    
    portfolio_display = []
    total_val = 0
    total_invested = 0
    rocni_divi = 0
    
    # DATA PRO KALENDÁŘ
    kalendar_prijmu = {"Leden": 0, "Únor": 0, "Březen": 0, "Duben": 0, "Květen": 0, "Červen": 0, "Červenec": 0, "Srpen": 0, "Září": 0, "Říjen": 0, "Listopad": 0, "Prosinec": 0}
    
    for p in st.session_state.moje_portfolio:
        curr, _, _ = ziskej_data_smart(p['ticker'], "Neznámý")
        val = p['ks'] * curr * KURZ_USD_CZK
        total_val += val
        total_invested += p['investice_czk']
        
        # Výpočet dividend
        if p.get('yield'):
             annual_income = p['investice_czk'] * (p['yield']/100)
             rocni_divi += annual_income
             # Rozpočítání do měsíců
             if p.get('months'):
                 castka_per_mesic = annual_income / len(p['months'])
                 for m in p['months']:
                     if m in kalendar_prijmu:
                         kalendar_prijmu[m] += castka_per_mesic

        status = get_position_status_rich(curr, p['buy_price_usd'])
        portfolio_display.append({"name": p['name'], "ticker": p['ticker'], "status": status, "val": val})

    # KPI
    k1, k2, k3 = st.columns(3)
    k1.metric("Investováno", f"{int(total_invested)} Kč")
    diff = total_val - total_invested
    k2.metric("Hodnota", f"{int(total_val)} Kč", delta=f"{int(diff)} Kč", delta_color="normal" if diff>=0 else "off")
    k3.metric("Pasivní příjem (ročně)", f"{int(rocni_divi):,} Kč", "Budoucí renta")

    # NOVÁ SEKCE: VÝPLATNÍ KALENDÁŘ
    if rocni_divi > 0:
        st.markdown("---")
        st.subheader("📅 Tvůj výplatní kalendář")
        st.caption("Kdy ti cinknou peníze na účtu? (Odhad na základě minulého roku)")
        
        # Vytvoření grafu
        df_cal = pd.DataFrame(list(kalendar_prijmu.items()), columns=["Měsíc", "Příjem (Kč)"])
        st.bar_chart(df_cal.set_index("Měsíc"), color=current_partner['color_primary'])
        
        # Malá gratulace, pokud je to hodně
        if rocni_divi > 1200:
             st.success(f"🎉 Super! To máš průměrně {int(rocni_divi/12)} Kč měsíčně navíc k výplatě.")

    st.markdown("---")
    st.subheader("📦 Tvoje Portfolio")
    
    for item in portfolio_display:
        s = item['status']
        c1, c2 = st.columns([2,1])
        c1.markdown(f"**{item['name']}** ({item['ticker']})")
        c2.markdown(f"*{int(item['val'])} Kč*")
        
        st.markdown(f"""
        <div class="panic-card {s['class']}">
            <div style="font-size: 24px;">{s['icon']} {s['title']}</div>
            <div style="font-weight: bold; font-size: 18px; margin: 5px 0;">{s['subtitle']}</div>
            <div style="opacity: 0.9;">{s['desc']}</div>
        </div>
        """, unsafe_allow_html=True)

    st.subheader("❄️ Efekt Sněhové koule (20 let)")
    roky = list(range(2025, 2045))
    hodnoty = [total_invested * (1.08 ** i) for i in range(len(roky))]
    st.area_chart(pd.DataFrame({"Rok": roky, "Hodnota": hodnoty}).set_index("Rok"), color=current_partner['color_primary'])

    st.link_button(current_partner['cta_text'], current_partner['cta_link'], type="primary", use_container_width=True)
    if st.button("🔄 Reset", type="secondary"):
        st.session_state.moje_portfolio = []
        st.session_state.page = "intro"
        st.rerun()