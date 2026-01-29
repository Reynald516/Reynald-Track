import { supabase } from "@/lib/supabase/client"

export async function getCategoryBudget(
  userId: string,
  category: string,
  month: string
) {
  const { data, error } = await supabase
    .from("budget_categories")
    .select("*")
    .eq("user_id", userId)
    .eq("category", category)
    .eq("month", month)
    .single()

  if (error && error.code !== "PGRST116") {
    throw error
  }

  return data
}

export async function upsertCategoryBudget(
  userId: string,
  category: string,
  amount: number,
  month: string
) {
  const { error } = await supabase
    .from("budget_categories")
    .upsert(
      {
        user_id: userId,
        category,
        amount,
        month,
        updated_at: new Date().toISOString(),
      },
      {
        // 🔑 INI KUNCINYA
        onConflict: "user_id,category,month",
      }
    )

  if (error) throw error
}