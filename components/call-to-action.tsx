"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Mail } from "lucide-react"
import Link from "next/link"
import { useTheme } from "@/lib/theme-context"

export function CallToAction() {
  const { theme } = useTheme()
  const isGlass = theme === "glass-morphism"

  return (
    <section className={`py-24 px-4 ${isGlass ? "glass-section" : "bg-muted/30"}`}>
      <div className="max-w-5xl mx-auto">
        <Card
          className={`p-12 border-primary/20 ${isGlass ? "glass-card" : "bg-linear-to-br from-primary/10 via-card to-secondary/10"}`}
        >
          <div className="text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-balance">
              Ready to Explore The Gambia's <span className="text-primary">Natural Wonders?</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
              Join us in protecting and celebrating one of West Africa's most biodiverse regions. Plan your visit today
              and become part of our conservation story.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/parks">
                <Button size="lg" className="text-lg px-8 gap-2">
                  Explore All Parks
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className={`text-lg px-8 gap-2 ${isGlass ? "glass-button" : "bg-transparent"}`}
              >
                <Mail className="h-5 w-5" />
                Contact Us
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
