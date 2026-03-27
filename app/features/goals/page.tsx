// app/features/goals/page.tsx

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Plus, Target, Trash2 } from "lucide-react"

type Goal = {
  id: string
  name: string
  target_amount: number
  monthly_saving: number
  eta_text: string
  target_fmt: string
  monthly_fmt: string
}

export default function GoalsPage() {
  const router = useRouter()
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState("")
  const [target, setTarget] = useState("")
  const [monthly, setMonthly] = useState("")
  const [saving, setSaving] = useState(false)

  const loadGoals = async () => {
    try {
      const res = await fetch("/api/ai/goals")
      const data = await res.json()
      setGoals(data.goals ?? [])
    } catch {
      setGoals([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadGoals() }, [])

  const handleSave = async () => {
    if (!name.trim() || !target) return
    setSaving(true)
    try {
      const res = await fetch("/api/ai/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          target_amount: parseInt(target.replace(/\D/g, "")),
          monthly_saving: monthly ? parseInt(monthly.replace(/\D/g, "")) : null,
        }),
      })
      const data = await res.json()
      if (data.status === "success") {
        setName("")
        setTarget("")
        setMonthly("")
        setShowForm(false)
        loadGoals()
      }
    } finally {
      setSaving(false)
    }
  }

  const formatInput = (val: string) => {
    const num = val.replace(/\D/g, "")
    if (!num) return ""
    return new Intl.NumberFormat("id-ID").format(parseInt(num))
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-10 bg-card border-b border-border px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.back()}
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted">
          <ChevronLeft className="size-5" />
        </button>
        <h1 className="text-base font-semibold">Goals / Target</h1>
        <button onClick={() => setShowForm(true)}
          className="ml-auto w-9 h-9 rounded-full flex items-center justify-center bg-primary text-primary-foreground">
          <Plus className="size-4" />
        </button>
      </header>

      <div className="flex-1 px-5 py-6 space-y-4 pb-32">
        {loading ? (
          <p className="text-sm text-muted-foreground text-center py-8">Memuat goals...</p>
        ) : goals.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <Target className="size-12 mx-auto text-muted-foreground/40" />
            <p className="font-semibold">Belum ada goals</p>
            <p className="text-sm text-muted-foreground">Tambahin impian lo, biar ada yang dituju</p>
            <button onClick={() => setShowForm(true)}
              className="mt-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold">
              + Tambah Goal
            </button>
          </div>
        ) : (
          goals.map(goal => (
            <div key={goal.id} className="bg-card rounded-2xl border border-border p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base">{goal.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Target: {goal.target_fmt}</p>
                </div>
                <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-semibold">
                  {goal.eta_text}
                </span>
              </div>

              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full w-[5%]" />
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Estimasi nabung: <span className="text-foreground font-medium">{goal.monthly_fmt}/bulan</span>
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Form tambah goal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end">
          <div className="bg-card w-full rounded-t-3xl px-5 pt-6 pb-10 space-y-4">
            <h2 className="font-bold text-lg">Tambah Goal</h2>

            <div className="space-y-1">
              <label className="text-sm font-medium">Nama impian lo</label>
              <input value={name} onChange={e => setName(e.target.value)}
                placeholder="Beli PS5, iPhone 16, Liburan Bali..."
                className="w-full px-4 py-3 rounded-xl bg-muted text-sm" />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Target harga (Rp)</label>
              <input value={target} onChange={e => setTarget(formatInput(e.target.value))}
                placeholder="10.000.000" inputMode="numeric"
                className="w-full px-4 py-3 rounded-xl bg-muted text-sm" />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">
                Nabung per bulan <span className="text-muted-foreground text-xs">(opsional)</span>
              </label>
              <input value={monthly} onChange={e => setMonthly(formatInput(e.target.value))}
                placeholder="Kosongkan → sistem hitung otomatis"
                inputMode="numeric"
                className="w-full px-4 py-3 rounded-xl bg-muted text-sm" />
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowForm(false)}
                className="flex-1 py-3 rounded-xl border border-border text-sm font-semibold">
                Batal
              </button>
              <button onClick={handleSave} disabled={saving || !name || !target}
                className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50">
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}