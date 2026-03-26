import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

const RTR_BASE_URL = process.env.RTR_ENGINE_URL!

export async function POST(req: Request) {
  try {
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

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json().catch(() => ({}))
    const { message } = body

    if (!message) {
      return NextResponse.json({
        ok: false,
        message: "Message kosong",
      })
    }

    // ↓ TAMBAH DI SINI
    console.log("🔵 RTR_ENGINE_URL:", RTR_BASE_URL)
    console.log("🔵 user_id:", user.id)
    console.log("🔵 message:", message)

    const rtrRes = await fetch(`${RTR_BASE_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.id,
        message,
      }),
      signal: AbortSignal.timeout(15000),
    })

    console.log("🟢 RTR status:", rtrRes.status)

    const rtrData = await rtrRes.json()
    console.log("🟢 RTR response:", JSON.stringify(rtrData))
    // ↑ SAMPAI SINI

    return NextResponse.json({
      ok: true,
      answer: rtrData.response ?? rtrData.answer ?? "Aku belum bisa menyimpulkan itu dari datamu.",
    })

  } catch (err) {
    console.error("❌ AI CHAT ERROR:", err)

    return NextResponse.json({
      ok: false,
      message: "AI sementara belum tersedia",
    })
  }
}