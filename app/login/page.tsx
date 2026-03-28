// app/login/page.tsx

"use client"

import { supabase } from "@/lib/supabase/client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loginWithEmail = async () => {
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setLoading(false)
    router.replace("/app-gate")
  }

  const loginWithGoogle = async () => {
    setGoogleLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        // FIX: harus ke /auth/callback dulu, bukan langsung /app-gate
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setGoogleLoading(false)
    }
    // Kalau sukses browser otomatis redirect ke Google
  }

  return (
    <div className="min-h-screen w-full overflow-y-auto bg-background">
      <div className="mx-auto max-w-md px-6 py-16 space-y-8">

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold">Masuk ke Akun</h1>
          <p className="text-sm text-muted-foreground">Kelola keuanganmu dengan RTR</p>
        </div>

        {/* Google Button — paling atas, paling prominent */}
        <button
          onClick={loginWithGoogle}
          disabled={googleLoading || loading}
          className="w-full flex items-center justify-center gap-3 rounded-xl border border-border bg-card py-4 text-sm font-medium hover:bg-muted transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {googleLoading ? (
            <span className="text-sm">Mengalihkan ke Google...</span>
          ) : (
            <>
              {/* Google Icon SVG */}
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span>Masuk dengan Google</span>
            </>
          )}
        </button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">atau dengan email</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Email Form */}
        <div className="space-y-3">
          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(null) }}
            className="w-full rounded-xl px-4 py-3 bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/30"
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(null) }}
            className="w-full rounded-xl px-4 py-3 bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/30"
          />

          {error && (
            <p className="text-xs text-red-500 text-center">{error}</p>
          )}

          <button
            onClick={loginWithEmail}
            disabled={loading || googleLoading}
            className="w-full rounded-xl bg-primary py-4 text-white text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </div>

        {/* Soon options */}
        <div className="space-y-2">
          <button disabled className="w-full rounded-xl border border-border py-3 text-sm opacity-40 cursor-not-allowed">
            Masuk dengan Apple (Soon)
          </button>
          <button disabled className="w-full rounded-xl border border-border py-3 text-sm opacity-40 cursor-not-allowed">
            Masuk dengan Phone (Soon)
          </button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Belum punya akun?{" "}
          <button onClick={() => router.push("/signup")} className="text-primary underline font-medium">
            Daftar
          </button>
        </p>

      </div>
    </div>
  )
}