import { supabase } from "@/lib/supabase/client"

/**
 * GET ALL USER TRANSACTIONS
 */
export async function getUserTransactions(userId: string) {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching transactions:", error)
    throw new Error(error.message)
  }

  return data ?? []
}

/**
 * UPDATE TRANSACTION — RLS SAFE
 */
export async function updateTransaction(
  id: string,
  data: {
    amount: number
    category: string
    wallet: string
    note?: string | null
  }
) {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error("User not authenticated")
  }

  const { error } = await supabase
    .from("transactions")
    .update({
      amount: data.amount,
      category: data.category,
      wallet: data.wallet,
      note: data.note ?? null,
    })
    .eq("id", id)
    .eq("user_id", user.id) // 🔥 INI KUNCI RLS
    .select()
    .single()

  if (error) {
    console.error("Error updating transaction:", error)
    throw new Error(error.message)
  }
}

/**
 * DELETE TRANSACTION — RLS SAFE
 */
export async function deleteTransaction(id: string) {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error("User not authenticated")
  }

  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) {
    console.error("Error deleting transaction:", error)
    throw new Error(error.message)
  }
}