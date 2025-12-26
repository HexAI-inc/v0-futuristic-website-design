"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft,
  Loader2,
  Save
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AlertModal, useModals } from "@/components/ui/modals"

interface ParkFormData {
  slug: string
  name: string
  description: string
  size: string
  established: string
  location: string
  coordinates: string
  wildlife: string
  activities: string
  best_time: string
}

export default function NewParkPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const { alertModal, showAlert, closeAlert } = useModals()

  const [formData, setFormData] = useState<ParkFormData>({
    slug: '',
    name: '',
    description: '',
    size: '',
    established: '',
    location: '',
    coordinates: '',
    wildlife: '',
    activities: '',
    best_time: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setSaving(true)

      // Convert string fields to arrays as expected by the database
      const apiData = {
        ...formData,
        wildlife: formData.wildlife ? formData.wildlife.split(',').map(s => s.trim()).filter(s => s) : [],
        activities: formData.activities ? formData.activities.split(',').map(s => s.trim()).filter(s => s) : []
      }

      const response = await fetch('/api/parks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('API Error:', errorData)
        throw new Error(errorData.error || 'Failed to create park')
      }

      showAlert("Success", "Park created successfully!")
      // Redirect to parks list after a short delay
      setTimeout(() => {
        router.push('/admin/parks')
      }, 1500)

    } catch (error) {
      console.error('Error creating park:', error)
      showAlert("Error", `Failed to create park: ${error instanceof Error ? error.message : 'Unknown error'}`, "destructive")
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field: keyof ParkFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))

    // Auto-generate slug from name (always update when name changes)
    if (field === 'name') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
        .trim()
      setFormData(prev => ({ ...prev, slug }))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/parks">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Parks
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Add New Park</h1>
          <p className="text-muted-foreground mt-2">Create a new national park or protected area</p>
        </div>
      </div>

      {/* Form */}
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Park Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter park name"
                required
              />
              {formData.slug && (
                <p className="text-xs text-muted-foreground mt-1">
                  Slug: <code className="bg-muted px-1 py-0.5 rounded text-xs">{formData.slug}</code>
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Enter park description"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="size">Size *</Label>
                <Input
                  id="size"
                  value={formData.size}
                  onChange={(e) => handleChange('size', e.target.value)}
                  placeholder="e.g., 500 km²"
                  required
                />
              </div>

              <div>
                <Label htmlFor="established">Established *</Label>
                <Input
                  id="established"
                  value={formData.established}
                  onChange={(e) => handleChange('established', e.target.value)}
                  placeholder="e.g., 1995"
                  required
                />
              </div>

              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="Enter location"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="coordinates">Coordinates (Optional)</Label>
              <Input
                id="coordinates"
                value={formData.coordinates}
                onChange={(e) => handleChange('coordinates', e.target.value)}
                placeholder="e.g., 13.4549,-15.3101"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Latitude and longitude coordinates for mapping
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="wildlife">Wildlife</Label>
                <Textarea
                  id="wildlife"
                  value={formData.wildlife}
                  onChange={(e) => handleChange('wildlife', e.target.value)}
                  placeholder="List wildlife species separated by commas (e.g., Lions, Elephants, Giraffes)"
                  rows={2}
                />
                <p className="text-xs text-muted-foreground mt-1">Separate multiple species with commas</p>
              </div>

              <div>
                <Label htmlFor="activities">Activities</Label>
                <Textarea
                  id="activities"
                  value={formData.activities}
                  onChange={(e) => handleChange('activities', e.target.value)}
                  placeholder="List available activities separated by commas (e.g., Hiking, Bird watching, Camping)"
                  rows={2}
                />
                <p className="text-xs text-muted-foreground mt-1">Separate multiple activities with commas</p>
              </div>
            </div>

            <div>
              <Label htmlFor="best_time">Best Time to Visit</Label>
              <Input
                id="best_time"
                value={formData.best_time}
                onChange={(e) => handleChange('best_time', e.target.value)}
                placeholder="e.g., December to February"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button type="submit" disabled={saving} className="flex-1">
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Park...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Park
                </>
              )}
            </Button>
            <Button type="button" variant="outline" asChild className="flex-1">
              <Link href="/admin/parks">
                Cancel
              </Link>
            </Button>
          </div>
        </form>
      </Card>

      {/* Success/Error Modal */}
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={closeAlert}
        title={alertModal.title}
        description={alertModal.description}
        variant={alertModal.variant}
      />
    </div>
  )
}