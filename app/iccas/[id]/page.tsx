import { notFound } from "next/navigation"
import { getIcca } from "@/lib/database"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, TreePine, Calendar, Shield, Info } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ResourceActions } from "@/components/resource-actions"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const icca = await getIcca(id)

  if (!icca) return {}

  return {
    title: `${icca.name} | ICCA The Gambia`,
    description: icca.summary,
  }
}

export default async function IccaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const icca = await getIcca(id)

  if (!icca) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <Image
          src={icca.gallery?.[0]?.src || "/placeholder.svg"}
          alt={icca.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-secondary text-secondary-foreground px-4 py-1 text-sm">
            Community Conserved Area
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">{icca.name}</h1>
          <div className="flex items-center justify-center gap-4 text-white/90">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-secondary" />
              <span>{icca.region}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-12">
              <div>
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                  <Info className="h-8 w-8 text-secondary" />
                  About this Area
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {icca.summary}
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                  <Shield className="h-8 w-8 text-secondary" />
                  Key Highlights
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {icca.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border border-border">
                      <div className="h-6 w-6 rounded-full bg-secondary/20 flex items-center justify-center shrink-0 mt-1">
                        <div className="h-2 w-2 rounded-full bg-secondary" />
                      </div>
                      <span className="font-medium">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {icca.gallery && icca.gallery.length > 0 && (
                <div>
                  <h2 className="text-3xl font-bold mb-6">Gallery</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {icca.gallery.map((image, index) => (
                      <div key={index} className="relative aspect-video rounded-2xl overflow-hidden group">
                        <Image
                          src={image.src}
                          alt={image.alt || icca.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              <div className="p-8 rounded-3xl bg-card border border-border sticky top-24">
                <h3 className="text-xl font-bold mb-6">Quick Facts</h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Region</div>
                      <div className="font-semibold">{icca.region}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Governance</div>
                      <div className="font-semibold">Community Led</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center">
                      <TreePine className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Type</div>
                      <div className="font-semibold">ICCA</div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-border">
                  <ResourceActions resourceId={icca.id} resourceName={icca.name} resourceType="icca" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Support Community Conservation</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Your support helps local communities protect their natural heritage and build sustainable futures.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <ResourceActions resourceId={icca.id} resourceName={icca.name} resourceType="icca" />
            <Link href="/iccas">
              <Button size="lg" variant="ghost" className="px-8">Back to ICCAs</Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
