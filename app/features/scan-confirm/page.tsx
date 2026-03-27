// app/features/scan-confirm/page.tsx

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { ChevronLeft, Loader2 } from "lucide-react"
import { useInsightToast } from "@/hooks/use-insight-toast"

const CATEGORY_ICONS: Record<string, string> = {
  // Expense
  "Makanan & Minuman": "🍽️",
  "Transport": "🚗",
  "Belanja": "🛍️",
  "Tagihan": "📄",
  "Entertainment": "🎮",
  "Lainnya": "📦",
  // Income
  "Gaji": "💼",
  "Bonus": "🎁",
  "Freelance": "💻",
  "Bisnis": "🏪",
  "Hadiah": "🎀",
}

export default function ScanConfirmPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)
  const { showInsight } = useInsightToast()

  // Data dari scan
  const [type, setType] = useState<"expense" | "income">("expense")
  const [amount, setAmount] = useState(0)
  const [category, setCategory] = useState("")
  const [note, setNote] = useState("")
  const [walletId, setWalletId] = useState("")
  const [wallets, setWallets] = useState<{ id: string; name: string }[]>([])

  const expenseCategories = ["Makanan & Minuman", "Transport", "Belanja", "Tagihan", "Entertainment", "Lainnya"]
  const incomeCategories = ["Gaji", "Bonus", "Freelance", "Bisnis", "Hadiah", "Lainnya"]
  const categories = type === "expense" ? expenseCategories : incomeCategories

  useEffect(() => {
    // Ambil scan result dari sessionStorage
    const stored = sessionStorage.getItem("scan_result")
    if (!stored) {
      router.replace("/features/daily-log")
      return
    }

    try {
      const result = JSON.parse(stored)
      if (result.type) setType(result.type)
      if (result.amount) setAmount(result.amount)
      if (result.category) setCategory(result.category)
      if (result.note) setNote(result.note.slice(0, 120))
      sessionStorage.removeItem("scan_result")
    } catch {
      router.replace("/features/daily-log")
    }

    // Fetch wallets
    const fetchWallets = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from("wallets")
        .select("id, name")
        .eq("user_id", user.id)
        .order("sort_order")

      if (data && data.length > 0) {
        setWallets(data)
        setWalletId(data[0].id)
      }
    }

    fetchWallets()
  }, [])

  const handleSave = async () => {
    if (!amount || !category || !walletId) return

    setSaving(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase.from("transactions").insert({
        amount,
        category,
        wallet_id: walletId,
        type,
        notes: note || null,
        user_id: user.id,
        date: new Date().toISOString().slice(0, 10),
      })

      if (error) throw error

      // Trigger RTR Engine analysis
      const engineUrl = process.env.NEXT_PUBLIC_RTR_ENGINE_URL
      if (engineUrl) {
        fetch(`${engineUrl}/trigger_analysis/${user.id}`, {
          method: "POST",
          signal: AbortSignal.timeout(5000),
        }).catch(() => {})
      }

      setDone(true)
      showInsight({ amount, type, category, note })
      setTimeout(() => {
        router.replace("/")
      }, 1500)

    } catch (err: any) {
      alert(err.message || "Gagal menyimpan")
      setSaving(false)
    }
  }

  // Done state
  if (done) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <svg className="size-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-base font-semibold">Tersimpan</p>
          <p className="text-sm text-muted-foreground mt-1">Kembali ke Home...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card border-b border-border px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted"
        >
          <ChevronLeft className="size-5" />
        </button>
        <h1 className="text-base font-semibold">Konfirmasi Transaksi</h1>
        <div className="ml-auto text-xs text-muted-foreground bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
          Dari Scan
        </div>
      </header>

      <div className="flex-1 px-5 py-6 space-y-5 pb-32">

        {/* Amount — paling prominent */}
        <div className="text-center py-6 bg-card rounded-2xl border border-border">
          <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide font-semibold">Total</p>
          <p className="text-4xl font-bold tracking-tight">
            Rp {amount.toLocaleString("id-ID")}
          </p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <button
              onClick={() => setType("expense")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                type === "expense"
                  ? "bg-destructive/10 text-destructive"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              Pengeluaran
            </button>
            <button
              onClick={() => setType("income")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                type === "income"
                  ? "bg-green-500/10 text-green-600"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              Pemasukan
            </button>
          </div>
        </div>

        {/* Kategori */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Kategori</label>
          <div className="grid grid-cols-3 gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`p-3 rounded-xl text-center transition-colors border ${
                  category === cat
                    ? "bg-primary/10 border-primary text-primary"
                    : "bg-card border-border text-foreground"
                }`}
              >
                <div className="text-xl mb-1">{CATEGORY_ICONS[cat] ?? "📦"}</div>
                <div className="text-xs font-medium leading-tight">{cat}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Wallet */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Wallet</label>
          <div className="flex gap-2 flex-wrap">
            {wallets.map((w) => (
              <button
                key={w.id}
                onClick={() => setWalletId(w.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                  walletId === w.id
                    ? "bg-primary/10 border-primary text-primary"
                    : "bg-card border-border text-foreground"
                }`}
              >
                {w.name}
              </button>
            ))}
          </div>
        </div>

        {/* Catatan opsional */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Catatan <span className="text-xs opacity-50">(opsional)</span>
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value.slice(0, 120))}
            placeholder="Tambah catatan..."
            rows={2}
            className="w-full px-4 py-3 rounded-xl bg-muted text-sm resize-none outline-none focus:ring-2 focus:ring-primary/30"
          />
          <p className="text-xs text-muted-foreground text-right">{note.length}/120</p>
        </div>
      </div>

      {/* Footer — Simpan button */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-5 py-4">
        <button
          onClick={handleSave}
          disabled={saving || !amount || !category || !walletId}
          className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              <span>Menyimpan...</span>
            </>
          ) : (
            "Simpan"
          )}
        </button>
      </div>
    </div>
  )
}