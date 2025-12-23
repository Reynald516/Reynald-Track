"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { type LucideIcon, ChevronRight } from "lucide-react"

interface PrimaryActionCardProps {
  icon: LucideIcon
  title: string
  subtitle: string
  buttonText: string
  onAction: () => void
}

export function PrimaryActionCard({ icon: Icon, title, subtitle, buttonText, onAction }: PrimaryActionCardProps) {
  return (
    <Card className="border-0 shadow-soft-xl bg-gradient-to-br from-card via-accent/[0.04] to-accent/[0.08] overflow-hidden relative card-float group">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_25%,_var(--accent)_0%,_transparent_55%)] opacity-[0.15] group-hover:opacity-[0.2] transition-smooth" />
      <CardContent className="p-8 relative">
        <div className="text-center space-y-5 mb-7">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-[1.25rem] bg-accent/15 transition-smooth group-hover:bg-accent/20 group-hover:scale-105 shadow-soft">
            <Icon className="w-8 h-8 text-accent" strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-[1.75rem] font-bold text-foreground tracking-[-0.02em] leading-tight mb-2.5">
              {title}
            </h2>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed opacity-80">{subtitle}</p>
          </div>
        </div>
        <Button
          onClick={onAction}
          size="lg"
          className="w-full h-[3.5rem] rounded-2xl bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-base shadow-soft-lg hover:shadow-soft-xl hover:scale-[1.02] active:scale-[0.98] transition-smooth glow-accent"
        >
          {buttonText}
          <ChevronRight className="w-5 h-5 ml-1.5" />
        </Button>
      </CardContent>
    </Card>
  )
}
