"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { updateTransaction } from "@/lib/transactions.supabase"
import { CheckCircle2, X } from "lucide-react"

export function EditTransactionSheet({
  transaction,
  onCancel,
  onSuccess,
}: {
  transaction: any
  onCancel: () => void
  onSuccess: () => void
}) {
  const [amount, setAmount] = useState(Math.abs(transaction.amount))
  const [category, setCategory] = useState(transaction.category)
  const [wallet, setWallet] = useState(transaction.wallet)
  const [note, setNote] = useState(transaction.note || "")
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSave() {
    if (loading) return
    setLoading(true)

    await updateTransaction(transaction.id, {
      amount: transaction.amount < 0 ? -amount : amount,
      category,
      wallet,
      note,
    })

    setSaved(true)
    setTimeout(onSuccess, 1200)
  }

  return (
    <Card className="fixed inset-0 z-50 bg-background p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-lg">Edit Transaksi</h2>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X />
        </Button>
      </div>

      <div className="space-y-3">
        <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
        <Input value={category} onChange={(e) => setCategory(e.target.value)} />
        <Input value={wallet} onChange={(e) => setWallet(e.target.value)} />
        <Input value={note} onChange={(e) => setNote(e.target.value)} />
      </div>

      {saved && (
        <div className="mt-4 flex items-center gap-2 text-green-600">
          <CheckCircle2 className="h-5 w-5" />
          <span>Transaksi berhasil diperbarui</span>
        </div>
      )}

      <div className="mt-6 flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onCancel}>
          Kembali
        </Button>
        <Button className="flex-1" onClick={handleSave} disabled={loading}>
          Simpan
        </Button>
      </div>
    </Card>
  )
}