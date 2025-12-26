"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AnalyticsSkeleton } from "@/components/admin/skeletons"
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  Clock,
  Calendar,
  RefreshCcw
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts"

interface AnalyticsData {
  overview: {
    totalViews: number
    uniqueVisitors: number
    bounceRate: number
    avgSessionDuration: number
    topPages: Array<{ path: string; views: number; percentage: number }>
    trafficSources: Array<{ source: string; visitors: number; percentage: number }>
  }
  trends: {
    viewsLast7Days: number[]
    visitorsLast7Days: number[]
    dates: string[]
  }
  devices: Array<{ name: string; value: number }>
  realtime: {
    activeUsers: number
    currentPageViews: number
  }
}

const COLORS = ['var(--primary)', 'var(--secondary)', 'var(--biosphere)', 'var(--chart-3)']


export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchAnalytics = async () => {
    try {
      setRefreshing(true)
      const response = await fetch('/api/admin/analytics', {
        cache: 'no-store',
        headers: {
          'Pragma': 'no-cache',
          'Cache-Control': 'no-cache'
        }
      })
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  if (loading) {
    return <AnalyticsSkeleton />
  }

  const chartData = data?.trends.dates.map((date, index) => ({
    name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
    views: data.trends.viewsLast7Days[index],
    visitors: data.trends.visitorsLast7Days[index]
  })) || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-2">Site analytics and visitor insights</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchAnalytics}
          disabled={refreshing}
        >
          <RefreshCcw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Eye className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Views</p>
              <p className="text-2xl font-bold text-foreground">{data?.overview.totalViews.toLocaleString()}</p>
              <p className="text-xs text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                Live data
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Unique Visitors</p>
              <p className="text-2xl font-bold text-foreground">{data?.overview.uniqueVisitors.toLocaleString()}</p>
              <p className="text-xs text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                Estimated
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg. Session</p>
              <p className="text-2xl font-bold text-foreground">
                {Math.floor(data?.overview.avgSessionDuration! / 60)}m {data?.overview.avgSessionDuration! % 60}s
              </p>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                Benchmark
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Bounce Rate</p>
              <p className="text-2xl font-bold text-foreground">{(data?.overview.bounceRate! * 100).toFixed(1)}%</p>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
                Benchmark
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">Traffic Overview (Last 7 Days)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                />
                <Tooltip 
                  cursor={{ fill: 'var(--primary)', fillOpacity: 0.05 }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-card border border-border p-3 rounded-lg shadow-lg">
                          <p className="font-medium text-card-foreground mb-2">{label}</p>
                          {payload.map((entry: any, index: number) => (
                            <div key={index} className="flex items-center space-x-2 text-sm">
                              <div 
                                className="w-2 h-2 rounded-full" 
                                style={{ backgroundColor: entry.color }} 
                              />
                              <span className="text-muted-foreground">{entry.name}:</span>
                              <span className="font-semibold text-card-foreground">{entry.value.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar 
                  dataKey="views" 
                  fill="var(--primary)" 
                  radius={[4, 4, 0, 0]} 
                  name="Page Views" 
                  barSize={30}
                />
                <Bar 
                  dataKey="visitors" 
                  fill="var(--primary)" 
                  fillOpacity={0.4}
                  radius={[4, 4, 0, 0]} 
                  name="Visitors" 
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">Device Breakdown</h3>
          <div className="h-[300px] w-full flex items-center justify-center">
            {data?.devices && data.devices.length > 0 ? (
              <>
                <div className="w-1/2 h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data?.devices}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {data?.devices.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-1/2 space-y-4">
                  {data?.devices.map((device, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span className="text-sm font-medium text-foreground">{device.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {((device.value / (data.overview.totalViews || 1)) * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>No device data yet</p>
              </div>
            )}
          </div>
        </Card>


        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Popular Pages</h3>
          <div className="space-y-4">
            {data?.overview.topPages.map((page, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-foreground">{page.path === '/' ? 'Home' : page.path}</h4>
                    <p className="text-xs text-muted-foreground">{page.path}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">{page.views.toLocaleString()} views</p>
                    <p className="text-xs text-muted-foreground">{page.percentage.toFixed(1)}%</p>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-500" 
                    style={{ width: `${page.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Traffic Sources</h3>
          <div className="space-y-4">
            {data?.overview.trafficSources.map((source, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{source.source}</span>
                  <span className="text-sm text-muted-foreground">{source.percentage.toFixed(1)}%</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-secondary rounded-full transition-all duration-500" 
                    style={{ width: `${source.percentage}%` }}
                  />
                </div>
              </div>
            ))}
            {data?.overview.trafficSources.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No traffic source data available yet.
              </div>
            )}
          </div>
        </Card>
      </div>


      {/* Real-time Status */}
      <Card className="p-6 bg-primary/5 border-primary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Real-time Tracking Active</h3>
              <p className="text-sm text-muted-foreground">Currently monitoring visitor activity across the site.</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-background">
            {data?.realtime.activeUsers || 0} Active Users
          </Badge>
        </div>
      </Card>
    </div>
  )
}
