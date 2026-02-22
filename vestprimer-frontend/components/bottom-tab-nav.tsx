"use client"

import { Home, PieChart, GraduationCap, Settings } from "lucide-react"

const tabs = [
  { label: "Home", icon: Home, active: false },
  { label: "Portfolio", icon: PieChart, active: false },
  { label: "Akademie", icon: GraduationCap, active: true },
  { label: "Settings", icon: Settings, active: false },
]

export function BottomTabNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      aria-label="Hlavni navigace"
    >
      <div className="mx-auto max-w-md border-t border-[rgba(255,255,255,0.06)] bg-navy-deep/95 backdrop-blur-xl">
        <div className="flex items-center justify-around px-2 pb-6 pt-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.label}
                className={`group relative flex flex-col items-center gap-1 rounded-xl px-4 py-2 transition-all duration-300 ${
                  tab.active
                    ? "text-trust-blue-light"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-current={tab.active ? "page" : undefined}
              >
                {tab.active && (
                  <span className="absolute -top-1 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-trust-blue-light shadow-[0_0_12px_rgba(59,130,246,0.8)]" />
                )}
                <Icon
                  className={`h-5 w-5 transition-transform duration-200 ${
                    tab.active ? "scale-110" : "group-hover:scale-105"
                  }`}
                  strokeWidth={tab.active ? 2.5 : 1.5}
                />
                <span className={`text-[10px] font-medium tracking-wide ${tab.active ? "font-semibold" : ""}`}>
                  {tab.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
