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
const BUCKET_NAME = 'biodiversity_bucket'

async function makeBucketPublic() {
  console.log(`Updating bucket "${BUCKET_NAME}" to be public...`)
  
  const { data, error } = await supabase.storage.updateBucket(BUCKET_NAME, {
    public: true,
    allowedMimeTypes: ['image/*'],
    fileSizeLimit: 10485760 // 10MB
  })
  
  if (error) {
    console.error('Error updating bucket:', error)
    
    // If update fails, maybe it doesn't exist? Let's try to create it just in case
    if (error.message.includes('not found')) {
        console.log('Bucket not found, attempting to create it...')
        const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
            public: true,
            allowedMimeTypes: ['image/*']
        })
        if (createError) console.error('Error creating bucket:', createError)
        else console.log('Bucket created successfully!')
    }
  } else {
    console.log('Bucket updated successfully! It is now public.')
  }
}

makeBucketPublic()
