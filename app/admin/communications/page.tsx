"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Mail, 
  Phone, 
  Calendar, 
  Heart, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  Archive,
  Search,
  Filter,
  Loader2,
  ExternalLink,
  Trash2,
  Reply,
  Send
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { format } from "date-fns"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import { CommunicationsSkeleton } from "@/components/admin/skeletons"

const EMAIL_TEMPLATES = [
  { id: 'support_followup', name: 'Support Follow-up' },
  { id: 'visit_planning', name: 'Visit Planning Guide' },
  { id: 'general_response', name: 'General Response' },
]

interface Communication {
  id: string
  type: 'contact' | 'support' | 'visit'
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  target_id?: string
  target_type?: 'icca' | 'park' | 'biosphere'
  target_name?: string
  status: 'pending' | 'processed' | 'archived'
  metadata?: any
  created_at: string
}

export default function CommunicationsAdmin() {
  const [communications, setCommunications] = useState<Communication[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")
  const [search, setSearch] = useState("")
  const [replyingTo, setReplyingTo] = useState<Communication | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [isSendingReply, setIsSendingReply] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.matchMedia("(min-width: 768px)").matches)
    checkDesktop()
    window.addEventListener('resize', checkDesktop)
    return () => window.removeEventListener('resize', checkDesktop)
  }, [])

  useEffect(() => {
    fetchCommunications()
  }, [])

  const handleReply = async () => {
    if (!replyingTo || !selectedTemplate) return

    setIsSendingReply(true)
    try {
      const response = await fetch('/api/admin/communications/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          communicationId: replyingTo.id,
          templateId: selectedTemplate,
          customMessage: {
            target_name: replyingTo.target_name,
            subject: replyingTo.subject || 'your inquiry'
          }
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to send reply')
      }

      toast.success('Reply sent successfully')
      setReplyingTo(null)
      setSelectedTemplate("")
      fetchCommunications() // Refresh to show updated status
    } catch (error) {
      console.error('Error sending reply:', error)
      toast.error('Failed to send reply')
    } finally {
      setIsSendingReply(false)
    }
  }

  const fetchCommunications = async () => {
    setLoading(true)
    try {
      const { data, error } = await (supabase
        .from('communications' as any) as any)
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setCommunications(data || [])
    } catch (error) {
      console.error('Error fetching communications:', error)
      toast.error('Failed to load communications')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: Communication['status']) => {
    try {
      const { error } = await (supabase
        .from('communications' as any) as any)
        .update({ status })
        .eq('id', id)

      if (error) throw error
      
      setCommunications(prev => 
        prev.map(c => c.id === id ? { ...c, status } : c)
      )
      toast.success(`Status updated to ${status}`)
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const deleteCommunication = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return

    try {
      const { error } = await (supabase
        .from('communications' as any) as any)
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setCommunications(prev => prev.filter(c => c.id !== id))
      toast.success('Record deleted')
    } catch (error) {
      toast.error('Failed to delete record')
    }
  }

  const filteredCommunications = communications.filter(c => {
    const matchesFilter = filter === "all" || c.type === filter || c.status === filter
    const matchesSearch = 
      c.name.toLowerCase().includes(search.toLowerCase()) || 
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.message.toLowerCase().includes(search.toLowerCase()) ||
      (c.target_name?.toLowerCase().includes(search.toLowerCase()))
    
    return matchesFilter && matchesSearch
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'support': return <Heart className="h-4 w-4 text-red-500" />
      case 'visit': return <Calendar className="h-4 w-4 text-blue-500" />
      default: return <MessageSquare className="h-4 w-4 text-green-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'processed': return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Processed</Badge>
      case 'archived': return <Badge variant="outline">Archived</Badge>
      default: return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Pending</Badge>
    }
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Communications</h1>
          <p className="text-muted-foreground">Manage visitor inquiries, support requests, and visit plans.</p>
        </div>
        <Button onClick={fetchCommunications} variant="outline" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Clock className="h-4 w-4 mr-2" />}
          Refresh
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name, email, or message..." 
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Records</SelectItem>
            <SelectItem value="contact">General Inquiries</SelectItem>
            <SelectItem value="support">Support Requests</SelectItem>
            <SelectItem value="visit">Visit Plans</SelectItem>
            <SelectItem value="pending">Pending Only</SelectItem>
            <SelectItem value="processed">Processed Only</SelectItem>
            <SelectItem value="archived">Archived Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <CommunicationsSkeleton />
      ) : filteredCommunications.length === 0 ? (
        <Card className="p-20 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
              <Mail className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>
          <h3 className="text-xl font-semibold">No communications found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters.</p>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredCommunications.map((comm) => (
            <Card key={comm.id} className="overflow-hidden border-l-4 border-l-primary">
              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(comm.type)}
                      <span className="font-bold text-lg capitalize">{comm.type} Request</span>
                      {getStatusBadge(comm.status)}
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      {format(new Date(comm.created_at), 'PPP p')}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {comm.status === 'pending' && (
                      <>
                        <Button size="sm" variant="outline" className="text-primary" onClick={() => setReplyingTo(comm)}>
                          <Reply className="h-4 w-4 mr-2" />
                          Reply
                        </Button>
                        <Button size="sm" variant="outline" className="text-green-600" onClick={() => updateStatus(comm.id, 'processed')}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark Processed
                        </Button>
                      </>
                    )}
                    {comm.status !== 'archived' && (
                      <Button size="sm" variant="ghost" onClick={() => updateStatus(comm.id, 'archived')}>
                        <Archive className="h-4 w-4 mr-2" />
                        Archive
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteCommunication(comm.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Visitor Info</h4>
                      <div className="space-y-2">
                        <p className="font-medium">{comm.name}</p>
                        <a href={`mailto:${comm.email}`} className="text-sm text-primary flex items-center gap-2 hover:underline">
                          <Mail className="h-3 w-3" />
                          {comm.email}
                        </a>
                        {comm.phone && (
                          <p className="text-sm flex items-center gap-2">
                            <Phone className="h-3 w-3" />
                            {comm.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    {comm.target_name && (
                      <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Target Resource</h4>
                        <div className="p-3 rounded-lg bg-muted/50 border">
                          <p className="font-medium text-sm">{comm.target_name}</p>
                          <p className="text-xs text-muted-foreground capitalize">{comm.target_type}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Message</h4>
                    <div className="p-4 rounded-xl bg-muted/30 border italic text-sm leading-relaxed whitespace-pre-wrap">
                      "{comm.message}"
                    </div>
                    
                    {comm.metadata && Object.keys(comm.metadata).length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Additional Data</h4>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(comm.metadata).map(([key, value]) => (
                            <Badge key={key} variant="secondary" className="text-[10px]">
                              {key}: {String(value)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Drawer 
        open={!!replyingTo} 
        onOpenChange={(open) => !open && setReplyingTo(null)}
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
                <DrawerTitle>Reply to {replyingTo?.name}</DrawerTitle>
                <DrawerDescription>
                  Select an email template to send a response to {replyingTo?.email}.
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
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Select Template</Label>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a template..." />
                    </SelectTrigger>
                    <SelectContent>
                      {EMAIL_TEMPLATES.map(t => (
                        <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedTemplate && (
                  <div className="p-4 rounded-lg bg-muted/50 border text-sm space-y-2">
                    <p className="font-semibold text-primary">Preview:</p>
                    <p className="text-muted-foreground italic">
                      {selectedTemplate === 'support_followup' && "Thank you for your interest in supporting... Are you available for a brief call..."}
                      {selectedTemplate === 'visit_planning' && "We are excited that you are planning to visit... Attached you will find our visitor guide..."}
                      {selectedTemplate === 'general_response' && "Thank you for your inquiry... one of our team members will be in touch shortly..."}
                    </p>
                  </div>
                )}
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
                <Button 
                  onClick={handleReply} 
                  disabled={!selectedTemplate || isSendingReply}
                >
                  {isSendingReply ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Reply
                    </>
                  )}
                </Button>
              </div>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
