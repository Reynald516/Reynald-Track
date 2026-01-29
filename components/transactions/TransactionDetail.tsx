"use client"

import { Trash2, Edit2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Props {
  tx: any
  onClose: () => void
  onDelete: () => void
}

export function TransactionDetail({ tx, onClose, onDelete }: Props) {
  if (!tx) return null

  const isExpense = tx.amount < 0

  return (
    <div className="flex flex-col gap-6 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Detail Transaksi</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Amount Card */}
      <Card className="flex flex-col items-center gap-3 p-8 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-muted text-4xl">
          {tx.icon}
        </div>

        <span className="text-sm text-muted-foreground">
          {tx.category}
        </span>

        <span
          className={`text-3xl font-black ${
            isExpense ? "text-destructive" : "text-success"
          }`}
        >
          {isExpense ? "-" : "+"}Rp{" "}
          {Math.abs(tx.amount).toLocaleString("id-ID")}
        </span>

        <span className="text-xs text-muted-foreground">
          {isExpense ? "Pengeluaran" : "Pemasukan"}
        </span>
      </Card>

      {/* Detail Info */}
      <div className="flex flex-col gap-4">
        <DetailRow
          label="Tanggal"
          value={`${tx.date} • ${tx.time}`}
        />
        
        <DetailRow
          label="Kategori"
          value={tx.category}
        />
        
        <DetailRow
          label="Wallet"
          value={tx.wallet}
        />
        
        <DetailRow
          label="Catatan"
          value={tx.note || "-"}
        />
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        <Button variant="outline" size="lg" className="h-12 rounded-xl">
          <Edit2 className="mr-2 h-4 w-4" />
          Edit
        </Button>

        <Button
          variant="destructive"
          size="lg"
          className="h-12 rounded-xl"
          onClick={onDelete}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Hapus
        </Button>
      </div>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b pb-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  )
}