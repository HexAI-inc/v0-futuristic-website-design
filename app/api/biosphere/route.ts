import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin as supabase, TABLES } from '@/lib/supabase'

// GET /api/biosphere - Get biosphere with all details
export async function GET() {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase admin client not available' }, { status: 500 })
    }

    // Fetch the main biosphere record
    const { data: biosphere, error: biosphereError } = await supabase
      .from(TABLES.BIOSPHERE)
      .select('*')
      .single()

    if (biosphereError) {
      console.error('Error fetching biosphere:', biosphereError)
      
      // If it's just that no record exists, return a 404 with a clear message
      if (biosphereError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'No biosphere record found. Please seed the database.' },
          { status: 404 }
        )
      }

      return NextResponse.json(
        { error: biosphereError.message || 'Biosphere not found' },
        { status: 404 }
      )
    }

    // Fetch zones with their features
    const { data: zones, error: zonesError } = await supabase
      .from(TABLES.BIOSPHERE_ZONES)
      .select('*')
      .eq('biosphere_id', biosphere.id)
      .order('sort_order')

    if (zonesError) {
      console.error('Error fetching biosphere zones:', zonesError)
    }

    // Fetch features for each zone
    const zonesWithFeatures = []
    if (zones) {
      for (const zone of zones) {
        const { data: features, error: featuresError } = await supabase
          .from(TABLES.BIOSPHERE_ZONE_FEATURES)
          .select('*')
          .eq('zone_id', zone.id)
          .order('id')

        if (featuresError) {
          console.error('Error fetching zone features:', featuresError)
        }

        zonesWithFeatures.push({
          ...zone,
          features: features || []
        })
      }
    }

    // Fetch biosphere features (ecological treasures)
    const { data: features, error: featuresError } = await supabase
      .from(TABLES.BIOSPHERE_FEATURES)
      .select('*')
      .eq('biosphere_id', biosphere.id)
      .order('sort_order')

    if (featuresError) {
      console.error('Error fetching biosphere features:', featuresError)
    }

    // Fetch biosphere objectives (UNESCO recognition)
    const { data: objectives, error: objectivesError } = await supabase
      .from(TABLES.BIOSPHERE_OBJECTIVES)
      .select('*')
      .eq('biosphere_id', biosphere.id)
      .order('sort_order')

    if (objectivesError) {
      console.error('Error fetching biosphere objectives:', objectivesError)
    }

    // Fetch biosphere gallery
    const { data: gallery, error: galleryError } = await supabase
      .from(TABLES.BIOSPHERE_GALLERY)
      .select('*')
      .eq('biosphere_id', biosphere.id)
      .order('sort_order')

    if (galleryError) {
      console.error('Error fetching biosphere gallery:', galleryError)
    }

    const biosphereWithDetails = {
      ...biosphere,
      zones: zonesWithFeatures,
      features: features || [],
      objectives: objectives || [],
      gallery: gallery || []
    }

    return NextResponse.json(biosphereWithDetails)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/biosphere - Create a new biosphere (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { data, error } = await supabase
      .from(TABLES.BIOSPHERE)
      .insert({
        name: body.name,
        description: body.description,
        designation_year: body.designation_year,
        total_area_hectares: body.total_area_hectares,
        communities_involved: body.communities_involved,
        unesco_program: body.unesco_program,
        hero_image_url: body.hero_image_url,
        coordinates: body.coordinates,
        zones_title: body.zones_title,
        zones_description: body.zones_description,
        concept_title: body.concept_title,
        concept_description: body.concept_description,
        features_title: body.features_title,
        features_description: body.features_description,
        objectives_title: body.objectives_title,
        objectives_description: body.objectives_description,
        model_title: body.model_title,
        model_text_1: body.model_text_1,
        model_text_2: body.model_text_2,
        model_quote: body.model_quote
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating biosphere:', error)
      return NextResponse.json(
        { error: 'Failed to create biosphere' },
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