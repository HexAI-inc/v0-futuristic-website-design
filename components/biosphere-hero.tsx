"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Globe, Award, Leaf } from "lucide-react"
import { BiosphereWithDetails } from "@/lib/database"

interface BiosphereHeroProps {
  biosphere: BiosphereWithDetails
}

export function BiosphereHero({ biosphere }: BiosphereHeroProps) {
  const [currentImage, setCurrentImage] = useState(0)
  
  // Use gallery images if available, otherwise use hero_image_url as a single-item array
  const images = biosphere.gallery && biosphere.gallery.length > 0 
    ? biosphere.gallery 
    : [{ url: biosphere.hero_image_url || "/wide-gambia-river-aerial-view.jpg", alt: biosphere.name }]

  useEffect(() => {
    if (images.length <= 1) return

    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [images.length])

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-2000 ${
              index === currentImage ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={image.url || "/wide-gambia-river-aerial-view.jpg"}
              alt={image.alt || `${biosphere.name} view`}
              fill
              className="object-cover animate-ken-burns"
              priority={index === 0}
              sizes="100vw"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/wide-gambia-river-aerial-view.jpg";
              }}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-linear-to-b from-background/90 via-background/70 to-background" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto py-24">
        <div className="flex justify-center items-center gap-3 mb-6">
          <Badge className="bg-chart-3 text-background text-base px-4 py-2">{biosphere.unesco_program}</Badge>
          <Award className="h-6 w-6 text-chart-3" />
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance">
          {biosphere.name.split(' ')[0]} <span className="text-chart-3">{biosphere.name.split(' ').slice(1).join(' ')}</span>
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty leading-relaxed">
          {biosphere.description}
        </p>

        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-12">
          <div className="bg-card/80 backdrop-blur-sm rounded-lg p-6">
            <Globe className="h-8 w-8 text-chart-3 mx-auto mb-3" />
            <div className="text-3xl font-bold text-chart-3 mb-2">{biosphere.total_area_hectares.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Hectares Protected</div>
          </div>
          <div className="bg-card/80 backdrop-blur-sm rounded-lg p-6">
            <Leaf className="h-8 w-8 text-chart-3 mx-auto mb-3" />
            <div className="text-3xl font-bold text-chart-3 mb-2">{biosphere.designation_year}</div>
            <div className="text-sm text-muted-foreground">UNESCO Designation</div>
          </div>
          <div className="bg-card/80 backdrop-blur-sm rounded-lg p-6">
            <Award className="h-8 w-8 text-chart-3 mx-auto mb-3" />
            <div className="text-3xl font-bold text-chart-3 mb-2">{biosphere.communities_involved}+</div>
            <div className="text-sm text-muted-foreground">Communities Involved</div>
          </div>
        </div>
      </div>

      {images.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                index === currentImage ? "bg-chart-3 w-8" : "bg-muted-foreground/50 hover:bg-muted-foreground"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
