import { Card } from "@/components/ui/card"
import { BookOpen, Info, Database, ArrowRight } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Resources | Gambia's Biodiversity Outlook",
  description: "Explore conservation guides, visit information, and research data about The Gambia's biodiversity.",
}

const resources = [
  {
    title: "Conservation Guide",
    description: "Learn about best practices for conservation and how you can contribute to protecting The Gambia's natural heritage.",
    href: "/resources/conservation-guide",
    icon: BookOpen,
    color: "text-chart-1 bg-chart-1/10"
  },
  {
    title: "Visit Information",
    description: "Essential information for visitors to our national parks and protected areas, including permits and safety guidelines.",
    href: "/resources/visit-information",
    icon: Info,
    color: "text-chart-2 bg-chart-2/10"
  },
  {
    title: "Research & Data",
    description: "Access scientific data, reports, and research findings related to biodiversity management in The Gambia.",
    href: "/resources/research-data",
    icon: Database,
    color: "text-chart-3 bg-chart-3/10"
  }
]

export default function ResourcesPage() {
  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Resources</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Access a wealth of information designed to support conservation efforts, 
            inform visitors, and provide data for researchers and policymakers.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {resources.map((resource) => {
            const Icon = resource.icon
            return (
              <Link key={resource.title} href={resource.href}>
                <Card className="p-8 h-full hover:shadow-xl transition-all duration-300 group border-muted bg-card/50 backdrop-blur-sm">
                  <div className={`${resource.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">{resource.title}</h2>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {resource.description}
                  </p>
                  <div className="flex items-center text-primary font-semibold group-hover:gap-2 transition-all">
                    Explore Resource <ArrowRight className="h-4 w-4 ml-2" />
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </main>
  )
}
