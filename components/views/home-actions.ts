"use server"

import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function getTodayCashflow() {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from("v_cashflow_daily")
    .select("income, expense, net")
    .single()

  if (error) throw error
  return data
}