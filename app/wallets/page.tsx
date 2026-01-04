export const dynamic = "force-dynamic"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { WalletsView } from "@/components/views/wallets-view"
import {
  getWalletBalances,
  WalletBalanceRow,
} from "@/components/views/wallets-actions"
import { redirect } from "next/navigation"

export default async function WalletsPage() {
  const supabase = await createSupabaseServerClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData?.user) redirect("/login")

  let wallets: WalletBalanceRow[] = []

  try {
    wallets = await getWalletBalances()
  } catch (e) {
    console.error("wallet fetch error", e)
    wallets = []
  }

  return (
    <WalletsView
      isDarkMode={false}
      onToggleTheme={() => {}}
      wallets={wallets}
    />
  )
}