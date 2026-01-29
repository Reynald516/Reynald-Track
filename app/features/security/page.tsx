"use client"

import { ComingSoon } from "@/components/coming-soon"
import { Shield } from "lucide-react"

export default function SecurityPage() {
  return (
    <ComingSoon
      icon={Shield}
      title="Security & Privacy"
      description="Atur keamanan akun dengan PIN, biometric lock, 2FA, dan kontrol privasi data Anda."
      whyImportant="Data finansial adalah data sensitif. Keamanan berlapis memastikan hanya Anda yang dapat mengakses informasi pribadi."
    />
  )
}
