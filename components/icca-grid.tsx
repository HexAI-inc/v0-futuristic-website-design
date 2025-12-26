"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Users, TreePine, Loader2, ArrowRight } from "lucide-react"
import Image from "next/image"
import { useTheme } from "@/lib/theme-context"
import { useState, useEffect } from "react"
import { getIccas, getIcca, type Icca, type IccaWithDetails } from "@/lib/database"
import { ICCADrawer } from "@/components/icca-drawer"
import Link from "next/link"

export function ICCAGrid() {
  const { theme } = useTheme()
  const [iccas, setIccas] = useState<Icca[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedIcca, setSelectedIcca] = useState<IccaWithDetails | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isFetchingDetails, setIsFetchingDetails] = useState(false)
  const [visibleCount, setVisibleCount] = useState(8)

  useEffect(() => {
    const fetchIccas = async () => {
      try {
        setLoading(true)
        const iccasData = await getIccas()
        setIccas(iccasData)
      } catch (err) {
        console.error('Error fetching ICCAs:', err)
        setError('Failed to load ICCAs data')
      } finally {
        setLoading(false)
      }
    }

    fetchIccas()
  }, [])

  const handleLearnMore = async (id: string) => {
    try {
      setIsFetchingDetails(true)
      const details = await getIcca(id)
      if (details) {
        setSelectedIcca(details)
        setIsDrawerOpen(true)
      }
    } catch (err) {
      console.error('Error fetching ICCA details:', err)
    } finally {
      setIsFetchingDetails(false)
    }
  }

  // Theme is fixed to midnight-jungle, so glass-morphism styling is never applied
const isGlass = false

  if (loading) {
    return (
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
              Community <span className="text-secondary">Conservation Areas</span>
            </h2>
          </div>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-secondary" />
            <span className="ml-2 text-muted-foreground">Loading ICCAs...</span>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
              Community <span className="text-secondary">Conservation Areas</span>
            </h2>
          </div>
          <div className="text-center py-12">
            <p className="text-destructive">{error}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            Community <span className="text-secondary">Conservation Areas</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            Explore the diverse network of community-managed protected areas where traditional knowledge meets modern
            conservation practices.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {iccas.slice(0, visibleCount).map((icca) => (
            <Card
              key={icca.id}
              className={`overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col ${isGlass ? "glass-card" : "bg-card"}`}
            >
              <div className="relative h-48 overflow-hidden group">
                <Image
                  src={icca.hero_image || "/placeholder.svg"}
                  alt={icca.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-secondary text-secondary-foreground text-[10px] px-2 py-0">ICCA</Badge>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 line-clamp-1">{icca.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <MapPin className="h-3 w-3 text-secondary" />
                    <span>{icca.region}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4">
                    {icca.summary}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-auto">
                  <Button 
                    variant="secondary"
                    size="sm"
                    className="text-xs h-9"
                    onClick={() => handleLearnMore(icca.id)}
                    disabled={isFetchingDetails}
                  >
                    {isFetchingDetails && selectedIcca?.id === icca.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      "Quick View"
                    )}
                  </Button>
                  <Link href={`/iccas/${icca.id}`} className="w-full">
                    <Button variant="outline" size="sm" className="w-full text-xs h-9">
                      Details
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {visibleCount < iccas.length && (
          <div className="mt-16 text-center">
            <Button 
              size="lg" 
              variant="outline" 
              className="min-w-[200px] border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground transition-all duration-300"
              onClick={() => setVisibleCount(prev => prev + 8)}
            >
              Load More ICCAs
            </Button>
            <p className="mt-4 text-sm text-muted-foreground">
              Showing {visibleCount} of {iccas.length} areas
            </p>
          </div>
        )}
      </div>

      <ICCADrawer 
        open={isDrawerOpen} 
        onOpenChange={setIsDrawerOpen} 
        selectedICCA={selectedIcca} 
      />
    </section>
  )
}
