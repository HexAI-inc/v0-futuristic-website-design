"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Save, 
  Loader2, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { getFooterSettings, updateFooterSettings, FooterSettings } from "@/lib/database"

export default function FooterSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [footerData, setFooterData] = useState<FooterSettings>({
    org_name: "Gambia Biodiversity Management",
    org_address: "Department of Parks and Wildlife Management, Abuko Nature Reserve, The Gambia",
    org_email: "info@nbsap.gm",
    org_phone: "+220 123 4567",
    org_website: "https://nbsap.gm",
    facebook_url: "https://facebook.com/nbsapgambia",
    twitter_url: "https://twitter.com/nbsapgambia",
    instagram_url: "https://instagram.com/nbsapgambia",
    linkedin_url: "https://linkedin.com/company/nbsapgambia",
    copyright_text: "© {year} NBSAP Gambia. All rights reserved."
  })

  useEffect(() => {
    fetchFooterSettings()
  }, [])

  const fetchFooterSettings = async () => {
    try {
      setLoading(true)
      const data = await getFooterSettings()
      setFooterData(data)
    } catch (error) {
      console.error("Error fetching footer settings:", error)
      toast.error("Failed to load footer settings")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      await updateFooterSettings(footerData)
      toast.success("Footer settings updated successfully")
    } catch (error) {
      toast.error("Failed to update footer settings")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Footer Settings</h1>
        <p className="text-muted-foreground mt-2">Manage organization information and social links displayed in email footers and site-wide.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Organization Info */}
        <Card className="p-6 space-y-4 bg-card border-muted">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="text-primary h-5 w-5" />
            <h3 className="font-bold uppercase text-xs tracking-widest text-muted-foreground">Organization Details</h3>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="org_name">Organization Name</Label>
            <Input 
              id="org_name"
              value={footerData.org_name}
              onChange={(e) => setFooterData({...footerData, org_name: e.target.value})}
              className="bg-background border-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="org_address">Physical Address</Label>
            <Textarea 
              id="org_address"
              value={footerData.org_address}
              onChange={(e) => setFooterData({...footerData, org_address: e.target.value})}
              className="bg-background border-muted resize-none"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="org_email">Contact Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="org_email"
                  value={footerData.org_email}
                  onChange={(e) => setFooterData({...footerData, org_email: e.target.value})}
                  className="pl-10 bg-background border-muted"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="org_phone">Contact Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="org_phone"
                  value={footerData.org_phone}
                  onChange={(e) => setFooterData({...footerData, org_phone: e.target.value})}
                  className="pl-10 bg-background border-muted"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="org_website">Website URL</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                id="org_website"
                value={footerData.org_website}
                onChange={(e) => setFooterData({...footerData, org_website: e.target.value})}
                className="pl-10 bg-background border-muted"
              />
            </div>
          </div>
        </Card>

        {/* Social Media */}
        <Card className="p-6 space-y-4 bg-card border-muted">
          <div className="flex items-center gap-2 mb-2">
            <Share2 className="text-primary h-5 w-5" />
            <h3 className="font-bold uppercase text-xs tracking-widest text-muted-foreground">Social Presence</h3>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fb">Facebook URL</Label>
            <div className="relative">
              <Facebook className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                id="fb"
                value={footerData.facebook_url}
                onChange={(e) => setFooterData({...footerData, facebook_url: e.target.value})}
                className="pl-10 bg-background border-muted"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tw">Twitter / X URL</Label>
            <div className="relative">
              <Twitter className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                id="tw"
                value={footerData.twitter_url}
                onChange={(e) => setFooterData({...footerData, twitter_url: e.target.value})}
                className="pl-10 bg-background border-muted"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ig">Instagram URL</Label>
            <div className="relative">
              <Instagram className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                id="ig"
                value={footerData.instagram_url}
                onChange={(e) => setFooterData({...footerData, instagram_url: e.target.value})}
                className="pl-10 bg-background border-muted"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="li">LinkedIn URL</Label>
            <div className="relative">
              <Linkedin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                id="li"
                value={footerData.linkedin_url}
                onChange={(e) => setFooterData({...footerData, linkedin_url: e.target.value})}
                className="pl-10 bg-background border-muted"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <Label htmlFor="copyright">Copyright Text</Label>
            <Input 
              id="copyright"
              value={footerData.copyright_text}
              onChange={(e) => setFooterData({...footerData, copyright_text: e.target.value})}
              className="bg-background border-muted"
              placeholder="Use {year} for dynamic year"
            />
          </div>
        </Card>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={fetchFooterSettings}>Reset Changes</Button>
        <Button onClick={handleSave} disabled={saving} className="bg-primary text-primary-foreground">
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Save Footer Settings
        </Button>
      </div>
    </div>
  )
}

import { Share2 } from "lucide-react"
