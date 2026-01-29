"use client"

import { ComingSoon } from "@/components/coming-soon"
import { LinkIcon } from "lucide-react"

export default function ConnectedAccountsPage() {
  return (
    <ComingSoon
      icon={LinkIcon}
      title="Connected Accounts"
      description="Hubungkan rekening bank, e-wallet, dan kartu kredit untuk sinkronisasi transaksi otomatis."
      whyImportant="Open banking memungkinkan tracking real-time tanpa input manual. Data akurat, effort minimal."
    />
  )
}
