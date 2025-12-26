import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, Target, Users, BookOpen } from "lucide-react"
import { BiosphereObjective, Biosphere } from "@/lib/database"

const iconMap = {
  Award,
  Target,
  BookOpen,
  Users
}

interface UNESCORecognitionProps {
  objectives: BiosphereObjective[]
  biosphere: Biosphere
}

export function UNESCORecognition({ objectives, biosphere }: UNESCORecognitionProps) {
  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="bg-chart-3 text-background text-base px-4 py-2 mb-6">
            {biosphere.unesco_program}
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            {biosphere.objectives_title || "International Recognition"}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            {biosphere.objectives_description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {objectives.map((objective) => {
            const Icon = iconMap[objective.icon as keyof typeof iconMap] || Award
            return (
              <Card key={objective.id} className="p-6 bg-card text-center">
                <div className="bg-chart-3/10 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-7 w-7 text-chart-3" />
                </div>
                <h3 className="text-lg font-bold mb-2">{objective.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{objective.description}</p>
              </Card>
            )
          })}
        </div>

        {(biosphere.model_title || biosphere.model_text_1) && (
          <Card className="p-8 md:p-12 bg-linear-to-br from-chart-3/10 to-chart-4/10 border-chart-3/20">
            <div className="max-w-4xl mx-auto space-y-6">
              <h3 className="text-3xl font-bold text-center mb-8">
                {biosphere.model_title || "A Model for Sustainable Development"}
              </h3>

              {biosphere.model_text_1 && (
                <p className="text-lg leading-relaxed">
                  {biosphere.model_text_1}
                </p>
              )}

              {biosphere.model_text_2 && (
                <p className="text-lg leading-relaxed">
                  {biosphere.model_text_2}
                </p>
              )}

              {biosphere.model_quote && (
                <div className="bg-card/50 rounded-lg p-6 mt-8">
                  <p className="text-lg font-semibold text-chart-3 text-center">
                    "{biosphere.model_quote}"
                  </p>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </section>
  )
}
