"use client"

import { useEffect, useMemo, useState } from "react"
import { AppHeader } from "@/components/app-header"
import { Card, CardContent } from "@/components/ui/card"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface BudgetViewProps {
  isDarkMode: boolean
  onToggleTheme: () => void
}

type BudgetRow = {
  category: string
  budget_amount: number
  spent_amount: number
}

export function BudgetView({ isDarkMode, onToggleTheme }: BudgetViewProps) {
  const [rows, setRows] = useState<BudgetRow[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // ===============================
  // FETCH BUDGET SUMMARY (AUTH SAFE)
  // ===============================
  useEffect(() => {
    const fetchBudget = async () => {
      setLoading(true)

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        console.warn("No user session yet")
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from("budget_summary")
        .select("category, budget_amount, spent_amount")
        .eq("user_id", user.id)
        
      if (error) {
        console.error("Budget fetch error:", error)
        setLoading(false)
        return
      }

      // 🔹 FILTER: kategori belum disetting (0 / 0) DIBUANG
      const filtered = (data ?? []).filter(
        r => !(r.budget_amount === 0 && r.spent_amount === 0)
      )

      setRows(filtered)
      setLoading(false)
    }

    fetchBudget()
  }, [])

  // ===============================
  // HITUNG TOTAL BULANAN
  // ===============================
  const monthlyBudget = useMemo(
    () => rows.reduce((sum, r) => sum + r.budget_amount, 0),
    [rows]
  )

  const totalSpent = useMemo(
    () => rows.reduce((sum, r) => sum + r.spent_amount, 0),
    [rows]
  )

  const remaining = monthlyBudget - totalSpent
  const spentPercentage =
    monthlyBudget === 0 ? 0 : (totalSpent / monthlyBudget) * 100

  // ===============================
  // CATEGORY MAPPING (PERSIS UI LAMA)
  // ===============================
  const categories = useMemo(() => {
    const iconMap: Record<string, string> = {
      Makanan: "🍽️",
      Transport: "🚗",
      Belanja: "🛍️",
      Entertainment: "🎮",
      Tagihan: "📄",
      Lainnya: "📦",
    }

    return rows.map(r => ({
      name: r.category === "Makanan" ? "Makanan & Minuman" : r.category,
      budget: r.budget_amount,
      spent: r.spent_amount,
      icon: iconMap[r.category] ?? "📦",
    }))
  }, [rows])

  // ===============================
  // UI HELPERS (TIDAK DIUBAH)
  // ===============================
  const getStatusColor = (percentage: number) => {
    if (percentage >= 90) return "bg-destructive"
    if (percentage >= 70) return "bg-[var(--warning)]"
    return "bg-[var(--success)]"
  }

  const getStatusMessage = (percentage: number) => {
    if (percentage >= 90) return "Hampir habis"
    if (percentage >= 70) return "Perhatikan"
    return "Aman"
  }

  // ===============================
  // RENDER
  // ===============================
  if (loading) {
    return (
      <div className="px-5 py-10 text-sm text-muted-foreground">
        Memuat budget...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <AppHeader
        title="Budget"
        subtitle="Bulan Januari"
        isDarkMode={isDarkMode}
        onToggleTheme={onToggleTheme}
      />

      <div className="px-5 space-y-6 pb-28">
        {/* Monthly Budget Overview */}
        <Card className="border-0 shadow-soft-lg bg-gradient-to-br from-card to-card/50 card-float">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Budget Bulan Ini
                </p>
                <p className="text-3xl font-bold tracking-tight">
                  Rp {monthlyBudget.toLocaleString("id-ID")}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-1">Tersisa</p>
                <p className="text-2xl font-bold text-[var(--success)] tracking-tight">
                  Rp {remaining.toLocaleString("id-ID")}
                </p>
              </div>
            </div>

            <div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent transition-smooth"
                  style={{ width: `${spentPercentage}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-muted-foreground font-medium">
                <span>Terpakai {spentPercentage.toFixed(0)}%</span>
                <span>Rp {totalSpent.toLocaleString("id-ID")}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Budgets */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground px-1">
            Kategori
          </h3>
          <div className="grid gap-3">
            {categories.map((category, i) => {
              const percentage =
                category.budget === 0
                  ? 0
                  : (category.spent / category.budget) * 100

              return (
                <Card key={i} className="border-0 shadow-soft-md card-float">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{category.icon}</span>
                        <div>
                          <p className="font-semibold tracking-tight">
                            {category.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Rp {category.spent.toLocaleString("id-ID")} / Rp{" "}
                            {category.budget.toLocaleString("id-ID")}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-muted-foreground">
                        {getStatusMessage(percentage)}
                      </span>
                    </div>

                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-smooth ${getStatusColor(
                          percentage
                        )}`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}