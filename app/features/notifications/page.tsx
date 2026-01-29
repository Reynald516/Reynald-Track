"use client"

import { ComingSoon } from "@/components/coming-soon"
import { Bell } from "lucide-react"

export default function NotificationsPage() {
  return (
    <ComingSoon
      icon={Bell}
      title="Notifications"
      description="Atur notifikasi untuk reminder transaksi, budget warning, goal progress, dan AI insights."
      whyImportant="Notifikasi yang tepat membantu Anda tetap aware tanpa mengganggu. Kontrol penuh atas apa yang ingin Anda ketahui."
    />
  )
}
