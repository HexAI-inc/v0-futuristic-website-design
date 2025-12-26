import { BiosphereHero } from "@/components/biosphere-hero"
import { BiosphereZones } from "@/components/biosphere-zones"
import { BiosphereFeatures } from "@/components/biosphere-features"
import { UNESCORecognition } from "@/components/unesco-recognition"
import { BiosphereGallery } from "@/components/biosphere-gallery"
import { BiosphereMap } from "@/components/biosphere-map"
import { BiosphereCTA } from "@/components/biosphere-cta"
import { BiosphereManagement } from "@/components/biosphere-management"
import { supabaseAdmin as supabase, TABLES } from '@/lib/supabase'

export const metadata = {
  title: "Niumi Biosphere Reserve | UNESCO World Heritage",
  description:
    "Explore the Niumi Biosphere Reserve, a UNESCO-designated area balancing conservation, sustainable development, and community well-being.",
}

async function getBiosphereData() {
  if (!supabase) {
    throw new Error('Supabase admin client not available')
  }

  // Fetch the main biosphere record
  const { data: biosphere, error: biosphereError } = await supabase
    .from(TABLES.BIOSPHERE)
    .select('*')
    .single()

  if (biosphereError) {
    console.error('Error fetching biosphere:', biosphereError)
    return null
  }

  // Fetch zones with their features
  const { data: zones, error: zonesError } = await supabase
    .from(TABLES.BIOSPHERE_ZONES)
    .select('*')
    .eq('biosphere_id', biosphere.id)
    .order('sort_order')

  if (zonesError) {
    console.error('Error fetching biosphere zones:', zonesError)
  }

  // Fetch features for each zone
  const zonesWithFeatures = []
  if (zones) {
    for (const zone of zones) {
      const { data: features, error: featuresError } = await supabase
        .from(TABLES.BIOSPHERE_ZONE_FEATURES)
        .select('*')
        .eq('zone_id', zone.id)
        .order('id')

      if (featuresError) {
        console.error('Error fetching zone features:', featuresError)
      }

      zonesWithFeatures.push({
        ...zone,
        features: features || []
      })
    }
  }

  // Fetch biosphere features (ecological treasures)
  const { data: features, error: featuresError } = await supabase
    .from(TABLES.BIOSPHERE_FEATURES)
    .select('*')
    .eq('biosphere_id', biosphere.id)
    .order('sort_order')

  if (featuresError) {
    console.error('Error fetching biosphere features:', featuresError)
  }

  // Fetch biosphere objectives (UNESCO recognition)
  const { data: objectives, error: objectivesError } = await supabase
    .from(TABLES.BIOSPHERE_OBJECTIVES)
    .select('*')
    .eq('biosphere_id', biosphere.id)
    .order('sort_order')

  if (objectivesError) {
    console.error('Error fetching biosphere objectives:', objectivesError)
  }

  // Fetch biosphere gallery
  const { data: gallery, error: galleryError } = await supabase
    .from(TABLES.BIOSPHERE_GALLERY)
    .select('*')
    .eq('biosphere_id', biosphere.id)
    .order('sort_order')

  if (galleryError) {
    console.error('Error fetching biosphere gallery:', galleryError)
  }

  return {
    ...biosphere,
    zones: zonesWithFeatures || [],
    features: features || [],
    objectives: objectives || [],
    gallery: gallery || []
  }
}

export default async function BiospherePage() {
  const biosphere = await getBiosphereData()

  if (!biosphere) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Biosphere Reserve Not Found</h1>
          <p className="text-muted-foreground">The biosphere reserve data could not be loaded.</p>
        </div>
      </main>
    )
  }

export default async function BiospherePage() {
  const biosphere = await getBiosphereData()

  if (!biosphere) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Biosphere Reserve Not Found</h1>
          <p className="text-muted-foreground">The biosphere reserve data could not be loaded.</p>
        </div>
      </main>
    )
  }

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
