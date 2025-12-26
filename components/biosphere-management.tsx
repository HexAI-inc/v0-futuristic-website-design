"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ShieldCheck, 
  Microscope, 
  Users, 
  Globe, 
  ArrowRight, 
  FileText, 
  Download, 
  ExternalLink,
  CheckCircle2,
  X
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const managementItems = [
  {
    icon: ShieldCheck,
    title: "Integrated Management",
    description: "Coordinated by the Department of Parks and Wildlife Management (DPWM) in collaboration with local communities and international partners.",
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    icon: Microscope,
    title: "Scientific Research",
    description: "Ongoing studies on mangrove restoration, migratory bird patterns, and the impact of climate change on coastal ecosystems.",
    color: "text-purple-500",
    bg: "bg-purple-500/10"
  },
  {
    icon: Users,
    title: "Community Governance",
    description: "Local management committees ensure that conservation efforts align with the needs and traditional knowledge of resident communities.",
    color: "text-orange-500",
    bg: "bg-orange-500/10"
  },
  {
    icon: Globe,
    title: "Global Monitoring",
    description: "Part of the World Network of Biosphere Reserves, contributing data to global environmental monitoring and sustainability goals.",
    color: "text-green-500",
    bg: "bg-green-500/10"
  }
]

export function BiosphereManagement() {
  const [showPlan, setShowPlan] = useState(false)

  return (
    <section className="py-24 px-4 bg-muted/30 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <Badge variant="outline" className="mb-4 border-chart-3 text-chart-3">
              Governance & Science
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Management & Research</h2>
            <p className="text-lg text-muted-foreground">
              The Niumi Biosphere Reserve is managed through a participatory approach that combines modern conservation science with traditional community wisdom.
            </p>
          </div>
          <div className="hidden md:block">
            <Button 
              onClick={() => setShowPlan(true)}
              variant="outline" 
              className="border-chart-3 text-chart-3 hover:bg-chart-3/10 gap-2"
            >
              <FileText className="h-4 w-4" />
              View Management Plan
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {managementItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 h-full hover:shadow-md transition-shadow border-none bg-background">
                <div className={`${item.bg} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                  <item.icon className={`h-6 w-6 ${item.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 grid lg:grid-cols-2 gap-8">
          <Card className="p-8 border-chart-3/20 bg-chart-3/5">
            <h4 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Microscope className="h-6 w-6 text-chart-3" />
              Current Research Focus
            </h4>
            <ul className="space-y-4">
              {[
                "Carbon sequestration potential of Niumi's mangrove forests.",
                "Socio-economic impacts of sustainable oyster harvesting.",
                "Monitoring of the critically endangered West African Manatee.",
                "Hydrological changes in the Niumi-Saloum delta system."
              ].map((study, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <div className="h-1.5 w-1.5 rounded-full bg-chart-3 mt-2 shrink-0" />
                  <span className="text-muted-foreground">{study}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-8 border-chart-4/20 bg-chart-4/5">
            <h4 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Users className="h-6 w-6 text-chart-4" />
              Community Participation
            </h4>
            <p className="text-muted-foreground mb-6">
              Over 14 local communities are directly involved in the management of the reserve. Their participation is facilitated through:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-background/50 p-4 rounded-lg">
                <span className="font-bold block mb-1 text-sm">Village Committees</span>
                <span className="text-[10px] text-muted-foreground">Local decision-making bodies for resource use.</span>
              </div>
              <div className="bg-background/50 p-4 rounded-lg">
                <span className="font-bold block mb-1 text-sm">Eco-Guards</span>
                <span className="text-[10px] text-muted-foreground">Community members trained in monitoring and protection.</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Management Plan Overlay/Modal */}
      <AnimatePresence>
        {showPlan && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-card border shadow-2xl rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b flex justify-between items-center bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="bg-chart-3/20 p-2 rounded-lg">
                    <FileText className="h-6 w-6 text-chart-3" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Management Plan 2023-2028</h3>
                    <p className="text-xs text-muted-foreground">Strategic Framework for Niumi Biosphere Reserve</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowPlan(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-12">
                <section className="space-y-4">
                  <h4 className="text-lg font-bold flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-chart-3" />
                    Strategic Objectives
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      "Conserve biodiversity and maintain ecosystem services.",
                      "Promote sustainable socio-economic development.",
                      "Support research, monitoring, and education.",
                      "Strengthen institutional and community governance."
                    ].map((obj, i) => (
                      <div key={i} className="p-4 rounded-xl bg-muted/50 border text-sm">
                        {obj}
                      </div>
                    ))}
                  </div>
                </section>

                <section className="space-y-4">
                  <h4 className="text-lg font-bold flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-chart-3" />
                    Key Management Actions
                  </h4>
                  <div className="space-y-3">
                    {[
                      { title: "Zonation Enforcement", desc: "Regular patrols and community monitoring of core and buffer zones." },
                      { title: "Sustainable Livelihoods", desc: "Support for eco-tourism, sustainable oyster harvesting, and agro-forestry." },
                      { title: "Climate Adaptation", desc: "Mangrove restoration projects to protect against coastal erosion." },
                      { title: "Education & Outreach", desc: "Environmental programs in local schools and community centers." }
                    ].map((action, i) => (
                      <div key={i} className="flex gap-4 items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-chart-3 mt-2 shrink-0" />
                        <div>
                          <span className="font-bold text-sm block">{action.title}</span>
                          <span className="text-sm text-muted-foreground">{action.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <div className="bg-chart-3/10 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <Download className="h-8 w-8 text-chart-3" />
                    <div>
                      <h5 className="font-bold">Download Full Document</h5>
                      <p className="text-sm text-muted-foreground">PDF (12.4 MB) • English Version</p>
                    </div>
                  </div>
                  <Button className="bg-chart-3 text-background hover:bg-chart-3/90 gap-2">
                    Download PDF
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
