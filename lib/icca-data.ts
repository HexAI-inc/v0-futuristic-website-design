export interface HonoraryICCA {
  name: string
  region: string
  summary: string
  highlights: string[]
  gallery: {
    src: string
    alt: string
  }[]
}

export const honoraryIccaDetails: HonoraryICCA[] = [
  {
    name: "Kartong Point Community Forest",
    region: "Lower River Region",
    summary:
      "Protecting a vital coastal forest that buffers Kartong village from erosion while sustaining traditional beekeeping and tide-fed rice fields managed by women's cooperatives.",
    highlights: [
      "Community-led mangrove replanting covering 24 hectares",
      "Seasonal sea turtle patrols coordinated with local youth",
      "Nature heritage tourism that funds village scholarship programs",
    ],
    gallery: [
      { src: "/icca-biodiversity-protection.jpg", alt: "Kartong community members replanting mangroves" },
      { src: "/atlantic-coast-beach-gambia.jpg", alt: "Kartong Point coastline at sunrise" },
      { src: "/tumani-tenda-village-life.jpg", alt: "Traditional community ceremony near the forest" },
    ],
  },
  {
    name: "Gunjur Beach Conservation Area",
    region: "West Coast Region",
    summary:
      "A fisherfolk-led initiative balancing artisanal fisheries with nesting bird refuges and sustainable oyster harvesting along the Tanji river mouth.",
    highlights: [
      "Rotational fishing zones agreed with park rangers",
      "Oyster farming cooperatives managed by women harvesters",
      "Beach clean-ups that divert plastic into craft enterprises",
    ],
    gallery: [
      { src: "/coastal-wetland-lagoon-birds-gambia.jpg", alt: "Birds foraging near Gunjur wetlands" },
      { src: "/migratory-shorebirds-mudflats.jpg", alt: "Migratory shorebirds resting along the beach" },
      { src: "/tumani-tenda-traditional-medicine-garden.jpg", alt: "Community processing of oyster shells" },
    ],
  },
  {
    name: "Sanyang Community Woodlands",
    region: "West Coast Region",
    summary:
      "Rehabilitated woodland corridors that connect inland farms with coastal dunes, championed by Sanyang elders and youth eco-clubs.",
    highlights: [
      "Nursery producing 15,000 indigenous seedlings annually",
      "Wildlife corridor monitoring led by school eco-clubs",
      "Fuel-efficient stove program reducing firewood demand",
    ],
    gallery: [
      { src: "/green-monkey-african-forest.jpg", alt: "Green monkey moving through restored woodland" },
  { src: "/dense-forest-canopy-abuko-gambia.jpg", alt: "Sunlit woodland canopy" },
      { src: "/nature-trail-tropical-forest.jpg", alt: "Community members maintaining woodland trail" },
    ],
  },
  {
    name: "Tujereng Village Forest Reserve",
    region: "West Coast Region",
    summary:
      "Sacred forest groves maintained by Tujereng's cultural custodians safeguard medicinal plants and support seasonal rites important to the community's identity.",
    highlights: [
      "Herbalist cooperative documenting traditional knowledge",
      "Ritual access zones managed by village elders",
      "Youth-led forest fire prevention patrols each dry season",
    ],
    gallery: [
      { src: "/tropical-gallery-forest-gambia.jpg", alt: "Dense forest canopy in sacred grove" },
      { src: "/tumani-tenda-traditional-medicine-garden.jpg", alt: "Traditional healers processing forest herbs" },
      { src: "/makasutu-traditional-ceremony.jpg", alt: "Community ceremony within forest clearing" },
    ],
  },
  {
    name: "Batokunku Mangrove Project",
    region: "West Coast Region",
    summary:
      "Volunteer network restoring Batokunku's tidal channels to improve fish nurseries and storm resilience while creating eco-education trails for visitors.",
    highlights: [
      "6600 propagules planted across 12 hectares",
      "Floating boardwalk designed by local carpenters",
      "Climate-smart salt-resistant farms piloted nearby",
    ],
    gallery: [
      { src: "/baobolong-mangrove-restoration.jpg", alt: "Volunteers planting mangrove propagules" },
      { src: "/gambia-river-mangroves-wildlife.jpg", alt: "Mangrove roots sheltering juvenile fish" },
      { src: "/coastal-mangrove-atlantic-ocean-gambia.jpg", alt: "Mangrove-lined channel at sunset" },
    ],
  },
  {
    name: "Berending Fishing Grounds",
    region: "North Bank Region",
    summary:
      "Berending's fisherfolk councils blend indigenous bylaws with modern fisheries science to protect spawning seasons and limit destructive gear along the estuary.",
    highlights: [
      "Seasonal fishing closures enforced by community rangers",
      "Gear-exchange program replacing destructive nets",
      "Conflict resolution platform linking upstream villages",
    ],
    gallery: [
      { src: "/baobolong-fishing-community.jpg", alt: "Fisherfolk preparing nets at sunrise" },
      { src: "/gambia-river-islands-forest.jpg", alt: "Islands within the Berending estuary" },
      { src: "/gambia-river-mangroves-wildlife.jpg", alt: "Mangrove-fringed fishing channel" },
    ],
  },
  {
    name: "Kuntaur River Conservation",
    region: "Central River Region",
    summary:
      "Kuntaur boat operators and rice growers collaborate to maintain wildlife-friendly riverbanks that host hippos, manatees, and migratory birds.",
    highlights: [
      "Riverbank re-vegetation with vetiver and raffia",
      "Solar-powered cold storage for fish cooperatives",
      "Ethical river cruise guidelines adopted by tour guild",
    ],
    gallery: [
      { src: "/wide-gambia-river-aerial-view.jpg", alt: "Aerial view of the Gambia River near Kuntaur" },
  { src: "/pirang-nature-trail.jpg", alt: "Community members monitoring riverbank vegetation" },
      { src: "/gambia-river-islands-forest.jpg", alt: "River islands supporting wildlife" },
    ],
  },
  {
    name: "Janjanbureh Island Preserve",
    region: "Central River Region",
    summary:
      "Heritage custodians in Janjanbureh preserve riparian forests and stone masonry sites while advancing eco-tourism training for youth across the island.",
    highlights: [
      "Heritage trails linking historic prison and sacred groves",
      "Solar ferry project reducing diesel use on the river",
      "Bird-watching guide academy certifying local youth",
    ],
    gallery: [
      { src: "/pirang-environmental-education.jpg", alt: "Guided interpretation tour on Janjanbureh Island" },
      { src: "/pirang-bird-watching.jpg", alt: "Bird watchers along the river banks" },
      { src: "/tumani-tenda-wildlife-corridor.jpg", alt: "Riverine forest path on the island" },
    ],
  },
  {
    name: "Wassu Stone Circle Guardians",
    region: "Central River Region",
    summary:
      "Community custodians safeguard the UNESCO-listed Wassu stone circles, integrating cultural tourism with grassroots savanna restoration.",
    highlights: [
      "Rehabilitation of savanna grasses around heritage site",
      "Interpretive center blending oral history with archaeology",
      "School outreach program teaching stone alignment astronomy",
    ],
    gallery: [
      { src: "/makasutu-forest-canopy.jpg", alt: "Community members tending savanna grasses" },
      { src: "/tumani-tenda-village-life.jpg", alt: "Storytelling session with heritage custodians" },
      { src: "/gambia-river-islands-forest.jpg", alt: "Rolling savanna near the stone circles" },
    ],
  },
  {
    name: "Georgetown Wetland Initiative",
    region: "Central River Region",
    summary:
      "Georgetown women's cooperatives protect wetlands for rice, fish, and fibers while piloting floating gardens that withstand seasonal flooding.",
    highlights: [
      "Floating garden demonstration plots with indigenous crops",
      "Community waterbird monitoring using citizen science apps",
      "Wetland craft enterprise weaving papyrus mats",
    ],
    gallery: [
      { src: "/baobolong-bird-habitat.jpg", alt: "Wetland with abundant birdlife" },
      { src: "/pirang-nature-trail.jpg", alt: "Wooden walkway through wetlands" },
      { src: "/migratory-shorebirds-mudflats.jpg", alt: "Women harvesting reeds in wetland" },
    ],
  },
  {
    name: "Soma Community Gardens",
    region: "Lower River Region",
    summary:
      "Soma's irrigated gardens apply climate-smart drip systems while protecting surrounding acacia groves that provide pollinator habitat.",
    highlights: [
      "Community compost hub diverting market waste",
      "Drip irrigation reducing water use by 45%",
      "Beekeeping rings providing pollination services",
    ],
    gallery: [
      { src: "/tumani-tenda-traditional-medicine-garden.jpg", alt: "Women managing irrigated community gardens" },
      { src: "/migratory-shorebirds-mudflats.jpg", alt: "Pollinator-friendly hedgerows" },
      { src: "/tumani-tenda-village-life.jpg", alt: "Market day featuring garden produce" },
    ],
  },
  {
    name: "Kaiaf River Protection Zone",
    region: "Lower River Region",
    summary:
      "Kaiaf fishers and rice farmers coordinate sluice gates and no-take zones to keep tidal channels healthy for both livelihoods and wildlife.",
    highlights: [
      "No-night-fishing pact reducing bycatch of juvenile fish",
      "Community-managed sluice gates preventing salt intrusion",
      "Shared watchtowers monitoring bird nesting colonies",
    ],
    gallery: [
      { src: "/gambia-river-mangroves-wildlife.jpg", alt: "Mangrove-lined Kaiaf river channel" },
      { src: "/baobolong-fishing-community.jpg", alt: "Fishers coordinating at the riverbank" },
      { src: "/baobolong-mangrove-restoration.jpg", alt: "Restored mangrove roots along tidal creek" },
    ],
  },
  {
    name: "Farafenni Woodland Reserve",
    region: "North Bank Region",
    summary:
      "Farafenni elders oversee woodland reserves that shield boreholes from sedimentation and provide wildlife corridors for antelope species.",
    highlights: [
      "Rotational grazing zones agreed with pastoral groups",
      "Community-led anti-poaching patrols using GPS",
      "School woodlots supplying sustainable fuelwood",
    ],
    gallery: [
      { src: "/green-monkey-african-forest.jpg", alt: "Antelope moving through woodland reserve" },
  { src: "/dense-forest-canopy-abuko-gambia.jpg", alt: "Woodland canopy protecting water points" },
      { src: "/nature-trail-tropical-forest.jpg", alt: "Community patrol along woodland trail" },
    ],
  },
  {
    name: "Kerewan Village Commons",
    region: "North Bank Region",
    summary:
      "An innovative commons agreement balancing millet farms, grazing cattle, and community forests in Kerewan's floodplain.",
    highlights: [
      "Participatory land-use mapping updated annually",
      "Livestock corridors fenced with living hedgerows",
      "Community grain bank supporting lean-season food security",
    ],
    gallery: [
      { src: "/gambia-river-islands-forest.jpg", alt: "Floodplain mosaic managed by Kerewan" },
      { src: "/tumani-tenda-village-life.jpg", alt: "Farmers discussing commons management" },
      { src: "/tumani-tenda-wildlife-corridor.jpg", alt: "Living hedgerows guiding livestock" },
    ],
  },
  {
    name: "Essau Community Forest",
    region: "North Bank Region",
    summary:
      "Essau's community forest protects culturally significant Baobab groves while providing income through sustainable honey harvesting.",
    highlights: [
      "Honey cooperatives certified under forest-friendly label",
      "Baobab fruit processing for local markets",
      "Annual forest festivals celebrating traditional custodians",
    ],
    gallery: [
      { src: "/baobolong-bird-habitat.jpg", alt: "Baobab tree canopy in Essau forest" },
      { src: "/tumani-tenda-traditional-medicine-garden.jpg", alt: "Processing baobab fruit in community center" },
      { src: "/tumani-tenda-village-life.jpg", alt: "Festival celebration within the forest" },
    ],
  },
  {
    name: "Barra Point Conservation",
    region: "North Bank Region",
    summary:
      "Barra fishers and eco-guides protect the estuary mouth, ensuring safe passages for dolphins, manatees, and ferry traffic.",
    highlights: [
      "Citizen science dolphin surveys each quarter",
      "Emergency response plan for strandings and oil spills",
      "Eco-guiding training highlighting cultural heritage",
    ],
    gallery: [
      { src: "/atlantic-coast-sunset-gambia.jpg", alt: "Sunset over Barra estuary" },
      { src: "/gambia-river-islands-forest.jpg", alt: "Dolphins swimming near the estuary" },
      { src: "/african-fish-eagle-river.jpg", alt: "Fisher observing river wildlife" },
    ],
  },
  {
    name: "Albreda Historic Grove",
    region: "North Bank Region",
    summary:
      "Albreda preserves sacred silk-cotton trees that mark ancestral sites and support cultural tourism linked with the Kunta Kinteh Island narrative.",
    highlights: [
      "Ancestral storytelling tours featuring griot performances",
      "Cultural mapping of sacred trees using youth researchers",
      "Partnership with UNESCO heritage interpreters",
    ],
    gallery: [
      { src: "/tumani-tenda-village-life.jpg", alt: "Griot storytelling beneath sacred tree" },
      { src: "/nature-trail-tropical-forest.jpg", alt: "Visitors walking through historic grove" },
      { src: "/makasutu-traditional-ceremony.jpg", alt: "Ceremonial gathering in the grove" },
    ],
  },
  {
    name: "Juffureh Heritage Forest",
    region: "North Bank Region",
    summary:
      "Juffureh's heritage forest links river-based tourism with community reforestation and craft markets celebrating traditional artistry.",
    highlights: [
      "Craft market featuring sustainably harvested materials",
      "Reforestation of riverbank erosion hotspots",
      "Inter-generational oral history documentation workshops",
    ],
    gallery: [
      { src: "/tumani-tenda-village-life.jpg", alt: "Artisan weaving using forest materials" },
      { src: "/gambia-river-islands-forest.jpg", alt: "Riverbank reforestation efforts" },
      { src: "/pirang-environmental-education.jpg", alt: "Students learning about heritage forest" },
    ],
  },
  {
    name: "Bansang Community Reserve",
    region: "Central River Region",
    summary:
      "Bansang's community reserve protects gallery forests along seasonal streams, enabling sustainable harvest of medicinal barks and dyes.",
    highlights: [
      "Medicinal plant inventory led by women healers",
      "Seasonal dye workshops producing eco-textiles",
      "Firebreak maintenance teams reducing dry-season fires",
    ],
    gallery: [
      { src: "/icca-traditional-knowledge.jpg", alt: "Women processing medicinal plants" },
      { src: "/nature-trail-tropical-forest.jpg", alt: "Gallery forest footpath" },
      { src: "/tumani-tenda-traditional-medicine-garden.jpg", alt: "Community dyeing workshop" },
    ],
  },
  {
    name: "Basse Forest Initiative",
    region: "Upper River Region",
    summary:
      "Upper River youth groups regenerate degraded woodland patches around Basse, integrating fuelwood plantations with wildlife corridors.",
    highlights: [
      "Volunteer tree-planting brigades covering 18 hectares",
      "Efficient charcoal kilns reducing emissions by 30%",
      "Wildlife corridor signage co-designed with schools",
    ],
    gallery: [
  { src: "/dense-forest-canopy-abuko-gambia.jpg", alt: "Restored woodland canopy in Basse" },
      { src: "/tumani-tenda-wildlife-corridor.jpg", alt: "Corridor signage with youth volunteers" },
      { src: "/nature-trail-tropical-forest.jpg", alt: "Community tending young trees" },
    ],
  },
  {
    name: "Fatoto River Conservation",
    region: "Upper River Region",
    summary:
      "Communities along the Fatoto reach of the Gambia River protect riparian forests vital for migratory birds and sustain flood-resilient farming.",
    highlights: [
      "Bird ringing station tagging Palearctic migrants",
      "Floating fish cages piloted with local cooperatives",
      "Emergency response plan for flood early warning",
    ],
    gallery: [
      { src: "/migratory-shorebirds-mudflats.jpg", alt: "Migratory birds resting along Fatoto wetlands" },
      { src: "/gambia-river-islands-forest.jpg", alt: "Riparian forest near Fatoto" },
      { src: "/baobolong-fishing-community.jpg", alt: "Fishers managing floating cages" },
    ],
  },
  {
    name: "Koina Village Preserve",
    region: "Upper River Region",
    summary:
      "Koina villagers manage woodland mosaics to safeguard drought-resistant tree species that supply fodder and traditional medicines.",
    highlights: [
      "Community seed bank featuring resilient tree species",
      "Rotational fodder harvesting preserving pod yields",
      "Traditional medicine apprenticeships for youth",
    ],
    gallery: [
      { src: "/tumani-tenda-traditional-medicine-garden.jpg", alt: "Preparing herbal remedies in Koina" },
  { src: "/dense-forest-canopy-abuko-gambia.jpg", alt: "Woodland mosaic within Koina preserve" },
      { src: "/nature-trail-tropical-forest.jpg", alt: "Guided walk highlighting medicinal trees" },
    ],
  },
  {
    name: "Sabi Community Woodlands",
    region: "Upper River Region",
    summary:
      "Village forest committees in Sabi regulate fuelwood harvesting, ensuring woodland regeneration and providing carbon income through small offsets.",
    highlights: [
      "Digital permits regulating fuelwood extraction",
      "Carbon monitoring training with national forestry department",
      "Women's microfinance group investing in solar cookers",
    ],
    gallery: [
  { src: "/dense-forest-canopy-abuko-gambia.jpg", alt: "Woodland regeneration in Sabi" },
      { src: "/tumani-tenda-village-life.jpg", alt: "Women attending finance training" },
      { src: "/nature-trail-tropical-forest.jpg", alt: "Community inventorying tree growth" },
    ],
  },
  {
    name: "Gambissara Heritage Site",
    region: "Upper River Region",
    summary:
      "Gambissara protects an ancestral fortress site surrounded by rare tall woodland, blending cultural safeguarding with biodiversity corridors.",
    highlights: [
      "Interpretive center documenting resistance history",
      "Community scouts patrolling wildlife corridors",
      "Cultural festivals raising funds for forest upkeep",
    ],
    gallery: [
      { src: "/tumani-tenda-village-life.jpg", alt: "Cultural festival within Gambissara" },
  { src: "/dense-forest-canopy-abuko-gambia.jpg", alt: "Tall woodland surrounding heritage site" },
      { src: "/tumani-tenda-wildlife-corridor.jpg", alt: "Wildlife corridor signage near fortress" },
    ],
  },
]
export const honoraryIccaMap = honoraryIccaDetails.reduce<Record<string, HonoraryICCA>>((acc, icca) => {
  acc[icca.name] = icca
  return acc
}, {})
