// components/daily-report-card.tsx
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, TrendingUp, AlertCircle, RefreshCw } from "lucide-react"

interface DailyReportCardProps {
  refreshKey?: number
}

interface InsightItem {
  id: string
  type: "pattern" | "warning"
  title: string
  description: string
}

interface DailyReport {
  insights: InsightItem[]
  ok: boolean
}

export function DailyReportCard({ refreshKey }: DailyReportCardProps) {
  const [report, setReport] = useState<DailyReport | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true)
      try {
        const res = await fetch("/api/ai/insights")
        const data = await res.json()
        setReport(data)
      } catch {
        setReport({ ok: false, insights: [] })
      } finally {
        setLoading(false)
      }
    }
    fetchReport()
  }, [refreshKey])

  if (loading) {
    return (
      <Card className="border-0 shadow-soft-md bg-gradient-to-br from-[var(--ai-accent)]/[0.05] to-[var(--ai-accent)]/[0.08]">
        <CardContent className="p-5">
          <div className="flex gap-3 items-center">
            <div className="w-9 h-9 rounded-xl bg-[var(--ai-accent)]/15 flex items-center justify-center">
              <RefreshCw className="w-4 h-4 text-[var(--ai-accent)] animate-spin" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">AI Insight</p>
              <p className="text-xs text-muted-foreground">Menganalisis data keuanganmu...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const insights = report?.insights ?? []

  if (insights.length === 0) {
    return (
      <Card className="border-0 shadow-soft-md bg-gradient-to-br from-[var(--ai-accent)]/[0.05] to-[var(--ai-accent)]/[0.08]">
        <CardContent className="p-5">
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--ai-accent)]/15 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[var(--ai-accent)]" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground mb-1">AI Insight hari ini</p>
              <p className="text-sm text-muted-foreground">
                Belum ada pola terdeteksi. Catat transaksimu dulu biar AI bisa analisis! 💡
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Ambil insight paling relevan — warning duluin, max 2
  const sorted = [...insights].sort((a, b) =>
    a.type === "warning" ? -1 : b.type === "warning" ? 1 : 0
  ).slice(0, 2)

  return (
    <div className="space-y-3">
      <h3 className="text-[0.7rem] font-black text-foreground/60 uppercase tracking-[0.12em] px-1">
        AI Insight Hari Ini
      </h3>
      {sorted.map((insight) => {
        const isWarning = insight.type === "warning"
        const Icon = isWarning ? AlertCircle : TrendingUp
        const colorClass = isWarning
          ? "text-orange-500 bg-orange-500/10"
          : "text-[var(--ai-accent)] bg-[var(--ai-accent)]/10"
        const cardBg = isWarning
          ? "from-orange-500/[0.03] to-orange-500/[0.06]"
          : "from-[var(--ai-accent)]/[0.03] to-[var(--ai-accent)]/[0.06]"

        return (
          <Card
            key={insight.id}
            className={`border-0 shadow-soft-md bg-gradient-to-br ${cardBg}`}
          >
            <CardContent className="p-5">
              <div className="flex gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-foreground mb-1">{insight.title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {insight.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}