"use client"

import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const goals = [
  {
    id: "dividenda",
    icon: "💸",
    title: "Pravidelná výplata",
    subtitle: "Dividenda",
    description: "Získávej pravidelný příjem z investic",
  },
  {
    id: "rust",
    icon: "🚀",
    title: "Budování velkého majetku",
    subtitle: "Růst",
    description: "Maximalizuj hodnotu svého portfolia",
  },
]

interface StepGoalsProps {
  selected: string | null
  onSelect: (id: string) => void
}

export function StepGoals({ selected, onSelect }: StepGoalsProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl text-balance">
          Co od peněz očekáváš?
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base">
          Vyber si svůj hlavní investiční cíl
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {goals.map((goal) => (
          <button
            key={goal.id}
            onClick={() => onSelect(goal.id)}
            className={cn(
              "group relative flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-md transition-all duration-200 hover:bg-white/10 sm:p-8",
              selected === goal.id &&
                "border-blue-500/60 bg-blue-500/10 ring-1 ring-blue-500/30 hover:bg-blue-500/15"
            )}
          >
            <span className="text-4xl sm:text-5xl">{goal.icon}</span>
            <div className="space-y-1">
              <p className="text-lg font-semibold text-foreground">
                {goal.title}
              </p>
              <p
                className={cn(
                  "text-sm font-medium",
                  selected === goal.id
                    ? "text-blue-400"
                    : "text-muted-foreground"
                )}
              >
                ({goal.subtitle})
              </p>
            </div>
            <p className="text-xs text-muted-foreground">{goal.description}</p>
            <div
              className={cn(
                "absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full border transition-all",
                selected === goal.id
                  ? "border-blue-500 bg-blue-500"
                  : "border-white/20 bg-transparent"
              )}
            >
              {selected === goal.id && (
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
          <AccordionItem value="pizza" className="border-b-0">
            <AccordionTrigger className="px-4 text-sm text-muted-foreground hover:text-foreground hover:no-underline">
              <span>{"🍕 Co když je akcie drahá? (Teorie Pizzy)"}</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 text-sm leading-relaxed text-muted-foreground">
              Neboj se ceny. Akcie za 50 Kč není levnější než ta za 2000 Kč.
              Záleží na tom, jak velký kus firmy (pizzy) kupuješ.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
