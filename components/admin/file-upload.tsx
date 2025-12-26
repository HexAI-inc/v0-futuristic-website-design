"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { 
  Upload, 
  X, 
  FileText, 
  Loader2, 
  CheckCircle,
  AlertCircle,
  File as FileIcon,
  Download
} from "lucide-react"
import { toast } from "sonner"

interface FileUploadProps {
  value: string
  onChange: (url: string, fileInfo?: { name: string, size: string, type: string }) => void
  onRemove: () => void
  label?: string
  bucket?: string
  folder?: string
  accept?: string
  className?: string
}

export function FileUpload({ 
  value, 
  onChange, 
  onRemove,
  label, 
  bucket = "biodiversity_bucket",
  folder = "resources",
  accept = ".pdf,.doc,.docx,.txt,.zip",
  className = "" 
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (file: File) => {
    if (!file) return

    try {
      setUploading(true)
      
      const formData = new FormData()
      formData.append('files', file)
      formData.append('contentType', 'resources')
      formData.append('contentId', folder)

      const response = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        if (data.files && data.files.length > 0) {
          const fileData = data.files[0]
          onChange(fileData.image_url, {
            name: fileData.file_name,
            size: fileData.file_size,
            type: fileData.file_type
          })
          toast.success("File uploaded successfully")
        }
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to upload file")
      }
    } catch (error) {
      console.error("Upload error:", error)
      toast.error(error instanceof Error ? error.message : "Failed to upload file")
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0])
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0])
    }
  }

  const getFileIcon = (url: string) => {
    if (url.toLowerCase().endsWith('.pdf')) return <FileText className="h-10 w-10 text-red-500" />
    return <FileIcon className="h-10 w-10 text-blue-500" />
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <Label>{label}</Label>}
      
      {value ? (
        <div className="relative border rounded-lg p-4 bg-muted/30 flex items-center gap-4">
          <div className="p-2 bg-background rounded-md border">
            {getFileIcon(value)}
          </div>
          <div className="flex-grow min-w-0">
            <p className="text-sm font-medium truncate">{value.split('/').pop()}</p>
            <div className="flex items-center gap-2 mt-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span className="text-xs text-muted-foreground">Uploaded</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              asChild
            >
              <a href={value} target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4" />
              </a>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onRemove}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-lg p-8 transition-all cursor-pointer
            flex flex-col items-center justify-center gap-2
            ${dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"}
            ${uploading ? "opacity-50 pointer-events-none" : ""}
          `}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={accept}
            className="hidden"
          />
          
          {uploading ? (
            <>
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-sm font-medium">Uploading file...</p>
            </>
          ) : (
            <>
              <div className="p-3 bg-primary/10 rounded-full text-primary">
                <Upload className="h-6 w-6" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">Click or drag file to upload</p>
                <p className="text-xs text-muted-foreground mt-1">
                  PDF, DOC, TXT, or ZIP (max 10MB)
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
