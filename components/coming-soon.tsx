"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Sparkles } from "lucide-react"

interface ComingSoonProps {
  title: string
  description: string
  whyImportant: string
  icon?: React.ElementType
}

export function ComingSoon({ title, description, whyImportant, icon: Icon = Sparkles }: ComingSoonProps) {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-5">
      <div className="max-w-md w-full space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-smooth"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Kembali</span>
        </button>

        <Card className="border-0 shadow-soft-xl bg-card">
          <CardContent className="p-8 space-y-6 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-accent/10 flex items-center justify-center">
              <Icon className="w-10 h-10 text-accent" />
            </div>

            <div className="space-y-3">
              <h1 className="text-2xl font-bold text-foreground tracking-tight">{title}</h1>
              <p className="text-muted-foreground leading-relaxed">{description}</p>
            </div>

            <div className="pt-4 border-t border-border/50 space-y-2">
              <h2 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">
                Kenapa fitur ini penting
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{whyImportant}</p>
            </div>

            <div className="pt-2">
              <p className="text-xs text-accent font-semibold">Dalam upgrade berikutnya</p>
            </div>

            <Button
              onClick={() => router.back()}
              className="w-full h-12 rounded-xl font-semibold shadow-soft-md hover:shadow-soft-lg transition-smooth button-scale"
            >
              Kembali
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
