import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin as supabase, TABLES } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// GET /api/admin/home - Get all home page data from normalized tables
export async function GET() {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase admin client not available' }, { status: 500 })
    }

    // 1. Fetch all sections metadata
    const { data: sections, error: sectionsError } = await supabase
      .from(TABLES.HOME_PAGE_SECTIONS)
      .select('*')

    if (sectionsError) throw sectionsError

    // 2. Fetch all stats
    const { data: stats, error: statsError } = await supabase
      .from(TABLES.HOME_PAGE_STATS)
      .select('*')
      .order('sort_order', { ascending: true })

    if (statsError) throw statsError

    // 3. Fetch all featured items
    const { data: featuredItems, error: featuredError } = await supabase
      .from(TABLES.HOME_PAGE_FEATURED_ITEMS)
      .select('*')
      .order('sort_order', { ascending: true })

    if (featuredError) throw featuredError

    // 4. Fetch all gallery images
    const { data: gallery, error: galleryError } = await supabase
      .from(TABLES.HOME_PAGE_GALLERY)
      .select('*')
      .order('sort_order', { ascending: true })

    if (galleryError) throw galleryError

    // 5. Assemble the response object
    const response: Record<string, any> = {}

    sections.forEach(section => {
      const sectionData: any = {
        title: section.title,
        subtitle: section.subtitle,
      }

      if (section.button_text) {
        sectionData.button_text = section.button_text
      }

      // Add section-specific data
      if (section.id === 'hero') {
        const heroImage = gallery.find(img => img.section_id === 'hero')
        sectionData.image_url = heroImage?.url || null
      } else if (section.id === 'stats') {
        sectionData.stats = stats.filter(s => s.section_id === 'stats')
      } else if (section.id === 'visual_story') {
        sectionData.panels = gallery
          .filter(img => img.section_id === 'visual_story')
          .map(img => ({
            image: img.url,
            title: img.alt || '',
            description: img.caption || ''
          }))
      } else if (section.id === 'featured_areas') {
        const sectionImages = gallery.filter(img => img.section_id === 'featured_areas')
        sectionData.areas = featuredItems
          .filter(item => item.section_id === 'featured_areas')
          .map((item, index) => ({
            ...item,
            image: sectionImages[index]?.url || null
          }))
      }

      response[section.id] = sectionData
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching home page data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch home page data' },
      { status: 500 }
    )
  }
}

// POST /api/admin/home - Update a home page section (Normalized)
export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase client not available' }, { status: 500 })
    }

    const body = await request.json()
    const { section_id, content, images, stats, areas } = body

    if (!section_id) {
      return NextResponse.json({ error: 'Missing section_id' }, { status: 400 })
    }

    // 1. Update section metadata
    const { error: sectionError } = await supabase
      .from(TABLES.HOME_PAGE_SECTIONS)
      .upsert({
        id: section_id,
        title: content.title,
        subtitle: content.subtitle,
        button_text: content.button_text || null,
        updated_at: new Date().toISOString()
      })

    if (sectionError) throw sectionError

    // 2. Update Stats if provided
    if (section_id === 'stats' && stats && Array.isArray(stats)) {
      await supabase.from(TABLES.HOME_PAGE_STATS).delete().eq('section_id', section_id)
      if (stats.length > 0) {
        const { error: statsError } = await supabase
          .from(TABLES.HOME_PAGE_STATS)
          .insert(stats.map((s, i) => ({
            section_id,
            value: s.value,
            suffix: s.suffix,
            label: s.label,
            description: s.description,
            decimals: s.decimals || 0,
            sort_order: i
          })))
        if (statsError) throw statsError
      }
    }

    // 3. Update Featured Items if provided
    if (section_id === 'featured_areas' && areas && Array.isArray(areas)) {
      await supabase.from(TABLES.HOME_PAGE_FEATURED_ITEMS).delete().eq('section_id', section_id)
      if (areas.length > 0) {
        const { error: featuredError } = await supabase
          .from(TABLES.HOME_PAGE_FEATURED_ITEMS)
          .insert(areas.map((a, i) => ({
            section_id,
            name: a.name,
            type: a.type,
            description: a.description,
            size: a.size,
            established: a.established,
            link: a.link,
            sort_order: i
          })))
        if (featuredError) throw featuredError
      }
    }

    // 4. Update Gallery Images if provided
    if (images && Array.isArray(images)) {
      await supabase.from(TABLES.HOME_PAGE_GALLERY).delete().eq('section_id', section_id)
      if (images.length > 0) {
        const { error: galleryError } = await supabase
          .from(TABLES.HOME_PAGE_GALLERY)
          .insert(images.map((img, i) => ({
            section_id,
            url: img.url,
            alt: img.alt || '',
            caption: img.caption || '',
            sort_order: i
          })))
        if (galleryError) throw galleryError
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating home page section:', error)
    return NextResponse.json(
      { error: 'Failed to update section' },
      { status: 500 }
    )
  }
}
