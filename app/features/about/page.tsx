"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Sparkles, Heart, Target } from "lucide-react"

export default function AboutPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-md">
        <div className="p-5 space-y-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-smooth"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Kembali</span>
          </button>

          <div className="space-y-2 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-accent" />
            </div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">ReynaldTrack</h1>
            <p className="text-sm text-muted-foreground font-medium">Produk dari Reynald Intelligence</p>
          </div>

          <Card className="border-0 shadow-soft-lg bg-card">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <Heart className="w-5 h-5 text-accent" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-foreground">Our Mission</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Membantu Anda memahami dan mengontrol keputusan finansial melalui kesadaran emosional dan AI yang
                    supportif.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <Target className="w-5 h-5 text-accent" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-foreground">Our Approach</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Uang bukan cuma angka. Ini tentang kebiasaan. ReynaldTrack melihat lebih dalam — dari mood hingga
                    pola pengeluaran — untuk memberi insight yang benar-benar personal.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-soft bg-card">
            <CardContent className="p-6 space-y-3">
              <h3 className="font-semibold text-foreground text-center">Reynald Intelligence</h3>
              <p className="text-sm text-muted-foreground leading-relaxed text-center">
                Teknologi AI yang memahami konteks emosional dalam keputusan finansial, bukan hanya data transaksi.
              </p>
            </CardContent>
          </Card>

          <div className="pt-4 text-center">
            <p className="text-xs text-muted-foreground">Version 1.0.0 (UI Preview)</p>
          </div>

          <Button
            onClick={() => router.back()}
            className="w-full h-12 rounded-xl font-semibold shadow-soft-md hover:shadow-soft-lg transition-smooth button-scale"
          >
            Kembali
          </Button>
        </div>
      </div>
    </div>
  )
}
