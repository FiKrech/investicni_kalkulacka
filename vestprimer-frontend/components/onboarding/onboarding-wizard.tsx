"use client"

import { useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import { StepGoals } from "./step-goals"
import { StepRisk } from "./step-risk"
import { StepSectors } from "./step-sectors"
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react"

const STEPS = [
  { number: 1, label: "Cíle" },
  { number: 2, label: "Riziko" },
  { number: 3, label: "Sektory" },
]

export function OnboardingWizard({ onComplete }: { onComplete: (data: any) => void }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [goal, setGoal] = useState<string | null>(null)
  const [risk, setRisk] = useState<string | null>(null)
  const [sectors, setSectors] = useState<string[]>([])

  const handleToggleSector = useCallback((id: string) => {
    setSectors((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }, [])

  const canProceed =
    (currentStep === 1 && goal !== null) ||
    (currentStep === 2 && risk !== null) ||
    (currentStep === 3 && sectors.length > 0)

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep((s) => s + 1)
    } else {
      // Posíláme data do hlavní aplikace a přepínáme obrazovku!
      onComplete({ goal, risk, sectors })
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col px-4 py-8 sm:px-6 sm:py-12">
      {/* Step indicator */}
      <div className="mb-8 sm:mb-10">
        <div className="flex items-center justify-between gap-2">
          {STEPS.map((step, idx) => (
            <div key={step.number} className="flex flex-1 items-center gap-2">
              <div className="flex flex-1 flex-col items-center gap-2">
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold transition-all duration-300",
                    currentStep === step.number
                      ? "border-blue-500 bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                      : currentStep > step.number
                        ? "border-blue-500/50 bg-blue-500/20 text-blue-400"
                        : "border-white/15 bg-white/5 text-muted-foreground"
                  )}
                >
                  {currentStep > step.number ? (
                    <svg
                      className="h-4 w-4"
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
                  ) : (
                    step.number
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium transition-colors",
                    currentStep === step.number
                      ? "text-blue-400"
                      : currentStep > step.number
                        ? "text-blue-400/60"
                        : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div
                  className={cn(
                    "mb-6 h-px flex-1 transition-colors duration-300",
                    currentStep > step.number
                      ? "bg-blue-500/40"
                      : "bg-white/10"
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1">
        <div
          className={cn(
            "transition-all duration-300",
            "animate-in fade-in slide-in-from-right-4"
          )}
          key={currentStep}
        >
          {currentStep === 1 && (
            <StepGoals selected={goal} onSelect={setGoal} />
          )}
          {currentStep === 2 && (
            <StepRisk selected={risk} onSelect={setRisk} />
          )}
          {currentStep === 3 && (
            <StepSectors selected={sectors} onToggle={handleToggleSector} />
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex items-center gap-3 sm:mt-10">
        <button
          onClick={handleBack}
          disabled={currentStep === 1}
          className={cn(
            "flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium backdrop-blur-md transition-all duration-200",
            currentStep === 1
              ? "cursor-not-allowed text-muted-foreground opacity-40"
              : "text-foreground hover:bg-white/10"
          )}
        >
          <ArrowLeft className="h-4 w-4" />
          Zpět
        </button>
        <button
          onClick={handleNext}
          disabled={!canProceed}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200",
            canProceed
              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25 hover:bg-blue-500"
              : "cursor-not-allowed bg-blue-600/30 text-blue-300/50"
          )}
        >
          {currentStep === 3 ? (
            <>
              <Sparkles className="h-4 w-4" />
              {"🎉 Ukázat můj plán"}
            </>
          ) : (
            <>
              Dále
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  )
}