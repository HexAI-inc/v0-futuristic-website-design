// Load environment variables first
import { config } from 'dotenv'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

// Load environment variables from the correct path
const envPath = path.resolve(__dirname, '../.env.local')
config({ path: envPath })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testParkUpdate() {
  console.log('Testing the exact API logic...')

  const slug = 'bijilo-forest-park'
  console.log('Slug:', slug)

  // First check if the park exists (same as API)
  console.log('Checking if park exists...')
  const { data: existingPark, error: fetchError } = await supabase
    .from('parks')
    .select('id')
    .eq('slug', slug)
    .single()

  console.log('Result:', { existingPark, fetchError })

  if (fetchError || !existingPark) {
    console.log('Would return Park not found')
  } else {
    console.log('Park exists, would proceed with update')

    // Try the update
    const updateData = {
      name: 'Bijilo Forest Park',
      description: 'Test description',
      size: '51.3 ha',
      established: '1990',
      location: 'Western Region (Greater Banjul)',
      coordinates: '-16.7,13.45',
      best_time: 'November to May (Dry Season)'
    }

    console.log('Attempting update...')
    const { data, error } = await supabase
      .from('parks')
      .update(updateData)
      .eq('slug', slug)
      .select()

    console.log('Update result:', { data, error })
  }
}

testParkUpdate().catch(console.error)