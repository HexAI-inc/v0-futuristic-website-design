import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Create admin client with service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const TABLES = {
  ICCAS: 'iccas',
  ICCA_GALLERY: 'icca_gallery'
} as const

// GET /api/iccas/[id] - Get a specific ICCA with details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Fetch ICCA
    const { data: icca, error: iccaError } = await supabase
      .from(TABLES.ICCAS)
      .select('*')
      .eq('id', id)
      .single()

    if (iccaError) {
      console.error('Error fetching ICCA:', iccaError)
      return NextResponse.json(
        { error: 'ICCA not found' },
        { status: 404 }
      )
    }

    // Fetch gallery
    const { data: gallery, error: galleryError } = await supabase
      .from(TABLES.ICCA_GALLERY)
      .select('*')
      .eq('icca_id', icca.id)
      .order('sort_order')

    if (galleryError) {
      console.error('Error fetching ICCA gallery:', galleryError)
    }

    const iccaWithDetails = {
      ...icca,
      gallery: gallery || []
    }

    return NextResponse.json(iccaWithDetails)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/iccas/[id] - Update an ICCA (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // First check if the ICCA exists
    const { data: existingIcca, error: fetchError } = await supabase
      .from(TABLES.ICCAS)
      .select('id')
      .eq('id', id)
      .single()

    if (fetchError) {
      console.error('ICCA not found:', fetchError)
      return NextResponse.json(
        { error: 'ICCA not found' },
        { status: 404 }
      )
    }

    // Update the ICCA
    const { data, error } = await supabase
      .from(TABLES.ICCAS)
      .update({
        name: body.name,
        region: body.region,
        summary: body.summary,
        highlights: body.highlights
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating ICCA:', error)
      return NextResponse.json(
        { error: 'Failed to update ICCA' },
        { status: 500 }
      )
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

// DELETE /api/iccas/[id] - Delete an ICCA (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { error } = await supabase
      .from(TABLES.ICCAS)
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting ICCA:', error)
      return NextResponse.json(
        { error: 'Failed to delete ICCA' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'ICCA deleted successfully' })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}