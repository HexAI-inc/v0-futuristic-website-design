import type React from "react"
import type { Metadata } from "next"
import { Geist } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ThemeProvider } from "@/lib/theme-context"
import { ThemeSelector } from "@/components/theme-selector"
import { SitePreloader } from "@/components/site-preloader"
import "./globals.css"

const geist = Geist({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Gambia's Biodiversity Outlook | Protected Areas & Community Stewardship",
  description:
    "Discover The Gambia's conservation network—from national parks and biosphere reserves to community-led stewardship—through immersive stories and data.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to Mapbox CDN for faster map loading */}
        <link rel="preconnect" href="https://api.mapbox.com" />
        <link rel="preconnect" href="https://tiles.mapbox.com" />
        <link rel="dns-prefetch" href="https://api.mapbox.com" />
        <link rel="dns-prefetch" href="https://tiles.mapbox.com" />
      </head>
      <body className={`${geist.className} font-sans antialiased`}>
        <SitePreloader />
        <ThemeProvider>
          <SiteHeader />
          <div className="pt-16">{children}</div>
          <SiteFooter />
          <ThemeSelector />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
