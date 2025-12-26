"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Park } from "@/lib/database"
import { useTheme } from "@/lib/theme-context"
import { ResourceActions } from "@/components/resource-actions"

export function ParkInfo({ park }: { park: Park }) {
  const { theme } = useTheme()
  // Theme is fixed to midnight-jungle, so glass-morphism styling is never applied
const isGlass = false

  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <Card className={`p-8 ${isGlass ? "glass-card" : "bg-card"}`}>
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="text-primary">🦁</span> Wildlife
              </h3>
              <div className="flex flex-wrap gap-2">
                {park.wildlife.map((animal, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {animal}
                  </Badge>
                ))}
              </div>
            </Card>

            <Card className={`p-8 ${isGlass ? "glass-card" : "bg-card"}`}>
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="text-primary">🎯</span> Activities
              </h3>
              <ul className="space-y-3">
                {park.activities.map((activity, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-lg">{activity}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className={`p-8 ${isGlass ? "glass-card" : "bg-card"}`}>
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="text-primary">📍</span> Location Details
              </h3>
              <div className="space-y-4 text-lg">
                <div>
                  <span className="text-muted-foreground">Region:</span>
                  <span className="ml-2 font-semibold">{park.location}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Coordinates:</span>
                  <span className="ml-2 font-mono text-sm">{park.coordinates}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Size:</span>
                  <span className="ml-2 font-semibold">{park.size}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Established:</span>
                  <span className="ml-2 font-semibold">{park.established}</span>
                </div>
              </div>
            </Card>

            <Card className={`p-8 ${isGlass ? "glass-card" : "bg-card"}`}>
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="text-primary">🌤️</span> Best Time to Visit
              </h3>
              <p className="text-lg leading-relaxed mb-8">{park.best_time}</p>
              
              <div className="pt-6 border-t border-border">
                <ResourceActions resourceId={park.id} resourceName={park.name} resourceType="park" />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
