// components/views/home-view.tsx

"use client"

import { ScanOverlay } from "@/components/scan/scan-overlay"
import { FinancialReportCard } from "@/components/financial-report-card"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppHeader } from "@/components/app-header"
import { PrimaryActionCard } from "@/components/primary-action-card"
import { DailyReportCard } from "@/components/daily-report-card"
import { Card, CardContent } from "@/components/ui/card"
import { useTransactions } from "@/hooks/use-transaction";
import { formatRupiah } from "@/lib/format"
import { useMemo } from "react";
import {
  Sparkles,
  Camera,
  Zap,
  Flame,
  Target,
  FileBarChart,
  Download,
  CreditCard,
  Tags,
  MessageSquare,
} from "lucide-react"

type QuickAction = {
  icon: any
  label: string
  href?: string
  action?: string
}

interface HomeViewProps {
  isDarkMode: boolean
  onToggleTheme: () => void
  refreshKey?: number
}

export function HomeView({ isDarkMode, onToggleTheme, refreshKey }: HomeViewProps) {
  const [timeRange, setTimeRange] = useState<"daily" | "monthly">("daily")
  const [selectedBar, setSelectedBar] = useState<number | null>(null)
  const router = useRouter()

  const { transactions, loading, refresh, error } = useTransactions()

  useEffect(() => {
    console.log("HOME transactions:", transactions)
    console.log("HOME error:", error)
    console.log("HOME loading:", loading)
  }, [transactions, error, loading])

  const filteredTransactions = useMemo(() => {
  if (!transactions || transactions.length === 0) return []

  const today = new Date().toISOString().slice(0, 10)      // YYYY-MM-DD
  const thisMonth = new Date().toISOString().slice(0, 7)   // YYYY-MM

  if (timeRange === "daily") {
    return transactions.filter(
      (t) => (t.created_at ?? "").slice(0, 10) === today
    )
  }

  if (timeRange === "monthly") {
    return transactions.filter(
      t => (t.created_at ?? "").slice(0, 7) === thisMonth
    )
  }

  return transactions
}, [transactions, timeRange])

  const { income, expense, net } = useMemo(() => {
    let income = 0
    let expense = 0
    
    for (const t of filteredTransactions) {
      if (t.type === "income") income += t.amount
      if (t.type === "expense") expense += t.amount
    }
    
    return {
      income,
      expense,
      net: income - expense,
    }
  }, [filteredTransactions])
  
  const chartData = useMemo(() => {
  const days = 14
  const result = []
  const today = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const dateStr = d.toISOString().slice(0, 10)
    const dayLabel = d.toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" })
    const dayTxs = (transactions ?? []).filter(t => (t.created_at ?? "").slice(0, 10) === dateStr)
    const dayExpense = dayTxs.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0)
    const dayIncome = dayTxs.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0)
    result.push({ dateStr, dayLabel, expense: dayExpense, income: dayIncome, isToday: i === 0 })
  }
  return result
}, [transactions])

