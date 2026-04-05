const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://vestprimer-api.onrender.com"
const PARTNER_KEY = process.env.NEXT_PUBLIC_PARTNER_KEY ?? ""

function apiHeaders(): HeadersInit {
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (PARTNER_KEY) headers["X-Partner-Key"] = PARTNER_KEY
  return headers
}

export async function fetchRecommendations(data: {
  goal: string
  risk: string
  sectors: string[]
}) {
  const res = await fetch(`${API_URL}/api/recommend`, {
    method: "POST",
    headers: apiHeaders(),
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(`API error ${res.status}`)
  return res.json()
}

export async function fetchPortfolio(
  items: Array<{ ticker: string; ks: number; buy_price_usd: number }>
) {
  const res = await fetch(`${API_URL}/api/portfolio`, {
    method: "POST",
    headers: apiHeaders(),
    body: JSON.stringify(items),
  })
  if (!res.ok) throw new Error(`API error ${res.status}`)
  return res.json()
}
