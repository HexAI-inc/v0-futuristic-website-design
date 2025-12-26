import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // For now, skip authentication in middleware to avoid environment issues
  // We'll handle auth protection in the components themselves
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}