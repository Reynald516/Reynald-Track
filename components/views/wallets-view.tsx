"use client"

import { AppHeader } from "@/components/app-header"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { getWalletBalances } from "./wallets-actions"
import { supabase } from "@/lib/supabase/client"
import type { WalletBalanceRow } from "@/components/views/wallets-actions"

export async function fetchWalletBalances(): Promise<WalletBalanceRow[]> {
  const { data, error } = await supabase
    .from("wallet_balances")
    .select("*")
    .order("sort_order")

  if (error) throw error
  return data ?? []
}
import {
  Wallet as WalletIcon,
  Landmark,
  Smartphone,
  Bitcoin,
  Plus,
  ChevronRight,
} from "lucide-react"

interface WalletsViewProps {
  isDarkMode: boolean
  onToggleTheme: () => void
  wallets?: WalletBalanceRow[]
}

/* ======================
   Helpers
====================== */

function iconFromKey(key?: string | null) {
  switch (key) {
    case "Landmark":
      return Landmark
    case "Smartphone":
      return Smartphone
    case "Bitcoin":
      return Bitcoin
    case "Wallet":
    default:
      return WalletIcon
  }
}

function colorFromKind(kind?: string) {
  switch (kind) {
    case "bank":
      return "text-blue-500"
    case "ewallet":
      return "text-teal-500"
    case "crypto":
      return "text-amber-500"
    case "cash":
    default:
      return "text-emerald-500"
  }
}

/* ======================
   FALLBACK WALLET (UI ONLY)
====================== */

const FALLBACK_WALLETS: WalletBalanceRow[] = [
  {
    wallet_id: "cash",
    user_id: "",
    name: "Cash",
    kind: "cash",
    icon_key: "Wallet",
    sort_order: 1,
    balance: 0,
  },
  {
    wallet_id: "bank",
    user_id: "",
    name: "Bank BCA",
    kind: "bank",
    icon_key: "Landmark",
    sort_order: 2,
    balance: 0,
  },
  {
    wallet_id: "ewallet",
    user_id: "",
    name: "GoPay",
    kind: "ewallet",
    icon_key: "Smartphone",
    sort_order: 3,
    balance: 0,
  },
  {
    wallet_id: "crypto",
    user_id: "",
    name: "Crypto",
    kind: "crypto",
    icon_key: "Bitcoin",
    sort_order: 4,
    balance: 0,
  },
]

/* ======================
   VIEW
====================== */

export function WalletsView({
  isDarkMode,
  onToggleTheme,
  wallets = [],
}: WalletsViewProps) {
  const [liveWallets, setLiveWallets] = useState<WalletBalanceRow[] | null>(null)
  const [loading, setLoading] = useState(true)

  const resolvedWallets =
    Array.isArray(liveWallets) && liveWallets.length > 0
      ? liveWallets
      : (Array.isArray(wallets) && wallets.length > 0 ? wallets : FALLBACK_WALLETS)

  const totalWealth = resolvedWallets.reduce(
    (sum, w) => sum + Number(w.balance ?? 0),
    0
  )

  useEffect(() => {
    fetchWalletBalances()
      .then(setLiveWallets)
      .finally(() => setLoading(false))
  }, [])

  // lalu ganti semua "safeWallets" jadi "resolvedWallets" di bawah

  return (
    <div className="space-y-6">
      <AppHeader
        title="Wallets"
        subtitle="Asset overview"
        isDarkMode={isDarkMode}
        onToggleTheme={onToggleTheme}
      />

      <div className="px-5 space-y-6 pb-16">
        {/* Total Wealth */}
        <Card className="border-0 shadow-soft-lg bg-gradient-to-br from-accent/5 to-accent/10 overflow-hidden">
          <CardContent className="p-6 space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Total Wealth
              </p>
              <h2 className="text-4xl font-bold">
                Rp {totalWealth.toLocaleString("id-ID")}
              </h2>
            </div>

            {/* Dummy graph */}
            <div className="h-32 rounded-xl bg-accent/5 flex items-end gap-1.5 px-3 pb-3">
              {[45, 52, 48, 58, 55, 62, 68, 65, 72, 78, 75, 82].map(
                (h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-accent to-accent/60 rounded-t-sm"
                    style={{ height: `${h}%` }}
                  />
                )
              )}
            </div>
          </CardContent>
        </Card>

        {/* Wallet List */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground px-1">
            Your Wallets
          </h3>

          <div className="grid gap-3">
            {resolvedWallets.map((wallet) => {
              const Icon = iconFromKey(wallet.icon_key)
              const color = colorFromKind(wallet.kind)

              return (
                <Card
                  key={wallet.wallet_id}
                  className="border-0 shadow-soft-md hover:shadow-soft-lg transition cursor-pointer"
                >
                  <CardContent className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-2xl bg-secondary/50 ${color}`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-semibold">{wallet.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Rp{" "}
                          {Number(wallet.balance ?? 0).toLocaleString(
                            "id-ID"
                          )}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Add New (dummy) */}
        <div className="space-y-3 pb-4">
          <h3 className="text-sm font-semibold text-muted-foreground px-1">
            Add New
          </h3>

          <div className="grid gap-3">
            {[
              { label: "Tambah Rekening Bank", icon: Landmark },
              { label: "Tambah E-Wallet", icon: Smartphone },
              { label: "Tambah Dompet Kripto", icon: Bitcoin },
            ].map((a, i) => {
              const Icon = a.icon
              return (
                <Card
                  key={i}
                  className="border border-dashed hover:bg-accent/5 cursor-pointer"
                >
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-accent/10">
                      <Plus className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-muted-foreground" />
                      <p className="font-medium">{a.label}</p>
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