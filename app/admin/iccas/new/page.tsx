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

interface IccaFormData {
  name: string
  region: string
  summary: string
  highlights: string[]
}

export default function NewIccaPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const { alertModal, showAlert, closeAlert } = useModals()

  const [formData, setFormData] = useState<IccaFormData>({
    name: '',
    region: '',
    summary: '',
    highlights: ['']
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.region.trim() || !formData.summary.trim()) {
      showAlert('Please fill in all required fields', 'error')
      return
    }

    setSaving(true)

    try {
      const response = await fetch('/api/iccas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          region: formData.region.trim(),
          summary: formData.summary.trim(),
          highlights: formData.highlights.filter(h => h.trim() !== '')
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create ICCA')
      }

      showAlert('ICCA created successfully!', 'success')
      setTimeout(() => {
        router.push('/admin/iccas')
      }, 1500)

    } catch (error) {
      console.error('Error creating ICCA:', error)
      showAlert(error instanceof Error ? error.message : 'Failed to create ICCA', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleHighlightChange = (index: number, value: string) => {
    const newHighlights = [...formData.highlights]
    newHighlights[index] = value
    setFormData({ ...formData, highlights: newHighlights })
  }

  const addHighlight = () => {
    setFormData({
      ...formData,
      highlights: [...formData.highlights, '']
    })
  }

  const removeHighlight = (index: number) => {
    if (formData.highlights.length > 1) {
      const newHighlights = formData.highlights.filter((_, i) => i !== index)
      setFormData({ ...formData, highlights: newHighlights })
    }
  }

  const gambianRegions = [
    'West Coast Region',
    'North Bank Region',
    'Central River Region',
    'Upper River Region',
    'Lower River Region'
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/iccas">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to ICCAs
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Add New ICCA</h1>
          <p className="text-muted-foreground mt-2">Create a new Indigenous Community Conserved Area</p>
        </div>
      </div>

      {/* Form */}
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Basic Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">ICCA Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter ICCA name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="region">Region *</Label>
                <select
                  id="region"
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a region</option>
                  {gambianRegions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary">Summary *</Label>
              <Textarea
                id="summary"
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                placeholder="Brief description of the ICCA and its conservation efforts"
                rows={4}
                required
              />
            </div>
          </div>

          {/* Highlights */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Key Highlights</h2>
              <Button type="button" variant="outline" size="sm" onClick={addHighlight}>
                Add Highlight
              </Button>
            </div>

            <div className="space-y-3">
              {formData.highlights.map((highlight, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={highlight}
                    onChange={(e) => handleHighlightChange(index, e.target.value)}
                    placeholder={`Highlight ${index + 1}`}
                    className="flex-1"
                  />
                  {formData.highlights.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeHighlight(index)}
                      className="px-3"
                    >
                      ×
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button type="button" variant="outline" asChild>
              <Link href="/admin/iccas">Cancel</Link>
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create ICCA
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>

      {/* Alert Modal */}
      {alertModal}
    </div>
  )
}