"use client"

import { useState } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface GalleryImage {
  url: string
  alt: string
}

export function MasonryGallery({ images }: { images: GalleryImage[] }) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>(new Array(images.length).fill(false))

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

  return (
    <>
      <section className="py-24 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
            Photo <span className="text-primary">Gallery</span>
          </h2>

          <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
            {images.map((image, index) => (
              <div
                key={index}
                className="break-inside-avoid relative group cursor-pointer overflow-hidden rounded-lg"
                onClick={() => openLightbox(index)}
              >
                {!imagesLoaded[index] && <div className="absolute inset-0 bg-muted animate-pulse" />}

                <Image
                  src={image.url || "/placeholder.svg"}
                  alt={image.alt}
                  width={800}
                  height={600}
                  className={`w-full h-auto transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105 ${
                    imagesLoaded[index] ? "opacity-100" : "opacity-0"
                  }`}
                  onLoad={() => handleImageLoad(index)}
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] flex items-center justify-center">
                  <span className="text-primary text-lg font-semibold">View</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-lg flex items-center justify-center animate-in fade-in duration-300"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <Button variant="ghost" size="icon" className="absolute top-4 right-4 z-10 h-12 w-12" onClick={closeLightbox}>
            <X className="h-6 w-6" />
          </Button>

          {/* Navigation buttons */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 z-10 h-12 w-12"
            onClick={(e) => {
              e.stopPropagation()
              prevImage()
            }}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 z-10 h-12 w-12"
            onClick={(e) => {
              e.stopPropagation()
              nextImage()
            }}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          <div
            className="relative max-w-7xl max-h-[90vh] animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[currentIndex].url || "/placeholder.svg"}
              alt={images[currentIndex].alt}
              width={1920}
              height={1080}
              className="max-w-full max-h-[90vh] w-auto h-auto object-contain"
              priority
            />
            <p className="text-center mt-4 text-muted-foreground">
              {currentIndex + 1} / {images.length}
            </p>
          </div>
        </div>
      )}
    </>
  )
}
