"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { BiosphereGallery as BiosphereGalleryType } from "@/lib/database"

export function BiosphereGallery({ images }: { images: BiosphereGalleryType[] }) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>(new Array(images.length).fill(false))

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return
      if (e.key === "ArrowRight") nextImage()
      if (e.key === "ArrowLeft") prevImage()
      if (e.key === "Escape") closeLightbox()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [lightboxOpen])

  // Cleanup overflow on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [])

  const openLightbox = (index: number) => {
    setCurrentIndex(index)
    setLightboxOpen(true)
    document.body.style.overflow = "hidden"
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    document.body.style.overflow = "unset"
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleImageLoad = (index: number) => {
    setImagesLoaded((prev) => {
      const newState = [...prev]
      newState[index] = true
      return newState
    })
  }

  if (!images || images.length === 0) return null

  return (
    <>
      <section className="py-24 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Visual <span className="text-chart-3">Journey</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore the breathtaking landscapes and diverse wildlife of the Niumi Biosphere Reserve through our curated collection of images.
            </p>
            <div className="mt-4 md:hidden flex items-center justify-center gap-2 text-chart-3 text-sm font-medium animate-pulse">
              <ChevronLeft className="h-4 w-4" />
              <span>Swipe to explore</span>
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>

          <div className="flex md:block overflow-x-auto md:overflow-visible snap-x snap-mandatory md:columns-2 lg:columns-3 gap-4 space-y-0 md:space-y-4 pb-8 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
            {images.map((image, index) => (
              <div
                key={image.id}
                className="min-w-[85vw] md:min-w-full snap-center break-inside-avoid relative group cursor-pointer overflow-hidden rounded-xl border bg-card h-[400px] md:h-auto"
                onClick={() => openLightbox(index)}
              >
                {!imagesLoaded[index] && <div className="absolute inset-0 bg-muted animate-pulse" />}

                <Image
                  src={image.url || "/placeholder.svg"}
                  alt={image.alt || "Biosphere image"}
                  width={800}
                  height={600}
                  className={`w-full h-full md:h-auto object-cover md:object-contain transition-all duration-500 ease-out group-hover:scale-110 ${
                    imagesLoaded[index] ? "opacity-100" : "opacity-0"
                  }`}
                  onLoad={() => handleImageLoad(index)}
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-chart-3/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center">
                  <div className="bg-background/90 backdrop-blur-sm p-3 rounded-full mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <ChevronRight className="h-6 w-6 text-chart-3" />
                  </div>
                  {image.caption && (
                    <p className="text-white font-medium drop-shadow-md transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                      {image.caption}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex items-center justify-center animate-in fade-in duration-300"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-4 right-4 z-10 h-12 w-12 rounded-full bg-background/50 hover:bg-background" 
            onClick={closeLightbox}
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Navigation buttons */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 z-10 h-12 w-12 rounded-full bg-background/50 hover:bg-background hidden md:flex"
            onClick={(e) => {
              e.stopPropagation()
              prevImage()
            }}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 z-10 h-12 w-12 rounded-full bg-background/50 hover:bg-background hidden md:flex"
            onClick={(e) => {
              e.stopPropagation()
              nextImage()
            }}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>

          {/* Image container */}
          <div className="relative w-full max-w-5xl max-h-[80vh] px-4" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-[16/9] w-full">
              <Image
                src={images[currentIndex].url || "/placeholder.svg"}
                alt={images[currentIndex].alt || "Biosphere image"}
                fill
                className="object-contain"
                priority
              />
            </div>
            
            <div className="mt-6 text-center">
              <h3 className="text-xl font-semibold text-foreground">
                {images[currentIndex].alt || "Niumi Biosphere Reserve"}
              </h3>
              {images[currentIndex].caption && (
                <p className="text-muted-foreground mt-2">
                  {images[currentIndex].caption}
                </p>
              )}
              <div className="mt-4 text-sm text-muted-foreground">
                {currentIndex + 1} / {images.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
