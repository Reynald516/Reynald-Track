// app/signup/page.tsx

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"

export default function SignupPage() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [googleLoading, setGoogleLoading] = useState(false)

  const signupWithEmail = async () => {
    const cleanName = name.trim()
    const cleanEmail = email.trim()

    if (!cleanName) return setError("Nama wajib diisi")
    if (!cleanEmail || !cleanEmail.includes("@"))
        return setError("Email tidak valid")
    if (!password || password.length < 8)
        return setError("Password minimal 8 karakter")

    setLoading(true)
    setError(null)

    const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
            data: {
                name: cleanName, // ⬅️ INI PENTING
            },
        },
    })

    if (error) {
        setError(error.message)
        setLoading(false)
        return
    }

    if (!data.session) {

        // Pastikan session aktif
        const { data: sessionData } = await supabase.auth.getSession()

        if (!sessionData.session) {
            setError("Session belum aktif. Pastikan Email Confirmation OFF.")
            setLoading(false)
            return
        }
    }

    // Force sign-in biar session pasti kebentuk
    const { error: signInErr } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
    })

    if (signInErr) {
        setError(signInErr.message)
        setLoading(false)
        return
    }
    
    setLoading(false)
    // 🚀 LANGSUNG MASUK APP
    router.replace("/app-gate")
  }

  const signupWithGoogle = async () => {
    setGoogleLoading(true)
    setError(null)
    
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    
    if (oauthError) {
      setError(oauthError.message)
      setGoogleLoading(false)
    }
  }

  
  return (
    <div className="min-h-screen bg-background px-6 py-10 overflow-y-auto">
      <div className="mx-auto w-full max-w-md space-y-6">
        <h1 className="text-2xl font-semibold text-center">
          Daftar Akun Baru
        </h1>

        <input
          type="text"
          placeholder="Nama"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            if (error) setError(null)
          }}
          className="w-full rounded-xl px-4 py-3 bg-muted"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (error) setError(null)
          }}
          className="w-full rounded-xl px-4 py-3 bg-muted"
        />

        <input
          type="password"
          placeholder="Password (min 8 karakter)"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            if (error) setError(null)
          }}
          className="w-full rounded-xl px-4 py-3 bg-muted"
        />

        <button
          onClick={signupWithEmail}
          disabled={loading}
          className="w-full rounded-xl bg-primary px-8 py-4 text-white disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Membuat akun..." : "Daftar"}
        </button>

        {error && (
          <p className="text-sm text-red-500 text-center">
            {error}
          </p>
        )}

        <div className="text-center text-sm opacity-70">atau</div>

        <button
          onClick={signupWithGoogle}
          disabled={googleLoading || loading}
          className="w-full flex items-center justify-center gap-3 rounded-xl border border-border bg-card py-4 text-sm font-medium hover:bg-muted transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {googleLoading ? (
            <span>Mengalihkan ke Google...</span>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>Daftar dengan Google</span>
            </>
          )}
        </button>

        <button
          disabled
          className="w-full rounded-xl border border-muted px-8 py-4 opacity-50 cursor-not-allowed"
        >
          Daftar dengan Apple (Soon)
        </button>

        <button
          disabled
          className="w-full rounded-xl border border-muted px-8 py-4 opacity-50 cursor-not-allowed"
        >
          Daftar dengan Phone (Soon)
        </button>

        <button
          disabled
          className="w-full rounded-xl border border-muted px-8 py-4 opacity-50 cursor-not-allowed"
        >
          Web3 Wallet (Soon)
        </button>

        <p className="text-sm text-center opacity-70">
          Sudah punya akun?{" "}
          <button
            onClick={() => router.push("/login")}
            className="text-primary underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  )
}