// components/financial-report-card.tsx
"use client"

import { useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { formatRupiah } from "@/lib/format"

interface Transaction {
  amount: number
  type: string
  category?: string
  created_at?: string
}

interface FinancialReportCardProps {
  transactions: Transaction[]
  loading?: boolean
}

export function FinancialReportCard({ transactions, loading }: FinancialReportCardProps) {
  const [mode, setMode] = useState<"daily" | "monthly">("daily")
  const [expanded, setExpanded] = useState(false)

  const filtered = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10)
    const thisMonth = new Date().toISOString().slice(0, 7)
    return transactions.filter(t =>
      mode === "daily"
        ? (t.created_at ?? "").slice(0, 10) === today
        : (t.created_at ?? "").slice(0, 7) === thisMonth
    )
  }, [transactions, mode])

  const { income, expense, net, topCategories } = useMemo(() => {
    let income = 0, expense = 0
    const catMap: Record<string, number> = {}

    for (const t of filtered) {
      if (t.type === "income") income += t.amount
      if (t.type === "expense") {
        expense += t.amount
        if (t.category) catMap[t.category] = (catMap[t.category] ?? 0) + t.amount
      }
    }

    const topCategories = Object.entries(catMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)

    return { income, expense, net: income - expense, topCategories }
  }, [filtered])

  const savingsRate = income > 0 ? Math.round((net / income) * 100) : 0
  const isHealthy = net >= 0

  return (
    <div className="space-y-0">
      {/* Header toggle */}
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-[0.7rem] font-black text-foreground/60 uppercase tracking-[0.12em]">
          Laporan Keuangan
        </h3>
        <div className="flex gap-1">
          {(["daily", "monthly"] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1 text-[0.65rem] font-bold rounded-full transition-all ${
                mode === m
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {m === "daily" ? "Harian" : "Bulanan"}
            </button>
          ))}
        </div>
      </div>

      <Card className="border-0 shadow-soft-md bg-card overflow-hidden">
        <CardContent className="p-0">
          {/* Summary row — always visible */}
          <button
            onClick={() => setExpanded(e => !e)}
            className="w-full p-5 flex items-center justify-between"
          >
            <div className="flex gap-6 text-left">
              <div>
                <p className="text-[0.6rem] font-bold text-muted-foreground uppercase tracking-wide mb-0.5">
                  Pemasukan
                </p>
                <p className="text-sm font-bold text-emerald-500">
                  {loading ? "—" : formatRupiah(income)}
                </p>
              </div>
              <div>
                <p className="text-[0.6rem] font-bold text-muted-foreground uppercase tracking-wide mb-0.5">
                  Pengeluaran
                </p>
                <p className="text-sm font-bold text-red-400">
                  {loading ? "—" : formatRupiah(expense)}
                </p>
              </div>
              <div>
                <p className="text-[0.6rem] font-bold text-muted-foreground uppercase tracking-wide mb-0.5">
                  Net
                </p>
                <p className={`text-sm font-bold ${isHealthy ? "text-accent" : "text-red-500"}`}>
                  {loading ? "—" : formatRupiah(net)}
                </p>
              </div>
            </div>
            <div className="text-muted-foreground">
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {/* Expanded detail */}
          {expanded && (
            <div className="px-5 pb-5 space-y-4 border-t border-border/50 pt-4">
              
              {/* Health indicator */}
              <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold ${
                isHealthy ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-500"
              }`}>
                {isHealthy
                  ? <TrendingUp className="w-4 h-4" />
                  : <TrendingDown className="w-4 h-4" />
                }
                {income === 0 && expense === 0
                  ? "Belum ada transaksi"
                  : isHealthy
                    ? `Keuangan sehat — hemat ${savingsRate}% dari pemasukan`
                    : `Pengeluaran melebihi pemasukan ${Math.abs(savingsRate)}%`
                }
              </div>

              {/* Top categories */}
              {topCategories.length > 0 && (
                <div>
                  <p className="text-[0.65rem] font-black text-foreground/50 uppercase tracking-wide mb-2">
                    Top Pengeluaran
                  </p>
                  <div className="space-y-2">
                    {topCategories.map(([cat, amt]) => {
                      const pct = expense > 0 ? Math.round((amt / expense) * 100) : 0
                      return (
                        <div key={cat}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-semibold text-foreground/80">{cat}</span>
                            <span className="text-muted-foreground">{formatRupiah(amt)} · {pct}%</span>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-accent rounded-full transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {topCategories.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-2">
                  {mode === "daily" ? "Belum ada pengeluaran hari ini" : "Belum ada pengeluaran bulan ini"}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}