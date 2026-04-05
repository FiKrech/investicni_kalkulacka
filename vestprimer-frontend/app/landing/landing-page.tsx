'use client'

import React, { useEffect } from 'react'
import { DM_Serif_Display, DM_Sans } from 'next/font/google'

const dmSerif = DM_Serif_Display({
  subsets: ['latin', 'latin-ext'],
  weight: '400',
  variable: '--vp-serif',
})

const dmSans = DM_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--vp-sans',
})

const CTA_HREF = 'mailto:filip.krechler@seznam.cz'
const LINKEDIN_HREF = 'https://www.linkedin.com/in/filipkrechler'

// ---------------------------------------------------------------------------
// Phone Mockup
// ---------------------------------------------------------------------------
function PhoneMockup({
  src,
  alt,
  glowColor = '#3b7dea',
  size = 'lg',
  objectPosition = 'top',
}: {
  src: string
  alt: string
  glowColor?: string
  size?: 'lg' | 'md' | 'sm'
  objectPosition?: string
}) {
  const w = size === 'lg' ? 270 : size === 'md' ? 190 : 130
  const h = size === 'lg' ? 540 : size === 'md' ? 380 : 260
  const r = size === 'lg' ? 36 : size === 'md' ? 28 : 20
  const b = size === 'lg' ? 5 : size === 'md' ? 4 : 3

  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: r,
        border: `${b}px solid rgba(255,255,255,0.13)`,
        background: '#06080f',
        overflow: 'hidden',
        position: 'relative',
        flexShrink: 0,
        boxShadow: `0 30px 70px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.05), 0 0 60px ${glowColor}26`,
      }}
    >
      {/* Notch */}
      <div
        style={{
          position: 'absolute',
          top: 8,
          left: '50%',
          transform: 'translateX(-50%)',
          width: size === 'lg' ? 72 : 40,
          height: 4,
          background: 'rgba(255,255,255,0.18)',
          borderRadius: 999,
          zIndex: 10,
        }}
      />
      <img
        src={src}
        alt={alt}
        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition }}
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// LinkedIn Icon
// ---------------------------------------------------------------------------
function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Shared Section Header
// ---------------------------------------------------------------------------
function SectionHeader({
  label,
  title,
  sub,
  center = false,
  delay = 0,
}: {
  label: string
  title: React.ReactNode
  sub?: string
  center?: boolean
  delay?: number
}) {
  return (
    <div style={{ textAlign: center ? 'center' : undefined, marginBottom: '3.5rem' }}>
      <div className="vp-fade vp-section-label" style={{ transitionDelay: `${delay}s` }}>
        {label}
      </div>
      <h2 className="vp-fade vp-section-title" style={{ transitionDelay: `${delay + 0.06}s` }}>
        {title}
      </h2>
      {sub && (
        <p
          className="vp-fade vp-section-sub"
          style={{ transitionDelay: `${delay + 0.12}s`, maxWidth: center ? '42rem' : '36rem', margin: center ? '0 auto' : undefined }}
        >
          {sub}
        </p>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Nav
// ---------------------------------------------------------------------------
function Nav() {
  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        background: 'rgba(8,9,22,0.82)',
      }}
    >
      <div
        className="vp-container"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}
      >
        <div style={{ fontFamily: 'var(--vp-serif), Georgia, serif', fontSize: '1.25rem', letterSpacing: '-0.01em', color: '#f0f4ff' }}>
          <span style={{ color: '#e63946' }}>Vest</span>Primer
        </div>
        <a href={CTA_HREF} className="vp-btn vp-btn-sm">
          Domluvit demo →
        </a>
      </div>
    </nav>
  )
}

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------
function Hero() {
  return (
    <section style={{ position: 'relative', padding: '5rem 0 4rem', overflow: 'hidden' }}>
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          top: -220,
          left: -180,
          width: 900,
          height: 900,
          background: 'radial-gradient(ellipse at center, rgba(59,125,234,0.11) 0%, transparent 68%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: -200,
          width: 700,
          height: 700,
          background: 'radial-gradient(ellipse at center, rgba(230,57,70,0.07) 0%, transparent 68%)',
          pointerEvents: 'none',
        }}
      />

      <div className="vp-container vp-hero-inner" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', gap: '4rem', minHeight: '78vh' }}>
        {/* Content */}
        <div className="vp-fade" style={{ zIndex: 1 }}>
          <div className="vp-badge">B2B · White-label SaaS · Onboarding Engine</div>
          <h1
            style={{
              fontFamily: 'var(--vp-serif), Georgia, serif',
              fontSize: 'clamp(2.6rem, 5vw, 4.25rem)',
              lineHeight: 1.1,
              letterSpacing: '-0.025em',
              color: '#f0f4ff',
              marginBottom: '1.5rem',
            }}
          >
            Vaši klienti mají peníze.{' '}
            <span style={{ color: '#e63946' }}>Ale bojí se investovat.</span>
          </h1>
          <p
            style={{
              fontSize: '1.125rem',
              color: '#8899b8',
              lineHeight: 1.75,
              marginBottom: '2.5rem',
              maxWidth: '30rem',
            }}
          >
            VestPrimer je white-label onboarding engine, který mění mrtvé registrace na aktivní
            investory.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <a href={CTA_HREF} className="vp-btn vp-btn-lg">
              Chci vidět demo
            </a>
            <span style={{ color: '#7888a8', fontSize: '0.875rem' }}>
              1 měsíc · 5 % trafficu · Platíte jen úspěch
            </span>
          </div>
        </div>

        {/* Phone hero */}
        <div className="vp-fade vp-hero-phone" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', transitionDelay: '0.15s' }}>
          <PhoneMockup src="/images/screenshots/portfolio.png" alt="VestPrimer portfolio dashboard" glowColor="#3b7dea" />
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Problem
// ---------------------------------------------------------------------------
function Problem() {
  const cards = [
    {
      stat: '60 %',
      statLabel: 'registrací nikdy nepošle první vklad',
      icon: '💀',
      title: 'Mrtvé registrace',
      text: 'Platíte za marketing, který přivede lidi k registraci. Ale většina se lekne grafů a nikdy nepošle první vklad.',
      color: '#e63946',
    },
    {
      stat: '−100 %',
      statLabel: 'návratnosti akvizičních nákladů',
      icon: '📉',
      title: 'Rychlá smrt (Churn)',
      text: 'Nováček pošle 10 000 Kč, koupí špatně, vidí −20 % a naštvaný odejde navždy. Přicházíte o celou investici do jeho akvizice.',
      color: '#f59e0b',
    },
    {
      stat: '↑ CPA',
      statLabel: 'při klesajícím LTV',
      icon: '💸',
      title: 'Rostoucí náklady',
      text: 'Marketingové náklady rostou, konverze klesá. ROI se hroutí, protože problém není v marketingu — je v onboardingu.',
      color: '#e63946',
    },
  ]

  return (
    <section className="vp-section" id="problem">
      <div className="vp-container">
        <SectionHeader
          label="Problém"
          title={<>60 % registrací nikdy<br />nepošle první vklad</>}
          sub="Váš marketingový funnel funguje. Onboarding ne."
        />

        <div className="vp-grid-3">
          {cards.map((card, i) => (
            <div
              key={i}
              className="vp-fade vp-card"
              style={{ transitionDelay: `${0.1 + i * 0.1}s` }}
            >
              <div
                style={{
                  fontFamily: 'var(--vp-serif), Georgia, serif',
                  fontSize: '2.625rem',
                  lineHeight: 1,
                  color: card.color,
                  marginBottom: '0.25rem',
                }}
              >
                {card.stat}
              </div>
              <div style={{ fontSize: '0.8125rem', color: '#5a6a88', marginBottom: '1.5rem' }}>
                {card.statLabel}
              </div>
              <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: '1.5rem' }} />
              <div style={{ fontSize: '1.375rem', marginBottom: '0.625rem' }}>{card.icon}</div>
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#e8ecf4', marginBottom: '0.5rem' }}>
                {card.title}
              </h3>
              <p style={{ fontSize: '0.9375rem', color: '#7888a8', lineHeight: 1.68 }}>{card.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Solution
// ---------------------------------------------------------------------------
const features = [
  {
    num: '01',
    color: '#3b7dea',
    title: 'Edukace bez finanční latiny',
    text: 'Místo P/E ratio vysvětlujeme Teorii Pizzy. Místo volatility Teorii Benzínu. Nováček pochopí za 3 minuty to, co by jinak vzdal.',
    screenshot: '/images/screenshots/pizza-theory.png',
    objectPosition: 'center',
  },
  {
    num: '02',
    color: '#22c55e',
    title: 'Anti-Panic Algoritmus',
    text: 'Pokles není ztráta, ale SLEVA. Klient je motivován dokupovat, ne prodávat v panice. Churn se mění na příležitost.',
    screenshot: '/images/screenshots/success.png',
  },
  {
    num: '03',
    color: '#f59e0b',
    title: 'Dividendový Kalendář',
    text: 'Vizualizace budoucích dividend v čase. Dopaminová odměna, která drží klienta aktivního a loajálního měsíce po prvním vkladu.',
    screenshot: '/images/screenshots/portfolio.png',
  },
  {
    num: '04',
    color: '#e63946',
    title: 'Chameleon Engine',
    text: 'Automatické přebarvení na branding partnera. Vaše barvy. Vaše logo. Váš produkt. Nováček vůbec neví, že používá VestPrimer.',
    screenshot: '/images/screenshots/sectors.png',
  },
]

const chameleonPhones = [
  { src: '/images/screenshots/xtb-verze.jpg', label: 'XTB', color: '#e50000' },
  { src: '/images/screenshots/george-verze.jpg', label: 'George', color: '#0066FF' },
  { src: '/images/screenshots/portu-verze.jpg', label: 'Portu', color: '#22c55e' },
]

function Solution() {
  const regularFeatures = features.filter((f) => f.num !== '04')
  const chameleonFeature = features.find((f) => f.num === '04')!

  return (
    <section className="vp-section vp-section-alt" id="reseni">
      <div className="vp-container">
        <SectionHeader
          label="Řešení"
          title={<>Psychologický předpokoj<br />před vaší platformou</>}
          sub="VestPrimer není konkurence. Je to ochranná vrstva, která sedí před vaší obchodní aplikací a transformuje nováčka na připraveného investora."
        />

        {/* Karty 01–03: row layout — text vlevo, phone vpravo */}
        <div className="vp-features-grid">
          {regularFeatures.map((f, i) => (
            <div
              key={i}
              className="vp-fade vp-feature-card vp-feature-card-row"
              style={{ transitionDelay: `${0.08 + i * 0.1}s`, '--fc': f.color } as React.CSSProperties}
            >
              {/* Text */}
              <div className="vp-feature-card-text">
                <div style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', color: f.color, marginBottom: '0.875rem' }}>
                  {f.num}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#eef2ff', marginBottom: '0.75rem' }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: '0.9375rem', color: '#7888a8', lineHeight: 1.72 }}>{f.text}</p>
              </div>

              {/* Phone visual */}
              <div className="vp-feature-card-visual">
                {/* Glow */}
                <div style={{
                  position: 'absolute', bottom: -60, left: '50%', transform: 'translateX(-50%)',
                  width: 260, height: 260, borderRadius: '50%',
                  background: f.color, opacity: 0.1, filter: 'blur(60px)', pointerEvents: 'none',
                }} />
                {/* Fade bottom */}
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
                  background: 'linear-gradient(to top, rgba(13,16,48,0.95), transparent)',
                  zIndex: 3, pointerEvents: 'none',
                }} />
                <PhoneMockup src={f.screenshot} alt={f.title} glowColor={f.color} size="lg" objectPosition={(f as any).objectPosition} />
              </div>
            </div>
          ))}
        </div>

        {/* Karta 04: Chameleon Engine — tři phones XTB / George / Portu */}
        <div
          className="vp-fade vp-feature-card vp-feature-card-chameleon"
          style={{ transitionDelay: '0.38s', '--fc': chameleonFeature.color } as React.CSSProperties}
        >
          {/* Text */}
          <div className="vp-feature-card-text" style={{ flex: '0 0 auto', maxWidth: '36rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', color: chameleonFeature.color, marginBottom: '0.875rem' }}>
              {chameleonFeature.num}
            </div>
            <h3 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#eef2ff', marginBottom: '0.75rem' }}>
              {chameleonFeature.title}
            </h3>
            <p style={{ fontSize: '0.9375rem', color: '#7888a8', lineHeight: 1.72 }}>{chameleonFeature.text}</p>
          </div>

          {/* Tři phones */}
          <div className="vp-chameleon-phones">
            {chameleonPhones.map(({ src, label, color }) => (
              <div key={label} className="vp-chameleon-phone">
                {/* Glow pod telefonem */}
                <div style={{
                  position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
                  width: 120, height: 80, borderRadius: '50%',
                  background: color, opacity: 0.18, filter: 'blur(28px)', pointerEvents: 'none',
                }} />
                <PhoneMockup src={src} alt={`VestPrimer ${label} verze`} glowColor={color} size="md" />
                <div style={{
                  marginTop: '0.875rem',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase' as const,
                  color,
                  textAlign: 'center' as const,
                }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// How It Works
// ---------------------------------------------------------------------------
function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'White-label vrstva',
      desc: 'Běží nad vaším API. Žádný zásah do vašich systémů. Integrace za dny, ne měsíce.',
    },
    {
      num: '02',
      title: 'Chameleon Mód',
      desc: 'Automaticky se přebarví na váš brand. Klient vidí váš produkt — VestPrimer zůstává neviditelný.',
    },
    {
      num: '03',
      title: 'Zero IT Headache',
      desc: 'My spravujeme data a logiku, vy přijímáte aktivované klienty připravené investovat.',
    },
  ]

  return (
    <section className="vp-section" id="jak-to-funguje">
      <div className="vp-container">
        <SectionHeader
          label="Technicky"
          title="Nasazení za týdny, ne měsíce"
          center
        />

        <div className="vp-steps-row">
          {steps.map((s, i) => (
            <div key={i} className="vp-fade vp-step" style={{ transitionDelay: `${0.1 + i * 0.14}s` }}>
              {/* Connector line (not after last) */}
              {i < steps.length - 1 && (
                <div
                  style={{
                    position: 'absolute',
                    top: 28,
                    left: 'calc(50% + 28px)',
                    right: 'calc(-50% + 28px)',
                    height: 1,
                    background: 'rgba(255,255,255,0.08)',
                  }}
                />
              )}
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: 'rgba(59,125,234,0.1)',
                  border: '1px solid rgba(59,125,234,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                  fontFamily: 'var(--vp-serif), Georgia, serif',
                  fontSize: '1rem',
                  color: '#7eb6ff',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {s.num}
              </div>
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#e8ecf4', marginBottom: '0.5rem' }}>
                {s.title}
              </h3>
              <p style={{ fontSize: '0.9375rem', color: '#7888a8', lineHeight: 1.68 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Business Model
// ---------------------------------------------------------------------------
function BusinessModel() {
  return (
    <section className="vp-section vp-section-alt" id="model">
      <div className="vp-container">
        <SectionHeader
          label="Business Model"
          title="Partnerství, ne vendor"
          center
        />

        <div className="vp-bm-grid">
          <div className="vp-fade vp-card" style={{ transitionDelay: '0.1s', padding: '2.5rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📋</div>
            <h3 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#e8ecf4', marginBottom: '0.75rem' }}>Fix</h3>
            <p style={{ fontSize: '1rem', color: '#7888a8', lineHeight: 1.68 }}>
              Malý měsíční paušál na pokrytí serverů a údržby. Transparentní náklady bez překvapení.
            </p>
          </div>

          <div
            className="vp-fade vp-card"
            style={{
              transitionDelay: '0.2s',
              padding: '2.5rem',
              borderColor: 'rgba(34,197,94,0.22)',
              background: 'rgba(34,197,94,0.035)',
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎯</div>
            <h3 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#22c55e', marginBottom: '0.75rem' }}>
              Success Fee
            </h3>
            <p style={{ fontSize: '1rem', color: '#7888a8', lineHeight: 1.68 }}>
              Platíte pouze za aktivního uživatele, který vloží peníze. Pokud nástroj nefunguje,
              neplatíte nic navíc.
            </p>
          </div>
        </div>

        {/* Risk banner */}
        <div
          className="vp-fade"
          style={{
            transitionDelay: '0.3s',
            marginTop: '2rem',
            padding: '2.75rem',
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(230,57,70,0.07), rgba(230,57,70,0.03))',
            border: '1px solid rgba(230,57,70,0.2)',
            borderRadius: '1.25rem',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--vp-serif), Georgia, serif',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              color: '#e63946',
              letterSpacing: '-0.02em',
              marginBottom: '0.5rem',
            }}
          >
            Risk je na nás.
          </div>
          <p style={{ color: '#7888a8', fontSize: '0.9375rem' }}>
            Žádné konkrétní ceny — to je na demo call.
          </p>
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Roadmap
// ---------------------------------------------------------------------------
function Roadmap() {
  const items = [
    {
      phase: 'Dnes',
      active: true,
      title: 'Psychologický onboarding',
      desc: 'Live data, funkční MVP. Nasazeno, testováno, připraveno ke škálování.',
    },
    {
      phase: 'Fáze 2',
      active: false,
      title: 'LLM Analýza portfolia',
      desc: 'Integrace velkých jazykových modelů pro analýzu portfolia v reálném čase. Bez finančního žargonu.',
    },
    {
      phase: 'Vize',
      active: false,
      title: 'AI Analytik',
      desc: 'Personalizované poradenství lidskou řečí. Každý klient má svého analytika v kapse.',
    },
  ]

  return (
    <section className="vp-section" id="roadmap">
      <div className="vp-container">
        <SectionHeader label="Roadmap" title="Co přichází dál" />

        <div
          style={{
            borderLeft: '2px solid rgba(255,255,255,0.07)',
            paddingLeft: 0,
            marginTop: '1rem',
          }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              className="vp-fade"
              style={{
                transitionDelay: `${0.08 + i * 0.1}s`,
                display: 'flex',
                gap: '2.5rem',
                padding: '2rem 2rem 2rem 2.5rem',
                borderLeft: `2px solid ${item.active ? '#22c55e' : 'transparent'}`,
                marginLeft: -2,
              }}
            >
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: item.active ? '#22c55e' : '#5a6a88',
                  width: 72,
                  flexShrink: 0,
                  paddingTop: 3,
                }}
              >
                {item.phase}
              </div>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#e8ecf4', marginBottom: '0.375rem' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.9375rem', color: '#7888a8', lineHeight: 1.68 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// CTA Section
// ---------------------------------------------------------------------------
function CTASection() {
  return (
    <section
      className="vp-section"
      id="kontakt"
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 110%, rgba(230,57,70,0.09), transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      <div className="vp-container" style={{ textAlign: 'center', position: 'relative' }}>
        <div className="vp-fade vp-section-label" style={{ marginBottom: '1.25rem' }}>
          Pojďme spolupracovat
        </div>
        <h2
          className="vp-fade"
          style={{
            fontFamily: 'var(--vp-serif), Georgia, serif',
            fontSize: 'clamp(2.75rem, 6vw, 5rem)',
            letterSpacing: '-0.025em',
            lineHeight: 1.1,
            color: '#f0f4ff',
            marginBottom: '1rem',
            transitionDelay: '0.06s',
          }}
        >
          Pojďme to změřit.
        </h2>
        <p
          className="vp-fade"
          style={{
            fontSize: '1.25rem',
            color: '#7888a8',
            marginBottom: '2.75rem',
            transitionDelay: '0.12s',
          }}
        >
          1 měsíc. 5 % trafficu. Platíte jen úspěch.
        </p>
        <div className="vp-fade" style={{ transitionDelay: '0.18s' }}>
          <a href={CTA_HREF} className="vp-btn vp-btn-lg">
            Domluvit demo →
          </a>
        </div>

        {/* Founder */}
        <div
          className="vp-fade"
          style={{
            transitionDelay: '0.25s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2rem',
            marginTop: '3.5rem',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.9375rem', textAlign: 'left' }}>
            <strong style={{ color: '#e8ecf4' }}>Filip Krechler</strong>
            <span style={{ color: '#7888a8' }}>Founder, VestPrimer</span>
          </div>
          <a
            href={LINKEDIN_HREF}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#7eb6ff',
              textDecoration: 'none',
              fontSize: '0.9375rem',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#a8d4ff')}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#7eb6ff')}
          >
            <LinkedInIcon />
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------
function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid rgba(255,255,255,0.05)',
        padding: '2.5rem 0',
        background: 'rgba(0,0,0,0.18)',
      }}
    >
      <div
        className="vp-container"
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.75rem' }}
      >
        <div
          style={{ fontFamily: 'var(--vp-serif), Georgia, serif', fontSize: '1.125rem', color: '#e8ecf4' }}
        >
          <span style={{ color: '#e63946' }}>Vest</span>Primer
        </div>
        <p style={{ fontSize: '0.8125rem', color: '#4a5a78', maxWidth: '36rem', lineHeight: 1.5 }}>
          VestPrimer je edukační nástroj, nikoliv investiční poradenství dle zákona č. 258/2004 Sb.
        </p>
        <p style={{ fontSize: '0.8125rem', color: '#38485e' }}>© 2026 VestPrimer</p>
      </div>
    </footer>
  )
}

// ---------------------------------------------------------------------------
// CSS
// ---------------------------------------------------------------------------
const css = `
  .vp-root {
    font-family: var(--vp-sans), 'DM Sans', system-ui, sans-serif;
    background: #080918;
    color: #e2e8f8;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
  }

  /* Container */
  .vp-container {
    max-width: 72rem;
    margin: 0 auto;
    padding: 0 1.5rem;
  }

  /* Sections */
  .vp-section { padding: 6rem 0; }
  .vp-section-alt { background: rgba(255,255,255,0.018); }

  /* Typography helpers */
  .vp-section-label {
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #e63946;
    margin-bottom: 0.875rem;
  }
  .vp-section-title {
    font-family: var(--vp-serif), 'DM Serif Display', Georgia, serif;
    font-size: clamp(2rem, 4vw, 3rem);
    line-height: 1.15;
    letter-spacing: -0.022em;
    color: #f0f4ff;
    margin-bottom: 1rem;
  }
  .vp-section-sub {
    font-size: 1.0625rem;
    color: #7888a8;
    line-height: 1.75;
    margin-bottom: 0;
  }

  /* Badge */
  .vp-badge {
    display: inline-flex;
    align-items: center;
    padding: 0.35rem 0.9rem;
    background: rgba(59,125,234,0.1);
    border: 1px solid rgba(59,125,234,0.28);
    border-radius: 999px;
    font-size: 0.8rem;
    color: #7eb6ff;
    letter-spacing: 0.02em;
    margin-bottom: 1.5rem;
  }

  /* Buttons */
  .vp-btn {
    display: inline-flex;
    align-items: center;
    padding: 0.75rem 1.75rem;
    background: #e63946;
    color: #fff;
    border-radius: 0.5rem;
    font-weight: 600;
    text-decoration: none;
    font-size: 0.9375rem;
    transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
    box-shadow: 0 4px 20px rgba(230,57,70,0.28);
    font-family: var(--vp-sans), system-ui, sans-serif;
    white-space: nowrap;
  }
  .vp-btn:hover {
    background: #c1121f;
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(230,57,70,0.38);
  }
  .vp-btn-sm {
    padding: 0.5rem 1.25rem;
    font-size: 0.875rem;
    border-radius: 0.375rem;
  }
  .vp-btn-lg {
    padding: 1rem 2.5rem;
    font-size: 1.0625rem;
    border-radius: 0.625rem;
    letter-spacing: 0.01em;
  }

  /* Cards */
  .vp-card {
    background: rgba(255,255,255,0.028);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 1.25rem;
    padding: 2rem;
    transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
  }
  .vp-card:hover {
    transform: translateY(-3px);
    border-color: rgba(255,255,255,0.11);
    box-shadow: 0 16px 40px rgba(0,0,0,0.2);
  }

  /* Grids */
  .vp-grid-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }
  .vp-features-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    margin-bottom: 2rem;
  }

  /* Feature karta — row layout (desktop) */
  .vp-feature-card-row {
    flex-direction: row;
    min-height: 420px;
  }
  .vp-feature-card-text {
    flex: 0 0 42%;
    padding: 2.75rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .vp-feature-card-visual {
    flex: 1;
    position: relative;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding-top: 2.5rem;
    border-left: 1px solid rgba(255,255,255,0.05);
  }

  /* Chameleon karta — full width, flex row na desktopu */
  .vp-feature-card-chameleon {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0;
    background: linear-gradient(135deg, rgba(230,57,70,0.06) 0%, rgba(255,255,255,0.02) 60%);
    border-color: rgba(230,57,70,0.18);
    padding: 2.75rem 2.75rem 2.75rem 2.75rem;
    gap: 3rem;
  }
  .vp-chameleon-phones {
    display: flex;
    gap: 2rem;
    justify-content: center;
    align-items: flex-end;
    flex: 1;
    padding: 1rem 0;
  }
  .vp-chameleon-phone {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }
  .vp-bm-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }

  /* Steps */
  .vp-steps-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    margin-top: 3rem;
    text-align: center;
  }
  .vp-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }

  /* Feature cards */
  .vp-feature-card {
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 1.5rem;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: transform 0.3s ease, border-color 0.3s ease;
  }
  .vp-feature-card:hover {
    transform: translateY(-4px);
    border-color: rgba(255,255,255,0.12);
  }

  /* Scroll reveal */
  .vp-fade {
    opacity: 0;
    transform: translateY(1.75rem);
    transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1);
  }
  .vp-visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .vp-hero-inner {
      grid-template-columns: 1fr !important;
      min-height: auto !important;
      gap: 2.5rem !important;
    }
    .vp-hero-phone { order: -1; }
    .vp-grid-3 { grid-template-columns: 1fr; }
    .vp-bm-grid { grid-template-columns: 1fr; }
    .vp-steps-row { grid-template-columns: 1fr; text-align: left; }

    /* Feature karty — mobil: column */
    .vp-feature-card-row {
      flex-direction: column;
      min-height: auto;
    }
    .vp-feature-card-text {
      flex: none;
      padding: 2rem;
    }
    .vp-feature-card-visual {
      flex: none;
      border-left: none;
      border-top: 1px solid rgba(255,255,255,0.05);
      height: 280px;
      padding-top: 2rem;
      justify-content: center;
    }

    /* Chameleon — mobil: column, phones scroll */
    .vp-feature-card-chameleon {
      flex-direction: column;
      padding: 2rem;
      gap: 1.5rem;
    }
    .vp-chameleon-phones {
      overflow-x: auto;
      justify-content: flex-start;
      padding-bottom: 0.5rem;
      gap: 1.25rem;
      width: 100%;
    }
    .vp-step { align-items: flex-start; }
    .vp-section { padding: 4rem 0; }
  }
  @media (max-width: 640px) {
    .vp-hero-grid { gap: 2.5rem !important; }
    .vp-section-title { font-size: 1.75rem !important; }
  }
`

// ---------------------------------------------------------------------------
// Root Component
// ---------------------------------------------------------------------------
export default function LandingPage() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('vp-visible')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.07, rootMargin: '0px 0px -60px 0px' }
    )
    document.querySelectorAll('.vp-fade').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div className={`${dmSerif.variable} ${dmSans.variable} vp-root`}>
      <style>{css}</style>
      <Nav />
      <main>
          <Hero />
        <Problem />
        <Solution />
        <HowItWorks />
        <BusinessModel />
        <Roadmap />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
