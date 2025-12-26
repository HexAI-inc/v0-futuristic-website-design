export interface ParkData {
  slug: string
  name: string
  description: string
  size: string
  established: string
  location: string
  coordinates: string
  wildlife: string[]
  activities: string[]
  bestTime: string
  features?: {
    icon: string
    title: string
    description: string
  }[]
  gallery?: {
    url: string
    alt: string
  }[]
}

export const nationalParks: ParkData[] = [
  {
    slug: "kiang-west-national-park",
    name: "Kiang West National Park",
    description: "The largest protected area in The Gambia, Kiang West National Park spans over 11,000 hectares of savanna woodlands, grasslands, and wetlands. This pristine wilderness is home to a diverse array of wildlife and serves as a critical habitat for many endangered species.",
    size: "11,526 ha",
    established: "1987",
    location: "Lower River Region",
    coordinates: "-15.8,13.3",
    wildlife: ["African Elephant", "Lion", "Leopard", "Hyena", "Warhog", "Buffalo", "Various Antelope Species", "Birds"],
    activities: ["Wildlife Viewing", "Bird Watching", "Photography", "Guided Tours", "Research"],
    bestTime: "November to May (Dry Season)",
    features: [
      {
        icon: "trees",
        title: "Savanna Ecosystem",
        description: "Diverse savanna woodlands and grasslands supporting rich biodiversity"
      },
      {
        icon: "camera",
        title: "Wildlife Photography",
        description: "Excellent opportunities for photographing large mammals and birds"
      },
      {
        icon: "map-pin",
        title: "Remote Wilderness",
        description: "Experience true wilderness in one of Africa's last remaining wild places"
      }
    ],
    gallery: [
      {
        url: "/images/parks/kiang-west-1.jpg",
        alt: "Savanna landscape in Kiang West National Park"
      },
      {
        url: "/images/parks/kiang-west-2.jpg",
        alt: "Wildlife in Kiang West National Park"
      }
    ]
  },
  {
    slug: "niumi-national-park",
    name: "Niumi National Park",
    description: "Located in the northernmost part of The Gambia, Niumi National Park protects important coastal mangrove forests and wetlands. This ecologically significant area serves as a nursery for marine life and provides habitat for numerous bird species.",
    size: "4,940 ha",
    established: "1986",
    location: "North Bank Region",
    coordinates: "-16.7,13.5",
    wildlife: ["Mangrove Species", "Fish", "Crabs", "Shrimp", "Migratory Birds", "Marine Mammals"],
    activities: ["Bird Watching", "Boat Tours", "Fishing", "Nature Walks", "Educational Programs"],
    bestTime: "November to April (Dry Season)",
    features: [
      {
        icon: "waves",
        title: "Mangrove Ecosystem",
        description: "Vital coastal mangrove forests that protect shorelines and support marine life"
      },
      {
        icon: "bird",
        title: "Bird Sanctuary",
        description: "Important habitat for migratory and resident bird species"
      },
      {
        icon: "anchor",
        title: "Boat Access",
        description: "Explore the park's waterways and coastal areas by boat"
      }
    ],
    gallery: [
      {
        url: "/images/parks/niumi-1.jpg",
        alt: "Mangrove forests in Niumi National Park"
      },
      {
        url: "/images/parks/niumi-2.jpg",
        alt: "Coastal wetlands in Niumi National Park"
      }
    ]
  },
  {
    slug: "river-gambia-national-park",
    name: "River Gambia National Park",
    description: "Situated along the Gambia River, this park is renowned for its chimpanzee population and diverse wildlife. The park protects important riverine forest and provides sanctuary for primates and other species in a rapidly developing region.",
    size: "585 ha",
    established: "1978",
    location: "Central River Region",
    coordinates: "-15.0,13.6",
    wildlife: ["Chimpanzee", "Red Colobus Monkey", "Green Monkey", "Various Bird Species", "Reptiles", "Insects"],
    activities: ["Chimpanzee Tracking", "Nature Walks", "Bird Watching", "Research", "Community Programs"],
    bestTime: "November to May (Dry Season)",
    features: [
      {
        icon: "monkey",
        title: "Chimpanzee Habitat",
        description: "Home to one of West Africa's largest chimpanzee populations"
      },
      {
        icon: "tree-pine",
        title: "Riverine Forest",
        description: "Unique riverine forest ecosystem along the Gambia River"
      },
      {
        icon: "users",
        title: "Community Conservation",
        description: "Active community involvement in park management and protection"
      }
    ],
    gallery: [
      {
        url: "/images/parks/river-gambia-1.jpg",
        alt: "Chimpanzees in River Gambia National Park"
      },
      {
        url: "/images/parks/river-gambia-2.jpg",
        alt: "Riverine forest in River Gambia National Park"
      }
    ]
  },
  {
    slug: "abuko-nature-reserve",
    name: "Abuko Nature Reserve",
    description: "The Gambia\'s oldest protected area, Abuko Nature Reserve is a small but ecologically important gallery forest. Despite its size, it supports an impressive diversity of plant and animal life and serves as an important educational resource.",
    size: "107 ha",
    established: "1968",
    location: "Western Region (Greater Banjul)",
    coordinates: "-16.65,13.4",
    wildlife: ["Green Monkeys", "Birds", "Butterflies", "Reptiles", "Various Plant Species", "Insects"],
    activities: ["Nature Walks", "Bird Watching", "Educational Tours", "Photography", "Research"],
    bestTime: "November to May (Dry Season)",
    features: [
      {
        icon: "book-open",
        title: "Educational Resource",
        description: "Important site for environmental education and research"
      },
      {
        icon: "camera",
        title: "Photography",
        description: "Excellent opportunities for nature and wildlife photography"
      },
      {
        icon: "footprints",
        title: "Easy Access",
        description: "Located near Banjul, easily accessible for day visits"
      }
    ],
    gallery: [
      {
        url: "/images/parks/abuko-1.jpg",
        alt: "Gallery forest in Abuko Nature Reserve"
      },
      {
        url: "/images/parks/abuko-2.jpg",
        alt: "Wildlife in Abuko Nature Reserve"
      }
    ]
  },
  {
    slug: "tanji-river-bird-reserve",
    name: "Tanji River Bird Reserve",
    description: "Established to protect important bird habitats, Tanji River Bird Reserve encompasses mangroves, mudflats, and coastal grasslands. It serves as a critical stopover point for migratory birds and supports resident bird populations.",
    size: "612 ha",
    established: "1993",
    location: "Western Region",
    coordinates: "-16.8,13.35",
    wildlife: ["Migratory Birds", "Resident Bird Species", "Fish", "Crustaceans", "Mangrove Species"],
    activities: ["Bird Watching", "Photography", "Guided Tours", "Research", "Educational Programs"],
    bestTime: "November to April (Migratory Season)",
    features: [
      {
        icon: "bird",
        title: "Bird Sanctuary",
        description: "Critical habitat for both migratory and resident bird species"
      },
      {
        icon: "binoculars",
        title: "Bird Watching",
        description: "World-class bird watching opportunities throughout the year"
      },
      {
        icon: "map",
        title: "Wetland Ecosystem",
        description: "Diverse wetland habitats supporting rich biodiversity"
      }
    ],
    gallery: [
      {
        url: "/images/parks/tanji-1.jpg",
        alt: "Birds in Tanji River Bird Reserve"
      },
      {
        url: "/images/parks/tanji-2.jpg",
        alt: "Wetlands in Tanji River Bird Reserve"
      }
    ]
  },
  {
    slug: "bijilo-forest-park",
    name: "Bijilo Forest Park",
    description: "A small coastal forest park located near the capital, Bijilo Forest Park protects an important remnant of coastal vegetation. It provides habitat for monkeys and numerous bird species while offering recreational opportunities for local residents.",
    size: "51.3 ha",
    established: "1995",
    location: "Western Region (Greater Banjul)",
    coordinates: "-16.7,13.45",
    wildlife: ["Green Monkeys", "Birds", "Reptiles", "Insects", "Coastal Plant Species"],
    activities: ["Nature Walks", "Bird Watching", "Recreational Activities", "Photography"],
    bestTime: "November to May (Dry Season)",
    features: [
      {
        icon: "tree-pine",
        title: "Coastal Forest",
        description: "Important remnant of coastal vegetation in an urban area"
      },
      {
        icon: "monkey",
        title: "Monkey Population",
        description: "Habitat for a thriving population of green monkeys"
      },
      {
        icon: "home",
        title: "Community Access",
        description: "Provides recreational and educational opportunities for local communities"
      }
    ],
    gallery: [
      {
        url: "/images/parks/bijilo-1.jpg",
        alt: "Forest trails in Bijilo Forest Park"
      },
      {
        url: "/images/parks/bijilo-2.jpg",
        alt: "Wildlife in Bijilo Forest Park"
      }
    ]
  }
]