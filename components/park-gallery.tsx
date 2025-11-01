"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"

interface GalleryImage {
  url: string
  alt: string
}

export function ParkGallery({ images }: { images: GalleryImage[] }) {
  const [selectedImage, setSelectedImage] = useState(0)

  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
          Photo <span className="text-primary">Gallery</span>
        </h2>

        <div className="space-y-6">
          <Card className="overflow-hidden">
            <img
              src={images[selectedImage].url || "/placeholder.svg"}
              alt={images[selectedImage].alt}
              className="w-full aspect-[16/9] object-cover"
            />
          </Card>

          <div className="grid grid-cols-3 gap-4">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative overflow-hidden rounded-lg transition-all duration-300 ${
                  selectedImage === index ? "ring-4 ring-primary" : "opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={image.url || "/placeholder.svg"}
                  alt={image.alt}
                  className="w-full aspect-video object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
