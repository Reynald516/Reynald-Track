// middleware.ts

import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Route yang boleh diakses tanpa login
  const publicRoutes = ["/pre-onboarding", "/login", "/signup", "/auth/callback"]
  const isPublic = publicRoutes.some((r) => pathname.startsWith(r))

  // Buat supabase client untuk cek session
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  // 1. Kalau sudah login dan akses public route → langsung ke app
  if (session && isPublic && pathname !== "/auth/callback") {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // 2. Kalau belum login dan akses protected route → ke pre-onboarding
  if (!session && !isPublic) {
    return NextResponse.redirect(new URL("/pre-onboarding", request.url))
  }

  return response
}

export const config = {
  matcher: [
    // Jalankan middleware di semua route kecuali static files & api
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}