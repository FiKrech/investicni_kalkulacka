import { Shield } from "lucide-react"

export function AkademieHeader() {
  return (
    <header className="px-6 pb-4 pt-14">
      <div className="flex items-start gap-3">
        <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-trust-blue/15">
          <Shield className="h-5 w-5 text-trust-blue-light" strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-balance text-[22px] font-bold leading-tight tracking-tight text-foreground">
            {"Rychlokurz."}
            <br />
            <span className="text-glow-white">
              {"3 minuty pro větší bezpečí."}
            </span>
          </h1>
        </div>
      </div>
    </header>
  )
}
