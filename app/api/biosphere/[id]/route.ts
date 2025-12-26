import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin as supabase, TABLES } from '@/lib/supabase'

// GET /api/biosphere/[id] - Get a specific biosphere with details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase admin client not available' }, { status: 500 })
    }

    const { id } = await params

    // Fetch the main biosphere record
    const { data: biosphere, error: biosphereError } = await supabase
      .from(TABLES.BIOSPHERE)
      .select('*')
      .eq('id', id)
      .single()

    if (biosphereError) {
      console.error('Error fetching biosphere:', biosphereError)
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

    const biosphereWithDetails = {
      ...biosphere,
      zones: zonesWithFeatures,
      features: features || [],
      objectives: objectives || []
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

// PUT /api/biosphere/[id] - Update a biosphere (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // First check if the biosphere exists
    const { data: existingBiosphere, error: fetchError } = await supabase
      .from(TABLES.BIOSPHERE)
      .select('id')
      .eq('id', id)
      .single()

    if (fetchError) {
      console.error('Biosphere not found:', fetchError)
      return NextResponse.json(
        { error: 'Biosphere not found' },
        { status: 404 }
      )
    }

    // Update the biosphere
    const { data, error } = await supabase
      .from(TABLES.BIOSPHERE)
      .update({
        name: body.name,
        description: body.description,
        designation_year: body.designation_year,
        total_area_hectares: body.total_area_hectares,
        communities_involved: body.communities_involved,
        unesco_program: body.unesco_program,
        hero_image_url: body.hero_image_url,
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
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating biosphere:', error)
      return NextResponse.json(
        { error: 'Failed to update biosphere' },
        { status: 500 }
      )
    }

    // Update features if provided
    if (body.features && Array.isArray(body.features)) {
      // Delete existing features
      const { error: deleteError } = await supabase
        .from(TABLES.BIOSPHERE_FEATURES)
        .delete()
        .eq('biosphere_id', id)

      if (deleteError) {
        console.error('Error deleting old biosphere features:', deleteError)
      } else if (body.features.length > 0) {
        // Insert new features
        const featuresToInsert = body.features.map((feature: any) => ({
          biosphere_id: id,
          icon: feature.icon,
          title: feature.title,
          description: feature.description,
          sort_order: feature.sort_order || 0
        }))

        const { error: insertError } = await supabase
          .from(TABLES.BIOSPHERE_FEATURES)
          .insert(featuresToInsert)

        if (insertError) {
          console.error('Error inserting new biosphere features:', insertError)
        }
      }
    }

    // Update objectives if provided
    if (body.objectives && Array.isArray(body.objectives)) {
      // Delete existing objectives
      const { error: deleteError } = await supabase
        .from(TABLES.BIOSPHERE_OBJECTIVES)
        .delete()
        .eq('biosphere_id', id)

      if (deleteError) {
        console.error('Error deleting old biosphere objectives:', deleteError)
      } else if (body.objectives.length > 0) {
        // Insert new objectives
        const objectivesToInsert = body.objectives.map((objective: any) => ({
          biosphere_id: id,
          icon: objective.icon,
          title: objective.title,
          description: objective.description,
          sort_order: objective.sort_order || 0
        }))

        const { error: insertError } = await supabase
          .from(TABLES.BIOSPHERE_OBJECTIVES)
          .insert(objectivesToInsert)

        if (insertError) {
          console.error('Error inserting new biosphere objectives:', insertError)
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

// DELETE /api/biosphere/[id] - Delete a biosphere (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { error } = await supabase
      .from(TABLES.BIOSPHERE)
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting biosphere:', error)
      return NextResponse.json(
        { error: 'Failed to delete biosphere' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Biosphere deleted successfully' })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}