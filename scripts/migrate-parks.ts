// Load environment variables first
import { config } from 'dotenv'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

// Load environment variables from the correct path
const envPath = path.resolve(__dirname, '../.env.local')
console.log('Loading env from:', envPath)
config({ path: envPath })

// Debug: Check if env vars are loaded
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ Set' : '✗ Missing')
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✓ Set' : '✗ Missing')

// Create supabase client with service role key for admin operations (bypasses RLS)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Import data
import { nationalParks } from '../lib/parks-data'

// Table names
const TABLES = {
  PARKS: 'parks',
  PARK_FEATURES: 'park_features',
  PARK_GALLERY: 'park_gallery'
}

// Migration script to import parks data from static files to Supabase
async function migrateParksData() {
  console.log('Starting parks data migration...')

  for (const park of nationalParks) {
    try {
      // Insert park data
      const { data: parkData, error: parkError } = await supabase
        .from(TABLES.PARKS)
        .insert({
          slug: park.slug,
          name: park.name,
          description: park.description,
          size: park.size,
          established: park.established,
          location: park.location,
          coordinates: park.coordinates,
          wildlife: park.wildlife,
          activities: park.activities,
          best_time: park.bestTime
        })
        .select()
        .single()

      if (parkError) {
        console.error(`Error inserting park ${park.name}:`, parkError)
        continue
      }

      console.log(`Inserted park: ${park.name}`)

      // Insert park features
      if (park.features && park.features.length > 0) {
        const featuresData = park.features.map(feature => ({
          park_id: parkData.id,
          icon: feature.icon,
          title: feature.title,
          description: feature.description
        }))

        const { error: featuresError } = await supabase
          .from(TABLES.PARK_FEATURES)
          .insert(featuresData)

        if (featuresError) {
          console.error(`Error inserting features for ${park.name}:`, featuresError)
        } else {
          console.log(`Inserted ${park.features.length} features for ${park.name}`)
        }
      }

      // Insert park gallery (using existing image paths for now)
      if (park.gallery && park.gallery.length > 0) {
        const galleryData = park.gallery.map((image, index) => ({
          park_id: parkData.id,
          url: image.url,
          alt: image.alt,
          sort_order: index
        }))

        const { error: galleryError } = await supabase
          .from(TABLES.PARK_GALLERY)
          .insert(galleryData)

        if (galleryError) {
          console.error(`Error inserting gallery for ${park.name}:`, galleryError)
        } else {
          console.log(`Inserted ${park.gallery.length} gallery images for ${park.name}`)
        }
      }

    } catch (error) {
      console.error(`Unexpected error migrating park ${park.name}:`, error)
    }
  }

  console.log('Parks data migration completed!')
}

// Run the migration
migrateParksData().catch(console.error)