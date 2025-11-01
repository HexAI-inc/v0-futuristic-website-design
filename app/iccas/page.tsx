import { ICCAHero } from "@/components/icca-hero"
import { ICCAGrid } from "@/components/icca-grid"
import { ICCAImpact } from "@/components/icca-impact"
import { ICCAVisualStory } from "@/components/icca-visual-story"
import { ICCAHonoraryMentions } from "@/components/icca-honorary-mentions"

export const metadata = {
  title: "Indigenous & Community Conserved Areas | The Gambia",
  description:
    "Discover community-led conservation efforts across The Gambia, where local communities protect and manage their natural heritage.",
}

export default function ICCAsPage() {
  return (
    <main className="min-h-screen">
      <ICCAHero />
      <ICCAVisualStory />
      <ICCAGrid />
      <ICCAHonoraryMentions />
      <ICCAImpact />
    </main>
  )
}
