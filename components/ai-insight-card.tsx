import { Card, CardContent } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

interface AIInsightCardProps {
  title: string
  message: string
}

export function AIInsightCard({ title, message }: AIInsightCardProps) {
  return (
    <Card className="border-0 shadow-soft-md bg-gradient-to-br from-[var(--ai-accent)]/[0.05] to-[var(--ai-accent)]/[0.08] card-float">
      <CardContent className="p-5">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-[var(--ai-accent)]/15 flex items-center justify-center transition-smooth hover:bg-[var(--ai-accent)]/20">
              <Sparkles className="w-4.5 h-4.5 text-[var(--ai-accent)]" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-foreground mb-1.5">{title}</h3>
            <p className="text-sm text-muted-foreground empty-elegant">{message}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
