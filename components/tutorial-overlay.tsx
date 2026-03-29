// components/tutorial-overlay.tsx

"use client"

import { useEffect, useState } from "react"

type TutorialPage = "home" | "budget" | "insights"

interface Step {
  targetId: string
  title: string
  description: string
  tooltipPosition: "top" | "bottom"
  page: TutorialPage
}

const ALL_STEPS: Step[] = [
  // HOME
  {
    targetId: "tutorial-quick-actions",
    title: "⚡ Quick Actions",
    description: "Akses fitur utama dari sini — Scan Struk, Goals, AI Coach, dan lainnya. Tinggal tap!",
    tooltipPosition: "bottom",
    page: "home",
  },
  {
    targetId: "tutorial-cashflow",
    title: "📊 Cash Flow Kamu",
    description: "Lihat total pemasukan & pengeluaran. Tap tiap bar untuk detail per hari.",
    tooltipPosition: "bottom",
    page: "home",
  },
  {
    targetId: "tutorial-daily-log",
    title: "✨ Catat Hari Ini",
    description: "Tap di sini untuk catat mood + transaksi harian. Cukup 30 detik!",
    tooltipPosition: "bottom",
    page: "home",
  },
  {
    targetId: "tutorial-quick-input",
    title: "✍️ Catat Cepat",
    description: "Ketik langsung kayak chat — \"makan 20k\" atau \"gaji 2jt\". Langsung tercatat!",
    tooltipPosition: "top",
    page: "home",
  },
  {
    targetId: "tutorial-fab",
    title: "➕ Tambah Transaksi",
    description: "Butuh input lebih detail? Tap tombol ini untuk form lengkap atau kelola transaksi.",
    tooltipPosition: "top",
    page: "home",
  },
  // BUDGET
  {
    targetId: "tutorial-budget-categories",
    title: "💰 Budget Kategori",
    description: "Tap tiap kategori untuk atur batas budget bulananmu. Gua kasih tau kalau mau habis!",
    tooltipPosition: "bottom",
    page: "budget",
  },
  // INSIGHTS
  {
    targetId: "tutorial-chat-input",
    title: "🤖 Tanya AI Keuangan",
    description: "Ketik pertanyaan soal keuanganmu di sini — \"kategori mana yang paling boros?\" atau \"tips hemat bulan ini\".",
    tooltipPosition: "top",
    page: "insights",
  },
]

interface TutorialOverlayProps {
  onDone: () => void
  currentPage?: TutorialPage
}

export function TutorialOverlay({ onDone, currentPage = "home" }: TutorialOverlayProps) {
  const steps = ALL_STEPS.filter(s => s.page === currentPage)
  const [step, setStep] = useState(0)
  const [rect, setRect] = useState<DOMRect | null>(null)

  const current = steps[step]
  const PAD = 12

  useEffect(() => {
    if (!current) return
    const tryFind = (attempts = 0) => {
      const el = document.getElementById(current.targetId)
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" })
        setTimeout(() => {
          setRect(el.getBoundingClientRect())
        }, 400)
      } else if (attempts < 10) {
        setTimeout(() => tryFind(attempts + 1), 200)
      }
    }
    tryFind()
  }, [step, current])

  if (!current) return null

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(s => s + 1)
    } else {
      onDone()
    }
  }

  const tooltipStyle: React.CSSProperties = rect
    ? current.tooltipPosition === "bottom"
      ? { top: rect.bottom + PAD + 8 }
      : { bottom: window.innerHeight - rect.top + PAD + 8 }
    : { top: "50%" }

  return (
    <div className="fixed inset-0 z-[200]">
      {/* Dark overlay with spotlight cutout */}
      {rect && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <mask id="spotlight">
              <rect width="100%" height="100%" fill="white" />
              <rect
                x={rect.left - PAD}
                y={rect.top - PAD}
                width={rect.width + PAD * 2}
                height={rect.height + PAD * 2}
                rx={14}
                fill="black"
              />
            </mask>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="rgba(0,0,0,0.72)"
            mask="url(#spotlight)"
          />
          {/* Glowing border around spotlight */}
          <rect
            x={rect.left - PAD}
            y={rect.top - PAD}
            width={rect.width + PAD * 2}
            height={rect.height + PAD * 2}
            rx={14}
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth={1.5}
          />
        </svg>
      )}

      {/* Tap outside = skip */}
      <div className="absolute inset-0" onClick={onDone} />

      {/* Tooltip card */}
      {rect && (
        <div
          className="absolute left-4 right-4 max-w-sm mx-auto bg-card rounded-2xl p-5 shadow-2xl border border-border z-10"
          style={tooltipStyle}
          onClick={e => e.stopPropagation()}
        >
          {/* Progress dots */}
          <div className="flex gap-1.5 mb-4">
            {steps.map((_, i) => (
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
              className="text-xs text-muted-foreground underline underline-offset-2"
            >
              Lewati semua
            </button>
            <button
              onClick={handleNext}
              className="px-5 py-2.5 bg-accent text-accent-foreground text-sm font-semibold rounded-xl active:scale-95 transition-transform"
            >
              {step < steps.length - 1 ? "Lanjut →" : "Selesai 🎉"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}