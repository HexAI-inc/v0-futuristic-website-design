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

async function checkParks() {
  console.log('Checking parks in database...')

  const { data: parks, error } = await supabase
    .from('parks')
    .select('id, slug, name')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching parks:', error)
  } else {
    console.log('Parks in database:')
    parks.forEach(park => console.log(`  ${park.id}: ${park.slug} - ${park.name}`))
  }
}

checkParks().catch(console.error)