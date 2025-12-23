// src/adapters/transactions.supabase.ts
import { supabase } from "@/lib/supabase";
import { Transaction } from "@/domain/transactions/transactions.core";

export async function fetchTransactions(): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .order("date", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}