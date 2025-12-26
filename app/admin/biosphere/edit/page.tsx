"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft,
  Loader2,
  Save,
  Plus,
  Trash2,
  Waves,
  Bird,
  Fish,
  TreePine,
  Sunrise,
  Droplets,
  Award,
  Target,
  BookOpen,
  Users
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AlertModal, useModals } from "@/components/ui/modals"
import type { Biosphere, BiosphereFeature, BiosphereObjective } from "@/lib/database"
import { ImageUpload } from "@/components/admin/image-upload"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface BiosphereFormData {
  name: string
  description: string
  designation_year: number
  total_area_hectares: number
  communities_involved: number
  unesco_program: string
  hero_image_url: string
  zones_title: string
  zones_description: string
  features_title: string
  features_description: string
  objectives_title: string
  objectives_description: string
  model_title: string
  model_text_1: string
  model_text_2: string
  model_quote: string
  concept_title: string
  concept_description: string
  features: Omit<BiosphereFeature, 'id' | 'biosphere_id' | 'created_at'>[]
  objectives: Omit<BiosphereObjective, 'id' | 'biosphere_id' | 'created_at'>[]
}

const FEATURE_ICONS = [
  { value: 'Waves', label: 'Waves', icon: Waves },
  { value: 'Bird', label: 'Bird', icon: Bird },
  { value: 'Fish', label: 'Fish', icon: Fish },
  { value: 'TreePine', label: 'Tree', icon: TreePine },
  { value: 'Sunrise', label: 'Sunrise', icon: Sunrise },
  { value: 'Droplets', label: 'Water', icon: Droplets },
]

const OBJECTIVE_ICONS = [
  { value: 'Award', label: 'Award', icon: Award },
  { value: 'Target', label: 'Target', icon: Target },
  { value: 'BookOpen', label: 'Education', icon: BookOpen },
  { value: 'Users', label: 'Community', icon: Users },
]

