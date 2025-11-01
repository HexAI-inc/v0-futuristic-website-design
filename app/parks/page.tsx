"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Trees, ArrowRight, Filter } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { nationalParks } from "@/lib/parks-data"
import { useState } from "react"

export default function ParksPage() {
  const [selectedRegion, setSelectedRegion] = useState<string>("All")

  // Extract unique regions from parks data
  const regions = ["All", ...new Set(nationalParks.map(park => {
    // Extract the main region name (before parentheses if present)
    const location = park.location
    const match = location.match(/^([^()]+)/)
    return match ? match[1].trim() : location
  }))]

  // Filter parks based on selected region
  const filteredParks = selectedRegion === "All"
    ? nationalParks
    : nationalParks.filter(park => {
        const location = park.location
        const match = location.match(/^([^()]+)/)
        const mainRegion = match ? match[1].trim() : location
        return mainRegion === selectedRegion
      })

  return (
    <main className="min-h-screen pt-16">
      <div className="container mx-auto max-w-7xl px-4 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            National Parks & <span className="text-primary">Protected Areas</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            Discover The Gambia's diverse network of protected areas, from vast savanna landscapes to coastal mangroves,
            each safeguarding unique ecosystems and wildlife.
          </p>
        </div>

        {/* Region Filter */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Filter className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Filter by Region</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {regions.map((region) => (
              <Button
                key={region}
                variant={selectedRegion === region ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedRegion(region)}
                className="transition-all duration-200"
              >
                {region}
                {region !== "All" && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {nationalParks.filter(park => {
                      const location = park.location
                      const match = location.match(/^([^()]+)/)
                      const mainRegion = match ? match[1].trim() : location
                      return mainRegion === region
                    }).length}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Parks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredParks.map((park) => (
            <Card
              key={park.slug}
              className="group overflow-hidden hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 bg-card"
            >
              {/* Park Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={park.gallery[0]?.url || "/placeholder-park.jpg"}
                  alt={park.gallery[0]?.alt || park.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <Badge variant="secondary" className="mb-2">
                    Protected Area
                  </Badge>
                  <h3 className="text-xl font-semibold text-white mb-1">{park.name}</h3>
                </div>
              </div>

              {/* Park Info */}
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{park.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{park.established}</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {park.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <Trees className="h-4 w-4 text-primary" />
                    <span className="font-medium">{park.size}</span>
                  </div>

                  <Button asChild size="sm" className="gap-2">
                    <Link href={`/parks/${park.slug}`}>
                      Explore
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-lg text-center bg-card">
            <div className="text-3xl font-bold text-primary mb-2">{filteredParks.length}</div>
            <p className="text-muted-foreground">
              {selectedRegion === "All" ? "Protected Areas" : `${selectedRegion} Parks`}
            </p>
          </div>
          <div className="p-8 rounded-lg text-center bg-card">
            <div className="text-3xl font-bold text-primary mb-2">
              {filteredParks.reduce((total, park) => {
                const size = parseInt(park.size.replace(/,/g, '').split(' ')[0])
                return total + size
              }, 0).toLocaleString()}
            </div>
            <p className="text-muted-foreground">Total Hectares Protected</p>
          </div>
          <div className="p-8 rounded-lg text-center bg-card">
            <div className="text-3xl font-bold text-primary mb-2">
              {new Set(filteredParks.map(park => park.location.split(' ')[0])).size}
            </div>
            <p className="text-muted-foreground">Regions Covered</p>
          </div>
        </div>
      </div>
    </main>
  )
}
