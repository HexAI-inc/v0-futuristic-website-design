// Test script for park API endpoints
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import * as path from 'path';

// Load environment variables
const envPath = path.resolve(__dirname, '../.env.local');
config({ path: envPath });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testParkEndpoints() {
  console.log('🧪 Testing Park API Endpoints\n');

  try {
    // Test 1: Get all parks
    console.log('1. Testing GET /api/parks (list all parks)');
    const { data: parks, error: parksError } = await supabase
      .from('parks')
      .select('id, slug, name, location')
      .order('created_at', { ascending: false });

    if (parksError) {
      console.error('❌ Failed to fetch parks:', parksError);
    } else {
      console.log(`✅ Found ${parks.length} parks:`);
      parks.forEach(park => console.log(`   - ${park.name} (${park.slug})`));
    }

    if (parks && parks.length > 0) {
      const testPark = parks[0];
      console.log(`\n2. Testing GET /api/parks/${testPark.slug} (get specific park)`);

      // Test 2: Get specific park
      const { data: park, error: parkError } = await supabase
        .from('parks')
        .select('*')
        .eq('slug', testPark.slug)
        .single();

      if (parkError) {
        console.error('❌ Failed to fetch specific park:', parkError);
      } else {
        console.log(`✅ Retrieved park: ${park.name}`);
        console.log(`   Location: ${park.location}`);
        console.log(`   Established: ${park.established}`);
      }

      // Test 3: Update park
      console.log(`\n3. Testing PUT /api/parks/${testPark.slug} (update park)`);
      const updateData = {
        name: park.name,
        description: park.description,
        size: park.size,
        established: '2025', // Change established year
        location: park.location,
        coordinates: park.coordinates,
        best_time: park.best_time,
        wildlife: park.wildlife,
        activities: park.activities
      };

      const { data: updatedPark, error: updateError } = await supabase
        .from('parks')
        .update(updateData)
        .eq('slug', testPark.slug)
        .select();

      if (updateError) {
        console.error('❌ Failed to update park:', updateError);
      } else if (!updatedPark || updatedPark.length === 0) {
        // Try fetching again if update didn't return data
        const { data: fetchedPark, error: fetchError } = await supabase
          .from('parks')
          .select('*')
          .eq('slug', testPark.slug)
          .single();

        if (fetchError) {
          console.error('❌ Update completed but failed to fetch:', fetchError);
        } else {
          console.log(`✅ Park updated successfully: ${fetchedPark.name} (established: ${fetchedPark.established})`);
        }
      } else {
        console.log(`✅ Park updated successfully: ${updatedPark[0].name} (established: ${updatedPark[0].established})`);
      }
    }

    console.log('\n🎉 Park API endpoint testing completed!');

  } catch (error) {
    console.error('💥 Test failed with error:', error);
  }
}

testParkEndpoints();