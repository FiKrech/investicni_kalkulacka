"use client"

interface StoryProgressBarProps {
  segments: number
  current: number
}

export function StoryProgressBar({ segments, current }: StoryProgressBarProps) {
  return (
    <div className="flex gap-1.5" role="progressbar" aria-valuenow={current} aria-valuemin={0} aria-valuemax={segments} aria-label={`Lekce ${current} z ${segments}`}>
      {Array.from({ length: segments }).map((_, i) => (
        <div
          key={i}
          className="relative h-1.5 flex-1 overflow-hidden rounded-full"
        >
          <div className="absolute inset-0 rounded-full bg-[rgba(255,255,255,0.12)]" />
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-trust-blue-light"
            style={{
              width: i < current ? "100%" : "0%",
              transition: "width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
              boxShadow: i === current - 1 ? "0 0 10px rgba(59, 130, 246, 0.7), 0 0 4px rgba(59, 130, 246, 0.4)" : "none",
            }}
          />
        </div>
      ))}
    </div>
  )
}
