"use client"

import { AppHeader } from "@/components/app-header"
import { Card, CardContent } from "@/components/ui/card"
import { Wallet, Landmark, Smartphone, Bitcoin, Plus, ChevronRight } from "lucide-react"

interface WalletsViewProps {
  isDarkMode: boolean
  onToggleTheme: () => void
}

export function WalletsView({ isDarkMode, onToggleTheme }: WalletsViewProps) {
  // Mock data - would come from props/context in production
  const wallets = [
    { id: 1, name: "Cash", icon: Wallet, balance: 2500000, color: "text-emerald-500" },
    { id: 2, name: "Bank BCA", icon: Landmark, balance: 15750000, color: "text-blue-500" },
    { id: 3, name: "GoPay", icon: Smartphone, balance: 850000, color: "text-teal-500" },
    { id: 4, name: "Crypto", icon: Bitcoin, balance: 5200000, color: "text-amber-500" },
  ]

  const totalWealth = wallets.reduce((sum, wallet) => sum + wallet.balance, 0)

  return (
    <div className="space-y-6">
      <AppHeader title="Wallets" subtitle="Asset overview" isDarkMode={isDarkMode} onToggleTheme={onToggleTheme} />

      <div className="px-5 space-y-6 pb-16">
        {/* Total Wealth Overview */}
        <Card className="border-0 shadow-soft-lg bg-gradient-to-br from-accent/5 to-accent/10 overflow-hidden card-float">
          <CardContent className="p-6 space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Wealth</p>
              <h2 className="text-4xl font-bold tracking-tight">Rp {totalWealth.toLocaleString("id-ID")}</h2>
            </div>

            {/* Wealth Graph */}
            <div className="h-32 rounded-xl bg-accent/5 border-0 shadow-soft flex items-end justify-around px-3 pb-3 gap-1.5">
              {[45, 52, 48, 58, 55, 62, 68, 65, 72, 78, 75, 82].map((height, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-accent to-accent/60 rounded-t-sm transition-smooth hover:opacity-80"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Wallet List */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground px-1">Your Wallets</h3>
          <div className="grid gap-3">
            {wallets.map((wallet) => {
              const Icon = wallet.icon
              return (
                <Card
                  key={wallet.id}
                  className="border-0 shadow-soft-md hover:shadow-soft-lg transition-smooth cursor-pointer card-float button-scale"
                >
                  <CardContent className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-2xl bg-secondary/50 ${wallet.color} transition-smooth`}>
                        <Icon className="w-6 h-6" strokeWidth={2} />
                      </div>
                      <div>
                        <p className="font-semibold tracking-tight">{wallet.name}</p>
                        <p className="text-sm text-muted-foreground">Rp {wallet.balance.toLocaleString("id-ID")}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Add New Actions */}
        <div className="space-y-3 pb-4">
          <h3 className="text-sm font-semibold text-muted-foreground px-1">Add New</h3>
          <div className="grid gap-3">
            {[
              { label: "Tambah Rekening Bank", icon: Landmark },
              { label: "Tambah E-Wallet", icon: Smartphone },
              { label: "Tambah Dompet Kripto", icon: Bitcoin },
            ].map((action, i) => {
              const Icon = action.icon
              return (
                <Card
                  key={i}
                  className="border border-dashed border-border/50 hover:border-accent/50 hover:bg-accent/5 shadow-soft-sm hover:shadow-soft-md transition-smooth cursor-pointer card-float button-scale"
                >
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-accent/10 transition-smooth hover:bg-accent/15">
                      <Plus className="w-5 h-5 text-accent" strokeWidth={2.5} />
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-muted-foreground" />
                      <p className="font-medium tracking-tight">{action.label}</p>
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
