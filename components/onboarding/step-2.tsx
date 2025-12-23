"use client"

interface OnboardingStep2Props {
  onNext: () => void
  onBack: () => void
}

export function OnboardingStep2({ onNext }: OnboardingStep2Props) {
  return (
    <div className="flex h-screen flex-col items-center justify-between px-6 py-16">
      <div className="flex-1 flex flex-col items-center justify-center max-w-md space-y-12">
        <div className="relative flex gap-2.5 opacity-50">
          <div className="relative w-14 h-14 rounded-full bg-warning/15 flex items-center justify-center animate-pulse-slow">
            <div className="w-7 h-7 rounded-full bg-warning/30" />
          </div>
          <div className="relative w-14 h-14 rounded-full bg-destructive/15 flex items-center justify-center animate-pulse-slow [animation-delay:1s]">
            <div className="w-7 h-7 rounded-full bg-destructive/30" />
          </div>
          <div className="relative w-14 h-14 rounded-full bg-ai-accent/15 flex items-center justify-center animate-pulse-slow [animation-delay:2s]">
            <div className="w-7 h-7 rounded-full bg-ai-accent/30" />
          </div>
        </div>

        <div className="space-y-5 text-center">
          <h2 className="text-[26px] font-semibold leading-[1.3] text-balance text-foreground">
            Kebanyakan orang kehilangan uang bukan karena kurang pintar.
          </h2>
          <p className="text-[15px] text-muted-foreground/80 leading-relaxed text-pretty">
            Tapi karena keputusan impulsif saat emosi sedang tidak stabil.
          </p>
        </div>
      </div>

      <button
        onClick={onNext}
        className="w-full max-w-md rounded-2xl bg-primary px-8 py-4 text-[15px] font-medium text-primary-foreground shadow-soft transition-all duration-300 hover:shadow-soft-lg active:scale-[0.98]"
      >
        Lanjutkan
      </button>
    </div>
  )
}
