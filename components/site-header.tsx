"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Trees, Users, Globe, Home, Mail, BookOpen, Info } from "lucide-react"
import { useTheme } from "@/lib/theme-context"

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme } = useTheme()
  // Theme is fixed to midnight-jungle, so glass-morphism styling is never applied
const isGlass = false

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "National Parks", href: "/parks", icon: Trees },
    { name: "ICCAs", href: "/iccas", icon: Users },
    { name: "Biosphere", href: "/biosphere", icon: Globe },
    { name: "Resources", href: "/resources", icon: BookOpen },
    { name: "About", href: "/about", icon: Info },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b border-border ${isGlass ? "glass-nav" : "bg-background/80 backdrop-blur-md"}`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="bg-primary rounded-full p-2">
              <Trees className="h-5 w-5 text-background" />
            </div>
            <span className="hidden sm:inline">Gambia's Biodiversity Outlook</span>
            <span className="sm:hidden">GBO</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.name} href={item.href}>
                  <Button variant="ghost" className="gap-2">
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              )
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 space-y-2 border-t border-border">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.name} href={item.href} onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              )
            })}
          </nav>
        )}
      </div>
    </header>
  )
}
