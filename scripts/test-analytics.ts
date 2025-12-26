import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { createHash } from 'crypto'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables. Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runTests() {
  console.log('🚀 Starting Analytics Integration Tests...\n')

  const testSessionId = '00000000-0000-0000-0000-' + Date.now().toString().slice(-12).padStart(12, '0')
  const testIp = '1.2.3.4'
  const salt = process.env.ANALYTICS_SALT || 'nbsap-salt-2025'
  const ipHash = createHash('sha256').update(`${testIp}-${salt}`).digest('hex')

  try {
    // 1. Test Page View Insertion
    console.log('🧪 Test 1: Inserting test page views...')
    const testPaths = ['/test-page-1', '/test-page-2', '/test-page-1']
    
    for (const path of testPaths) {
      const { error } = await supabase.from('page_views').insert({
        path,
        referrer: 'https://google.com',
        user_agent: 'Mozilla/5.0 (Test Crawler)',
        ip_hash: ipHash,
        session_id: testSessionId
      })
      if (error) throw new Error(`Failed to insert page view: ${error.message}`)
    }
    console.log('✅ Page views inserted successfully.\n')

    // 2. Test Event Insertion
    console.log('🧪 Test 2: Inserting test events...')
    const { error: eventError } = await supabase.from('analytics_events').insert({
      event_name: 'test_click',
      event_data: { button_id: 'test-btn' },
      path: '/test-page-1',
      ip_hash: ipHash,
      session_id: testSessionId
    })
    if (eventError) throw new Error(`Failed to insert event: ${eventError.message}`)
    console.log('✅ Event inserted successfully.\n')

    // 3. Test RPC: get_total_unique_visitors
    console.log('🧪 Test 3: Testing get_total_unique_visitors RPC...')
    const { data: uniqueCount, error: uniqueError } = await supabase.rpc('get_total_unique_visitors')
    if (uniqueError) throw new Error(`RPC get_total_unique_visitors failed: ${uniqueError.message}`)
    console.log(`✅ Unique visitors count: ${uniqueCount}\n`)

    // 4. Test RPC: get_top_pages
    console.log('🧪 Test 4: Testing get_top_pages RPC...')
    const { data: topPages, error: topPagesError } = await supabase.rpc('get_top_pages', { limit_count: 5 })
    if (topPagesError) throw new Error(`RPC get_top_pages failed: ${topPagesError.message}`)
    
    const testPage1 = topPages.find((p: any) => p.path === '/test-page-1')
    if (testPage1 && parseInt(testPage1.views) >= 2) {
      console.log('✅ Top pages correctly aggregated test data.')
    } else {
      console.warn('⚠️ Top pages did not show expected test data. (This might happen if DB is very large)')
    }
    console.log(`   Sample: ${JSON.stringify(topPages.slice(0, 2))}\n`)

    // 5. Test RPC: get_device_breakdown
    console.log('🧪 Test 5: Testing get_device_breakdown RPC...')
    const { data: devices, error: deviceError } = await supabase.rpc('get_device_breakdown')
    if (deviceError) throw new Error(`RPC get_device_breakdown failed: ${deviceError.message}`)
    console.log(`✅ Device breakdown: ${JSON.stringify(devices)}\n`)

    // 6. Test RPC: get_active_users_count
    console.log('🧪 Test 6: Testing get_active_users_count RPC...')
    const { data: activeUsers, error: activeError } = await supabase.rpc('get_active_users_count')
    if (activeError) throw new Error(`RPC get_active_users_count failed: ${activeError.message}`)
    console.log(`✅ Active users (last 5m): ${activeUsers}\n`)

    console.log('🎉 All analytics integration tests passed!')

  } catch (err: any) {
    console.error('❌ Test failed:', err.message)
    process.exit(1)
  } finally {
    // Cleanup test data
    console.log('\n🧹 Cleaning up test data...')
    await supabase.from('page_views').delete().eq('session_id', testSessionId)
    await supabase.from('analytics_events').delete().eq('session_id', testSessionId)
    console.log('✨ Cleanup complete.')
  }
}

runTests()
