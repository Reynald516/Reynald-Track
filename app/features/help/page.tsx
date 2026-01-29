"use client"

import { ComingSoon } from "@/components/coming-soon"
import { HelpCircle } from "lucide-react"

export default function HelpPage() {
  return (
    <ComingSoon
      icon={HelpCircle}
      title="Help Center"
      description="Temukan jawaban atas pertanyaan umum, tutorial lengkap, dan cara menghubungi support tim."
      whyImportant="Akses cepat ke bantuan memastikan Anda tidak stuck dan bisa memaksimalkan semua fitur ReynaldTrack."
    />
  )
}
