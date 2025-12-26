import { createClient } from '@supabase/supabase-js'

// For Next.js environment (automatic env loading)
let supabaseClient: ReturnType<typeof createClient> | null = null

export const getSupabaseClient = () => {
  if (!supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables')
    }

    supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  }
  return supabaseClient
}

// Export the client directly for Next.js (lazy loaded)
export const supabase = getSupabaseClient()

// Service role client for admin operations (server-side only)
export const getSupabaseAdmin = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error('Missing Supabase admin environment variables')
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

export const supabaseAdmin = typeof window === 'undefined' ? getSupabaseAdmin() : null

// Also export a function to create client (for scripts that need to load env vars manually)
export const createSupabaseClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient(url, key)
}

// Storage bucket name
export const BUCKET_NAME = 'biodiversity_bucket'

// Database table names
export const TABLES = {
  PARKS: 'parks',
  PARK_FEATURES: 'park_features',
  PARK_GALLERY: 'park_gallery',
  ICCAS: 'iccas',
  ICCA_GALLERY: 'icca_gallery',
  BIOSPHERE: 'biosphere',
  BIOSPHERE_GALLERY: 'biosphere_gallery',
  BIOSPHERE_ZONES: 'biosphere_zones',
  BIOSPHERE_ZONE_FEATURES: 'biosphere_zone_features',
  BIOSPHERE_FEATURES: 'biosphere_features',
  BIOSPHERE_OBJECTIVES: 'biosphere_objectives',
  HOME_PAGE_SECTIONS: 'home_page_sections',
  HOME_PAGE_STATS: 'home_page_stats',
  HOME_PAGE_FEATURED_ITEMS: 'home_page_featured_items',
  HOME_PAGE_GALLERY: 'home_page_gallery',
  SITE_SETTINGS: 'site_settings',
  RESOURCES: 'resources'
} as const
