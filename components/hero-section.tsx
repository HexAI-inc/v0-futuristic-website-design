"use client"

import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

export function HeroSection() {
  const scrollToOverview = () => {
    document.getElementById("overview")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/aerial-view-of-gambia-river-with-lush-green-forest.jpg"
          alt="The Gambia's natural landscape"
          className="w-full h-full object-cover"
        />
  <div className="absolute inset-0 bg-linear-to-b from-background/80 via-background/60 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 animate-fade-in-up tracking-tight text-balance">
          The Gambia&apos;s <span className="text-primary">Biodiversity Outlook</span>
        </h1>
        <p
          className="text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-12 animate-fade-in-up opacity-0 text-balance"
          style={{ animationDelay: "200ms", animationFillMode: "forwards" }}
        >
          Journey through national parks, community sanctuaries, and biosphere zones shaping a resilient future.
        </p>
        <Button
          size="lg"
          onClick={scrollToOverview}
          className="animate-fade-in-up opacity-0 text-lg px-8 py-6 animate-glow group"
          style={{ animationDelay: "400ms", animationFillMode: "forwards" }}
        >
          Start Exploring
          <ChevronDown className="ml-2 h-5 w-5 group-hover:translate-y-1 transition-transform" />
        </Button>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <ChevronDown className="h-8 w-8 text-primary opacity-50" />
      </div>
    </section>
  )
}
