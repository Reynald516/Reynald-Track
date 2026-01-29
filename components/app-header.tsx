"use client"

import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AppHeaderProps {
  title: string
  subtitle?: string
  isDarkMode: boolean
  onToggleTheme: () => void
}

export function AppHeader({ title, subtitle, isDarkMode, onToggleTheme }: AppHeaderProps) {
  return (
    <header className="px-5 pt-10 pb-5 sticky top-0 bg-background/98 backdrop-blur-2xl z-10 border-b-0 shadow-soft-md">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[1.75rem] font-bold text-foreground tracking-[-0.02em] mb-1 leading-none">{title}</h1>
          {subtitle && (
            <p className="text-[0.7rem] text-muted-foreground font-semibold tracking-wide opacity-60">{subtitle}</p>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleTheme}
          className="rounded-xl hover:bg-secondary/80 transition-smooth button-scale shadow-soft-sm w-11 h-11"
          aria-label="Toggle theme"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5 text-foreground" strokeWidth={2} />
          ) : (
            <Moon className="w-5 h-5 text-foreground" strokeWidth={2} />
          )}
        </Button>
      </div>
    </header>
  )
}
