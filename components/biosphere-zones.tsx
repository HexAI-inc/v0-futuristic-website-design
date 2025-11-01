import { Card } from "@/components/ui/card"
import { Shield, Users, Sprout } from "lucide-react"

const zones = [
  {
    name: "Core Zone",
    icon: Shield,
    size: "4,940 hectares",
    description:
      "The strictly protected heart of the reserve, encompassing Niumi National Park with its pristine mangrove forests and coastal ecosystems. No extractive activities are permitted.",
    features: ["Niumi National Park", "Mangrove Forests", "Critical Wildlife Habitat", "Research Sites"],
    color: "text-chart-3 bg-chart-3/10",
  },
  {
    name: "Buffer Zone",
    icon: Sprout,
    size: "28,590 hectares",
    description:
      "Surrounding the core area, this zone allows for compatible activities that support conservation while providing sustainable resources for local communities.",
    features: ["Sustainable Fishing", "Ecotourism", "Environmental Education", "Controlled Access"],
    color: "text-chart-4 bg-chart-4/10",
  },
  {
    name: "Transition Zone",
    icon: Users,
    size: "35,000 hectares",
    description:
      "The outer zone where communities live and work, implementing sustainable practices that demonstrate how development and conservation can coexist harmoniously.",
    features: ["Agriculture", "Settlements", "Sustainable Development", "Community Projects"],
    color: "text-chart-5 bg-chart-5/10",
  },
]

export function BiosphereZones() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            Three <span className="text-chart-3">Functional Zones</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            The biosphere reserve is organized into three interconnected zones, each serving a specific purpose in
            balancing conservation with human needs.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {zones.map((zone, index) => {
            const Icon = zone.icon
            return (
              <Card key={index} className="p-8 bg-card hover:shadow-xl transition-all duration-300">
                <div className={`${zone.color} rounded-full w-16 h-16 flex items-center justify-center mb-6`}>
                  <Icon className="h-8 w-8" />
                </div>

                <h3 className="text-2xl font-bold mb-3">{zone.name}</h3>
                <div className="text-sm text-muted-foreground mb-4">{zone.size}</div>
                <p className="text-muted-foreground leading-relaxed mb-6">{zone.description}</p>

                <div className="space-y-2">
                  {zone.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )
          })}
        </div>

        <div className="mt-16 max-w-4xl mx-auto">
          <Card className="p-8 bg-muted/50">
            <h3 className="text-2xl font-bold mb-4 text-center">The Biosphere Concept</h3>
            <p className="text-lg leading-relaxed text-center">
              Unlike traditional protected areas, biosphere reserves are designed as living laboratories where
              conservation, sustainable development, and scientific research work together. Each zone plays a vital role
              in demonstrating that human activities and nature conservation can coexist and mutually benefit one
              another.
            </p>
          </Card>
        </div>
      </div>
    </section>
  )
}
