"use client"

import { useState } from "react"

interface DisclaimerBannerProps {
  variant: "footer" | "onboarding"
}

export function DisclaimerBanner({ variant }: DisclaimerBannerProps) {
  const [expanded, setExpanded] = useState(false)

  if (variant === "footer") {
    return (
      <div className="px-4 pb-2">
        <p className="text-[9px] text-white/25 leading-relaxed text-center">
          ⚖️ VestPrimer je edukační nástroj, nikoliv investiční poradenství dle zákona č. 256/2004 Sb.{" "}
          <button
            onClick={() => setExpanded(!expanded)}
            className="underline underline-offset-2 text-white/35 hover:text-white/50 transition-colors"
          >
            {expanded ? "Méně" : "Více"}
          </button>
        </p>
        {expanded && (
          <p className="text-[9px] text-white/20 leading-relaxed text-center mt-1">
            Investování je spojeno s rizikem ztráty části nebo celé investice. Minulé výnosy nejsou zárukou výnosů budoucích.
          </p>
        )}
      </div>
    )
  }

  // onboarding variant
  return (
    <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-start gap-3">
        <span className="text-xl leading-none mt-0.5">⚖️</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-white/70 uppercase tracking-wider mb-1">Vzdělávací nástroj</p>
          <p className="text-xs text-white/50 leading-relaxed">
            VestPrimer nepodléhá regulaci ČNB a neposkytuje investiční poradenství.{" "}
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-white/40 underline underline-offset-2 hover:text-white/60 transition-colors"
            >
              {expanded ? "Skrýt" : "Více info"}
            </button>
          </p>
          {expanded && (
            <p className="text-xs text-white/40 leading-relaxed mt-2 border-t border-white/10 pt-2">
              Aplikace slouží výhradně ke vzdělávacím účelům. Nevztahuje se na ni zákon č. 256/2004 Sb. o podnikání na kapitálovém trhu. Veškeré informace mají ilustrativní charakter a nepředstavují investiční doporučení. Investování je vždy spojeno s rizikem ztráty vložených prostředků.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
