import { Card } from "@/components/ui/card"
import { ShieldCheck, Leaf, Recycle, Heart, FileText, Clock, Ticket, MapPin, AlertTriangle, BarChart } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Resource } from "@/lib/database"

export const metadata = {
  title: "Conservation Guide | Gambia's Biodiversity Outlook",
  description: "A comprehensive guide to conservation practices in The Gambia.",
}

const ICONS: Record<string, any> = {
  ShieldCheck,
  Leaf,
  Recycle,
  Heart,
  FileText,
  Clock,
  Ticket,
  MapPin,
  AlertTriangle,
  BarChart
}

async function getGuides() {
  const { data, error } = await supabase
    .from('resources')
    .select('*, attachments:resource_attachments(*)')
    .eq('category', 'conservation-guide')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching guides:', error)
    return []
  }
  return data as Resource[]
}

export default async function ConservationGuidePage() {
  const guides = await getGuides()

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-6">Conservation Guide</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            This guide provides essential information for anyone interacting with The Gambia's 
            diverse ecosystems. Our goal is to ensure that conservation efforts are 
            understood and supported by everyone.
          </p>
        </div>

        <div className="grid gap-8">
          {guides.length > 0 ? (
            guides.map((guide) => {
              const Icon = ICONS[guide.icon || 'FileText'] || FileText
              return (
                <Card key={guide.id} className="p-6 border-muted bg-card/50">
                  <div className="flex gap-6">
                    <div className="bg-primary/10 p-4 rounded-xl h-fit">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold mb-2">{guide.title}</h2>
                      <p className="text-muted-foreground leading-relaxed">
                        {guide.description}
                      </p>
                      {guide.file_url && (
                        <a 
                          href={guide.file_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center mt-4 text-sm font-medium text-primary hover:underline"
                        >
                          Download Guide {guide.file_size && `(${guide.file_size})`}
                        </a>
                      )}

                      {guide.attachments && guide.attachments.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-muted/50">
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Additional Resources</p>
                          <div className="space-y-2">
                            {guide.attachments.sort((a, b) => a.sort_order - b.sort_order).map((attachment) => (
                              <a 
                                key={attachment.id}
                                href={attachment.file_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                              >
                                <FileText className="h-3 w-3" />
                                <span>{attachment.file_name}</span>
                                {attachment.file_size && <span className="text-[10px]">({attachment.file_size})</span>}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })
          ) : (
            <p className="text-center text-muted-foreground py-12">No guides available at the moment.</p>
          )}
        </div>

        <div className="mt-16 p-8 rounded-2xl bg-primary/5 border border-primary/10">
          <h2 className="text-2xl font-bold mb-4">Get Involved</h2>
          <p className="text-muted-foreground mb-6">
            Conservation is a collective responsibility. If you're interested in volunteering 
            or supporting specific projects, please reach out to our team.
          </p>
        </div>
      </div>
    </main>
  )
}
