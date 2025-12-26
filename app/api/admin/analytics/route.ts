import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/admin/analytics - Get site analytics data
export async function GET() {
  try {
    // 1. Get total views
    const { count: totalViews, error: viewsError } = await supabase
      .from('page_views')
      .select('*', { count: 'exact', head: true })

    if (viewsError) throw viewsError

    // 1b. Get unique visitors
    const { data: uniqueCount, error: uniqueCountError } = await supabase
      .rpc('get_total_unique_visitors')

    // 2. Get top pages
    const { data: topPagesData, error: topPagesError } = await supabase
      .rpc('get_top_pages')

    // 3. Get views last 7 days
    const { data: trendsData, error: trendsError } = await supabase
      .rpc('get_views_by_day')

    // 4. Get active users
    const { data: activeUsers, error: activeError } = await supabase
      .rpc('get_active_users_count')

    // 5. Get device breakdown
    const { data: deviceData, error: deviceError } = await supabase
      .rpc('get_device_breakdown')

    // 6. Get top referrers
    const { data: referrerData, error: referrerError } = await supabase
      .rpc('get_top_referrers')

    // Mock data for parts not yet implemented in DB
    const analyticsData = {
      overview: {
        totalViews: totalViews || 0,
        uniqueVisitors: uniqueCount || 0,
        bounceRate: 0.32,
        avgSessionDuration: 185,
        topPages: topPagesData || [],
        trafficSources: referrerData?.map((r: any) => ({
          source: r.referrer,
          visitors: parseInt(r.count),
          percentage: (parseInt(r.count) / (totalViews || 1)) * 100
        })) || []
      },
      trends: {
        viewsLast7Days: trendsData?.map((d: any) => d.view_count) || [0, 0, 0, 0, 0, 0, 0],
        visitorsLast7Days: trendsData?.map((d: any) => d.unique_visitors) || [0, 0, 0, 0, 0, 0, 0],
        dates: trendsData?.map((d: any) => d.day) || []
      },
      devices: deviceData?.map((d: any) => ({
        name: d.device_type,
        value: parseInt(d.count)
      })) || [],
      realtime: {
        activeUsers: activeUsers || 0,
        currentPageViews: 0
      }
    }

    return NextResponse.json(analyticsData)
  } catch (error) {
    console.error('Error fetching analytics data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}
