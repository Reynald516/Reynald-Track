"use client"

import { Home, Wallet, PieChart, TrendingUpIcon, MoreHorizontal } from "lucide-react"

type Tab = "home" | "wallets" | "budget" | "insights" | "more"

interface BottomNavigationProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: "home" as Tab, label: "Home", icon: Home },
    { id: "wallets" as Tab, label: "Wallets", icon: Wallet },
    { id: "budget" as Tab, label: "Budget", icon: PieChart },
    { id: "insights" as Tab, label: "Insights", icon: TrendingUpIcon },
    { id: "more" as Tab, label: "More", icon: MoreHorizontal },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/98 backdrop-blur-2xl border-t-0 shadow-soft-xl z-50">
      <div className="mx-auto max-w-md px-3 py-3">
        <div className="flex items-center justify-around gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center gap-1.5 px-5 py-3 rounded-[1.125rem] transition-smooth button-scale ${
                  isActive ? "bg-accent/10 shadow-soft" : "hover:bg-secondary/70"
                }`}
                aria-label={tab.label}
                aria-current={isActive ? "page" : undefined}
              >
                <div className={`transition-smooth ${isActive ? "text-accent scale-110" : "text-muted-foreground"}`}>
                  <Icon className="w-[1.375rem] h-[1.375rem]" strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span
                  className={`text-[0.625rem] font-bold tracking-tight transition-smooth ${
                    isActive ? "text-accent" : "text-muted-foreground"
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
