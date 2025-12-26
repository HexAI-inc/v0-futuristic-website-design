"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerDescription,
  DrawerFooter,
  DrawerClose
} from "@/components/ui/drawer"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  Loader2,
  Save,
  X
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from "next/link"
import { useState, useEffect } from "react"
import { AlertModal, ConfirmModal, useModals } from "@/components/ui/modals"
import { IccasSkeleton } from "@/components/admin/skeletons"
import { getIccas, type Icca } from "@/lib/database"

interface IccaFormData {
  name: string
  region: string
  summary: string
  highlights: string[]
}

export default function AdminIccasPage() {
  const [iccas, setIccas] = useState<Icca[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingIcca, setEditingIcca] = useState<Icca | null>(null)
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const { alertModal, confirmModal, showAlert, showConfirm, closeAlert, closeConfirm } = useModals()

  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.matchMedia("(min-width: 768px)").matches)
    checkDesktop()
    window.addEventListener('resize', checkDesktop)
    return () => window.removeEventListener('resize', checkDesktop)
  }, [])

  useEffect(() => {
    const fetchIccas = async () => {
      try {
        const iccasData = await getIccas()
        setIccas(iccasData)
      } catch (error) {
        console.error('Error fetching ICCAs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchIccas()
  }, [])

  const handleDelete = async (iccaId: string, iccaName: string) => {
    const iccaToDelete = iccas.find(icca => icca.id === iccaId)
    if (!iccaToDelete) return

    showConfirm(
      "Delete ICCA",
      `Are you sure you want to delete "${iccaName}"? This action cannot be undone.`,
      async () => {
        try {
          // Optimistically remove from local state
          setIccas(prev => prev.filter(icca => icca.id !== iccaId))

          const response = await fetch(`/api/iccas/${iccaId}`, {
            method: 'DELETE',
          })

          if (!response.ok) {
            // Revert optimistic update on error
            setIccas(prev => [...prev, iccaToDelete])
            const error = await response.json()
            throw new Error(error.error || 'Failed to delete ICCA')
          }

          showAlert("Success", "ICCA deleted successfully.")
        } catch (error) {
          console.error('Error deleting ICCA:', error)
          showAlert("Error", error instanceof Error ? error.message : 'Failed to delete ICCA.', "destructive")
        }
      }
    )
  }

  const handleEdit = (icca: Icca) => {
    setEditingIcca(icca)
    setIsEditSheetOpen(true)
  }

  const handleSaveEdit = async (data: IccaFormData) => {
    if (!editingIcca) {
      console.error('No editing ICCA selected')
      return
    }

    // Validate data
    if (!data.name.trim()) {
      showAlert('Name is required', 'error')
      return
    }
    if (!data.region.trim()) {
      showAlert('Region is required', 'error')
      return
    }
    if (!data.summary.trim()) {
      showAlert('Summary is required', 'error')
      return
    }

    setSaving(true)
    try {
      const updateData = {
        name: data.name.trim(),
        region: data.region.trim(),
        summary: data.summary.trim(),
        highlights: data.highlights.filter(h => h.trim() !== '')
      }

      console.log('Editing ICCA ID:', editingIcca.id)
      console.log('Sending update data:', updateData)

      const response = await fetch(`/api/iccas/${editingIcca.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      console.log('Response status:', response.status)
      console.log('Response status text:', response.statusText)
      console.log('Response ok:', response.ok)

      if (!response.ok) {
        let errorMessage = `Failed to update ICCA (${response.status})`
        try {
          const errorResponse = await response.text()
          console.log('Raw error response:', errorResponse)
          const error = JSON.parse(errorResponse)
          console.log('Parsed error response:', error)
          errorMessage = error.error || error.message || errorMessage
        } catch (parseError) {
          console.log('Failed to parse error response:', parseError)
          errorMessage = response.statusText || `HTTP ${response.status}`
        }
        throw new Error(errorMessage)
      }

      const result = await response.json()
      console.log('Update successful, result:', result)

      // Update the ICCA in the state
      setIccas(iccas.map(icca =>
        icca.id === editingIcca.id
          ? { ...result }
          : icca
      ))

      setIsEditSheetOpen(false)
      setEditingIcca(null)
      showAlert('ICCA updated successfully!', 'success')
    } catch (error) {
      console.error('Error updating ICCA:', error)
      showAlert(error instanceof Error ? error.message : 'Failed to update ICCA', 'error')
    } finally {
      setSaving(false)
    }
  }

  const filteredIccas = iccas.filter(icca =>
    icca.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    icca.region.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <IccasSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">ICCA Management</h1>
          <p className="text-muted-foreground mt-2">Manage Indigenous Community Conserved Areas</p>
        </div>
        <Button asChild>
          <Link href="/admin/iccas/new">
            <Plus className="h-4 w-4 mr-2" />
            Add New ICCA
          </Link>
        </Button>
      </div>

      {/* Search */}
      <Card className="p-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search ICCAs by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </Card>

      {/* ICCAs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIccas.map((icca) => (
          <Card key={icca.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{icca.name}</h3>
                  <p className="text-sm text-muted-foreground">{icca.region}</p>
                </div>
              </div>
              <Badge variant="secondary">
                {icca.highlights?.length || 0} highlights
              </Badge>
            </div>

            <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
              {icca.summary}
            </p>

            <div className="flex justify-between items-center">
              <Badge variant="outline">
                {icca.region}
              </Badge>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(icca)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(icca.id, icca.name)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredIccas.length === 0 && (
        <Card className="p-12">
          <div className="text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No ICCAs found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? "Try adjusting your search terms." : "Get started by adding your first ICCA."}
            </p>
            <Button asChild>
              <Link href="/admin/iccas/new">
                <Plus className="h-4 w-4 mr-2" />
                Add New ICCA
              </Link>
            </Button>
          </div>
        </Card>
      )}

      {/* Edit ICCA Drawer */}
      <Drawer 
        open={isEditSheetOpen} 
        onOpenChange={setIsEditSheetOpen}
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
                <DrawerTitle>Edit ICCA</DrawerTitle>
                <DrawerDescription>
                  Update the details for {editingIcca?.name}.
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
              {editingIcca && (
                <EditIccaForm
                  icca={editingIcca}
                  onSave={handleSaveEdit}
                  onCancel={() => setIsEditSheetOpen(false)}
                  saving={saving}
                />
              )}
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Alert Modal */}
      <AlertModal {...alertModal} onClose={closeAlert} />
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirm}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        description={confirmModal.description}
        confirmText={confirmModal.confirmText}
        cancelText={confirmModal.cancelText}
        variant={confirmModal.variant}
      />
    </div>
  )
}

// Edit ICCA Form Component
function EditIccaForm({
  icca,
  onSave,
  onCancel,
  saving
}: {
  icca: Icca
  onSave: (data: IccaFormData) => void
  onCancel: () => void
  saving: boolean
}) {
  const [formData, setFormData] = useState<IccaFormData>({
    name: icca.name,
    region: icca.region,
    summary: icca.summary,
    highlights: icca.highlights && icca.highlights.length > 0 ? icca.highlights : ['']
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
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
    'Lower River Region',
    'Upper River Region',
    'Banjul'
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
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
        <Select
          value={formData.region}
          onValueChange={(value) => setFormData({ ...formData, region: value })}
          required
        >
          <SelectTrigger id="region" className="w-full">
            <SelectValue placeholder="Select a region" />
          </SelectTrigger>
          <SelectContent>
            {gambianRegions.map((region) => (
              <SelectItem key={region} value={region}>
                {region}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">Summary *</Label>
        <Textarea
          id="summary"
          value={formData.summary}
          onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
          placeholder="Enter a brief summary of the ICCA"
          rows={4}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Highlights</Label>
        {formData.highlights.map((highlight, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={highlight}
              onChange={(e) => handleHighlightChange(index, e.target.value)}
              placeholder={`Highlight ${index + 1}`}
            />
            {formData.highlights.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeHighlight(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addHighlight}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Highlight
        </Button>
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
        <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
      </div>
    </form>
  )
}