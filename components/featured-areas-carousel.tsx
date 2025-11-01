"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, MapPin, Calendar } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useTheme } from "@/lib/theme-context"

interface FeaturedArea {
  id: string
  name: string
  type: string
  image: string
  description: string
  size: string
  established: string
  link: string
}

const featuredAreas: FeaturedArea[] = [
  {
    id: "kiang-west",
    name: "Kiang West National Park",
    type: "National Park",
    image: "/kiang-west-national-park-gambia-savanna-landscape.jpg",
    description:
      "The country's flagship wilderness with rolling savannas, mangroves, and tidal creeks that shelter antelope, hyena, and 300+ bird species.",
    size: "29,051 ha",
    established: "1987",
    link: "/parks/kiang-west",
  },
  {
    id: "boa-bolong",
    name: "Boa Bolong Wetland Reserve",
    type: "Wetland Reserve",
    image: "/baobolong-bird-habitat.jpg",
    description:
      "A labyrinth of mangrove channels along the Gambia River—prime territory for spotting West African manatees, dolphins, and wading birds.",
    size: "29,650 ha",
    established: "1993",
    link: "/parks/boa-bolong",
  },
  {
    id: "tanbi",
    name: "Tanbi Wetland National Park",
    type: "Urban Wetland Park",
    image: "/coastal-mangrove-atlantic-ocean-gambia.jpg",
    description:
      "Banjul's green buffer—a UNESCO Ramsar site where mangroves, mudflats, and fisheries sustain coastal communities and migratory birds.",
    size: "6,034 ha",
    established: "2001",
    link: "/parks/tanbi-wetland",
  },
  {
    id: "river-gambia",
    name: "River Gambia National Park",
    type: "Island Sanctuary",
    image: "/gambia-river-islands-forest.jpg",
    description:
      "Five lush islands known as the Baboon Islands, home to The Gambia's chimpanzee rehabilitation project and spectacular river safaris.",
    size: "585 ha",
    established: "1978",
    link: "/parks/river-gambia",
  },
  {
    id: "abuko",
    name: "Abuko Nature Reserve",
    type: "Nature Reserve",
    image: "/tropical-gallery-forest-gambia.jpg",
    description:
      "A beloved gateway to Gambian biodiversity where visitors walk shaded boardwalks through gallery forest alive with primates and birds.",
    size: "134 ha",
    established: "1968",
    link: "/parks/abuko",
  },
]

export function FeaturedAreasCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const { theme } = useTheme()
  const isGlass = theme === "glass-morphism"

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredAreas.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToPrevious = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev - 1 + featuredAreas.length) % featuredAreas.length)
  }

  const goToNext = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev + 1) % featuredAreas.length)
  }

  const currentArea = featuredAreas[currentIndex]

  return (
    <section className="py-24 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            Featured <span className="text-primary">Protected Areas</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            Explore our most iconic conservation areas, each offering unique ecosystems and wildlife experiences
          </p>
        </div>

        <div className="relative">
          <Card className={`overflow-hidden ${isGlass ? "glass-card" : "bg-card"}`}>
            <div className="grid md:grid-cols-2 gap-0">
              {/* Image section */}
              <div className="relative h-[400px] md:h-[500px]">
                <Image
                  src={currentArea.image || "/placeholder.svg"}
                  alt={currentArea.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-background/80 to-transparent md:bg-linear-to-r" />
              </div>

              {/* Content section */}
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <Badge className="w-fit mb-4 bg-primary">{currentArea.type}</Badge>
                <h3 className="text-3xl md:text-4xl font-bold mb-4 text-balance">{currentArea.name}</h3>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">{currentArea.description}</p>

                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{currentArea.size}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>Est. {currentArea.established}</span>
                  </div>
                </div>

                <Link href={currentArea.link}>
                  <Button size="lg" className="w-full md:w-auto">
                    Explore This Area
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Navigation buttons */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrevious}
              className={`rounded-full ${isGlass ? "glass-button" : "bg-transparent"}`}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            {/* Dots indicator */}
            <div className="flex gap-2">
              {featuredAreas.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index)
                    setIsAutoPlaying(false)
                  }}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={goToNext}
              className={`rounded-full ${isGlass ? "glass-button" : "bg-transparent"}`}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
