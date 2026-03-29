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

const DEFAULT_CATEGORIES = [
  "Makanan & Minuman",
  "Transport",
  "Belanja",
  "Entertainment",
  "Tagihan",
  "Lainnya",
]

export function BudgetView({ isDarkMode, onToggleTheme }: BudgetViewProps) {
  const [rows, setRows] = useState<BudgetRow[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const now = useMemo(() => new Date(), [])
const currentMonth = useMemo(
  () => now.toLocaleDateString("id-ID", { month: "long", year: "numeric" }),
  [now]
)
const monthKey = useMemo(
  () => `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`,
  [now]
)

  useEffect(() => {
    const fetchBudget = async () => {
      setLoading(true)

      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setLoading(false)
        return
      }

      // Step 1: Cek apakah user sudah punya budget_categories bulan ini
      const { data: existing } = await supabase
        .from("budget_categories")
        .select("id")
        .eq("user_id", user.id)
        .eq("month", monthKey)
        .limit(1)

      // Step 2: Kalau belum ada, auto-insert 6 kategori default dengan amount 0
      if (!existing || existing.length === 0) {
        const defaultRows = DEFAULT_CATEGORIES.map((cat) => ({
          user_id: user.id,
          category: cat,
          amount: 0,
          month: monthKey,
        }))

        await supabase
          .from("budget_categories")
          .upsert(defaultRows, {
            onConflict: "user_id,category,month",
            ignoreDuplicates: true,
          })
      }

      // Step 3: Fetch dari budget_summary
      const { data, error } = await supabase
        .from("budget_summary")
        .select("category, budget_amount, spent_amount")
        .eq("user_id", user.id)
        .eq("month", monthKey)

      if (error) {
        console.error("Budget fetch error:", error)
        setLoading(false)
        return
      }

      // Step 4: Tampilkan semua default categories + kategori custom yang ada transaksi/budget-nya
      const filtered = (data ?? []).filter(
        (r) =>
          DEFAULT_CATEGORIES.includes(r.category) ||
          r.budget_amount > 0 ||
          r.spent_amount > 0
      )

      setRows(filtered)
      setLoading(false)
    }

    fetchBudget()
  }, [monthKey])

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

  const categories = useMemo(() => {
    const iconMap: Record<string, string> = {
      "Makanan & Minuman": "🍽️",
      Transport: "🚗",
      Belanja: "🛍️",
      Entertainment: "🎮",
      Tagihan: "📄",
      Lainnya: "📦",
    }

    return rows.map((r) => ({
      name: r.category,
      rawCategory: r.category,
      budget: r.budget_amount,
      spent: r.spent_amount,
      icon: iconMap[r.category] ?? "📦",
    }))
  }, [rows])

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

  return (
    <div className="space-y-6">
      <AppHeader
        title="Budget"
        subtitle={`${currentMonth} - ${rows.length} kategori`}
        isDarkMode={isDarkMode}
        onToggleTheme={onToggleTheme}
      />

      <div className="px-5 space-y-6 pb-28">
        <Card className="border-0 shadow-soft-lg bg-gradient-to-br from-card to-card/50 card-float">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Budget Bulan Ini</p>
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
                  style={{ width: `${Math.min(spentPercentage, 100)}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-muted-foreground font-medium">
                <span>Terpakai {spentPercentage.toFixed(0)}%</span>
                <span>Rp {totalSpent.toLocaleString("id-ID")}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div id="tutorial-budget-categories" className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground px-1">
            Kategori
          </h3>
          {loading ? (
            <div className="py-6 text-sm text-muted-foreground text-center">
              Memuat kategori...
            </div>
          ) : (
            <div className="grid gap-3">
              {categories.map((category, i) => {
                const percentage =
                  category.budget === 0
                    ? 0
                    : (category.spent / category.budget) * 100

                return (
                  <Card
                    key={i}
                    className="border-0 shadow-soft-md card-float cursor-pointer hover:shadow-soft-lg transition-smooth"
                    onClick={() =>
                      router.push(`/budget/${encodeURIComponent(category.rawCategory)}`)
                    }
                  >
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{category.icon}</span>
                          <div>
                            <p className="font-semibold tracking-tight">{category.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {category.budget === 0
                                ? "Belum diatur — tap untuk set budget"
                                : `Rp ${category.spent.toLocaleString("id-ID")} / Rp ${category.budget.toLocaleString("id-ID")}`}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-muted-foreground">
                          {category.budget === 0 ? "Atur" : getStatusMessage(percentage)}
                        </span>
                      </div>

                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-smooth ${getStatusColor(percentage)}`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}