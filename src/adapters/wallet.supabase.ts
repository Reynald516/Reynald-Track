import { supabase } from "@/lib/supabase/client"
import type { WalletBalanceRow } from "@/components/views/wallets-actions"

export async function fetchWalletBalances(): Promise<WalletBalanceRow[]> {
  const { data, error } = await supabase
    .from("wallet_balances")
    .select("*")
    .order("sort_order")

  if (error) throw error
  return data ?? []
}