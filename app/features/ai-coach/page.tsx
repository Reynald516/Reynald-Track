"use client"

import { ComingSoon } from "@/components/coming-soon"
import { MessageSquare } from "lucide-react"

export default function AICoachPage() {
  return (
    <ComingSoon
      icon={MessageSquare}
      title="AI Coach Chat"
      description="Chat langsung dengan Reynald Intelligence untuk mendapat saran finansial personal, penjelasan pola spending, atau rencana hemat."
      whyImportant="AI Coach memberikan perspektif objektif tentang kebiasaan finansial Anda dengan tone yang supportif, bukan menghakimi."
    />
  )
}
