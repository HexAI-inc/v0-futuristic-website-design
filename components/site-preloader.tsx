"use client"

import { useEffect, useState } from "react"

export function SitePreloader() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Safety timeout: always hide preloader after 3 seconds max
    const safetyTimeout = setTimeout(() => {
      setIsLoading(false)
    }, 3000)

    const handleLoad = () => {
      setTimeout(() => setIsLoading(false), 500)
      clearTimeout(safetyTimeout)
    }

    if (document.readyState === "complete") {
      handleLoad()
    } else {
      window.addEventListener("load", handleLoad)
      return () => {
        window.removeEventListener("load", handleLoad)
        clearTimeout(safetyTimeout)
      }
    }
  }, [])

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-[100] bg-background flex items-center justify-center animate-out fade-out duration-500">
      <div className="relative">
        <div className="h-20 w-20 rounded-full bg-primary/20 animate-pulse" />
        <div className="absolute inset-0 h-20 w-20 rounded-full bg-primary/40 animate-ping" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-10 w-10 rounded-full bg-primary" />
        </div>
      </div>
    </div>
  )
}
