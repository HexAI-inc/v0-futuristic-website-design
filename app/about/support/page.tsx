import { Card } from "@/components/ui/card"
import { Heart, Gift, Users, Globe, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata = {
  title: "Support Conservation | Gambia's Biodiversity Outlook",
  description: "Find out how you can support conservation efforts in The Gambia.",
}

const supportOptions = [
  {
    title: "Volunteer Your Time",
    description: "Join our field teams in habitat restoration, wildlife monitoring, or community education programs.",
    icon: Users,
    action: "Learn More"
  },
  {
    title: "Donate to Projects",
    description: "Directly fund critical conservation projects, from mangrove planting to anti-poaching initiatives.",
    icon: Gift,
    action: "Donate Now"
  },
  {
    title: "Corporate Partnerships",
    description: "Align your business with conservation goals through our corporate social responsibility programs.",
    icon: Globe,
    action: "Partner With Us"
  }
]

export default function SupportPage() {
  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Heart className="h-4 w-4" />
            Make a Difference
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Support Conservation</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Your support is vital to the success of our conservation programs. 
            Whether through volunteering, donations, or partnerships, every 
            contribution helps protect The Gambia's natural heritage.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {supportOptions.map((option) => {
            const Icon = option.icon
            return (
              <Card key={option.title} className="p-8 border-muted bg-card/50 flex flex-col h-full">
                <div className="bg-primary/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-4">{option.title}</h2>
                <p className="text-muted-foreground mb-8 flex-grow leading-relaxed">
                  {option.description}
                </p>
                <Button className="w-full group">
                  {option.action}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Card>
            )
          })}
        </div>

        <Card className="p-12 border-primary/20 bg-primary/5 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Contact our conservation team today to discuss how you can best 
              contribute to our ongoing initiatives.
            </p>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="px-8">
                Contact Our Team
              </Button>
            </Link>
          </div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        </Card>
      </div>
    </main>
  )
}
