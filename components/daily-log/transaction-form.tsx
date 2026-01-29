"use client"

import type React from "react"
import { useEffect, useRef, useState, useActionState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Spinner } from "@/components/ui/spinner"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

import type { Transaction } from "@/src/domain/transactions/transactions.core"
import { createTransactionServer, type CreateTransactionResult } from "@/app/actions/create-transaction"

const expenseCategories = ["Makanan & Minuman", "Transport", "Belanja", "Tagihan", "Entertainment", "Lainnya"]
const incomeCategories = ["Gaji", "Bonus", "Freelance", "Bisnis", "Hadiah", "Lainnya"]
const wallets = ["Cash", "Bank", "E-wallet"]

interface TransactionFormProps {
  onSave: (transaction: Transaction, addAnother: boolean) => Promise<void>
  onFormChange: (hasChanges: boolean) => void
  transactionCount: number
}

const initialActionState: CreateTransactionResult | null = null

export function TransactionForm({ onSave, onFormChange, transactionCount }: TransactionFormProps) {
  const { toast } = useToast()
  const amountInputRef = useRef<HTMLInputElement>(null)

  // ----- Form state (UI lu tetap)
  const [type, setType] = useState<"expense" | "income">("expense")
  const [amount, setAmount] = useState("") // display formatted
  const [category, setCategory] = useState("")
  const [wallet, setWallet] = useState("Cash")
  const [note, setNote] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Submit state (kita pakai action-state dari server)
  const [actionState, formAction, isPending] = useActionState(createTransactionServer, initialActionState)

  // Autofocus
  useEffect(() => {
    amountInputRef.current?.focus()
  }, [])

  // Inform parent kalau ada perubahan
  useEffect(() => {
    const hasChanges = amount.length > 0 || note.length > 0 || category.length > 0
    onFormChange(hasChanges)
  }, [amount, note, category, onFormChange])

  // Reset kategori kalau tipe berubah
  useEffect(() => {
    setCategory("")
  }, [type])

  const categories = type === "expense" ? expenseCategories : incomeCategories

  const formatCurrency = (value: string) => {
    const number = value.replace(/[^0-9]/g, "")
    if (!number) return ""
    return new Intl.NumberFormat("id-ID").format(Number.parseInt(number, 10))
  }

  const getAmountRaw = () => amount.replace(/[^0-9]/g, "") // for server

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value)
    setAmount(formatted)
    if (errors.amount) setErrors((prev) => ({ ...prev, amount: "" }))
  }

  const validateClient = () => {
    const newErrors: Record<string, string> = {}

    const numAmount = getAmountRaw()
    if (!numAmount || Number.parseInt(numAmount, 10) === 0) {
      newErrors.amount = "Jumlah harus lebih dari 0"
    }
    if (!category) {
      newErrors.category = "Pilih kategori"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const resetForm = () => {
    setAmount("")
    setCategory("")
    setNote("")
    setType("expense")
    setWallet("Cash")
    setErrors({})
    onFormChange(false)
    amountInputRef.current?.focus()
  }

  // Handle hasil dari server action (toast + onSave + reset)
  useEffect(() => {
    if (!actionState) return

    if (!actionState.ok) {
      toast({
        variant: "destructive",
        title: "Gagal menyimpan",
        description: actionState.error,
      })
      return
    }

    // sukses
    toast({
      title: "Tersimpan",
      description: "Transaksi berhasil dicatat",
    })

    // tetap panggil onSave biar flow/UX lu gak rusak
    // casting ke Transaction: sesuaikan kalau type Transaction lu beda, tapi minimal field penting udah ada
    onSave(actionState.transaction as unknown as Transaction, actionState.addAnother)

    if (actionState.addAnother) {
      // reset tapi tetap di form
      resetForm()
    } else {
      // reset juga; parent bisa navigate/back kalau mereka mau
      resetForm()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionState?.submissionId])

  const canAddMore = transactionCount < 3

  return (
    <form
      action={formAction}
      className="px-4 py-6 max-w-md mx-auto pb-32"
      onSubmit={(e) => {
        // Client validation dulu (biar UX lu tetep)
        if (!validateClient()) {
          e.preventDefault()
          return
        }
      }}
    >
      {/* ===== Hidden inputs supaya Server Action dapet value state (karena Select/Toggle bukan native) ===== */}
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="amount" value={getAmountRaw()} />
      <input type="hidden" name="category" value={category} />
      <input type="hidden" name="wallet" value={wallet} />
      <input type="hidden" name="notes" value={note} />
      <input type="hidden" name="date" value={new Date().toISOString().slice(0, 10)} />

      {/* default: Simpan (tidak addAnother) */}
      <input type="hidden" name="addAnother" value="0" />

      <div className="space-y-6">
        <div className="space-y-3">
          <Label>Tipe</Label>
          <ToggleGroup
            type="single"
            value={type}
            onValueChange={(value) => value && setType(value as "expense" | "income")}
            className="w-full"
            variant="outline"
          >
            <ToggleGroupItem value="expense" className="flex-1">
              Pengeluaran
            </ToggleGroupItem>
            <ToggleGroupItem value="income" className="flex-1">
              Pemasukan
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount_display">Jumlah (Rp)</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">Rp</span>
            <Input
              ref={amountInputRef}
              id="amount_display"
              type="text"
              inputMode="numeric"
              value={amount}
              onChange={handleAmountChange}
              placeholder="0"
              className={cn("pl-10 text-lg h-12", errors.amount && "border-destructive")}
            />
          </div>
          {errors.amount && <p className="text-xs text-destructive">{errors.amount}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Kategori</Label>
          <Select value={category} onValueChange={(v) => { setCategory(v); if (errors.category) setErrors((p) => ({...p, category: ""})) }}>
            <SelectTrigger id="category" className={cn("w-full h-11", errors.category && "border-destructive")}>
              <SelectValue placeholder="Pilih kategori" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="wallet">Wallet</Label>
          <Select value={wallet} onValueChange={setWallet}>
            <SelectTrigger id="wallet" className="w-full h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {wallets.map((w) => (
                <SelectItem key={w} value={w}>
                  {w}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="note">Catatan (opsional)</Label>
          <Textarea
            id="note"
            value={note}
            onChange={(e) => {
              const value = e.target.value
              if (value.length <= 120) setNote(value)
            }}
            placeholder="Contoh: kopi + roti"
            className="min-h-20 max-h-32 resize-none"
            maxLength={120}
          />
          <p className="text-xs text-muted-foreground text-right">{note.length} / 120</p>
        </div>
      </div>

      {/* ===== Footer buttons (tetap) ===== */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-4 space-y-3">
        <div className="max-w-md mx-auto space-y-3">
          {/* Simpan */}
          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-12 text-base font-medium"
            onClick={() => {
              // pastiin hidden addAnother = 0 sebelum submit
              const addAnotherInput = document.querySelector('input[name="addAnother"]') as HTMLInputElement | null
              if (addAnotherInput) addAnotherInput.value = "0"
            }}
          >
            {isPending ? <Spinner className="size-5" /> : "Simpan"}
          </Button>

          {/* Simpan & Tambah Lagi */}
          {canAddMore && (
            <Button
              type="submit"
              disabled={isPending}
              variant="outline"
              className="w-full h-12 text-base"
              onClick={() => {
                const addAnotherInput = document.querySelector('input[name="addAnother"]') as HTMLInputElement | null
                if (addAnotherInput) addAnotherInput.value = "1"
              }}
            >
              {isPending ? <Spinner className="size-5" /> : "Simpan & Tambah Lagi"}
            </Button>
          )}

          <p className="text-xs text-muted-foreground text-center">
            {transactionCount === 0 ? "Kamu bisa tambah 1–3 transaksi, cepat." : `${transactionCount} dari 3 transaksi`}
          </p>
        </div>
      </div>
    </form>
  )
}