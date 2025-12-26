import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkBuckets() {
  console.log('Checking Supabase Storage buckets...')
  
  const { data: buckets, error } = await supabase.storage.listBuckets()
  
  if (error) {
    console.error('Error listing buckets:', error)
    return
  }
  
  if (buckets && buckets.length > 0) {
    console.log('Found buckets:')
    buckets.forEach(bucket => {
      console.log(`- ${bucket.name} (Public: ${bucket.public})`)
    })
  } else {
    console.log('No buckets found in this project.')
  }
}

checkBuckets()
