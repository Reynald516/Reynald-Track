"use client"

import { supabase } from "@/lib/supabase/client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
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

    await supabase.auth.getSession()
    setLoading(false)
    router.replace("/app-gate")
  }

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/app-gate`,
      },
    })
  }

  return (
    <div className="min-h-screen w-full overflow-y-auto bg-background">
      <div className="mx-auto max-w-md px-6 py-16 space-y-8">

        <h1 className="text-3xl font-semibold text-center">
          Masuk ke Akun
        </h1>

        <div className="space-y-4">
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl px-4 py-3 bg-muted"
          />

          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl px-4 py-3 bg-muted"
          />

          <button
            onClick={loginWithEmail}
            disabled={loading}
            className="w-full rounded-xl bg-primary py-4 text-white"
          >
            {loading ? "Memproses..." : "Masuk dengan Email"}
          </button>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}
        </div>

        <div className="text-center text-sm opacity-60">atau</div>

        <button
          onClick={loginWithGoogle}
          className="w-full rounded-xl bg-primary py-4 text-white"
        >
          Masuk dengan Google
        </button>

        <div className="space-y-2 opacity-50">
          <button disabled className="w-full rounded-xl border py-3">
            Masuk dengan Apple (Soon)
          </button>
          <button disabled className="w-full rounded-xl border py-3">
            Masuk dengan Phone (Soon)
          </button>
          <button disabled className="w-full rounded-xl border py-3">
            Web3 Wallet (Soon)
          </button>
        </div>

        <p className="text-center text-sm opacity-70">
          Belum punya akun?{" "}
          <button
            onClick={() => router.push("/signup")}
            className="text-primary underline"
          >
            Daftar
          </button>
        </p>

      </div>
    </div>
  )
}