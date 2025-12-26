import { Card } from "@/components/ui/card"
import { Target, Eye, Shield, Users } from "lucide-react"
import Image from "next/image"

export const metadata = {
  title: "About Us | Gambia's Biodiversity Outlook",
  description: "Learn about our mission to protect and manage The Gambia's rich biodiversity.",
}

const values = [
  {
    title: "Conservation",
    description: "Protecting the unique flora and fauna of The Gambia for future generations.",
    icon: Shield
  },
  {
    title: "Community",
    description: "Empowering local communities to lead and benefit from conservation efforts.",
    icon: Users
  },
  {
    title: "Integrity",
    description: "Ensuring transparency and scientific rigor in all our management practices.",
    icon: Target
  },
  {
    title: "Sustainability",
    description: "Balancing ecological protection with sustainable development goals.",
    icon: Eye
  }
]

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Safeguarding The Gambia's <span className="text-primary">Natural Heritage</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              The Gambia's Biodiversity Outlook is a comprehensive initiative dedicated to the 
              monitoring, protection, and sustainable management of our nation's diverse 
              ecosystems. From the lush mangroves of the River Gambia to the vibrant 
              savannas, we work to ensure nature thrives.
            </p>
            <div className="flex gap-4">
              <div className="text-center p-4 rounded-2xl bg-muted/50 border border-muted">
                <div className="text-3xl font-bold text-primary">20+</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Protected Areas</div>
              </div>
              <div className="text-center p-4 rounded-2xl bg-muted/50 border border-muted">
                <div className="text-3xl font-bold text-primary">35+</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Communities</div>
              </div>
              <div className="text-center p-4 rounded-2xl bg-muted/50 border border-muted">
                <div className="text-3xl font-bold text-primary">500+</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Bird Species</div>
              </div>
            </div>
          </div>
          <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
            <Image 
              src="https://images.unsplash.com/photo-1501854140801-50d01698950b" 
              alt="Gambia Landscape" 
              fill 
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-24">
          <Card className="p-10 border-muted bg-card/50 backdrop-blur-sm">
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              To provide a robust framework for the conservation of biological diversity 
              and the sustainable use of its components, ensuring equitable sharing of 
              benefits arising from the utilization of genetic resources.
            </p>
          </Card>
          <Card className="p-10 border-muted bg-card/50 backdrop-blur-sm">
            <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              A Gambia where biodiversity is valued, conserved, restored and wisely used, 
              maintaining ecosystem services, sustaining a healthy planet and delivering 
              benefits essential for all people.
            </p>
          </Card>
        </div>

        {/* Values */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The principles that guide our work every day across the country.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {values.map((value) => {
            const Icon = value.icon
            return (
              <div key={value.title} className="p-6 text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
