"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"

interface LayoutContentProps {
  children: React.ReactNode
}

export function LayoutContent({ children }: LayoutContentProps) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith("/admin")

  useEffect(() => {
    // Dynamically set body overflow based on route
    document.body.style.overflow = isAdmin ? 'hidden' : 'auto'
    document.body.style.height = isAdmin ? '100vh' : 'auto'

    // Cleanup function to reset when component unmounts
    return () => {
      document.body.style.overflow = 'auto'
      document.body.style.height = 'auto'
    }
  }, [isAdmin])

  return (
    <div className={`min-h-screen ${isAdmin ? 'h-screen' : 'h-auto'}`}>
      {children}
    </div>
  )
}