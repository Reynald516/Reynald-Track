// app/pre-onboarding/page.tsx

"use client"

import { useState, useRef, useEffect } from "react"
import type React from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { OnboardingStep1 } from "@/components/onboarding/step-1"
import { OnboardingStep2 } from "@/components/onboarding/step-2"
import { OnboardingStep3 } from "@/components/onboarding/step-3"
import { OnboardingStep4 } from "@/components/onboarding/step-4"
import { OnboardingStep5 } from "@/components/onboarding/step-5"

export default function OnboardingPage() {
  const router = useRouter()
  const [ready, setReady] = useState(false)  // ← cegah flash konten

  useEffect(() => {
    const init = async () => {
      // 1. Cek session dulu — kalau udah login, langsung masuk app
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.replace("/")
        return
      }

      // 2. Kalau sudah pernah lihat onboarding, skip ke login
      const seen = localStorage.getItem("seen_pre_auth_onboarding")
      if (seen) {
        router.replace("/login")
        return
      }

      // 3. Baru pertama kali — tampilkan onboarding
      setReady(true)
    }

    init()
  }, [])

  const [currentStep, setCurrentStep] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const totalSteps = 5
  const minSwipeDistance = 50

  const isTouchDevice =
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0)

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    if (distance > minSwipeDistance && currentStep < totalSteps - 1)
      setCurrentStep((p) => p + 1)
    if (distance < -minSwipeDistance && currentStep > 0)
      setCurrentStep((p) => p - 1)
  }

  const handleNext = () => {
    if (currentStep < totalSteps - 1) setCurrentStep((p) => p + 1)
  }

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((p) => p - 1)
  }

  const handleComplete = () => {
    localStorage.setItem("seen_pre_auth_onboarding", "true")
    router.replace("/signup")
  }

  // Jangan render apapun sampai pengecekan session selesai
  if (!ready) return null

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-background overflow-hidden select-none"
      {...(isTouchDevice && { onTouchStart, onTouchMove, onTouchEnd })}
    >
      <div className="fixed top-0 left-0 right-0 z-50 px-6 pt-8">
        <div className="flex gap-1.5">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className="h-0.5 flex-1 rounded-full transition-all duration-[800ms] ease-out"
              style={{
                backgroundColor: index <= currentStep ? "var(--primary)" : "var(--muted)",
                opacity: index <= currentStep ? 1 : 0.3,
              }}
            />
          ))}
        </div>
      </div>

      <div
        className="flex h-screen transition-transform duration-[900ms]"
        style={{
          transform: `translateX(-${currentStep * 100}vw)`,
          width: `${totalSteps * 100}vw`,
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div className="w-screen flex-shrink-0"><OnboardingStep1 onNext={handleNext} /></div>
        <div className="w-screen flex-shrink-0"><OnboardingStep2 onNext={handleNext} onBack={handleBack} /></div>
        <div className="w-screen flex-shrink-0"><OnboardingStep3 onNext={handleNext} onBack={handleBack} /></div>
        <div className="w-screen flex-shrink-0"><OnboardingStep4 onNext={handleNext} onBack={handleBack} /></div>
        <div className="w-screen flex-shrink-0"><OnboardingStep5 onComplete={handleComplete} onBack={handleBack} /></div>
      </div>

      {currentStep === 0 && isTouchDevice && (
        <div className="fixed bottom-32 left-0 right-0 flex justify-center">
          <div className="text-xs text-muted-foreground/40">Geser untuk lanjut →</div>
        </div>
      )}
    </div>
  )
}