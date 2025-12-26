export interface ICCAData {
  name: string
  region: string
  summary: string
  highlights: string[]
  coordinates?: string
  gallery?: {
    src: string
    alt: string
  }[]
}

export const honoraryIccaDetails: ICCAData[] = [
  // Coastal Communities
  {
    name: "Kartong Point Community Forest",
    region: "West Coast Region",
    summary: "A community-managed forest protecting coastal biodiversity and serving as a vital green space for local residents.",
    coordinates: "-16.76, 13.08",
    highlights: [
      "Coastal forest protection",
      "Community-based conservation",
      "Biodiversity hotspot",
      "Local livelihood support"
    ],
    gallery: [
      { src: "/kartong-forest-1.jpg", alt: "Kartong Point Community Forest" },
      { src: "/kartong-forest-2.jpg", alt: "Community conservation efforts" }
    ]
  },
  {
    name: "Gunjur Beach Conservation Area",
    region: "West Coast Region",
    summary: "Beach conservation initiative protecting marine turtles and coastal ecosystems through community participation.",
    coordinates: "-16.77, 13.18",
    highlights: [
      "Marine turtle protection",
      "Beach ecosystem conservation",
      "Community monitoring programs",
      "Sustainable tourism development"
    ],
    gallery: [
      { src: "/gunjur-beach-1.jpg", alt: "Gunjur Beach Conservation" },
      { src: "/gunjur-beach-2.jpg", alt: "Turtle nesting grounds" }
    ]
  },
  {
    name: "Sanyang Community Woodlands",
    region: "West Coast Region",
    summary: "Community-managed woodlands providing timber, non-timber products, and ecosystem services to local communities.",
    coordinates: "-16.78, 13.25",
    highlights: [
      "Sustainable forest management",
      "Non-timber forest products",
      "Carbon sequestration",
      "Cultural heritage preservation"
    ]
  },
  {
    name: "Tujereng Village Forest Reserve",
    region: "West Coast Region",
    summary: "Ancient forest reserve protected by traditional custodians and modern conservation practices.",
    highlights: [
      "Traditional ecological knowledge",
      "Sacred grove protection",
      "Medicinal plant conservation",
      "Cultural ceremonies"
    ]
  },
  {
    name: "Batokunku Mangrove Project",
    region: "West Coast Region",
    summary: "Mangrove restoration and protection project supporting fisheries and coastal defense.",
    highlights: [
      "Mangrove restoration",
      "Fisheries enhancement",
      "Coastal protection",
      "Climate change adaptation"
    ]
  },
  {
    name: "Berending Fishing Grounds",
    region: "West Coast Region",
    summary: "Traditional fishing grounds managed by local fishing communities with sustainable practices.",
    highlights: [
      "Sustainable fisheries",
      "Traditional fishing methods",
      "Marine biodiversity",
      "Community governance"
    ]
  },

  // River Communities
  {
    name: "Kuntaur River Conservation",
    region: "Central River Region",
    summary: "River conservation efforts protecting freshwater ecosystems and supporting riparian communities.",
    highlights: [
      "Freshwater ecosystem protection",
      "Riparian zone management",
      "Water quality monitoring",
      "Fisheries conservation"
    ]
  },
  {
    name: "Janjanbureh Island Preserve",
    region: "Central River Region",
    summary: "Island ecosystem protection combining historical preservation with modern conservation.",
    highlights: [
      "Island biodiversity",
      "Historical site protection",
      "Wetland conservation",
      "Community tourism"
    ]
  },
  {
    name: "Wassu Stone Circle Guardians",
    region: "Central River Region",
    summary: "Protection of ancient stone circles and surrounding sacred landscapes by local custodians.",
    highlights: [
      "Cultural heritage protection",
      "Sacred site management",
      "Archaeological preservation",
      "Traditional guardianship"
    ]
  },
  {
    name: "Georgetown Wetland Initiative",
    region: "Central River Region",
    summary: "Wetland conservation project supporting migratory birds and local livelihoods.",
    highlights: [
      "Wetland ecosystem services",
      "Bird migration support",
      "Sustainable agriculture",
      "Community-based monitoring"
    ]
  },
  {
    name: "Soma Community Gardens",
    region: "Central River Region",
    summary: "Community gardens promoting sustainable agriculture and food security.",
    highlights: [
      "Sustainable agriculture",
      "Food security",
      "Traditional farming methods",
      "Youth engagement"
    ]
  },
  {
    name: "Kaiaf River Protection Zone",
    region: "Central River Region",
    summary: "River protection zone safeguarding water resources and riparian habitats.",
    highlights: [
      "Water resource protection",
      "Riparian habitat conservation",
      "Flood control",
      "Biodiversity corridors"
    ]
  },

  // Inland Communities
  {
    name: "Farafenni Woodland Reserve",
    region: "North Bank Region",
    summary: "Woodland reserve managed by local communities for timber and non-timber products.",
    highlights: [
      "Woodland management",
      "Sustainable harvesting",
      "Forest regeneration",
      "Community forestry"
    ]
  },
  {
    name: "Kerewan Village Commons",
    region: "North Bank Region",
    summary: "Village commons protecting grazing lands and community resources.",
    highlights: [
      "Common resource management",
      "Grazing land protection",
      "Traditional land tenure",
      "Conflict resolution"
    ]
  },
  {
    name: "Essau Community Forest",
    region: "North Bank Region",
    summary: "Community forest providing ecosystem services and sustainable resources.",
    highlights: [
      "Community forest management",
      "Ecosystem services",
      "Biodiversity conservation",
      "Sustainable livelihoods"
    ]
  },
  {
    name: "Barra Point Conservation",
    region: "North Bank Region",
    summary: "Point conservation area protecting river confluence ecosystems.",
    highlights: [
      "River confluence protection",
      "Wetland conservation",
      "Fisheries management",
      "Navigation safety"
    ]
  },
  {
    name: "Albreda Historic Grove",
    region: "North Bank Region",
    summary: "Historic grove protecting ancient trees and cultural heritage.",
    highlights: [
      "Historic tree protection",
      "Cultural heritage",
      "Traditional medicine",
      "Ecotourism potential"
    ]
  },
  {
    name: "Juffureh Heritage Forest",
    region: "North Bank Region",
    summary: "Heritage forest linking cultural history with environmental conservation.",
    highlights: [
      "Cultural heritage forest",
      "Historical site protection",
      "Community stewardship",
      "Educational programs"
    ]
  },

  // Eastern Communities
  {
    name: "Bansang Community Reserve",
    region: "Upper River Region",
    summary: "Community reserve protecting savanna ecosystems and wildlife corridors.",
    highlights: [
      "Savanna ecosystem protection",
      "Wildlife corridor conservation",
      "Community-based monitoring",
      "Sustainable resource use"
    ]
  },
  {
    name: "Basse Forest Initiative",
    region: "Upper River Region",
    summary: "Forest conservation initiative in the eastern region supporting biodiversity.",
    highlights: [
      "Forest biodiversity",
      "Endemic species protection",
      "Agroforestry practices",
      "Climate resilience"
    ]
  },
  {
    name: "Fatoto River Conservation",
    region: "Upper River Region",
    summary: "River conservation efforts protecting freshwater ecosystems and fisheries.",
    highlights: [
      "Freshwater conservation",
      "River ecosystem protection",
      "Sustainable fisheries",
      "Water resource management"
    ]
  },
  {
    name: "Koina Village Preserve",
    region: "Upper River Region",
    summary: "Village preserve protecting local biodiversity and traditional practices.",
    highlights: [
      "Local biodiversity protection",
      "Traditional conservation practices",
      "Community governance",
      "Cultural preservation"
    ]
  },
  {
    name: "Sabi Community Woodlands",
    region: "Upper River Region",
    summary: "Community woodlands providing sustainable resources and ecosystem services.",
    highlights: [
      "Sustainable woodland management",
      "Ecosystem services provision",
      "Community resource rights",
      "Biodiversity monitoring"
    ]
  },
  {
    name: "Gambissara Heritage Site",
    region: "Upper River Region",
    summary: "Heritage site protecting cultural and natural values through community stewardship.",
    highlights: [
      "Cultural-natural heritage",
      "Community stewardship",
      "Site management planning",
      "Visitor management"
    ]
  }
]