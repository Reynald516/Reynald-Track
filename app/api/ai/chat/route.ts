import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

const RTR_BASE_URL =
  process.env.RTR_ENGINE_URL || "https://rtr-engine.onrender.com"

export async function POST(req: Request) {
  try {
    // ==============================
    // 1️⃣ INIT SUPABASE DARI COOKIE
    // ==============================
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

    // ==============================
    // 2️⃣ AMBIL USER LOGIN
    // ==============================
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser()

    if (!user || userErr) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const userId = user.id

    // ==============================
    // 3️⃣ AMBIL MESSAGE
    // ==============================
    const body = await req.json()
    const { message } = body

    if (!message) {
      return NextResponse.json(
        { error: "message wajib" },
        { status: 400 }
      )
    }

    // ==============================
    // 4️⃣ PAKSA ANALYZE USER DULU
    // ==============================
    await fetch(
      `${RTR_BASE_URL}/analyze_user?user_id=${userId}`,
      { method: "POST" }
    )

    // ==============================
    // 5️⃣ CHAT KE RTR ENGINE
    // ==============================
    const chatRes = await fetch(
      `${RTR_BASE_URL}/chat?user_id=${userId}&message=${encodeURIComponent(
        message
      )}`,
      { method: "POST" }
    )

    if (!chatRes.ok) {
      const errText = await chatRes.text()
      throw new Error(errText)
    }

    const data = await chatRes.json()

    return NextResponse.json({
      ok: true,
      answer:
        data?.ai_message ||
        data?.answer ||
        "Aku belum bisa menjawab itu.",
    })
  } catch (err) {
    console.error("AI CHAT ERROR:", err)

    return NextResponse.json(
      {
        ok: false,
        answer:
          "AI sedang sibuk atau belum aktif. Coba lagi sebentar ya 🙏",
      },
      { status: 500 }
    )
  }
}