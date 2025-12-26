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
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✓ Set' : '✗ Missing')

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
import { honoraryIccaDetails } from '../lib/icca-data'

// Table names
const TABLES = {
  ICCAS: 'iccas',
  ICCA_GALLERY: 'icca_gallery'
}

// Migration script to import ICCAs data from static files to Supabase
async function migrateIccasData() {
  console.log('Starting ICCAs data migration...')

  for (const icca of honoraryIccaDetails) {
    try {
      // Insert ICCA data
      const { data: iccaData, error: iccaError } = await supabase
        .from(TABLES.ICCAS)
        .insert({
          name: icca.name,
          region: icca.region,
          summary: icca.summary,
          highlights: icca.highlights,
          coordinates: icca.coordinates
        })
        .select()
        .single()

      if (iccaError) {
        console.error(`Error inserting ICCA ${icca.name}:`, iccaError)
        continue
      }

      console.log(`Inserted ICCA: ${icca.name}`)

      // Insert ICCA gallery
      if (icca.gallery && icca.gallery.length > 0) {
        const galleryData = icca.gallery.map((image, index) => ({
          icca_id: iccaData.id,
          src: image.src,
          alt: image.alt,
          sort_order: index
        }))

        const { error: galleryError } = await supabase
          .from(TABLES.ICCA_GALLERY)
          .insert(galleryData)

        if (galleryError) {
          console.error(`Error inserting gallery for ${icca.name}:`, galleryError)
        } else {
          console.log(`Inserted ${icca.gallery.length} gallery images for ${icca.name}`)
        }
      }

    } catch (error) {
      console.error(`Unexpected error migrating ICCA ${icca.name}:`, error)
    }
  }

  console.log('ICCA data migration completed!')
}

// Run the migration
migrateIccasData().catch(console.error)