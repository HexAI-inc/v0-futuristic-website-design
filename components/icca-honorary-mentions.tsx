"use client"

import { useTheme } from "@/lib/theme-context"
import { useState, useEffect } from "react"
import { ICCADrawer } from "./icca-drawer"
import { getIccas, getIcca, type Icca, type IccaWithDetails } from "@/lib/database"

const honoraryICCAs = [
  // Row 1 - Coastal Communities
  "Kartong Point Community Forest",
  "Gunjur Beach Conservation Area",
  "Sanyang Community Woodlands",
  "Tujereng Village Forest Reserve",
  "Batokunku Mangrove Project",
  "Berending Fishing Grounds",

  // Row 2 - River Communities
  "Kuntaur River Conservation",
  "Janjanbureh Island Preserve",
  "Wassu Stone Circle Guardians",
  "Georgetown Wetland Initiative",
  "Soma Community Gardens",
  "Kaiaf River Protection Zone",

  // Row 3 - Inland Communities
  "Farafenni Woodland Reserve",
  "Kerewan Village Commons",
  "Essau Community Forest",
  "Barra Point Conservation",
  "Albreda Historic Grove",
  "Juffureh Heritage Forest",

  // Row 4 - Eastern Communities
  "Bansang Community Reserve",
  "Basse Forest Initiative",
  "Fatoto River Conservation",
  "Koina Village Preserve",
  "Sabi Community Woodlands",
  "Gambissara Heritage Site"
]

export function ICCAHonoraryMentions() {
  const { theme } = useTheme()
  // Theme is fixed to midnight-jungle, so glass-morphism styling is never applied
const isGlass = false
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedICCA, setSelectedICCA] = useState<IccaWithDetails | null>(null)
  const [iccas, setIccas] = useState<Icca[]>([])
  const [loading, setLoading] = useState(true)
  const [isFetchingDetails, setIsFetchingDetails] = useState(false)

  // Fetch ICCAs data on component mount
  useEffect(() => {
    const fetchIccas = async () => {
      try {
        setLoading(true)
        const iccasData = await getIccas()
        setIccas(iccasData)
      } catch (err) {
        console.error('Error fetching ICCAs:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchIccas()
  }, [])

  // Split into 3 rows of 8 items each
  const rows = [
    honoraryICCAs.slice(0, 8),
    honoraryICCAs.slice(8, 16), 
    honoraryICCAs.slice(16, 24)
  ]

  const handlePillClick = async (name: string) => {
    const icca = iccas.find(i => i.name === name)
    if (icca) {
      try {
        setIsFetchingDetails(true)
        // Fetch full ICCA data with gallery
        const fullIcca = await getIcca(icca.id)
        if (fullIcca) {
          setSelectedICCA(fullIcca)
          setDrawerOpen(true)
        }
      } catch (err) {
        console.error('Error fetching ICCA details:', err)
      } finally {
        setIsFetchingDetails(false)
      }
    }
  }

  return (
    <section className={`py-20 px-4 ${isGlass ? "glass-section" : "bg-muted/20"}`}>
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Honorary Mentions</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Recognizing additional community conservation efforts across The Gambia
          </p>
        </div>

        <div className="space-y-6">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="relative">
              {/* Outer container with fade gradients */}
              <div className="relative overflow-hidden rounded-lg">
                {/* Fade gradients on the outer container */}
                <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background via-background/90 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background via-background/90 to-transparent z-10 pointer-events-none" />
                
                {/* Inner carousel container */}
                <div className="flex animate-scroll-infinite py-2">
                  {/* First set of items */}
                  {row.map((name, index) => (
                    <div
                      key={`${rowIndex}-${index}-1`}
                      className={`
                        flex-shrink-0 mx-3 px-6 py-3 rounded-full border text-sm font-medium whitespace-nowrap cursor-pointer
                        ${isGlass 
                          ? "glass-card border-white/20 text-foreground hover:bg-white/10" 
                          : "bg-card border-border text-foreground hover:bg-accent"
                        }
                        transition-colors duration-200
                        ${isFetchingDetails ? "opacity-50 cursor-wait" : ""}
                      `}
                      onClick={() => !isFetchingDetails && handlePillClick(name)}
                    >
                      {name}
                    </div>
                  ))}
                  {/* Duplicate set for seamless loop */}
                  {row.map((name, index) => (
                    <div
                      key={`${rowIndex}-${index}-2`}
                      className={`
                        flex-shrink-0 mx-3 px-6 py-3 rounded-full border text-sm font-medium whitespace-nowrap cursor-pointer
                        ${isGlass 
                          ? "glass-card border-white/20 text-foreground hover:bg-white/10" 
                          : "bg-card border-border text-foreground hover:bg-accent"
                        }
                        transition-colors duration-200
                        ${isFetchingDetails ? "opacity-50 cursor-wait" : ""}
                      `}
                      onClick={() => !isFetchingDetails && handlePillClick(name)}
                    >
                      {name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            These communities contribute to biodiversity conservation through traditional practices and local stewardship
          </p>
        </div>
      </div>

      <ICCADrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        selectedICCA={selectedICCA}
      />

            <style jsx>{`
        @keyframes scroll-infinite {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll-infinite {
          animation: scroll-infinite linear infinite;
          will-change: transform;
        }

        /* Pause animation on hover */
        .animate-scroll-infinite:hover {
          animation-play-state: paused;
        }

        /* Different speeds for each row */
        div:nth-child(1) .animate-scroll-infinite {
          animation-duration: 35s;
        }
        
        div:nth-child(2) .animate-scroll-infinite {
          animation-duration: 40s;
          animation-direction: reverse;
        }
        
        div:nth-child(3) .animate-scroll-infinite {
          animation-duration: 30s;
        }
      `}</style>
    </section>
  )
}