"use client"

import { Card } from "@/components/ui/card"
import {
  Trees,
  Bird,
  Waves,
  Eye,
  Fish,
  Sun,
  Droplet,
  Camera,
  Footprints,
  Leaf,
  PawPrint,
  Binary as Binoculars,
  Ship,
  Palmtree,
  PersonStanding,
  Users as UsersIcon,
} from "lucide-react"
import { useTheme } from "@/lib/theme-context"
import type { ParkFeature } from "@/lib/database"

const iconMap: Record<string, any> = {
  trees: Trees,
  bird: Bird,
  waves: Waves,
  eye: Eye,
  fish: Fish,
  sun: Sun,
  droplet: Droplet,
  camera: Camera,
  footprints: Footprints,
  leaf: Leaf,
  paw: PawPrint,
  binoculars: Binoculars,
  boat: Ship,
  water: Waves,
  monkey: PawPrint,
  "palm-tree": Palmtree,
  walking: PersonStanding,
  beach: Waves,
  tree: Trees,
  sunrise: Sun,
  users: UsersIcon,
}

interface Feature {
  icon: string
  title: string
  description: string
}

export function ParkFeatures({ features }: { features: ParkFeature[] }) {
  const { theme } = useTheme()
  // Theme is fixed to midnight-jungle, so glass-morphism styling is never applied
const isGlass = false

  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
          Park <span className="text-primary">Highlights</span>
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = iconMap[feature.icon] || Trees
            return (
              <Card
                key={index}
                className={`p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 ${isGlass ? "glass-card" : "bg-card"}`}
              >
                <div
                  className={`rounded-full w-12 h-12 flex items-center justify-center mb-4 ${isGlass ? "glass-icon" : "bg-primary/10"}`}
                >
                  <Icon className="h-6 w-6 text-primary" />
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
