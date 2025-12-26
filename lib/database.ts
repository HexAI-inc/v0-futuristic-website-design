import { supabase, TABLES } from './supabase'

// Types (matching the database schema)
export interface Park {
  id: string
  slug: string
  name: string
  description: string
  size: string
  established: string
  location: string
  coordinates: string
  wildlife: string[]
  activities: string[]
  best_time: string
  created_at: string
  updated_at: string
}

export interface ParkFeature {
  id: string
  park_id: string
  icon: string
  title: string
  description: string
}

export interface ParkGallery {
  id: string
  park_id: string
  url: string
  alt: string
  sort_order: number
}

export interface ParkWithDetails extends Park {
  features: ParkFeature[]
  gallery: ParkGallery[]
}

export interface Icca {
  id: string
  slug: string
  name: string
  region: string
  summary: string
  highlights: string[]
  coordinates?: string
  hero_image?: string
  created_at: string
  updated_at: string
}

export interface IccaGallery {
  id: string
  icca_id: string
  src: string
  alt: string
  sort_order: number
}

export interface IccaWithDetails extends Icca {
  gallery: IccaGallery[]
}

// Biosphere types
export interface Biosphere {
  id: string
  name: string
  description: string
  designation_year: number
  total_area_hectares: number
  communities_involved: number
  unesco_program: string
  hero_image_url: string
  coordinates?: string
  zones_title?: string
  zones_description?: string
  concept_title?: string
  concept_description?: string
  features_title?: string
  features_description?: string
  objectives_title?: string
  objectives_description?: string
  model_title?: string
  model_text_1?: string
  model_text_2?: string
  model_quote?: string
  created_at: string
  updated_at: string
}

export interface BiosphereZone {
  id: string
  biosphere_id: string
  name: string
  size: string
  description: string
  zone_type: string
  sort_order: number
  radius?: number
  coordinates?: string
  created_at: string
}

export interface BiosphereZoneFeature {
  id: string
  zone_id: string
  feature: string
  created_at: string
}

export interface BiosphereFeature {
  id: string
  biosphere_id: string
  icon: string
  title: string
  description: string
  sort_order: number
  created_at: string
}

export interface BiosphereObjective {
  id: string
  biosphere_id: string
  icon: string
  title: string
  description: string
  sort_order: number
  created_at: string
}

export interface BiosphereGallery {
  id: string
  biosphere_id: string
  url: string
  alt: string
  caption?: string
  sort_order: number
  created_at: string
}

export interface BiosphereZoneWithFeatures extends BiosphereZone {
  features: BiosphereZoneFeature[]
}

export interface BiosphereWithDetails extends Biosphere {
  zones: BiosphereZoneWithFeatures[]
  features: BiosphereFeature[]
  objectives: BiosphereObjective[]
  gallery: BiosphereGallery[]
}

export interface Communication {
  id: string
  type: 'contact' | 'support' | 'visit'
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  target_id?: string
  target_type?: 'icca' | 'park' | 'biosphere'
  target_name?: string
  status: 'pending' | 'processed' | 'archived'
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface FooterSettings {
  org_name: string
  org_address: string
  org_email: string
  org_phone: string
  org_website: string
  facebook_url: string
  twitter_url: string
  instagram_url: string
  linkedin_url: string
  copyright_text: string
}

export interface HomePageSection {
  section_id: string
  content: any
}

// --- Site Settings ---

export async function getFooterSettings(): Promise<FooterSettings> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'footer_info')
    .single()

  if (error) {
    console.error('Error fetching footer settings:', error)
    // Return defaults if fetch fails
    return {
      org_name: "Gambia Biodiversity Management",
      org_address: "Department of Parks and Wildlife Management, Abuko Nature Reserve, The Gambia",
      org_email: "info@nbsap.gm",
      org_phone: "+220 123 4567",
      org_website: "https://nbsap.gm",
      facebook_url: "https://facebook.com/nbsapgambia",
      twitter_url: "https://twitter.com/nbsapgambia",
      instagram_url: "https://instagram.com/nbsapgambia",
      linkedin_url: "https://linkedin.com/company/nbsapgambia",
      copyright_text: "© {year} NBSAP Gambia. All rights reserved."
    }
  }

  return data.value as FooterSettings
}

