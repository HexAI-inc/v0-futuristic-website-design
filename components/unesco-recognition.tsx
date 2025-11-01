import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, Target, Users, BookOpen } from "lucide-react"

const objectives = [
  {
    icon: Award,
    title: "Conservation",
    description: "Protect biodiversity and ecosystems for future generations",
  },
  {
    icon: Target,
    title: "Development",
    description: "Foster sustainable economic and social development",
  },
  {
    icon: BookOpen,
    title: "Research",
    description: "Support scientific research and environmental education",
  },
  {
    icon: Users,
    title: "Community",
    description: "Engage local communities in conservation and decision-making",
  },
]

export function UNESCORecognition() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="bg-chart-3 text-background text-base px-4 py-2 mb-6">
            UNESCO Man and Biosphere Programme
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            International <span className="text-chart-3">Recognition</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            Designated in 2001, the Niumi Biosphere Reserve is part of UNESCO's World Network of Biosphere Reserves,
            recognized for its innovative approach to conservation and sustainable development.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {objectives.map((objective, index) => {
            const Icon = objective.icon
            return (
              <Card key={index} className="p-6 bg-card text-center">
                <div className="bg-chart-3/10 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-7 w-7 text-chart-3" />
                </div>
                <h3 className="text-lg font-bold mb-2">{objective.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{objective.description}</p>
              </Card>
            )
          })}
        </div>

  <Card className="p-8 md:p-12 bg-linear-to-br from-chart-3/10 to-chart-4/10 border-chart-3/20">
          <div className="max-w-4xl mx-auto space-y-6">
            <h3 className="text-3xl font-bold text-center mb-8">A Model for Sustainable Development</h3>

            <p className="text-lg leading-relaxed">
              The Niumi Biosphere Reserve exemplifies UNESCO's vision of biosphere reserves as "learning places for
              sustainable development." It demonstrates how protected areas can serve multiple functions: conserving
              biodiversity, supporting local livelihoods, and advancing scientific knowledge.
            </p>

            <p className="text-lg leading-relaxed">
              Through partnerships between government agencies, local communities, and international organizations, the
              reserve has become a testing ground for innovative conservation strategies. These include sustainable
              fishing practices, ecotourism development, and community-based natural resource management.
            </p>

            <div className="bg-card/50 rounded-lg p-6 mt-8">
              <p className="text-lg font-semibold text-chart-3 text-center">
                "Biosphere reserves are more than protected areas – they are places where people and nature thrive
                together, creating a sustainable future for all."
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
