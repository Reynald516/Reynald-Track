"use client"

import { ComingSoon } from "@/components/coming-soon"
import { User } from "lucide-react"

export default function ProfilePage() {
  return (
    <ComingSoon
      icon={User}
      title="Profile"
      description="Kelola informasi profil Anda, foto, nama, email, dan preferensi personal lainnya."
      whyImportant="Personalisasi pengalaman Anda dan pastikan informasi akun tetap up-to-date."
    />
  )
}
