import { Card } from "@/components/ui/card"
import { FileText, BarChart, Download, ExternalLink } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Resource } from "@/lib/database"

export const metadata = {
  title: "Research & Data | Gambia's Biodiversity Outlook",
  description: "Scientific data and research reports on The Gambia's biodiversity.",
}

async function getResearchData() {
  const { data, error } = await supabase
    .from('resources')
    .select('*, attachments:resource_attachments(*)')
    .eq('category', 'research-data')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching research data:', error)
    return []
  }
  return data as Resource[]
}

export default async function ResearchDataPage() {
  const reports = await getResearchData()

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-bold mb-6">Research & Data</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We are committed to evidence-based conservation. Access our latest research 
            findings, monitoring data, and technical reports.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <BarChart className="h-6 w-6 text-primary" />
              Data Visualization
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Our interactive data portal allows researchers and students to visualize 
              trends in species populations, habitat coverage, and conservation impact 
              across the country.
            </p>
            <Card className="p-6 border-primary/20 bg-primary/5 flex items-center justify-center h-48 border-dashed">
              <p className="text-sm text-muted-foreground italic">Interactive Data Portal Coming Soon</p>
            </Card>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              Latest Publications
            </h2>
            <div className="space-y-4">
              {reports.length > 0 ? (
                reports.map((report) => (
                  <div key={report.id} className="overflow-hidden rounded-xl border border-muted bg-card/50 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between p-4">
                      <div>
                        <h3 className="font-semibold">{report.title}</h3>
                        <p className="text-xs text-muted-foreground">
                          {report.file_type || 'Document'} • {report.file_size || 'N/A'} • {new Date(report.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      {report.file_url && (
                        <a 
                          href={report.file_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-primary/10 rounded-full transition-colors text-primary"
                        >
                          <Download className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                    
                    {report.attachments && report.attachments.length > 0 && (
                      <div className="px-4 pb-4 space-y-2">
                        {report.attachments.sort((a, b) => a.sort_order - b.sort_order).map((attachment) => (
                          <a 
                            key={attachment.id}
                            href={attachment.file_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-2 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="h-3 w-3 text-muted-foreground" />
                              <span>{attachment.file_name}</span>
                            </div>
                            <span className="text-[10px] text-muted-foreground">{attachment.file_size}</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground italic">No publications available at the moment.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
