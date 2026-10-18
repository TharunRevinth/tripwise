import { Destination, Category } from '@/types';

// Curated high-fidelity destination database with real coordinates and authentic imagery
export const SEED_DESTINATIONS: Destination[] = [
  // --- CHENNAI (Host City / VIT) ---
  {
    id: 'chennai-kapaleeshwarar',
    name: 'Kapaleeshwarar Temple',
    city: 'Chennai',
    country: 'India',
    category: 'Historical',
    description: 'A 7th-century Dravidian marvel dedicated to Lord Shiva in Mylapore, featuring an intricately carved 37-meter rainbow gopuram.',
    imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 3420,
    latitude: 13.0336,
    longitude: 80.2699,
    priceLevel: '$',
    tags: ['Architecture', 'Spirituality', 'Ancient', 'Heritage'],
    bestTimeToVisit: 'November to February',
    address: 'Kutchery Rd, Mylapore, Chennai, Tamil Nadu 600004'
  },
  {
    id: 'chennai-marina-beach',
    name: 'Marina Beach',
    city: 'Chennai',
    country: 'India',
    category: 'Nature',
    description: 'The world’s second-longest urban beach stretching 13 kilometers along the Coromandel Coast with a vibrant evening promenade.',
    imageUrl: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    reviewCount: 8940,
    latitude: 13.0500,
    longitude: 80.2824,
    priceLevel: '$',
    tags: ['Coastline', 'Sunset', 'Street Food', 'Historic Lighthouse'],
    bestTimeToVisit: 'October to March',
    address: 'Marina Beach Promenade, Triplicane, Chennai 600005'
  },
  {
    id: 'chennai-san-thome',
    name: 'San Thome Basilica',
    city: 'Chennai',
    country: 'India',
    category: 'Landmarks',
    description: 'Neo-Gothic Roman Catholic minor basilica built over the tomb of St. Thomas the Apostle, standing right beside the sea.',
    imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewCount: 2180,
    latitude: 13.0338,
    longitude: 80.2785,
    priceLevel: '$',
    tags: ['Neo-Gothic', 'Religious', 'Museum', 'Architecture'],
    bestTimeToVisit: 'November to February',
    address: '38 Santhome High Rd, Mylapore, Chennai 600004'
  },
  {
    id: 'chennai-murugan-idli',
    name: 'Murugan Idli Shop & Filter Coffee',
    city: 'Chennai',
    country: 'India',
    category: 'Food & Dining',
    description: 'Legendary culinary institution famed for piping-hot melt-in-mouth idlis, crispy ghee podi dosas, and four varieties of fresh chutney.',
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 12500,
    latitude: 13.0416,
    longitude: 80.2337,
    priceLevel: '$',
    tags: ['South Indian', 'Authentic', 'Filter Coffee', 'Breakfast'],
    bestTimeToVisit: 'All Year',
    address: 'GN Chetty Rd, T. Nagar, Chennai 600017'
  },
  {
    id: 'chennai-dakshinachitra',
    name: 'DakshinaChitra Living Heritage Museum',
    city: 'Chennai',
    country: 'India',
    category: 'Culture',
    description: 'An open-air living history museum showcasing the authentic architecture, crafts, and performing arts of South India across 18 heritage houses.',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewCount: 4120,
    latitude: 12.8252,
    longitude: 80.2435,
    priceLevel: '$$',
    tags: ['Handicrafts', 'Living Museum', 'South India', 'Folk Dance'],
    bestTimeToVisit: 'November to February',
    address: 'East Coast Road, Muttukadu, Chennai 603112'
  },

  // --- TOKYO ---
  {
    id: 'tokyo-sensoji',
    name: 'Sensō-ji Temple & Asakusa',
    city: 'Tokyo',
    country: 'Japan',
    category: 'Historical',
    description: 'Tokyo’s oldest Buddhist temple founded in 645 AD, approached via the bustling Nakamise-dori shopping street under the giant red Kaminarimon lantern.',
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 15400,
    latitude: 35.7148,
    longitude: 139.7967,
    priceLevel: '$',
    tags: ['Buddhist Temple', 'Traditional', 'Incense', 'Asakusa'],
    bestTimeToVisit: 'March to May & October to November',
    address: '2 Chome-3-1 Asakusa, Taito City, Tokyo 111-0032'
  },
  {
    id: 'tokyo-shinjuku-gyoen',
    name: 'Shinjuku Gyoen National Garden',
    city: 'Tokyo',
    country: 'Japan',
    category: 'Nature',
    description: 'Sprawling 144-acre imperial park blending traditional Japanese landscape gardens with English landscape and French formal gardens.',
    imageUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 9230,
    latitude: 35.6852,
    longitude: 139.7101,
    priceLevel: '$',
    tags: ['Cherry Blossoms', 'Gardens', 'Tea House', 'Peaceful'],
    bestTimeToVisit: 'Late March to April (Sakura)',
    address: '11 Naitomachi, Shinjuku City, Tokyo 160-0014'
  },
  {
    id: 'tokyo-teamlab-planets',
    name: 'teamLab Planets TOKYO',
    city: 'Tokyo',
    country: 'Japan',
    category: 'Entertainment',
    description: 'Mind-bending interactive digital art museum where visitors walk barefoot through immersive water projections, mirror rooms, and glowing crystal gardens.',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 18450,
    latitude: 35.6518,
    longitude: 139.7897,
    priceLevel: '$$$',
    tags: ['Digital Art', 'Sensory', 'Photography', 'Futuristic'],
    bestTimeToVisit: 'All Year',
    address: '6 Chome-1-16 Toyosu, Koto City, Tokyo 135-0061'
  },
  {
    id: 'tokyo-tsukiji-market',
    name: 'Tsukiji Outer Food Market',
    city: 'Tokyo',
    country: 'Japan',
    category: 'Food & Dining',
    description: 'Lively culinary labyrinth packed with hundreds of stalls offering wagyu skewers, freshly sliced sashimi, grilled eel, tamagoyaki, and matcha desserts.',
    imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 11200,
    latitude: 35.6655,
    longitude: 139.7708,
    priceLevel: '$$',
    tags: ['Street Food', 'Fresh Sushi', 'Wagyu', 'Market'],
    bestTimeToVisit: 'Morning (8:00 AM - 1:00 PM)',
    address: '4 Chome-16-2 Tsukiji, Chuo City, Tokyo 104-0045'
  },

  // --- PARIS ---
  {
    id: 'paris-eiffel-tower',
    name: 'Eiffel Tower & Champ de Mars',
    city: 'Paris',
    country: 'France',
    category: 'Landmarks',
    description: 'Gustave Eiffel’s wrought-iron lattice icon rising 330 meters above Paris, offering panoramic vistas across the City of Light.',
    imageUrl: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 32000,
    latitude: 48.8584,
    longitude: 2.2945,
    priceLevel: '$$',
    tags: ['Iconic', 'Panoramas', 'Sunset', 'Architecture'],
    bestTimeToVisit: 'April to October',
    address: 'Champ de Mars, 5 Av. Anatole France, 75007 Paris'
  },
  {
    id: 'paris-louvre-museum',
    name: 'Louvre Museum',
    city: 'Paris',
    country: 'France',
    category: 'Culture',
    description: 'The world’s most-visited museum housed in a former royal fortress, containing over 35,000 works of art including the Mona Lisa and Venus de Milo.',
    imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 42100,
    latitude: 48.8606,
    longitude: 2.3376,
    priceLevel: '$$',
    tags: ['Art Masterpieces', 'Sculpture', 'History', 'Mona Lisa'],
    bestTimeToVisit: 'Wednesday & Friday Evenings',
    address: 'Rue de Rivoli, 75001 Paris'
  },
  {
    id: 'paris-montmartre',
    name: 'Montmartre & Sacré-Cœur',
    city: 'Paris',
    country: 'France',
    category: 'Historical',
    description: 'Bohemian hilltop artists’ village crowned by the Romano-Byzantine Sacré-Cœur Basilica, filled with cobblestone alleyways and quaint bistros.',
    imageUrl: 'https://images.unsplash.com/photo-1509299349698-dd22323b5963?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewCount: 16700,
    latitude: 48.8867,
    longitude: 2.3431,
    priceLevel: '$',
    tags: ['Bohemian', 'Viewpoint', 'Cafes', 'Artists'],
    bestTimeToVisit: 'May to September',
    address: '35 Rue du Chevalier de la Barre, 75018 Paris'
  },

  // --- NEW YORK ---
  {
    id: 'nyc-central-park',
    name: 'Central Park',
    city: 'New York',
    country: 'USA',
    category: 'Nature',
    description: 'An 843-acre urban oasis in the center of Manhattan with winding pathways, Bethesda Terrace, serene lakes, and carriage paths.',
    imageUrl: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 28900,
    latitude: 40.7829,
    longitude: -73.9654,
    priceLevel: '$',
    tags: ['Nature', 'Walking', 'Biking', 'Iconic Manhattan'],
    bestTimeToVisit: 'May to October',
    address: 'Central Park, New York, NY 10024'
  },
  {
    id: 'nyc-broadway',
    name: 'Broadway & Times Square Theater District',
    city: 'New York',
    country: 'USA',
    category: 'Entertainment',
    description: 'The global heart of live commercial theater, pulsating with dazzling digital billboards, blockbuster musicals, and historic playhouses.',
    imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 19800,
    latitude: 40.7580,
    longitude: -73.9855,
    priceLevel: '$$$$',
    tags: ['Musicals', 'Neon Lights', 'Live Performance', 'Nightlife'],
    bestTimeToVisit: 'All Year',
    address: 'Broadway & 7th Ave, New York, NY 10036'
  },
  {
    id: 'nyc-high-line',
    name: 'The High Line & Chelsea Market',
    city: 'New York',
    country: 'USA',
    category: 'Landmarks',
    description: 'A 1.45-mile elevated railway converted into a public parkway suspended above Manhattan streets, ending at Chelsea Market’s artisanal food hall.',
    imageUrl: 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewCount: 14500,
    latitude: 40.7480,
    longitude: -74.0048,
    priceLevel: '$$',
    tags: ['Architecture', 'Urban Garden', 'Food Hall', 'Walking'],
    bestTimeToVisit: 'April to October',
    address: 'The High Line, New York, NY 10011'
  },

  // --- ROME ---
  {
    id: 'rome-colosseum',
    name: 'The Roman Colosseum & Forum',
    city: 'Rome',
    country: 'Italy',
    category: 'Historical',
    description: 'The monumental Flavian Amphitheatre completed in 80 AD, representing the apex of Roman engineering where gladiators once fought.',
    imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 38400,
    latitude: 41.8902,
    longitude: 12.4922,
    priceLevel: '$$',
    tags: ['Ancient Roman', 'Gladiators', 'World Wonder', 'Archaeology'],
    bestTimeToVisit: 'April to June & September to October',
    address: 'Piazza del Colosseo, 1, 00184 Roma RM, Italy'
  },
  {
    id: 'rome-trastevere-food',
    name: 'Trastevere Artisan Trattorias',
    city: 'Rome',
    country: 'Italy',
    category: 'Food & Dining',
    description: 'Cobblestone medieval quarter famed for traditional Roman pastas: Cacio e Pepe, Carbonara, crispy fried artichokes, and artisanal gelato.',
    imageUrl: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 9400,
    latitude: 41.8890,
    longitude: 12.4700,
    priceLevel: '$$',
    tags: ['Pasta', 'Wine', 'Atmospheric', 'Gelato'],
    bestTimeToVisit: 'Evening (7:00 PM onwards)',
    address: 'Trastevere, 00153 Rome, Italy'
  },

  // --- BALI ---
  {
    id: 'bali-ubud-terraces',
    name: 'Tegallalang Rice Terraces',
    city: 'Bali',
    country: 'Indonesia',
    category: 'Nature',
    description: 'Emerald-green stepped rice paddies sculpted into the valley hillside utilizing the ancient Balinese cooperative subak irrigation system.',
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewCount: 16100,
    latitude: -8.4333,
    longitude: 115.2811,
    priceLevel: '$',
    tags: ['Rice Fields', 'Subak', 'Jungle Swing', 'Photography'],
    bestTimeToVisit: 'April to October',
    address: 'Jl. Raya Tegallalang, Gianyar, Bali 80561'
  },
  {
    id: 'bali-tanah-lot',
    name: 'Tanah Lot Sea Temple',
    city: 'Bali',
    country: 'Indonesia',
    category: 'Landmarks',
    description: 'Ancient sea temple perched upon an offshore rock formation carved by ocean tides, famous for dramatic golden sunsets over the Indian Ocean.',
    imageUrl: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 14200,
    latitude: -8.6212,
    longitude: 115.0868,
    priceLevel: '$',
    tags: ['Sea Temple', 'Sunset', 'Ocean', 'Spiritual'],
    bestTimeToVisit: 'May to September',
    address: 'Beraban, Kediri, Tabanan Regency, Bali 82121'
  },
  {
    id: 'bali-uluwatu-temple',
    name: 'Uluwatu Cliff Temple & Kecak Dance',
    city: 'Bali',
    country: 'Indonesia',
    category: 'Culture',
    description: 'Cliffside sea temple perched 70 meters above crashing Indian Ocean surf, world-famous for sunset Kecak fire dance performances against panoramic skies.',
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 19800,
    latitude: -8.8291,
    longitude: 115.0849,
    priceLevel: '$$',
    tags: ['Cliff View', 'Kecak Fire Dance', 'Sunset', 'Culture'],
    bestTimeToVisit: 'June to August',
    address: 'Pecatu, South Kuta, Badung Regency, Bali 80361'
  },

  // --- KYOTO (Japan) ---
  {
    id: 'kyoto-fushimi-inari',
    name: 'Fushimi Inari-taisha Senbon Torii',
    city: 'Kyoto',
    country: 'Japan',
    category: 'Historical',
    description: 'Breathtaking mountain shrine path flanked by over 10,000 vibrant vermilion torii gates winding up sacred Mount Inari, dedicated to the Shinto deity of harvest.',
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 48900,
    latitude: 34.9671,
    longitude: 135.7727,
    priceLevel: '$',
    tags: ['Torii Gates', 'Shinto Shrine', 'Mountain Trail', 'Iconic Japan'],
    bestTimeToVisit: 'Early morning or late afternoon',
    address: '68 Fukakusa Yabunouchicho, Fushimi Ward, Kyoto 612-0882'
  },
  {
    id: 'kyoto-kinkakuji',
    name: 'Kinkaku-ji (The Golden Pavilion)',
    city: 'Kyoto',
    country: 'Japan',
    category: 'Landmarks',
    description: 'Zen Buddhist temple with top two floors completely covered in brilliant gold leaf, shimmering majestically above the mirror pond Kyōko-chi in a tranquil moss garden.',
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 29500,
    latitude: 35.0394,
    longitude: 135.7292,
    priceLevel: '$',
    tags: ['Zen Temple', 'Gold Leaf', 'Reflecting Pond', 'UNESCO World Heritage'],
    bestTimeToVisit: 'October to November (Autumn foliage)',
    address: '1 Kinkakujicho, Kita Ward, Kyoto 603-8361'
  },
  {
    id: 'kyoto-arashiyama-bamboo',
    name: 'Arashiyama Bamboo Grove',
    city: 'Kyoto',
    country: 'Japan',
    category: 'Nature',
    description: 'Towering emerald bamboo stalks whispering in the mountain breeze along a mystical pathway leading to historic zen gardens and the Oi River.',
    imageUrl: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 22100,
    latitude: 35.0169,
    longitude: 135.6713,
    priceLevel: '$',
    tags: ['Bamboo Forest', 'Nature Walk', 'Peaceful', 'Photography'],
    bestTimeToVisit: 'April to May & October',
    address: 'Sagatenryuji Ukyoku, Kyoto 616-8385'
  },

  // --- DELHI & AGRA (India) ---
  {
    id: 'agra-taj-mahal',
    name: 'Taj Mahal & Yamuna Waterfront',
    city: 'Delhi',
    country: 'India',
    category: 'Historical',
    description: 'An immortal white marble mausoleum commissioned in 1631 by Mughal Emperor Shah Jahan, recognized globally as the pinnacle of Mughal artistic architecture.',
    imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    reviewCount: 65000,
    latitude: 27.1751,
    longitude: 78.0421,
    priceLevel: '$$',
    tags: ['New 7 Wonders', 'Mughal Architecture', 'Marble Masterpiece', 'Sunrise'],
    bestTimeToVisit: 'October to March (Sunrise visit)',
    address: 'Dharmapuri, Forest Colony, Tajganj, Agra, Uttar Pradesh 282001'
  },
  {
    id: 'delhi-qutub-minar',
    name: 'Qutub Minar Complex',
    city: 'Delhi',
    country: 'India',
    category: 'Landmarks',
    description: 'A soaring 73-meter victory tower of fluted red sandstone and marble built in 1192, surrounded by ancient ruins including the 4th-century rust-resistant Iron Pillar.',
    imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewCount: 28400,
    latitude: 28.5245,
    longitude: 77.1855,
    priceLevel: '$',
    tags: ['UNESCO World Heritage', 'Sandstone Minaret', 'Ancient Ruins', 'Mughal History'],
    bestTimeToVisit: 'November to February',
    address: 'Seth Sarai, Mehrauli, New Delhi 110030'
  },

  // --- ROME & VATICAN EXPANSION ---
  {
    id: 'rome-trevi-fountain',
    name: 'Trevi Fountain & Piazza Navona',
    city: 'Rome',
    country: 'Italy',
    category: 'Landmarks',
    description: 'The monumental Baroque fountain designed by Nicola Salvi where legend holds tossing a coin over your left shoulder guarantees a return to the Eternal City.',
    imageUrl: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 44200,
    latitude: 41.9009,
    longitude: 12.4833,
    priceLevel: '$',
    tags: ['Baroque Sculpture', 'Coin Toss', 'Evening Illuminations', 'Historic Square'],
    bestTimeToVisit: 'Late night or early morning',
    address: 'Piazza di Trevi, 00187 Roma RM, Italy'
  },
  {
    id: 'rome-pantheon',
    name: 'The Pantheon of Agrippa',
    city: 'Rome',
    country: 'Italy',
    category: 'Historical',
    description: 'Nearly 2,000-year-old Roman temple boasting the world’s largest unreinforced concrete dome with its celestial central oculus illuminating marble interiors.',
    imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 39100,
    latitude: 41.8986,
    longitude: 12.4769,
    priceLevel: '$',
    tags: ['Ancient Architecture', 'Concrete Dome', 'Oculus', 'Renaissance Tombs'],
    bestTimeToVisit: 'Midday when sunbeams pour through the oculus',
    address: 'Piazza della Rotonda, 00186 Roma RM, Italy'
  },

  // --- NEW YORK EXPANSION ---
  {
    id: 'nyc-brooklyn-bridge',
    name: 'Brooklyn Bridge & DUMBO Waterfront',
    city: 'New York',
    country: 'USA',
    category: 'Landmarks',
    description: 'Walk across the historic 1883 neo-Gothic suspension bridge spanning the East River, concluding at DUMBO with postcard views of the Manhattan skyline.',
    imageUrl: 'https://images.unsplash.com/photo-1496868834840-5f4c98840aaa?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 36700,
    latitude: 40.7061,
    longitude: -73.9969,
    priceLevel: '$',
    tags: ['Suspension Bridge', 'Skyline Vistas', 'Sunset Walk', 'Iconic NYC'],
    bestTimeToVisit: 'Golden Hour (Sunset)',
    address: 'Brooklyn Bridge Promenade, New York, NY 10038'
  },

  // --- PARIS EXPANSION ---
  {
    id: 'paris-versailles',
    name: 'Palace of Versailles & Grand Canal',
    city: 'Paris',
    country: 'France',
    category: 'Historical',
    description: 'Opulent royal residence of the Sun King Louis XIV, famed for the glittering Hall of Mirrors, ornate King’s State Apartments, and geometrically sculpted fountains.',
    imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 31200,
    latitude: 48.8049,
    longitude: 2.1204,
    priceLevel: '$$$',
    tags: ['Royal Palace', 'Hall of Mirrors', 'Fountain Gardens', 'Baroque Architecture'],
    bestTimeToVisit: 'Tuesday to Friday mornings',
    address: 'Place d\'Armes, 78000 Versailles, France'
  }
];

