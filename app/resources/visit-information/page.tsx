import { Card } from "@/components/ui/card"
import { MapPin, Clock, Ticket, AlertTriangle, ShieldCheck, Leaf, Recycle, Heart, FileText, BarChart } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Resource } from "@/lib/database"

export const metadata = {
  title: "Visit Information | Gambia's Biodiversity Outlook",
  description: "Essential information for visiting The Gambia's protected areas.",
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

async function getVisitInfo() {
  const { data, error } = await supabase
    .from('resources')
    .select('*, attachments:resource_attachments(*)')
    .eq('category', 'visit-information')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching visit info:', error)
    return []
  }
  return data as Resource[]
}

export default async function VisitInformationPage() {
  const infoSections = await getVisitInfo()

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-6">Visit Information</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Everything you need to know to plan a safe and rewarding visit to The Gambia's 
            national parks and community-conserved areas.
          </p>
        </div>

        <div className="grid gap-6">
          {infoSections.length > 0 ? (
            infoSections.map((section) => {
              const Icon = ICONS[section.icon || 'FileText'] || FileText
              return (
                <Card key={section.id} className="p-8 border-muted bg-card/50">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-secondary/20">
                      <Icon className="h-6 w-6 text-secondary-foreground" />
                    </div>
                    <h2 className="text-2xl font-bold">{section.title}</h2>
                  </div>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {section.description}
                  </p>
                  {section.file_url && (
                    <a 
                      href={section.file_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center mt-4 text-sm font-medium text-primary hover:underline"
                    >
                      Download Document {section.file_size && `(${section.file_size})`}
                    </a>
                  )}

                  {section.attachments && section.attachments.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-muted/50">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Related Documents</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {section.attachments.sort((a, b) => a.sort_order - b.sort_order).map((attachment) => (
                          <a 
                            key={attachment.id}
                            href={attachment.file_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors text-sm"
                          >
                            <FileText className="h-4 w-4 text-primary" />
                            <div className="flex flex-col">
                              <span className="font-medium line-clamp-1">{attachment.file_name}</span>
                              {attachment.file_size && <span className="text-[10px] text-muted-foreground">{attachment.file_size}</span>}
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              )
            })
          ) : (
            <p className="text-center text-muted-foreground py-12">No visit information available at the moment.</p>
          )}
        </div>
      </div>
    </main>
  )
}
