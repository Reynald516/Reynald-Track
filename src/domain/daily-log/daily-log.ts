export interface Transaction {
  id: string
  type: "income" | "expense"
  amount: number
  category: string
  wallet: string
  note?: string
}

export interface MoodData {
  transactionId: string
  mood: string
  timestamp: string
}
