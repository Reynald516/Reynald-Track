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
    setLoading(true)
    setError(null)

    const origin =
      typeof window !== "undefined" ? window.location.origin : ""

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        // Pastikan route callback ini ada (gue kasih filenya di bawah)
        redirectTo: `${origin}/auth/callback`,
      },
    })

    if (oauthError) {
      setError(oauthError.message)
      setLoading(false)
      return
    }

    // NOTE:
    // Setelah ini user bakal ke Google -> balik ke /auth/callback
    // jadi kita gak router.replace di sini.
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
          disabled={loading}
          className="w-full rounded-xl bg-primary px-8 py-4 text-white disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Mengalihkan..." : "Daftar dengan Google"}
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