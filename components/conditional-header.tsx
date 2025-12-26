"use client"

import { usePathname } from "next/navigation"
import { SiteHeader } from "@/components/site-header"

export function ConditionalHeader() {
  const pathname = usePathname()

  // Don't show header on admin pages
  if (pathname?.startsWith("/admin")) {
    return null
  }

  return <SiteHeader />
}