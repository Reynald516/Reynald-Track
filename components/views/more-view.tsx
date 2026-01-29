"use client"

import { useRouter } from "next/navigation"
import { AppHeader } from "@/components/app-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { logout } from "@/app/actions/logout"
import {
  User,
  Tag,
  Bookmark,
  Calendar,
  DollarSign,
  Moon,
  Sun,
  HelpCircle,
  FileText,
  LogOut,
  ChevronRight,
  Settings,
  Shield,
  Bell,
  Database,
  LinkIcon,
  Info,
} from "lucide-react"

interface MoreViewProps {
  isDarkMode: boolean
  onToggleTheme: () => void
}

export function MoreView({ isDarkMode, onToggleTheme }: MoreViewProps) {
  const router = useRouter()

  const menuSections = [
    {
      title: "Account",
      items: [
        { icon: User, label: "Profile", action: () => router.push("/features/profile") },
        { icon: Shield, label: "Security & Privacy", action: () => router.push("/features/security") },
        { icon: Settings, label: "Settings", action: () => console.log("[v0] Navigate to Settings") },
      ],
    },
    {
      title: "Organization",
      items: [
        { icon: Tag, label: "Categories", action: () => console.log("[v0] Navigate to Categories") },
        { icon: Bookmark, label: "Labels", action: () => console.log("[v0] Navigate to Labels") },
        { icon: Calendar, label: "Scheduled Transactions", action: () => console.log("[v0] Navigate to Scheduled") },
        { icon: DollarSign, label: "Currency", action: () => console.log("[v0] Navigate to Currency") },
      ],
    },
    {
      title: "Display",
      items: [
        {
          icon: isDarkMode ? Moon : Sun,
          label: "Theme",
          value: isDarkMode ? "Dark" : "Light",
          action: onToggleTheme,
        },
        { icon: Bell, label: "Notifications", action: () => router.push("/features/notifications") },
      ],
    },
    {
      title: "Data",
      items: [
        { icon: Database, label: "Data & Export", action: () => router.push("/features/export") },
        { icon: LinkIcon, label: "Connected Accounts", action: () => router.push("/features/connected-accounts") },
      ],
    },
    {
      title: "Support",
      items: [
        { icon: HelpCircle, label: "Help Center", action: () => router.push("/features/help") },
        { icon: Info, label: "About ReynaldTrack", action: () => router.push("/features/about") },
        { icon: FileText, label: "Legal", action: () => console.log("[v0] Navigate to Legal") },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      <AppHeader title="More" subtitle="Settings & preferences" isDarkMode={isDarkMode} onToggleTheme={onToggleTheme} />

      <div className="px-5 space-y-6 pb-28">
        {menuSections.map((section, i) => (
          <section key={i} className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground px-1">{section.title}</h3>
            <div className="grid gap-2">
              {section.items.map((item, j) => {
                const Icon = item.icon
                return (
                  <Card
                    key={j}
                    className="border-0 shadow-soft-sm hover:shadow-soft-md transition-smooth cursor-pointer card-float button-scale"
                    onClick={item.action}
                  >
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-muted-foreground" />
                        <span className="font-medium tracking-tight">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.value && <span className="text-sm text-muted-foreground">{item.value}</span>}
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </section>
        ))}

        {/* Logout Button */}
        <section className="pt-4">
          <Button
            variant="destructive"
            className="w-full h-12 rounded-xl font-semibold shadow-soft-md hover:shadow-soft-lg transition-smooth button-scale"
            onClick={async () => {
              await logout()
              window.location.href = "/pre-onboarding"
            }}
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </Button>
        </section>
      </div>
    </div>
  )
}
