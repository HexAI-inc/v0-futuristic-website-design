import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

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

const biosphereData = {
  name: "Niumi Biosphere Reserve",
  description: "A UNESCO-designated model for sustainable development, where conservation, community livelihoods, and scientific research converge to create a harmonious balance between people and nature.",
  designation_year: 2001,
  total_area_hectares: 68530,
  communities_involved: 35,
  unesco_program: "UNESCO Man and Biosphere Programme",
  hero_image_url: "/wide-gambia-river-aerial-view.jpg"
}

const zonesData = [
  {
    name: "Core Zone",
    size: "4,940 hectares",
    description: "The strictly protected heart of the reserve, encompassing Niumi National Park with its pristine mangrove forests and coastal ecosystems. No extractive activities are permitted.",
    zone_type: "core",
    sort_order: 1,
    features: ["Niumi National Park", "Mangrove Forests", "Critical Wildlife Habitat", "Research Sites"]
  },
  {
    name: "Buffer Zone",
    size: "28,590 hectares",
    description: "Surrounding the core area, this zone allows for compatible activities that support conservation while providing sustainable resources for local communities.",
    zone_type: "buffer",
    sort_order: 2,
    features: ["Sustainable Fishing", "Ecotourism", "Environmental Education", "Controlled Access"]
  },
  {
    name: "Transition Zone",
    size: "35,000 hectares",
    description: "The outer zone where communities live and work, implementing sustainable practices that demonstrate how development and conservation can coexist harmoniously.",
    zone_type: "transition",
    sort_order: 3,
    features: ["Agriculture", "Settlements", "Sustainable Development", "Community Projects"]
  }
]

const featuresData = [
  {
    icon: "Waves",
    title: "Coastal Ecosystems",
    description: "Extensive mangrove forests, mudflats, and estuarine habitats along the Atlantic coast",
    sort_order: 1
  },
  {
    icon: "Bird",
    title: "Avian Diversity",
    description: "Critical habitat for over 300 bird species, including rare and migratory species",
    sort_order: 2
  },
  {
    icon: "Fish",
    title: "Marine Resources",
    description: "Important nursery grounds for fish and shellfish supporting local livelihoods",
    sort_order: 3
  },
  {
    icon: "TreePine",
    title: "Forest Habitats",
    description: "Diverse woodland and savanna ecosystems supporting rich biodiversity",
    sort_order: 4
  },
  {
    icon: "Droplets",
    title: "Wetland Systems",
    description: "Vital freshwater and brackish wetlands providing ecosystem services",
    sort_order: 5
  },
  {
    icon: "Sunrise",
    title: "Cultural Heritage",
    description: "Sacred sites and traditional practices integrated with conservation",
    sort_order: 6
  }
]

const objectivesData = [
  {
    icon: "Award",
    title: "Conservation",
    description: "Protect biodiversity and ecosystems for future generations",
    sort_order: 1
  },
  {
    icon: "Target",
    title: "Development",
    description: "Foster sustainable economic and social development",
    sort_order: 2
  },
  {
    icon: "BookOpen",
    title: "Research",
    description: "Support scientific research and environmental education",
    sort_order: 3
  },
  {
    icon: "Users",
    title: "Community",
    description: "Engage local communities in conservation and decision-making",
    sort_order: 4
  }
]

async function migrateBiosphereData() {
  try {
    console.log('Starting biosphere data migration...')

    // Insert main biosphere data
    const { data: biosphere, error: biosphereError } = await supabase
      .from('biosphere')
      .insert([biosphereData])
      .select()
      .single()

    if (biosphereError) {
      throw biosphereError
    }

    console.log('✓ Inserted biosphere data')

    // Insert zones data
    for (const zone of zonesData) {
      const { data: insertedZone, error: zoneError } = await supabase
        .from('biosphere_zones')
        .insert([{
          biosphere_id: biosphere.id,
          name: zone.name,
          size: zone.size,
          description: zone.description,
          zone_type: zone.zone_type,
          sort_order: zone.sort_order
        }])
        .select()
        .single()

      if (zoneError) {
        throw zoneError
      }

      // Insert zone features
      const zoneFeatures = zone.features.map(feature => ({
        zone_id: insertedZone.id,
        feature: feature
      }))

      const { error: featuresError } = await supabase
        .from('biosphere_zone_features')
        .insert(zoneFeatures)

      if (featuresError) {
        throw featuresError
      }

      console.log(`✓ Inserted zone: ${zone.name} with ${zone.features.length} features`)
    }

    // Insert biosphere features (ecological treasures)
    const biosphereFeatures = featuresData.map(feature => ({
      biosphere_id: biosphere.id,
      ...feature
    }))

    const { error: featuresError } = await supabase
      .from('biosphere_features')
      .insert(biosphereFeatures)

    if (featuresError) {
      throw featuresError
    }

    console.log(`✓ Inserted ${featuresData.length} biosphere features`)

    // Insert biosphere objectives (UNESCO recognition)
    const biosphereObjectives = objectivesData.map(objective => ({
      biosphere_id: biosphere.id,
      ...objective
    }))

    const { error: objectivesError } = await supabase
      .from('biosphere_objectives')
      .insert(biosphereObjectives)

    if (objectivesError) {
      throw objectivesError
    }

    console.log(`✓ Inserted ${objectivesData.length} biosphere objectives`)

    console.log('✅ Biosphere data migration completed successfully!')

  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

migrateBiosphereData()