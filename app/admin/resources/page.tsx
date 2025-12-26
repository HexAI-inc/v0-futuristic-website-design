"use client"

import { useState, useEffect } from "react"
import { 
  Plus, 
  Search, 
  FileText, 
  Download, 
  Trash2, 
  Edit, 
  ExternalLink,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Filter,
  MoreVertical,
  ShieldCheck,
  Leaf,
  Clock,
  Ticket,
  MapPin,
  AlertTriangle,
  Recycle,
  Heart,
  BarChart,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Resource, ResourceAttachment } from "@/lib/database"
import { FileUpload } from "@/components/admin/file-upload"
import { ResourcesSkeleton } from "@/components/admin/skeletons"

const CATEGORIES = [
  { id: 'all', label: 'All Resources' },
  { id: 'conservation-guide', label: 'Conservation Guides' },
  { id: 'visit-information', label: 'Visit Information' },
  { id: 'research-data', label: 'Research & Data' },
]

const ICONS = [
  { id: 'ShieldCheck', icon: ShieldCheck },
  { id: 'Leaf', icon: Leaf },
  { id: 'Clock', icon: Clock },
  { id: 'Ticket', icon: Ticket },
  { id: 'MapPin', icon: MapPin },
  { id: 'AlertTriangle', icon: AlertTriangle },
  { id: 'Recycle', icon: Recycle },
  { id: 'Heart', icon: Heart },
  { id: 'BarChart', icon: BarChart },
  { id: 'FileText', icon: FileText },
]

