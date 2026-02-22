"use client"

import { cn } from "@/lib/utils"

const sectors = [
  { id: "food", icon: "🛒", label: "Jídlo a nákupy", examples: "Cola, Costco" },
  {
    id: "tech",
    icon: "📱",
    label: "Technologie",
    examples: "Apple, Google",
  },
  {
    id: "health",
    icon: "💊",
    label: "Zdraví a léky",
    examples: "Pfizer",
  },
  {
    id: "energy",
    icon: "⚡",
    label: "Energie a Ropa",
    examples: "Shell",
  },
  {
    id: "finance",
    icon: "💳",
    label: "Banky a Peníze",
    examples: "Visa",
  },
  {
    id: "industry",
    icon: "🏗️",
    label: "Stroje a stavby",
    examples: "Caterpillar",
  },
]

interface StepSectorsProps {
  selected: string[]
  onToggle: (id: string) => void
}

export function StepSectors({ selected, onToggle }: StepSectorsProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl text-balance">
          Čemu rozumíš?
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          Warren Buffett říká: Investuj jen do toho, co znáš. Vyber oblasti,
          které ti jsou blízké:
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {sectors.map((sector) => {
          const isSelected = selected.includes(sector.id)
          return (
            <button
              key={sector.id}
              onClick={() => onToggle(sector.id)}
              className={cn(
                "relative flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-5 text-center backdrop-blur-md transition-all duration-200 hover:bg-white/10",
                isSelected &&
                  "border-blue-500/60 bg-blue-500/10 ring-1 ring-blue-500/30 hover:bg-blue-500/15"
              )}
            >
              <span className="text-2xl sm:text-3xl">{sector.icon}</span>
              <span className="text-sm font-semibold text-foreground">
                {sector.label}
              </span>
              <span
                className={cn(
                  "text-xs",
                  isSelected ? "text-blue-400" : "text-muted-foreground"
                )}
              >
                ({sector.examples})
              </span>
              <div
                className={cn(
                  "absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full border transition-all",
                  isSelected
                    ? "border-blue-500 bg-blue-500"
                    : "border-white/20 bg-transparent"
                )}
              >
                {isSelected && (
                  <svg
                    className="h-2.5 w-2.5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
