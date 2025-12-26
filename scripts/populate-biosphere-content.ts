import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function populateBiosphereContent() {
  console.log('Populating biosphere content fields...')

  // Get the first biosphere record
  const { data: biosphere, error: fetchError } = await supabase
    .from('biosphere')
    .select('id')
    .single()

  if (fetchError || !biosphere) {
    console.error('Error fetching biosphere:', fetchError?.message || 'No biosphere found')
    return
  }

  const updates = {
    zones_title: "Functional Zones",
    zones_description: "The biosphere reserve is organized into interconnected zones, each serving specific conservation and development purposes.",
    concept_title: "The Biosphere Concept",
    concept_description: "Unlike traditional protected areas, biosphere reserves are designed as living laboratories where conservation, sustainable development, and scientific research work together. Each zone plays a vital role in demonstrating that human activities and nature conservation can coexist and mutually benefit one another.",
    features_title: "Ecological Treasures",
    features_description: "The Niumi Biosphere Reserve protects a remarkable diversity of ecosystems and species, from coastal mangroves to rare migratory birds.",
    objectives_title: "International Recognition",
    objectives_description: "Niumi's designation as a Biosphere Reserve reflects its global importance for biodiversity and sustainable development, recognized under the UNESCO Man and the Biosphere (MAB) Programme.",
    model_title: "A Model for Sustainable Development",
    model_text_1: "The Niumi Biosphere Reserve serves as a living laboratory for testing and demonstrating integrated management of land, water, and biodiversity. It provides a framework for improving human livelihoods and the equitable sharing of benefits, while maintaining healthy ecosystems.",
    model_text_2: "Through the Man and the Biosphere (MAB) Programme, Niumi contributes to the global network of biosphere reserves, sharing knowledge and best practices for balancing conservation with sustainable use of natural resources.",
    model_quote: "Conservation is not just about protecting nature from people, but about finding ways for people and nature to thrive together."
  }

  const { error: updateError } = await supabase
    .from('biosphere')
    .update(updates)
    .eq('id', biosphere.id)

  if (updateError) {
    console.error('Error updating biosphere content:', updateError.message)
  } else {
    console.log('Successfully populated biosphere content fields!')
  }
}

populateBiosphereContent()
