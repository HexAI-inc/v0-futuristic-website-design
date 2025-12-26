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

export function FeaturedAreasCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [content, setContent] = useState({
    title: "Featured Protected Areas",
    subtitle: "Explore our most iconic conservation areas, each offering unique ecosystems and wildlife experiences",
    areas: [] as FeaturedArea[]
  })

  useEffect(() => {
    fetch('/api/admin/home')
      .then(res => res.json())
      .then(data => {
        if (data.featured_areas) setContent(data.featured_areas)
      })
      .catch(err => console.error("Error fetching featured areas content:", err))
  }, [])

  const { theme } = useTheme()
  // Theme is fixed to midnight-jungle, so glass-morphism styling is never applied
  const isGlass = false

  useEffect(() => {
    if (!isAutoPlaying || content.areas.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % content.areas.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, content.areas.length])

  const goToPrevious = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev - 1 + content.areas.length) % content.areas.length)
  }

  const goToNext = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev + 1) % content.areas.length)
  }

  if (content.areas.length === 0) return null

  const currentArea = content.areas[currentIndex]

  return (
    <section className="py-24 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            {content.title.split(' ').map((word, i) => 
              word.toLowerCase() === 'protected' || word.toLowerCase() === 'areas' ? 
              <span key={i} className="text-primary">{word} </span> : word + ' '
            )}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            {content.subtitle}
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
              {content.areas.map((_, index) => (
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
