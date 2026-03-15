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

    // 1. Coba RTR Engine dulu (dengan timeout 10 detik)
    try {
      const rtrRes = await fetch(`${RTR_BASE_URL}/run-daily/${user.id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(10000),
      })

      if (rtrRes.ok) {
        const rtrData = await rtrRes.json()
        const rawPatterns = rtrData?.insight?.patterns ?? []

        if (rawPatterns.length > 0) {
          const insights = rawPatterns
            .filter((p: any) => p?.description)
            .map((p: any, i: number) => ({
              id: p.type ?? `insight-${i}`,
              type: ["ANOMALY", "BEHAVIOR_RISK", "INCOME_INSTABILITY", "HABIT_WARNING"].includes(p.type)
                ? "warning"
                : "pattern",
              title: mapPatternTitle(p.type),
              description: p.description,
            }))

          return NextResponse.json({ ok: true, insights })
        }
      }
    } catch {
      // RTR Engine lambat/mati, lanjut ke fallback
    }

    // 2. Fallback: baca langsung dari Supabase
    const [{ data: analysis }, { data: txData }] = await Promise.all([
      supabase
        .from("user_analysis")
        .select("*")
        .eq("user_id", user.id)
        .order("analysis_date", { ascending: false })
        .limit(1)
        .single(),
      supabase
        .from("transactions")
        .select("amount, type, category, created_at, date")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(100),
    ])

    const insights = generateLocalInsights(analysis, txData ?? [])

    return NextResponse.json({ ok: true, insights })
  } catch (err) {
    console.error("AI INSIGHTS ERROR:", err)
    return NextResponse.json({ ok: false, insights: [] })
  }
}

function generateLocalInsights(analysis: any, transactions: any[]): any[] {
  const insights: any[] = []

  const totalIncome = Number(analysis?.total_income ?? 0)
  const totalExpense = Number(analysis?.total_expense ?? 0)
  const dominantCategory = analysis?.dominant_category

  if (dominantCategory && totalExpense > 0) {
    insights.push({
      id: "dominant-category",
      type: "pattern",
      title: "Pola Pengeluaran Terdeteksi",
      description: `Pengeluaran terbesar kamu ada di kategori ${dominantCategory}. Total pengeluaran: Rp ${totalExpense.toLocaleString("id-ID")}.`,
    })
  }

  if (totalIncome > 0 && totalExpense > totalIncome) {
    insights.push({
      id: "overspending",
      type: "warning",
      title: "Pengeluaran Melebihi Pemasukan",
      description: `Pengeluaran kamu (Rp ${totalExpense.toLocaleString("id-ID")}) melebihi pemasukan (Rp ${totalIncome.toLocaleString("id-ID")}). Perlu evaluasi segera.`,
    })
  } else if (totalIncome > 0) {
    const savingsRate = Math.round(((totalIncome - totalExpense) / totalIncome) * 100)
    if (savingsRate > 0) {
      insights.push({
        id: "savings",
        type: "pattern",
        title: "Kondisi Keuangan Sehat",
        description: `Kamu berhasil menyisihkan sekitar ${savingsRate}% dari pemasukan. Pertahankan!`,
      })
    }
  }

  const transportTotal = transactions
    .filter(t => t.type?.toLowerCase() === "expense" && t.category === "Transport")
    .reduce((sum, t) => sum + Number(t.amount), 0)

  if (transportTotal > 500000) {
    insights.push({
      id: "transport-warning",
      type: "warning",
      title: "Budget Transport Perlu Perhatian",
      description: `Pengeluaran transportmu sudah Rp ${transportTotal.toLocaleString("id-ID")}. Pertimbangkan alternatif yang lebih hemat.`,
    })
  }

  const weekendFood = transactions.filter(t => {
    const day = new Date(t.date ?? t.created_at).getDay()
    return (
      t.type?.toLowerCase() === "expense" &&
      t.category === "Makanan & Minuman" &&
      (day === 0 || day === 6)
    )
  })

  if (weekendFood.length >= 2) {
    insights.push({
      id: "weekend-food",
      type: "pattern",
      title: "Pola Pengeluaran Akhir Pekan",
      description: "Pengeluaran makanan cenderung naik di akhir pekan. Pertimbangkan meal prep untuk menghemat.",
    })
  }

  return insights
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