"use client";

import { useEffect, useState } from "react";
import { Transaction } from "@/src/domain/transactions/transactions.core"
import { fetchTransactions } from "@/src/adapters/transactions.supabase"

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTransactions()
      .then(data => {
        console.log("[shadow] transactions fetched:", data);
        setTransactions(data);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return {
    transactions,
    loading,
    error,
  };
}