"use client"

import { useState, useEffect } from "react"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerClose } from "@/components/ui/drawer"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, MapPin } from "lucide-react"
import Image from "next/image"
import { HonoraryICCA } from "@/lib/icca-data"

interface ICCADrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedICCA: HonoraryICCA | null
}

export function ICCADrawer({ open, onOpenChange, selectedICCA }: ICCADrawerProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640) // sm breakpoint
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Auto-scroll carousel every 5 seconds
  useEffect(() => {
    if (!selectedICCA || selectedICCA.gallery.length <= 1) return

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % selectedICCA.gallery.length)
    }, 5000) // 5 seconds

    return () => clearInterval(interval)
  }, [selectedICCA?.gallery.length])

  if (!selectedICCA) return null

  const openModal = (imageSrc: string) => {
    setSelectedImage(imageSrc)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedImage(null)
  }

  // Handle drawer/sheet close - ensure modal closes first
  const handleDrawerChange = (newOpen: boolean) => {
    if (!newOpen && modalOpen) {
      // If trying to close drawer but modal is open, close modal first
      closeModal()
      return
    }
    // Otherwise, proceed with normal drawer close
    onOpenChange(newOpen)
  }

  return (
    <>
      {isMobile ? (
        // Full screen sheet on mobile
        <Sheet open={open} onOpenChange={handleDrawerChange}>
          <SheetContent side="bottom" className="h-[90vh] max-h-[90vh] flex flex-col">
            <SheetHeader>
              <Badge className="w-fit mb-2 bg-primary">
                Honorary ICCA
              </Badge>
              <SheetTitle className="text-2xl">{selectedICCA.name}</SheetTitle>
              <SheetDescription className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {selectedICCA.region}
              </SheetDescription>
            </SheetHeader>

            <div className="px-4 pb-4 space-y-6 flex-1 overflow-y-auto">
              {/* Summary */}
              <p className="text-base leading-relaxed">{selectedICCA.summary}</p>

              {/* Highlights */}
              <div>
                <h4 className="font-semibold mb-3">Key Highlights</h4>
                <ul className="space-y-2">
                  {selectedICCA.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Image Carousel */}
              <div>
                <h4 className="font-semibold mb-3">Gallery</h4>
                <div className="relative">
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <Image
                      src={selectedICCA.gallery[currentImageIndex].src}
                      alt={selectedICCA.gallery[currentImageIndex].alt}
                      fill
                      className="object-cover cursor-pointer"
                      onClick={() => openModal(selectedICCA.gallery[currentImageIndex].src)}
                    />
                  </div>

                  {/* Dots */}
                  {selectedICCA.gallery.length > 1 && (
                    <div className="flex justify-center gap-1 mt-2">
                      {selectedICCA.gallery.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentImageIndex ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 border-t">
              <SheetClose asChild>
                <Button variant="outline" className="w-full">
                  Close
                </Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        // Side drawer on desktop
        <Drawer open={open} onOpenChange={handleDrawerChange} direction="right">
          <DrawerContent className="w-full sm:w-[900px] data-[state=open]:duration-700 data-[state=closed]:duration-700 h-full !inset-0 sm:!inset-y-0 sm:!right-0 sm:!left-auto sm:!border-l flex flex-col">
            <DrawerHeader>
              <Badge className="w-fit mb-2 bg-primary">
                Honorary ICCA
              </Badge>
              <DrawerTitle className="text-2xl">{selectedICCA.name}</DrawerTitle>
              <DrawerDescription className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {selectedICCA.region}
              </DrawerDescription>
            </DrawerHeader>

            <div className="px-4 pb-4 space-y-6 flex-1 overflow-y-auto">
              {/* Summary */}
              <p className="text-base leading-relaxed">{selectedICCA.summary}</p>

              {/* Highlights */}
              <div>
                <h4 className="font-semibold mb-3">Key Highlights</h4>
                <ul className="space-y-2">
                  {selectedICCA.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Image Carousel */}
              <div>
                <h4 className="font-semibold mb-3">Gallery</h4>
                <div className="relative">
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <Image
                      src={selectedICCA.gallery[currentImageIndex].src}
                      alt={selectedICCA.gallery[currentImageIndex].alt}
                      fill
                      className="object-cover cursor-pointer"
                      onClick={() => openModal(selectedICCA.gallery[currentImageIndex].src)}
                    />
                  </div>

                  {/* Dots */}
                  {selectedICCA.gallery.length > 1 && (
                    <div className="flex justify-center gap-1 mt-2">
                      {selectedICCA.gallery.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentImageIndex ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 border-t">
              <DrawerClose asChild>
                <Button variant="outline" className="w-full">
                  Close
                </Button>
              </DrawerClose>
            </div>
          </DrawerContent>
        </Drawer>
      )}

      {/* Image Modal - Above drawer */}
      {modalOpen && selectedImage && (
        <div
          className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center"
          onClick={closeModal}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <Image
              src={selectedImage}
              alt="Gallery image"
              width={1200}
              height={800}
              className="w-full h-auto object-contain rounded-lg"
            />
            <Button
              variant="outline"
              size="icon"
              className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm"
              onClick={closeModal}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
