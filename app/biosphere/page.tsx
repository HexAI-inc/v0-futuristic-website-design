import { BiosphereHero } from "@/components/biosphere-hero"
import { BiosphereZones } from "@/components/biosphere-zones"
import { BiosphereFeatures } from "@/components/biosphere-features"
import { UNESCORecognition } from "@/components/unesco-recognition"

export const metadata = {
  title: "Niumi Biosphere Reserve | UNESCO World Heritage",
  description:
    "Explore the Niumi Biosphere Reserve, a UNESCO-designated area balancing conservation, sustainable development, and community well-being.",
}

export default function BiospherePage() {
  return (
    <main className="min-h-screen">
      <BiosphereHero />
      <BiosphereZones />
      <BiosphereFeatures />
      <UNESCORecognition />
    </main>
  )
}
