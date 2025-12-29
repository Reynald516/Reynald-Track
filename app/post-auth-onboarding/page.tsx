"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"

export default function PostAuthOnboardingPage() {
  const [name, setName] = useState("")
  const router = useRouter()

  const submit = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user || !name.trim()) return

    await supabase
      .from("profiles")
      .update({ name })
      .eq("id", user.id)

    router.replace("/")
  }

  return (
    <div>
      <input
        placeholder="Nama kamu"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={submit}>Lanjut</button>
    </div>
  )
}