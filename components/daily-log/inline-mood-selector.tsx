"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { MoodData } from "@/domain/daily-log/daily-log"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

const moods = [
  { value: "tenang", label: "Tenang", emoji: "🙂" },
  { value: "netral", label: "Netral", emoji: "😐" },
  { value: "capek", label: "Capek", emoji: "😮‍💨" },
  { value: "stres", label: "Stres", emoji: "😡" },
]

interface InlineMoodSelectorProps {
  transactionId: string
  onSubmit: (mood: MoodData | null) => void
}

export function InlineMoodSelector({ transactionId, onSubmit }: InlineMoodSelectorProps) {
  const { toast } = useToast()
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleMoodSelect = async (moodValue: string) => {
    setSelectedMood(moodValue)
    setIsSubmitting(true)

    // Auto-submit instantly when mood is chosen
    try {
      await new Promise((resolve) => setTimeout(resolve, 300))

      const mood: MoodData = {
        transactionId,
        mood: moodValue,
        timestamp: new Date().toISOString(),
      }

      toast({
        title: "Mood tersimpan",
      })

      onSubmit(mood)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Gagal menyimpan mood",
      })
      setIsSubmitting(false)
    }
  }

  const handleSkip = () => {
    onSubmit(null)
  }

  return (
    <div className="px-4 py-6 max-w-md mx-auto">
      <Card className="border-border">
        <CardHeader className="gap-1">
          <CardTitle className="text-lg">Kondisi kamu saat transaksi ini?</CardTitle>
          <CardDescription>Opsional — bantu AI memahami pola emosionalmu</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {moods.map((mood) => (
              <button
                key={mood.value}
                onClick={() => handleMoodSelect(mood.value)}
                disabled={isSubmitting}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all",
                  "hover:border-primary/50 active:scale-95 disabled:opacity-50",
                  selectedMood === mood.value ? "border-primary bg-primary/10" : "border-border bg-card",
                )}
              >
                <span className="text-3xl">{mood.emoji}</span>
                <span className="text-sm font-medium">{mood.label}</span>
              </button>
            ))}
          </div>

          <Button onClick={handleSkip} disabled={isSubmitting} variant="ghost" className="w-full" size="lg">
            Lewati
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
