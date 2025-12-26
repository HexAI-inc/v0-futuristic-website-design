"use client"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  Upload,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AlertModal, useModals } from "@/components/ui/modals"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface UploadFile extends File {
  preview?: string
  status?: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
  altText: string
}

interface ContentOption {
  id: string
  name: string
  type: 'park' | 'icca'
}

export default function UploadMediaPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFiles, setSelectedFiles] = useState<UploadFile[]>([])
  const [contentType, setContentType] = useState<'parks' | 'iccas' | 'biosphere' | 'home'>('parks')
  const [selectedContent, setSelectedContent] = useState<string>('')
  const [contentOptions, setContentOptions] = useState<ContentOption[]>([])
  const [uploading, setUploading] = useState(false)
  const [loadingContent, setLoadingContent] = useState(false)
  const { alertModal, showAlert, closeAlert } = useModals()

  // Load content options when content type changes
  useEffect(() => {
    if (contentType && contentType !== 'home') {
      loadContentOptions()
    } else if (contentType === 'home') {
      setContentOptions([
        { id: 'hero', name: 'Hero Section', type: 'home' as any },
        { id: 'visual_story', name: 'Visual Story', type: 'home' as any },
        { id: 'featured_areas', name: 'Featured Areas', type: 'home' as any },
        { id: 'general', name: 'General Home Page', type: 'home' as any }
      ])
      setSelectedContent('general')
    }
  }, [contentType])

  const loadContentOptions = async () => {
    setLoadingContent(true)
    try {
      const endpoint = contentType === 'parks' ? '/api/parks' : 
                       contentType === 'iccas' ? '/api/iccas' : 
                       '/api/biosphere'
      
      const response = await fetch(endpoint)
      if (response.ok) {
        const data = await response.json()
        
        // Handle both array (parks/iccas) and single object (biosphere)
        const items = Array.isArray(data) ? data : [data]
        
        const options = items.filter(item => item && item.id).map((item: any) => ({
          id: item.id,
          name: item.name,
          type: (contentType === 'biosphere' || contentType === 'home') 
            ? contentType 
            : contentType.slice(0, -1) as 'park' | 'icca'
        }))
        setContentOptions(options)
        
        // Auto-select if only one option (like biosphere)
        if (options.length === 1) {
          setSelectedContent(options[0].id)
        }
      }
    } catch (error) {
      console.error('Error loading content options:', error)
    } finally {
      setLoadingContent(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const imageFiles = files.filter(file => file.type.startsWith('image/'))

    if (imageFiles.length !== files.length) {
      showAlert('Only image files are allowed', 'error')
    }

    const newFiles: UploadFile[] = imageFiles.map(file => {
      const fileWithPreview = Object.assign(file, {
        preview: URL.createObjectURL(file),
        status: 'pending' as const,
        altText: file.name.split('.')[0].replace(/[-_]/g, ' ') // Default alt text from filename
      })
      return fileWithPreview
    })

    setSelectedFiles(prev => [...prev, ...newFiles])
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => {
      const newFiles = [...prev]
      const removed = newFiles.splice(index, 1)[0]
      if (removed.preview) {
        URL.revokeObjectURL(removed.preview)
      }
      return newFiles
    })
  }

  const updateAltText = (index: number, text: string) => {
    setSelectedFiles(prev => {
      const newFiles = [...prev]
      newFiles[index] = Object.assign(newFiles[index], { altText: text })
      return newFiles
    })
  }

  const handleUpload = async () => {
    if (!selectedContent || selectedFiles.length === 0) {
      showAlert('Please select content and files to upload', 'error')
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      selectedFiles.forEach(file => {
        formData.append('files', file)
        formData.append('altTexts', file.altText)
      })
      formData.append('contentType', 
        contentType === 'biosphere' || contentType === 'home' 
          ? contentType 
          : contentType.slice(0, -1)
      ) // Remove 's' from end for parks/iccas
      formData.append('contentId', selectedContent)

      const response = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        showAlert(`Successfully uploaded ${result.uploaded} of ${selectedFiles.length} images!`, 'success')

        // Clean up previews
        selectedFiles.forEach(file => {
          if (file.preview) {
            URL.revokeObjectURL(file.preview)
          }
        })

        setTimeout(() => {
          router.push('/admin/media')
        }, 2000)
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      showAlert(error instanceof Error ? error.message : 'Upload failed', 'error')
    } finally {
      setUploading(false)
    }
  }

  const handleContentTypeChange = (value: 'parks' | 'iccas' | 'biosphere' | 'home') => {
    setContentType(value)
    setSelectedContent('')
    setContentOptions([])
    if (value !== 'home') {
      loadContentOptions()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/media">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Media Library
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Upload Images</h1>
          <p className="text-muted-foreground mt-2">Add new images to your media library</p>
        </div>
      </div>

      {/* Upload Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Upload Settings */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Upload Settings</h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contentType">Content Type *</Label>
              <Select
                value={contentType}
                onValueChange={(value) => handleContentTypeChange(value as 'parks' | 'iccas' | 'biosphere' | 'home')}
              >
                <SelectTrigger id="contentType">
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="parks">Parks</SelectItem>
                  <SelectItem value="iccas">ICCA</SelectItem>
                  <SelectItem value="biosphere">Biosphere</SelectItem>
                  <SelectItem value="home">Home Page</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contentSelect">
                {contentType === 'home' ? 'Home Page Section' : `Select ${contentType === 'biosphere' ? 'Biosphere' : contentType.slice(0, -1)}`} *
              </Label>
              <Select
                value={selectedContent}
                onValueChange={setSelectedContent}
                disabled={loadingContent || contentOptions.length === 0}
              >
                <SelectTrigger id="contentSelect">
                  <SelectValue placeholder={loadingContent ? 'Loading...' : (contentType === 'home' ? 'Select a section' : `Select a ${contentType === 'biosphere' ? 'Biosphere' : contentType.slice(0, -1)}`)} />
                </SelectTrigger>
                <SelectContent>
                  {contentOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Right Column - File Upload */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Select Images</h3>

          <div className="space-y-4">
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium mb-2">Drop images here or click to browse</h4>
              <p className="text-sm text-muted-foreground">
                Supports JPG, PNG, GIF up to 10MB each
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              Choose Files
            </Button>
          </div>
        </Card>
      </div>

      {/* Selected Files Preview */}
      {selectedFiles.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              Selected Images ({selectedFiles.length})
            </h3>
            <Button
              onClick={handleUpload}
              disabled={uploading || !selectedContent}
              className="min-w-32"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload All
                </>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {selectedFiles.map((file, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeFile(index)}
                  disabled={uploading}
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="mt-2 space-y-2">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <div className="space-y-1">
                    <Label htmlFor={`alt-${index}`} className="text-[10px] uppercase text-muted-foreground">Alt Text</Label>
                    <Input
                      id={`alt-${index}`}
                      value={file.altText}
                      onChange={(e) => updateAltText(index, e.target.value)}
                      placeholder="Describe the image..."
                      className="h-8 text-xs"
                      disabled={uploading}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Alert Modal */}
      <AlertModal {...alertModal} onClose={closeAlert} />
    </div>
  )
}