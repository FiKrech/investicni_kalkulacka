"use client"

import { useState, useCallback, useEffect } from "react"
import { AkademieHeader } from "@/components/akademie-header"
import { LessonCard } from "@/components/lesson-card"
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard"
import { DisclaimerBanner } from "@/components/disclaimer-banner"
import { PARTNERS, getPartner } from "@/lib/partners"
import { fetchRecommendations, fetchPortfolio } from "@/lib/api"

const TOTAL_SEGMENTS = 4

export default function VestPrimerApp() {
  const [activeTab, setActiveTab] = useState("portfolio")
  const [appState, setAppState] = useState<"onboarding" | "results" | "dashboard">("onboarding")

  // Zjištění partnera z URL (Chameleon mód)
  const [partnerId, setPartnerId] = useState("default")
  
  useEffect(() => {
    // Tohle se spustí jen v prohlížeči, přečte URL a najde ?partner=... a ?tab=...
    const params = new URLSearchParams(window.location.search)
    const p = params.get("partner")
    if (p && p in PARTNERS) {
      setPartnerId(p)
    }
    const tab = params.get("tab")
    if (tab === "akademie") {
      setActiveTab("akademie")
    }
  }, [])

  const partner = getPartner(partnerId)

  // Paměť pro nákupy
  const [recommendedStocks, setRecommendedStocks] = useState<any[]>([])
  const [myPortfolio, setMyPortfolio] = useState<any[]>([])
  const [portfolioData, setPortfolioData] = useState<any>(null)

  // Modální okno
  const [buyModalStock, setBuyModalStock] = useState<any>(null)
  const [buyAmount, setBuyAmount] = useState<number>(1)
  const [showBuySuccess, setShowBuySuccess] = useState(false)
  const [isDashboardLoading, setIsDashboardLoading] = useState(false)
  const [dashboardError, setDashboardError] = useState<string | null>(null)

  // Akademie
  const [progress, setProgress] = useState(0)

  // God Mode je dostupný jen ve vývojovém prostředí
  const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE === "true"
  const [isGodMode, setIsGodMode] = useState(false)

  const handleAdvance = useCallback(() => {
    setProgress((prev) => Math.min(prev + 1, TOTAL_SEGMENTS))
  }, [])

  // --- KOMUNIKACE S MOZKEM (PYTHON) ---
  const handleWizardComplete = async (data: any) => {
    try {
      const recs = await fetchRecommendations(data)
      setRecommendedStocks(recs)
      setAppState("results")
    } catch (err) {
      console.error("❌ Chyba spojení s Mozkem:", err)
    }
  }

  const confirmBuy = () => {
    if (!buyModalStock) return
    const newItem = {
      ticker: buyModalStock.ticker,
      ks: buyAmount,
      buy_price_usd: buyModalStock.aktualni_cena_usd
    }
    setMyPortfolio([...myPortfolio, newItem])
    setShowBuySuccess(true)
  }

  const goToDashboard = async () => {
    setIsDashboardLoading(true)
    setDashboardError(null)
    try {
      // God Mode: simulace propadu — pouze v dev prostředí
      const simulateCrash = isDevMode && isGodMode
      const payload = myPortfolio.map(p => ({
        ...p,
        buy_price_usd: simulateCrash ? p.buy_price_usd * 1.25 : p.buy_price_usd
      }))

      const data = await fetchPortfolio(payload)
      setPortfolioData(data)
      setAppState("dashboard")
    } catch (err) {
      console.error("❌ Chyba při kalkulaci portfolia:", err)
      setDashboardError("Nepodařilo se načíst data. Zkus to znovu.")
    } finally {
      setIsDashboardLoading(false)
    }
  }

  const maxKalendar = portfolioData?.kalendar?.reduce((max: number, item: any) => Math.max(max, item.castka), 0) || 1

  return (
    <div 
      className="relative mx-auto flex min-h-dvh max-w-md flex-col text-white overflow-hidden transition-colors duration-700"
      style={{ backgroundColor: partner.bgColor }}
    >
      {/* Ambientní podsvícení na pozadí podle partnera */}
      <div className={`pointer-events-none absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px] transition-colors duration-700 ${partner.glowClass}`} />

      <main className="flex-1 overflow-y-auto pb-28 z-10 px-5 pt-8">
        
        {activeTab === "portfolio" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* KROK 1: DOTAZNÍK */}
            {appState === "onboarding" && (
              <>
                <OnboardingWizard onComplete={handleWizardComplete} />
                <DisclaimerBanner variant="onboarding" />
              </>
            )}

            {/* KROK 2: VÝBĚR AKCIÍ */}
            {appState === "results" && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold mb-2">Tvůj plán na míru</h1>
                <p className="text-white/60 mb-6">Vybrali jsme pro tebe {recommendedStocks.length} firem. Sestav si portfolio.</p>

                {recommendedStocks.map((stock, i) => (
                  <div key={i} className="bg-[#111] border border-white/5 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-3">
                        <img src={`https://financialmodelingprep.com/image-stock/${stock.ticker}.png`} alt={stock.ticker} className="w-12 h-12 rounded-full bg-white p-1 shadow-md" />
                        <div>
                          <p className="font-bold text-xl leading-tight">{stock.name}</p>
                          <p className="text-xs text-white/50 font-medium tracking-wider uppercase mt-1">{stock.sektor}</p>
                        </div>
                      </div>
                      <p className={`font-bold text-xl ${partner.textClass}`}>{stock.aktualni_cena_usd} $</p>
                    </div>
                    
                    <p className="text-sm text-white/80 mb-5 bg-black/30 p-3 rounded-xl border border-white/5 flex gap-2">
                      <span className="opacity-70">💡</span> {stock.duvod}
                    </p>
                    
                    {myPortfolio.some(p => p.ticker === stock.ticker) ? (
                      <div className="w-full py-3 rounded-xl bg-green-500/10 text-green-400 text-center font-bold text-sm border border-green-500/20 flex items-center justify-center gap-2">
                        <span>🎒</span> Přidáno ({myPortfolio.find(p => p.ticker === stock.ticker)?.ks} ks)
                      </div>
                    ) : (
                      <button 
                        onClick={() => setBuyModalStock(stock)}
                        className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-all border border-white/10"
                      >
                        🛒 Nakoupit akcii
                      </button>
                    )}
                  </div>
                ))}

                <div className="pt-8 pb-4">
                  <button
                    onClick={() => goToDashboard()}
                    disabled={myPortfolio.length === 0 || isDashboardLoading}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${myPortfolio.length > 0 && !isDashboardLoading ? partner.btnClass + ' text-white shadow-xl' : 'bg-white/5 text-white/30 cursor-not-allowed'}`}
                  >
                    {isDashboardLoading ? "⏳ Načítám data..." : "🚀 Přejít na Dashboard"}
                  </button>
                  {myPortfolio.length === 0 && <p className="text-center text-xs text-white/40 mt-3">Pro pokračování hoď do batohu alespoň jednu firmu.</p>}
                  {dashboardError && <p className="text-center text-xs text-red-400 mt-3">{dashboardError}</p>}
                </div>
              </div>
            )}

            {/* KROK 3: FINÁLNÍ DASHBOARD */}
            {appState === "dashboard" && portfolioData && (
              <>
                {/* ULTIMÁTNÍ HLAVIČKA */}
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <span className={`font-black text-xl tracking-tighter ${partner.textClass}`}>{partner.name}</span>
                    <span className="text-white/20">|</span>
                    <span className="text-white/60 font-medium text-sm">VestPrimer</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#222] flex items-center justify-center font-bold text-sm relative border border-white/10 shadow-lg">
                    JP
                    <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
                  </div>
                </div>

                <div className="mb-6 relative">
                  <p className="text-white/70 font-medium mb-1">Dobrý den, Jan</p>
                  <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-1">HODNOTA PORTFOLIA</p>
                  <h1 className="text-5xl font-black tracking-tighter mb-4">{portfolioData.hodnota.toLocaleString("cs-CZ")} Kč</h1>
                  
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm border ${portfolioData.pasivni_prijem > 0 ? 'bg-[#022c16] text-[#22c55e] border-[#166534]' : 'bg-white/5 text-white/50 border-white/10'}`}>
                    <span className="text-lg leading-none">↗</span> Pasivní příjem: {portfolioData.pasivni_prijem.toLocaleString("cs-CZ")} Kč / rok
                  </div>
                  
                  <div className="absolute top-10 right-0 left-0 h-24 opacity-20 pointer-events-none flex items-end gap-1 overflow-hidden z-[-1]">
                     {[...Array(20)].map((_, i) => (
                       <div key={i} className={`flex-1 rounded-t-sm ${partner.btnClass.split(' ')[0]}`} style={{ height: `${40 + Math.random() * 60}%` }}></div>
                     ))}
                  </div>
                </div>

                {/* 3 METRIKY (TMAVÉ KARTY) */}
                <div className="grid grid-cols-3 gap-3 mb-8">
                  <div className="bg-[#111] border border-white/5 rounded-2xl p-4 flex flex-col justify-center shadow-lg">
                    <div className="text-[#3b82f6] mb-2 bg-[#1e3a8a]/30 w-8 h-8 flex items-center justify-center rounded-full text-xs">💼</div>
                    <p className="text-[10px] text-white/40 uppercase font-bold mb-1">Investováno</p>
                    <p className="font-bold text-sm">{portfolioData.investovano.toLocaleString("cs-CZ")} Kč</p>
                  </div>
                  <div className="bg-[#111] border border-white/5 rounded-2xl p-4 flex flex-col justify-center shadow-lg">
                    <div className="text-[#22c55e] mb-2 bg-[#14532d]/30 w-8 h-8 flex items-center justify-center rounded-full text-xs">🎯</div>
                    <p className="text-[10px] text-white/40 uppercase font-bold mb-1">Zisk</p>
                    <p className={`font-bold text-sm ${portfolioData.zisk_procenta >= 0 ? 'text-white' : 'text-red-400'}`}>
                      {portfolioData.zisk_procenta > 0 ? '+' : ''}{portfolioData.zisk_procenta} %
                    </p>
                  </div>
                  <div className="bg-[#111] border border-white/5 rounded-2xl p-4 flex flex-col justify-center shadow-lg">
                    <div className="text-[#a855f7] mb-2 bg-[#581c87]/30 w-8 h-8 flex items-center justify-center rounded-full text-xs">🕒</div>
                    <p className="text-[10px] text-white/40 uppercase font-bold mb-1">Další divi</p>
                    {/* TODO: napojit na reálný ex-dividend date z API */}
                    <p className="font-bold text-sm">Brzy</p>
                  </div>
                </div>

                {/* TEORIE BENZÍNU (Příležitost) */}
                {portfolioData.akce_aktivni && (
                  <div className="bg-gradient-to-br from-[#1e1b4b] to-[#0f172a] border border-[#4338ca]/30 rounded-3xl p-6 mb-8 relative overflow-hidden shadow-2xl">
                    <div className="flex items-center gap-2 text-[#818cf8] text-[10px] font-black tracking-widest uppercase mb-3">
                      <span>🏷️</span> PŘÍLEŽITOST
                    </div>
                    <h2 className="text-2xl font-black mb-1 leading-tight text-white">AKCE: SLEVA {portfolioData.akce_sleva_procenta} %</h2>
                    <h3 className="text-xl font-bold text-white/80 mb-4">na {portfolioData.akce_ticker}</h3>
                    
                    <div className="flex items-center gap-2 text-[#34d399] text-xs font-medium mb-6">
                      <span className="bg-[#059669]/20 w-5 h-5 flex items-center justify-center rounded-full">↘</span> 
                      Nyní levnější oproti nákupu
                    </div>
                    <button className={`w-full py-4 rounded-xl font-bold text-md text-white shadow-lg transition-transform hover:scale-[1.02] ${partner.btnClass}`}>
                      🛒 Dokoupit ve slevě
                    </button>
                  </div>
                )}

                {/* VÝPLATNÍ KALENDÁŘ */}
                {portfolioData.kalendar && portfolioData.kalendar.length > 0 && (
                  <div className="mb-8">
                    <div className="flex justify-between items-end mb-6">
                      <h3 className="text-lg font-bold">Dividendový kalendář</h3>
                      <span className="text-xs text-white/40 font-bold">2026</span>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-4 hide-scrollbar">
                      {portfolioData.kalendar.map((k: any, idx: number) => (
                        <div key={idx} className="flex flex-col items-center min-w-[50px] flex-1">
                          <div className="w-full bg-[#111] rounded-xl relative h-24 flex items-end justify-center pb-2 border border-white/5 group cursor-pointer transition-colors hover:bg-[#222]">
                            <div className={`w-3 rounded-t-sm ${partner.btnClass.split(' ')[0]} transition-all`} style={{ height: `${(k.castka / maxKalendar) * 100}%`, minHeight: '4px' }}></div>
                            <div className={`absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg ${partner.btnClass.split(' ')[0]}`}>
                              {k.castka} Kč
                            </div>
                          </div>
                          <div className="text-[10px] text-white/50 mt-2 uppercase font-bold">{k.mesic.substring(0,3)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TVOJE PORTFOLIO */}
                <h2 className="text-xl font-bold mt-2 mb-4 flex items-center gap-2">📦 Tvoje Portfolio</h2>
                <div className="flex flex-col gap-4 mb-10">
                  {portfolioData.pozice.map((item: any, index: number) => (
                    <div key={index} className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden shadow-lg">
                      <div className="p-4 flex justify-between items-center border-b border-white/5">
                        <div className="flex items-center gap-3">
                          <img src={`https://financialmodelingprep.com/image-stock/${item.ticker}.png`} alt={item.ticker} className="w-10 h-10 rounded-full bg-white p-1" />
                          <div>
                            <p className="font-bold text-lg leading-tight">{item.name}</p>
                            <p className="text-xs text-white/50 tracking-wider font-medium">{item.ticker}</p>
                          </div>
                        </div>
                        <p className="font-bold text-lg">{item.hodnota_czk.toLocaleString("cs-CZ")} Kč</p>
                      </div>
                      <div className={`p-4 ${item.status.style === 'green' ? 'bg-[#022c16]/50' : item.status.style === 'neutral' ? 'bg-white/5' : 'bg-[#1e3a8a]/30'}`}>
                        <div className={`flex items-center gap-2 mb-1 ${item.status.style === 'green' ? 'text-[#22c55e]' : item.status.style === 'neutral' ? 'text-white/50' : 'text-[#3b82f6]'}`}>
                          <span className="text-2xl">{item.status.icon}</span>
                          <span className="font-bold tracking-wide">{item.status.title}</span>
                        </div>
                        <p className="font-semibold text-sm mb-1 text-white/90">{item.status.subtitle}</p>
                        <p className="text-xs text-white/60 leading-relaxed">{item.status.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* MASIVNÍ BROKER TLAČÍTKO PRO DAVIDA */}
                <div className="mt-4 mb-6 relative">
                  <div className={`absolute -inset-1 rounded-3xl blur opacity-30 ${partner.btnClass.split(' ')[0]}`}></div>
                  <a 
                    href={partner.ctaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`relative flex items-center justify-center w-full py-5 rounded-2xl font-black text-xl text-white uppercase tracking-wider transition-all transform hover:scale-[1.02] shadow-2xl ${partner.btnClass}`}
                  >
                    {partner.ctaText}
                  </a>
                  <p className="text-center text-[10px] text-white/30 mt-3 uppercase tracking-widest font-bold">
                    Partner platformy: {partner.name}
                  </p>
                </div>

                {/* God Mode — pouze v dev prostředí (NEXT_PUBLIC_DEV_MODE=true) */}
                {isDevMode && (
                  <button
                    onClick={() => {
                      const newMode = !isGodMode
                      setIsGodMode(newMode)
                      goToDashboard()
                    }}
                    className={`w-full py-4 rounded-xl border transition-all font-bold text-sm mb-4 flex items-center justify-center gap-2 ${
                      isGodMode
                        ? "bg-red-500/20 border-red-500/50 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                        : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white/70"
                    }`}
                  >
                    <span>⚡</span> {isGodMode ? "Vypnout God Mode (Návrat na reálné ceny)" : "GOD MODE: Simulovat pád trhu o 20 %"}
                  </button>
                )}

                {/* Tlačítko pro návrat */}
                <button 
                  onClick={() => {
                    setMyPortfolio([])
                    setPortfolioData(null)
                    setAppState("onboarding")
                    setIsGodMode(false)
                  }}
                  className="w-full py-4 rounded-xl border border-white/5 bg-[#111] text-white/50 hover:bg-white/10 transition-all font-medium mb-4"
                >
                  🔄 Smazat portfolio a začít znovu
                </button>
              </>
            )}
          </div>
        )}

        {activeTab === "akademie" && (
          <div className="animate-in fade-in duration-500">
            <div className="flex flex-col items-center justify-center">
               <AkademieHeader />
               <LessonCard progress={progress} totalSegments={TOTAL_SEGMENTS} onAdvance={handleAdvance} />
            </div>
          </div>
        )}

      </main>

      {/* Modální okno pro nákup */}
      {buyModalStock && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-[#111827] border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden relative">

            {showBuySuccess ? (
              /* ——— SUCCESS SCREEN ——— */
              <>
                {/* CSS konfety */}
                <style>{`
                  @keyframes confetti-fall {
                    0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(120px) rotate(360deg); opacity: 0; }
                  }
                  @keyframes check-pop {
                    0%   { transform: scale(0.4); opacity: 0; }
                    60%  { transform: scale(1.15); }
                    100% { transform: scale(1); opacity: 1; }
                  }
                  .confetti-piece { position: absolute; top: 0; animation: confetti-fall 1.4s ease-in forwards; font-size: 1.25rem; pointer-events: none; }
                  .check-pop { animation: check-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards; }
                `}</style>

                {/* Konfety emoji */}
                {["🎊","🎉","✨","🎊","🎉","✨","🎊"].map((e, i) => (
                  <span key={i} className="confetti-piece" style={{ left: `${10 + i * 13}%`, animationDelay: `${i * 0.1}s` }}>{e}</span>
                ))}

                <div className="flex flex-col items-center text-center pt-4 pb-2">
                  {/* Checkmark s glow */}
                  <div className="check-pop relative mb-5">
                    <div className="absolute inset-0 rounded-full bg-emerald-500/30 blur-xl scale-150" />
                    <div className="relative w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-5xl">
                      ✅
                    </div>
                  </div>

                  <h3 className="text-2xl font-black mb-1">Gratulujeme! 🎉</h3>
                  <p className="text-white/60 text-sm mb-6">Tvé peníze začínají pracovat.</p>

                  {/* Info box — počet kusů a cena */}
                  <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 mb-3 flex items-center gap-3 text-left">
                    <img src={`https://financialmodelingprep.com/image-stock/${buyModalStock.ticker}.png`} alt={buyModalStock.ticker} className="w-10 h-10 rounded-full bg-white p-1 shrink-0" />
                    <div>
                      <p className="text-xs text-white/50 uppercase tracking-wider font-semibold mb-0.5">{buyModalStock.name}</p>
                      <p className="text-sm font-bold text-white">
                        {buyAmount} ks · {Math.round(buyAmount * buyModalStock.aktualni_cena_usd * 23.50).toLocaleString("cs-CZ")} Kč
                      </p>
                    </div>
                  </div>

                  {/* Dividenda (pouze pokud > 0) */}
                  {buyModalStock.div_yield > 0 && (
                    <div className="w-full bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 mb-6 text-left">
                      <p className="text-xs text-emerald-400/70 uppercase tracking-wider font-semibold mb-1">Odhadovaný roční příjem z dividendy</p>
                      <p className="text-lg font-black text-emerald-400">
                        +{Math.round(buyAmount * buyModalStock.aktualni_cena_usd * 23.50 * (buyModalStock.div_yield / 100)).toLocaleString("cs-CZ")} Kč
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() => { setBuyModalStock(null); setShowBuySuccess(false); setBuyAmount(1) }}
                    className={`w-full py-4 rounded-xl text-white font-bold text-lg transition-all ${partner.btnClass}`}
                  >
                    🚀 Pokračovat
                  </button>
                </div>
              </>
            ) : (
              /* ——— FORMULÁŘ ——— */
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold">Nastavení nákupu</h3>
                  <button onClick={() => setBuyModalStock(null)} className="text-white/40 hover:text-white p-1 text-xl">✕</button>
                </div>

                <div className="flex items-center gap-4 mb-6 bg-white/5 p-4 rounded-2xl border border-white/5">
                  <img src={`https://financialmodelingprep.com/image-stock/${buyModalStock.ticker}.png`} alt={buyModalStock.ticker} className="w-12 h-12 rounded-full bg-white p-1 shadow-md" />
                  <div>
                    <p className="text-xs text-white/50 uppercase tracking-wider mb-1 font-semibold">{buyModalStock.name}</p>
                    <p className="text-2xl font-bold">{buyModalStock.aktualni_cena_usd} USD</p>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-white/70 mb-3">Kolik akcií chceš koupit?</label>
                  <div className="flex items-center bg-black/50 border border-white/10 rounded-xl p-2">
                    <button onClick={() => setBuyAmount(Math.max(0.1, buyAmount - 1))} className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-lg text-2xl font-bold transition-colors">-</button>
                    <input
                      type="number"
                      value={buyAmount}
                      onChange={(e) => setBuyAmount(Number(e.target.value))}
                      className="flex-1 bg-transparent text-center text-3xl font-extrabold focus:outline-none"
                    />
                    <button onClick={() => setBuyAmount(buyAmount + 1)} className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-lg text-2xl font-bold transition-colors">+</button>
                  </div>
                  <div className={`mt-4 text-center p-3 rounded-xl border ${partner.bgLightClass} ${partner.borderClass}`}>
                    <p className="text-sm text-white/80">Bude tě to stát cca</p>
                    <p className={`text-xl font-bold ${partner.textClass}`}>{Math.round(buyAmount * buyModalStock.aktualni_cena_usd * 23.50).toLocaleString("cs-CZ")} Kč</p>
                  </div>
                </div>

                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl mb-6 flex gap-3">
                  <span className="text-yellow-400">ℹ️</span>
                  <p className="text-xs text-yellow-200/70 leading-relaxed"><strong>Spread (Poplatek):</strong> Cca 0.5 %. To je normální, nelekni se malého mínusu po nákupu.</p>
                </div>

                <button
                  onClick={confirmBuy}
                  className={`w-full py-4 rounded-xl text-white font-bold text-lg transition-all ${partner.btnClass}`}
                >
                  ✅ Potvrdit nákup
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Spodní navigace - Upgradovaná na 4 tlačítka podle designu */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#050505]/95 backdrop-blur-xl border-t border-white/5 px-6 py-4 z-50">
        <DisclaimerBanner variant="footer" />
        <div className="flex justify-between items-center">
          <button
            onClick={() => { setActiveTab("portfolio"); setAppState("onboarding"); setMyPortfolio([]); setPortfolioData(null); setIsGodMode(false) }}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === "portfolio" && appState === "onboarding" ? partner.textClass : "text-white/30 hover:text-white/60"}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            <span className="text-[9px] font-bold uppercase tracking-wider mt-1">Domov</span>
          </button>

          <button onClick={() => setActiveTab("portfolio")} className={`flex flex-col items-center gap-1 transition-all ${activeTab === "portfolio" && (appState === "results" || appState === "dashboard") ? partner.textClass : "text-white/30 hover:text-white/60"}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>
            <span className="text-[9px] font-bold uppercase tracking-wider mt-1">Portfolio</span>
          </button>

          <button onClick={() => setActiveTab("akademie")} className={`flex flex-col items-center gap-1 transition-all ${activeTab === "akademie" ? partner.textClass : "text-white/30 hover:text-white/60"}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
            <span className="text-[9px] font-bold uppercase tracking-wider mt-1">Akademie</span>
          </button>

          <button className="flex flex-col items-center gap-1 transition-all text-white/30 hover:text-white/60">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            <span className="text-[9px] font-bold uppercase tracking-wider mt-1">Nastaveni</span>
          </button>
        </div>
      </div>
    </div>
  )
}