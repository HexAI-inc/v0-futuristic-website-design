"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  Users,
  Leaf,
  Plus,
  Edit,
  Image,
  BarChart3,
  TrendingUp,
  Activity,
  Loader2,
  Shield
} from "lucide-react"
import { DashboardSkeleton } from "@/components/admin/skeletons"
import Link from "next/link"

interface DashboardStats {
  stats: {
    totalParks: number
    totalIccas: number
    totalImages: number
    totalCommunications: number
    recentParks: number
    recentIccas: number
    recentCommunications: number
  }
  recentActivity: {
    parks: Array<{ id: string; name: string; created_at: string }>
    iccas: Array<{ id: string; name: string; created_at: string }>
    communications: Array<{ id: string; name: string; created_at: string }>
  }
}

interface ContentStats {
  overview: {
    totalParks: number
    totalIccas: number
    totalImages: number
    parksWithImages: number
    iccasWithImages: number
    imageCoverage: {
      parks: number
      iccas: number
    }
  }
  contentQuality: {
    parksWithActivities: number
    parksWithWildlife: number
    iccasWithHighlights: number
  }
  recentActivity: Array<{ id: string; name: string; created_at: string }>
}

const adminSections = [
  {
    title: "Communications",
    description: "Manage visitor inquiries and requests",
    icon: Shield,
    href: "/admin/communications",
    color: "text-secondary bg-secondary/10",
    key: "communications"
  },
  {
    title: "Parks Management",
    description: "Manage national parks and protected areas",
    icon: MapPin,
    href: "/admin/parks",
    color: "text-primary bg-primary/10",
    key: "parks"
  },
  {
    title: "ICCA Management",
    description: "Manage Indigenous Community Conserved Areas",
    icon: Users,
    href: "/admin/iccas",
    color: "text-chart-2 bg-chart-2/10",
    key: "iccas"
  },
  {
    title: "Biosphere Reserve",
    description: "Manage biosphere reserve content",
    icon: Leaf,
    href: "/admin/biosphere",
    color: "text-chart-3 bg-chart-3/10",
    key: "biosphere"
  },
  {
    title: "Media Library",
    description: "Upload and manage images",
    icon: Image,
    href: "/admin/media",
    color: "text-chart-4 bg-chart-4/10",
    key: "media"
  }
]

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null)
  const [contentData, setContentData] = useState<ContentStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [dashboardRes, contentRes] = await Promise.all([
          fetch('/api/admin/dashboard'),
          fetch('/api/admin/content')
        ])

        if (!dashboardRes.ok || !contentRes.ok) {
          throw new Error('Failed to fetch dashboard data')
        }

        const [dashboardJson, contentJson] = await Promise.all([
          dashboardRes.json(),
          contentRes.json()
        ])

        setDashboardData(dashboardJson)
        setContentData(contentJson)
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`
    }
  }

  const getSectionStats = (key: string) => {
    if (!dashboardData || !contentData) return { count: 0, trend: "" }

    switch (key) {
      case 'communications':
        return {
          count: dashboardData.stats.totalCommunications,
          trend: `+${dashboardData.stats.recentCommunications} this month`
        }
      case 'parks':
        return {
          count: dashboardData.stats.totalParks,
          trend: `+${dashboardData.stats.recentParks} this month`
        }
      case 'iccas':
        return {
          count: dashboardData.stats.totalIccas,
          trend: `+${dashboardData.stats.recentIccas} this month`
        }
      case 'media':
        return {
          count: dashboardData.stats.totalImages,
          trend: `+${contentData.overview.parksWithImages + contentData.overview.iccasWithImages} this week`
        }
      case 'biosphere':
        return {
          count: 1, // Static for now
          trend: "Updated recently"
        }
      default:
        return { count: 0, trend: "" }
    }
  }

  if (loading) {
    return <DashboardSkeleton />
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome back! Here's an overview of your NBSAP content management system.</p>
        </div>
        <Card className="p-6">
          <div className="text-center">
            <p className="text-red-600 mb-4">Failed to load dashboard data</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  const stats = dashboardData?.stats
  const contentStats = contentData?.overview

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome back! Here's an overview of your NBSAP content management system.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <MapPin className="h-8 w-8 text-primary" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Total Parks</p>
              <p className="text-2xl font-bold text-foreground">{stats?.totalParks || 0}</p>
              <p className="text-xs text-green-600">
                {contentStats ? `${contentStats.imageCoverage.parks}% have images` : ''}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-chart-2" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Total ICCAs</p>
              <p className="text-2xl font-bold text-foreground">{stats?.totalIccas || 0}</p>
              <p className="text-xs text-green-600">
                {contentStats ? `${contentStats.imageCoverage.iccas}% have images` : ''}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <Image className="h-8 w-8 text-chart-3" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Media Files</p>
              <p className="text-2xl font-bold text-foreground">{stats?.totalImages || 0}</p>
              <p className="text-xs text-blue-600">
                {contentStats ? `${contentStats.parksWithImages + contentStats.iccasWithImages} items with images` : ''}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-chart-4" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Content Quality</p>
              <p className="text-2xl font-bold text-foreground">
                {contentStats ? Math.round(((contentStats.parksWithImages + contentStats.iccasWithImages) / (contentStats.totalParks + contentStats.totalIccas)) * 100) : 0}%
              </p>
              <p className="text-xs text-green-600">Overall completion</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Management Sections */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-6">Content Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminSections.map((section) => {
            const Icon = section.icon
            const sectionStats = getSectionStats(section.key)
            return (
              <Card key={section.title} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <Link href={section.href}>
                  <div className="flex flex-col h-full">
                    <div className={`w-12 h-12 rounded-lg ${section.color} flex items-center justify-center mb-4`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{section.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4 flex-grow">{section.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{sectionStats.count} {section.key}</Badge>
                      <span className="text-xs text-muted-foreground">{sectionStats.trend}</span>
                    </div>
                  </div>
                </Link>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
          <Button variant="outline" size="sm">
            <TrendingUp className="h-4 w-4 mr-2" />
            View All
          </Button>
        </div>
        <div className="space-y-4">
          {dashboardData?.recentActivity.parks.slice(0, 3).map((park) => (
            <div key={`park-${park.id}`} className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">New park added: {park.name}</p>
                <p className="text-xs text-muted-foreground">{formatDate(park.created_at)}</p>
              </div>
            </div>
          ))}
          {dashboardData?.recentActivity.iccas.slice(0, 3).map((icca) => (
            <div key={`icca-${icca.id}`} className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-chart-2 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">New ICCA added: {icca.name}</p>
                <p className="text-xs text-muted-foreground">{formatDate(icca.created_at)}</p>
              </div>
            </div>
          ))}
          {(!dashboardData?.recentActivity.parks.length && !dashboardData?.recentActivity.iccas.length) && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No recent activity</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}