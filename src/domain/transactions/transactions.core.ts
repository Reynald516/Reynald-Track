export interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string | null;
  date: string;
  created_at: string;
  user_id: string;
  type: "income" | "expense";
  notes: string | null;
  emotion_id: string | null;
}

export function sortTransactionsByDate(tx: Transaction[]) {
  return [...tx].sort((a, b) => a.date.localeCompare(b.date));
}