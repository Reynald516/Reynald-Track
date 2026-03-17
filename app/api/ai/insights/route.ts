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

    // 1. Coba RTR Engine dulu
    try {
      const rtrRes = await fetch(`${RTR_BASE_URL}/run-daily/${user.id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(10000),
      })

      if (rtrRes.ok) {
        const rtrData = await rtrRes.json()
        const insight = rtrData?.insight

        // Cek patterns array (format lama)
        const rawPatterns = insight?.patterns ?? []
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

        // Fallback: generate dari field user_insights yang tersedia
        if (insight) {
          const insights = generateInsightsFromUserInsights(insight)
          if (insights.length > 0) {
            return NextResponse.json({ ok: true, insights })
          }
        }
      }
    } catch {
      // RTR Engine lambat/mati, lanjut ke fallback Supabase
    }

    // 2. Fallback: baca langsung dari Supabase (transactions saja)
    const { data: txData } = await supabase
      .from("transactions")
      .select("amount, type, category, created_at, date")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(100)

    const insights = generateInsightsFromTransactions(txData ?? [])

    return NextResponse.json({ ok: true, insights })
  } catch (err) {
    console.error("AI INSIGHTS ERROR:", err)
    return NextResponse.json({ ok: false, insights: [] })
  }
}

// Generate insight cards dari data user_insights (field RTR Engine)
function generateInsightsFromUserInsights(insight: any): any[] {
  const insights: any[] = []

  const totalIncome = Number(insight?.total_income ?? 0)
  const totalExpense = Number(insight?.total_expense ?? 0)
  const netCashflow = Number(insight?.net_cashflow ?? 0)
  const dominantCategory = insight?.dominant_category
  const riskLevel = insight?.risk_level
  const behaviorProfile = insight?.behavior_profile
  const habitWarning = insight?.habit_warning
  const isAnomaly = insight?.is_anomaly

  if (isAnomaly) {
    insights.push({
      id: "anomaly",
      type: "warning",
      title: "Transaksi Tidak Biasa Terdeteksi",
      description: "Ada pola transaksi yang tidak biasa bulan ini. Periksa kembali pengeluaranmu.",
    })
  }

  if (habitWarning) {
    insights.push({
      id: "habit-warning",
      type: "warning",
      title: "Peringatan Kebiasaan",
      description: habitWarning,
    })
  }

  if (behaviorProfile) {
    insights.push({
      id: "behavior-profile",
      type: "pattern",
      title: "Profil Keuanganmu",
      description: behaviorProfile,
    })
  }

  if (dominantCategory && totalExpense > 0) {
    insights.push({
      id: "dominant-category",
      type: "pattern",
      title: "Pola Pengeluaran Terdeteksi",
      description: `Pengeluaran terbesar kamu ada di kategori ${dominantCategory}. Total pengeluaran: Rp ${totalExpense.toLocaleString("id-ID")}.`,
    })
  }

  if (riskLevel === "HIGH" || riskLevel === "CRITICAL") {
    insights.push({
      id: "risk-level",
      type: "warning",
      title: "Risiko Keuangan Perlu Perhatian",
      description: `Level risiko keuanganmu saat ini: ${riskLevel}. Sebaiknya tinjau pengeluaranmu segera.`,
    })
  }

  if (totalIncome > 0 && totalExpense > totalIncome) {
    insights.push({
      id: "overspending",
      type: "warning",
      title: "Pengeluaran Melebihi Pemasukan",
      description: `Pengeluaran kamu (Rp ${totalExpense.toLocaleString("id-ID")}) melebihi pemasukan (Rp ${totalIncome.toLocaleString("id-ID")}). Perlu evaluasi segera.`,
    })
  } else if (totalIncome > 0 && netCashflow > 0) {
    const savingsRate = Math.round((netCashflow / totalIncome) * 100)
    insights.push({
      id: "savings",
      type: "pattern",
      title: "Kondisi Keuangan Sehat",
      description: `Kamu berhasil menyisihkan sekitar ${savingsRate}% dari pemasukan bulan ini. Pertahankan!`,
    })
  }

  return insights
}

// Generate insight dari raw transactions (tanpa RTR Engine)
function generateInsightsFromTransactions(transactions: any[]): any[] {
  const insights: any[] = []

  const totalIncome = transactions
    .filter(t => t.type?.toLowerCase() === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const totalExpense = transactions
    .filter(t => t.type?.toLowerCase() === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0)

  if (totalIncome === 0 && totalExpense === 0) return insights

  const categoryMap: Record<string, number> = {}
  transactions
    .filter(t => t.type?.toLowerCase() === "expense")
    .forEach(t => {
      if (t.category) categoryMap[t.category] = (categoryMap[t.category] ?? 0) + Number(t.amount)
    })

  const dominantCategory = Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0]?.[0]

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
      description: `Pengeluaran (Rp ${totalExpense.toLocaleString("id-ID")}) melebihi pemasukan (Rp ${totalIncome.toLocaleString("id-ID")}). Perlu evaluasi segera.`,
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
      description: `Pengeluaran transport sudah Rp ${transportTotal.toLocaleString("id-ID")}. Pertimbangkan alternatif lebih hemat.`,
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