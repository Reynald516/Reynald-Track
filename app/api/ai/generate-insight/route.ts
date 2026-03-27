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
    const { transaction } = body

    const rtrRes = await fetch(`${RTR_BASE_URL}/generate-insight`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id, transaction }),
      signal: AbortSignal.timeout(8000),
    })

    const data = await rtrRes.json()
    return NextResponse.json(data)

  } catch {
    return NextResponse.json({ insight: null })
  }
}