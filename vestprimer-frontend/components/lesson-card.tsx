"use client"

import { useState, useRef, useCallback } from "react"
import Image from "next/image"
import { Search, ChevronDown, ChevronUp, Lightbulb, Check } from "lucide-react"
import { StoryProgressBar } from "./story-progress-bar"

interface LessonCardProps {
  progress: number
  totalSegments: number
  onAdvance: () => void
}

export function LessonCard({ progress, totalSegments, onAdvance }: LessonCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const detailRef = useRef<HTMLDivElement>(null)

  const handleToggle = useCallback(() => {
    setExpanded((prev) => !prev)
  }, [])

  const handleAdvance = useCallback(() => {
    if (confirmed || progress >= totalSegments) return
    setConfirmed(true)
    setTimeout(() => {
      onAdvance()
      setConfirmed(false)
      setExpanded(false)
    }, 600)
  }, [confirmed, progress, totalSegments, onAdvance])

  const isComplete = progress >= totalSegments

  return (
    <div className="relative">
      {/* Glow effect behind card */}
      <div className="absolute -inset-4 rounded-[2.5rem] bg-trust-blue/10 blur-2xl" />

      {/* Main card */}
      <div
        className="relative overflow-hidden rounded-3xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] shadow-2xl backdrop-blur-xl"
        style={{
          boxShadow:
            "0 25px 60px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.1)",
        }}
      >
        {/* Progress bar */}
        <div className="px-5 pt-5">
          <StoryProgressBar segments={totalSegments} current={progress} />
        </div>

        {/* Pizza illustration */}
        <div className="relative mx-auto flex items-center justify-center px-6 py-6">
          <div className="relative h-48 w-48">
            {/* Glow behind pizza */}
            <div className="absolute inset-0 rounded-full bg-trust-blue/20 blur-3xl" />
            <Image
              src="/images/pizza-slice-3d.jpg"
              alt="3D ilustrace kusu pizzy - analogie k deleni akcii"
              fill
              className="relative z-10 rounded-2xl object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </div>

        {/* Card content */}
        <div className="px-6 pb-6">
          {/* Title */}
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-foreground">
            {"Teorie Pizzy"}
          </h2>

          {/* Explanation text */}
          <p className="mb-6 text-[15px] leading-relaxed text-muted-foreground">
            {"Kdyz rozkrajis pizzu na 10 dilku misto 4, neni najednou vetsi. Stejne tak akcie za 50 Kc neni levnejsi nez akcie za 500 Kc."}
          </p>

          {/* Action buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleAdvance}
              disabled={isComplete}
              className={`group relative w-full overflow-hidden rounded-2xl px-6 py-4 text-base font-semibold transition-all duration-300 active:scale-[0.97] ${
                confirmed
                  ? "bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.4)]"
                  : isComplete
                    ? "bg-[rgba(255,255,255,0.1)] text-muted-foreground"
                    : "bg-trust-blue text-primary-foreground hover:bg-trust-blue-light hover:shadow-[0_0_30px_rgba(37,99,235,0.4)]"
              }`}
              style={{
                transform: confirmed ? "scale(1.02)" : undefined,
                transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {confirmed ? (
                  <>
                    <Check className="h-5 w-5 text-primary-foreground" />
                    <span className="text-primary-foreground">{"Super!"}</span>
                  </>
                ) : isComplete ? (
                  <span>{"Kurz dokoncen!"}</span>
                ) : (
                  <span>{"Aha, chapu!"}</span>
                )}
              </span>
              {!confirmed && !isComplete && (
                <div className="absolute inset-0 -translate-x-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)] transition-transform duration-700 group-hover:translate-x-full" />
              )}
            </button>

            <button
              onClick={handleToggle}
              className={`flex w-full items-center justify-center gap-2 rounded-2xl border px-6 py-3.5 text-sm font-medium transition-all duration-300 active:scale-[0.97] ${
                expanded
                  ? "border-trust-blue/30 bg-trust-blue/10 text-trust-blue-light"
                  : "border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.04)] text-muted-foreground hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.08)] hover:text-foreground"
              }`}
              aria-expanded={expanded}
              aria-controls="detail-panel"
            >
              <Search className="h-4 w-4" />
              <span>{"Podrobneji"}</span>
              <ChevronDown
                className="h-4 w-4 transition-transform duration-300"
                style={{
                  transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </button>
          </div>

          {/* Expandable detail panel */}
          <div
            id="detail-panel"
            ref={detailRef}
            className="overflow-hidden transition-all duration-500 ease-out"
            style={{
              maxHeight: expanded ? "300px" : "0px",
              opacity: expanded ? 1 : 0,
              marginTop: expanded ? "16px" : "0px",
              transition:
                "max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease, margin-top 0.4s ease",
            }}
          >
            <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-5 backdrop-blur-sm">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-trust-blue/20">
                  <Lightbulb className="h-3.5 w-3.5 text-trust-blue-light" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-trust-blue-light">
                  {"Detailni vysvetleni"}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {"Muzes kupovat i zlomky akcii. Dulezite je financni zdravi firmy, ne cena jedne akcie. Zalezi, jaky kus firmy celkove kupujes."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
