"use client"

import { useState, useEffect } from "react"
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
  Image,
  Upload,
  FolderOpen,
  Plus,
  Grid,
  List,
  Search,
  Edit,
  Trash2,
  Loader2,
  Save,
  X,
  Filter,
  Globe
} from "lucide-react"
import { MediaSkeleton } from "@/components/admin/skeletons"
import Link from "next/link"
import { AlertModal, ConfirmModal, useModals } from "@/components/ui/modals"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface MediaItem {
  id: string
  image_url: string
  alt_text: string
  caption: string
  sort_order: number
  created_at: string
  parks?: { name: string; slug: string }
  iccas?: { name: string }
  biosphere?: { name: string }
  type: 'park' | 'icca' | 'biosphere' | 'home'
}

interface MediaStats {
  total: number
  parks: number
  iccas: number
  biosphere: number
  home: number
  recent: number
}

export default function AdminMediaPage() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [stats, setStats] = useState<MediaStats>({ total: 0, parks: 0, iccas: 0, biosphere: 0, home: 0, recent: 0 })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<'all' | 'parks' | 'iccas' | 'biosphere' | 'home'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null)
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const { alertModal, showAlert, closeAlert, confirmModal, showConfirm, closeConfirm } = useModals()

  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.matchMedia("(min-width: 768px)").matches)
    checkDesktop()
    window.addEventListener('resize', checkDesktop)
    return () => window.removeEventListener('resize', checkDesktop)
  }, [])

  const [editFormData, setEditFormData] = useState({
    alt_text: '',
    caption: ''
  })

  useEffect(() => {
    fetchMedia()
  }, [filterType])

  const fetchMedia = async () => {
    try {
      const type = filterType === 'all' ? 'all' : filterType
      const response = await fetch(`/api/admin/media?type=${type}&limit=100`)
      if (response.ok) {
        const data = await response.json()
        setMediaItems(data.images || [])
        setStats({
          total: data.total || 0,
          parks: data.images?.filter((item: MediaItem) => item.type === 'park').length || 0,
          iccas: data.images?.filter((item: MediaItem) => item.type === 'icca').length || 0,
          biosphere: data.images?.filter((item: MediaItem) => item.type === 'biosphere').length || 0,
          home: data.images?.filter((item: MediaItem) => item.type === 'home').length || 0,
          recent: data.images?.filter((item: MediaItem) => {
            const created = new Date(item.created_at)
            const weekAgo = new Date()
            weekAgo.setDate(weekAgo.getDate() - 7)
            return created > weekAgo
          }).length || 0
        })
      }
    } catch (error) {
      console.error('Error fetching media:', error)
      showAlert('Failed to load media library', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (item: MediaItem) => {
    setEditingItem(item)
    setEditFormData({
      alt_text: item.alt_text,
      caption: item.caption
    })
    setIsEditSheetOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!editingItem) return

    setSaving(true)
    try {
      const response = await fetch(`/api/admin/media/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData)
      })

      if (response.ok) {
        showAlert('Media item updated successfully!', 'success')
        setIsEditSheetOpen(false)
        setEditingItem(null)
        fetchMedia()
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update media item')
      }
    } catch (error) {
      console.error('Error updating media:', error)
      showAlert(error instanceof Error ? error.message : 'Failed to update media item', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = (item: MediaItem) => {
    showConfirm(
      'Delete Media Item',
      `Are you sure you want to delete this image? This action cannot be undone.`,
      () => performDelete(item)
    )
  }

  const performDelete = async (item: MediaItem) => {
    try {
      const response = await fetch(`/api/admin/media/${item.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        showAlert('Media item deleted successfully!', 'success')
        fetchMedia()
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete media item')
      }
    } catch (error) {
      console.error('Error deleting media:', error)
      showAlert(error instanceof Error ? error.message : 'Failed to delete media item', 'error')
    }
  }

  const filteredItems = mediaItems.filter(item => {
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch = 
      (item.alt_text?.toLowerCase() || '').includes(searchLower) ||
      (item.caption?.toLowerCase() || '').includes(searchLower) ||
      (item.parks?.name?.toLowerCase() || '').includes(searchLower) ||
      (item.iccas?.name?.toLowerCase() || '').includes(searchLower) ||
      (item.biosphere?.name?.toLowerCase() || '').includes(searchLower)
    return matchesSearch
  })

  if (loading) {
    return <MediaSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Media Library</h1>
          <p className="text-muted-foreground mt-2">Upload and manage images for your content</p>
        </div>
        <Button asChild>
          <Link href="/admin/media/upload">
            <Upload className="h-4 w-4 mr-2" />
            Upload Images
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Image className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total</p>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FolderOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Parks</p>
              <p className="text-2xl font-bold text-foreground">{stats.parks}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Image className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">ICCA</p>
              <p className="text-2xl font-bold text-foreground">{stats.iccas}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
              <Globe className="h-6 w-6 text-teal-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Biosphere</p>
              <p className="text-2xl font-bold text-foreground">{stats.biosphere}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
              <Image className="h-6 w-6 text-pink-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Home</p>
              <p className="text-2xl font-bold text-foreground">{stats.home}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Upload className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Recent</p>
              <p className="text-2xl font-bold text-foreground">+{stats.recent}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search images..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={filterType}
                onValueChange={(value) => setFilterType(value as 'all' | 'parks' | 'iccas' | 'biosphere' | 'home')}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Images</SelectItem>
                  <SelectItem value="parks">Parks Only</SelectItem>
                  <SelectItem value="iccas">ICCA Only</SelectItem>
                  <SelectItem value="biosphere">Biosphere Only</SelectItem>
                  <SelectItem value="home">Home Page Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Media Grid/List */}
      <Card className="p-6">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <Image className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {searchTerm ? 'No images found' : 'No images uploaded yet'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'Try adjusting your search terms.' : 'Upload your first images to get started'}
            </p>
            <Button asChild>
              <Link href="/admin/media/upload">
                <Plus className="h-4 w-4 mr-2" />
                Upload Images
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                {filterType === 'all' ? 'All Images' : `${filterType.charAt(0).toUpperCase() + filterType.slice(1)} Images`}
                ({filteredItems.length})
              </h3>
            </div>

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {filteredItems.map((item) => (
                  <div key={item.id} className="group relative">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={item.image_url}
                        alt={item.alt_text}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-0 group-hover:backdrop-blur-sm transition-all duration-300 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <Button size="sm" variant="secondary" onClick={() => handleEdit(item)} className="shadow-lg">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(item)} className="shadow-lg">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2">
                      <Badge 
                        variant={item.type === 'park' ? 'default' : item.type === 'icca' ? 'secondary' : 'outline'} 
                        className="text-xs"
                      >
                        {item.type === 'park' ? 'Park' : item.type === 'icca' ? 'ICCA' : 'Biosphere'}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {item.parks?.name || item.iccas?.name || item.biosphere?.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image_url}
                        alt={item.alt_text}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={item.type === 'park' ? 'default' : item.type === 'icca' ? 'secondary' : 'outline'}>
                          {item.type === 'park' ? 'Park' : item.type === 'icca' ? 'ICCA' : 'Biosphere'}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {item.parks?.name || item.iccas?.name || item.biosphere?.name}
                        </span>
                      </div>
                      <p className="text-sm font-medium truncate">{item.alt_text}</p>
                      {item.caption && (
                        <p className="text-sm text-muted-foreground truncate">{item.caption}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(item)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </Card>

      {/* Edit Media Drawer */}
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
                <DrawerTitle>Edit Media Item</DrawerTitle>
                <DrawerDescription>
                  Update the details for this media asset.
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
              {editingItem && (
                <div className="space-y-6">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={editingItem.image_url}
                      alt={editingItem.alt_text}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="alt_text">Alt Text *</Label>
                    <Input
                      id="alt_text"
                      value={editFormData.alt_text}
                      onChange={(e) => setEditFormData({ ...editFormData, alt_text: e.target.value })}
                      placeholder="Describe the image for accessibility"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="caption">Caption</Label>
                    <Textarea
                      id="caption"
                      value={editFormData.caption}
                      onChange={(e) => setEditFormData({ ...editFormData, caption: e.target.value })}
                      placeholder="Optional caption for the image"
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button onClick={handleSaveEdit} disabled={saving} className="flex-1">
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
                    <Button variant="outline" onClick={() => setIsEditSheetOpen(false)} disabled={saving}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Modals */}
      <AlertModal {...alertModal} onClose={closeAlert} />
      <ConfirmModal {...confirmModal} onClose={closeConfirm} />
    </div>
  )
}