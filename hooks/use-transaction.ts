// hooks/use-transaction.ts

"use client"

import { useCallback, useEffect, useState } from "react"
import { getUserTransactions } from "@/lib/transactions.supabase"
import { supabase } from "@/lib/supabase/client"

type Transaction = {
  id: string
  amount: number
  category: string
  type: string
  created_at: string
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("User not authenticated")
      }

      const data = await getUserTransactions(user.id)
      console.log("RAW TRANSACTIONS:", data)
      setTransactions(data)
    } catch (e: any) {
      console.error(e)
      setError(e?.message ?? "Failed to load transactions")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return {
    transactions,
    loading,
    error,
    refresh: load,
  }
}