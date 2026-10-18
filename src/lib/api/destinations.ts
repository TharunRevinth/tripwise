import { Destination, Category } from '@/types';

// Curated high-fidelity destination database covering top global travel hubs
export const SEED_DESTINATIONS: Destination[] = [
  // ==========================================
  // --- INDIA (🇮🇳) ---
  // ==========================================
  {
    id: 'chennai-kapaleeshwarar',
    name: 'Kapaleeshwarar Temple',
    city: 'Chennai',
    country: 'India',
    category: 'Historical',
    description: 'A 7th-century Dravidian marvel dedicated to Lord Shiva in Mylapore, featuring an intricately carved 37-meter rainbow gopuram and sacred temple tank.',
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
    name: 'Marina Beach Promenade',
    city: 'Chennai',
    country: 'India',
    category: 'Nature',
    description: 'The world’s second-longest urban beach stretching 13 kilometers along the Coromandel Coast with a lively evening promenade, street food, and lighthouse.',
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
    description: 'Neo-Gothic Roman Catholic minor basilica built over the tomb of St. Thomas the Apostle, standing right beside the sea in Mylapore.',
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
  {
    id: 'chennai-mahabalipuram',
    name: 'Mahabalipuram Shore Temple & Pancha Rathas',
    city: 'Chennai',
    country: 'India',
    category: 'Historical',
    description: '7th-century UNESCO World Heritage granite sanctuary carved during the Pallava dynasty overlooking the Bay of Bengal.',
    imageUrl: 'https://images.unsplash.com/photo-1609137144820-745a901844c8?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 14200,
    latitude: 12.6166,
    longitude: 80.1983,
    priceLevel: '$',
    tags: ['UNESCO World Heritage', 'Stone Carvings', 'Pallava Dynasty', 'Coastal Temple'],
    bestTimeToVisit: 'November to February',
    address: 'Shore Temple Rd, Mahabalipuram, Tamil Nadu 603104'
  },
  {
    id: 'delhi-taj-mahal',
    name: 'Taj Mahal & Mehtab Bagh',
    city: 'Delhi',
    country: 'India',
    category: 'Historical',
    description: 'An immortal white marble mausoleum commissioned in 1631 by Mughal Emperor Shah Jahan, recognized globally as a pinnacle of Mughal artistic architecture.',
    imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    reviewCount: 68000,
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
    description: 'A soaring 73-meter victory tower of fluted red sandstone and marble built in 1192, surrounded by ancient ruins including the 4th-century Iron Pillar.',
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
  {
    id: 'delhi-chandni-chowk',
    name: 'Chandni Chowk & Old Delhi Food Trail',
    city: 'Delhi',
    country: 'India',
    category: 'Food & Dining',
    description: 'Centuries-old bustling bazaar filled with the aromas of parathas, hot jalebis, kebabs, and authentic royal Mughal sweets.',
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 21500,
    latitude: 28.6506,
    longitude: 77.2303,
    priceLevel: '$',
    tags: ['Street Food', 'Heritage Bazaar', 'Spice Market', 'Historic'],
    bestTimeToVisit: 'Afternoons & Evenings',
    address: 'Chandni Chowk, Old Delhi 110006'
  },
  {
    id: 'delhi-humayun-tomb',
    name: 'Humayun’s Tomb Persian Gardens',
    city: 'Delhi',
    country: 'India',
    category: 'Culture',
    description: 'The monumental garden tomb that inspired the Taj Mahal, featuring symmetrical charbagh water channels and red sandstone domes.',
    imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 19800,
    latitude: 28.5933,
    longitude: 77.2507,
    priceLevel: '$',
    tags: ['Mughal Garden', 'Architecture', 'UNESCO', 'Photography'],
    bestTimeToVisit: 'Late afternoon for golden hour',
    address: 'Mathura Road, Nizamuddin East, New Delhi 110013'
  },
  {
    id: 'mumbai-gateway',
    name: 'Gateway of India & Colaba',
    city: 'Mumbai',
    country: 'India',
    category: 'Landmarks',
    description: 'Indo-Saracenic basalt arch monument erected in 1924 overlooking the Arabian Sea, adjacent to the historic Taj Mahal Palace hotel.',
    imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 38200,
    latitude: 18.9220,
    longitude: 72.8347,
    priceLevel: '$',
    tags: ['Colonial Architecture', 'Harbor View', 'Ferry Ride', 'Historic'],
    bestTimeToVisit: 'October to March',
    address: 'Apollo Bandar, Colaba, Mumbai, Maharashtra 400001'
  },
  {
    id: 'mumbai-marine-drive',
    name: 'Marine Drive & Chowpatty Beach',
    city: 'Mumbai',
    country: 'India',
    category: 'Nature',
    description: 'Curved 3.6-kilometer arc along the Arabian Sea known as the Queen’s Necklace, famed for glittering night lights and seaside breezes.',
    imageUrl: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewCount: 26500,
    latitude: 18.9432,
    longitude: 72.8230,
    priceLevel: '$',
    tags: ['Promenade', 'Arabian Sea', 'Street Food', 'Sunset'],
    bestTimeToVisit: 'Evenings (5:30 PM - 9:00 PM)',
    address: 'Netaji Subhash Chandra Bose Road, Mumbai 400020'
  },
  {
    id: 'jaipur-amber-fort',
    name: 'Amber Palace & Maota Lake',
    city: 'Jaipur',
    country: 'India',
    category: 'Historical',
    description: 'Majestic hilltop fortress built from yellow and pink sandstone, featuring the dazzling Sheesh Mahal (Mirror Palace) reflecting courtyard lights.',
    imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 32000,
    latitude: 26.9855,
    longitude: 75.8513,
    priceLevel: '$$',
    tags: ['Hill Fort', 'Mirror Palace', 'Rajput Architecture', 'Royal History'],
    bestTimeToVisit: 'October to March',
    address: 'Devisinghpura, Amer, Jaipur, Rajasthan 302001'
  },
  {
    id: 'jaipur-hawa-mahal',
    name: 'Hawa Mahal (Palace of Winds)',
    city: 'Jaipur',
    country: 'India',
    category: 'Landmarks',
    description: 'Five-story pink sandstone palace with 953 honeycomb jharokhas (casements) engineered so royal ladies could view street festivals unseen.',
    imageUrl: 'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 29800,
    latitude: 26.9239,
    longitude: 75.8267,
    priceLevel: '$',
    tags: ['Pink City', 'Honeycomb Lattice', 'Royal Heritage', 'Photography'],
    bestTimeToVisit: 'Early morning sunrise light',
    address: 'Hawa Mahal Rd, Badi Choupad, J.D.A. Market, Jaipur 302002'
  },
  {
    id: 'goa-palolem-beach',
    name: 'Palolem Beach & Silent Noise Headland',
    city: 'Goa',
    country: 'India',
    category: 'Nature',
    description: 'Crescent-shaped white sand cove in South Goa shaded by towering coconut palms, tranquil waters, and dolphin spotting cruises.',
    imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 18400,
    latitude: 15.0100,
    longitude: 74.0232,
    priceLevel: '$$',
    tags: ['Beaches', 'Kayaking', 'Dolphins', 'Shacks & Seafood'],
    bestTimeToVisit: 'November to March',
    address: 'Palolem, Canacona, South Goa 403702'
  },

  // ==========================================
  // --- JAPAN (🇯🇵) ---
  // ==========================================
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
    bestTimeToVisit: 'All Year (Reserve in advance)',
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
  {
    id: 'tokyo-shibuya-crossing',
    name: 'Shibuya Crossing & Scramble Square',
    city: 'Tokyo',
    country: 'Japan',
    category: 'Landmarks',
    description: 'The world’s busiest pedestrian intersection pulsating with neon video screens, the loyal Hachiko statue, and Shibuya Sky 360-degree observation deck.',
    imageUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 42000,
    latitude: 35.6595,
    longitude: 139.7005,
    priceLevel: '$',
    tags: ['Urban Icon', 'Neon Skyline', 'Hachiko', 'Nightlife'],
    bestTimeToVisit: 'Night (Dusk to 10 PM)',
    address: '2 Chome-2-1 Dogenzaka, Shibuya City, Tokyo 150-0043'
  },
  {
    id: 'tokyo-akihabara',
    name: 'Akihabara Electric Town & Manga Hub',
    city: 'Tokyo',
    country: 'Japan',
    category: 'Culture',
    description: 'The global capital of otaku culture, retro gaming arcades, multi-story electronics department stores, and anime collectible sanctuaries.',
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewCount: 19500,
    latitude: 35.6983,
    longitude: 139.7731,
    priceLevel: '$$',
    tags: ['Anime', 'Retro Gaming', 'Electronics', 'Japanese Pop Culture'],
    bestTimeToVisit: 'Afternoon (Sunday pedestrian zone)',
    address: 'Sotokanda, Chiyoda City, Tokyo 101-0021'
  },
  {
    id: 'kyoto-fushimi-inari',
    name: 'Fushimi Inari-taisha Senbon Torii',
    city: 'Kyoto',
    country: 'Japan',
    category: 'Historical',
    description: 'Breathtaking mountain shrine path flanked by over 10,000 vibrant vermilion torii gates winding up sacred Mount Inari.',
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
    description: 'Zen Buddhist temple with top two floors completely covered in brilliant gold leaf, shimmering majestically above a mirror pond.',
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
    name: 'Arashiyama Bamboo Grove & Tenryu-ji',
    city: 'Kyoto',
    country: 'Japan',
    category: 'Nature',
    description: 'Towering emerald bamboo stalks whispering in the mountain breeze along a mystical pathway leading to historic zen temples.',
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
  {
    id: 'osaka-dotonbori',
    name: 'Dotonbori Canal & Street Food Extravaganza',
    city: 'Osaka',
    country: 'Japan',
    category: 'Food & Dining',
    description: 'The culinary soul of western Japan, lined with giant glowing animatronic signs, famous takoyaki stalls, okonomiyaki grills, and kushikatsu.',
    imageUrl: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 31000,
    latitude: 34.6687,
    longitude: 135.5013,
    priceLevel: '$$',
    tags: ['Takoyaki', 'Okonomiyaki', 'Glico Man', 'Nightlife & Canal'],
    bestTimeToVisit: 'Evening (6:00 PM - 11:00 PM)',
    address: 'Dotonbori, Chuo Ward, Osaka 542-0071'
  },
  {
    id: 'osaka-castle',
    name: 'Osaka Castle & Park Gardens',
    city: 'Osaka',
    country: 'Japan',
    category: 'Historical',
    description: 'Magnificent 16th-century fortress encircled by monumental stone ramparts, moats, and hundreds of blossoming cherry and plum trees.',
    imageUrl: 'https://images.unsplash.com/photo-1569060488665-c3f25377ea1d?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewCount: 27500,
    latitude: 34.6873,
    longitude: 135.5262,
    priceLevel: '$',
    tags: ['Samurai History', 'Stone Moat', 'Cherry Blossom Park', 'Museum'],
    bestTimeToVisit: 'Late March to April (Sakura)',
    address: '1-1 Osakajo, Chuo Ward, Osaka 540-0002'
  },

  // ==========================================
  // --- FRANCE (🇫🇷) ---
  // ==========================================
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
    name: 'Louvre Museum & Glass Pyramid',
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
    name: 'Montmartre & Sacré-Cœur Basilica',
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
  {
    id: 'paris-versailles',
    name: 'Palace of Versailles & Grand Canal',
    city: 'Paris',
    country: 'France',
    category: 'Historical',
    description: 'Opulent royal residence of the Sun King Louis XIV, famed for the glittering Hall of Mirrors, ornate King’s State Apartments, and sculpted fountains.',
    imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 31200,
    latitude: 48.8049,
    longitude: 2.1204,
    priceLevel: '$$$',
    tags: ['Royal Palace', 'Hall of Mirrors', 'Fountain Gardens', 'Baroque Architecture'],
    bestTimeToVisit: 'Tuesday to Friday mornings',
    address: 'Place d\'Armes, 78000 Versailles, France'
  },
  {
    id: 'paris-arc-de-triomphe',
    name: 'Arc de Triomphe & Champs-Élysées',
    city: 'Paris',
    country: 'France',
    category: 'Landmarks',
    description: 'Neoclassical triumphal arch honoring French military victories at the western terminus of the world’s most celebrated boulevard.',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 28500,
    latitude: 48.8738,
    longitude: 2.2950,
    priceLevel: '$$',
    tags: ['Napoleonic', 'City Views', 'Champs-Élysées', 'Monument'],
    bestTimeToVisit: 'Sunset for sunset views down the avenue',
    address: 'Pl. Charles de Gaulle, 75008 Paris'
  },
  {
    id: 'nice-promenade',
    name: 'Promenade des Anglais & Castle Hill',
    city: 'Nice',
    country: 'France',
    category: 'Nature',
    description: 'World-famous Mediterranean coastal walkway along the sparkling azure waters of the Baie des Anges, leading to Castle Hill’s panoramic waterfalls.',
    imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 19400,
    latitude: 43.6953,
    longitude: 7.2656,
    priceLevel: '$',
    tags: ['French Riviera', 'Mediterranean Sea', 'Promenade', 'Palm Trees'],
    bestTimeToVisit: 'May to September',
    address: 'Promenade des Anglais, 06000 Nice, France'
  },
  {
    id: 'nice-old-town',
    name: 'Vieux Nice & Cours Saleya Flower Market',
    city: 'Nice',
    country: 'France',
    category: 'Food & Dining',
    description: 'Lively pedestrian market overflowing with fresh lavender, Provençal olive oils, artisanal cheeses, and hot crispy chickpea socca.',
    imageUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewCount: 14200,
    latitude: 43.6961,
    longitude: 7.2758,
    priceLevel: '$$',
    tags: ['Socca', 'Flower Market', 'Provençal', 'Cobblestone Alleys'],
    bestTimeToVisit: 'Morning (Tuesday to Sunday)',
    address: 'Cours Saleya, 06300 Nice, France'
  },

  // ==========================================
  // --- USA (🇺🇸) ---
  // ==========================================
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
  {
    id: 'nyc-met-museum',
    name: 'The Metropolitan Museum of Art (Met)',
    city: 'New York',
    country: 'USA',
    category: 'Culture',
    description: 'One of the world’s grandest cultural institutions housing 5,000 years of global art, from the Temple of Dendur to Impressionist masterpieces and a rooftop garden.',
    imageUrl: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 45000,
    latitude: 40.7794,
    longitude: -73.9632,
    priceLevel: '$$$',
    tags: ['World Art', 'Egyptian Temple', 'Impressionism', 'Rooftop Lounge'],
    bestTimeToVisit: 'Friday & Saturday evenings',
    address: '1000 5th Ave, New York, NY 10028'
  },
  {
    id: 'sf-golden-gate',
    name: 'Golden Gate Bridge & Battery Spencer',
    city: 'San Francisco',
    country: 'USA',
    category: 'Landmarks',
    description: 'The iconic 1.7-mile International Orange suspension bridge spanning the Golden Gate strait between San Francisco and Marin County.',
    imageUrl: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 38900,
    latitude: 37.8199,
    longitude: -122.4783,
    priceLevel: '$',
    tags: ['Suspension Bridge', 'Pacific Ocean', 'Fog & Sun', 'Cycling'],
    bestTimeToVisit: 'September to November (Clearest skies)',
    address: 'Golden Gate Bridge, San Francisco, CA 94129'
  },
  {
    id: 'sf-fishermans-wharf',
    name: 'Fisherman’s Wharf & Pier 39 Sea Lions',
    city: 'San Francisco',
    country: 'USA',
    category: 'Food & Dining',
    description: 'Historic waterfront destination famous for steaming clam chowder in Boudin sourdough bread bowls, fresh Dungeness crab, and barking sea lions.',
    imageUrl: 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewCount: 24100,
    latitude: 37.8087,
    longitude: -122.4098,
    priceLevel: '$$',
    tags: ['Clam Chowder', 'Sourdough', 'Sea Lions', 'Alcatraz Views'],
    bestTimeToVisit: 'Afternoon',
    address: 'Beach St & The Embarcadero, San Francisco, CA 94133'
  },

  // ==========================================
  // --- ITALY (🇮🇹) ---
  // ==========================================
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
  {
    id: 'rome-trevi-fountain',
    name: 'Trevi Fountain & Piazza Navona',
    city: 'Rome',
    country: 'Italy',
    category: 'Landmarks',
    description: 'The monumental Baroque fountain designed by Nicola Salvi where legend holds tossing a coin over your left shoulder guarantees a return to Rome.',
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
  {
    id: 'florence-duomo',
    name: 'Cathedral of Santa Maria del Fiore (Florence Duomo)',
    city: 'Florence',
    country: 'Italy',
    category: 'Landmarks',
    description: 'Brunelleschi’s revolutionary terracotta-tiled dome dominating the Renaissance skyline, flanked by Giotto’s Campanile and the Baptistery bronze doors.',
    imageUrl: 'https://images.unsplash.com/photo-1543429776-2782fc8e1acd?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 33400,
    latitude: 43.7731,
    longitude: 11.2560,
    priceLevel: '$$',
    tags: ['Renaissance Architecture', 'Duomo Climb', 'Terracotta Dome', 'Tuscany'],
    bestTimeToVisit: 'May to June & September',
    address: 'Piazza del Duomo, 50122 Firenze FI, Italy'
  },
  {
    id: 'florence-uffizi',
    name: 'Uffizi Gallery & Ponte Vecchio',
    city: 'Florence',
    country: 'Italy',
    category: 'Culture',
    description: 'World-renowned art museum housing Botticelli’s Birth of Venus, Leonardo da Vinci, and Michelangelo masterpieces overlooking the Arno river.',
    imageUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 29800,
    latitude: 43.7678,
    longitude: 11.2553,
    priceLevel: '$$$',
    tags: ['Renaissance Art', 'Botticelli', 'Arno River', 'Ponte Vecchio'],
    bestTimeToVisit: 'Early morning ticket slot',
    address: 'Piazzale degli Uffizi, 6, 50122 Firenze FI, Italy'
  },
  {
    id: 'venice-grand-canal',
    name: 'Grand Canal & Rialto Bridge',
    city: 'Venice',
    country: 'Italy',
    category: 'Landmarks',
    description: 'The sweeping S-shaped waterway carrying wooden gondolas and vaporettos past 500-year-old Venetian Gothic palazzos and the arched stone Rialto Bridge.',
    imageUrl: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 36200,
    latitude: 45.4380,
    longitude: 12.3359,
    priceLevel: '$$',
    tags: ['Gondola', 'Venetian Lagoon', 'Canals', 'Romantic'],
    bestTimeToVisit: 'April to May & September to October',
    address: 'Sestiere San Polo, 30125 Venezia VE, Italy'
  },

  // ==========================================
  // --- INDONESIA (🇮🇩) ---
  // ==========================================
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
  {
    id: 'bali-monkey-forest',
    name: 'Sacred Monkey Forest Sanctuary Ubud',
    city: 'Bali',
    country: 'Indonesia',
    category: 'Nature',
    description: 'Enchanted moss-draped jungle sanctuary housing three 14th-century Hindu temples and over 1,000 free-roaming long-tailed Balinese macaques.',
    imageUrl: 'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewCount: 22400,
    latitude: -8.5188,
    longitude: 115.2582,
    priceLevel: '$',
    tags: ['Macaques', 'Sacred Jungle', 'Ancient Statues', 'Ubud'],
    bestTimeToVisit: 'Morning when monkeys are most active',
    address: 'Jl. Monkey Forest, Ubud, Gianyar, Bali 80571'
  },
  {
    id: 'bali-mount-batur',
    name: 'Mount Batur Sunrise Volcano Trek',
    city: 'Bali',
    country: 'Indonesia',
    category: 'Nature',
    description: 'Active volcanic caldera rising 1,717 meters above sea level, offering unforgettable predawn treks to watch the sun rise above clouds and Lake Batur.',
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 15300,
    latitude: -8.2421,
    longitude: 115.3753,
    priceLevel: '$$',
    tags: ['Volcano Trek', 'Sunrise Above Clouds', 'Hot Springs', 'Adventure'],
    bestTimeToVisit: 'May to September (Dry season)',
    address: 'Kintamani, Bangli Regency, Bali 80652'
  },

  // ==========================================
  // --- UNITED KINGDOM (🇬🇧) ---
  // ==========================================
  {
    id: 'london-tower-bridge',
    name: 'Tower Bridge & Tower of London',
    city: 'London',
    country: 'United Kingdom',
    category: 'Historical',
    description: 'Victorian neo-Gothic bascule bridge spanning the River Thames, alongside the nearly 1,000-year-old royal fortress holding the Crown Jewels.',
    imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 38700,
    latitude: 51.5055,
    longitude: -0.0754,
    priceLevel: '$$',
    tags: ['Victorian Engineering', 'Crown Jewels', 'River Thames', 'Iconic London'],
    bestTimeToVisit: 'May to September',
    address: 'Tower Bridge Rd, London SE1 2UP, UK'
  },
  {
    id: 'london-big-ben',
    name: 'Big Ben & Palace of Westminster',
    city: 'London',
    country: 'United Kingdom',
    category: 'Landmarks',
    description: 'The Elizabeth Tower and its great resonant bell rising above the British Parliament on the banks of the Thames, radiating golden warmth at night.',
    imageUrl: 'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 34100,
    latitude: 51.5007,
    longitude: -0.1246,
    priceLevel: '$',
    tags: ['Clock Tower', 'Parliament', 'British Icon', 'Thames Promenade'],
    bestTimeToVisit: 'All Year',
    address: 'Westminster, London SW1A 0AA, UK'
  },
  {
    id: 'london-borough-market',
    name: 'Borough Market Artisan Food Hall',
    city: 'London',
    country: 'United Kingdom',
    category: 'Food & Dining',
    description: 'Historic 1,000-year-old covered food bazaar packed with steaming paella pans, salt beef bagels, artisanal British cheeses, and hot chocolate.',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 26800,
    latitude: 51.5055,
    longitude: -0.0905,
    priceLevel: '$$',
    tags: ['Gourmet Food', 'Street Market', 'Cheese & Bakeries', 'Southwark'],
    bestTimeToVisit: 'Thursday to Saturday lunchtimes',
    address: '8 Southwark St, London SE1 1TL, UK'
  },
  {
    id: 'london-british-museum',
    name: 'The British Museum',
    city: 'London',
    country: 'United Kingdom',
    category: 'Culture',
    description: 'World-renowned museum of human history, art, and culture featuring the Rosetta Stone, Parthenon sculptures, and an awe-inspiring glass Great Court.',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 41200,
    latitude: 51.5194,
    longitude: -0.1270,
    priceLevel: '$',
    tags: ['Rosetta Stone', 'Ancient Egypt', 'World History', 'Glass Canopy'],
    bestTimeToVisit: 'Weekday mornings',
    address: 'Great Russell St, London WC1B 3DG, UK'
  },

  // ==========================================
  // --- UNITED ARAB EMIRATES (🇦🇪) ---
  // ==========================================
  {
    id: 'dubai-burj-khalifa',
    name: 'Burj Khalifa & At the Top Sky Deck',
    city: 'Dubai',
    country: 'UAE',
    category: 'Landmarks',
    description: 'The world’s tallest skyscraper soaring 828 meters into the Arabian sky, boasting outdoor observation decks offering panoramic desert and sea views.',
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 52000,
    latitude: 25.1972,
    longitude: 55.2744,
    priceLevel: '$$$$',
    tags: ['World Record', 'Observation Deck', 'Futuristic', 'Skyline'],
    bestTimeToVisit: 'Sunset (5:30 PM slot)',
    address: '1 Sheikh Mohammed bin Rashid Blvd, Downtown Dubai, UAE'
  },
  {
    id: 'dubai-desert-safari',
    name: 'Arabian Desert Dune Bashing & Camp',
    city: 'Dubai',
    country: 'UAE',
    category: 'Nature',
    description: 'Exciting 4x4 dune bashing across golden red desert dunes, sandboarding, camel treks, and stargazing at traditional Bedouin barbecue camps.',
    imageUrl: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 38400,
    latitude: 24.9857,
    longitude: 55.4526,
    priceLevel: '$$$',
    tags: ['Dune Bashing', 'Bedouin Dinner', 'Sandboarding', 'Starry Desert'],
    bestTimeToVisit: 'November to March',
    address: 'Al Marmoom Desert Conservation Reserve, Dubai, UAE'
  },
  {
    id: 'dubai-al-fahidi',
    name: 'Al Fahidi Historical Neighbourhood & Souks',
    city: 'Dubai',
    country: 'UAE',
    category: 'Culture',
    description: 'Old Dubai’s heritage district of coral-stone buildings and wind towers along Dubai Creek, reached via a traditional 1-dirham wooden abra boat to the Gold and Spice Souks.',
    imageUrl: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewCount: 19200,
    latitude: 25.2631,
    longitude: 55.2972,
    priceLevel: '$',
    tags: ['Old Dubai', 'Abra Boat', 'Spice Souk', 'Gold Souk'],
    bestTimeToVisit: 'Late afternoon to evening',
    address: 'Al Fahidi, Bur Dubai, Dubai, UAE'
  },

  // ==========================================
  // --- SINGAPORE (🇸🇬) ---
  // ==========================================
  {
    id: 'singapore-gardens-bay',
    name: 'Gardens by the Bay & Supertree Grove',
    city: 'Singapore',
    country: 'Singapore',
    category: 'Nature',
    description: 'Futuristic 250-acre nature park boasting 16-story vertical Supertrees connected by the OCBC Skyway and the misty indoor mountain of the Cloud Forest.',
    imageUrl: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 46700,
    latitude: 1.2816,
    longitude: 103.8636,
    priceLevel: '$$',
    tags: ['Supertrees', 'Cloud Forest Waterfall', 'Light Show', 'Bio-Architecture'],
    bestTimeToVisit: 'Late afternoon into the 7:45 PM Garden Rhapsody light show',
    address: '18 Marina Gardens Dr, Singapore 018953'
  },
  {
    id: 'singapore-marina-bay',
    name: 'Marina Bay Sands SkyPark & Promenade',
    city: 'Singapore',
    country: 'Singapore',
    category: 'Landmarks',
    description: 'Iconic three-tower resort crowned by the ship-shaped SkyPark cantilevered 200 meters in the air, offering panoramic views over the Singapore Strait.',
    imageUrl: 'https://images.unsplash.com/photo-1506351421178-63b52a2d2562?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 39500,
    latitude: 1.2834,
    longitude: 103.8607,
    priceLevel: '$$$',
    tags: ['SkyPark', 'Infinity Pool', 'Spectra Light Show', 'Luxury'],
    bestTimeToVisit: 'Sunset into dusk',
    address: '10 Bayfront Ave, Singapore 018956'
  },
  {
    id: 'singapore-chinatown-hawker',
    name: 'Chinatown Maxwell Food Centre',
    city: 'Singapore',
    country: 'Singapore',
    category: 'Food & Dining',
    description: 'World-famous hawker centre packed with Michelin Bib Gourmand stalls serving fragrant Hainanese chicken rice, char kway teow, and laksa.',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 28400,
    latitude: 1.2804,
    longitude: 103.8447,
    priceLevel: '$',
    tags: ['Hawker Culture', 'Michelin Bib Gourmand', 'Hainanese Chicken Rice', 'UNESCO'],
    bestTimeToVisit: 'Lunch (11:30 AM - 2:00 PM)',
    address: '1 Kadayanallur St, Singapore 069184'
  },

  // ==========================================
  // --- THAILAND (🇹🇭) ---
  // ==========================================
  {
    id: 'bangkok-grand-palace',
    name: 'The Grand Palace & Wat Phra Kaew',
    city: 'Bangkok',
    country: 'Thailand',
    category: 'Historical',
    description: 'The dazzling spiritual heart of Thailand since 1782, adorned with golden spires, vibrant mosaic tiles, and the sacred 14th-century Emerald Buddha.',
    imageUrl: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 38200,
    latitude: 13.7500,
    longitude: 100.4913,
    priceLevel: '$$',
    tags: ['Emerald Buddha', 'Thai Royal Palace', 'Golden Pagodas', 'Sacred'],
    bestTimeToVisit: 'Morning (8:30 AM opening)',
    address: 'Na Phra Lan Rd, Phra Borom Maha Ratchawang, Bangkok 10200'
  },
  {
    id: 'bangkok-wat-arun',
    name: 'Wat Arun (Temple of Dawn)',
    city: 'Bangkok',
    country: 'Thailand',
    category: 'Landmarks',
    description: 'Riverside Khmer-style prang rising 82 meters along the Chao Phraya River, encrusted with colorful porcelain and seashells that glisten in sunlight.',
    imageUrl: 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 29500,
    latitude: 13.7437,
    longitude: 100.4888,
    priceLevel: '$',
    tags: ['Chao Phraya River', 'Porcelain Spire', 'Sunset Ferry', 'Iconic Bangkok'],
    bestTimeToVisit: 'Sunset from across the river or early morning',
    address: '158 Thanon Wang Doem, Wat Arun, Bangkok Yai, Bangkok 10600'
  },
  {
    id: 'bangkok-chinatown-yaowarat',
    name: 'Yaowarat Chinatown Street Food Night Market',
    city: 'Bangkok',
    country: 'Thailand',
    category: 'Food & Dining',
    description: 'Electrifying nocturnal sensory overload under neon signs, serving Michelin-starred rolled noodles, grilled river prawns, mango sticky rice, and dim sum.',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 34500,
    latitude: 13.7410,
    longitude: 100.5085,
    priceLevel: '$',
    tags: ['Street Food Capital', 'Michelin Hawkers', 'Mango Sticky Rice', 'Night Market'],
    bestTimeToVisit: 'Evenings (6:30 PM - 11:00 PM)',
    address: 'Yaowarat Rd, Samphanthawong, Bangkok 10100'
  },

  // ==========================================
  // --- SPAIN (🇪🇸) ---
  // ==========================================
  {
    id: 'barcelona-sagrada-familia',
    name: 'Basílica de la Sagrada Família',
    city: 'Barcelona',
    country: 'Spain',
    category: 'Landmarks',
    description: 'Antoni Gaudí’s awe-inspiring unfinished masterpiece blending Gothic and Art Nouveau forms with stained-glass tree columns that bathe the nave in sunlight.',
    imageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 56000,
    latitude: 41.4036,
    longitude: 2.1744,
    priceLevel: '$$$',
    tags: ['Gaudí Masterpiece', 'Stained Glass', 'UNESCO', 'Organic Architecture'],
    bestTimeToVisit: 'Mid-morning or late afternoon for stained-glass lighting',
    address: 'C/ de Mallorca, 401, 08013 Barcelona, Spain'
  },
  {
    id: 'barcelona-park-guell',
    name: 'Park Güell & Gaudí Mosaic Terraces',
    city: 'Barcelona',
    country: 'Spain',
    category: 'Nature',
    description: 'Enchanted public park perched high on Carmel Hill featuring colorful trencadís mosaic salamanders, serpentine benches, and Mediterranean vistas.',
    imageUrl: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 37500,
    latitude: 41.4145,
    longitude: 2.1527,
    priceLevel: '$$',
    tags: ['Mosaic Benches', 'City Panoramas', 'Gaudí', 'Mediterranean Park'],
    bestTimeToVisit: 'Morning before midday crowds',
    address: '08024 Barcelona, Spain'
  },
  {
    id: 'barcelona-boqueria',
    name: 'Mercat de la Boqueria Tapas Market',
    city: 'Barcelona',
    country: 'Spain',
    category: 'Food & Dining',
    description: 'Vibrant covered food market on Las Ramblas bustling since 1840, overflowing with Iberian ham cones, fresh seafood tapas, and seasonal fruit juices.',
    imageUrl: 'https://images.unsplash.com/photo-1515443961218-a51367888e4b?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 31200,
    latitude: 41.3817,
    longitude: 2.1716,
    priceLevel: '$$',
    tags: ['Jamón Ibérico', 'Seafood Tapas', 'La Rambla', 'Spanish Market'],
    bestTimeToVisit: 'Late morning (10:30 AM - 1:00 PM)',
    address: 'La Rambla, 91, 08001 Barcelona, Spain'
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
    results.sort((a, b) => a.name.localeCompare(a.name));
  } else if (sortBy === 'name-desc') {
    results.sort((a, b) => b.name.localeCompare(a.name));
  }

  return results;
}

export function getDestinationById(id: string): Destination | undefined {
  return SEED_DESTINATIONS.find((d) => d.id === id);
}

export function getFeaturedCities(): string[] {
  return Array.from(new Set(SEED_DESTINATIONS.map((d) => d.city))).sort();
}
