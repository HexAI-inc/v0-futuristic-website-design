import { HeroSection } from "@/components/hero-section"
import { StatsSection } from "@/components/stats-section"
import { VisualStorySection } from "@/components/visual-story-section"
import { ExploreByRegion } from "@/components/explore-by-region"
import { FeaturedAreasCarousel } from "@/components/featured-areas-carousel"
import { InteractiveMap } from "@/components/interactive-map"
import { ConservationHighlights } from "@/components/conservation-highlights"
import { WhyVisitSection } from "@/components/why-visit-section"
import { CallToAction } from "@/components/call-to-action"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <StatsSection />
      <VisualStorySection />
      <FeaturedAreasCarousel />
      <ExploreByRegion />
      <InteractiveMap />
      <ConservationHighlights />
      <WhyVisitSection />
      <CallToAction />
    </main>
  )
}
