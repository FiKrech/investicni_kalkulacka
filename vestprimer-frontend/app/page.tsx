"use client"

import { useState, useEffect } from "react"
import { PARTNERS, getPartner, getPartnerSuffix } from "@/lib/partners"

export default function WelcomePage() {
  const [partnerId, setPartnerId] = useState("default")

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const p = params.get("partner")
    if (p && p in PARTNERS) {
      setPartnerId(p)
    }
  }, [])

  const partner = getPartner(partnerId)
  const partnerSuffix = getPartnerSuffix(partnerId)

  return (
    <div
      className="relative mx-auto flex min-h-dvh max-w-md flex-col text-white overflow-hidden transition-colors duration-700"
      style={{ backgroundColor: partner.bgColor }}
    >
      {/* Ambientní podsvícení podle partnera */}
      <div
        className={`pointer-events-none absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/3 rounded-full blur-[120px] transition-colors duration-700 ${partner.glowClass}`}
      />

      <main className="flex-1 overflow-y-auto pb-28 z-10 px-5 pt-8">

        {/* ── HEADER ── */}
        <div className="flex justify-between items-center mb-14">
          <div className="flex items-center gap-2.5">
            {partner.logo ? (
              <img
                src={partner.logo}
                alt={partner.name}
                className="h-8 w-auto object-contain"
                style={{ maxWidth: "96px" }}
              />
            ) : (
              <span className={`font-black text-xl tracking-tighter ${partner.textClass}`}>
                {partner.name}
              </span>
            )}
            <span className="text-white/20">|</span>
            <span className="text-white/60 font-medium text-sm">VestPrimer</span>
          </div>
          <div className={`text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full border ${partner.bgLightClass} ${partner.borderClass} ${partner.textClass}`}>
            BETA
          </div>
        </div>

        {/* ── HERO ── */}
        <div className="mb-10">
          <h1 className="text-[2.85rem] font-black tracking-tighter leading-[1.08] mb-5">
            Investování<br />konečně<br />
            <span className={partner.textClass}>lidsky.</span>
          </h1>
          <p className="text-white/55 text-[0.95rem] leading-relaxed max-w-xs">
            Zapomeň na složité grafy. Vyber si strategii podle toho, co ti dává smysl v běžném životě.
          </p>
        </div>

        {/* ── MINI FEATURE CARDS ── */}
        <div className="flex flex-col gap-2.5 mb-10">
          {[
            { icon: "⚡", label: "Hotovo za 2 minuty", sub: "Žádné složité pojmy" },
            { icon: "🎯", label: "Akcie na míru tobě", sub: "Podle tvých cílů a hodnot" },
            { icon: "📈", label: "Pasivní příjem z dividend", sub: "Pravidelné výplaty na účet" },
          ].map((item) => (
            <div
              key={item.label}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl border ${partner.bgLightClass} ${partner.borderClass}`}
            >
              <span className="text-2xl leading-none">{item.icon}</span>
              <div>
                <p className="text-sm font-bold text-white leading-tight">{item.label}</p>
                <p className="text-xs text-white/40 mt-0.5">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── CTA TLAČÍTKA ── */}
        <div className="flex flex-col gap-3 mb-3">
          <a
            href={`/wizard${partnerSuffix}`}
            className={`w-full py-4 rounded-2xl font-bold text-lg text-white text-center shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98] ${partner.btnClass}`}
          >
            Sestavit můj plán
          </a>
          <a
            href={`/wizard${partnerSuffix}${partnerSuffix ? "&" : "?"}tab=akademie`}
            className="w-full py-4 rounded-2xl font-semibold text-sm text-white/65 text-center border border-white/8 bg-white/5 hover:bg-white/10 transition-all"
          >
            Rychlokurz (3 min)
          </a>
        </div>

        <p className="text-center text-xs text-white/25">
          Zabere to cca 2 minuty. Na konci dostaneš seznam firem na míru.
        </p>

      </main>

      {/* ── BOTTOM NAV ── */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#050505]/95 backdrop-blur-xl border-t border-white/5 px-6 py-4 z-50">
        <div className="flex justify-between items-center">

          {/* Domov — aktivní */}
          <button className={`flex flex-col items-center gap-1 relative ${partner.textClass}`}>
            <span className={`absolute -top-5 left-1/2 -translate-x-1/2 h-0.5 w-6 rounded-full ${partner.btnClass.split(" ")[0]}`} />
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-[9px] font-bold uppercase tracking-wider">Domov</span>
          </button>

          {/* Portfolio */}
          <button className="flex flex-col items-center gap-1 text-white/30 hover:text-white/60 transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
            <span className="text-[9px] font-bold uppercase tracking-wider">Portfolio</span>
          </button>

          {/* Akademie */}
          <button className="flex flex-col items-center gap-1 text-white/30 hover:text-white/60 transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="text-[9px] font-bold uppercase tracking-wider">Akademie</span>
          </button>

          {/* Nastavení */}
          <button className="flex flex-col items-center gap-1 text-white/30 hover:text-white/60 transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-[9px] font-bold uppercase tracking-wider">Nastavení</span>
          </button>

        </div>
      </div>
    </div>
  )
}
