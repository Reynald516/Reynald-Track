// app/api/ai/insights/route.ts

import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

const RTR_BASE_URL = process.env.RTR_ENGINE_URL!

export async function GET() {
  try {
    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const rtrRes = await fetch(`${RTR_BASE_URL}/run-daily/${user.id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })

    if (!rtrRes.ok) {
      return NextResponse.json({ ok: false, insights: [] })
    }

    const rtrData = await rtrRes.json()

    const rawPatterns = rtrData?.insight?.patterns ?? []

    const insights = rawPatterns
      .filter((p: any) => p?.description)
      .map((p: any, i: number) => ({
        id: p.type ?? `insight-${i}`,
        type:
          p.type === "ANOMALY" ||
          p.type === "BEHAVIOR_RISK" ||
          p.type === "INCOME_INSTABILITY" ||
          p.type === "HABIT_WARNING"
            ? "warning"
            : "pattern",
        title: mapPatternTitle(p.type),
        description: p.description,
      }))

    return NextResponse.json({ ok: true, insights })
  } catch (err) {
    console.error("AI INSIGHTS ERROR:", err)
    return NextResponse.json({ ok: false, insights: [] })
  }
}

function mapPatternTitle(type: string): string {
  const map: Record<string, string> = {
    SPENDING_DOMINANCE: "Pola Pengeluaran Terdeteksi",
    EXPENSE_TREND: "Tren Pengeluaran",
    HABIT_WARNING: "Peringatan Kebiasaan",
    BEHAVIOR_RISK: "Risiko Perilaku",
    INCOME_INSTABILITY: "Peringatan Pemasukan",
    ANOMALY: "Transaksi Tidak Biasa",
    USER_PROFILE: "Profil Keuangan",
    SPENDING_STYLE: "Gaya Pengeluaran",
    PATTERN_MEMORY: "Pola Historis",
  }
  return map[type] ?? "Insight Keuangan"
}