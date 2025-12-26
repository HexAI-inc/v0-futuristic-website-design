import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin as supabase, TABLES, BUCKET_NAME } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// GET /api/admin/media - Get media library items
export async function GET(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase admin client not available' }, { status: 500 })
    }
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'parks', 'iccas', 'biosphere', or 'all'
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let parkImages = []
    let iccaImages = []
    let biosphereImages = []
    let homeImages = []

    if (type === 'parks' || type === 'all') {
      const { data, error } = await supabase
        .from(TABLES.PARK_GALLERY)
        .select(`
          id,
          image_url:url,
          alt_text:alt,
          caption,
          sort_order,
          created_at,
          parks(name, slug)
        `)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) throw error
      parkImages = (data || [])
        .filter(img => img.image_url && (img.image_url.includes('supabase.co') || img.image_url.startsWith('http')))
        .map(img => ({ ...img, type: 'park' }))
    }

    if (type === 'iccas' || type === 'all') {
      const { data, error } = await supabase
        .from(TABLES.ICCA_GALLERY)
        .select(`
          id,
          image_url:src,
          alt_text:alt,
          caption,
          sort_order,
          created_at,
          iccas(name)
        `)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) throw error
      iccaImages = (data || [])
        .filter(img => img.image_url && (img.image_url.includes('supabase.co') || img.image_url.startsWith('http')))
        .map(img => ({ ...img, type: 'icca' }))
    }

    if (type === 'biosphere' || type === 'all') {
      const { data, error } = await supabase
        .from(TABLES.BIOSPHERE_GALLERY)
        .select(`
          id,
          image_url:url,
          alt_text:alt,
          caption,
          sort_order,
          created_at,
          biosphere(name)
        `)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) throw error
      biosphereImages = (data || [])
        .filter(img => img.image_url && (img.image_url.includes('supabase.co') || img.image_url.startsWith('http')))
        .map(img => ({ ...img, type: 'biosphere' }))
    }

    if (type === 'home' || type === 'all') {
      const { data, error } = await supabase
        .from(TABLES.HOME_PAGE_GALLERY)
        .select(`
          id,
          image_url:url,
          alt_text:alt,
          caption,
          sort_order,
          created_at
        `)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) throw error
      homeImages = (data || [])
        .filter(img => img.image_url && (img.image_url.includes('supabase.co') || img.image_url.startsWith('http')))
        .map(img => ({ ...img, type: 'home' }))
    }

    const allImages = [...parkImages, ...iccaImages, ...biosphereImages, ...homeImages]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit)

    // Get total counts
    const [parkCount, iccaCount, biosphereCount, homeCount] = await Promise.all([
      supabase.from(TABLES.PARK_GALLERY).select('id', { count: 'exact', head: true }),
      supabase.from(TABLES.ICCA_GALLERY).select('id', { count: 'exact', head: true }),
      supabase.from(TABLES.BIOSPHERE_GALLERY).select('id', { count: 'exact', head: true }),
      supabase.from(TABLES.HOME_PAGE_GALLERY).select('id', { count: 'exact', head: true })
    ])

    return NextResponse.json({
      images: allImages,
      total: (parkCount.count || 0) + (iccaCount.count || 0) + (biosphereCount.count || 0) + (homeCount.count || 0),
      pagination: {
        limit,
        offset,
        hasMore: allImages.length === limit
      }
    })
  } catch (error) {
    console.error('Error fetching media:', error)
    return NextResponse.json(
      { error: 'Failed to fetch media library' },
      { status: 500 }
    )
  }
}

