import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin as supabase, TABLES } from '@/lib/supabase'

// GET /api/biosphere/zones/[id] - Get a specific zone with features
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase admin client not available' }, { status: 500 })
    }

    const { id } = await params

    // Fetch zone
    const { data: zone, error: zoneError } = await supabase
      .from(TABLES.BIOSPHERE_ZONES)
      .select('*')
      .eq('id', id)
      .single()

    if (zoneError) {
      console.error('Error fetching zone:', zoneError)
      return NextResponse.json(
        { error: zoneError.message || 'Zone not found' },
        { status: 404 }
      )
    }

    // Fetch features
    const { data: features, error: featuresError } = await supabase
      .from(TABLES.BIOSPHERE_ZONE_FEATURES)
      .select('*')
      .eq('zone_id', id)
      .order('id')

    if (featuresError) {
      console.error('Error fetching zone features:', featuresError)
    }

    const zoneWithFeatures = {
      ...zone,
      features: features || []
    }

    return NextResponse.json(zoneWithFeatures)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/biosphere/zones/[id] - Update a zone
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // First check if the zone exists
    const { data: existingZone, error: fetchError } = await supabase
      .from(TABLES.BIOSPHERE_ZONES)
      .select('id')
      .eq('id', id)
      .single()

    if (fetchError) {
      console.error('Zone not found:', fetchError)
      return NextResponse.json(
        { error: 'Zone not found' },
        { status: 404 }
      )
    }

    const { data, error } = await supabase
      .from(TABLES.BIOSPHERE_ZONES)
      .update({
        name: body.name,
        size: body.size,
        description: body.description,
        zone_type: body.zone_type,
        radius: body.radius,
        coordinates: body.coordinates,
        sort_order: body.sort_order
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating zone:', error)
      return NextResponse.json(
        { error: 'Failed to update zone' },
        { status: 500 }
      )
    }

    // Update features if provided
    if (body.features && Array.isArray(body.features)) {
      // Delete existing features
      const { error: deleteError } = await supabase
        .from(TABLES.BIOSPHERE_ZONE_FEATURES)
        .delete()
        .eq('zone_id', id)

      if (deleteError) {
        console.error('Error deleting old features:', deleteError)
      } else if (body.features.length > 0) {
        // Insert new features
        const featuresToInsert = body.features.map((feature: string) => ({
          zone_id: id,
          feature: feature
        }))

        const { error: insertError } = await supabase
          .from(TABLES.BIOSPHERE_ZONE_FEATURES)
          .insert(featuresToInsert)

        if (insertError) {
          console.error('Error inserting new features:', insertError)
        }
      }
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/biosphere/zones/[id] - Delete a zone
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { error } = await supabase
      .from(TABLES.BIOSPHERE_ZONES)
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting zone:', error)
      return NextResponse.json(
        { error: 'Failed to delete zone' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Zone deleted successfully' })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}