"use client"

import { useEffect, useState } from "react"
import { CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface SuccessOverlayProps {
  show: boolean
  onComplete: () => void
}

export function SuccessOverlay({ show, onComplete }: SuccessOverlayProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show) {
      // Trigger animation
      setIsVisible(true)

      // Auto-hide after animation duration
      const timeout = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onComplete, 200) // Wait for fade-out before calling onComplete
      }, 1000) // 1000ms total display time

      return () => clearTimeout(timeout)
    }
  }, [show, onComplete])

  if (!show && !isVisible) return null

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center",
        "transition-all duration-300",
        isVisible ? "opacity-100" : "opacity-0",
      )}
    >
      {/* Darkened background */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Success card */}
      <div
        className={cn(
          "relative z-10 flex flex-col items-center gap-3 transition-all duration-300",
          isVisible ? "scale-100 opacity-100" : "scale-90 opacity-0",
        )}
      >
        {/* Checkmark circle */}
        <div className="size-16 rounded-full bg-primary/10 ring-4 ring-primary/20 flex items-center justify-center">
          <div className="size-14 rounded-full bg-primary flex items-center justify-center">
            <CheckIcon className="size-8 text-primary-foreground stroke-[3]" />
          </div>
        </div>

        {/* Text */}
        <div className="text-center">
          <p className="text-xl font-semibold text-white mb-1">Tersimpan</p>
          <p className="text-sm text-white/80">Transaksi berhasil dicatat</p>
        </div>
      </div>
    </div>
  )
}