export async function updateFooterSettings(settings: FooterSettings) {
  const { error } = await supabase
    .from('site_settings')
    .upsert({ key: 'footer_info', value: settings })

  if (error) throw error
  return true
}

// --- Home Page Settings ---

export async function getHomePageSettings(): Promise<Record<string, any>> {
  const { data, error } = await supabase
    .from('home_page_settings')
    .select('*')

  if (error) {
    console.error('Error fetching home page settings:', error)
    return {}
  }

  return data.reduce((acc, item) => {
    acc[item.section_id] = item.content
    return acc
  }, {} as Record<string, any>)
}

export async function updateHomePageSection(sectionId: string, content: any): Promise<void> {
  const { error } = await supabase
    .from('home_page_settings')
    .upsert({ 
      section_id: sectionId, 
      content: content,
      updated_at: new Date().toISOString()
    })

  if (error) {
    console.error(`Error updating home page section ${sectionId}:`, error)
    throw error
  }
}

// Parks data fetching functions
export async function getParks(): Promise<ParkWithDetails[]> {
  const { data: parks, error: parksError } = await supabase
    .from(TABLES.PARKS)
    .select('*')
    .order('created_at', { ascending: false })

  if (parksError) {
    console.error('Error fetching parks:', parksError)
    throw new Error('Failed to fetch parks')
  }

  if (!parks) return []

  // Fetch gallery for each park
  const parksWithGallery: ParkWithDetails[] = []
  for (const park of parks) {
    const { data: gallery, error: galleryError } = await supabase
      .from(TABLES.PARK_GALLERY)
      .select('*')
      .eq('park_id', park.id)
      .order('sort_order')

    if (galleryError) {
      console.error('Error fetching gallery for park:', park.name, galleryError)
    }

    // Also fetch features
    const { data: features, error: featuresError } = await supabase
      .from(TABLES.PARK_FEATURES)
      .select('*')
      .eq('park_id', park.id)
      .order('id')

    if (featuresError) {
      console.error('Error fetching features for park:', park.name, featuresError)
    }

    parksWithGallery.push({
      ...park,
      features: features || [],
      gallery: gallery || []
    })
  }

  return parksWithGallery
}

export async function getPark(slug: string): Promise<ParkWithDetails | null> {
  const { data: park, error: parkError } = await supabase
    .from(TABLES.PARKS)
    .select('*')
    .eq('slug', slug)
    .single()

  if (parkError) {
    console.error('Error fetching park:', parkError)
    return null
  }

  if (!park) return null

  // Fetch features
  const { data: features, error: featuresError } = await supabase
    .from(TABLES.PARK_FEATURES)
    .select('*')
    .eq('park_id', park.id)
    .order('id')

  if (featuresError) {
    console.error('Error fetching park features:', featuresError)
  }

  // Fetch gallery
  const { data: gallery, error: galleryError } = await supabase
    .from(TABLES.PARK_GALLERY)
    .select('*')
    .eq('park_id', park.id)
    .order('sort_order')

  if (galleryError) {
    console.error('Error fetching park gallery:', galleryError)
  }

  return {
    ...park,
    features: features || [],
    gallery: gallery || []
  }
}

