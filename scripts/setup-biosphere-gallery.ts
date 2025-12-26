import { config } from 'dotenv'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

// Load environment variables
const envPath = path.resolve(__dirname, '../.env.local')
config({ path: envPath })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupBiosphereGallery() {
  console.log('Setting up biosphere_gallery table...')

  // We use rpc or just direct SQL if possible, but supabase-js doesn't support direct DDL
  // However, we can try to check if it exists by doing a dummy select
  const { error: checkError } = await supabase.from('biosphere_gallery').select('id').limit(1)
  
  if (checkError && checkError.code === 'PGRST116') {
    console.log('Table biosphere_gallery might not exist or is empty.')
  }

  console.log('Please run the following SQL in your Supabase SQL Editor:')
  console.log(`
    CREATE TABLE IF NOT EXISTS biosphere_gallery (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      biosphere_id UUID REFERENCES biosphere(id) ON DELETE CASCADE,
      url VARCHAR(500),
      alt VARCHAR(255),
      caption TEXT DEFAULT '',
      sort_order INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Enable RLS
    ALTER TABLE biosphere_gallery ENABLE ROW LEVEL SECURITY;

    -- Public read access
    CREATE POLICY "Public read access for biosphere_gallery" ON biosphere_gallery FOR SELECT USING (true);
  `)
}

setupBiosphereGallery().catch(console.error)
