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
import { MapPin, Trees, Users, Globe } from "lucide-react"
import Link from "next/link"
import { useTheme } from "@/lib/theme-context"

// Dynamically import map component to avoid SSR issues
const MapComponent = dynamic(() => import('./map-component'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-muted/50 rounded-lg flex items-center justify-center">Loading map...</div>
})

interface ProtectedArea {
  id: string
  name: string
  type: "national-park" | "icca" | "biosphere"
  coordinates: [number, number] // [longitude, latitude]
  size: string
  description: string
}

const protectedAreas: ProtectedArea[] = [
  {
    id: "kiang-west",
    name: "Kiang West National Park",
    type: "national-park",
    coordinates: [-15.8, 13.3], // Approximate coordinates for Kiang West
    size: "11,526 ha",
    description: "The largest protected area in The Gambia",
  },
  {
    id: "niumi",
    name: "Niumi National Park",
    type: "national-park",
    coordinates: [-16.7, 13.5], // Approximate coordinates for Niumi
    size: "4,940 ha",
    description: "Coastal mangrove forests and wetlands",
  },
  {
    id: "river-gambia",
    name: "River Gambia National Park",
    type: "national-park",
    coordinates: [-15.0, 13.6], // Approximate coordinates for River Gambia
    size: "585 ha",
    description: "Home to chimpanzees and diverse wildlife",
  },
  {
    id: "abuko",
    name: "Abuko Nature Reserve",
    type: "national-park",
    coordinates: [-16.65, 13.4], // Approximate coordinates for Abuko
    size: "107 ha",
    description: "Gallery forest with rich biodiversity",
  },
  {
    id: "tanji",
    name: "Tanji River Bird Reserve",
    type: "national-park",
    coordinates: [-16.8, 13.35], // Approximate coordinates for Tanji
    size: "612 ha",
    description: "Important bird habitat and wetland",
  },
  {
    id: "bijilo",
    name: "Bijilo Forest Park",
    type: "national-park",
    coordinates: [-16.7, 13.45], // Approximate coordinates for Bijilo
    size: "51.3 ha",
    description: "Coastal forest with monkey populations",
  },
  {
    id: "icca-1",
    name: "Tumani Tenda ICCA",
    type: "icca",
    coordinates: [-15.2, 13.5], // Approximate coordinates for Tumani Tenda
    size: "1,200 ha",
    description: "Community-managed conservation area",
  },
  {
    id: "icca-2",
    name: "Baobolong Wetland ICCA",
    type: "icca",
    coordinates: [-15.5, 13.4], // Approximate coordinates for Baobolong
    size: "2,300 ha",
    description: "Wetland conservation by local communities",
  },
  {
    id: "niumi-biosphere",
    name: "Niumi Biosphere Reserve",
    type: "biosphere",
    coordinates: [-16.6, 13.5], // Approximate coordinates for Niumi Biosphere
    size: "68,530 ha",
    description: "UNESCO Biosphere Reserve",
  },
]

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
  const [selectedArea, setSelectedArea] = useState<ProtectedArea | null>(null)
  const [filter, setFilter] = useState<string>("all")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isLargeScreen, setIsLargeScreen] = useState(false)
  const { theme } = useTheme()
  const isGlass = theme === "glass-morphism"

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

  const handleAreaClick = (area: ProtectedArea) => {
    setSelectedArea(area)
    setDrawerOpen(true)
  }

  return (
    <section className={`py-24 px-4 ${isGlass ? "glass-section" : "bg-muted/30"}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
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

        <Card className={`p-8 max-w-5xl mx-auto ${isGlass ? "glass-card" : "bg-card"}`}>
          <div className="relative w-full aspect-16/10 bg-muted/50 rounded-lg overflow-hidden">
            <MapComponent
              filteredAreas={filteredAreas}
              selectedArea={selectedArea}
              theme={theme}
              onAreaClick={handleAreaClick}
            />
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
                    <p className="text-base leading-relaxed mb-6">{selectedArea.description}</p>
                    {selectedArea.type === "national-park" ? (
                      <Link href={`/parks/${selectedArea.id}`}>
                        <Button className="w-full" size="lg">
                          Explore This Park
                        </Button>
                      </Link>
                    ) : selectedArea.type === "icca" ? (
                      <Link href="/iccas">
                        <Button className="w-full" size="lg">
                          Learn About ICCAs
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
                    <p className="text-base leading-relaxed mb-6">{selectedArea.description}</p>
                    {selectedArea.type === "national-park" ? (
                      <Link href={`/parks/${selectedArea.id}`}>
                        <Button className="w-full" size="lg">
                          Explore This Park
                        </Button>
                      </Link>
                    ) : selectedArea.type === "icca" ? (
                      <Link href="/iccas">
                        <Button className="w-full" size="lg">
                          Learn About ICCAs
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
