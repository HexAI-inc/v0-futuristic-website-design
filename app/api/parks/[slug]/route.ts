import { NextRequest, NextResponse } from 'next/server'
import { supabase, TABLES } from '@/lib/supabase'

// GET /api/parks/[slug] - Get a specific park with details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const resolvedParams = await params
  const slug = resolvedParams.slug

  try {
    // Fetch park
    const { data: park, error: parkError } = await supabase
      .from(TABLES.PARKS)
      .select('*')
      .eq('slug', slug)
      .single()

    if (parkError) {
      console.error('Error fetching park:', parkError)
      return NextResponse.json(
        { error: 'Park not found' },
        { status: 404 }
      )
    }

    // Fetch features
    const { data: features, error: featuresError } = await supabase
      .from(TABLES.PARK_FEATURES)
      .select('*')
      .eq('park_id', (park as any).id)
      .order('id')

    if (featuresError) {
      console.error('Error fetching park features:', featuresError)
    }

    // Fetch gallery
    const { data: gallery, error: galleryError } = await supabase
      .from(TABLES.PARK_GALLERY)
      .select('*')
      .eq('park_id', (park as any).id)
      .order('sort_order')

    if (galleryError) {
      console.error('Error fetching park gallery:', galleryError)
    }

    const parkWithDetails = {
      ...(park as any),
      features: features || [],
      gallery: gallery || []
    }

    return NextResponse.json(parkWithDetails)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/parks/[slug] - Update a park (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const resolvedParams = await params
  console.log('🚀 PUT /api/parks/[slug] called with slug:', resolvedParams.slug)

  try {

    const slug = resolvedParams.slug

    const body = await request.json()
    console.log('Request body keys:', Object.keys(body))

    // Ensure wildlife and activities are arrays
    const updateData: any = {
      name: body.name,
      description: body.description,
      size: body.size,
      established: body.established,
      location: body.location,
      coordinates: body.coordinates,
      best_time: body.best_time
    }

    // Only include wildlife and activities if they are provided and are arrays
    if (body.wildlife && Array.isArray(body.wildlife)) {
      updateData.wildlife = body.wildlife
    }
    if (body.activities && Array.isArray(body.activities)) {
      updateData.activities = body.activities
    }

    console.log('Update park request:', { slug, body })

    // First check if the park exists
    const { data: existingPark, error: fetchError } = await supabase
      .from(TABLES.PARKS)
      .select('id')
      .eq('slug', slug)
      .single()

    if (fetchError || !existingPark) {
      console.error('Park not found:', fetchError)
      return NextResponse.json(
        { error: 'Park not found' },
        { status: 404 }
      )
    }

    // Update the park
    const { data, error } = await (supabase as any)
      .from(TABLES.PARKS)
      .update(updateData)
      .eq('slug', slug)
      .select()

    if (error) {
      console.error('Supabase error updating park:', error)
      return NextResponse.json(
        { error: `Database error: ${error.message}`, details: error },
        { status: 500 }
      )
    }

    // Check if any rows were updated
    if (!data || data.length === 0) {
      // If no rows were returned, the update might have succeeded but select didn't work
      // Let's fetch the park again to return the current data
      const { data: currentPark, error: fetchError } = await supabase
        .from(TABLES.PARKS)
        .select('*')
        .eq('slug', slug)
        .single()

      if (fetchError || !currentPark) {
        console.error('Failed to fetch updated park:', fetchError)
        return NextResponse.json(
          { error: 'Update completed but failed to retrieve updated data' },
          { status: 500 }
        )
      }

      return NextResponse.json(currentPark)
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/parks/[slug] - Delete a park (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const resolvedParams = await params
  const slug = resolvedParams.slug

  try {
    const { error } = await supabase
      .from(TABLES.PARKS)
      .delete()
      .eq('slug', slug)

    if (error) {
      console.error('Error deleting park:', error)
      return NextResponse.json(
        { error: 'Failed to delete park' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Park deleted successfully' })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}