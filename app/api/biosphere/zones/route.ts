import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin as supabase, TABLES } from '@/lib/supabase'

// GET /api/biosphere/zones - Get all zones for a biosphere
export async function GET(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase admin client not available' }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const biosphereId = searchParams.get('biosphere_id')

    if (!biosphereId) {
      return NextResponse.json(
        { error: 'biosphere_id parameter is required' },
        { status: 400 }
      )
    }

    const { data: zones, error } = await supabase
      .from(TABLES.BIOSPHERE_ZONES)
      .select('*')
      .eq('biosphere_id', biosphereId)
      .order('sort_order')

    if (error) {
      console.error('Error fetching biosphere zones:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to fetch zones' },
        { status: 500 }
      )
    }

    return NextResponse.json(zones || [])
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/biosphere/zones - Create a new biosphere zone
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.biosphere_id || !body.name || !body.zone_type) {
      return NextResponse.json(
        { error: 'biosphere_id, name, and zone_type are required' },
        { status: 400 }
      )
    }

    // Get the highest sort_order for this biosphere
    const { data: existingZones, error: sortError } = await supabase
      .from(TABLES.BIOSPHERE_ZONES)
      .select('sort_order')
      .eq('biosphere_id', body.biosphere_id)
      .order('sort_order', { ascending: false })
      .limit(1)

    if (sortError) {
      console.error('Error getting sort order:', sortError)
    }

    const nextSortOrder = existingZones && existingZones.length > 0
      ? existingZones[0].sort_order + 1
      : 1

    const { data, error } = await supabase
      .from(TABLES.BIOSPHERE_ZONES)
      .insert({
        biosphere_id: body.biosphere_id,
        name: body.name,
        size: body.size || '',
        description: body.description || '',
        zone_type: body.zone_type,
        radius: body.radius,
        coordinates: body.coordinates,
        sort_order: nextSortOrder
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating biosphere zone:', error)
      return NextResponse.json(
        { error: 'Failed to create zone' },
        { status: 500 }
      )
    }

    // Insert features if provided
    if (body.features && Array.isArray(body.features) && body.features.length > 0) {
      const featuresToInsert = body.features.map((feature: string) => ({
        zone_id: data.id,
        feature: feature
      }))

      const { error: featuresError } = await supabase
        .from(TABLES.BIOSPHERE_ZONE_FEATURES)
        .insert(featuresToInsert)

      if (featuresError) {
        console.error('Error creating zone features:', featuresError)
      }
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}