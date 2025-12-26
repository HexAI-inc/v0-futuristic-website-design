import { BiosphereHero } from "@/components/biosphere-hero"
import { BiosphereZones } from "@/components/biosphere-zones"
import { BiosphereFeatures } from "@/components/biosphere-features"
import { UNESCORecognition } from "@/components/unesco-recognition"
import { BiosphereGallery } from "@/components/biosphere-gallery"
import { BiosphereMap } from "@/components/biosphere-map"
import { BiosphereCTA } from "@/components/biosphere-cta"
import { BiosphereManagement } from "@/components/biosphere-management"

export const metadata = {
  title: "Niumi Biosphere Reserve | UNESCO World Heritage",
  description:
    "Explore the Niumi Biosphere Reserve, a UNESCO-designated area balancing conservation, sustainable development, and community well-being.",
}

export default async function BiospherePage() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/biosphere`, {
    cache: 'no-store' // Ensure fresh data
  })

  if (!response.ok) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Biosphere Reserve Not Found</h1>
          <p className="text-muted-foreground">The biosphere reserve data could not be loaded.</p>
        </div>
      </main>
    )
  }

  const biosphere = await response.json()

  return (
    <main className="min-h-screen">
      <BiosphereHero biosphere={biosphere} />
      <BiosphereZones zones={biosphere.zones} biosphere={biosphere} />
      <BiosphereMap zones={biosphere.zones} />
      <BiosphereFeatures features={biosphere.features} biosphere={biosphere} />
      <BiosphereManagement />
      <BiosphereGallery images={biosphere.gallery} />
      <UNESCORecognition objectives={biosphere.objectives} biosphere={biosphere} />
      <BiosphereCTA biosphereId={biosphere.id} biosphereName={biosphere.name} />
    </main>
  )
}
