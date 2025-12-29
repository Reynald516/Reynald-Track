import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")

  if (!code) {
    return NextResponse.redirect(`${origin}/login`)
  }

  const supabase = await createSupabaseServerClient()

  // 1) Tuker code -> session
  const { data: exchangeData, error: exchangeError } =
    await supabase.auth.exchangeCodeForSession(code)

  if (exchangeError) {
    return NextResponse.redirect(`${origin}/login`)
  }

  const userId = exchangeData.user?.id
  if (!userId) {
    return NextResponse.redirect(`${origin}/login`)
  }

  // 2) Pastikan profile ada (buat google signup)
  // name google bisa diambil dari user metadata kalau ada
  const fullName =
    (exchangeData.user?.user_metadata?.full_name as string) ||
    (exchangeData.user?.user_metadata?.name as string) ||
    "User"

  await supabase.from("profiles").upsert({
    id: userId,
    name: fullName,
  })

  // 3) Masuk app
  return NextResponse.redirect(`${origin}/app-gate`)
}