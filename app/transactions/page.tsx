"use client"

import { useState } from "react"
import { TransactionList } from "@/components/transactions/TransactionList"
import { TransactionDetailSheet } from "@/components/transactions/TransactionDetailSheet"
import { AddTransactionForm } from "@/components/transactions/AddTransactionForm"
import { useRouter } from "next/navigation"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TransactionsPage() {
  const [selectedTx, setSelectedTx] = useState<any | null>(null)
  const [mode, setMode] = useState<"list" | "add">("list")
  const [refreshKey, setRefreshKey] = useState(0)
  const router = useRouter()

  return (
    <div className="relative min-h-screen bg-background p-4">
      {/* HEADER + CLOSE */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">Kelola Transaksi</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/")}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      {mode === "list" && !selectedTx && (
        <TransactionList
          key={refreshKey}
          onSelect={(tx) => setSelectedTx(tx)}
        />
      )}

      {selectedTx && (
        <TransactionDetailSheet
          transaction={selectedTx}
          onClose={() => setSelectedTx(null)}
          onSuccess={() => {
            setSelectedTx(null)
            setRefreshKey((k) => k + 1) // 🔥 refresh list
          }}
        />
      )}

      {mode === "add" && (
        <AddTransactionForm
          onBack={() => setMode("list")}
          onSuccess={() => {
            setMode("list")
            setRefreshKey((k) => k + 1)
          }}
        />
      )}
    </div>
  )
}