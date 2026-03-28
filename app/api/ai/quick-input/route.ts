// app/api/ai/quick-input/route.ts

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
      { cookies: { get(name: string) { return cookieStore.get(name)?.value } } }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const { raw, wallet_id } = body

    const rtrRes = await fetch(`${RTR_BASE_URL}/quick-input`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.id,
        raw,
        wallet_id: wallet_id ?? null,
      }),
      signal: AbortSignal.timeout(10000),
    })

    const data = await rtrRes.json()
    return NextResponse.json(data)

  } catch (err) {
    return NextResponse.json({ status: "error", message: "Gagal konek ke server" })
  }
}