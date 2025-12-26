import { Card } from "@/components/ui/card"
import { Shield, Users, Sprout } from "lucide-react"
import { BiosphereZoneWithFeatures, Biosphere } from "@/lib/database"

const iconMap = {
  core: Shield,
  buffer: Sprout,
  transition: Users
}

const colorMap = {
  core: "text-chart-3 bg-chart-3/10",
  buffer: "text-chart-4 bg-chart-4/10",
  transition: "text-chart-5 bg-chart-5/10"
}

interface BiosphereZonesProps {
  zones: BiosphereZoneWithFeatures[]
  biosphere: Biosphere
}

const numberToWord = (num: number) => {
  const words = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];
  return words[num] || num.toString();
};

export function BiosphereZones({ zones, biosphere }: BiosphereZonesProps) {
  const zoneCountWord = numberToWord(zones.length);
  
  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            {biosphere.zones_title?.replace(/three/i, zoneCountWord) || `${zoneCountWord} Functional Zones`}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            {biosphere.zones_description?.replace(/three/i, zoneCountWord.toLowerCase()) || `The biosphere reserve is organized into ${zoneCountWord.toLowerCase()} interconnected zones.`}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {zones.map((zone, index) => {
            const Icon = iconMap[zone.zone_type as keyof typeof iconMap] || Shield
            const colorClass = colorMap[zone.zone_type as keyof typeof colorMap] || "text-chart-3 bg-chart-3/10"
            return (
              <Card key={zone.id} className="p-8 bg-card hover:shadow-xl transition-all duration-300">
                <div className={`${colorClass} rounded-full w-16 h-16 flex items-center justify-center mb-6`}>
                  <Icon className="h-8 w-8" />
                </div>

                <h3 className="text-2xl font-bold mb-3">{zone.name}</h3>
                <div className="text-sm text-muted-foreground mb-4">{zone.size}</div>
                <p className="text-muted-foreground leading-relaxed mb-6">{zone.description}</p>

                <div className="space-y-2">
                  {zone.features.map((feature, idx) => (
                    <div key={feature.id} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span>{feature.feature}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )
          })}
        </div>

        <div className="mt-16 max-w-4xl mx-auto">
          <Card className="p-8 bg-muted/50">
            <h3 className="text-2xl font-bold mb-4 text-center">
              {biosphere.concept_title || "The Biosphere Concept"}
            </h3>
            <p className="text-lg leading-relaxed text-center">
              {biosphere.concept_description || "Unlike traditional protected areas, biosphere reserves are designed as living laboratories where conservation, sustainable development, and scientific research work together."}
            </p>
          </Card>
        </div>
      </div>
    </section>
  )
}
