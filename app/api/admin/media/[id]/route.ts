import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin as supabase, TABLES, BUCKET_NAME } from '@/lib/supabase'

// PUT /api/admin/media/[id] - Update media item metadata
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    if (!supabase) {
      return NextResponse.json({ error: 'Supabase admin client not available' }, { status: 500 })
    }

    // Try to update in park gallery first
    let { data, error } = await supabase
      .from(TABLES.PARK_GALLERY)
      .update({
        alt: body.alt_text,
        caption: body.caption,
        sort_order: body.sort_order
      })
      .eq('id', id)
      .select()

    let updatedItem = data && data.length > 0 ? data[0] : null

    // If not found in park gallery, try ICCA gallery
    if (!updatedItem) {
      const { data: iccaData, error: iccaError } = await supabase
        .from(TABLES.ICCA_GALLERY)
        .update({
          alt: body.alt_text,
          caption: body.caption,
          sort_order: body.sort_order
        })
        .eq('id', id)
        .select()

      updatedItem = iccaData && iccaData.length > 0 ? iccaData[0] : null
      error = iccaError
    }

    if (error) {
      console.error('Error updating media:', error)
      return NextResponse.json(
        { error: 'Failed to update media item' },
        { status: 500 }
      )
    }

    if (!updatedItem) {
      return NextResponse.json(
        { error: 'Media item not found' },
        { status: 404 }
      )
    }

    // Map back to frontend format
    const mappedData = {
      ...updatedItem,
      image_url: updatedItem.url || updatedItem.src,
      alt_text: updatedItem.alt,
      caption: updatedItem.caption || ''
    }

    return NextResponse.json(mappedData)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/media/[id] - Delete media item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log('Attempting to delete media item:', id)

    if (!supabase) {
      return NextResponse.json({ error: 'Supabase admin client not available' }, { status: 500 })
    }

    // Try to delete from park gallery first
    const { data: parkData, error: parkError } = await supabase
      .from(TABLES.PARK_GALLERY)
      .delete()
      .eq('id', id)
      .select('url')

    if (parkError) {
      console.error('Error deleting from park gallery:', parkError)
      return NextResponse.json({ error: parkError.message }, { status: 500 })
    }

    if (parkData && parkData.length > 0) {
      console.log('Deleted from park gallery:', id)
      const imageUrl = parkData[0].url
      if (imageUrl) {
        await deleteFromStorage(imageUrl)
      }
      return NextResponse.json({ message: 'Media item deleted successfully' })
    }

    // If not found in park gallery, try ICCA gallery
    const { data: iccaData, error: iccaError } = await supabase
      .from(TABLES.ICCA_GALLERY)
      .delete()
      .eq('id', id)
      .select('src')

    if (iccaError) {
      console.error('Error deleting from ICCA gallery:', iccaError)
      return NextResponse.json({ error: iccaError.message }, { status: 500 })
    }

    if (iccaData && iccaData.length > 0) {
      console.log('Deleted from ICCA gallery:', id)
      const imageUrl = iccaData[0].src
      if (imageUrl) {
        await deleteFromStorage(iccaData[0].src)
      }
      return NextResponse.json({ message: 'Media item deleted successfully' })
    }

    console.warn('Media item not found in any gallery:', id)
    return NextResponse.json(
      { error: 'Media item not found' },
      { status: 404 }
    )
  } catch (error) {
    console.error('Unexpected error during deletion:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function deleteFromStorage(imageUrl: string) {
  try {
    if (!supabase) return
    // Only delete if it's a Supabase storage URL
    if (imageUrl.includes('supabase.co') && imageUrl.includes(BUCKET_NAME)) {
      const fileName = imageUrl.split('/').pop()
      if (fileName) {
        const { error } = await supabase.storage.from(BUCKET_NAME).remove([fileName])
        if (error) console.error('Error removing file from storage:', error)
        else console.log('Removed file from storage:', fileName)
      }
    }
  } catch (error) {
    console.error('Failed to delete from storage:', error)
  }
}