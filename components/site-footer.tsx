"use client"

import Link from "next/link"
import { Trees, Mail, MapPin, Phone } from "lucide-react"
import { useTheme } from "@/lib/theme-context"

export function SiteFooter() {
  const { theme } = useTheme()
  const isGlass = theme === "glass-morphism"

  const footerLinks = {
    explore: [
      { name: "National Parks", href: "/parks" },
      { name: "Community Areas", href: "/iccas" },
      { name: "Biosphere Reserve", href: "/biosphere" },
    ],
    resources: [
      { name: "Conservation Guide", href: "#" },
      { name: "Visit Information", href: "#" },
      { name: "Research & Data", href: "#" },
    ],
    about: [
      { name: "About Us", href: "#" },
      { name: "Contact", href: "#" },
      { name: "Support Conservation", href: "#" },
    ],
  }

  return (
    <footer className={`bg-card border-t border-border ${isGlass ? "glass-card" : "bg-card"}`}>
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-4">
              <div className="bg-primary rounded-full p-2">
                <Trees className="h-5 w-5 text-background" />
              </div>
              <span>Gambia Protected Areas</span>
            </Link>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Protecting The Gambia's natural heritage through conservation, community engagement, and sustainable
              development.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Banjul, The Gambia</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>info@gambiaprotected.gm</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+220 123 4567</span>
              </div>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-bold mb-4">Explore</h3>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-bold mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="font-bold mb-4">About</h3>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>&copy; 2025 Gambia Protected Areas. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
