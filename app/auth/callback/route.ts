// app/auth/callback/route.ts

import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")

  if (!code) {
    return NextResponse.redirect(`${origin}/login`)
  }

  const supabase = await createSupabaseServerClient()

  const { data: exchangeData, error: exchangeError } =
    await supabase.auth.exchangeCodeForSession(code)

  if (exchangeError) {
    return NextResponse.redirect(`${origin}/login`)
  }

  const userId = exchangeData.user?.id
  if (!userId) {
    return NextResponse.redirect(`${origin}/login`)
  }

  // FIX: pakai full_name sesuai schema profiles
  const fullName =
    (exchangeData.user?.user_metadata?.full_name as string) ||
    (exchangeData.user?.user_metadata?.name as string) ||
    "User"

  const email = exchangeData.user?.email || ""

  // FIX: upsert dengan kolom yang benar
  await supabase.from("profiles").upsert(
    {
      id: userId,
      full_name: fullName,
      email: email,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  )

  return NextResponse.redirect(`${origin}/app-gate`)
}