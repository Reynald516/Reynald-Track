import { supabase } from "@/lib/supabase/client"
import type { Transaction } from "@/src/domain/transactions/transactions.core"

export async function fetchTransactions(): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .order("date", { ascending: false })

  if (error) throw error

  return (data ?? []).map(t => ({
    ...t,
    date: t.date?.slice(0, 10),
  }))
}