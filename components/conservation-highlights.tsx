"use client"

import { Card } from "@/components/ui/card"
import { Shield, Users, Leaf, Award } from "lucide-react"
import { useTheme } from "@/lib/theme-context"

const highlights = [
  {
    icon: Shield,
    title: "Protected Biodiversity",
    description: "Over 530 bird species and diverse mammals protected across our conservation network",
    stat: "530+",
    label: "Bird Species",
  },
  {
    icon: Users,
    title: "Community Engagement",
    description: "Local communities actively participate in conservation through ICCAs and eco-tourism",
    stat: "50+",
    label: "Communities",
  },
  {
    icon: Leaf,
    title: "Habitat Restoration",
    description: "Ongoing efforts to restore and protect critical ecosystems including mangroves and forests",
    stat: "20,000+",
    label: "Hectares",
  },
  {
    icon: Award,
    title: "International Recognition",
    description: "UNESCO Biosphere Reserve status recognizing our commitment to conservation",
    stat: "1",
    label: "Biosphere",
  },
]

export function ConservationHighlights() {
  const { theme } = useTheme()
  // Theme is fixed to midnight-jungle, so glass-morphism styling is never applied
  const isGlass = false

  return (
    <section className={`py-24 px-4 ${isGlass ? "glass-section" : "bg-muted/30"}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            Conservation <span className="text-primary">Impact</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            Our commitment to protecting The Gambia's natural heritage through science, community partnership, and
            sustainable practices
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((highlight, index) => {
            const Icon = highlight.icon
            return (
              <Card
                key={index}
                className={`p-6 hover:shadow-lg transition-shadow ${isGlass ? "glass-card" : "bg-card"}`}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`p-4 rounded-full ${isGlass ? "glass-icon" : "bg-primary/10"}`}>
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-primary mb-1">{highlight.stat}</div>
                    <div className="text-sm text-muted-foreground mb-3">{highlight.label}</div>
                  </div>
                  <h3 className="text-xl font-bold">{highlight.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{highlight.description}</p>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
