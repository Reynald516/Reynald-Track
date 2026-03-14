// src/adapters/wallet.supabase.ts

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

// Fetch wallets for transaction form dropdown
export type WalletOption = {
  id: string
  name: string
}

export async function fetchWallets(): Promise<WalletOption[]> {
  const { data, error } = await supabase
    .from("wallets")
    .select("id, name")
    .order("name")

  if (error) throw error
  return data ?? []
}
