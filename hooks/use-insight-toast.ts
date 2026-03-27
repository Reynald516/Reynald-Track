// hooks/use-insight-toast.ts

import { useToast } from "@/hooks/use-toast"

export function useInsightToast() {
  const { toast } = useToast()

  const showInsight = async (transaction: {
    amount: number
    type: "income" | "expense"
    category: string
    note?: string
  }) => {
    // Layer 1: Toast instant
    const instantMsg = transaction.type === "income"
      ? `💰 ${transaction.category} Rp ${transaction.amount.toLocaleString("id-ID")} masuk`
      : `📝 ${transaction.category} Rp ${transaction.amount.toLocaleString("id-ID")} tercatat`

    toast({
      title: instantMsg,
      duration: 2000,
    })

    // Layer 2: AI Insight async (non-blocking)
    try {
      const res = await fetch("/api/ai/generate-insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transaction }),
      })
      const data = await res.json()

      if (data?.insight) {
        setTimeout(() => {
          toast({
            title: "💡 RTR insight",
            description: data.insight,
            duration: 5000,
          })
        }, 500)
      }
    } catch {
      // Gagal AI insight → no problem, instant toast sudah muncul
    }
  }

  return { showInsight }
}