"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Users, TreePine } from "lucide-react"
import Image from "next/image"
import { useTheme } from "@/lib/theme-context"

const iccas = [
  {
    name: "Tumani Tenda ICCA",
    location: "Central River Region",
    size: "1,200 hectares",
    community: "Tumani Tenda Village",
    description:
      "A pioneering community conservation area where local residents have protected their ancestral lands, creating a sanctuary for wildlife and traditional practices.",
    features: ["Ecotourism", "Traditional Medicine Gardens", "Wildlife Corridors", "Cultural Heritage Sites"],
    image: "/tumani-tenda-community-conservation-gambia.jpg",
    gallery: [
      "/tumani-tenda-village-life.jpg",
      "/tumani-tenda-wildlife-corridor.jpg",
      "/tumani-tenda-traditional-medicine-garden.jpg",
    ],
  },
  {
    name: "Baobolong Wetland ICCA",
    location: "North Bank Region",
    size: "2,300 hectares",
    community: "Baobolong Communities",
    description:
      "A vital wetland ecosystem managed by local fishing communities, balancing sustainable resource use with conservation of critical bird habitat.",
    features: ["Sustainable Fishing", "Bird Watching", "Mangrove Restoration", "Community Education"],
    image: "/baobolong-wetland-community-managed-gambia.jpg",
    gallery: ["/baobolong-fishing-community.jpg", "/baobolong-mangrove-restoration.jpg", "/baobolong-bird-habitat.jpg"],
  },
  {
    name: "Makasutu ICCA",
    location: "Western Division",
    size: "1,000 hectares",
    community: "Makasutu Community",
    description:
      "A sacred forest protected by traditional beliefs and community governance, showcasing the integration of cultural values and biodiversity conservation.",
    features: ["Sacred Groves", "Cultural Tours", "Forest Conservation", "Traditional Ceremonies"],
    image: "/makasutu-sacred-forest-gambia.jpg",
    gallery: ["/makasutu-sacred-grove.jpg", "/makasutu-traditional-ceremony.jpg", "/makasutu-forest-canopy.jpg"],
  },
  {
    name: "Pirang Forest ICCA",
    location: "Western Division",
    size: "650 hectares",
    community: "Pirang Village",
    description:
      "A community-managed forest reserve that provides sustainable livelihoods through ecotourism while protecting important wildlife habitat.",
    features: ["Nature Trails", "Bird Watching", "Sustainable Harvesting", "Environmental Education"],
    image: "/pirang-forest-community-reserve-gambia.jpg",
    gallery: ["/pirang-nature-trail.jpg", "/pirang-bird-watching.jpg", "/pirang-environmental-education.jpg"],
  },
]

export function ICCAGrid() {
  const { theme } = useTheme()
  const isGlass = theme === "glass-morphism"

  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            Community <span className="text-secondary">Conservation Areas</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            Explore the diverse network of community-managed protected areas where traditional knowledge meets modern
            conservation practices.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {iccas.map((icca, index) => (
            <Card
              key={index}
              className={`overflow-hidden hover:shadow-xl transition-all duration-300 ${isGlass ? "glass-card" : "bg-card"}`}
            >
              <div className="relative h-64 overflow-hidden group">
                <Image
                  src={icca.image || "/placeholder.svg"}
                  alt={icca.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-secondary text-secondary-foreground">ICCA</Badge>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-3">{icca.name}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{icca.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TreePine className="h-4 w-4" />
                      <span>{icca.size}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{icca.community}</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{icca.description}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Gallery Preview</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {icca.gallery.map((img, idx) => (
                      <div key={idx} className="relative h-20 rounded-lg overflow-hidden group/img">
                        <Image
                          src={img || "/placeholder.svg"}
                          alt={`${icca.name} gallery ${idx + 1}`}
                          fill
                          className="object-cover transition-transform duration-300 group-hover/img:scale-110"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Key Features</h4>
                  <div className="flex flex-wrap gap-2">
                    {icca.features.map((feature, idx) => (
                      <Badge key={idx} variant="secondary">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button className="w-full">Learn More</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
