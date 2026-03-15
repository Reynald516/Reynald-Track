// app/budget/[category]/page.tsx

"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { getCategoryBudget, upsertCategoryBudget } from "@/lib/budget.supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function EditBudgetCategoryPage() {
  const { category } = useParams()
  const router = useRouter()

  // 🔑 INPUT HARUS STRING
  const [amount, setAmount] = useState<string>("")
  const [loading, setLoading] = useState(true)

  const now = new Date()
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  const decodedCategory = decodeURIComponent(category as string)

  useEffect(() => {
    const load = async () => {
      setLoading(true)

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setLoading(false)
        return
      }

      try {
        const data = await getCategoryBudget(
          user.id,
          decodedCategory,
          month
        )

        // 🔑 DARI DB (NUMBER) → STRING
        if (data?.amount !== undefined && data?.amount !== null) {
          setAmount(String(data.amount))
        } else {
          setAmount("")
        }
      } catch (err) {
        console.error("Load budget error:", err)
      }

      setLoading(false)
    }

    load()
  }, [decodedCategory, month])

  if (loading) {
    return <div className="p-6">Memuat...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-lg font-semibold">
        Atur Budget {decodedCategory}
      </h1>

      <Input
        type="text"
        inputMode="numeric"
        value={amount}
        onChange={(e) => {
          // 🔑 HANYA ANGKA, TANPA MAKSA JADI NUMBER
          const val = e.target.value.replace(/\D/g, "")
          setAmount(val)
        }}
        placeholder="Masukkan budget"
      />

      <div className="flex gap-3">
        <Button
          variant="secondary"
          onClick={() => router.back()}
        >
          Batal
        </Button>

        <Button
          onClick={async () => {
            const {
              data: { user },
            } = await supabase.auth.getUser()

            if (!user) return

            try {
              // 🔑 BARU DI SINI JADI NUMBER
              const numericAmount = Number(amount || 0)

              await upsertCategoryBudget(
                user.id,
                decodedCategory,
                numericAmount,
                month
              )

              router.refresh()
              router.back()
            } catch (err: any) {
              console.error("Save budget error:", err)
              alert(err?.message ?? "Gagal menyimpan budget")
            }
          }}
        >
          Simpan
        </Button>
      </div>
    </div>
  )
}