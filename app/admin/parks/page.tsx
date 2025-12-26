"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  MapPin,
  Search,
  Plus,
  Edit,
  Trash2,
  Loader2,
  Save,
  X
} from "lucide-react"
import Link from "next/link"
import { ParksSkeleton } from "@/components/admin/skeletons"
import { getParks, type ParkWithDetails } from "@/lib/database"
import { AlertModal, ConfirmModal, useModals } from "@/components/ui/modals"

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

export default function AdminParksPage() {
  const [parks, setParks] = useState<ParkWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingPark, setEditingPark] = useState<ParkWithDetails | null>(null)
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  const { alertModal, confirmModal, showAlert, showConfirm, closeAlert, closeConfirm } = useModals()

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.matchMedia("(min-width: 768px)").matches)
    checkDesktop()
    window.addEventListener('resize', checkDesktop)
    return () => window.removeEventListener('resize', checkDesktop)
  }, [])

  useEffect(() => {
    fetchParks()
  }, [])

  const fetchParks = async () => {
    try {
      setLoading(true)
      const parksData = await getParks()
      setParks(parksData)
    } catch (error) {
      console.error('Error fetching parks:', error)
      showAlert("Error", "Failed to load parks. Please try again.", "destructive")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (parkSlug: string) => {
    const parkToDelete = parks.find(p => p.slug === parkSlug)
    if (!parkToDelete) return

    showConfirm(
      "Delete Park",
      `Are you sure you want to delete "${parkToDelete.name}"? This action cannot be undone.`,
      async () => {
        try {
          // Optimistically remove from local state
          setParks(prev => prev.filter(p => p.slug !== parkSlug))

          const response = await fetch(`/api/parks/${parkSlug}`, {
            method: 'DELETE',
          })

          if (!response.ok) {
            // Revert optimistic update on error
            setParks(prev => [...prev, parkToDelete])
            throw new Error('Failed to delete park')
          }

          showAlert("Success", "Park deleted successfully.")
        } catch (error) {
          console.error('Error deleting park:', error)
          showAlert("Error", "Failed to delete park. Please try again.", "destructive")
        }
      },
      "Delete",
      "Cancel",
      "destructive"
    )
  }

  const handleEdit = (park: ParkWithDetails) => {
    setEditingPark(park)
    setIsEditSheetOpen(true)
  }

  const handleSaveEdit = async (formData: ParkFormData) => {
    if (!editingPark) return

    try {
      setSaving(true)

      // Convert string fields to arrays as expected by the database
      const apiData = {
        ...formData,
        wildlife: formData.wildlife ? formData.wildlife.split(',').map(s => s.trim()).filter(s => s) : [],
        activities: formData.activities ? formData.activities.split(',').map(s => s.trim()).filter(s => s) : []
      }

      // Optimistically update local state
      const updatedPark = { ...editingPark, ...apiData }
      setParks(prev => prev.map(p => p.slug === editingPark.slug ? updatedPark : p))

      const response = await fetch(`/api/parks/${editingPark.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      })

      if (!response.ok) {
        // Revert optimistic update on error
        setParks(prev => prev.map(p => p.slug === editingPark.slug ? editingPark : p))
        const errorData = await response.json()
        console.error('API Error:', errorData)
        throw new Error(errorData.error || 'Failed to update park')
      }

      // Update with actual response data if needed
      const responseData = await response.json()
      setParks(prev => prev.map(p => p.slug === editingPark.slug ? { ...p, ...responseData } : p))

      setIsEditSheetOpen(false)
      setEditingPark(null)
      showAlert("Success", "Park updated successfully.")
    } catch (error) {
      console.error('Error updating park:', error)
      showAlert("Error", `Failed to update park: ${error instanceof Error ? error.message : 'Unknown error'}`, "destructive")
    } finally {
      setSaving(false)
    }
  }

  const filteredParks = parks.filter(park =>
    park.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    park.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <ParksSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Parks Management</h1>
          <p className="text-muted-foreground mt-2">Manage national parks and protected areas</p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/admin/parks/new">
            <Plus className="h-4 w-4 mr-2" />
            Add New Park
          </Link>
        </Button>
      </div>

      {/* Search */}
      <Card className="p-4 sm:p-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search parks by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Parks Table - Responsive */}
      <Card className="overflow-hidden">
        {/* Mobile View */}
        <div className="block md:hidden">
          <div className="divide-y">
            {filteredParks.map((park) => (
              <div key={park.id} className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{park.name}</h3>
                    <p className="text-sm text-muted-foreground">{park.slug}</p>
                  </div>
                  <Badge variant="secondary" className="ml-2">
                    {park.gallery.length} images
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{park.location}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Size:</span>
                    <span className="ml-1 font-medium">{park.size}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Established:</span>
                    <span className="ml-1 font-medium">{park.established}</span>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(park)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(park.slug)}
                    className="flex-1"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Park</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Established</TableHead>
                <TableHead>Images</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredParks.map((park) => (
                <TableRow key={park.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{park.name}</p>
                      <p className="text-sm text-muted-foreground">{park.slug}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{park.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>{park.size}</TableCell>
                  <TableCell>{park.established}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {park.gallery.length} images
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(park)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(park.slug)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredParks.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No parks found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? "Try adjusting your search terms." : "Get started by adding your first park."}
            </p>
            <Button asChild>
              <Link href="/admin/parks/new">
                <Plus className="h-4 w-4 mr-2" />
                Add New Park
              </Link>
            </Button>
          </div>
        )}
      </Card>

      {/* Edit Park Drawer */}
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
                <DrawerTitle>Edit Park</DrawerTitle>
                <DrawerDescription>
                  Update the details for {editingPark?.name}.
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
              {editingPark && (
                <EditParkForm
                  park={editingPark}
                  onSave={handleSaveEdit}
                  onCancel={() => setIsEditSheetOpen(false)}
                  saving={saving}
                />
              )}
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Custom Modals */}
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={closeAlert}
        title={alertModal.title}
        description={alertModal.description}
        variant={alertModal.variant}
      />
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

// Edit Park Form Component
function EditParkForm({
  park,
  onSave,
  onCancel,
  saving
}: {
  park: ParkWithDetails
  onSave: (data: ParkFormData) => void
  onCancel: () => void
  saving: boolean
}) {
  const [formData, setFormData] = useState<ParkFormData>({
    slug: park.slug,
    name: park.name,
    description: park.description,
    size: park.size,
    established: park.established,
    location: park.location,
    coordinates: park.coordinates || '',
    wildlife: Array.isArray(park.wildlife) ? park.wildlife.join(', ') : park.wildlife || '',
    activities: Array.isArray(park.activities) ? park.activities.join(', ') : park.activities || '',
    best_time: park.best_time || ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleChange = (field: keyof ParkFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => handleChange('slug', e.target.value)}
            placeholder="park-slug"
            readOnly
          />
          <p className="text-xs text-muted-foreground mt-1">Slug cannot be changed as it's used as the identifier</p>
        </div>

        <div>
          <Label htmlFor="name">Park Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter park name"
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Enter park description"
            rows={3}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="size">Size</Label>
            <Input
              id="size"
              value={formData.size}
              onChange={(e) => handleChange('size', e.target.value)}
              placeholder="e.g., 500 km²"
              required
            />
          </div>

          <div>
            <Label htmlFor="established">Established</Label>
            <Input
              id="established"
              value={formData.established}
              onChange={(e) => handleChange('established', e.target.value)}
              placeholder="e.g., 1995"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="Enter location"
            required
          />
        </div>

        <div>
          <Label htmlFor="coordinates">Coordinates (Optional)</Label>
          <Input
            id="coordinates"
            value={formData.coordinates}
            onChange={(e) => handleChange('coordinates', e.target.value)}
            placeholder="e.g., 13.4549,-15.3101"
          />
        </div>

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
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>
    </form>
  )
}