export default function EditBiospherePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [biosphere, setBiosphere] = useState<Biosphere | null>(null)
  const { alertModal, showAlert, closeAlert } = useModals()

  const [formData, setFormData] = useState<BiosphereFormData>({
    name: '',
    description: '',
    designation_year: 2000,
    total_area_hectares: 0,
    communities_involved: 0,
    unesco_program: '',
    hero_image_url: '',
    zones_title: '',
    zones_description: '',
    features_title: '',
    features_description: '',
    objectives_title: '',
    objectives_description: '',
    model_title: '',
    model_text_1: '',
    model_text_2: '',
    model_quote: '',
    concept_title: '',
    concept_description: '',
    features: [],
    objectives: []
  })

  useEffect(() => {
    fetchBiosphere()
  }, [])

  const fetchBiosphere = async () => {
    try {
      const response = await fetch('/api/biosphere')
      if (!response.ok) {
        throw new Error('Failed to fetch biosphere')
      }
      const data = await response.json()
      setBiosphere(data)
      setFormData({
        name: data.name,
        description: data.description,
        designation_year: data.designation_year,
        total_area_hectares: data.total_area_hectares,
        communities_involved: data.communities_involved,
        unesco_program: data.unesco_program,
        hero_image_url: data.hero_image_url,
        zones_title: data.zones_title || '',
        zones_description: data.zones_description || '',
        features_title: data.features_title || '',
        features_description: data.features_description || '',
        objectives_title: data.objectives_title || '',
        objectives_description: data.objectives_description || '',
        model_title: data.model_title || '',
        model_text_1: data.model_text_1 || '',
        model_text_2: data.model_text_2 || '',
        model_quote: data.model_quote || '',
        concept_title: data.concept_title || '',
        concept_description: data.concept_description || '',
        features: data.features?.map((f: any) => ({
          title: f.title,
          description: f.description,
          icon: f.icon,
          sort_order: f.sort_order
        })) || [],
        objectives: data.objectives?.map((o: any) => ({
          title: o.title,
          description: o.description,
          icon: o.icon,
          sort_order: o.sort_order
        })) || []
      })
    } catch (error) {
      console.error('Error fetching biosphere:', error)
      showAlert('Error loading biosphere data', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleAddFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [
        ...prev.features,
        { title: '', description: '', icon: 'Waves', sort_order: prev.features.length }
      ]
    }))
  }

  const handleRemoveFeature = (index: number) => {
    setFormData(prev => {
      const newFeatures = [...prev.features]
      newFeatures.splice(index, 1)
      return { ...prev, features: newFeatures }
    })
  }

  const handleFeatureChange = (index: number, field: keyof BiosphereFormData['features'][0], value: any) => {
    setFormData(prev => {
      const newFeatures = [...prev.features]
      newFeatures[index] = { ...newFeatures[index], [field]: value }
      return { ...prev, features: newFeatures }
    })
  }

  const handleAddObjective = () => {
    setFormData(prev => ({
      ...prev,
      objectives: [
        ...prev.objectives,
        { title: '', description: '', icon: 'Award', sort_order: prev.objectives.length }
      ]
    }))
  }

  const handleRemoveObjective = (index: number) => {
    setFormData(prev => {
      const newObjectives = [...prev.objectives]
      newObjectives.splice(index, 1)
      return { ...prev, objectives: newObjectives }
    })
  }

  const handleObjectiveChange = (index: number, field: keyof BiosphereFormData['objectives'][0], value: any) => {
    setFormData(prev => {
      const newObjectives = [...prev.objectives]
      newObjectives[index] = { ...newObjectives[index], [field]: value }
      return { ...prev, objectives: newObjectives }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!biosphere) return

    if (!formData.name.trim() || !formData.description.trim()) {
      showAlert('Please fill in all required fields', 'error')
      return
    }

    setSaving(true)

    try {
      const response = await fetch(`/api/biosphere/${biosphere.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update biosphere')
      }

      showAlert('Biosphere updated successfully!', 'success')
      setTimeout(() => {
        router.push('/admin/biosphere')
      }, 1500)

    } catch (error) {
      console.error('Error updating biosphere:', error)
      showAlert(error instanceof Error ? error.message : 'Failed to update biosphere', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!biosphere) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Biosphere Not Found</h1>
          <p className="text-muted-foreground">The biosphere data could not be loaded.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/biosphere">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Biosphere
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Biosphere Reserve</h1>
          <p className="text-muted-foreground mt-2">Update biosphere reserve information</p>
        </div>
      </div>

      {/* Form */}
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter biosphere name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="designation_year">Designation Year</Label>
              <Input
                id="designation_year"
                type="number"
                value={formData.designation_year}
                onChange={(e) => setFormData({ ...formData, designation_year: parseInt(e.target.value) || 2000 })}
                placeholder="2001"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="total_area_hectares">Total Area (Hectares)</Label>
              <Input
                id="total_area_hectares"
                type="number"
                value={formData.total_area_hectares}
                onChange={(e) => setFormData({ ...formData, total_area_hectares: parseInt(e.target.value) || 0 })}
                placeholder="68530"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="communities_involved">Communities Involved</Label>
              <Input
                id="communities_involved"
                type="number"
                value={formData.communities_involved}
                onChange={(e) => setFormData({ ...formData, communities_involved: parseInt(e.target.value) || 0 })}
                placeholder="35"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="unesco_program">UNESCO Program</Label>
            <Input
              id="unesco_program"
              value={formData.unesco_program}
              onChange={(e) => setFormData({ ...formData, unesco_program: e.target.value })}
              placeholder="UNESCO Man and Biosphere Programme"
            />
          </div>

          <div className="space-y-2">
            <ImageUpload 
              label="Hero Image"
              value={formData.hero_image_url}
              onChange={(url) => setFormData({ ...formData, hero_image_url: url })}
              sectionId="biosphere"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter biosphere description"
              rows={4}
              required
            />
          </div>

          {/* Functional Zones Section */}
          <div className="space-y-4 pt-4 border-t">
            <div>
              <h3 className="text-lg font-semibold">Functional Zones Section</h3>
              <p className="text-sm text-muted-foreground">Title and description for the zones section</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="zones_title">Section Title</Label>
                <Input
                  id="zones_title"
                  value={formData.zones_title}
                  onChange={(e) => setFormData({ ...formData, zones_title: e.target.value })}
                  placeholder="e.g., Functional Zones"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zones_description">Section Description</Label>
                <Textarea
                  id="zones_description"
                  value={formData.zones_description}
                  onChange={(e) => setFormData({ ...formData, zones_description: e.target.value })}
                  placeholder="The biosphere reserve is organized into interconnected zones..."
                  rows={2}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="space-y-2">
                <Label htmlFor="concept_title">Concept Card Title</Label>
                <Input
                  id="concept_title"
                  value={formData.concept_title}
                  onChange={(e) => setFormData({ ...formData, concept_title: e.target.value })}
                  placeholder="e.g., The Biosphere Concept"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="concept_description">Concept Card Description</Label>
                <Textarea
                  id="concept_description"
                  value={formData.concept_description}
                  onChange={(e) => setFormData({ ...formData, concept_description: e.target.value })}
                  placeholder="The text inside the highlighted concept card"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Ecological Features */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Ecological Treasures</h3>
                <p className="text-sm text-muted-foreground">Key features of the biosphere reserve</p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={handleAddFeature}>
                <Plus className="h-4 w-4 mr-2" />
                Add Feature
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="features_title">Section Title</Label>
                <Input
                  id="features_title"
                  value={formData.features_title}
                  onChange={(e) => setFormData({ ...formData, features_title: e.target.value })}
                  placeholder="e.g., Ecological Treasures"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="features_description">Section Description</Label>
                <Textarea
                  id="features_description"
                  value={formData.features_description}
                  onChange={(e) => setFormData({ ...formData, features_description: e.target.value })}
                  placeholder="Brief description for the features section"
                  rows={2}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.features.map((feature, index) => (
                <Card key={index} className="p-4 relative group">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                    onClick={() => handleRemoveFeature(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2 space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={feature.title}
                          onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                          placeholder="e.g., Mangrove Forests"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Icon</Label>
                        <Select
                          value={feature.icon || 'Waves'}
                          onValueChange={(value) => handleFeatureChange(index, 'icon', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {FEATURE_ICONS.map((item) => (
                              <SelectItem key={item.value} value={item.value}>
                                <div className="flex items-center">
                                  <item.icon className="h-4 w-4 mr-2" />
                                  {item.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={feature.description || ''}
                        onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                        placeholder="Brief description of this feature"
                        rows={2}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* UNESCO Objectives */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">UNESCO Recognition</h3>
                <p className="text-sm text-muted-foreground">Objectives and international recognition</p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={handleAddObjective}>
                <Plus className="h-4 w-4 mr-2" />
                Add Objective
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="objectives_title">Section Title</Label>
                <Input
                  id="objectives_title"
                  value={formData.objectives_title}
                  onChange={(e) => setFormData({ ...formData, objectives_title: e.target.value })}
                  placeholder="e.g., International Recognition"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="objectives_description">Section Description</Label>
                <Textarea
                  id="objectives_description"
                  value={formData.objectives_description}
                  onChange={(e) => setFormData({ ...formData, objectives_description: e.target.value })}
                  placeholder="Brief description for the recognition section"
                  rows={2}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.objectives.map((objective, index) => (
                <Card key={index} className="p-4 relative group">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                    onClick={() => handleRemoveObjective(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2 space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={objective.title}
                          onChange={(e) => handleObjectiveChange(index, 'title', e.target.value)}
                          placeholder="e.g., Conservation"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Icon</Label>
                        <Select
                          value={objective.icon || 'Award'}
                          onValueChange={(value) => handleObjectiveChange(index, 'icon', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {OBJECTIVE_ICONS.map((item) => (
                              <SelectItem key={item.value} value={item.value}>
                                <div className="flex items-center">
                                  <item.icon className="h-4 w-4 mr-2" />
                                  {item.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={objective.description || ''}
                        onChange={(e) => handleObjectiveChange(index, 'description', e.target.value)}
                        placeholder="Brief description of this objective"
                        rows={2}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Sustainable Development Model */}
          <div className="space-y-4 pt-4 border-t">
            <div>
              <h3 className="text-lg font-semibold">Sustainable Development Model</h3>
              <p className="text-sm text-muted-foreground">The detailed text section at the bottom of the page</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="model_title">Model Title</Label>
                <Input
                  id="model_title"
                  value={formData.model_title}
                  onChange={(e) => setFormData({ ...formData, model_title: e.target.value })}
                  placeholder="e.g., A Model for Sustainable Development"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="model_text_1">Paragraph 1</Label>
                  <Textarea
                    id="model_text_1"
                    value={formData.model_text_1}
                    onChange={(e) => setFormData({ ...formData, model_text_1: e.target.value })}
                    placeholder="First paragraph of the model section"
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model_text_2">Paragraph 2</Label>
                  <Textarea
                    id="model_text_2"
                    value={formData.model_text_2}
                    onChange={(e) => setFormData({ ...formData, model_text_2: e.target.value })}
                    placeholder="Second paragraph of the model section"
                    rows={4}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="model_quote">Featured Quote</Label>
                <Textarea
                  id="model_quote"
                  value={formData.model_quote}
                  onChange={(e) => setFormData({ ...formData, model_quote: e.target.value })}
                  placeholder="The highlighted quote at the bottom"
                  rows={2}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={saving} className="flex-1">
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push('/admin/biosphere')} disabled={saving}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>

      {/* Alert Modal */}
      <AlertModal {...alertModal} onClose={closeAlert} />
    </div>
  )
}