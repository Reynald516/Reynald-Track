"use client"

import { useEffect, useMemo, useState } from "react"
import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { supabase } from "@/lib/supabase/client"
import { getUserTransactions } from "@/lib/transactions.supabase"

// =======================
// CATEGORY ICON MAPPING
// =======================
const CATEGORY_ICONS: Record<string, string> = {
  "Makanan & Minuman": "🍽️",
  Transport: "🚗",
  Belanja: "🛍️",
  Entertainment: "🎮",
  Tagihan: "📄",
  Lainnya: "📦",
}

// =======================
// TYPE
// =======================
type UITransaction = {
  id: string
  category: string
  wallet: string
  note?: string | null
  amount: number
  type: "expense" | "income"
  time: string
  dateLabel: string
  icon: string
}

// =======================
// COMPONENT
// =======================
export function TransactionList({
  onSelect,
}: {
  onSelect: (tx: UITransaction) => void
}) {
  const [transactions, setTransactions] = useState<UITransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  // =======================
  // FETCH REAL TRANSACTIONS
  // =======================
  useEffect(() => {
    const fetchTransactions = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setLoading(false)
        return
      }

      const data = await getUserTransactions(user.id)

      const mapped: UITransaction[] = data.map((tx: any) => {
        const date = new Date(tx.created_at)

        return {
          id: tx.id,
          category: tx.category,
          wallet: tx.wallet,
          note: tx.note,
          amount: tx.amount,
          type: tx.type,
          time: date.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          dateLabel: date.toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          icon: CATEGORY_ICONS[tx.category] ?? "📦",
        }
      })

      setTransactions(mapped)
      setLoading(false)
    }

    fetchTransactions()
  }, [])

  // =======================
  // SEARCH FILTER
  // =======================
  const filtered = useMemo(() => {
    if (!search) return transactions
    const q = search.toLowerCase()

    return transactions.filter(
      (tx) =>
        tx.category.toLowerCase().includes(q) ||
        tx.wallet.toLowerCase().includes(q) ||
        (tx.note && tx.note.toLowerCase().includes(q)),
    )
  }, [transactions, search])

  // =======================
  // GROUP BY DATE
  // =======================
  const grouped = useMemo(() => {
    return filtered.reduce((acc, tx) => {
      if (!acc[tx.dateLabel]) acc[tx.dateLabel] = []
      acc[tx.dateLabel].push(tx)
      return acc
    }, {} as Record<string, UITransaction[]>)
  }, [filtered])

  // =======================
  // LOADING STATE
  // =======================
  if (loading) {
    return (
      <div className="px-5 py-10 text-sm text-muted-foreground">
        Memuat transaksi...
      </div>
    )
  }

  // =======================
  // RENDER
  // =======================
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Kelola Transaksi</h1>
        <p className="text-sm text-muted-foreground">
          Semua riwayat transaksi keuangan kamu
        </p>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari transaksi..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* List */}
      <div className="flex flex-col gap-6 pb-32">
        {Object.entries(grouped).map(([date, items]) => (
          <div key={date} className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase text-muted-foreground">
              {date}
            </span>

            {items.map((tx) => {
              const isExpense = tx.type === "expense"

              return (
                <Card
                  key={tx.id}
                  onClick={() => onSelect(tx)}
                  className="cursor-pointer rounded-xl p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-xl">
                      {tx.icon}
                    </div>

                    {/* Info */}
                    <div className="flex flex-1 flex-col gap-1">
                      <span className="font-semibold">{tx.category}</span>

                      {tx.note && (
                        <span className="text-sm text-muted-foreground">
                          {tx.note}
                        </span>
                      )}

                      <span className="text-xs text-muted-foreground">
                        {tx.wallet} • {tx.time}
                      </span>
                    </div>

                    {/* Amount */}
                    <div className="flex flex-col items-end">
                      <span
                        className={`font-bold ${
                          isExpense ? "text-destructive" : "text-success"
                        }`}
                      >
                        {isExpense ? "-" : "+"}Rp{" "}
                        {tx.amount.toLocaleString("id-ID")}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {isExpense ? "Pengeluaran" : "Pemasukan"}
                      </span>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}