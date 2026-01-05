"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { EditTransactionSheet } from "./EditTransactionSheet"
import { deleteTransaction } from "@/lib/transactions.supabase"
import { CheckCircle2, Pencil, Trash2, X } from "lucide-react"

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

export function TransactionDetailSheet({
  transaction,
  onClose,
  onSuccess,
}: {
  transaction: any
  onClose: () => void
  onSuccess: () => void
}) {
  const [editing, setEditing] = useState(false)
  const [success, setSuccess] = useState<null | "delete">(null)

  async function handleDelete() {
    await deleteTransaction(transaction.id)
    setSuccess("delete")
    setTimeout(() => {
      onSuccess()
      onClose()
    }, 1200)
  }

  if (editing) {
    return (
      <EditTransactionSheet
        transaction={transaction}
        onCancel={() => setEditing(false)}
        onSuccess={() => {
          onSuccess()
          onClose()
        }}
      />
    )
  }

  return (
    <Card className="fixed inset-0 z-50 bg-background p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-lg">Detail Transaksi</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X />
        </Button>
      </div>

      <div className="space-y-2 text-sm">
        <div><b>Kategori:</b> {transaction.category}</div>
        <div><b>Wallet:</b> {transaction.wallet}</div>
        <div><b>Catatan:</b> {transaction.note || "-"}</div>
        <div><b>Jumlah:</b> Rp {Math.abs(transaction.amount).toLocaleString("id-ID")}</div>
      </div>

      {success && (
        <div className="mt-4 flex items-center gap-2 text-green-600">
          <CheckCircle2 className="h-5 w-5" />
          <span>Transaksi berhasil dihapus</span>
        </div>
      )}

      <div className="mt-6 flex gap-2">
        <Button className="flex-1" onClick={() => setEditing(true)}>
          <Pencil className="h-4 w-4 mr-2" /> Edit
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="flex-1">
              <Trash2 className="h-4 w-4 mr-2" /> Hapus
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Yakin hapus transaksi?</AlertDialogTitle>
              <AlertDialogDescription>
                Tindakan ini tidak bisa dibatalkan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Kembali</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={handleDelete}
              >
                Ya, Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Card>
  )
}