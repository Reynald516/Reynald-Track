import { createSupabaseServerClient } from "@/lib/supabase/server"
import { WalletsView } from "@/components/views/wallets-view"
import { getWalletBalances } from "@/components/views/wallets-actions"
import { redirect } from "next/navigation"

export default async function WalletsPage() {
  const supabase = await createSupabaseServerClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData?.user) redirect("/login")

  const wallets = await getWalletBalances()

  // ini menyesuaikan signature WalletsView lu yang ada isDarkMode
  // kalau isDarkMode lu ambil dari context, keep saja.
  return <WalletsView isDarkMode={false} onToggleTheme={() => {}} wallets={wallets ?? []} />
}