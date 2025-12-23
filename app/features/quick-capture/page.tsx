"use client"

import { ComingSoon } from "@/components/coming-soon"
import { Zap } from "lucide-react"

export default function QuickCapturePage() {
  return (
    <ComingSoon
      icon={Zap}
      title="Capture to Record (CTR)"
      description="Catat transaksi dalam hitungan detik tanpa banyak input. Sempurna untuk transaksi cepat di perjalanan."
      whyImportant="CTR memudahkan pencatatan spontan sehingga tidak ada transaksi yang terlewat, bahkan saat Anda sedang sibuk."
    />
  )
}
