import { NextResponse } from 'next/server'
import { supabase, TABLES } from '@/lib/supabase'

// GET /api/admin/dashboard - Get dashboard statistics and overview data
export async function GET() {
  try {
    // Get total counts
    const [parksResult, iccasResult, parkGalleryResult, iccaGalleryResult, communicationsResult] = await Promise.all([
      supabase.from(TABLES.PARKS).select('id', { count: 'exact', head: true }),
      supabase.from(TABLES.ICCAS).select('id', { count: 'exact', head: true }),
      supabase.from(TABLES.PARK_GALLERY).select('id', { count: 'exact', head: true }),
      supabase.from(TABLES.ICCA_GALLERY).select('id', { count: 'exact', head: true }),
      supabase.from('communications').select('id', { count: 'exact', head: true })
    ])

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const [recentParks, recentIccas, recentCommunications] = await Promise.all([
      supabase
        .from(TABLES.PARKS)
        .select('id, name, created_at')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false }),
      supabase
        .from(TABLES.ICCAS)
        .select('id, name, created_at')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false }),
      supabase
        .from('communications')
        .select('id, name, created_at')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false })
    ])

    const dashboardData = {
      stats: {
        totalParks: parksResult.count || 0,
        totalIccas: iccasResult.count || 0,
        totalImages: (parkGalleryResult.count || 0) + (iccaGalleryResult.count || 0),
        totalCommunications: communicationsResult.count || 0,
        recentParks: recentParks.data?.length || 0,
        recentIccas: recentIccas.data?.length || 0,
        recentCommunications: recentCommunications.data?.length || 0
      },
      recentActivity: {
        parks: recentParks.data || [],
        iccas: recentIccas.data || [],
        communications: recentCommunications.data || []
      }
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}