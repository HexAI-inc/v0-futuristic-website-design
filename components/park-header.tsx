import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Ruler } from "lucide-react"
import type { Park } from "@/lib/parks-data"

export function ParkHeader({ park }: { park: Park }) {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={park.gallery[0].url || "/placeholder.svg"}
          alt={park.gallery[0].alt}
          className="w-full h-full object-cover"
        />
  <div className="absolute inset-0 bg-linear-to-b from-background/90 via-background/70 to-background" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto py-24">
        <Badge className="mb-6 text-base px-4 py-2">National Park</Badge>
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance">{park.name}</h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto text-pretty leading-relaxed">
          {park.description}
        </p>

        <div className="flex flex-wrap justify-center gap-6 text-lg">
          <div className="flex items-center gap-2">
            <Ruler className="h-5 w-5 text-primary" />
            <span>{park.size}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span>Est. {park.established}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <span>{park.location}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
