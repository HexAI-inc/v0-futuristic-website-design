"use client"

import { useState } from "react"
import { Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useTheme, type Theme } from "@/lib/theme-context"

const themes = [
  {
    id: "midnight-jungle" as Theme,
    name: "Midnight Jungle",
    description: "Futuristic dark theme with vibrant green accents",
    icon: "🌙",
    preview: "bg-[#1a1a1a] border-2 border-[#00f0a8]",
  },
  {
    id: "savanna-gold" as Theme,
    name: "Savanna Gold",
    description: "Warm, sunny theme inspired by the Gambian savanna",
    icon: "☀️",
    preview: "bg-[#fdf8f0] border-2 border-[#e57373]",
  },
  {
    id: "riverine-blue" as Theme,
    name: "Riverine Blue",
    description: "Clean, modern theme inspired by the River Gambia",
    icon: "🌊",
    preview: "bg-white border-2 border-[#0077b6]",
  },
  {
    id: "forest-canopy" as Theme,
    name: "Forest Canopy",
    description: "Vibrant theme inspired by lush forests",
    icon: "🌳",
    preview: "bg-[#1f3a3d] border-2 border-[#aacc00]",
  },
  {
    id: "glass-morphism" as Theme,
    name: "Glass Morphism",
    description: "Modern frosted glass effect with transparency",
    icon: "💎",
  preview: "bg-linear-to-br from-white/40 to-blue-100/40 border-2 border-white/60 backdrop-blur-xl",
  },
]

export function ThemeSelector() {
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            size="icon"
            className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg hover:scale-110 transition-transform bg-primary text-primary-foreground"
          >
            <Palette className="h-6 w-6" />
            <span className="sr-only">Change theme</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-auto">
          <SheetHeader>
            <SheetTitle>Choose Your Theme</SheetTitle>
            <SheetDescription>Select a visual theme to personalize your experience</SheetDescription>
          </SheetHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTheme(t.id)
                  setOpen(false)
                }}
                className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                  theme === t.id ? "ring-4 ring-primary" : "hover:border-primary"
                }`}
              >
                <div className={`h-24 rounded-md mb-3 ${t.preview}`} />
                <div className="text-2xl mb-2">{t.icon}</div>
                <h3 className="font-semibold text-lg mb-1">{t.name}</h3>
                <p className="text-sm text-muted-foreground">{t.description}</p>
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
