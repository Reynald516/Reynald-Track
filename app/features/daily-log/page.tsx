"use client"

import { useState } from "react"
import { ChevronLeftIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { TransactionForm } from "@/components/daily-log/transaction-form"
import { InlineMoodSelector } from "@/components/daily-log/inline-mood-selector"
import { NextDecision } from "@/components/daily-log/next-decision"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { MoodData } from "@/domain/daily-log/daily-log"
import type { Transaction } from "@/src/domain/transactions/transactions.core"

type FlowState = "transaction" | "mood" | "decision" | "done"

export default function DailyLogPage() {
  const router = useRouter()

  const [flowState, setFlowState] = useState<FlowState>("transaction")
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showExitDialog, setShowExitDialog] = useState(false)

  // ✅ KHUSUS FAST ADD CONFIRMATION
  const [showFastSuccess, setShowFastSuccess] = useState(false)

  const handleTransactionSave = async (
    transaction: Transaction,
    addAnother: boolean
  ) => {
    setCurrentTransaction(transaction)
    setTransactions((prev) => [...prev, transaction])
    setHasUnsavedChanges(false)

    // 🔒 KHUSUS SIMPAN & TAMBAH LAGI
    if (addAnother) {
      setShowFastSuccess(true)

      setTimeout(() => {
        setShowFastSuccess(false)
        setFlowState("transaction")
      }, 900)

      return
    }

    // 🔒 FLOW SIMPAN NORMAL — TIDAK DIUBAH
    setFlowState("mood")
  }

  const handleMoodSubmit = (mood: MoodData | null) => {
    if (mood && currentTransaction) {
      console.log("Mood attached:", currentTransaction.id, mood)
    }

    setFlowState("decision")
  }

  const handleAddAnother = () => {
    setCurrentTransaction(null)
    setFlowState("transaction")
  }

  const handleFinish = () => {
    setFlowState("done")
    setTimeout(() => {
      router.push("/")
      router.refresh()
    }, 200)
  }

  const handleBack = () => {
    if (hasUnsavedChanges) {
      setShowExitDialog(true)
    } else {
      router.back()
    }
  }

  const handleConfirmExit = () => {
    setShowExitDialog(false)
    router.back()
  }

  return (
    <>
      <div className="min-h-screen bg-background flex flex-col">
        <header className="sticky top-0 z-10 bg-card border-b border-border px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ChevronLeftIcon className="size-5" />
          </Button>

          <h1 className="text-base font-semibold">Tambah Transaksi</h1>
        </header>

        <main className="flex-1 overflow-y-auto">
          {/* ✅ FAST SUCCESS (CHECKLIST HIJAU) */}
          {showFastSuccess && (
            <div className="flex items-center justify-center min-h-[50vh] p-4">
              <div className="text-center">
                <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="size-8 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-base font-medium">Tersimpan</p>
              </div>
            </div>
          )}

          {!showFastSuccess && flowState === "transaction" && (
            <TransactionForm
              onSave={handleTransactionSave}
              onFormChange={setHasUnsavedChanges}
              transactionCount={transactions.length}
            />
          )}

          {flowState === "mood" && (
            <InlineMoodSelector
              transactionId={currentTransaction?.id || ""}
              onSubmit={handleMoodSubmit}
            />
          )}

          {flowState === "decision" && (
            <NextDecision
              transactionCount={transactions.length}
              onAddAnother={handleAddAnother}
              onFinish={handleFinish}
            />
          )}

          {flowState === "done" && (
            <div className="flex items-center justify-center min-h-[50vh] p-4">
              <div className="text-center">
                <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="size-8 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-base font-medium">Tersimpan</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Kembali ke Home...
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Keluar tanpa menyimpan?</AlertDialogTitle>
            <AlertDialogDescription>
              Perubahan yang belum disimpan akan hilang.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmExit}>
              Keluar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}