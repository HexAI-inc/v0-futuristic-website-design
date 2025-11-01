"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"

const storyPanels = [
  {
    image: "/dense-forest-canopy-abuko-gambia.jpg",
    title: "Lush Forests",
    description: "Home to rare primates and vibrant birdlife.",
    query: "dense tropical forest canopy with sunlight filtering through trees in Gambia",
  },
  {
    image: "/wide-gambia-river-aerial-view.jpg",
    title: "Mighty Rivers",
    description: "The lifeblood of the nation, carving through parks and wetlands.",
    query: "wide aerial view of the Gambia River flowing through lush green landscape",
  },
  {
    image: "/coastal-mangrove-atlantic-ocean-gambia.jpg",
    title: "Pristine Coastlines",
    description: "Where vital mangrove ecosystems meet the Atlantic.",
    query: "pristine coastal mangrove forest meeting the Atlantic Ocean in Gambia",
  },
]

export function VisualStorySection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft
      const panels = container.querySelectorAll("[data-panel]")

      panels.forEach((panel, index) => {
        const image = panel.querySelector("[data-parallax-image]") as HTMLElement
        if (image) {
          const offset = (scrollLeft - index * container.clientWidth) * 0.5
          image.style.transform = `translateX(${-offset}px)`
        }

        const text = panel.querySelector("[data-fade-text]") as HTMLElement
        if (text) {
          const panelLeft = index * container.clientWidth
          const distance = Math.abs(scrollLeft - panelLeft)
          const opacity = Math.max(0, 1 - distance / container.clientWidth)
          text.style.opacity = opacity.toString()
        }
      })
    }

    container.addEventListener("scroll", handleScroll)
    return () => container.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
          A Glimpse of The Gambia's <span className="text-primary">Soul</span>
        </h2>
        <p className="text-xl text-muted-foreground text-center max-w-3xl mx-auto">
          Scroll through the diverse landscapes that make The Gambia a conservation treasure
        </p>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {storyPanels.map((panel, index) => (
          <div
            key={index}
            data-panel
            className="min-w-full h-[70vh] snap-center flex items-center relative overflow-hidden"
          >
            <div data-parallax-image className="absolute inset-0 w-[120%] h-full" style={{ willChange: "transform" }}>
              <Image
                src={panel.image || "/placeholder.svg"}
                alt={panel.title}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-linear-to-r from-background/90 via-background/50 to-transparent" />
            </div>

            <div
              data-fade-text
              className="relative z-10 max-w-7xl mx-auto px-8 md:px-16"
              style={{ willChange: "opacity" }}
            >
              <h3 className="text-5xl md:text-7xl font-bold mb-6 text-balance">{panel.title}</h3>
              <p className="text-2xl md:text-3xl text-muted-foreground max-w-2xl text-pretty">{panel.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2 mt-8">
        {storyPanels.map((_, index) => (
          <div
            key={index}
            className="h-2 w-12 rounded-full bg-muted transition-colors"
            style={{ backgroundColor: index === 0 ? "hsl(var(--primary))" : undefined }}
          />
        ))}
      </div>
    </section>
  )
}
