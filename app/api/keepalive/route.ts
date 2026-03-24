import { NextResponse } from "next/server"

export async function GET() {
  const engineUrl = process.env.RTR_ENGINE_URL
  if (!engineUrl) return NextResponse.json({ ok: false })

  try {
    await fetch(`${engineUrl}/`, { signal: AbortSignal.timeout(10000) })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false })
  }
}