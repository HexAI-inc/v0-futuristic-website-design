"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Save, 
  Loader2, 
  Layout, 
  Image as ImageIcon, 
  BarChart3, 
  Play, 
  Star,
  Plus,
  Trash2,
  MoveUp,
  MoveDown
} from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"
import Link from "next/link"
import { ImageUpload } from "@/components/admin/image-upload"

export default function AdminHomePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<Record<string, any>>({})

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/home')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error("Error fetching home settings:", error)
      toast.error("Failed to load home page settings")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSection = async (sectionId: string) => {
    try {
      setSaving(true)
      
      // Prepare data for normalized tables
      let images: any[] = []
      let stats: any[] = []
      let areas: any[] = []
      const sectionContent = { ...settings[sectionId] }

      if (sectionId === 'hero') {
        if (sectionContent.image_url) {
          images = [{ url: sectionContent.image_url, alt: sectionContent.title }]
          delete sectionContent.image_url
        }
      } else if (sectionId === 'stats') {
        if (sectionContent.stats) {
          stats = sectionContent.stats
          delete sectionContent.stats
        }
      } else if (sectionId === 'visual_story') {
        if (sectionContent.panels) {
          images = sectionContent.panels.map((p: any) => ({
            url: p.image,
            alt: p.title,
            caption: p.description
          }))
          delete sectionContent.panels
        }
      } else if (sectionId === 'featured_areas') {
        if (sectionContent.areas) {
          areas = sectionContent.areas
          images = sectionContent.areas.map((a: any) => ({
            url: a.image,
            alt: a.name
          }))
          // Remove image from areas as it goes to gallery table
          areas = areas.map((a: any) => {
            const { image, ...rest } = a
            return rest
          })
          delete sectionContent.areas
        }
      }

      const response = await fetch('/api/admin/home', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section_id: sectionId,
          content: sectionContent,
          images: images,
          stats: stats,
          areas: areas
        })
      })

      if (response.ok) {
        toast.success(`${sectionId.replace('_', ' ')} updated successfully`)
        fetchSettings() // Refresh to get clean state
      } else {
        throw new Error('Failed to update')
      }
    } catch (error) {
      toast.error(`Failed to update ${sectionId}`)
    } finally {
      setSaving(false)
    }
  }

  const updateSectionContent = (sectionId: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [key]: value
      }
    }))
  }

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Home Page Management</h1>
          <p className="text-muted-foreground mt-2">Customize the content and visuals of your website's landing page.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/admin/media">
              <ImageIcon className="h-4 w-4 mr-2" />
              Media Library
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 mb-8">
          <TabsTrigger value="hero" className="gap-2">
            <Layout className="h-4 w-4" />
            Hero
          </TabsTrigger>
          <TabsTrigger value="stats" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Stats
          </TabsTrigger>
          <TabsTrigger value="visual_story" className="gap-2">
            <Play className="h-4 w-4" />
            Visual Story
          </TabsTrigger>
          <TabsTrigger value="featured_areas" className="gap-2">
            <Star className="h-4 w-4" />
            Featured
          </TabsTrigger>
        </TabsList>

        {/* Hero Section */}
        <TabsContent value="hero">
          <Card className="p-6 space-y-6 bg-card border-muted">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Hero Section</h3>
              <Button onClick={() => handleSaveSection('hero')} disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Changes
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hero_title">Main Title</Label>
                  <Input 
                    id="hero_title"
                    value={settings.hero?.title || ""}
                    onChange={(e) => updateSectionContent('hero', 'title', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hero_subtitle">Subtitle</Label>
                  <Textarea 
                    id="hero_subtitle"
                    rows={3}
                    value={settings.hero?.subtitle || ""}
                    onChange={(e) => updateSectionContent('hero', 'subtitle', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hero_button">Button Text</Label>
                  <Input 
                    id="hero_button"
                    value={settings.hero?.button_text || ""}
                    onChange={(e) => updateSectionContent('hero', 'button_text', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <ImageUpload 
                  label="Background Image"
                  value={settings.hero?.image_url || ""}
                  onChange={(url) => updateSectionContent('hero', 'image_url', url)}
                  sectionId="hero"
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Stats Section */}
        <TabsContent value="stats">
          <Card className="p-6 space-y-6 bg-card border-muted">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">Statistics Section</h3>
                <p className="text-sm text-muted-foreground">Update the key biodiversity statistics shown on the home page.</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const currentStats = settings.stats?.stats || []
                    updateSectionContent('stats', 'stats', [
                      ...currentStats,
                      { value: 0, suffix: '', label: '', description: '', decimals: 0 }
                    ])
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Stat
                </Button>
                <Button onClick={() => handleSaveSection('stats')} disabled={saving}>
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Changes
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stats_title">Section Title</Label>
                  <Input 
                    id="stats_title"
                    value={settings.stats?.title || ""}
                    onChange={(e) => updateSectionContent('stats', 'title', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stats_subtitle">Section Subtitle</Label>
                  <Input 
                    id="stats_subtitle"
                    value={settings.stats?.subtitle || ""}
                    onChange={(e) => updateSectionContent('stats', 'subtitle', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4 mt-6">
                <Label>Counters</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {settings.stats?.stats?.map((stat: any, idx: number) => (
                    <Card key={idx} className="p-4 bg-muted/20 border-muted relative group">
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6"
                          onClick={() => {
                            const newStats = [...settings.stats.stats]
                            newStats.splice(idx, 1)
                            updateSectionContent('stats', 'stats', newStats)
                          }}
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-[10px] uppercase">Value</Label>
                          <Input 
                            type="number"
                            step="0.1"
                            value={stat.value}
                            onChange={(e) => {
                              const newStats = [...settings.stats.stats]
                              newStats[idx].value = parseFloat(e.target.value)
                              updateSectionContent('stats', 'stats', newStats)
                            }}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] uppercase">Suffix</Label>
                          <Input 
                            value={stat.suffix}
                            onChange={(e) => {
                              const newStats = [...settings.stats.stats]
                              newStats[idx].suffix = e.target.value
                              updateSectionContent('stats', 'stats', newStats)
                            }}
                          />
                        </div>
                        <div className="col-span-2 space-y-1">
                          <Label className="text-[10px] uppercase">Label</Label>
                          <Input 
                            value={stat.label}
                            onChange={(e) => {
                              const newStats = [...settings.stats.stats]
                              newStats[idx].label = e.target.value
                              updateSectionContent('stats', 'stats', newStats)
                            }}
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Visual Story Section */}
        <TabsContent value="visual_story">
          <Card className="p-6 space-y-6 bg-card border-muted">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">Visual Story Panels</h3>
                <p className="text-sm text-muted-foreground">Add or remove panels from the visual story section.</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const currentPanels = settings.visual_story?.panels || []
                    updateSectionContent('visual_story', 'panels', [
                      ...currentPanels,
                      { title: '', description: '', image: '' }
                    ])
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Panel
                </Button>
                <Button onClick={() => handleSaveSection('visual_story')} disabled={saving}>
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Changes
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              {settings.visual_story?.panels?.map((panel: any, idx: number) => (
                <Card key={idx} className="p-4 bg-muted/20 border-muted relative group">
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => {
                        const newPanels = [...settings.visual_story.panels]
                        newPanels.splice(idx, 1)
                        updateSectionContent('visual_story', 'panels', newPanels)
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                      <ImageUpload 
                        label="Panel Image"
                        value={panel.image}
                        onChange={(url) => {
                          const newPanels = [...settings.visual_story.panels]
                          newPanels[idx].image = url
                          updateSectionContent('visual_story', 'panels', newPanels)
                        }}
                        sectionId="visual_story"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-4">
                      <div className="space-y-2">
                        <Label>Panel Title</Label>
                        <Input 
                          value={panel.title}
                          onChange={(e) => {
                            const newPanels = [...settings.visual_story.panels]
                            newPanels[idx].title = e.target.value
                            updateSectionContent('visual_story', 'panels', newPanels)
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea 
                          value={panel.description}
                          onChange={(e) => {
                            const newPanels = [...settings.visual_story.panels]
                            newPanels[idx].description = e.target.value
                            updateSectionContent('visual_story', 'panels', newPanels)
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              {(!settings.visual_story?.panels || settings.visual_story.panels.length === 0) && (
                <div className="text-center py-12 border-2 border-dashed border-muted rounded-lg">
                  <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">No panels added</h3>
                  <p className="text-muted-foreground">Click the "Add Panel" button to start building your visual story.</p>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        {/* Featured Areas Section */}
        <TabsContent value="featured_areas">
          <Card className="p-6 space-y-6 bg-card border-muted">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">Featured Areas Carousel</h3>
                <p className="text-sm text-muted-foreground">Manage the featured conservation areas shown on the home page.</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const currentAreas = settings.featured_areas?.areas || []
                    updateSectionContent('featured_areas', 'areas', [
                      ...currentAreas,
                      { name: '', type: '', description: '', size: '', established: '', link: '', image: '' }
                    ])
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Area
                </Button>
                <Button onClick={() => handleSaveSection('featured_areas')} disabled={saving}>
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Changes
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              {settings.featured_areas?.areas?.map((area: any, idx: number) => (
                <Card key={idx} className="p-4 bg-muted/20 border-muted relative group">
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => {
                        const newAreas = [...settings.featured_areas.areas]
                        newAreas.splice(idx, 1)
                        updateSectionContent('featured_areas', 'areas', newAreas)
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-1">
                      <ImageUpload 
                        label="Area Image"
                        value={area.image}
                        onChange={(url) => {
                          const newAreas = [...settings.featured_areas.areas]
                          newAreas[idx].image = url
                          updateSectionContent('featured_areas', 'areas', newAreas)
                        }}
                        sectionId="featured_areas"
                      />
                    </div>
                    <div className="md:col-span-3 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-[10px] uppercase">Name</Label>
                          <Input 
                            value={area.name}
                            onChange={(e) => {
                              const newAreas = [...settings.featured_areas.areas]
                              newAreas[idx].name = e.target.value
                              updateSectionContent('featured_areas', 'areas', newAreas)
                            }}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] uppercase">Type</Label>
                          <Input 
                            value={area.type}
                            onChange={(e) => {
                              const newAreas = [...settings.featured_areas.areas]
                              newAreas[idx].type = e.target.value
                              updateSectionContent('featured_areas', 'areas', newAreas)
                            }}
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] uppercase">Description</Label>
                        <Textarea 
                          rows={2}
                          value={area.description}
                          onChange={(e) => {
                            const newAreas = [...settings.featured_areas.areas]
                            newAreas[idx].description = e.target.value
                            updateSectionContent('featured_areas', 'areas', newAreas)
                          }}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-[10px] uppercase">Size</Label>
                          <Input 
                            value={area.size}
                            onChange={(e) => {
                              const newAreas = [...settings.featured_areas.areas]
                              newAreas[idx].size = e.target.value
                              updateSectionContent('featured_areas', 'areas', newAreas)
                            }}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] uppercase">Link</Label>
                          <Input 
                            value={area.link}
                            onChange={(e) => {
                              const newAreas = [...settings.featured_areas.areas]
                              newAreas[idx].link = e.target.value
                              updateSectionContent('featured_areas', 'areas', newAreas)
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              
              <Button 
                variant="outline" 
                className="w-full border-dashed"
                onClick={() => {
                  const newAreas = [...(settings.featured_areas?.areas || [])]
                  newAreas.push({
                    id: `new-${Date.now()}`,
                    name: "New Area",
                    type: "National Park",
                    image: "",
                    description: "",
                    size: "",
                    established: "",
                    link: "#"
                  })
                  updateSectionContent('featured_areas', 'areas', newAreas)
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Featured Area
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
