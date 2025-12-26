"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Mail, 
  Edit, 
  Save, 
  ArrowLeft, 
  Loader2, 
  Info,
  Eye as EyeIcon,
  Layout as LayoutIcon
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import Link from "next/link"
import { EmailBuilder } from "@/components/admin/email-builder"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"

interface EmailTemplate {
  id: string
  name: string
  subject: string
  body: string
  description: string
  updated_at: string
}

export default function EmailTemplatesAdmin() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .order('name')

      if (error) throw error
      setTemplates(data || [])
    } catch (error) {
      console.error('Error fetching templates:', error)
      toast.error('Failed to load email templates')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!editingTemplate) return

    setIsSaving(true)
    try {
      const { error } = await supabase
        .from('email_templates')
        .update({
          name: editingTemplate.name,
          subject: editingTemplate.subject,
          body: editingTemplate.body,
          description: editingTemplate.description,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingTemplate.id)

      if (error) throw error
      
      toast.success('Template updated successfully')
      setTemplates(prev => prev.map(t => t.id === editingTemplate.id ? editingTemplate : t))
      setEditingTemplate(null)
    } catch (error) {
      console.error('Error saving template:', error)
      toast.error('Failed to save template')
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading templates...</p>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link href="/admin/settings">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Email Templates</h1>
          </div>
          <p className="text-muted-foreground ml-10">Manage automated email responses and notifications.</p>
        </div>
      </div>

      {editingTemplate ? (
        <EmailBuilder 
          initialHtml={editingTemplate.body}
          templateData={{
            name: editingTemplate.name,
            subject: editingTemplate.subject,
            description: editingTemplate.description || ''
          }}
          onTemplateDataChange={(data) => setEditingTemplate({ ...editingTemplate, ...data })}
          onChange={(html) => setEditingTemplate({ ...editingTemplate, body: html })}
          onSave={handleSave}
          onCancel={() => setEditingTemplate(null)}
          isSaving={isSaving}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {templates.map(template => (
            <Card key={template.id} className="flex flex-col">
              <div className="p-6 flex-1 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setEditingTemplate(template)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <h3 className="font-bold text-lg">{template.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{template.description}</p>
                </div>
                <div className="pt-2 space-y-1">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Subject Line</p>
                  <p className="text-sm italic">"{template.subject}"</p>
                </div>
              </div>
              <div className="px-6 py-4 bg-muted/30 border-t flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Last updated: {new Date(template.updated_at).toLocaleDateString()}
                </span>
                <Button variant="link" size="sm" className="h-auto p-0" onClick={() => setEditingTemplate(template)}>
                  Edit Template
                </Button>
              </div>
            </Card>
          ))}

          <Card className="border-dashed flex flex-col items-center justify-center p-8 text-center space-y-4 bg-muted/10">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <Info className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold">Need more templates?</h3>
              <p className="text-sm text-muted-foreground">New templates must be registered in the system code first.</p>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
