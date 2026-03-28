// components/tutorial-overlay.tsx
"use client"

import { useEffect, useState } from "react"

interface TutorialStep {
  targetId: string
  title: string
  description: string
  position: "top" | "bottom"
}

const STEPS: TutorialStep[] = [
  {
    targetId: "tutorial-cashflow",
    title: "💰 Cash Flow Kamu",
    description: "Pantau pemasukan & pengeluaran harian atau bulanan dari sini.",
    position: "bottom",
  },
  {
    targetId: "tutorial-quick-actions",
    title: "⚡ Quick Actions",
    description: "Akses fitur utama — scan struk, goals, AI coach, dan lainnya.",
    position: "bottom",
  },
  {
    targetId: "tutorial-quick-input",
    title: "✍️ Catat Cepat",
    description: 'Ketik langsung kayak chat — "makan 20k" atau "gaji 2jt". Selesai dalam 3 detik.',
    position: "top",
  },
  {
    targetId: "tutorial-fab",
    title: "➕ Tambah Transaksi",
    description: "Butuh input lebih detail? Tap tombol ini untuk form lengkap.",
    position: "top",
  },
]

export function TutorialOverlay({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0)
  const [rect, setRect] = useState<DOMRect | null>(null)

  const current = STEPS[step]

  useEffect(() => {
    const el = document.getElementById(current.targetId)
    if (!el) return
    const r = el.getBoundingClientRect()
    setRect(r)
    el.scrollIntoView({ behavior: "smooth", block: "center" })
  }, [step, current.targetId])

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(s => s + 1)
    } else {
      onDone()
    }
  }

  const PAD = 10

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Dark overlay with cutout using SVG */}
      {rect && (
        <svg
          className="absolute inset-0 w-full h-full"
          style={{ pointerEvents: "none" }}
        >
          <defs>
            <mask id="spotlight-mask">
              <rect width="100%" height="100%" fill="white" />
              <rect
                x={rect.left - PAD}
                y={rect.top - PAD}
                width={rect.width + PAD * 2}
                height={rect.height + PAD * 2}
                rx={16}
                fill="black"
              />
            </mask>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="rgba(0,0,0,0.75)"
            mask="url(#spotlight-mask)"
          />
          {/* Highlight border */}
          <rect
            x={rect.left - PAD}
            y={rect.top - PAD}
            width={rect.width + PAD * 2}
            height={rect.height + PAD * 2}
            rx={16}
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth={1.5}
          />
        </svg>
      )}

      {/* Tap outside to skip */}
      <div
        className="absolute inset-0"
        onClick={onDone}
      />

      {/* Tooltip */}
      {rect && (
        <div
          className="absolute left-4 right-4 max-w-sm mx-auto bg-card rounded-2xl p-5 shadow-2xl border border-border animate-fade-in"
          style={
            current.position === "bottom"
              ? { top: rect.bottom + PAD + 12 }
              : { bottom: window.innerHeight - rect.top + PAD + 12 }
          }
          onClick={e => e.stopPropagation()}
        >
          {/* Step indicator */}
          <div className="flex gap-1.5 mb-4">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                  i <= step ? "bg-accent" : "bg-muted"
                }`}
              />
            ))}
          </div>

          <h3 className="font-bold text-base text-foreground mb-1">
            {current.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-5">
            {current.description}
          </p>

          <div className="flex items-center justify-between">
            <button
              onClick={onDone}
              className="text-xs text-muted-foreground underline"
            >
              Lewati
            </button>
            <button
              onClick={handleNext}
              className="px-5 py-2.5 bg-accent text-accent-foreground text-sm font-semibold rounded-xl active:scale-95 transition-transform"
            >
              {step < STEPS.length - 1 ? "Lanjut →" : "Mulai! 🎉"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}