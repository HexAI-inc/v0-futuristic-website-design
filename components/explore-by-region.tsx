"use client"

import { useState } from "react"
import { MapPin } from "lucide-react"
import { useTheme } from "@/lib/theme-context"

interface ProtectedArea {
  name: string
  type: "park" | "icca" | "biosphere"
}

interface Region {
  name: string
  image: string
  areas: ProtectedArea[]
}

const regions: Region[] = [
  {
    name: "Greater Banjul Area",
    image: "/dense-forest-canopy-abuko-gambia.jpg",
    areas: [
      { name: "Abuko Nature Reserve", type: "park" },
      { name: "Bijilo Forest Park", type: "park" },
    ],
  },
  {
    name: "West Coast Region (WCR)",
    image: "/makasutu-forest-canopy.jpg",
    areas: [
      { name: "Tanji Bird Reserve", type: "park" },
      { name: "Makasutu Culture Forest", type: "icca" },
      { name: "Pirang Forest Park", type: "icca" },
    ],
  },
  {
    name: "Lower River Region (LRR)",
    image: "/kiang-west-national-park-gambia-savanna-landscape.jpg",
    areas: [
      { name: "Kiang West National Park", type: "park" },
      { name: "Bintang Bolong Community Conservation Area", type: "icca" },
    ],
  },
  {
    name: "North Bank Region (NBR)",
    image: "/baobolong-bird-habitat.jpg",
    areas: [
      { name: "Niumi National Park", type: "park" },
      { name: "Bao Bolong Wetland Reserve", type: "park" },
      { name: "Jokadou National Park", type: "park" },
      { name: "Pakau Njogu Community Conservation Area", type: "icca" },
      { name: "Niumi Biosphere Reserve", type: "biosphere" },
    ],
  },
  {
    name: "Central River Region (CRR)",
    image: "/gambia-river-islands-forest.jpg",
    areas: [
      { name: "River Gambia National Park (Baboon Islands)", type: "park" },
      { name: "Tumani Tenda Community Conservation Area", type: "icca" },
    ],
  },
  {
    name: "Upper River Region (URR)",
    image: "/african-bushbuck-antelope.jpg",
    areas: [{ name: "Simenti Nature Reserve", type: "park" }],
  },
]

export function ExploreByRegion() {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)
  const { theme } = useTheme()
  // Theme is fixed to midnight-jungle, so glass-morphism styling is never applied
  const isGlass = false

  const getTypeColor = (type: ProtectedArea["type"]) => {
    switch (type) {
      case "park":
        return "text-primary"
      case "icca":
        return "text-secondary"
      case "biosphere":
        return "text-[var(--biosphere)]"
    }
  }

  return (
    <section className={`py-20 px-4 ${isGlass ? "glass-section" : "bg-card/50"}`}>
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Explore by Region</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover protected areas across The Gambia's six administrative regions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regions.map((region) => (
            <div
              key={region.name}
              className="relative group overflow-hidden rounded-lg h-[300px]"
              onMouseEnter={() => setHoveredRegion(region.name)}
              onMouseLeave={() => setHoveredRegion(null)}
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url(${region.image})` }}
              />
              <div className="absolute inset-0 bg-black/60 group-hover:bg-black/70 transition-colors" />

              <div className="relative p-6 h-full flex flex-col justify-end">
                <div className="flex items-start gap-3 mb-2">
                  <MapPin className="h-6 w-6 text-primary shrink-0 mt-1" />
                  <h3 className="text-xl font-semibold text-white">{region.name}</h3>
                </div>

                <div
                  className={`space-y-2 transition-all duration-300 ${
                    hoveredRegion === region.name ? "opacity-100 max-h-96" : "opacity-0 max-h-0 overflow-hidden"
                  }`}
                >
                  <p className="text-sm text-gray-300 mb-3">Protected Areas:</p>
                  {region.areas.map((area, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${getTypeColor(area.type)}`} />
                      <p className={`text-sm font-medium ${getTypeColor(area.type)}`}>{area.name}</p>
                    </div>
                  ))}
                </div>

                {hoveredRegion !== region.name && (
                  <p className="text-sm text-gray-300">
                    {region.areas.length} protected area{region.areas.length !== 1 ? "s" : ""}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "var(--biosphere)" }} />
            <span>Biosphere Reserve</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span>National Parks & Reserves</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-secondary" />
            <span>ICCAs</span>
          </div>
        </div>
      </div>
    </section>
  )
}
