import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/admin/auth/session - Get current admin session info
export async function GET() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to get session' },
        { status: 500 }
      )
    }

    if (!session) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      )
    }

    // Check if user has admin role (you might want to implement role-based access)
    const isAdmin = session.user.email?.endsWith('@nbsap.gm') ||
                   session.user.email === 'admin@nbsap.gm'

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.user.id,
        email: session.user.email,
        isAdmin
      },
      session: {
        expires_at: session.expires_at
      }
    })
  } catch (error) {
    console.error('Auth session error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/admin/auth/login - Admin login (handled by Supabase Auth, but can add admin validation)
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate admin email domain
    if (!email.endsWith('@nbsap.gm') && email !== 'admin@nbsap.gm') {
      return NextResponse.json(
        { error: 'Access denied. Admin access required.' },
        { status: 403 }
      )
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}