import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface SummaryCardProps {
  icon: LucideIcon
  label: string
  value: string
  variant?: "income" | "expense" | "neutral"
}

export function SummaryCard({ icon: Icon, label, value, variant = "neutral" }: SummaryCardProps) {
  const variantStyles = {
    income: {
      iconBg: "bg-[var(--success)]/10 hover:bg-[var(--success)]/15",
      iconColor: "text-[var(--success)]",
      valueColor: "text-[var(--success)]",
    },
    expense: {
      iconBg: "bg-destructive/10 hover:bg-destructive/15",
      iconColor: "text-destructive",
      valueColor: "text-destructive",
    },
    neutral: {
      iconBg: "bg-foreground/10 hover:bg-foreground/15",
      iconColor: "text-foreground",
      valueColor: "text-foreground",
    },
  }

  const styles = variantStyles[variant]

  return (
    <Card className="border-0 shadow-soft-md hover:shadow-soft-lg bg-card card-float">
      <CardContent className="p-5">
        <div className="flex items-center gap-4">
          <div
            className={`w-11 h-11 rounded-[0.875rem] flex items-center justify-center transition-smooth ${styles.iconBg}`}
          >
            <Icon className={`w-5 h-5 ${styles.iconColor}`} strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <p className="text-[0.65rem] font-bold text-muted-foreground uppercase tracking-[0.1em] mb-1 opacity-70">
              {label}
            </p>
            <p
              className={`text-[1.375rem] font-bold tracking-[-0.02em] leading-none ${styles.valueColor}`}
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {value}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
