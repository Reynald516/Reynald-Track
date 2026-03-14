// components/transactions/EditTransactionSheet.tsx

"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { updateTransaction } from "@/lib/transactions.supabase"
import { CheckCircle2, X } from "lucide-react"

// Define interface untuk type safety (ganti 'any')
interface Transaction {
  id: string
  amount: number
  category?: string
  wallet_id?: string
  notes?: string
}

interface Wallet {
  id: string
  name: string
}

export function EditTransactionSheet({
  transaction,
  wallets,  // Tambahkan prop ini: array wallets yang tersedia
  onCancel,
  onSuccess,
}: {
  transaction: Transaction
  wallets: Wallet[]  // Array wallets untuk select
  onCancel: () => void
  onSuccess: () => void
}) {
    const [amount, setAmount] = useState(Math.abs(transaction.amount) || 0)
    const [category, setCategory] = useState(transaction.category || "")
    const [walletId, setWalletId] = useState<string>(transaction.wallet_id ?? "")
    const [note, setNote] = useState(transaction.notes || "")
    const [saved, setSaved] = useState(false)
    const [loading, setLoading] = useState(false)

    
  async function handleSave() {
    if (loading || amount <= 0) return  // Tambah validasi: amount harus > 0
    setLoading(true)

    await updateTransaction(transaction.id, {
      amount: transaction.amount < 0 ? -amount : amount,
      category,
      wallet_id: walletId ?? transaction.wallet_id ?? null,  // Pastikan wallet_id selalu string (bisa kosong)
      notes: note || null,
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

      {/* Select untuk Wallet - sekarang pakai wallets.map() */}
      <div className="space-y-3">
        <label className="block text-sm font-medium">Wallet</label>
        <select 
          value={walletId} 
          onChange={(e) => setWalletId(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="" disabled>
            Pilih Wallet
          </option>  {/* Opsi default */}
          {wallets.map((w) => (  // Gunakan wallets (array), bukan wallet (string)
            <option key={w.id} value={w.id}>
              {w.name}
            </option>
          ))}
        </select>

        <label className="block text-sm font-medium">Jumlah</label>
        <Input 
          type="number" 
          value={amount} 
          onChange={(e) => setAmount(Number(e.target.value))} 
          placeholder="Masukkan jumlah"
        />

        <label className="block text-sm font-medium">Kategori</label>
        <Input 
          value={category} 
          onChange={(e) => setCategory(e.target.value)} 
          placeholder="Masukkan kategori"
        />

        <label className="block text-sm font-medium">Catatan</label>
        <Input 
          value={note} 
          onChange={(e) => setNote(e.target.value)} 
          placeholder="Masukkan catatan"
        />
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