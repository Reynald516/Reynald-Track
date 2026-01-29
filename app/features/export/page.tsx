"use client"

import { ComingSoon } from "@/components/coming-soon"
import { Download } from "lucide-react"

export default function ExportPage() {
  return (
    <ComingSoon
      icon={Download}
      title="Data Export"
      description="Export data transaksi Anda ke format CSV, Excel, atau PDF untuk keperluan pribadi atau akuntan."
      whyImportant="Kontrol penuh atas data Anda. Export memudahkan backup, perpajakan, dan analisis lebih lanjut di luar aplikasi."
    />
  )
}
