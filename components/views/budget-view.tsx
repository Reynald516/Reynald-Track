"use client"

import { AppHeader } from "@/components/app-header"
import { Card, CardContent } from "@/components/ui/card"

interface BudgetViewProps {
  isDarkMode: boolean
  onToggleTheme: () => void
}

export function BudgetView({ isDarkMode, onToggleTheme }: BudgetViewProps) {
  // Mock data - would come from props/context in production
  const monthlyBudget = 15000000
  const totalSpent = 8750000
  const remaining = monthlyBudget - totalSpent
  const spentPercentage = (totalSpent / monthlyBudget) * 100

  const categories = [
    { name: "Makanan & Minuman", budget: 3000000, spent: 2400000, icon: "🍽️" },
    { name: "Transport", budget: 2000000, spent: 1200000, icon: "🚗" },
    { name: "Belanja", budget: 4000000, spent: 3800000, icon: "🛍️" },
    { name: "Entertainment", budget: 2000000, spent: 850000, icon: "🎮" },
    { name: "Tagihan", budget: 3000000, spent: 500000, icon: "📄" },
    { name: "Lainnya", budget: 1000000, spent: 0, icon: "📦" },
  ]

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
      <AppHeader title="Budget" subtitle="Bulan Januari" isDarkMode={isDarkMode} onToggleTheme={onToggleTheme} />

      <div className="px-5 space-y-6 pb-28">
        {/* Monthly Budget Overview */}
        <Card className="border-0 shadow-soft-lg bg-gradient-to-br from-card to-card/50 card-float">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Budget Bulan Ini</p>
                <p className="text-3xl font-bold tracking-tight">Rp {monthlyBudget.toLocaleString("id-ID")}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-1">Tersisa</p>
                <p className="text-2xl font-bold text-[var(--success)] tracking-tight">
                  Rp {remaining.toLocaleString("id-ID")}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-accent transition-smooth" style={{ width: `${spentPercentage}%` }} />
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
          <h3 className="text-sm font-semibold text-muted-foreground px-1">Kategori</h3>
          <div className="grid gap-3">
            {categories.map((category, i) => {
              const percentage = (category.spent / category.budget) * 100
              const statusColor = getStatusColor(percentage)
              const statusMessage = getStatusMessage(percentage)

              return (
                <Card key={i} className="border-0 shadow-soft-md card-float">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{category.icon}</span>
                        <div>
                          <p className="font-semibold tracking-tight">{category.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Rp {category.spent.toLocaleString("id-ID")} / Rp {category.budget.toLocaleString("id-ID")}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-muted-foreground">{statusMessage}</span>
                    </div>

                    {/* Category Progress */}
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-smooth ${statusColor}`}
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
