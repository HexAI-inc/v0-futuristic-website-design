import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Create admin client with service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const TABLES = {
  ICCAS: 'iccas'
} as const

// GET /api/iccas - List all ICCAs
export async function GET() {
  try {
    const { data: iccas, error } = await supabase
      .from(TABLES.ICCAS)
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching ICCAs:', error)
      return NextResponse.json(
        { error: 'Failed to fetch ICCAs' },
        { status: 500 }
      )
    }

    return NextResponse.json(iccas || [])
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/iccas - Create a new ICCA (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { data, error } = await supabase
      .from(TABLES.ICCAS)
      .insert({
        name: body.name,
        region: body.region,
        summary: body.summary,
        highlights: body.highlights,
        coordinates: body.coordinates
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating ICCA:', error)
      return NextResponse.json(
        { error: 'Failed to create ICCA' },
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