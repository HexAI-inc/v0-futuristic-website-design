import { NextRequest, NextResponse } from 'next/server'
import { supabase, TABLES } from '@/lib/supabase'

// GET /api/admin/content/stats - Get comprehensive content statistics
export async function GET() {
  try {
    // Get detailed statistics for admin overview
    const [
      parksStats,
      iccasStats,
      parkGalleryStats,
      iccaGalleryStats,
      recentContent
    ] = await Promise.all([
      // Parks statistics
      supabase
        .from(TABLES.PARKS)
        .select('id, created_at, wildlife, activities')
        .order('created_at', { ascending: false }),

      // ICCAs statistics
      supabase
        .from(TABLES.ICCAS)
        .select('id, created_at, region, highlights')
        .order('created_at', { ascending: false }),

      // Gallery statistics
      supabase.from(TABLES.PARK_GALLERY).select('id, park_id'),
      supabase.from(TABLES.ICCA_GALLERY).select('id, icca_id'),

      // Recent content (last 7 days)
      supabase
        .from(TABLES.PARKS)
        .select('id, name, created_at')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(5)
    ])

    // Calculate statistics
    const parks = parksStats.data || []
    const iccas = iccasStats.data || []
    const parkImages = parkGalleryStats.data || []
    const iccaImages = iccaGalleryStats.data || []

    // Content health metrics
    const parksWithImages = new Set(parkImages.map(img => img.park_id)).size
    const iccasWithImages = new Set(iccaImages.map(img => img.icca_id)).size

    const stats = {
      overview: {
        totalParks: parks.length,
        totalIccas: iccas.length,
        totalImages: parkImages.length + iccaImages.length,
        parksWithImages,
        iccasWithImages,
        imageCoverage: {
          parks: parks.length > 0 ? Math.round((parksWithImages / parks.length) * 100) : 0,
          iccas: iccas.length > 0 ? Math.round((iccasWithImages / iccas.length) * 100) : 0
        }
      },
      contentQuality: {
        parksWithActivities: parks.filter(p => p.activities && p.activities.length > 0).length,
        parksWithWildlife: parks.filter(p => p.wildlife && p.wildlife.length > 0).length,
        iccasWithHighlights: iccas.filter(i => i.highlights && i.highlights.length > 0).length
      },
      recentActivity: recentContent.data || [],
      regions: {
        parks: [...new Set(parks.map(p => p.location).filter(Boolean))],
        iccas: [...new Set(iccas.map(i => i.region).filter(Boolean))]
      }
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching content stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch content statistics' },
      { status: 500 }
    )
  }
}