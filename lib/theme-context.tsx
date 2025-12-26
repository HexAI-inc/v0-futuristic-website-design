"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

export type Theme = "midnight-jungle"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("midnight-jungle")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Always set to midnight-jungle theme
    document.documentElement.setAttribute("data-theme", "midnight-jungle")
  }, [])

  // Prevent theme changes - always keep midnight-jungle
  const handleSetTheme = (newTheme: Theme) => {
    // Do nothing - theme is fixed
  }

  return <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
