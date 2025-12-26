"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerDescription,
  DrawerFooter,
  DrawerClose
} from "@/components/ui/drawer"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Leaf,
  Plus,
  Edit,
  MapPin,
  Users,
  TreePine,
  Loader2,
  Save,
  X,
  Trash2,
  Waves,
  Bird,
  Fish,
  Sunrise,
  Droplets,
  Award,
  Target,
  BookOpen,
  Image as ImageIcon,
  ExternalLink
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { BiosphereSkeleton } from "@/components/admin/skeletons"
import type { BiosphereWithDetails, BiosphereGallery } from "@/lib/database"
import { AlertModal, useModals } from "@/components/ui/modals"
import { ImageUpload } from "@/components/admin/image-upload"

export default function AdminBiospherePage() {
  const [biosphere, setBiosphere] = useState<BiosphereWithDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAddZoneSheetOpen, setIsAddZoneSheetOpen] = useState(false)
  const [isEditZoneSheetOpen, setIsEditZoneSheetOpen] = useState(false)
  const [isGallerySheetOpen, setIsGallerySheetOpen] = useState(false)
  const [editingZoneId, setEditingZoneId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const { alertModal, showAlert, closeAlert } = useModals()

  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.matchMedia("(min-width: 768px)").matches)
    checkDesktop()
    window.addEventListener('resize', checkDesktop)
    return () => window.removeEventListener('resize', checkDesktop)
  }, [])

  const [zoneFormData, setZoneFormData] = useState({
    name: '',
    size: '',
    description: '',
    zone_type: '',
    radius: '',
    coordinates: '',
    features: ['']
  })

  const [galleryFormData, setGalleryFormData] = useState({
    url: '',
    alt: '',
    caption: '',
    sort_order: 0
  })

  useEffect(() => {
    fetchBiosphere()
  }, [])

  const fetchBiosphere = async () => {
    try {
      const response = await fetch('/api/biosphere')
      if (response.ok) {
        const data = await response.json()
        setBiosphere(data)
      }
    } catch (error) {
      console.error('Error fetching biosphere:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddGalleryImage = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const response = await fetch('/api/biosphere/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(galleryFormData)
      })
      if (!response.ok) throw new Error('Failed to add image')
      showAlert('Image added to gallery', 'success')
      setGalleryFormData({ url: '', alt: '', caption: '', sort_order: 0 })
      fetchBiosphere()
    } catch (error) {
      showAlert('Failed to add image', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteGalleryImage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return
    try {
      const response = await fetch(`/api/biosphere/gallery/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete image')
      showAlert('Image deleted', 'success')
      fetchBiosphere()
    } catch (error) {
      showAlert('Failed to delete image', 'error')
    }
  }

  const handleAddFeature = () => {
    setZoneFormData({
      ...zoneFormData,
      features: [...zoneFormData.features, '']
    })
  }

  const handleRemoveFeature = (index: number) => {
    const newFeatures = [...zoneFormData.features]
    newFeatures.splice(index, 1)
    setZoneFormData({
      ...zoneFormData,
      features: newFeatures
    })
  }

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...zoneFormData.features]
    newFeatures[index] = value
    setZoneFormData({
      ...zoneFormData,
      features: newFeatures
    })
  }

  const resetZoneForm = () => {
    setZoneFormData({
      name: '',
      size: '',
      description: '',
      zone_type: '',
      radius: '',
      coordinates: '',
      features: ['']
    })
    setEditingZoneId(null)
  }

  const handleOpenEditZone = (zone: any) => {
    setEditingZoneId(zone.id)
    setZoneFormData({
      name: zone.name,
      size: zone.size || '',
      description: zone.description || '',
      zone_type: zone.zone_type,
      radius: zone.radius?.toString() || '',
      coordinates: zone.coordinates || '',
      features: zone.features?.map((f: any) => f.feature) || ['']
    })
    setIsEditZoneSheetOpen(true)
  }

  const handleAddZone = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!biosphere) return

    if (!zoneFormData.name.trim() || !zoneFormData.description.trim() || !zoneFormData.zone_type.trim()) {
      showAlert('Please fill in all required fields', 'error')
      return
    }

    setSaving(true)

    try {
      const response = await fetch('/api/biosphere/zones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...zoneFormData,
          biosphere_id: biosphere.id,
          radius: zoneFormData.radius ? parseFloat(zoneFormData.radius) : null,
          features: zoneFormData.features.filter(f => f.trim() !== '')
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create zone')
      }

      showAlert('Zone created successfully!', 'success')
      setZoneFormData({
        name: '',
        size: '',
        description: '',
        zone_type: '',
        features: ['']
      })
      setIsAddZoneSheetOpen(false)
      fetchBiosphere() // Refresh the data

    } catch (error) {
      console.error('Error creating zone:', error)
      showAlert(error instanceof Error ? error.message : 'Failed to create zone', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateZone = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!editingZoneId) return

    setSaving(true)

    try {
      const response = await fetch(`/api/biosphere/zones/${editingZoneId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...zoneFormData,
          radius: zoneFormData.radius ? parseFloat(zoneFormData.radius) : null,
          features: zoneFormData.features.filter(f => f.trim() !== '')
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update zone')
      }

      showAlert('Zone updated successfully!', 'success')
      setIsEditZoneSheetOpen(false)
      setEditingZoneId(null)
      fetchBiosphere()

    } catch (error) {
      console.error('Error updating zone:', error)
      showAlert(error instanceof Error ? error.message : 'Failed to update zone', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteZone = async (id: string) => {
    if (!confirm('Are you sure you want to delete this zone?')) return

    try {
      const response = await fetch(`/api/biosphere/zones/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete zone')
      }

      showAlert('Zone deleted successfully!', 'success')
      fetchBiosphere()
    } catch (error) {
      console.error('Error deleting zone:', error)
      showAlert('Failed to delete zone', 'error')
    }
  }

  const handleSeedBiosphere = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/biosphere', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: "Niumi Biosphere Reserve",
          description: "A UNESCO-designated model for sustainable development, where conservation, community livelihoods, and scientific research converge to create a harmonious balance between people and nature.",
          designation_year: 2001,
          total_area_hectares: 68530,
          communities_involved: 35,
          unesco_program: "UNESCO Man and Biosphere Programme",
          hero_image_url: "/wide-gambia-river-aerial-view.jpg",
          zones_title: "Functional Zones",
          zones_description: "The biosphere reserve is organized into interconnected zones, each serving specific conservation and development purposes.",
          concept_title: "The Biosphere Concept",
          concept_description: "Unlike traditional protected areas, biosphere reserves are designed as living laboratories where conservation, sustainable development, and scientific research work together.",
          features_title: "Ecological Treasures",
          features_description: "The Niumi Biosphere Reserve protects a remarkable diversity of ecosystems and species.",
          objectives_title: "International Recognition",
          objectives_description: "Niumi's designation as a Biosphere Reserve reflects its global importance for biodiversity.",
          model_title: "A Model for Sustainable Development",
          model_text_1: "The Niumi Biosphere Reserve serves as a living laboratory for testing and demonstrating integrated management.",
          model_text_2: "Through the Man and the Biosphere (MAB) Programme, Niumi contributes to the global network.",
          model_quote: "Conservation is not just about protecting nature from people, but about finding ways for people and nature to thrive together."
        })
      })
      
      if (!response.ok) throw new Error('Failed to seed biosphere')
      
      showAlert('Biosphere seeded successfully!', 'success')
      fetchBiosphere()
    } catch (error) {
      console.error('Error seeding biosphere:', error)
      showAlert('Failed to seed biosphere data', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <BiosphereSkeleton />
  }

  if (!biosphere) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Biosphere Not Found</h1>
          <p className="text-muted-foreground">The biosphere data could not be loaded or has not been initialized.</p>
          <Button onClick={handleSeedBiosphere} disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            Seed Initial Biosphere Data
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{biosphere.name}</h1>
          <p className="text-muted-foreground mt-2">Manage biosphere reserve content and zones</p>
        </div>
        <Button asChild>
          <Link href="/admin/biosphere/edit">
            <Edit className="h-4 w-4 mr-2" />
            Edit Biosphere
          </Link>
        </Button>
      </div>

      {/* Biosphere Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Leaf className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Zones</p>
              <p className="text-2xl font-bold text-foreground">{biosphere.zones?.length || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TreePine className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Protected Area</p>
              <p className="text-2xl font-bold text-foreground">{(biosphere.total_area_hectares / 100).toLocaleString()} km²</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Communities</p>
              <p className="text-2xl font-bold text-foreground">{biosphere.communities_involved}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Zones */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Biosphere Zones</h3>
        <div className="space-y-4">
          {biosphere.zones?.map((zone, index) => {
            const colors = [
              { bg: 'bg-red-100', text: 'text-red-600' },
              { bg: 'bg-yellow-100', text: 'text-yellow-600' },
              { bg: 'bg-green-100', text: 'text-green-600' }
            ]
            const color = colors[index % colors.length]

            return (
              <div key={zone.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 ${color.bg} rounded-lg flex items-center justify-center`}>
                    <MapPin className={`h-5 w-5 ${color.text}`} />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{zone.name}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{zone.description}</p>
                    {zone.features && zone.features.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {zone.features.map((f: any) => (
                          <Badge key={f.id} variant="outline" className="text-[10px] py-0 h-5 bg-green-50 text-green-700 border-green-200">
                            {f.feature}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">{zone.size}</Badge>
                  <div className="flex items-center space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      onClick={() => handleOpenEditZone(zone)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteZone(zone.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )
          }) || (
            <p className="text-muted-foreground">No zones configured</p>
          )}
        </div>
      </Card>

      {/* Features */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Ecological Treasures</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {biosphere.features?.map((feature) => {
            const iconMap = { Waves, Bird, Fish, TreePine, Sunrise, Droplets }
            const Icon = iconMap[feature.icon as keyof typeof iconMap] || Waves
            return (
              <div key={feature.id} className="p-4 border border-gray-200 rounded-lg flex gap-4">
                <div className="bg-green-50 rounded-full w-10 h-10 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            )
          }) || (
            <p className="text-muted-foreground col-span-2">No features configured</p>
          )}
        </div>
      </Card>

      {/* Objectives */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">UNESCO Recognition</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {biosphere.objectives?.map((objective) => {
            const iconMap = { Award, Target, BookOpen, Users }
            const Icon = iconMap[objective.icon as keyof typeof iconMap] || Award
            return (
              <div key={objective.id} className="p-4 border border-gray-200 rounded-lg text-center">
                <div className="bg-blue-50 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-3">
                  <Icon className="h-5 w-5 text-blue-600" />
                </div>
                <h4 className="font-medium text-foreground mb-1">{objective.title}</h4>
                <p className="text-xs text-muted-foreground">{objective.description}</p>
              </div>
            )
          }) || (
            <p className="text-muted-foreground col-span-4">No objectives configured</p>
          )}
        </div>
      </Card>

      {/* Gallery Management */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Biosphere Gallery</h3>
          <Button variant="outline" size="sm" onClick={() => setIsGallerySheetOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Image
          </Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {biosphere.gallery?.map((image) => (
            <div key={image.id} className="relative group aspect-square rounded-lg overflow-hidden border bg-muted">
              <img 
                src={image.url} 
                alt={image.alt} 
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => handleDeleteGalleryImage(image.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              {image.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1">
                  <p className="text-[10px] text-white truncate px-1">{image.caption}</p>
                </div>
              )}
            </div>
          ))}
          {(!biosphere.gallery || biosphere.gallery.length === 0) && (
            <p className="text-muted-foreground col-span-full py-8 text-center border-2 border-dashed rounded-lg">
              No gallery images added yet.
            </p>
          )}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button variant="outline" className="justify-start h-auto p-4" onClick={() => setIsAddZoneSheetOpen(true)}>
            <Plus className="h-5 w-5 mr-3" />
            <div className="text-left">
              <div className="font-medium">Add New Zone</div>
              <div className="text-sm text-muted-foreground">Create additional biosphere zones</div>
            </div>
          </Button>

          <Button variant="outline" className="justify-start h-auto p-4" asChild>
            <Link href="/admin/biosphere/edit">
              <Edit className="h-5 w-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Update Content</div>
                <div className="text-sm text-muted-foreground">Modify biosphere descriptions and data</div>
              </div>
            </Link>
          </Button>
        </div>
      </Card>

      {/* Add Zone Drawer */}
      <Drawer 
        open={isAddZoneSheetOpen} 
        onOpenChange={(open) => {
          setIsAddZoneSheetOpen(open)
          if (!open) resetZoneForm()
        }}
        direction={isDesktop ? "right" : "bottom"}
      >
        <DrawerContent className={cn(
          isDesktop ? "h-full !max-w-xl ml-auto" : "max-h-[90vh]"
        )}>
          <div className={cn(
            "mx-auto w-full flex flex-col",
            isDesktop ? "h-full" : "max-h-[90vh]"
          )}>
            <DrawerHeader className={cn(
              "border-b",
              isDesktop ? "px-6 py-4 flex flex-row items-center justify-between" : "px-4 py-4"
            )}>
              <div className="flex flex-col gap-1.5">
                <DrawerTitle>Add New Zone</DrawerTitle>
                <DrawerDescription>
                  Create a new zone for the biosphere reserve.
                </DrawerDescription>
              </div>
              {isDesktop && (
                <DrawerClose asChild>
                  <Button variant="ghost" size="icon">
                    <X className="h-4 w-4" />
                  </Button>
                </DrawerClose>
              )}
            </DrawerHeader>

            <div className={cn(
              "flex-1 overflow-y-auto p-6",
              !isDesktop && "px-4"
            )}>
              <form onSubmit={handleAddZone} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="zone_name">Zone Name *</Label>
                  <Input
                    id="zone_name"
                    value={zoneFormData.name}
                    onChange={(e) => setZoneFormData({ ...zoneFormData, name: e.target.value })}
                    placeholder="Enter zone name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zone_type">Zone Type *</Label>
                  <Select 
                    value={zoneFormData.zone_type} 
                    onValueChange={(value) => setZoneFormData({ ...zoneFormData, zone_type: value })}
                  >
                    <SelectTrigger id="zone_type">
                      <SelectValue placeholder="Select zone type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="core">Core Zone</SelectItem>
                      <SelectItem value="buffer">Buffer Zone</SelectItem>
                      <SelectItem value="transition">Transition Zone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zone_size">Size</Label>
                  <Input
                    id="zone_size"
                    value={zoneFormData.size}
                    onChange={(e) => setZoneFormData({ ...zoneFormData, size: e.target.value })}
                    placeholder="e.g., 25,000 hectares"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zone_radius">Radius (km)</Label>
                    <Input
                      id="zone_radius"
                      type="number"
                      step="0.1"
                      value={zoneFormData.radius}
                      onChange={(e) => setZoneFormData({ ...zoneFormData, radius: e.target.value })}
                      placeholder="e.g., 5.5"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zone_coords">Coordinates (lng, lat)</Label>
                    <Input
                      id="zone_coords"
                      value={zoneFormData.coordinates}
                      onChange={(e) => setZoneFormData({ ...zoneFormData, coordinates: e.target.value })}
                      placeholder="-16.52, 13.55"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zone_description">Description *</Label>
                  <Textarea
                    id="zone_description"
                    value={zoneFormData.description}
                    onChange={(e) => setZoneFormData({ ...zoneFormData, description: e.target.value })}
                    placeholder="Enter zone description"
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Key Features</Label>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={handleAddFeature}
                      className="h-8 px-2"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Add Feature
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {zoneFormData.features.map((feature, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={feature}
                          onChange={(e) => handleFeatureChange(index, e.target.value)}
                          placeholder="e.g., Mangrove Forests"
                        />
                        {zoneFormData.features.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveFeature(index)}
                            className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" disabled={saving} className="flex-1">
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Zone
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsAddZoneSheetOpen(false)} disabled={saving}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Edit Zone Drawer */}
      <Drawer 
        open={isEditZoneSheetOpen} 
        onOpenChange={(open) => {
          setIsEditZoneSheetOpen(open)
          if (!open) resetZoneForm()
        }}
        direction={isDesktop ? "right" : "bottom"}
      >
        <DrawerContent className={cn(
          isDesktop ? "h-full !max-w-xl ml-auto" : "max-h-[90vh]"
        )}>
          <div className={cn(
            "mx-auto w-full flex flex-col",
            isDesktop ? "h-full" : "max-h-[90vh]"
          )}>
            <DrawerHeader className={cn(
              "border-b",
              isDesktop ? "px-6 py-4 flex flex-row items-center justify-between" : "px-4 py-4"
            )}>
              <div className="flex flex-col gap-1.5">
                <DrawerTitle>Edit Zone</DrawerTitle>
                <DrawerDescription>
                  Update the details for this biosphere zone.
                </DrawerDescription>
              </div>
              {isDesktop && (
                <DrawerClose asChild>
                  <Button variant="ghost" size="icon">
                    <X className="h-4 w-4" />
                  </Button>
                </DrawerClose>
              )}
            </DrawerHeader>

            <div className={cn(
              "flex-1 overflow-y-auto p-6",
              !isDesktop && "px-4"
            )}>
              <form onSubmit={handleUpdateZone} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="edit_zone_name">Zone Name *</Label>
                  <Input
                    id="edit_zone_name"
                    value={zoneFormData.name}
                    onChange={(e) => setZoneFormData({ ...zoneFormData, name: e.target.value })}
                    placeholder="Enter zone name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit_zone_type">Zone Type *</Label>
                  <Select 
                    value={zoneFormData.zone_type} 
                    onValueChange={(value) => setZoneFormData({ ...zoneFormData, zone_type: value })}
                  >
                    <SelectTrigger id="edit_zone_type">
                      <SelectValue placeholder="Select zone type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="core">Core Zone</SelectItem>
                      <SelectItem value="buffer">Buffer Zone</SelectItem>
                      <SelectItem value="transition">Transition Zone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit_zone_size">Size</Label>
                  <Input
                    id="edit_zone_size"
                    value={zoneFormData.size}
                    onChange={(e) => setZoneFormData({ ...zoneFormData, size: e.target.value })}
                    placeholder="e.g., 25,000 hectares"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit_zone_radius">Radius (km)</Label>
                    <Input
                      id="edit_zone_radius"
                      type="number"
                      step="0.1"
                      value={zoneFormData.radius}
                      onChange={(e) => setZoneFormData({ ...zoneFormData, radius: e.target.value })}
                      placeholder="e.g., 5.5"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_zone_coords">Coordinates (lng, lat)</Label>
                    <Input
                      id="edit_zone_coords"
                      value={zoneFormData.coordinates}
                      onChange={(e) => setZoneFormData({ ...zoneFormData, coordinates: e.target.value })}
                      placeholder="-16.52, 13.55"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit_zone_description">Description *</Label>
                  <Textarea
                    id="edit_zone_description"
                    value={zoneFormData.description}
                    onChange={(e) => setZoneFormData({ ...zoneFormData, description: e.target.value })}
                    placeholder="Enter zone description"
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Key Features</Label>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={handleAddFeature}
                      className="h-8 px-2"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Add Feature
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {zoneFormData.features.map((feature, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={feature}
                          onChange={(e) => handleFeatureChange(index, e.target.value)}
                          placeholder="e.g., Mangrove Forests"
                        />
                        {zoneFormData.features.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveFeature(index)}
                            className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
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
                  <Button type="button" variant="outline" onClick={() => setIsEditZoneSheetOpen(false)} disabled={saving}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Gallery Management Drawer */}
      <Drawer 
        open={isGallerySheetOpen} 
        onOpenChange={setIsGallerySheetOpen}
        direction={isDesktop ? "right" : "bottom"}
      >
        <DrawerContent className={cn(
          isDesktop ? "h-full !max-w-xl ml-auto" : "max-h-[90vh]"
        )}>
          <div className={cn(
            "mx-auto w-full flex flex-col",
            isDesktop ? "h-full" : "max-h-[90vh]"
          )}>
            <DrawerHeader className={cn(
              "border-b",
              isDesktop ? "px-6 py-4 flex flex-row items-center justify-between" : "px-4 py-4"
            )}>
              <div className="flex flex-col gap-1.5">
                <DrawerTitle>Add Gallery Image</DrawerTitle>
                <DrawerDescription>
                  Upload a new image to the biosphere gallery.
                </DrawerDescription>
              </div>
              {isDesktop && (
                <DrawerClose asChild>
                  <Button variant="ghost" size="icon">
                    <X className="h-4 w-4" />
                  </Button>
                </DrawerClose>
              )}
            </DrawerHeader>

            <div className={cn(
              "flex-1 overflow-y-auto p-6",
              !isDesktop && "px-4"
            )}>
              <form onSubmit={handleAddGalleryImage} className="space-y-6">
                <ImageUpload 
                  label="Gallery Image"
                  value={galleryFormData.url}
                  onChange={(url) => setGalleryFormData({ ...galleryFormData, url })}
                  sectionId="biosphere"
                />
                <div className="space-y-2">
                  <Label htmlFor="img_alt">Alt Text *</Label>
                  <Input
                    id="img_alt"
                    value={galleryFormData.alt}
                    onChange={(e) => setGalleryFormData({ ...galleryFormData, alt: e.target.value })}
                    placeholder="Description for accessibility"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="img_caption">Caption</Label>
                  <Input
                    id="img_caption"
                    value={galleryFormData.caption}
                    onChange={(e) => setGalleryFormData({ ...galleryFormData, caption: e.target.value })}
                    placeholder="Image caption"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="img_sort">Sort Order</Label>
                  <Input
                    id="img_sort"
                    type="number"
                    value={galleryFormData.sort_order}
                    onChange={(e) => setGalleryFormData({ ...galleryFormData, sort_order: parseInt(e.target.value) })}
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="submit" disabled={saving} className="flex-1">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                    Add to Gallery
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsGallerySheetOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}