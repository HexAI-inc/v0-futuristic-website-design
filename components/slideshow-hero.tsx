"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Ruler } from "lucide-react"
import type { Park } from "@/lib/parks-data"

export function SlideshowHero({ park }: { park: Park }) {
  const [currentImage, setCurrentImage] = useState(0)
  const images = park.gallery.slice(0, 4) // Use first 4 images

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [images.length])

  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-2000 ${
              index === currentImage ? "opacity-100" : "opacity-0"
            }`}
            style={{ willChange: "opacity" }}
          >
            <Image
              src={image.url || "/placeholder.svg"}
              alt={image.alt}
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
        <Badge className="mb-6 text-base px-4 py-2">National Park</Badge>
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance">{park.name}</h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto text-pretty leading-relaxed">
          {park.description}
        </p>

        <div className="flex flex-wrap justify-center gap-6 text-lg">
          <div className="flex items-center gap-2">
            <Ruler className="h-5 w-5 text-primary" />
            <span>{park.size}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span>Est. {park.established}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <span>{park.location}</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {images.map((_, index) => (
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
