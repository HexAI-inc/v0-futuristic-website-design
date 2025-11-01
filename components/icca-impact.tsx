import { Card } from "@/components/ui/card"
import { Users, Sprout, GraduationCap, Coins } from "lucide-react"

const impacts = [
  {
    icon: Users,
    title: "Community Empowerment",
    description: "Over 50 communities actively managing their natural resources",
    stat: "50+",
  },
  {
    icon: Sprout,
    title: "Biodiversity Protection",
    description: "Thousands of hectares of critical habitat under community stewardship",
    stat: "5,000+ ha",
  },
  {
    icon: GraduationCap,
    title: "Education & Training",
    description: "Local conservation leaders trained in sustainable management",
    stat: "200+",
  },
  {
    icon: Coins,
    title: "Sustainable Livelihoods",
    description: "Families benefiting from ecotourism and sustainable practices",
    stat: "1,000+",
  },
]

export function ICCAImpact() {
  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            Conservation <span className="text-secondary">Impact</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            Community-led conservation is creating lasting positive change for both people and nature across The Gambia.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {impacts.map((impact, index) => {
            const Icon = impact.icon
            return (
              <Card
                key={index}
                className="p-8 bg-card text-center hover:border-secondary/50 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/10"
              >
                <div className="bg-secondary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <Icon className="h-8 w-8 text-secondary" />
                </div>
                <div className="text-4xl font-bold text-secondary mb-3">{impact.stat}</div>
                <h3 className="text-xl font-bold mb-3">{impact.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{impact.description}</p>
              </Card>
            )
          })}
        </div>

        <div className="mt-16 max-w-4xl mx-auto">
          <Card className="p-8 md:p-12 bg-card">
            <h3 className="text-3xl font-bold mb-6 text-center">What Makes ICCAs Special?</h3>
            <div className="space-y-6 text-lg leading-relaxed">
              <p>
                Indigenous and Community Conserved Areas represent a unique approach to conservation where local
                communities are the primary decision-makers and stewards of their natural resources. Unlike traditional
                protected areas managed by government agencies, ICCAs are governed by customary laws, traditional
                knowledge, and community consensus.
              </p>
              <p>
                These areas often protect not just biodiversity, but also cultural heritage, sacred sites, and
                traditional practices that have sustained communities for generations. By recognizing and supporting
                ICCAs, we acknowledge that effective conservation requires the active participation and leadership of
                those who know the land best.
              </p>
              <p className="text-secondary font-semibold">
                ICCAs demonstrate that conservation and community development can go hand in hand, creating a
                sustainable future for both people and nature.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
