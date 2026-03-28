// app/page.tsx

"use client"

import { useState, useCallback } from "react"
import { BottomNavigation } from "@/components/bottom-navigation"
import { HomeView } from "@/components/views/home-view"
import { WalletsView } from "@/components/views/wallets-view"
import { BudgetView } from "@/components/views/budget-view"
import { InsightsView } from "@/components/views/insights-view"
import { MoreView } from "@/components/views/more-view"
import { getTodayCashflow } from "@/components/views/home-actions"
import { FloatingActionButton } from "@/components/shared/FloatingActionButton"
import { StickyQuickInput } from "@/components/sticky-quick-input"
import { TutorialOverlay } from "@/components/tutorial-overlay"
import { useRouter } from "next/navigation"

type Tab = "home" | "wallets" | "budget" | "insights" | "more"

export default function ReynaldTrackApp() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>("home")
  const [refreshKey, setRefreshKey] = useState(0)
  const [showTutorial, setShowTutorial] = useState(() => {
    if (typeof window === "undefined") return false
    return !localStorage.getItem("seen_tutorial")
  })
  const handleQuickInputSuccess = useCallback(() => setRefreshKey(k => k + 1), [])
  const router = useRouter()

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }
  
  return (
    <>
      <main className="min-h-screen bg-background pb-36">
        <div className="max-w-md lg:max-w-5xl mx-auto">
          {activeTab === "home" && (
            <HomeView key={refreshKey} isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />
          )}
          {activeTab === "wallets" && <WalletsView isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />}
          {activeTab === "budget" && <BudgetView isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />}
          {activeTab === "insights" && <InsightsView isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />}
          {activeTab === "more" && <MoreView isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />}
        </div>

        <FloatingActionButton
          onAdd={() => {
            router.push("/features/daily-log")
          }}
          onManage={() => {
            router.push("/transactions")
          }}
        />

        {activeTab === "home" && (
          <StickyQuickInput onSuccess={handleQuickInputSuccess} />
        )}
        
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {showTutorial && (
          <TutorialOverlay
            onDone={() => {
              localStorage.setItem("seen_tutorial", "true")
              setShowTutorial(false)
            }}
          />
        )}
      </main>
    </>
  )
}