// ICCAs data fetching functions
export async function getIccas(): Promise<Icca[]> {
  const { data, error } = await supabase
    .from(TABLES.ICCAS)
    .select(`
      *,
      icca_gallery (
        src
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching ICCAs:', error)
    throw new Error('Failed to fetch ICCAs')
  }

  return (data || []).map(icca => ({
    ...icca,
    hero_image: icca.icca_gallery?.[0]?.src || null
  }))
}

export async function getIcca(id: string): Promise<IccaWithDetails | null> {
  const { data: icca, error: iccaError } = await supabase
    .from(TABLES.ICCAS)
    .select('*')
    .eq('id', id)
    .single()

  if (iccaError) {
    console.error('Error fetching ICCA:', iccaError)
    return null
  }

  if (!icca) return null

  // Fetch gallery
  const { data: gallery, error: galleryError } = await supabase
    .from(TABLES.ICCA_GALLERY)
    .select('*')
    .eq('icca_id', icca.id)
    .order('sort_order')

  if (galleryError) {
    console.error('Error fetching ICCA gallery:', galleryError)
  }

  return {
    ...icca,
    gallery: gallery || []
  }
}

export async function getIccaBySlug(slug: string): Promise<IccaWithDetails | null> {
  const { data: icca, error: iccaError } = await supabase
    .from(TABLES.ICCAS)
    .select('*')
    .eq('slug', slug)
    .single()

  if (iccaError) {
    console.error('Error fetching ICCA by slug:', iccaError)
    return null
  }

  if (!icca) return null

  // Fetch gallery
  const { data: gallery, error: galleryError } = await supabase
    .from(TABLES.ICCA_GALLERY)
    .select('*')
    .eq('icca_id', icca.id)
    .order('sort_order')

  if (galleryError) {
    console.error('Error fetching ICCA gallery:', galleryError)
  }

  return {
    ...icca,
    gallery: gallery || []
  }
}

// Biosphere data fetching functions
export async function getBiosphere(): Promise<BiosphereWithDetails | null> {
  const { data: biosphere, error: biosphereError } = await supabase
    .from(TABLES.BIOSPHERE)
    .select('*')
    .single()

  if (biosphereError) {
    console.error('Error fetching biosphere:', biosphereError)
    return null
  }

  if (!biosphere) return null

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
  const zonesWithFeatures: BiosphereZoneWithFeatures[] = []
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

  return {
    ...biosphere,
    zones: zonesWithFeatures,
    features: features || [],
    objectives: objectives || []
  }
}

// Count functions for admin sidebar
export async function getParksCount(): Promise<number> {
  const { count, error } = await supabase
    .from(TABLES.PARKS)
    .select('*', { count: 'exact', head: true })

  if (error) {
    console.error('Error counting parks:', error)
    return 0
  }

  return count || 0
}

export async function getIccasCount(): Promise<number> {
  const { count, error } = await supabase
    .from(TABLES.ICCAS)
    .select('*', { count: 'exact', head: true })

  if (error) {
    console.error('Error counting ICCAs:', error)
    return 0
  }

  return count || 0
}
export async function getCommunicationsCount(): Promise<number> {
  const { count, error } = await supabase
    .from('communications')
    .select('*', { count: 'exact', head: true })

  if (error) {
    console.error('Error counting communications:', error)
    return 0
  }

  return count || 0
}
export async function getBiosphereCount(): Promise<number> {
  const { count, error } = await supabase
    .from(TABLES.BIOSPHERE)
    .select('*', { count: 'exact', head: true })

  if (error) {
    console.error('Error counting biosphere reserves:', error)
    return 0
  }

  return count || 0
}
export interface Resource {
  id: string
  title: string
  description: string
  content?: string
  category: 'conservation-guide' | 'visit-information' | 'research-data'
  icon?: string
  file_url?: string
  file_type?: string
  file_size?: string
  sort_order: number
  created_at: string
  updated_at: string
  attachments?: ResourceAttachment[]
}

export interface ResourceAttachment {
  id: string
  resource_id: string
  file_name: string
  file_url: string
  file_type?: string
  file_size?: string
  sort_order: number
  created_at: string
}

export async function getResourcesCount(): Promise<number> {
  const { count, error } = await supabase
    .from(TABLES.RESOURCES)
    .select('*', { count: 'exact', head: true })

  if (error) {
    console.error('Error counting resources:', error)
    return 0
  }

  return count || 0
}
