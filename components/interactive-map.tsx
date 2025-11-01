"use client"

import { useState } from "react"
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
import { MapPin, Trees, Users, Globe } from "lucide-react"
import Link from "next/link"
import { useTheme } from "@/lib/theme-context"

interface ProtectedArea {
  id: string
  name: string
  type: "national-park" | "icca" | "biosphere"
  position: { x: number; y: number }
  size: string
  description: string
}

const protectedAreas: ProtectedArea[] = [
  {
    id: "kiang-west",
    name: "Kiang West National Park",
    type: "national-park",
    position: { x: 35, y: 55 },
    size: "11,526 ha",
    description: "The largest protected area in The Gambia",
  },
  {
    id: "niumi",
    name: "Niumi National Park",
    type: "national-park",
    position: { x: 15, y: 35 },
    size: "4,940 ha",
    description: "Coastal mangrove forests and wetlands",
  },
  {
    id: "river-gambia",
    name: "River Gambia National Park",
    type: "national-park",
    position: { x: 60, y: 45 },
    size: "585 ha",
    description: "Home to chimpanzees and diverse wildlife",
  },
  {
    id: "abuko",
    name: "Abuko Nature Reserve",
    type: "national-park",
    position: { x: 25, y: 48 },
    size: "107 ha",
    description: "Gallery forest with rich biodiversity",
  },
  {
    id: "tanji",
    name: "Tanji River Bird Reserve",
    type: "national-park",
    position: { x: 22, y: 52 },
    size: "612 ha",
    description: "Important bird habitat and wetland",
  },
  {
    id: "bijilo",
    name: "Bijilo Forest Park",
    type: "national-park",
    position: { x: 20, y: 50 },
    size: "51.3 ha",
    description: "Coastal forest with monkey populations",
  },
  {
    id: "icca-1",
    name: "Tumani Tenda ICCA",
    type: "icca",
    position: { x: 55, y: 42 },
    size: "1,200 ha",
    description: "Community-managed conservation area",
  },
  {
    id: "icca-2",
    name: "Baobolong Wetland ICCA",
    type: "icca",
    position: { x: 45, y: 38 },
    size: "2,300 ha",
    description: "Wetland conservation by local communities",
  },
  {
    id: "niumi-biosphere",
    name: "Niumi Biosphere Reserve",
    type: "biosphere",
    position: { x: 18, y: 40 },
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
  const { theme } = useTheme()
  const isGlass = theme === "glass-morphism"

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
            {/* Simplified Gambia map shape */}
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* River Gambia representation */}
              <path
                d="M 5 45 Q 30 40, 50 45 T 95 50"
                stroke="oklch(0.65 0.12 200)"
                strokeWidth="8"
                fill="none"
                opacity="0.3"
              />
              {/* Country outline */}
              <path
                d="M 5 35 L 95 35 L 95 65 L 5 65 Z"
                stroke="oklch(0.25 0 0)"
                strokeWidth="1"
                fill="oklch(0.18 0 0)"
                opacity="0.5"
              />
            </svg>

            {/* Protected area markers */}
            {filteredAreas.map((area) => {
              const config = typeConfig[area.type]
              const Icon = config.icon
              const isSelected = selectedArea?.id === area.id

              return (
                <button
                  key={area.id}
                  onClick={() => handleAreaClick(area)}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-125 ${
                    isSelected ? "scale-125 z-10" : "z-0"
                  }`}
                  style={{
                    left: `${area.position.x}%`,
                    top: `${area.position.y}%`,
                  }}
                  aria-label={`View ${area.name}`}
                >
                  <div className={`${config.color} rounded-full p-2 shadow-lg ${isSelected ? "animate-glow" : ""}`}>
                    <Icon className="h-4 w-4 text-background" />
                  </div>
                </button>
              )
            })}
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

        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DrawerContent>
            <DrawerHeader className="text-left">
              {selectedArea && (
                <>
                  <Badge className={`${typeConfig[selectedArea.type].color} w-fit mb-2`}>
                    {typeConfig[selectedArea.type].label}
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
      </div>
    </section>
  )
}
