import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin as supabase, TABLES } from '@/lib/supabase'

// GET /api/biosphere/gallery - Get all gallery images for the biosphere
export async function GET() {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase admin client not available' }, { status: 500 })
    }

    const { data: biosphere } = await supabase.from(TABLES.BIOSPHERE).select('id').single()
    if (!biosphere) return NextResponse.json({ error: 'Biosphere not found' }, { status: 404 })

    const { data, error } = await supabase
      .from(TABLES.BIOSPHERE_GALLERY)
      .select('*')
      .eq('biosphere_id', biosphere.id)
      .order('sort_order')

    if (error) throw error
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error fetching gallery:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}

// POST /api/biosphere/gallery - Add a new image to the gallery
export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase admin client not available' }, { status: 500 })
    }

    const body = await request.json()
    const { data: biosphere } = await supabase.from(TABLES.BIOSPHERE).select('id').single()
    if (!biosphere) return NextResponse.json({ error: 'Biosphere not found' }, { status: 404 })

    const { data, error } = await supabase
      .from(TABLES.BIOSPHERE_GALLERY)
      .insert({
        biosphere_id: biosphere.id,
        url: body.url,
        alt: body.alt,
        caption: body.caption,
        sort_order: body.sort_order || 0
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    console.error('Error adding gallery image:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
