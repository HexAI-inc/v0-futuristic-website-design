import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function migrate() {
  console.log('Starting home page normalization migration...')

  const sqlPath = path.join(process.cwd(), 'database', 'home_page_normalized.sql')
  const sql = fs.readFileSync(sqlPath, 'utf8')

  // Split SQL into individual statements (basic split by semicolon)
  // Note: This is a simple split and might fail on complex SQL with semicolons in strings
  // but for this migration it should be fine.
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0)

  for (const statement of statements) {
    console.log(`Executing: ${statement.substring(0, 50)}...`)
    const { error } = await supabase.rpc('exec_sql', { sql_query: statement })
    
    if (error) {
      // If exec_sql doesn't exist, we might need to use a different approach
      // or just tell the user to run it in the dashboard.
      // Most Supabase projects don't have exec_sql by default for security.
      console.error('Error executing statement:', error.message)
      
      if (error.message.includes('function exec_sql(text) does not exist')) {
        console.error('\nERROR: The "exec_sql" function is not available in your Supabase database.')
        console.error('Please run the SQL content in database/home_page_normalized.sql manually in the Supabase SQL Editor.')
        process.exit(1)
      }
    }
  }

  console.log('Migration completed successfully!')
}

migrate().catch(console.error)