export interface QueryOptions {
  country?: string;
  city?: string;
  search?: string;
  category?: Category;
  sortBy?: 'rating-desc' | 'name-asc' | 'name-desc';
}

export async function fetchDestinations(options: QueryOptions = {}): Promise<Destination[]> {
  const { country, city, search, category, sortBy } = options;

  let results = [...SEED_DESTINATIONS];

  // Optional: Try Geoapify external Places API if key is present
  const geoapifyKey = process.env.GEOAPIFY_API_KEY;
  if (geoapifyKey && city) {
    try {
      // Live external places query enhancement
      const url = `https://api.geoapify.com/v2/places?categories=tourism.sights,tourism.attraction&filter=place:${encodeURIComponent(city)}&limit=10&apiKey=${geoapifyKey}`;
      const res = await fetch(url, { next: { revalidate: 3600 } });
      if (res.ok) {
        const data = await res.json();
        if (data.features && data.features.length > 0) {
          const apiDestinations: Destination[] = data.features.map((feat: any, idx: number) => ({
            id: `geoapify-${feat.properties.place_id || idx}`,
            name: feat.properties.name || feat.properties.address_line1 || 'Historical Site',
            city: feat.properties.city || city,
            country: feat.properties.country || '',
            category: 'Landmarks',
            description: feat.properties.formatted || 'Notable attraction discovered via Geoapify Places API.',
            imageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
            rating: 4.5,
            reviewCount: 120,
            latitude: feat.properties.lat,
            longitude: feat.properties.lon,
            priceLevel: '$$',
            tags: ['Geoapify Live API', 'Attraction'],
            address: feat.properties.formatted
          }));

          // Merge without duplicates
          results = [...apiDestinations, ...results];
        }
      }
    } catch (err) {
      console.warn('Geoapify query warning, using cached seed data:', err);
    }
  }

  // Filter by Country
  if (country && country.toLowerCase() !== 'all') {
    results = results.filter((d) => d.country.toLowerCase() === country.toLowerCase());
  }

  // Filter by City
  if (city && city.toLowerCase() !== 'all') {
    results = results.filter((d) => d.city.toLowerCase() === city.toLowerCase());
  }

  // Filter by Category
  if (category && category !== 'All') {
    results = results.filter((d) => d.category.toLowerCase() === category.toLowerCase());
  }

  // Search keyword across name, description, tags, city, and country
  if (search && search.trim() !== '') {
    const q = search.toLowerCase().trim();
    results = results.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.city.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }

  // Sorting
  if (sortBy === 'rating-desc') {
    results.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'name-asc') {
    results.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === 'name-desc') {
    results.sort((a, b) => b.name.localeCompare(a.name));
  }

  return results;
}

export function getDestinationById(id: string): Destination | undefined {
  return SEED_DESTINATIONS.find((d) => d.id === id);
}

export function getFeaturedCities(): string[] {
  return ['All', 'Chennai', 'Delhi', 'Tokyo', 'Kyoto', 'Paris', 'New York', 'Rome', 'Bali'];
}
