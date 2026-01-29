"use client"

interface OnboardingStep4Props {
  onNext: () => void
  onBack: () => void
}

export function OnboardingStep4({ onNext }: OnboardingStep4Props) {
  return (
    <div className="flex h-screen flex-col items-center justify-between px-6 py-16">
      <div className="flex-1 flex flex-col items-center justify-center max-w-md space-y-12">
        <div className="w-full max-w-sm space-y-3 opacity-80">
          <div className="flex gap-2.5 items-start">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-4 h-4 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                />
              </svg>
            </div>
            <div className="flex-1 bg-muted/30 rounded-2xl rounded-tl-md px-4 py-3">
              <p className="text-[13px] text-foreground/90 leading-relaxed">
                Saya perhatikan mood Anda sedang rendah. Transaksi ini tidak sesuai kebiasaan. Yakin lanjut?
              </p>
            </div>
          </div>

          <div className="flex gap-2 justify-end pl-10">
            <button className="px-3.5 py-2 rounded-full bg-muted/40 text-[11px] font-medium text-muted-foreground">
              Batalkan
            </button>
            <button className="px-3.5 py-2 rounded-full bg-primary/15 text-[11px] font-medium text-primary">
              Tetap lanjut
            </button>
          </div>
        </div>

        <div className="space-y-5 text-center">
          <h2 className="text-[26px] font-semibold leading-[1.3] text-balance text-foreground">
            AI yang membantu, bukan menghakimi.
          </h2>
          <p className="text-[15px] text-muted-foreground/80 leading-relaxed text-pretty">
            Peringatan halus berdasarkan kebiasaan Anda, bukan aturan kaku.
          </p>
        </div>
      </div>

      <button
        onClick={onNext}
        className="w-full max-w-md rounded-2xl bg-primary px-8 py-4 text-[15px] font-medium text-primary-foreground shadow-soft transition-all duration-300 hover:shadow-soft-lg active:scale-[0.98]"
      >
        Mengerti
      </button>
    </div>
  )
}
