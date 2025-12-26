"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Binary as Binoculars, Camera, Heart, BookOpen } from "lucide-react"
import Link from "next/link"
import { useTheme } from "@/lib/theme-context"

const reasons = [
  {
    icon: Binoculars,
    title: "World-Class Wildlife",
    description: "Experience incredible biodiversity from chimpanzees to over 500 bird species in pristine habitats",
  },
  {
    icon: Camera,
    title: "Stunning Landscapes",
    description: "Capture breathtaking scenery from coastal mangroves to savanna woodlands and riverine forests",
  },
  {
    icon: Heart,
    title: "Support Conservation",
    description: "Your visit directly supports local communities and vital conservation efforts across The Gambia",
  },
  {
    icon: BookOpen,
    title: "Educational Experience",
    description: "Learn about West African ecosystems, wildlife, and community-led conservation initiatives",
  },
]

export function WhyVisitSection() {
  const { theme } = useTheme()
  // Theme is fixed to midnight-jungle, so glass-morphism styling is never applied
const isGlass = false

  return (
    <section className="py-24 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            Why Visit <span className="text-primary">The Gambia's</span> Protected Areas?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            Discover what makes The Gambia a premier destination for nature lovers and conservation enthusiasts
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {reasons.map((reason, index) => {
            const Icon = reason.icon
            return (
              <Card
                key={index}
                className={`p-8 hover:border-primary/50 transition-colors ${isGlass ? "glass-card" : "bg-card"}`}
              >
                <div className="flex gap-6">
                  <div className="shrink-0">
                    <div className={`p-4 rounded-lg ${isGlass ? "glass-icon" : "bg-primary/10"}`}>
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3">{reason.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{reason.description}</p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        <div className="text-center">
          <Link href="/parks">
            <Button size="lg" className="text-lg px-8">
              Start Planning Your Visit
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