// POST /api/admin/media/upload - Upload new media files
export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      console.error('Supabase admin client is NULL in POST /api/admin/media')
      return NextResponse.json({ error: 'Supabase admin client not available' }, { status: 500 })
    }
    
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const altTexts = formData.getAll('altTexts') as string[]
    const contentType = formData.get('contentType') as string
    const contentId = formData.get('contentId') as string

    console.log('--- MEDIA UPLOAD START ---')
    console.log('Content Type:', contentType)
    console.log('Content ID:', contentId)
    console.log('Files Count:', files.length)

    if (!files.length) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      )
    }

    const uploadedFiles = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const altText = altTexts[i] || file.name

      // Validate file type - allow images and common document types
      const allowedTypes = ['image/', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'application/zip']
      const isAllowed = allowedTypes.some(type => file.type.startsWith(type))

      if (!isAllowed) {
        console.log('Skipping unsupported file type:', file.name, file.type)
        continue
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      
      console.log(`Uploading file: ${file.name} -> ${fileName} with alt: ${altText}`)

      // Convert File to Buffer for Node.js environment
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, buffer, {
          contentType: file.type,
          upsert: false
        })

      if (uploadError) {
        console.error('Supabase Storage Error:', uploadError)
        continue
      }

      console.log('Storage upload successful:', uploadData)

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(fileName)
      
      console.log('Public URL generated:', publicUrl)

      // Save to appropriate gallery table
      const isPark = contentType === 'parks' || contentType === 'park'
      const isIcca = contentType === 'iccas' || contentType === 'icca'
      const isBiosphere = contentType === 'biosphere'
      const isHome = contentType === 'home'
      const isResource = contentType === 'resources' || contentType === 'resource'

      if (isPark && contentId) {
        console.log('Inserting into park_gallery...')
        const { data, error } = await supabase
          .from(TABLES.PARK_GALLERY)
          .insert({
            park_id: contentId,
            url: publicUrl,
            alt: altText,
            caption: '',
            sort_order: 0
          })
          .select()
          .single()

        if (error) {
          console.error('Database Error (park_gallery):', error)
        } else {
          console.log('Database insert successful (park_gallery)')
          uploadedFiles.push({
            ...data,
            image_url: data.url,
            alt_text: data.alt,
            type: 'park'
          })
        }
      } else if (isIcca && contentId) {
        console.log('Inserting into icca_gallery...')
        const { data, error } = await supabase
          .from(TABLES.ICCA_GALLERY)
          .insert({
            icca_id: contentId,
            src: publicUrl,
            alt: altText,
            caption: '',
            sort_order: 0
          })
          .select()
          .single()

        if (error) {
          console.error('Database Error (icca_gallery):', error)
        } else {
          console.log('Database insert successful (icca_gallery)')
          uploadedFiles.push({
            ...data,
            image_url: data.src,
            alt_text: data.alt,
            type: 'icca'
          })
        }
      } else if (isBiosphere && contentId) {
        console.log('Inserting into biosphere_gallery...')
        const { data, error } = await supabase
          .from(TABLES.BIOSPHERE_GALLERY)
          .insert({
            biosphere_id: contentId,
            url: publicUrl,
            alt: altText,
            caption: '',
            sort_order: 0
          })
          .select()
          .single()

        if (error) {
          console.error('Database Error (biosphere_gallery):', error)
        } else {
          console.log('Database insert successful (biosphere_gallery)')
          uploadedFiles.push({
            ...data,
            image_url: data.url,
            alt_text: data.alt,
            type: 'biosphere'
          })
        }
      } else if (isHome) {
        console.log('Inserting into home_page_gallery...')
        const { data, error } = await supabase
          .from(TABLES.HOME_PAGE_GALLERY)
          .insert({
            url: publicUrl,
            alt: altText,
            caption: '',
            section_id: contentId || 'general',
            sort_order: 0
          })
          .select()
          .single()

        if (error) {
          console.error('Database Error (home_page_gallery):', error)
        } else {
          console.log('Database insert successful (home_page_gallery)')
          uploadedFiles.push({
            ...data,
            image_url: data.url,
            alt_text: data.alt,
            type: 'home'
          })
        }
      } else if (isResource) {
        console.log('Resource upload, returning URL directly...')
        uploadedFiles.push({
          id: fileName,
          image_url: publicUrl,
          alt_text: altText,
          type: 'resource',
          file_name: file.name,
          file_size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
          file_type: file.type
        })
      } else {
        console.warn('Invalid contentType or missing contentId:', { contentType, contentId })
      }
    }

    console.log('--- MEDIA UPLOAD END ---')
    console.log('Successfully uploaded:', uploadedFiles.length)

    if (uploadedFiles.length === 0 && files.length > 0) {
      return NextResponse.json(
        { error: 'Failed to save media to database. Check server logs for details.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      uploaded: uploadedFiles.length,
      files: uploadedFiles
    })
  } catch (error) {
    console.error('Global Upload Error:', error)
    return NextResponse.json(
      { error: 'Internal server error during upload' },
      { status: 500 }
    )
  }
}