"use client"

import { ComingSoon } from "@/components/coming-soon"
import { CreditCard } from "lucide-react"

export default function SubscriptionsPage() {
  return (
    <ComingSoon
      icon={CreditCard}
      title="Subscriptions Detector"
      description="AI mendeteksi transaksi berulang seperti Netflix, Spotify, atau langganan lain. Dapatkan notifikasi sebelum tanggal tagihan."
      whyImportant="Banyak orang lupa dengan subscription yang tidak terpakai. Fitur ini membantu Anda mengontrol pengeluaran berulang dan menghemat uang."
    />
  )
}
