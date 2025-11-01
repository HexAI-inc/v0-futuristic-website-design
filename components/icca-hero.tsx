"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Users, Heart, Leaf } from "lucide-react"

export function ICCAHero() {
  const [currentImage, setCurrentImage] = useState(0)

  const heroImages = [
    "/tumani-tenda-village-life.jpg",
    "/baobolong-fishing-community.jpg",
    "/makasutu-sacred-grove.jpg",
    "/pirang-environmental-education.jpg",
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [heroImages.length])

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-2000 ${
              index === currentImage ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt="Community conservation"
              fill
              className="object-cover animate-ken-burns"
              priority={index === 0}
              sizes="100vw"
            />
          </div>
    ))}
    <div className="absolute inset-0 bg-linear-to-b from-background/90 via-background/70 to-background" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto py-24">
        <div className="flex justify-center gap-4 mb-6">
          <div className="bg-secondary/20 rounded-full p-3 backdrop-blur-sm">
            <Users className="h-8 w-8 text-secondary" />
          </div>
          <div className="bg-primary/20 rounded-full p-3 backdrop-blur-sm">
            <Heart className="h-8 w-8 text-primary" />
          </div>
          <div className="bg-secondary/20 rounded-full p-3 backdrop-blur-sm">
            <Leaf className="h-8 w-8 text-secondary" />
          </div>
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance">
          Community-Led <span className="text-secondary">Conservation</span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty leading-relaxed">
          Indigenous and Community Conserved Areas (ICCAs) represent the heart of grassroots environmental stewardship
          in The Gambia, where local communities protect their natural heritage for future generations.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" className="text-lg px-8 py-6">
            Explore ICCAs
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-background/20 backdrop-blur-sm">
            Support Communities
          </Button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              index === currentImage ? "bg-primary w-8" : "bg-muted-foreground/50 hover:bg-muted-foreground"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
