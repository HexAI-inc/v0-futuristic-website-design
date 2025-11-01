export interface Park {
  slug: string
  name: string
  description: string
  size: string
  established: string
  location: string
  coordinates: string
  features: {
    icon: string
    title: string
    description: string
  }[]
  wildlife: string[]
  activities: string[]
  bestTime: string
  gallery: {
    url: string
    alt: string
  }[]
}

export const nationalParks: Park[] = [
  {
    slug: "kiang-west",
    name: "Kiang West National Park",
    description:
      "The largest and most diverse protected area in The Gambia, Kiang West National Park spans over 29,000 hectares of pristine wilderness along the southern bank of the Gambia River. This remarkable ecosystem showcases the perfect blend of mangrove forests, savanna woodlands, and riverine habitats.",
    size: "29,051 hectares",
    established: "1987",
    location: "Lower River Region (Mansakonko-LRR)",
    coordinates: "13.35°N, 15.75°W",
    features: [
      {
        icon: "trees",
        title: "Diverse Ecosystems",
        description: "From mangrove swamps to savanna woodlands, the park hosts multiple habitat types",
      },
      {
        icon: "bird",
        title: "Rich Birdlife",
        description: "Over 300 bird species recorded, including rare African finfoot and white-backed night heron",
      },
      {
        icon: "paw",
        title: "Large Mammals",
        description: "Home to bushbuck, warthog, spotted hyena, and various antelope species",
      },
      {
        icon: "leaf",
        title: "Pristine Nature",
        description: "One of the least disturbed natural areas in West Africa",
      },
    ],
    wildlife: [
      "Bushbuck",
      "Warthog",
      "Spotted Hyena",
      "Marsh Mongoose",
      "Nile Crocodile",
      "Green Monkey",
      "Red Colobus Monkey",
      "African Finfoot",
      "Goliath Heron",
      "Pel's Fishing Owl",
    ],
    activities: ["Wildlife Viewing", "Bird Watching", "Boat Safaris", "Nature Photography", "Guided Walks"],
    bestTime: "November to April (dry season)",
    gallery: [
      {
        url: "/kiang-west-national-park-gambia-savanna-landscape.jpg",
        alt: "Kiang West savanna landscape",
      },
      {
        url: "/gambia-river-mangroves-wildlife.jpg",
        alt: "Mangrove forests along the river",
      },
      {
        url: "/african-bushbuck-antelope.jpg",
        alt: "Bushbuck in natural habitat",
      },
    ],
  },
  {
    slug: "boa-bolong",
    name: "Boa Bolong Wetland Reserve",
    description:
      "The largest wetland reserve in The Gambia, Boa Bolong protects an intricate network of mangrove channels and tidal flats that sustain rare aquatic mammals and a dazzling array of birdlife.",
    size: "29,650 hectares",
    established: "1993",
    location: "North Bank Region (Kerewan-NBR)",
    coordinates: "13.55°N, 15.85°W",
    features: [
      {
        icon: "droplet",
        title: "Mangrove Labyrinth",
        description: "Vast mangrove forests filter the river and provide nursery grounds for marine life",
      },
      {
        icon: "bird",
        title: "Important Bird Area",
        description: "Globally important refuge for migratory waders and rare resident species",
      },
      {
        icon: "fish",
        title: "Aquatic Wildlife",
        description: "One of the best places in West Africa to glimpse manatees and Atlantic humpback dolphins",
      },
      {
        icon: "leaf",
        title: "Sustainable Livelihoods",
        description: "Community-led oyster farming and mangrove restoration projects",
      },
    ],
    wildlife: [
      "West African Manatee",
      "Atlantic Humpback Dolphin",
      "African Clawless Otter",
      "African Fish Eagle",
      "Osprey",
      "Black-crowned Night Heron",
      "Spur-winged Goose",
      "Sacred Ibis",
      "Goliath Heron",
      "Mudskipper",
    ],
    activities: ["Boat Safaris", "Bird Photography", "Community Tours", "Mangrove Planting", "Sunset Cruises"],
    bestTime: "November to March (dry season with peak bird activity)",
    gallery: [
      {
        url: "/baobolong-mangrove-restoration.jpg",
        alt: "Mangrove restoration at Boa Bolong",
      },
      {
        url: "/baobolong-bird-habitat.jpg",
        alt: "Bird habitat within the wetland",
      },
      {
        url: "/baobolong-fishing-community.jpg",
        alt: "Community fishing boats along the wetlands",
      },
    ],
  },
  {
    slug: "tanbi-wetland",
    name: "Tanbi Wetland National Park",
    description:
      "A Ramsar-listed wetland at the heart of Greater Banjul, Tanbi safeguards tidal marshes, mudflats, and mangrove forests that buffer the capital from storms while supporting fisheries and birdlife.",
    size: "6,034 hectares",
    established: "2001",
    location: "Greater Banjul Area",
    coordinates: "13.43°N, 16.63°W",
    features: [
      {
        icon: "water",
        title: "Urban Mangroves",
        description: "Mangrove estuary that forms the green lungs of Banjul",
      },
      {
        icon: "sun",
        title: "Coastal Protection",
        description: "Natural barrier against coastal erosion and storm surges",
      },
      {
        icon: "bird",
        title: "Birdwatcher's Paradise",
        description: "Flamingos, spoonbills, and egrets gather on the tidal flats",
      },
      {
        icon: "boat",
        title: "Eco-boat Trails",
        description: "Network of bolongs explored via traditional pirogues",
      },
    ],
    wildlife: [
      "Flamingo",
      "African Spoonbill",
      "Great White Pelican",
      "Black Heron",
      "Malachite Kingfisher",
      "Fiddler Crab",
      "Mudskipper",
      "Nile Monitor",
      "West African Manatee",
      "Mangrove Oyster",
    ],
    activities: ["Guided Boat Tours", "Bird Watching", "Urban Ecology Walks", "Kayaking", "Mangrove Boardwalk"],
    bestTime: "October to April (cooler months with migratory birds)",
    gallery: [
      {
        url: "/coastal-mangrove-atlantic-ocean-gambia.jpg",
        alt: "Aerial view of Tanbi mangroves",
      },
      {
        url: "/gambia-river-mangroves-wildlife.jpg",
        alt: "Mangrove ecosystems supporting wildlife",
      },
      {
        url: "/atlantic-coast-sunset-gambia.jpg",
        alt: "Sunset over the Tanbi wetlands",
      },
    ],
  },
  {
    slug: "jokadou",
    name: "Jokadou National Park",
    description:
      "One of The Gambia's newest protected areas, Jokadou preserves an expansive mosaic of savanna, woodland, and floodplain habitats that connect communities with the Gambia River.",
    size: "19,293 hectares",
    established: "2019",
    location: "North Bank Region (Kerewan-NBR)",
    coordinates: "13.64°N, 15.92°W",
    features: [
      {
        icon: "trees",
        title: "Savanna Woodlands",
        description: "Open savannas dotted with baobabs and acacia stands",
      },
      {
        icon: "paw",
        title: "Large Fauna",
        description: "Important refuge for antelope, bushbuck, and roaming hyenas",
      },
      {
        icon: "leaf",
        title: "Community Stewardship",
        description: "Co-managed with local villages focusing on sustainable grazing",
      },
      {
        icon: "sun",
        title: "Golden Hour Safaris",
        description: "Wide horizons ideal for sunset game drives",
      },
    ],
    wildlife: [
      "Roan Antelope",
      "Bushbuck",
      "Red Patas Monkey",
      "African Civet",
      "Side-striped Jackal",
      "Ground Hornbill",
      "Abyssinian Roller",
      "Senegal Parrot",
      "Hooded Vulture",
      "Sahel Paradise Whydah",
    ],
    activities: ["Guided Game Drives", "Community Visits", "Birding", "Night Drives", "Cultural Performances"],
    bestTime: "December to May (dry season for wildlife visibility)",
    gallery: [
      {
        url: "/kiang-west-national-park-gambia-savanna-landscape.jpg",
        alt: "Game drive through Jokadou savanna",
      },
      {
        url: "/wide-gambia-river-aerial-view.jpg",
        alt: "Gambia River cutting through savanna",
      },
      {
        url: "/nature-trail-tropical-forest.jpg",
        alt: "Community stewards along a woodland trail",
      },
    ],
  },
  {
    slug: "niumi",
    name: "Niumi National Park",
    description:
      "Located at the mouth of the Gambia River, Niumi National Park protects vital coastal mangrove forests and wetlands that serve as critical habitat for migratory birds and marine life.",
    size: "4,940 hectares",
    established: "1987",
    location: "North Bank Region",
    coordinates: "13.58°N, 16.58°W",
    features: [
      {
        icon: "waves",
        title: "Coastal Ecosystems",
        description: "Extensive mangrove forests and tidal mudflats along the Atlantic coast",
      },
      {
        icon: "bird",
        title: "Migratory Birds",
        description: "Critical stopover for thousands of Palearctic migrants",
      },
      {
        icon: "fish",
        title: "Marine Life",
        description: "Important nursery grounds for fish and shellfish species",
      },
      {
        icon: "sun",
        title: "Beach Access",
        description: "Beautiful beaches and coastal scenery",
      },
    ],
    wildlife: [
      "Bottlenose Dolphin",
      "West African Manatee",
      "Nile Monitor",
      "Green Turtle",
      "Curlew Sandpiper",
      "Grey Plover",
      "Whimbrel",
      "Osprey",
      "Western Reef Heron",
      "Pied Kingfisher",
    ],
    activities: ["Bird Watching", "Boat Tours", "Beach Walks", "Dolphin Watching", "Photography"],
    bestTime: "October to March (peak migration season)",
    gallery: [
      {
        url: "/gambia-mangrove-forest-coastal-wetland.jpg",
        alt: "Mangrove forests at Niumi",
      },
      {
        url: "/atlantic-coast-beach-gambia.jpg",
        alt: "Coastal beach landscape",
      },
      {
        url: "/migratory-shorebirds-mudflats.jpg",
        alt: "Migratory birds on mudflats",
      },
    ],
  },
  {
    slug: "river-gambia",
    name: "River Gambia National Park",
    description:
      "Home to the famous Baboon Islands, this park is a sanctuary for rehabilitated chimpanzees and showcases the rich riverine ecosystems of the Gambia River.",
    size: "585 hectares",
    established: "1978",
    location: "Central River Region",
    coordinates: "13.58°N, 14.75°W",
    features: [
      {
        icon: "monkey",
        title: "Chimpanzee Sanctuary",
        description: "Five islands hosting rehabilitated chimpanzees in a natural environment",
      },
      {
        icon: "water",
        title: "River Habitat",
        description: "Pristine river islands with gallery forests",
      },
      {
        icon: "binoculars",
        title: "Wildlife Viewing",
        description: "Excellent opportunities to observe primates and river wildlife",
      },
      {
        icon: "boat",
        title: "Boat Access",
        description: "Accessible only by boat, offering unique safari experience",
      },
    ],
    wildlife: [
      "Chimpanzee",
      "Hippopotamus",
      "Nile Crocodile",
      "Green Monkey",
      "Red Colobus Monkey",
      "Baboon",
      "African Fish Eagle",
      "Malachite Kingfisher",
      "Giant Kingfisher",
      "Monitor Lizard",
    ],
    activities: ["Boat Safaris", "Chimpanzee Viewing", "Bird Watching", "Photography", "Educational Tours"],
    bestTime: "November to May (dry season)",
    gallery: [
      {
        url: "/gambia-river-islands-forest.jpg",
        alt: "River islands with forest",
      },
      {
        url: "/chimpanzee-in-natural-habitat-africa.jpg",
        alt: "Chimpanzees in sanctuary",
      },
      {
        url: "/african-fish-eagle-river.jpg",
        alt: "African Fish Eagle",
      },
    ],
  },
  {
    slug: "abuko",
    name: "Abuko Nature Reserve",
    description:
      "The Gambia's first protected area, Abuko is a jewel of biodiversity featuring lush gallery forest, diverse wildlife, and excellent nature trails in a compact, accessible reserve.",
    size: "107 hectares",
    established: "1968",
    location: "Western Division",
    coordinates: "13.40°N, 16.65°W",
    features: [
      {
        icon: "tree",
        title: "Gallery Forest",
        description: "Dense tropical forest with towering trees and rich understory",
      },
      {
        icon: "footprints",
        title: "Nature Trails",
        description: "Well-maintained walking trails through diverse habitats",
      },
      {
        icon: "eye",
        title: "Wildlife Viewing",
        description: "Easy wildlife observation with viewing platforms",
      },
      {
        icon: "camera",
        title: "Photography Hub",
        description: "Excellent opportunities for nature and wildlife photography",
      },
    ],
    wildlife: [
      "Green Monkey",
      "Red Colobus Monkey",
      "Bushbuck",
      "Nile Crocodile",
      "Monitor Lizard",
      "African Python",
      "Violet Turaco",
      "Blue-bellied Roller",
      "Bearded Barbet",
      "Palm-nut Vulture",
    ],
    activities: ["Nature Walks", "Wildlife Viewing", "Bird Watching", "Photography", "Educational Visits"],
    bestTime: "Year-round, best November to April",
    gallery: [
      {
        url: "/tropical-gallery-forest-gambia.jpg",
        alt: "Gallery forest at Abuko",
      },
      {
        url: "/green-monkey-african-forest.jpg",
        alt: "Green monkeys in forest",
      },
      {
        url: "/nature-trail-tropical-forest.jpg",
        alt: "Nature trail through forest",
      },
    ],
  },
  {
    slug: "tanji",
    name: "Tanji River Bird Reserve",
    description:
      "A vital wetland sanctuary protecting diverse coastal habitats and serving as a critical refuge for resident and migratory bird species along the Atlantic coast.",
    size: "612 hectares",
    established: "1993",
    location: "Western Division",
    coordinates: "13.35°N, 16.78°W",
    features: [
      {
        icon: "droplet",
        title: "Wetland Habitats",
        description: "Lagoons, marshes, and coastal scrubland",
      },
      {
        icon: "bird",
        title: "Bird Paradise",
        description: "Over 300 bird species recorded",
      },
      {
        icon: "waves",
        title: "Coastal Location",
        description: "Beautiful Atlantic coastline with beaches",
      },
      {
        icon: "sunrise",
        title: "Scenic Views",
        description: "Stunning sunsets and coastal vistas",
      },
    ],
    wildlife: [
      "Grey-headed Gull",
      "Royal Tern",
      "Caspian Tern",
      "Western Reef Heron",
      "Spur-winged Plover",
      "Black-winged Stilt",
      "Avocet",
      "Flamingo",
      "Pelican",
      "Osprey",
    ],
    activities: ["Bird Watching", "Nature Photography", "Beach Walks", "Guided Tours", "Sunset Viewing"],
    bestTime: "October to April (migration season)",
    gallery: [
      {
        url: "/coastal-wetland-lagoon-birds-gambia.jpg",
        alt: "Wetland lagoon at Tanji",
      },
      {
        url: "/shorebirds-coastal-habitat-africa.jpg",
        alt: "Shorebirds at the reserve",
      },
      {
        url: "/atlantic-coast-sunset-gambia.jpg",
        alt: "Sunset over the coast",
      },
    ],
  },
  {
    slug: "bijilo",
    name: "Bijilo Forest Park",
    description:
      "A small but precious coastal forest reserve known for its habituated monkey populations and easy accessibility, making it perfect for casual nature walks and wildlife encounters.",
    size: "51.3 hectares",
    established: "1952",
    location: "Western Division",
    coordinates: "13.45°N, 16.70°W",
    features: [
      {
        icon: "monkey",
        title: "Monkey Encounters",
        description: "Habituated troops of red colobus and green monkeys",
      },
      {
        icon: "palm-tree",
        title: "Coastal Forest",
        description: "Unique coastal woodland ecosystem",
      },
      {
        icon: "walking",
        title: "Easy Access",
        description: "Well-maintained trails suitable for all fitness levels",
      },
      {
        icon: "beach",
        title: "Beach Proximity",
        description: "Adjacent to popular beach resorts",
      },
    ],
    wildlife: [
      "Red Colobus Monkey",
      "Green Monkey",
      "Monitor Lizard",
      "Gambian Sun Squirrel",
      "Ground Squirrel",
      "Beautiful Sunbird",
      "Violet Turaco",
      "African Grey Hornbill",
      "Senegal Parrot",
      "Various Butterflies",
    ],
    activities: ["Nature Walks", "Monkey Watching", "Photography", "Bird Watching", "Relaxation"],
    bestTime: "Year-round, early morning best for wildlife",
    gallery: [
      {
        url: "/dense-forest-canopy-abuko-gambia.jpg",
        alt: "Forest trail at Bijilo",
      },
      {
        url: "/green-monkey-african-forest.jpg",
        alt: "Red colobus monkey",
      },
      {
        url: "/nature-trail-tropical-forest.jpg",
        alt: "Green monkeys in forest",
      },
    ],
  },
  {
    slug: "kassan",
    name: "Kassan Conservation Area",
    description:
      "A newly protected savanna-woodland landscape in The Gambia's Central River Region, Kassan links riverine forests with community farmlands to create a resilient conservation corridor.",
    size: "2,160 hectares",
    established: "2018",
    location: "Central River Region (Janjanbureh-CRR)",
    coordinates: "13.55°N, 14.82°W",
    features: [
      {
        icon: "leaf",
        title: "Riverine Forest",
        description: "Seasonally flooded forests supporting rich biodiversity",
      },
      {
        icon: "paw",
        title: "Wildlife Corridor",
        description: "Provides safe passage for primates and antelope moving between habitats",
      },
      {
        icon: "users",
        title: "Co-management",
        description: "Jointly managed by local communities and conservation rangers",
      },
      {
        icon: "sunrise",
        title: "Birdwatching Haven",
        description: "Dawn chorus of woodland and wetland birds",
      },
    ],
    wildlife: [
      "Red Colobus Monkey",
      "Green Monkey",
      "Guinea Baboon",
      "Bushbuck",
      "Maxwell's Duiker",
      "African Civet",
      "African Fish Eagle",
      "Brown-throated Wattle-eye",
      "Giant Kingfisher",
      "Senegal Thick-knee",
    ],
    activities: ["Guided Walks", "Community Homestays", "Bird Watching", "River Excursions", "Citizen Science"],
    bestTime: "November to March (cool dry season)",
    gallery: [
      {
        url: "/gambia-river-islands-forest.jpg",
        alt: "Gambia River forest near Kassan",
      },
      {
        url: "/pirang-bird-watching.jpg",
        alt: "Birdwatching hide overlooking wetland",
      },
      {
        url: "/pirang-environmental-education.jpg",
        alt: "Community conservation meeting in Kassan",
      },
    ],
  },
]
