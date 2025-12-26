"use client"

import { useState } from "react"
import { Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { useTheme, type Theme } from "@/lib/theme-context"
import { useEffect } from "react"

const themes = [
  // ... existing themes
]

export function ThemeSelector() {
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const trigger = (
    <Button
      size="icon"
      className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg hover:scale-110 transition-transform bg-primary text-primary-foreground"
    >
      <Palette className="h-6 w-6" />
      <span className="sr-only">Change theme</span>
    </Button>
  )

  const content = (
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
  )

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          {trigger}
        </DrawerTrigger>
        <DrawerContent className="p-4">
          <DrawerHeader>
            <DrawerTitle>Choose Your Theme</DrawerTitle>
            <DrawerDescription>Select a visual theme to personalize your experience</DrawerDescription>
          </DrawerHeader>
          {content}
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger}
      </SheetTrigger>
      <SheetContent side="bottom" className="h-auto">
        <SheetHeader>
          <SheetTitle>Choose Your Theme</SheetTitle>
          <SheetDescription>Select a visual theme to personalize your experience</SheetDescription>
        </SheetHeader>
        {content}
      </SheetContent>
    </Sheet>
  )
}
