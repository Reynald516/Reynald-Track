"use client"

import type React from "react"

import { useState, useRef } from "react"
import { OnboardingStep1 } from "@/components/onboarding/step-1"
import { OnboardingStep2 } from "@/components/onboarding/step-2"
import { OnboardingStep3 } from "@/components/onboarding/step-3"
import { OnboardingStep4 } from "@/components/onboarding/step-4"
import { OnboardingStep5 } from "@/components/onboarding/step-5"

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const totalSteps = 5
  const minSwipeDistance = 50

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
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1)
    }
    if (isRightSwipe && currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleComplete = () => {
    // Redirect to main app
    window.location.href = "/"
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-background overflow-hidden select-none"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Progress indicator */}
      <div className="fixed top-0 left-0 right-0 z-50 px-6 pt-8">
        <div className="flex gap-1.5">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className="h-0.5 flex-1 rounded-full bg-muted transition-all duration-[800ms] ease-out"
              style={{
                backgroundColor: index <= currentStep ? "var(--primary)" : "var(--muted)",
                opacity: index <= currentStep ? 1 : 0.3,
              }}
            />
          ))}
        </div>
      </div>

      {/* Slides container */}
      <div
        className="flex h-screen transition-transform duration-[900ms]"
        style={{
          transform: `translateX(-${currentStep * 100}%)`,
          width: `${totalSteps * 100}%`,
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div className="w-screen flex-shrink-0">
          <OnboardingStep1 onNext={handleNext} />
        </div>
        <div className="w-screen flex-shrink-0">
          <OnboardingStep2 onNext={handleNext} onBack={handleBack} />
        </div>
        <div className="w-screen flex-shrink-0">
          <OnboardingStep3 onNext={handleNext} onBack={handleBack} />
        </div>
        <div className="w-screen flex-shrink-0">
          <OnboardingStep4 onNext={handleNext} onBack={handleBack} />
        </div>
        <div className="w-screen flex-shrink-0">
          <OnboardingStep5 onComplete={handleComplete} onBack={handleBack} />
        </div>
      </div>

      {/* Swipe hint (only on first screen) */}
      {currentStep === 0 && (
        <div className="fixed bottom-32 left-0 right-0 flex justify-center animate-fade-in">
          <div className="text-xs text-muted-foreground/40">Geser untuk lanjut →</div>
        </div>
      )}
    </div>
  )
}
