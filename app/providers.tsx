// src/app/providers.tsx
"use client"

import type { ReactNode } from "react"
import { ThemeProvider } from "@/components/theme-provider" // kalau lu punya

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  )
}