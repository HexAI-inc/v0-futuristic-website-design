import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin as supabase, TABLES } from '@/lib/supabase'

// GET /api/parks - List all parks
export async function GET() {
  try {
    const { data: parks, error } = await supabase
      .from(TABLES.PARKS)
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching parks:', error)
      return NextResponse.json(
        { error: 'Failed to fetch parks' },
        { status: 500 }
      )
    }

    return NextResponse.json(parks || [])
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/parks - Create a new park (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { data, error } = await supabase
      .from(TABLES.PARKS)
      .insert({
        slug: body.slug,
        name: body.name,
        description: body.description,
        size: body.size,
        established: body.established,
        location: body.location,
        coordinates: body.coordinates,
        wildlife: body.wildlife,
        activities: body.activities,
        best_time: body.best_time
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating park:', error)
      return NextResponse.json(
        { error: 'Failed to create park' },
        { status: 500 }
      )
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