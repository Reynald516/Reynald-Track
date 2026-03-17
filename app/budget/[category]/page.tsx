"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { getCategoryBudget, upsertCategoryBudget } from "@/lib/budget.supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft } from "lucide-react"

export default function EditBudgetCategoryPage() {
  const { category } = useParams()
  const router = useRouter()

  const [amount, setAmount] = useState<string>("")
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  const now = new Date()
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  const decodedCategory = decodeURIComponent(category as string)

  useEffect(() => {
    const load = async () => {
      setLoading(true)

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      try {
        const data = await getCategoryBudget(user.id, decodedCategory, month)
        setAmount(data?.amount ? String(data.amount) : "")
      } catch (err) {
        console.error("Load budget error:", err)
      }

      setLoading(false)
    }

    load()
  }, [decodedCategory, month])

  const handleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    setSaving(true)
    try {
      const numericAmount = Number(amount || 0)
      await upsertCategoryBudget(user.id, decodedCategory, numericAmount, month)
      router.back()
    } catch (err: any) {
      console.error("Save budget error:", err)
      alert(err?.message ?? "Gagal menyimpan budget")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="p-6 text-sm text-muted-foreground">Memuat...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-card border-b border-border px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="size-5" />
        </Button>
        <h1 className="text-base font-semibold">Atur Budget {decodedCategory}</h1>
      </header>

      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Batas Budget Bulanan
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              Rp
            </span>
            <Input
              type="text"
              inputMode="numeric"
              value={amount ? Number(amount).toLocaleString("id-ID") : ""}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "")
                setAmount(val)
              }}
              placeholder="0"
              className="pl-10"
            />
          </div>
          {amount && Number(amount) > 0 && (
            <p className="text-xs text-muted-foreground">
              Rp {Number(amount).toLocaleString("id-ID")} per bulan
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={() => router.back()}>
            Batal
          </Button>
          <Button className="flex-1" onClick={handleSave} disabled={saving}>
            {saving ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </div>
    </div>
  )
}