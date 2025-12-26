"use client"

import { usePathname } from "next/navigation"
import { SiteFooter } from "@/components/site-footer"

export function ConditionalFooter() {
  const pathname = usePathname()

  // Don't show footer on admin pages
  if (pathname?.startsWith("/admin")) {
    return null
  }

  return <SiteFooter />
}