import { Card } from "@/components/ui/card"
import { Waves, Bird, Fish, TreePine, Sunrise, Droplets } from "lucide-react"
import { BiosphereFeature, Biosphere } from "@/lib/database"

const iconMap = {
  Waves,
  Bird,
  Fish,
  TreePine,
  Sunrise,
  Droplets
}

interface BiosphereFeaturesProps {
  features: BiosphereFeature[]
  biosphere: Biosphere
}

export function BiosphereFeatures({ features, biosphere }: BiosphereFeaturesProps) {
  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            {biosphere.features_title || "Ecological Treasures"}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            {biosphere.features_description || "The Niumi Biosphere Reserve protects a remarkable diversity of ecosystems and species."}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = iconMap[feature.icon as keyof typeof iconMap] || Waves
            return (
              <Card
                key={feature.id}
                className="p-6 bg-card hover:border-chart-3/50 transition-all duration-300 hover:shadow-lg hover:shadow-chart-3/10"
              >
                <div className="bg-chart-3/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-chart-3" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
