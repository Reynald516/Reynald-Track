// lib/insights.engine.ts

export interface Insight {
  id: string
  type: "pattern" | "warning"
  title: string
  description: string
}

type Transaction = {
  amount: number
  category: string
  date: string
  type: string
}

export function generateInsights(transactions: Transaction[]): Insight[] {
  const insights: Insight[] = []

  if (!transactions || transactions.length === 0) {
    return insights
  }

  // =========================
  // 1️⃣ Pola pengeluaran akhir pekan (REAL)
  // =========================
  const weekendFood = transactions.filter(t => {
    const day = new Date(t.date).getDay()
    const isWeekend = day === 0 || day === 6

    return (
      t.type.toLowerCase() === "expense" &&
      t.category === "Makanan & Minuman" &&
      isWeekend
    )
  })

  if (weekendFood.length > 0) {
    insights.push({
      id: "weekend-food",
      type: "pattern",
      title: "Pola Pengeluaran Terdeteksi",
      description:
        "Pengeluaran makanan cenderung naik di akhir pekan. Pertimbangkan meal prep untuk menghemat.",
    })
  }

  // =========================
  // 2️⃣ Transport warning
  // =========================
  const transportTotal = transactions
    .filter(t => t.type.toLowerCase() === "expense")
    .filter(t => t.category === "Transport")
    .reduce((sum, t) => sum + Number(t.amount), 0)

  if (transportTotal > 1000000) {
    insights.push({
      id: "transport-warning",
      type: "warning",
      title: "Budget Transport Perlu Perhatian",
      description:
        "Pengeluaran transportmu sudah cukup besar bulan ini. Pertimbangkan alternatif yang lebih hemat.",
    })
  }

  return insights
}