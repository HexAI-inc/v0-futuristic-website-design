import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/admin/health - System health check
export async function GET() {
  try {
    const health = {
      timestamp: new Date().toISOString(),
      status: 'healthy',
      services: {} as any,
      database: {} as any,
      storage: {} as any
    }

    // Check Supabase connection
    try {
      const { data, error } = await supabase
        .from('parks')
        .select('count', { count: 'exact', head: true })

      health.database = {
        status: error ? 'error' : 'healthy',
        parks_count: data?.length || 0,
        error: error?.message
      }
    } catch (dbError) {
      health.database = {
        status: 'error',
        error: dbError instanceof Error ? dbError.message : 'Unknown error'
      }
    }

    // Check storage
    try {
      const { data, error } = await supabase.storage
        .from('media')
        .list('', { limit: 1 })

      health.storage = {
        status: error ? 'error' : 'healthy',
        accessible: !error,
        error: error?.message
      }
    } catch (storageError) {
      health.storage = {
        status: 'error',
        error: storageError instanceof Error ? storageError.message : 'Unknown error'
      }
    }

    // Check external services
    health.services = {
      resend: {
        status: process.env.RESEND_API_KEY ? 'configured' : 'not_configured'
      },
      mapbox: {
        status: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ? 'configured' : 'not_configured'
      },
      supabase: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'configured' : 'not_configured',
        anon_key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'configured' : 'not_configured'
      }
    }

    // Overall status
    const hasErrors = Object.values(health.database).includes('error') ||
                     Object.values(health.storage).includes('error')

    health.status = hasErrors ? 'degraded' : 'healthy'

    return NextResponse.json(health)
  } catch (error) {
    console.error('Health check error:', error)
    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}