export default function ResourcesAdminPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [editingResource, setEditingResource] = useState<Partial<Resource> | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)")
    setIsDesktop(mql.matches)
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mql.addEventListener("change", handler)
    return () => mql.removeEventListener("change", handler)
  }, [])

  useEffect(() => {
    fetchResources()
  }, [])

  const fetchResources = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/resources')
      if (!response.ok) throw new Error('Failed to fetch resources')
      const data = await response.json()
      setResources(data)
    } catch (error) {
      console.error('Error:', error)
      toast.error("Failed to load resources")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!editingResource?.title || !editingResource?.category) {
      toast.error("Title and Category are required")
      return
    }

    setIsSaving(true)
    try {
      const method = editingResource.id ? 'PUT' : 'POST'
      const url = editingResource.id ? `/api/resources/${editingResource.id}` : '/api/resources'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingResource)
      })

      if (!response.ok) throw new Error('Failed to save resource')
      
      toast.success(editingResource.id ? "Resource updated" : "Resource created")
      setIsDrawerOpen(false)
      setEditingResource(null)
      fetchResources()
    } catch (error) {
      console.error('Error:', error)
      toast.error("Failed to save resource")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resource?")) return

    try {
      const response = await fetch(`/api/resources/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete resource')
      
      toast.success("Resource deleted")
      fetchResources()
    } catch (error) {
      console.error('Error:', error)
      toast.error("Failed to delete resource")
    }
  }

  const filteredResources = resources.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         r.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab = activeTab === 'all' || r.category === activeTab
    return matchesSearch && matchesTab
  })

  const getIcon = (iconName: string) => {
    const iconObj = ICONS.find(i => i.id === iconName)
    const IconComponent = iconObj ? iconObj.icon : FileText
    return <IconComponent className="h-5 w-5" />
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resources Management</h1>
          <p className="text-muted-foreground">
            Manage downloadable guides, visit information, and research data.
          </p>
        </div>
        <Button onClick={() => {
          setEditingResource({ category: 'conservation-guide', sort_order: 0 })
          setIsDrawerOpen(true)
        }}>
          <Plus className="mr-2 h-4 w-4" /> Add Resource
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList>
            {CATEGORIES.map(cat => (
              <TabsTrigger key={cat.id} value={cat.id}>{cat.label}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {loading ? (
        <ResourcesSkeleton />
      ) : filteredResources.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-20">
            <FileText className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
            <p className="text-xl font-medium text-muted-foreground">No resources found</p>
            <p className="text-sm text-muted-foreground mb-6">Try adjusting your search or filters</p>
            <Button variant="outline" onClick={() => {
              setSearchQuery("")
              setActiveTab("all")
            }}>Clear Filters</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <Card key={resource.id} className="overflow-hidden flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    {getIcon(resource.icon || 'FileText')}
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {resource.category.replace('-', ' ')}
                  </Badge>
                </div>
                <CardTitle className="mt-4 line-clamp-1">{resource.title}</CardTitle>
                <CardDescription className="line-clamp-2 min-h-[40px]">
                  {resource.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-3 flex-grow">
                {resource.file_url && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-2 rounded-md">
                    <Download className="h-4 w-4" />
                    <span className="truncate">{resource.file_url.split('/').pop()}</span>
                    {resource.file_size && <span className="ml-auto text-xs">({resource.file_size})</span>}
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-3 border-t bg-muted/20 flex justify-between">
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => {
                      setEditingResource(resource)
                      setIsDrawerOpen(true)
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(resource.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {resource.file_url && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={resource.file_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-3 w-3" /> View
                    </a>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Drawer 
        open={isDrawerOpen} 
        onOpenChange={setIsDrawerOpen}
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
                <DrawerTitle>{editingResource?.id ? 'Edit Resource' : 'Add New Resource'}</DrawerTitle>
                <DrawerDescription>
                  Fill in the details for the resource. These will be displayed on the public resources page.
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
              <div className="grid gap-6">
                <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title" 
                    value={editingResource?.title || ""} 
                    onChange={(e) => setEditingResource(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Annual Biodiversity Report"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={editingResource?.category} 
                    onValueChange={(value: any) => setEditingResource(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={editingResource?.description || ""} 
                  onChange={(e) => setEditingResource(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief summary of the resource..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="icon">Icon</Label>
                  <Select 
                    value={editingResource?.icon} 
                    onValueChange={(value) => setEditingResource(prev => ({ ...prev, icon: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select icon" />
                    </SelectTrigger>
                    <SelectContent>
                      {ICONS.map(icon => (
                        <SelectItem key={icon.id} value={icon.id}>
                          <div className="flex items-center gap-2">
                            <icon.icon className="h-4 w-4" />
                            <span>{icon.id}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sort_order">Sort Order</Label>
                  <Input 
                    id="sort_order" 
                    type="number"
                    value={editingResource?.sort_order || 0} 
                    onChange={(e) => setEditingResource(prev => ({ ...prev, sort_order: parseInt(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>File Attachment (PDF, Document, etc.)</Label>
                <FileUpload 
                  value={editingResource?.file_url || ""} 
                  onChange={(url, info) => {
                    setEditingResource(prev => ({ 
                      ...prev, 
                      file_url: url,
                      file_type: info?.type || prev?.file_type,
                      file_size: info?.size || prev?.file_size
                    }))
                  }}
                  onRemove={() => setEditingResource(prev => ({ ...prev, file_url: "", file_type: "", file_size: "" }))}
                  bucket="biodiversity_bucket"
                  folder="resources"
                  accept=".pdf,.doc,.docx,.txt,.zip"
                />
                <p className="text-xs text-muted-foreground">
                  Upload the resource file. This will be used for the download link.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="file_type">File Type Label</Label>
                  <Input 
                    id="file_type" 
                    value={editingResource?.file_type || ""} 
                    onChange={(e) => setEditingResource(prev => ({ ...prev, file_type: e.target.value }))}
                    placeholder="e.g. PDF Report, Research Paper"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file_size">File Size</Label>
                  <Input 
                    id="file_size" 
                    value={editingResource?.file_size || ""} 
                    onChange={(e) => setEditingResource(prev => ({ ...prev, file_size: e.target.value }))}
                    placeholder="e.g. 2.4 MB"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Detailed Content (Optional)</Label>
                <Textarea 
                  id="content" 
                  value={editingResource?.content || ""} 
                  onChange={(e) => setEditingResource(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Long form content or additional details..."
                  rows={5}
                />
              </div>

              <div className="space-y-4 border-t pt-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Additional Attachments</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const currentAttachments = editingResource?.attachments || []
                      setEditingResource(prev => ({
                        ...prev,
                        attachments: [...currentAttachments, { 
                          id: Math.random().toString(36).substring(7),
                          file_name: '',
                          file_url: '',
                          sort_order: currentAttachments.length
                        } as any]
                      }))
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Attachment
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {editingResource?.attachments?.map((attachment, index) => (
                    <div key={attachment.id} className="p-4 border rounded-lg bg-muted/20 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Attachment #{index + 1}</span>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon"
                          className="text-destructive"
                          onClick={() => {
                            setEditingResource(prev => ({
                              ...prev,
                              attachments: prev?.attachments?.filter(a => a.id !== attachment.id)
                            }))
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>File Name</Label>
                          <Input 
                            value={attachment.file_name}
                            onChange={(e) => {
                              const newAttachments = [...(editingResource?.attachments || [])]
                              newAttachments[index].file_name = e.target.value
                              setEditingResource(prev => ({ ...prev, attachments: newAttachments }))
                            }}
                            placeholder="e.g. Technical Appendix"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Sort Order</Label>
                          <Input 
                            type="number"
                            value={attachment.sort_order}
                            onChange={(e) => {
                              const newAttachments = [...(editingResource?.attachments || [])]
                              newAttachments[index].sort_order = parseInt(e.target.value)
                              setEditingResource(prev => ({ ...prev, attachments: newAttachments }))
                            }}
                          />
                        </div>
                      </div>

                      <FileUpload 
                        value={attachment.file_url}
                        onChange={(url, info) => {
                          const newAttachments = [...(editingResource?.attachments || [])]
                          newAttachments[index].file_url = url
                          if (!newAttachments[index].file_name) {
                            newAttachments[index].file_name = info?.name || ''
                          }
                          newAttachments[index].file_type = info?.type
                          newAttachments[index].file_size = info?.size
                          setEditingResource(prev => ({ ...prev, attachments: newAttachments }))
                        }}
                        onRemove={() => {
                          const newAttachments = [...(editingResource?.attachments || [])]
                          newAttachments[index].file_url = ''
                          setEditingResource(prev => ({ ...prev, attachments: newAttachments }))
                        }}
                        folder="attachments"
                      />
                    </div>
                  ))}
                  {(!editingResource?.attachments || editingResource.attachments.length === 0) && (
                    <p className="text-sm text-muted-foreground italic text-center py-4">
                      No additional attachments added.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <DrawerFooter className={cn(
            "border-t p-6",
            !isDesktop && "px-4"
          )}>
            <div className="flex gap-3 justify-end w-full">
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingResource?.id ? 'Update Resource' : 'Create Resource'}
              </Button>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
      </Drawer>
    </div>
  )
}
