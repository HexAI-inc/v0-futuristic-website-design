import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createHash } from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { path, referrer, user_agent, type, event_name, event_data, session_id: raw_session_id } = body

    // Validate session_id is a valid UUID, otherwise set to null
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    const session_id = (raw_session_id && uuidRegex.test(raw_session_id)) ? raw_session_id : null

    console.log(`[Analytics Server] Received ${type || 'page_view'} for ${path}`)

    // Get IP address from headers
    const forwarded = req.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : req.ip || '127.0.0.1'

    // Create a hash of the IP address to protect privacy
    const salt = process.env.ANALYTICS_SALT || 'nbsap-salt-2025'
    const ipHash = createHash('sha256')
      .update(`${ip}-${salt}`)
      .digest('hex')

    if (type === 'event') {
      const { error } = await supabase.from('analytics_events').insert({
        event_name,
        event_data,
        path,
        ip_hash: ipHash,
        session_id
      })
      if (error) throw error
    } else {
      const { error } = await supabase.from('page_views').insert({
        path,
        referrer,
        user_agent,
        ip_hash: ipHash,
        session_id
      })
      if (error) throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Analytics tracking error:', error)
    return NextResponse.json({ error: 'Failed to track' }, { status: 500 })
  }
}
