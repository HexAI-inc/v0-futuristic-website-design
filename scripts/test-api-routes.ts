// Test the actual Next.js API routes
async function testAPIEndpoints() {
  const baseUrl = 'http://localhost:3000';

  console.log('🌐 Testing Next.js API Routes\n');

  try {
    // Test 1: GET /api/parks
    console.log('1. Testing GET /api/parks');
    const parksResponse = await fetch(`${baseUrl}/api/parks`);
    if (!parksResponse.ok) {
      console.error(`❌ GET /api/parks failed: ${parksResponse.status}`);
    } else {
      const parks = await parksResponse.json();
      console.log(`✅ GET /api/parks: Found ${parks.length} parks`);
    }

    // Test 2: GET /api/parks/[slug]
    console.log('\n2. Testing GET /api/parks/bijilo-forest-park');
    const parkResponse = await fetch(`${baseUrl}/api/parks/bijilo-forest-park`);
    if (!parkResponse.ok) {
      console.error(`❌ GET /api/parks/bijilo-forest-park failed: ${parkResponse.status}`);
    } else {
      const park = await parkResponse.json();
      console.log(`✅ GET /api/parks/bijilo-forest-park: ${park.name}`);
    }

    // Test 3: PUT /api/parks/[slug]
    console.log('\n3. Testing PUT /api/parks/bijilo-forest-park');
    const updateData = {
      name: 'Bijilo Forest Park',
      description: 'A small coastal forest park located near the capital, Bijilo Forest Park protects an important remnant of coastal vegetation.',
      size: '51.3 ha',
      established: '1995', // Reset to original
      location: 'Western Region (Greater Banjul)',
      coordinates: '-16.7,13.45',
      wildlife: ['Green Monkeys', 'Birds', 'Reptiles', 'Insects', 'Coastal Plant Species'],
      activities: ['Nature Walks', 'Bird Watching', 'Recreational Activities', 'Photography'],
      best_time: 'November to May (Dry Season)'
    };

    const putResponse = await fetch(`${baseUrl}/api/parks/bijilo-forest-park`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!putResponse.ok) {
      const error = await putResponse.json();
      console.error(`❌ PUT /api/parks/bijilo-forest-park failed: ${putResponse.status}`, error);
    } else {
      const updatedPark = await putResponse.json();
      console.log(`✅ PUT /api/parks/bijilo-forest-park: Updated ${updatedPark.name} (established: ${updatedPark.established})`);
    }

    console.log('\n🎉 Next.js API route testing completed!');

  } catch (error) {
    console.error('💥 API test failed:', error.message);
    console.log('\nNote: Make sure the dev server is running with: npm run dev');
  }
}

// Only run if this script is called directly
if (require.main === module) {
  testAPIEndpoints();
}