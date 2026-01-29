"use client"

import { ComingSoon } from "@/components/coming-soon"
import { Target } from "lucide-react"

export default function GoalsPage() {
  return (
    <ComingSoon
      icon={Target}
      title="Goals / Target"
      description="Tetapkan target finansial seperti tabungan, pembelian besar, atau dana darurat. Pantau progress dengan visual yang jelas."
      whyImportant="Target memberikan arah dan motivasi. Dengan visualisasi yang jelas, Anda bisa melihat kemajuan nyata menuju tujuan finansial."
    />
  )
}
