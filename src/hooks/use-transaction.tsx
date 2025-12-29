"use client"

import { useCallback, useEffect, useState } from "react"
import type { Transaction } from "@/src/domain/transactions/transactions.core"
import { fetchTransactions } from "@/src/adapters/transactions.supabase"

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchTransactions()
      setTransactions(data)
    } catch (e: any) {
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
    refresh: load, // ⬅️ INI KUNCI
  }
}