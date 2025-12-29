"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"

export default function AppGate() {
  const router = useRouter()

  useEffect(() => {
    const run = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        router.replace("/dashboard")
      } else {
        router.replace("/login")
      }
    }
    run()
  }, [router])

  return <div className="p-6">Loading...</div>
}