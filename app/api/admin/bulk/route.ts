import { NextRequest, NextResponse } from 'next/server'
import { supabase, TABLES } from '@/lib/supabase'

// POST /api/admin/bulk - Perform bulk operations on content
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { operation, type, ids } = body

    if (!operation || !type || !ids || !Array.isArray(ids)) {
      return NextResponse.json(
        { error: 'Invalid request: operation, type, and ids array required' },
        { status: 400 }
      )
    }

    let tableName: string
    switch (type) {
      case 'parks':
        tableName = TABLES.PARKS
        break
      case 'iccas':
        tableName = TABLES.ICCAS
        break
      case 'park-gallery':
        tableName = TABLES.PARK_GALLERY
        break
      case 'icca-gallery':
        tableName = TABLES.ICCA_GALLERY
        break
      default:
        return NextResponse.json(
          { error: 'Invalid type. Must be: parks, iccas, park-gallery, or icca-gallery' },
          { status: 400 }
        )
    }

    let result

    switch (operation) {
      case 'delete':
        result = await supabase
          .from(tableName)
          .delete()
          .in('id', ids)
        break

      case 'update':
        const { updates } = body
        if (!updates) {
          return NextResponse.json(
            { error: 'Updates object required for update operation' },
            { status: 400 }
          )
        }
        result = await supabase
          .from(tableName)
          .update(updates)
          .in('id', ids)
        break

      default:
        return NextResponse.json(
          { error: 'Invalid operation. Must be: delete or update' },
          { status: 400 }
        )
    }

    if (result.error) {
      console.error('Bulk operation error:', result.error)
      return NextResponse.json(
        { error: `Failed to ${operation} ${type}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      operation,
      type,
      affected: ids.length,
      message: `Successfully ${operation}d ${ids.length} ${type} items`
    })
  } catch (error) {
    console.error('Bulk operation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}