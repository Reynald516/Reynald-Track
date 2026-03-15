// app/api/ai/chat/route.ts

import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

const RTR_BASE_URL = process.env.RTR_ENGINE_URL!

export async function POST(req: Request) {
  try {
    // 1️⃣ INIT SUPABASE
    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    // 2️⃣ AUTH
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 3️⃣ GET BODY
    const body = await req.json().catch(() => ({}))
    const { message } = body

    if (!message) {
      return NextResponse.json({
        ok: false,
        message: "Message kosong",
      })
    }

    // 4️⃣ CALL RTR CHAT
    const rtrRes = await fetch(`${RTR_BASE_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.id,
        message,
      }),
    })

    if (!rtrRes.ok) {
      throw new Error("RTR chat error")
    }

    const rtrData = await rtrRes.json()

    // 5️⃣ RETURN
    return NextResponse.json({
      ok: true,
      answer: rtrData.response ?? rtrData.answer ?? "Aku belum bisa menyimpulkan itu dari datamu.",
    })

  } catch (err) {
    console.error("AI CHAT ERROR:", err)

    return NextResponse.json({
      ok: false,
      message: "AI sementara belum tersedia",
    })
  }
}