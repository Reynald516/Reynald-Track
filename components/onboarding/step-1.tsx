"use client"

interface OnboardingStep1Props {
  onNext: () => void
}

export function OnboardingStep1({ onNext }: OnboardingStep1Props) {
  return (
    <div className="flex h-screen flex-col items-center justify-between px-6 py-16">
      <div className="flex-1 flex flex-col items-center justify-center max-w-md space-y-12">
        <div className="space-y-3 text-center animate-fade-in">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">ReynaldTrack</h1>
          <p className="text-[10px] text-muted-foreground/60 font-medium tracking-widest uppercase">
            Reynald Intelligence
          </p>
        </div>

        <div className="space-y-5 text-center animate-fade-in" style={{ animationDelay: "150ms" }}>
          <h2 className="text-[26px] font-semibold leading-[1.3] text-balance text-foreground">
            Uang bukan cuma angka.
            <br />
            Ini tentang kebiasaan.
          </h2>
          <p className="text-[15px] text-muted-foreground/80 leading-relaxed text-pretty">
            Kami bantu Anda memahami dan mengontrol keputusan finansial dengan lebih baik.
          </p>
        </div>

        <div className="relative w-20 h-20 animate-fade-in opacity-40" style={{ animationDelay: "300ms" }}>
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-slow" />
          <div
            className="absolute inset-3 rounded-full bg-primary/30 animate-pulse-slow"
            style={{ animationDelay: "2s" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-primary/80"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22"
              />
            </svg>
          </div>
        </div>
      </div>

      <button
        onClick={onNext}
        className="w-full max-w-md rounded-2xl bg-primary px-8 py-4 text-[15px] font-medium text-primary-foreground shadow-soft transition-all duration-300 hover:shadow-soft-lg active:scale-[0.98] animate-fade-in"
        style={{ animationDelay: "450ms" }}
      >
        Mulai
      </button>
    </div>
  )
}
