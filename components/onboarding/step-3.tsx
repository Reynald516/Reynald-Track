"use client"

interface OnboardingStep3Props {
  onNext: () => void
  onBack: () => void
}

export function OnboardingStep3({ onNext }: OnboardingStep3Props) {
  return (
    <div className="flex h-screen flex-col items-center justify-between px-6 py-16">
      <div className="flex-1 flex flex-col items-center justify-center max-w-md space-y-12">
        <div className="relative w-20 h-20 opacity-50">
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-slow" />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-10 h-10 text-primary/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
        </div>

        <div className="space-y-6 text-center w-full">
          <h2 className="text-[26px] font-semibold leading-[1.3] text-balance text-foreground">
            Kami melihat lebih dalam.
          </h2>

          <div className="space-y-4 pt-2">
            <p className="text-[15px] text-foreground/90 leading-relaxed">Catat transaksi + mood Anda</p>
            <p className="text-[15px] text-foreground/90 leading-relaxed">AI memahami pola emosional</p>
            <p className="text-[15px] text-foreground/90 leading-relaxed">Intervensi sebelum keputusan buruk</p>
          </div>
        </div>
      </div>

      <button
        onClick={onNext}
        className="w-full max-w-md rounded-2xl bg-primary px-8 py-4 text-[15px] font-medium text-primary-foreground shadow-soft transition-all duration-300 hover:shadow-soft-lg active:scale-[0.98]"
      >
        Lanjut
      </button>
    </div>
  )
}
