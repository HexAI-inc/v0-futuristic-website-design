import { Badge } from "@/components/ui/badge"
import { Globe, Award, Leaf } from "lucide-react"

export function BiosphereHero() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="/niumi-biosphere-reserve-gambia-aerial.jpg"
          alt="Niumi Biosphere Reserve aerial view"
          className="w-full h-full object-cover"
        />
  <div className="absolute inset-0 bg-linear-to-b from-background/90 via-background/70 to-background" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto py-24">
        <div className="flex justify-center items-center gap-3 mb-6">
          <Badge className="bg-chart-3 text-background text-base px-4 py-2">UNESCO Biosphere Reserve</Badge>
          <Award className="h-6 w-6 text-chart-3" />
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance">
          Niumi <span className="text-chart-3">Biosphere Reserve</span>
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty leading-relaxed">
          A UNESCO-designated model for sustainable development, where conservation, community livelihoods, and
          scientific research converge to create a harmonious balance between people and nature.
        </p>

        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-12">
          <div className="bg-card/80 backdrop-blur-sm rounded-lg p-6">
            <Globe className="h-8 w-8 text-chart-3 mx-auto mb-3" />
            <div className="text-3xl font-bold text-chart-3 mb-2">68,530</div>
            <div className="text-sm text-muted-foreground">Hectares Protected</div>
          </div>
          <div className="bg-card/80 backdrop-blur-sm rounded-lg p-6">
            <Leaf className="h-8 w-8 text-chart-3 mx-auto mb-3" />
            <div className="text-3xl font-bold text-chart-3 mb-2">2001</div>
            <div className="text-sm text-muted-foreground">UNESCO Designation</div>
          </div>
          <div className="bg-card/80 backdrop-blur-sm rounded-lg p-6">
            <Award className="h-8 w-8 text-chart-3 mx-auto mb-3" />
            <div className="text-3xl font-bold text-chart-3 mb-2">35+</div>
            <div className="text-sm text-muted-foreground">Communities Involved</div>
          </div>
        </div>
      </div>
    </section>
  )
}
