"use client"

import { useState } from "react"
import { BottomNavigation } from "@/components/bottom-navigation"
import { HomeView } from "@/components/views/home-view"
import { WalletsView } from "@/components/views/wallets-view"
import { BudgetView } from "@/components/views/budget-view"
import { InsightsView } from "@/components/views/insights-view"
import { MoreView } from "@/components/views/more-view"
import { getTodayCashflow } from "@/components/views/home-actions"

type Tab = "home" | "wallets" | "budget" | "insights" | "more"

export default function ReynaldTrackApp() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>("home")

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }
  
  return (
    <>
      <main className="min-h-screen bg-background pb-20">
        <div className="max-w-md lg:max-w-5xl mx-auto">
          {activeTab === "home" && <HomeView isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />}
          {activeTab === "wallets" && <WalletsView isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />}
          {activeTab === "budget" && <BudgetView isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />}
          {activeTab === "insights" && <InsightsView isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />}
          {activeTab === "more" && <MoreView isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />}
        </div>
        
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </main>
    </>
  )
}