const maxVal = useMemo(() => Math.max(...chartData.map(d => d.expense + d.income), 1), [chartData])

  const [formattedDate, setFormattedDate] = useState("")
  
  useEffect(() => {
    refresh()
    const today = new Date()
    setFormattedDate(
      today.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    )
  }, [])

  const handleStartLog = () => {
    router.push("/features/daily-log")
    router.refresh()
  }

  const quickActions: QuickAction[] = [
    { icon: Camera, label: "Scan Struk", action: "scan" },
    { icon: Zap, label: "CTR", href: "/features/quick-capture" },
    { icon: Flame, label: "Streak & Habit", href: "/features/streak-habit" },
    { icon: Target, label: "Goals / Target", href: "/features/goals" },
    { icon: FileBarChart, label: "Reports", href: "/features/reports" },
    { icon: Download, label: "Export", href: "/features/export" },
    { icon: CreditCard, label: "Subscriptions", href: "/features/subscriptions" },
    { icon: Tags, label: "Smart Categories", href: "/features/smart-categories" },
    { icon: MessageSquare, label: "AI Coach", href: "/features/ai-coach" },
  ]

  const [showScan, setShowScan] = useState(false)

  return (
    <div className="space-y-6 text-crisp">
      <AppHeader
        title="ReynaldTrack"
        subtitle={formattedDate || " "}
        isDarkMode={isDarkMode}
        onToggleTheme={onToggleTheme}
      />

      <div className="px-5 space-y-8 pt-6 pb-16">
        {/* Quick Actions section */}
        <section id="tutorial-quick-actions">
          <h3 className="text-[0.7rem] font-black text-foreground/60 uppercase tracking-[0.12em] mb-4 px-1">
            Quick Actions
          </h3>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-5 px-5">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <button
                  key={index}
                  onClick={() => {
                    if (action.action === "scan") {
                      setShowScan(true)
                    } else if (action.href) {
                      router.push(action.href)
                    }
                  }}
                  className="flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-xl bg-card shadow-soft hover:shadow-soft-md transition-smooth button-scale min-w-[72px]"
                >
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <span className="text-[0.65rem] font-semibold text-foreground/80 text-center leading-tight">
                    {action.label}
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        <section id="tutorial-cashflow">
          <div className="text-center mb-6">
            <p className="text-[0.65rem] text-muted-foreground font-bold uppercase tracking-[0.15em] mb-3 opacity-70">
              Cash Flow Hari Ini
            </p>
            <h2
              className="text-6xl font-bold text-foreground tracking-[-0.04em] leading-none mb-6"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {loading ? "—" : formatRupiah(net)}
            </h2>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setTimeRange("daily")}
                className={`px-5 py-2 text-xs font-bold rounded-full transition-smooth button-scale ${
                  timeRange === "daily"
                    ? "bg-accent text-accent-foreground shadow-soft-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/70"
                }`}
                aria-pressed={timeRange === "daily"}
              >
                Harian
              </button>
              <button
                onClick={() => setTimeRange("monthly")}
                className={`px-5 py-2 text-xs font-bold rounded-full transition-smooth button-scale ${
                  timeRange === "monthly"
                    ? "bg-accent text-accent-foreground shadow-soft-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/70"
                }`}
                aria-pressed={timeRange === "monthly"}
              >
                Bulanan
              </button>
            </div>
          </div>

          <Card className="border-0 shadow-soft-lg bg-card card-float overflow-hidden">
            <CardContent className="p-6">
              {selectedBar !== null && chartData[selectedBar] && (
                <div className="mb-4 px-4 py-3 rounded-xl bg-accent/10 border border-accent/20 animate-fade-in">
                  <p className="text-xs font-bold text-accent mb-1">{chartData[selectedBar].dayLabel}</p>
                  <div className="flex gap-4 text-xs text-foreground/80">
                    <span>📈 {formatRupiah(chartData[selectedBar].income)}</span>
                    <span>📉 {formatRupiah(chartData[selectedBar].expense)}</span>
                  </div>
                </div>
              )}
              <div className="h-36 flex items-end justify-between gap-1">
                {chartData.map((day, i) => {
                  const total = day.expense + day.income
                  const heightPct = total > 0 ? Math.max((total / maxVal) * 100, 8) : 8
                  const isSelected = selectedBar === i
                  return (
                    <button
                  key={i}
                  onClick={() => setSelectedBar(isSelected ? null : i)}
                  className={`flex-1 rounded-t-lg transition-all duration-200 ${
                    day.isToday ? "bg-accent shadow-soft-sm"
                    : isSelected ? "bg-accent/60"
                    : "bg-muted-foreground/15 hover:bg-muted-foreground/30"
                  }`}          
                style={{ height: `${heightPct}%`, minHeight: "8px" }}
              />
            )
          })}
          </div>
          <p className="text-[0.7rem] text-center text-muted-foreground mt-4 font-semibold tracking-wide opacity-60">
            {selectedBar !== null ? "Tap bar lagi untuk tutup" : "14 hari terakhir — tap untuk detail"}
          </p>
        </CardContent>
          </Card>
        </section>

        <section id="tutorial-daily-log" className="py-4">
          <PrimaryActionCard
            icon={Sparkles}
            title="Catat hari ini"
            subtitle="Mood + transaksi, 30 detik"
            buttonText="Mulai Catat"
            onAction={handleStartLog}
          />
        </section>

        <section>
          <FinancialReportCard transactions={transactions} loading={loading} />
        </section>
        
        <section>
          <DailyReportCard refreshKey={refreshKey} />
        </section>

        {showScan && (
          <ScanOverlay
            onClose={() => setShowScan(false)}
            onScanComplete={(result) => {
              setShowScan(false)
              sessionStorage.setItem("scan_result", JSON.stringify(result))
              router.push("/features/scan-confirm") // ← GANTI INI
            }}
          />
        )}
      </div>
    </div>
  )
}