import { notFound } from "next/navigation"
import { SlideshowHero } from "@/components/slideshow-hero"
import { ParkFeatures } from "@/components/park-features"
import { MasonryGallery } from "@/components/masonry-gallery"
import { ParkInfo } from "@/components/park-info"
import { nationalParks } from "@/lib/parks-data"

export function generateStaticParams() {
  return nationalParks.map((park) => ({
    slug: park.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const park = nationalParks.find((p) => p.slug === slug)
  if (!park) return {}

  return {
    title: `${park.name} | The Gambia Protected Areas`,
    description: park.description,
  }
}

export default async function ParkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const park = nationalParks.find((p) => p.slug === slug)

  if (!park) {
    notFound()
  }

  return (
    <main className="min-h-screen">
      <SlideshowHero park={park} />
      <ParkFeatures features={park.features} />
      <MasonryGallery images={park.gallery} />
      <ParkInfo park={park} />
    </main>
  )
}
