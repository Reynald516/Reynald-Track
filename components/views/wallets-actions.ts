"use server"

import { createSupabaseServerClient } from "@/lib/supabase/server"

export type WalletBalanceRow = {
  wallet_id: string
  name: string
  kind: string
  icon_key: string | null
  sort_order: number
  balance: number
}

export async function getWalletBalances(): Promise<WalletBalanceRow[]> {
  const supabase = await createSupabaseServerClient()

  const { data: authData, error: authError } = await supabase.auth.getUser()
  if (authError || !authData?.user) throw new Error("Unauthorized")

  const { data, error } = await supabase
    .from("v_wallet_balances")
    .select("wallet_id,name,kind,icon_key,sort_order,balance")
    .eq("user_id", authData.user.id)
    .order("sort_order", { ascending: true })

  if (error) throw new Error(error.message)

  return (data ?? []) as WalletBalanceRow[]
}