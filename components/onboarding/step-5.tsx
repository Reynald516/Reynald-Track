"use client"

interface OnboardingStep5Props {
  onComplete: () => void
  onBack: () => void
}

export function OnboardingStep5({ onComplete }: OnboardingStep5Props) {
  return (
    <div className="flex h-screen flex-col items-center justify-between px-6 py-16">
      <div className="flex-1 flex flex-col items-center justify-center max-w-md space-y-12">
        <div className="relative w-20 h-20 rounded-full bg-success/10 flex items-center justify-center opacity-60">
          <svg className="w-10 h-10 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div className="space-y-5 text-center">
          <h2 className="text-[28px] font-semibold leading-[1.25] text-balance text-foreground">
            30 detik sehari.
            <br />
            Dampak jangka panjang.
          </h2>
        </div>

        <div className="w-full space-y-3.5">
          <div className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
            <p className="text-[15px] text-foreground/90 leading-relaxed">Catat transaksi</p>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
            <p className="text-[15px] text-foreground/90 leading-relaxed">Pilih mood</p>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
            <p className="text-[15px] text-foreground/90 leading-relaxed">Biarkan AI belajar</p>
          </div>
        </div>

        <div className="w-full pt-2">
          <p className="text-sm text-center text-muted-foreground/70 leading-relaxed">Anda selalu memegang kendali.</p>
        </div>
      </div>

      <button
        onClick={onComplete}
        className="w-full max-w-md rounded-2xl bg-primary px-8 py-4 text-[15px] font-medium text-primary-foreground shadow-soft transition-all duration-300 hover:shadow-soft-lg active:scale-[0.98]"
      >
        Masuk ke ReynaldTrack
      </button>
    </div>
  )
}
