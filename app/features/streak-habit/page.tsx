"use client"

import { ComingSoon } from "@/components/coming-soon"
import { Flame } from "lucide-react"

export default function StreakHabitPage() {
  return (
    <ComingSoon
      icon={Flame}
      title="Streak & Habit"
      description="Lihat berapa hari berturut-turut Anda mencatat transaksi. Dapatkan badge dan motivasi untuk konsisten."
      whyImportant="Habit tracking membuat Anda tetap disiplin. Konsistensi adalah kunci untuk mengubah kebiasaan finansial jangka panjang."
    />
  )
}
