export interface PartnerConfig {
  name: string
  logo: string | null
  bgColor: string
  btnClass: string
  textClass: string
  glowClass: string
  borderClass: string
  bgLightClass: string
  ctaText: string
  ctaLink: string
}

export const PARTNERS: Record<string, PartnerConfig> = {
  default: {
    name: "VestPrimer",
    logo: null,
    bgColor: "#0a0f1c",
    btnClass: "bg-blue-600 hover:bg-blue-500 shadow-blue-600/30",
    textClass: "text-blue-400",
    glowClass: "bg-blue-600/15",
    borderClass: "border-blue-500/20",
    bgLightClass: "bg-blue-500/10",
    ctaText: "Otevřít účet u Brokera",
    ctaLink: "https://www.xtb.com/cz",
  },
  xtb: {
    name: "XTB",
    logo: "/images/logos/xtb.png",
    bgColor: "#050505",
    btnClass: "bg-[#e50000] hover:bg-red-600 shadow-red-600/30",
    textClass: "text-[#e50000]",
    glowClass: "bg-red-600/10",
    borderClass: "border-red-500/20",
    bgLightClass: "bg-zinc-900",
    ctaText: "Začít investovat s XTB",
    ctaLink: "https://www.xtb.com/cz",
  },
  portu: {
    name: "Portu",
    logo: "/images/logos/portu.png",
    bgColor: "#160d40",
    btnClass: "bg-[#22c55e] hover:bg-[#16a34a] shadow-green-500/30",
    textClass: "text-[#22c55e]",
    glowClass: "bg-[#22c55e]/15",
    borderClass: "border-[#22c55e]/25",
    bgLightClass: "bg-[#22c55e]/10",
    ctaText: "Složit portfolio na Portu",
    ctaLink: "https://www.portu.cz",
  },
  george: {
    name: "George",
    logo: "/images/logos/george.png",
    bgColor: "#012d5c",
    btnClass: "bg-[#0066FF] hover:bg-[#1a75ff] shadow-[#0066FF]/40",
    textClass: "text-[#60a5fa]",
    glowClass: "bg-[#0066FF]/20",
    borderClass: "border-[#0066FF]/30",
    bgLightClass: "bg-[#0066FF]/10",
    ctaText: "Investovat s George",
    ctaLink: "https://www.george.csas.cz",
  },
}

export const DEFAULT_PARTNER_ID = "default"

export function getPartner(id: string | null | undefined): PartnerConfig {
  if (id && id in PARTNERS) return PARTNERS[id]
  return PARTNERS[DEFAULT_PARTNER_ID]
}

export function getPartnerSuffix(partnerId: string): string {
  return partnerId !== DEFAULT_PARTNER_ID ? `?partner=${partnerId}` : ""
}
