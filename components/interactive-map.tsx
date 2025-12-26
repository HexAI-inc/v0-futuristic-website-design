"use client"

import React, { useState } from "react"
import dynamic from 'next/dynamic'
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { MapPin, Trees, Users, Globe, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useTheme } from "@/lib/theme-context"

// Dynamically import map component to avoid SSR issues
const MapComponent = dynamic(() => import('./map-component'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-muted/50 rounded-lg flex items-center justify-center">
      <div className="flex flex-col items-center space-y-2">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-sm text-muted-foreground">Loading interactive map...</p>
      </div>
    </div>
  )
})

interface ProtectedArea {
  id: string
  name: string
  type: "national-park" | "icca" | "biosphere"
  coordinates: [number, number] // [longitude, latitude]
  size: string
  description: string
  gallery?: { url?: string; src?: string; alt?: string }[]
}

const typeConfig = {
  "national-park": {
    label: "National Park",
    color: "bg-primary",
    icon: Trees,
  },
  icca: {
    label: "ICCA",
    color: "bg-secondary",
    icon: Users,
  },
  biosphere: {
    label: "Biosphere",
    color: "bg-chart-3",
    icon: Globe,
  },
}

export function InteractiveMap() {
  const [protectedAreas, setProtectedAreas] = useState<ProtectedArea[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedArea, setSelectedArea] = useState<ProtectedArea | null>(null)
  const [filter, setFilter] = useState<string>("all")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isLargeScreen, setIsLargeScreen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [loadingGallery, setLoadingGallery] = useState(false)
  const { theme } = useTheme()
  // Theme is fixed to midnight-jungle, so glass-morphism styling is never applied
const isGlass = false

  // Fetch areas from database
  React.useEffect(() => {
    const fetchAreas = async () => {
      try {
        setLoading(true)
        const [parksRes, iccasRes, biosphereRes] = await Promise.all([
          fetch('/api/parks'),
          fetch('/api/iccas'),
          fetch('/api/biosphere')
        ])

        const parksData = await parksRes.json()
        const iccasData = await iccasRes.json()
        const biosphereData = await biosphereRes.json()

        const formattedParks = (parksData || []).map((p: any) => ({
          id: p.id,
          name: p.name,
          type: "national-park",
          coordinates: p.coordinates ? p.coordinates.split(',').map(Number) : [-15.8, 13.3],
          size: p.size || "Unknown size",
          description: p.description
        }))

        const formattedIccas = (iccasData || []).map((i: any) => ({
          id: i.id,
          name: i.name,
          type: "icca",
          coordinates: i.coordinates ? i.coordinates.split(',').map(Number) : [-15.5, 13.4],
          size: i.region || "Community Managed",
          description: i.summary
        }))

        const formattedBiosphere = biosphereData ? [{
          id: biosphereData.id,
          name: biosphereData.name,
          type: "biosphere",
          coordinates: biosphereData.coordinates ? biosphereData.coordinates.split(',').map(Number) : [-16.6, 13.5],
          size: `${biosphereData.total_area_hectares?.toLocaleString() || '68,530'} ha`,
          description: biosphereData.description
        }] : []

        setProtectedAreas([...formattedParks, ...formattedIccas, ...formattedBiosphere])
      } catch (error) {
        console.error('Error fetching map areas:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAreas()
  }, [])

  // Check screen size on mount and resize
  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024) // lg breakpoint
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const filteredAreas = filter === "all" ? protectedAreas : protectedAreas.filter((area) => area.type === filter)

  const handleAreaClick = async (area: ProtectedArea) => {
    setSelectedArea(area)
    setDrawerOpen(true)
    setCurrentImageIndex(0)
    
    // Fetch gallery for the selected area
    setLoadingGallery(true)
    try {
      let endpoint = ""
      if (area.type === "national-park") {
        endpoint = `/api/parks/${area.id}`
      } else if (area.type === "icca") {
        // If it's a placeholder ID like icca-1, we might not find it
        // but we'll try anyway
        endpoint = `/api/iccas/${area.id}`
      }

      if (endpoint) {
        const response = await fetch(endpoint)
        if (response.ok) {
          const data = await response.json()
          setSelectedArea(prev => prev ? { ...prev, gallery: data.gallery } : null)
        }
      }
    } catch (error) {
      console.error('Error fetching gallery:', error)
    } finally {
      setLoadingGallery(false)
    }
  }

  const nextImage = () => {
    if (selectedArea?.gallery && selectedArea.gallery.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedArea.gallery.length)
    }
  }

  const prevImage = () => {
    if (selectedArea?.gallery && selectedArea.gallery.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedArea.gallery.length) % selectedArea.gallery.length)
    }
  }

  return (
    <section className={`py-24 px-4 ${isGlass ? "glass-section" : "bg-muted/30"}`}>
      <div className="max-w-[1600px] mx-auto">
        <div className="text-center mb-16 px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            Explore <span className="text-primary">Protected Areas</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            Discover the diverse network of conservation areas across The Gambia, from national parks to
            community-managed reserves.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")} className="gap-2">
            All Areas
          </Button>
          <Button
            variant={filter === "biosphere" ? "default" : "outline"}
            onClick={() => setFilter("biosphere")}
            className="gap-2"
          >
            <Globe className="h-4 w-4" />
            Biosphere Reserves
          </Button>
          <Button
            variant={filter === "national-park" ? "default" : "outline"}
            onClick={() => setFilter("national-park")}
            className="gap-2"
          >
            <Trees className="h-4 w-4" />
            National Parks
          </Button>
          <Button
            variant={filter === "icca" ? "default" : "outline"}
            onClick={() => setFilter("icca")}
            className="gap-2"
          >
            <Users className="h-4 w-4" />
            ICCAs
          </Button>
        </div>

        <Card className={`p-4 md:p-6 max-w-full mx-auto ${isGlass ? "glass-card" : "bg-card"}`}>
          <div className="relative w-full h-[500px] md:h-[700px] bg-muted/50 rounded-lg overflow-hidden">
            {loading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm z-10">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground font-medium">Loading conservation data...</p>
              </div>
            ) : (
              <MapComponent
                filteredAreas={filteredAreas}
                selectedArea={selectedArea}
                theme={theme}
                onAreaClick={handleAreaClick}
              />
            )}
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap gap-4 justify-center">
            {Object.entries(typeConfig).map(([key, config]) => {
              const Icon = config.icon
              return (
                <div key={key} className="flex items-center gap-2">
                  <div className={`${config.color} rounded-full p-1.5`}>
                    <Icon className="h-3 w-3 text-background" />
                  </div>
                  <span className="text-sm text-muted-foreground">{config.label}</span>
                </div>
              )
            })}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">Click on any marker to learn more</p>
        </Card>

        {/* Drawer for small screens */}
        {!isLargeScreen && (
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerContent>
              <DrawerHeader className="text-left">
                {selectedArea && (
                  <>
                    <Badge className={`${typeConfig[selectedArea.type]?.color} w-fit mb-2`}>
                      {typeConfig[selectedArea.type]?.label}
                    </Badge>
                    <DrawerTitle className="text-2xl">{selectedArea.name}</DrawerTitle>
                    <DrawerDescription className="flex items-center gap-2 text-base">
                      <MapPin className="h-4 w-4" />
                      {selectedArea.size}
                    </DrawerDescription>
                  </>
                )}
              </DrawerHeader>
              <div className="px-4 pb-4">
                {selectedArea && (
                  <>
                    {/* Image Carousel */}
                    <div className="mb-6">
                      {loadingGallery ? (
                        <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                          <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </div>
                      ) : selectedArea.gallery && selectedArea.gallery.length > 0 ? (
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-muted group">
                          <Image
                            src={selectedArea.gallery[currentImageIndex].url || selectedArea.gallery[currentImageIndex].src || ""}
                            alt={selectedArea.gallery[currentImageIndex].alt || selectedArea.name}
                            fill
                            className="object-cover"
                          />
                          
                          {selectedArea.gallery.length > 1 && (
                            <>
                              <button
                                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full transition-colors"
                              >
                                <ChevronLeft className="h-5 w-5" />
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full transition-colors"
                              >
                                <ChevronRight className="h-5 w-5" />
                              </button>
                              
                              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                                {selectedArea.gallery.map((_, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => setCurrentImageIndex(idx)}
                                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                                      idx === currentImageIndex ? "bg-white w-3" : "bg-white/50"
                                    }`}
                                  />
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      ) : (
                        <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                          <Trees className="h-12 w-12 text-muted-foreground/20" />
                        </div>
                      )}
                    </div>

                    <p className="text-base leading-relaxed mb-6">{selectedArea.description}</p>
                    {selectedArea.type === "national-park" ? (
                      <Link href={`/parks/${selectedArea.id}`}>
                        <Button className="w-full" size="lg">
                          Explore This Park
                        </Button>
                      </Link>
                    ) : selectedArea.type === "icca" ? (
                      <Link href={`/iccas/${selectedArea.id}`}>
                        <Button className="w-full" size="lg">
                          Explore This ICCA
                        </Button>
                      </Link>
                    ) : (
                      <Link href="/biosphere">
                        <Button className="w-full" size="lg">
                          Discover Biosphere Reserve
                        </Button>
                      </Link>
                    )}
                  </>
                )}
              </div>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button variant="outline">Close</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        )}

        {/* Sheet for large screens */}
        {isLargeScreen && (
          <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
            <SheetContent side="right" className="w-full sm:max-w-lg">
              <SheetHeader className="text-left">
                {selectedArea && (
                  <>
                    <Badge className={`${typeConfig[selectedArea.type]?.color} w-fit mb-2`}>
                      {typeConfig[selectedArea.type]?.label}
                    </Badge>
                    <SheetTitle className="text-2xl">{selectedArea.name}</SheetTitle>
                    <SheetDescription className="flex items-center gap-2 text-base">
                      <MapPin className="h-4 w-4" />
                      {selectedArea.size}
                    </SheetDescription>
                  </>
                )}
              </SheetHeader>
              <div className="py-4">
                {selectedArea && (
                  <>
                    {/* Image Carousel */}
                    <div className="mb-6">
                      {loadingGallery ? (
                        <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                          <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </div>
                      ) : selectedArea.gallery && selectedArea.gallery.length > 0 ? (
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-muted group">
                          <Image
                            src={selectedArea.gallery[currentImageIndex].url || selectedArea.gallery[currentImageIndex].src || ""}
                            alt={selectedArea.gallery[currentImageIndex].alt || selectedArea.name}
                            fill
                            className="object-cover"
                          />
                          
                          {selectedArea.gallery.length > 1 && (
                            <>
                              <button
                                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <ChevronLeft className="h-5 w-5" />
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <ChevronRight className="h-5 w-5" />
                              </button>
                              
                              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                                {selectedArea.gallery.map((_, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => setCurrentImageIndex(idx)}
                                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                                      idx === currentImageIndex ? "bg-white w-3" : "bg-white/50"
                                    }`}
                                  />
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      ) : (
                        <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                          <Trees className="h-12 w-12 text-muted-foreground/20" />
                        </div>
                      )}
                    </div>

                    <p className="text-base leading-relaxed mb-6">{selectedArea.description}</p>
                    {selectedArea.type === "national-park" ? (
                      <Link href={`/parks/${selectedArea.id}`}>
                        <Button className="w-full" size="lg">
                          Explore This Park
                        </Button>
                      </Link>
                    ) : selectedArea.type === "icca" ? (
                      <Link href={`/iccas/${selectedArea.id}`}>
                        <Button className="w-full" size="lg">
                          Explore This ICCA
                        </Button>
                      </Link>
                    ) : (
                      <Link href="/biosphere">
                        <Button className="w-full" size="lg">
                          Discover Biosphere Reserve
                        </Button>
                      </Link>
                    )}
                  </>
                )}
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button variant="outline">Close</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </section>
  )
}
