"use client"

import { ComingSoon } from "@/components/coming-soon"
import { FileBarChart } from "lucide-react"

export default function ReportsPage() {
  return (
    <ComingSoon
      icon={FileBarChart}
      title="Reports & Analytics"
      description="Dapatkan laporan lengkap tentang pengeluaran, pemasukan, tren, dan kategori. Pilih periode harian, mingguan, atau bulanan."
      whyImportant="Data analytics membantu Anda memahami pola pengeluaran dan membuat keputusan finansial yang lebih cerdas berdasarkan fakta."
    />
  )
}
