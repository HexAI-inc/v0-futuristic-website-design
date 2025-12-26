"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Trees, ArrowRight, Filter, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { getParks, type ParkWithDetails } from "@/lib/database"
import { Skeleton } from "@/components/ui/skeleton"

export default function ParksPage() {
  const [parks, setParks] = useState<ParkWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedRegion, setSelectedRegion] = useState<string>("All")

  // Fetch parks data on component mount
  useEffect(() => {
    const fetchParks = async () => {
      try {
        setLoading(true)
        const parksData = await getParks()
        setParks(parksData)
      } catch (err) {
        console.error('Error fetching parks:', err)
        setError('Failed to load parks data')
      } finally {
        setLoading(false)
      }
    }

    fetchParks()
  }, [])

  // Extract unique regions from parks data
  const regions = ["All", ...new Set(parks.map(park => {
    // Extract the main region name (before parentheses if present)
    const location = park.location
    const match = location.match(/^([^()]+)/)
    return match ? match[1].trim() : location
  }))]

  // Filter parks based on selected region
  const filteredParks = selectedRegion === "All"
    ? parks
    : parks.filter(park => {
        const location = park.location
        const match = location.match(/^([^()]+)/)
        const mainRegion = match ? match[1].trim() : location
        return mainRegion === selectedRegion
      })

  if (loading) {
    return (
      <main className="min-h-screen pt-16">
        <div className="container mx-auto max-w-7xl px-4 py-20">
          {/* Header Skeleton */}
          <div className="text-center mb-16 space-y-4">
            <Skeleton className="h-12 w-3/4 md:w-1/2 mx-auto" />
            <Skeleton className="h-6 w-full md:w-2/3 mx-auto" />
            <Skeleton className="h-6 w-1/2 mx-auto" />
          </div>

          {/* Filter Skeleton */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-24 rounded-full" />
            ))}
          </div>

          {/* Parks Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-video w-full rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex gap-4 pt-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen pt-16">
        <div className="container mx-auto max-w-7xl px-4 py-20">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </main>
    )
  }

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
                    {parks.filter(park => {
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
