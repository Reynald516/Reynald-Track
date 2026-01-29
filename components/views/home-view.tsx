"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppHeader } from "@/components/app-header"
import { PrimaryActionCard } from "@/components/primary-action-card"
import { SummaryCard } from "@/components/summary-card"
import { AIInsightCard } from "@/components/ai-insight-card"
import { Card, CardContent } from "@/components/ui/card"
import { useTransactions } from "@/hooks/use-transaction";
import { formatRupiah } from "@/lib/format"
import { useMemo } from "react";
import {
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
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

interface HomeViewProps {
  isDarkMode: boolean
  onToggleTheme: () => void
}

export function HomeView({ isDarkMode, onToggleTheme }: HomeViewProps) {
  const [timeRange, setTimeRange] = useState<"daily" | "monthly">("daily")
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
      t => (t.date ?? "").slice(0, 10) === today
    )
  }

  if (timeRange === "monthly") {
    return transactions.filter(
      t => (t.date ?? "").slice(0, 7) === thisMonth
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

  function stableHeight(i: number) {
  return 20 + ((i * 17) % 60) // hasil selalu sama
  }

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

  const quickActions = [
    { icon: Camera, label: "Scan Struk", href: "/features/scan-receipt" },
    { icon: Zap, label: "CTR", href: "/features/quick-capture" },
    { icon: Camera, label: "Buka Kamera", href: "/features/scan-receipt" },
    { icon: Flame, label: "Streak & Habit", href: "/features/streak-habit" },
    { icon: Target, label: "Goals / Target", href: "/features/goals" },
    { icon: FileBarChart, label: "Reports", href: "/features/reports" },
    { icon: Download, label: "Export", href: "/features/export" },
    { icon: CreditCard, label: "Subscriptions", href: "/features/subscriptions" },
    { icon: Tags, label: "Smart Categories", href: "/features/smart-categories" },
    { icon: MessageSquare, label: "AI Coach", href: "/features/ai-coach" },
  ]

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
        <section>
          <h3 className="text-[0.7rem] font-black text-foreground/60 uppercase tracking-[0.12em] mb-4 px-1">
            Quick Actions
          </h3>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-5 px-5">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <button
                  key={index}
                  onClick={() => router.push(action.href)}
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

        <section>
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
              <div className="h-36 flex items-end justify-between gap-1.5">
                {Array.from({ length: 14 }).map((_, i) => {
                  const height = stableHeight(i)
                  const isToday = i === 13
                  return (
                    <div
                      key={i}
                      className={`flex-1 rounded-t-lg transition-smooth hover:opacity-80 ${
                        isToday ? "bg-accent shadow-soft-sm" : "bg-muted-foreground/15"
                      }`}
                      style={{
                        height: `${height}%`,
                        minHeight: "8px",
                      }}
                    />
                  )
                })}
              </div>
              <p className="text-[0.7rem] text-center text-muted-foreground mt-4 font-semibold tracking-wide opacity-60">
                {timeRange === "daily" ? "14 hari terakhir" : "12 bulan terakhir"}
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="py-4">
          <PrimaryActionCard
            icon={Sparkles}
            title="Catat hari ini"
            subtitle="Mood + transaksi, 30 detik"
            buttonText="Mulai Catat"
            onAction={handleStartLog}
          />
        </section>

        <section>
          <h3 className="text-[0.7rem] font-black text-foreground/60 uppercase tracking-[0.12em] mb-4 px-1">
            Ringkasan Hari Ini
          </h3>
          <div className="grid gap-3">
            <SummaryCard
              icon={ArrowDownRight}
              label="Pemasukan"
              value={loading ? "—" : formatRupiah(income)}
              variant="income"
            />
            
            <SummaryCard
              icon={ArrowUpRight}
              label="Pengeluaran"
              value={loading ? "—" : formatRupiah(expense)}
              variant="expense"
            />
            
            <SummaryCard
              icon={Wallet}
              label="Net"
              value={loading ? "—" : formatRupiah(net)}
              variant="neutral"
            />
          </div>
        </section>

        <section>
          <AIInsightCard
            title="AI Insight hari ini"
            message="Belum ada pola yang terdeteksi. Catat transaksimu untuk mendapat insight personal."
          />
        </section>
      </div>
    </div>
  )
}