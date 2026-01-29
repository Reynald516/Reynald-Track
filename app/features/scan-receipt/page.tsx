"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Camera, FlashlightIcon, ImageIcon } from "lucide-react"

export default function ScanReceiptPage() {
  const router = useRouter()
  const [flashOn, setFlashOn] = useState(false)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-5 bg-card/50 backdrop-blur-xl border-b border-border/50">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-foreground hover:text-accent transition-smooth"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-foreground">Scan Struk</h1>
        <button
          onClick={() => setFlashOn(!flashOn)}
          className={`p-2 rounded-lg transition-smooth ${
            flashOn ? "bg-accent text-accent-foreground" : "bg-secondary text-foreground"
          }`}
        >
          <FlashlightIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Camera Frame */}
      <div className="flex-1 relative bg-black/90 flex items-center justify-center">
        <div className="relative w-full max-w-md aspect-[3/4] mx-4">
          {/* Camera Viewfinder */}
          <div className="absolute inset-0 border-2 border-accent/50 rounded-2xl">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-accent rounded-tl-xl"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-accent rounded-tr-xl"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-accent rounded-bl-xl"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-accent rounded-br-xl"></div>
          </div>

          {/* Guide Text */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center px-4">
            <p className="text-white/80 text-sm font-medium">Posisikan struk dalam bingkai</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-6 bg-card/95 backdrop-blur-xl border-t border-border/50 space-y-4">
        <div className="flex items-center justify-center gap-6">
          <button className="p-4 rounded-full bg-secondary hover:bg-secondary/80 transition-smooth button-scale">
            <ImageIcon className="w-6 h-6 text-foreground" />
          </button>

          <button className="w-20 h-20 rounded-full bg-accent hover:bg-accent/90 transition-smooth button-scale shadow-soft-xl flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-accent-foreground/20 flex items-center justify-center">
              <Camera className="w-8 h-8 text-accent-foreground" />
            </div>
          </button>

          <div className="w-12 h-12" />
        </div>

        <Card className="border-0 shadow-soft bg-warning/10">
          <CardContent className="p-4">
            <p className="text-sm text-center text-warning font-semibold">Segera hadir — pemindaian struk otomatis</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
