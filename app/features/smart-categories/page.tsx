"use client"

import { ComingSoon } from "@/components/coming-soon"
import { Tags } from "lucide-react"

export default function SmartCategoriesPage() {
  return (
    <ComingSoon
      icon={Tags}
      title="Smart Categories"
      description="AI secara otomatis mengkategorikan transaksi Anda berdasarkan merchant, jumlah, dan pola historis."
      whyImportant="Hemat waktu dengan kategorisasi otomatis. Semakin Anda menggunakan, semakin akurat AI dalam memahami kebiasaan Anda."
    />
  )
}
