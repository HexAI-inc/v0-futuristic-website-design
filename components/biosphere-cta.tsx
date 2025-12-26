"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowRight, 
  MapPin, 
  Calendar, 
  Heart, 
  Navigation, 
  Info, 
  Phone, 
  Clock,
  Camera,
  Binoculars,
  Waves
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { ResourceActions } from "@/components/resource-actions"

interface BiosphereCTAProps {
  biosphereId: string
  biosphereName: string
}

export function BiosphereCTA({ biosphereId, biosphereName }: BiosphereCTAProps) {
  return (
    <section className="py-24 px-4 relative overflow-hidden bg-muted/20">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-chart-3/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-chart-4/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Plan Your <span className="text-chart-3">Biosphere Journey</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know for an unforgettable and responsible visit to the Niumi Biosphere Reserve.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Essential Info Cards */}
          <Card className="p-6 space-y-4 border-none shadow-md bg-background">
            <div className="bg-chart-3/10 w-12 h-12 rounded-xl flex items-center justify-center">
              <Navigation className="h-6 w-6 text-chart-3" />
            </div>
            <h3 className="text-xl font-bold">Getting There</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Take the ferry from Banjul to Barra. From Barra, the reserve is a short 20-minute drive north. Local taxis (Gelli-Gellis) are readily available.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-medium text-chart-3">
              <Clock className="h-3 w-3" />
              Ferry runs every 45-60 mins
            </div>
          </Card>

          <Card className="p-6 space-y-4 border-none shadow-md bg-background">
            <div className="bg-chart-4/10 w-12 h-12 rounded-xl flex items-center justify-center">
              <Calendar className="h-6 w-6 text-chart-4" />
            </div>
            <h3 className="text-xl font-bold">Best Time to Visit</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The dry season (November to May) is ideal for birdwatching and hiking. The rainy season (June to October) offers lush green landscapes but some trails may be muddy.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-medium text-chart-4">
              <Binoculars className="h-3 w-3" />
              Peak birding: Dec - Feb
            </div>
          </Card>

          <Card className="p-6 space-y-4 border-none shadow-md bg-background">
            <div className="bg-destructive/10 w-12 h-12 rounded-xl flex items-center justify-center">
              <Info className="h-6 w-6 text-destructive" />
            </div>
            <h3 className="text-xl font-bold">Visitor Guidelines</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Respect local customs, stay on designated trails, and carry out all waste. Hiring a local guide is highly recommended for the best experience and to support the community.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-medium text-destructive">
              <Heart className="h-3 w-3" />
              Leave no trace
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <Tabs defaultValue="activities" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="activities">Top Activities</TabsTrigger>
                <TabsTrigger value="logistics">Logistics & Fees</TabsTrigger>
              </TabsList>
              <TabsContent value="activities" className="space-y-6">
                <div className="grid gap-4">
                  {[
                    { icon: Binoculars, title: "Birdwatching", desc: "Spot over 300 species including the rare Osprey." },
                    { icon: Waves, title: "Boat Safaris", desc: "Navigate the mangrove creeks to see manatees and dolphins." },
                    { icon: Camera, title: "Cultural Tours", desc: "Visit local villages and learn about traditional oyster harvesting." },
                    { icon: MapPin, title: "Hiking Trails", desc: "Explore the diverse ecosystems from dunes to salt marshes." }
                  ].map((act, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-xl bg-background border hover:border-chart-3 transition-colors">
                      <div className="bg-muted p-2 rounded-lg h-fit">
                        <act.icon className="h-5 w-5 text-chart-3" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{act.title}</h4>
                        <p className="text-xs text-muted-foreground">{act.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="logistics" className="space-y-6">
                <div className="bg-background rounded-2xl p-6 border space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span className="font-medium">Entry Fee (International)</span>
                    <span className="font-bold text-chart-3">D250</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span className="font-medium">Entry Fee (Local)</span>
                    <span className="font-bold text-chart-3">D50</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span className="font-medium">Guided Tour (Half Day)</span>
                    <span className="font-bold text-chart-3">D1,500+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Boat Rental</span>
                    <span className="font-bold text-chart-3">D2,500+</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground italic pt-2">
                    * Prices are approximate and subject to change. All fees contribute directly to conservation and community projects.
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex flex-wrap gap-4">
              <ResourceActions 
                resourceId={biosphereId} 
                resourceName={biosphereName} 
                resourceType="biosphere" 
              />
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-8 border-background">
              <img 
                src="/images/biosphere/niumi-biosphere-reserve-gambia-aerial.jpg" 
                alt="Aerial view of Niumi Biosphere Reserve"
                className="w-full aspect-square object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1200";
                }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8">
                <Badge className="w-fit mb-4 bg-chart-3 text-background">Visitor Center</Badge>
                <h4 className="text-2xl font-bold text-white mb-2">Kanuma Visitor Center</h4>
                <p className="text-white/80 text-sm">
                  Start your journey here for maps, permits, and to meet our certified local guides.
                </p>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-chart-3/10 rounded-full -z-10 blur-2xl" />
            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-chart-4/10 rounded-full -z-10 blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  )
}
