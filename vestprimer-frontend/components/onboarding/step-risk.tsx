"use client"

import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const options = [
  {
    id: "panic",
    icon: "😱",
    label: "Zpanikařím a všechno prodám.",
  },
  {
    id: "calm",
    icon: "😐",
    label: "Nic. Vím, že to zase vyroste.",
  },
  {
    id: "excited",
    icon: "🤩",
    label: "Mám radost! Nakoupím víc ve slevě.",
  },
]

interface StepRiskProps {
  selected: string | null
  onSelect: (id: string) => void
}

export function StepRisk({ selected, onSelect }: StepRiskProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl text-balance">
          Jak zvládáš stres?
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          Investoval jsi 10 000 Kč. Ráno se vzbudíš a máš tam jen 8 000 Kč. Co
          uděláš?
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            className={cn(
              "relative flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-left backdrop-blur-md transition-all duration-200 hover:bg-white/10",
              selected === option.id &&
                "border-blue-500/60 bg-blue-500/10 ring-1 ring-blue-500/30 hover:bg-blue-500/15"
            )}
          >
            <span className="text-2xl sm:text-3xl">{option.icon}</span>
            <span className="flex-1 text-sm font-medium text-foreground sm:text-base">
              {option.label}
            </span>
            <div
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all",
                selected === option.id
                  ? "border-blue-500 bg-blue-500"
                  : "border-white/20 bg-transparent"
              )}
            >
              {selected === option.id && (
                <svg
                  className="h-3 w-3 text-white"
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
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
        <Accordion type="single" collapsible>
          <AccordionItem value="benzin" className="border-b-0">
            <AccordionTrigger className="px-4 text-sm text-muted-foreground hover:text-foreground hover:no-underline">
              <span>
                {"⛽ Proč červená čísla nevadí? (Teorie Benzínu)"}
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-4 text-sm leading-relaxed text-muted-foreground">
              Když zlevní benzín, taky nepanikaříš, ale natankuješ plnou. U
              akcií je pokles ceny vlastně výprodej.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
