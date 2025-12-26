"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  Layout,
  MapPin,
  Users,
  Leaf,
  Image,
  Settings,
  LogOut,
  BarChart3,
  Shield,
  Loader2,
  Mail,
  FileText
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useState, useEffect } from "react"
import { getParksCount, getIccasCount, getBiosphereCount, getCommunicationsCount, getResourcesCount } from "@/lib/database"

const getSidebarItems = (counts: { parks: number; iccas: number; biosphere: number; communications: number; resources: number }, loadingCounts: boolean) => [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    description: "Overview and statistics"
  },
  {
    title: "Home Page",
    href: "/admin/home",
    icon: Layout,
    description: "Manage landing page sections"
  },
  {
    title: "Parks",
    href: "/admin/parks",
    icon: MapPin,
    description: "Manage national parks",
    badge: loadingCounts ? <Loader2 className="h-3 w-3 animate-spin" /> : counts.parks.toString()
  },
  {
    title: "ICCA",
    href: "/admin/iccas",
    icon: Users,
    description: "Indigenous Community Areas",
    badge: loadingCounts ? <Loader2 className="h-3 w-3 animate-spin" /> : counts.iccas.toString()
  },
  {
    title: "Biosphere",
    href: "/admin/biosphere",
    icon: Leaf,
    description: "Biosphere reserve content",
    badge: loadingCounts ? <Loader2 className="h-3 w-3 animate-spin" /> : counts.biosphere.toString()
  },
  {
    title: "Resources",
    href: "/admin/resources",
    icon: FileText,
    description: "Manage downloadable resources",
    badge: loadingCounts ? <Loader2 className="h-3 w-3 animate-spin" /> : counts.resources.toString()
  },
  {
    title: "Communications",
    href: "/admin/communications",
    icon: Shield,
    description: "Visitor inquiries & requests",
    badge: loadingCounts ? <Loader2 className="h-3 w-3 animate-spin" /> : counts.communications.toString()
  },
  {
    title: "Media",
    href: "/admin/media",
    icon: Image,
    description: "Image and media library"
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
    description: "Site analytics and reports"
  },
  {
    title: "Email Templates",
    href: "/admin/settings/email-templates",
    icon: Mail,
    description: "Manage email responses"
  },
  {
    title: "Footer Settings",
    href: "/admin/settings/footer",
    icon: MapPin,
    description: "Manage organization info"
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
    description: "System configuration"
  }
]

interface AdminSidebarProps {
  className?: string
}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const pathname = usePathname()
  const { signOut } = useAuth()
  const [counts, setCounts] = useState({
    parks: 0,
    iccas: 0,
    biosphere: 0,
    communications: 0,
    resources: 0
  })
  const [loadingCounts, setLoadingCounts] = useState(true)

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [parksCount, iccasCount, biosphereCount, communicationsCount, resourcesCount] = await Promise.all([
          getParksCount(),
          getIccasCount(),
          getBiosphereCount(),
          getCommunicationsCount(),
          getResourcesCount()
        ])
        setCounts({
          parks: parksCount,
          iccas: iccasCount,
          biosphere: biosphereCount,
          communications: communicationsCount,
          resources: resourcesCount
        })
      } catch (error) {
        console.error('Error fetching counts:', error)
      } finally {
        setLoadingCounts(false)
      }
    }

    fetchCounts()
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className={cn("flex flex-col h-full bg-card border-r border-border", className)}>
      {/* Header */}
      <div className="p-6 border-b border-border bg-card/50">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">NBSAP Admin</h2>
            <p className="text-sm text-muted-foreground">Content Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {getSidebarItems(counts, loadingCounts).map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link key={item.title} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start h-auto p-3",
                  isActive && "bg-primary/10 text-primary border-primary/20"
                )}
              >
                <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{item.title}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                </div>
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border bg-card/50">
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleSignOut}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}