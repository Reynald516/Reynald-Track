"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export function AddTransactionForm({
  onBack,
  onSuccess,
}: {
  onBack: () => void
  onSuccess: () => void
}) {
  const [type, setType] = useState<"expense" | "income">("expense")
  const [amount, setAmount] = useState("")

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button size="icon" variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Tambah Transaksi</h1>
      </div>

      <RadioGroup
        value={type}
        onValueChange={(v) => setType(v as any)}
        className="grid grid-cols-2 gap-1 rounded-2xl bg-muted p-1"
      >
        {["expense", "income"].map((v) => (
          <div key={v}>
            <RadioGroupItem value={v} id={v} className="sr-only" />
            <Label
              htmlFor={v}
              className={`flex h-10 items-center justify-center rounded-xl text-sm font-semibold ${
                type === v
                  ? "bg-background shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              {v === "expense" ? "Pengeluaran" : "Pemasukan"}
            </Label>
          </div>
        ))}
      </RadioGroup>

      <div>
        <Label className="text-muted-foreground">Nominal</Label>
        <div className="relative mt-2">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold">
            Rp
          </span>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="h-14 pl-12 text-xl font-bold"
            placeholder="0"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-muted-foreground">Kategori</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Pilih" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="food">🍔 Makanan</SelectItem>
              <SelectItem value="transport">🚗 Transport</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-muted-foreground">Wallet</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Pilih" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="bca">BCA</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label className="text-muted-foreground">Catatan</Label>
        <Textarea placeholder="Opsional" />
      </div>

      <Button
        size="lg"
        className="h-14 rounded-2xl text-lg font-bold"
        disabled={!amount}
        onClick={onSuccess}
      >
        Simpan Transaksi
      </Button>
    </div>
  )
}