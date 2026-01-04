import { supabase } from "@/lib/supabase/client"

export async function getBudgetSummary(month: string) {
  const { data, error } = await supabase
    .from("budget_summary")
    .select("*")
    .eq("month", month)

  if (error) throw error
  return data
}