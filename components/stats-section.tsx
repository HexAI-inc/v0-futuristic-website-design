"use client"

import { AnimatedCounter } from "./animated-counter"
import { Card } from "@/components/ui/card"
import { useTheme } from "@/lib/theme-context"
import { useState, useEffect } from "react"

export function StatsSection() {
  const { theme } = useTheme()
  const [content, setContent] = useState({
    title: "Gambia's Biodiversity Outlook",
    subtitle: "A snapshot of the conservation network safeguarding riverine forests, mangrove deltas, and sacred community groves across the country.",
    stats: [
      {
        value: 246.5,
        suffix: "k ha",
        label: "National Protected Estate",
        description: "Combined coverage of parks, reserves, ICCAs, and biosphere zones",
        decimals: 1,
      },
      {
        value: 21.81,
        suffix: "%",
        label: "Land & Coastal Protection",
        description: "Portion of The Gambia currently under formal conservation",
        decimals: 2,
      },
      {
        value: 14.3,
        suffix: "k ha",
        label: "Community Conserved Areas",
        description: "Grassroots stewardship across 19 Indigenous & community sites",
        decimals: 1,
      },
      {
        value: 530,
        suffix: "+",
        label: "Bird Species Recorded",
        description: "Migratory and resident species spanning river, forest, and coast",
        decimals: 0,
      },
    ]
  })

  useEffect(() => {
    fetch('/api/admin/home')
      .then(res => res.json())
      .then(data => {
        if (data.stats) setContent(data.stats)
      })
      .catch(err => console.error("Error fetching stats content:", err))
  }, [])

  // Theme is fixed to midnight-jungle, so glass-morphism styling is never applied
const isGlass = false

  return (
    <section id="overview" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            {content.title.split(' ').map((word, i) => 
              word.toLowerCase() === 'biodiversity' || word.toLowerCase() === 'outlook' ? 
              <span key={i} className="text-primary">{word} </span> : word + ' '
            )}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            {content.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 lg:gap-10">
          {content.stats.map((stat, index) => (
            <Card
              key={index}
              className={`p-10 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 min-w-0 text-center ${
                isGlass ? "glass-card" : "bg-card"
              }`}
            >
              <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
              </div>
              <p className="text-lg text-foreground/80 mb-3 font-medium leading-tight">{stat.label}</p>
              {stat.description ? (
                <p className="text-sm text-muted-foreground leading-relaxed">{stat.description}</p>
              ) : null}
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
