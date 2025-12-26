import { NextRequest, NextResponse } from 'next/server'
import { supabase, TABLES } from '@/lib/supabase'

// GET /api/admin/settings - Get system settings
export async function GET() {
  try {
    // In a real implementation, settings would be stored in a settings table
    // For now, we'll return default/mock settings
    const settings = {
      general: {
        siteName: 'Gambia\'s Biodiversity Outlook',
        siteDescription: 'Discover The Gambia\'s conservation network',
        contactEmail: 'conservation@biodiversity.gm',
        organizationEmail: 'admin@nbsap.gm'
      },
      email: {
        resendApiKey: process.env.RESEND_API_KEY ? 'configured' : 'not_configured',
        emailServiceEnabled: !!process.env.RESEND_API_KEY
      },
      mapbox: {
        accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ? 'configured' : 'not_configured'
      },
      supabase: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'configured' : 'not_configured',
        anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'configured' : 'not_configured'
      }
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/settings - Update system settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    // In a real implementation, this would update a settings table
    // For now, we'll just validate and return success
    const allowedSettings = [
      'siteName', 'siteDescription', 'contactEmail', 'organizationEmail'
    ]

    const updates = {}
    for (const [key, value] of Object.entries(body)) {
      if (allowedSettings.includes(key)) {
        updates[key] = value
      }
    }

    // Mock update - in reality, this would save to database
    console.log('Settings update requested:', updates)

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
      updated: updates
    })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}