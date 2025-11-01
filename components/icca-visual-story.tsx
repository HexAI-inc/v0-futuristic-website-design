"use client"

import { useRef } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { useTheme } from "@/lib/theme-context"

const stories = [
  {
    title: "Traditional Knowledge",
    description:
      "Communities pass down generations of ecological wisdom, protecting sacred sites and biodiversity hotspots.",
    image: "/icca-traditional-knowledge.jpg",
    stat: "500+ Years",
    statLabel: "of Conservation Tradition",
  },
  {
    title: "Sustainable Livelihoods",
    description:
      "ICCAs provide economic opportunities through ecotourism, sustainable harvesting, and cultural experiences.",
    image: "/icca-sustainable-livelihoods.jpg",
    stat: "2,000+",
    statLabel: "Community Members Benefiting",
  },
  {
    title: "Biodiversity Protection",
    description:
      "Community-managed areas serve as vital corridors and refuges for endangered species and rare ecosystems.",
    image: "/icca-biodiversity-protection.jpg",
    stat: "85%",
    statLabel: "Species Diversity Maintained",
  },
]

export function ICCAVisualStory() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  const isGlass = theme === "glass-morphism"

  return (
    <section className={`py-24 ${isGlass ? "glass-section" : "bg-muted/30"}`}>
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 text-balance">
          The <span className="text-secondary">ICCA Story</span>
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground text-center max-w-3xl mx-auto text-pretty leading-relaxed">
          Discover how communities are leading the way in conservation through traditional practices and modern
          innovation.
        </p>
      </div>

      <div ref={scrollRef} className="flex gap-6 overflow-x-auto px-4 pb-8 snap-x snap-mandatory scrollbar-hide">
        {stories.map((story, index) => (
          <Card
            key={index}
            className={`flex-shrink-0 w-[85vw] md:w-[600px] overflow-hidden snap-center ${isGlass ? "glass-card" : "bg-card"}`}
          >
            <div className="relative h-80">
              <Image src={story.image || "/placeholder.svg"} alt={story.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-linear-to-t from-background via-background/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <div className="text-4xl font-bold text-primary mb-1">{story.stat}</div>
                    <div className="text-sm text-muted-foreground">{story.statLabel}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-4">{story.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{story.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
