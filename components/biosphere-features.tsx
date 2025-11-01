import { Card } from "@/components/ui/card"
import { Waves, Bird, Fish, TreePine, Sunrise, Droplets } from "lucide-react"

const features = [
  {
    icon: Waves,
    title: "Coastal Ecosystems",
    description: "Extensive mangrove forests, mudflats, and estuarine habitats along the Atlantic coast",
  },
  {
    icon: Bird,
    title: "Avian Diversity",
    description: "Critical habitat for over 300 bird species, including rare and migratory species",
  },
  {
    icon: Fish,
    title: "Marine Resources",
    description: "Important nursery grounds for fish and shellfish supporting local livelihoods",
  },
  {
    icon: TreePine,
    title: "Forest Habitats",
    description: "Diverse woodland and savanna ecosystems supporting rich biodiversity",
  },
  {
    icon: Droplets,
    title: "Wetland Systems",
    description: "Vital freshwater and brackish wetlands providing ecosystem services",
  },
  {
    icon: Sunrise,
    title: "Cultural Heritage",
    description: "Sacred sites and traditional practices integrated with conservation",
  },
]

export function BiosphereFeatures() {
  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            Ecological <span className="text-chart-3">Treasures</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            The Niumi Biosphere Reserve protects a remarkable diversity of ecosystems and species, making it one of West
            Africa's most important conservation areas.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card
                key={index}
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
