import { AITripPlan } from '@/types';
import { SEED_DESTINATIONS } from './destinations';

interface GeneratePlanParams {
  city: string;
  days: number;
  theme: string;
  pace?: 'relaxed' | 'moderate' | 'packed';
}

// Curated real-world landmark database for high-fidelity fallback
const CITY_KNOWLEDGE_BASE: Record<
  string,
  {
    overview: string;
    spots: Array<{ name: string; category: any; timeOfDay: any; description: string; tips: string; estimatedCost: string }>;
    packingTips: string[];
    bestLocalFood: string[];
  }
> = {
  chennai: {
    overview: 'A vibrant coastal metropolis blending millennia-old Dravidian temple heritage, British colonial architecture, sandy promenades, and world-renowned South Indian culinary traditions.',
    spots: [
      {
        name: 'Kapaleeshwarar Temple',
        category: 'Historical',
        timeOfDay: 'Morning',
        description: '7th-century Dravidian architectural marvel in Mylapore dedicated to Lord Shiva, featuring an intricately carved 37-meter rainbow gopuram.',
        tips: 'Visit around 7:30 AM for morning temple rituals and peaceful photography before crowds arrive.',
        estimatedCost: '$2'
      },
      {
        name: 'Murugan Idli Shop & Mylapore Traditional Eateries',
        category: 'Food & Dining',
        timeOfDay: 'Afternoon',
        description: 'Acclaimed South Indian restaurant renowned for melt-in-mouth ghee podi idlis, crispy medu vada, and piping hot filter coffee.',
        tips: 'Order the signature ghee podi idlis with four distinct chutneys and traditional degree filter coffee.',
        estimatedCost: '$5'
      },
      {
        name: 'Marina Beach Promenade & Lighthouse',
        category: 'Nature',
        timeOfDay: 'Evening',
        description: 'The world’s second-longest urban beach stretching 13 km along the Coromandel Coast with a historic lighthouse and evening sea breeze.',
        tips: 'Ascend the lighthouse before 5:00 PM for panoramic coastal city views, then stroll for sunset sundal and roasted corn.',
        estimatedCost: '$1'
      },
      {
        name: 'San Thome Basilica',
        category: 'Landmarks',
        timeOfDay: 'Morning',
        description: 'Neo-Gothic Roman Catholic minor basilica built in 1893 over the tomb of St. Thomas the Apostle, right beside the sea.',
        tips: 'Walk through the underground museum behind the altar containing ancient relics from the 1st century.',
        estimatedCost: 'Free'
      },
      {
        name: 'Fort St. George & Clive Museum',
        category: 'Historical',
        timeOfDay: 'Afternoon',
        description: 'The first British fortress erected in India (1644), featuring St. Mary’s Church and rich colonial heritage galleries.',
        tips: 'Carry valid photo identification for entry as part of the complex houses the Tamil Nadu Legislative Assembly.',
        estimatedCost: '$4'
      },
      {
        name: 'DakshinaChitra Heritage Village',
        category: 'Culture',
        timeOfDay: 'Evening',
        description: 'An expansive open-air living history museum showcasing 18 authentic transplanted heritage houses and artisan workshops across South India.',
        tips: 'Watch live handloom silk weaving and traditional potters in action in the Tamil and Kerala quarters.',
        estimatedCost: '$6'
      }
    ],
    packingTips: [
      'Breathable loose cotton clothing for tropical coastal warmth',
      'Modest temple-appropriate attire (covering shoulders and knees)',
      'Slip-on footwear easy to remove outside shrines and temples',
      'High SPF sunscreen, UV sunglasses, and a compact umbrella'
    ],
    bestLocalFood: [
      'Authentic Chennai Degree Filter Coffee served in traditional davarah',
      'Mylapore Ghee Podi Idli & Crispy Medu Vada with freshly ground coconut chutney',
      'Crisp Golden Masala Dosa roasted with pure clarified butter',
      'Spicy Chettinad Pepper Chicken or Paneer Curry with flaky Parotta'
    ]
  },
  delhi: {
    overview: 'India’s historic capital juxtaposing monumental Mughal fortresses, leafy imperial avenues, spiritual sanctums, and legendary street food markets.',
    spots: [
      {
        name: 'Qutub Minar & Mehrauli Archaeological Park',
        category: 'Historical',
        timeOfDay: 'Morning',
        description: 'A 73-meter soaring Afghan-Ghurid victory tower erected in 1192 surrounded by intricate red sandstone carvings and an ancient rust-resistant Iron Pillar.',
        tips: 'Arrive at 8:00 AM for soft morning light across the sandstone ruins and minimal crowds.',
        estimatedCost: '$7'
      },
      {
        name: 'Chandni Chowk & Paranthe Wali Gali',
        category: 'Food & Dining',
        timeOfDay: 'Afternoon',
        description: 'Bustling 17th-century Old Delhi bazaar famed for heritage street food stalls serving deep-fried stuffed parathas, jalebis, and spiced lassi.',
        tips: 'Take a cycle rickshaw through Kinari Bazaar and Khari Baoli (Asia’s largest spice market).',
        estimatedCost: '$6'
      },
      {
        name: 'Humayun’s Tomb Gardens',
        category: 'Landmarks',
        timeOfDay: 'Evening',
        description: 'UNESCO World Heritage red sandstone mausoleum set within quadrilateral Persian Charbagh gardens, the architectural precursor to the Taj Mahal.',
        tips: 'Stay until golden hour as the setting sun illuminates the white marble dome and reflective water channels.',
        estimatedCost: '$7'
      }
    ],
    packingTips: [
      'Comfortable walking sneakers for vast palace grounds and heritage complexes',
      'Modest scarf/shawl for covering head and shoulders at religious sites',
      'Hand sanitizer and travel wet wipes for exploring street food quarters'
    ],
    bestLocalFood: [
      'Crispy Stuffed Aloo & Paneer Parathas with tangy tamarind chutney',
      'Authentic Butter Chicken with buttered garlic naan',
      'Hot crispy Jalebi soaked in saffron syrup with thick Rabri',
      'Chole Bhature with pickled green chilies and sliced onions'
    ]
  },
  mumbai: {
    overview: 'India’s bustling financial and cinematic powerhouse, celebrated for Victorian Gothic architecture, the sweeping Arabian Sea shoreline, and high-energy street markets.',
    spots: [
      {
        name: 'Gateway of India & Taj Mahal Palace',
        category: 'Landmarks',
        timeOfDay: 'Morning',
        description: 'Majestic 1924 basalt ceremonial arch overlooking Mumbai Harbour beside the iconic 1903 heritage Taj Mahal Palace hotel.',
        tips: 'Catch the early morning ferry breeze from the jetty for classic seaward harbor vistas.',
        estimatedCost: 'Free'
      },
      {
        name: 'Chhatrapati Shivaji Maharaj Terminus & Fort District',
        category: 'Historical',
        timeOfDay: 'Afternoon',
        description: 'Spectacular UNESCO-listed High Victorian Gothic railway terminus blending Italianate Gothic Revival with classical Indian palace motifs.',
        tips: 'Admire the stained glass vaulted ceiling and gargoyles from across the street for wide-angle photos.',
        estimatedCost: 'Free'
      },
      {
        name: 'Marine Drive & Girgaon Chowpatty',
        category: 'Nature',
        timeOfDay: 'Evening',
        description: 'Sweeping 3.6-kilometer C-shaped coastal promenade famously nicknamed the "Queen’s Necklace" for its arc of streetlights at night.',
        tips: 'Sit along the promenade wall at sunset and grab fresh Sev Puri or Pani Puri from Chowpatty beach stalls.',
        estimatedCost: '$3'
      }
    ],
    packingTips: [
      'Light summer clothing with breathable fabrics',
      'Comfortable walking sandals or sneakers for urban walking',
      'Compact umbrella or light rain shell during monsoon months'
    ],
    bestLocalFood: [
      'Vada Pav with spicy red garlic chutney and fried green chilies',
      'Bombay Bhel Puri and Sev Puri at Girgaon Chowpatty',
      'Irani Chai and Bun Maska at historic Parsi bakeries',
      'Fresh Coastal Butter Garlic Crab or Bombil Fry'
    ]
  },
  paris: {
    overview: 'The City of Light, world capital of art, high fashion, architectural grandeur, and exquisite culinary craftsmanship along the winding banks of the Seine.',
    spots: [
      {
        name: 'Eiffel Tower & Champ de Mars',
        category: 'Landmarks',
        timeOfDay: 'Morning',
        description: 'Gustave Eiffel’s 1889 wrought-iron masterpiece rising 330 meters over the Parisian skyline.',
        tips: 'Book summit tickets online 60 days ahead; alternatively walk the stairs to the second floor for shorter lines.',
        estimatedCost: '$30'
      },
      {
        name: 'Musée du Louvre & Tuileries Garden',
        category: 'Culture',
        timeOfDay: 'Afternoon',
        description: 'The world’s largest art museum housed in a former royal fortress, holding the Mona Lisa and Venus de Milo.',
        tips: 'Enter through the Carrousel du Louvre underground mall entrance to bypass long pyramid courtyard queues.',
        estimatedCost: '$24'
      },
      {
        name: 'Montmartre & Basilique du Sacré-Cœur',
        category: 'Historical',
        timeOfDay: 'Evening',
        description: 'Bohemian hilltop village featuring cobblestone lanes, artist squares at Place du Tertre, and the Romano-Byzantine white basilica.',
        tips: 'Watch sunset from the basilica steps for a magnificent panoramic vantage point over all of Paris.',
        estimatedCost: 'Free'
      }
    ],
    packingTips: [
      'Stylish, comfortable walking shoes for cobblestones and museum floors',
      'Versatile smart-casual layers suitable for bistro dinners',
      'Crossbody bag with secure zip for crowded metro stations'
    ],
    bestLocalFood: [
      'Freshly baked artisan butter croissants and pain au chocolat from a boulangerie',
      'Classic French Onion Soup gratinated with Gruyère cheese',
      'Duck Confit with crispy skin and garlic roasted potatoes',
      'Warm Crepes with Nutella or salted butter caramel in Montmartre'
    ]
  },
  tokyo: {
    overview: 'An awe-inspiring metropolis where centuries-old Edo traditions, serene Shinto shrines, Michelin-starred cuisine, and neon-lit futuristic streetscapes coexist seamlessly.',
    spots: [
      {
        name: 'Sensō-ji Temple & Nakamise-dori',
        category: 'Historical',
        timeOfDay: 'Morning',
        description: 'Tokyo’s oldest Buddhist temple founded in 645 AD in Asakusa, approached via Nakamise shopping street and the thunderous Kaminarimon Gate.',
        tips: 'Draw an omikuji (fortune paper) for 100 yen and sample freshly grilled ningyo-yaki bean cakes.',
        estimatedCost: '$3'
      },
      {
        name: 'Tsukiji Outer Market',
        category: 'Food & Dining',
        timeOfDay: 'Afternoon',
        description: 'Lively culinary market labyrinth packed with historic street food vendors, sushi counters, tamagoyaki grills, and seafood stalls.',
        tips: 'Try the fresh seared wagyu beef skewers and king crab legs fresh off the charcoal grill.',
        estimatedCost: '$20'
      },
      {
        name: 'Shibuya Crossing & Hachiko Memorial',
        category: 'Landmarks',
        timeOfDay: 'Evening',
        description: 'The world’s busiest pedestrian intersection where up to 3,000 people scramble simultaneously under towering neon billboard displays.',
        tips: 'Head to the 2nd floor of Shibuya Tsutaya or Shibuya Sky observatory for panoramic aerial views of the crossing swarm.',
        estimatedCost: 'Free'
      }
    ],
    packingTips: [
      'Slip-on shoes for frequent entry/exit at shrines, temples, and tatami dining',
      'Small hand towel or handkerchief (many public restrooms do not have paper towels)',
      'Pocket coin purse for vending machines and metro ticket machines'
    ],
    bestLocalFood: [
      'Rich Tonkotsu or Shoyu Ramen with chashu pork and seasoned soft-boiled egg',
      'Fresh Nigiri Sushi from Tsukiji fishmongers',
      'Yakitori charcoal grilled skewers with sweet tare glaze in Omoide Yokocho',
      'Authentic Uji Matcha soft-serve ice cream in Asakusa'
    ]
  }
};

export async function generateAITripPlan({
  city,
  days,
  theme,
  pace = 'moderate'
}: GeneratePlanParams): Promise<AITripPlan> {
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  const nvidiaKey = process.env.NVIDIA_API_KEY;
  const cleanCity = city.trim();

  // Find verified local attractions from our database
  const matchingDestinations = SEED_DESTINATIONS.filter(
    (d) => d.city.toLowerCase() === cleanCity.toLowerCase()
  );

  const destinationContext = matchingDestinations.length > 0
    ? `\nVERIFIED LOCAL ATTRACTIONS IN ${cleanCity} (Prioritize including these authentic places):
${matchingDestinations.map((d) => `- "${d.name}" (${d.category}, price tier: ${d.priceLevel}): ${d.description}`).join('\n')}`
    : '';

  const prompt = `You are TripWise AI, an expert international travel concierge with deep local knowledge.
Generate an authentic, highly specific, realistic ${days}-day travel itinerary for "${cleanCity}" focusing on "${theme}" with a "${pace}" pace.${destinationContext}

CRITICAL RULES:
1. Every spot MUST be a REAL, SPECIFIC, FAMOUS landmark, temple, museum, market, or restaurant by its EXACT real-world name (e.g., "Kapaleeshwarar Temple", "Marina Beach", "San Thome Basilica", "Louvre Museum", "Senso-ji").
2. STRICTLY FORBIDDEN: NEVER invent generic placeholder names like "Morning Landmark Discovery", "Authentic Culinary Experience", "City Highlights Walk", or "Sunset Cultural Experience".
3. Provide concrete, actionable visitor tips for each place (e.g. "Arrive before 8:30 AM to beat tour buses", "Dress modestly covering knees and shoulders").
4. Provide realistic estimated cost per person in USD (e.g. "$15", "$5", "Free").
5. List 3-4 genuine local culinary dishes and 3 practical packing tips specific to ${cleanCity}.

Return ONLY valid JSON matching this schema (no markdown, no extra commentary):
{
  "city": "${cleanCity}",
  "days": ${days},
  "theme": "${theme}",
  "overview": "Engaging 2-sentence summary highlighting why ${cleanCity} is exceptional for ${theme}",
  "dailyPlans": [
    {
      "day": 1,
      "title": "Specific focus of Day 1 (e.g., Historic Mylapore & Temples)",
      "spots": [
        {
          "name": "Exact Real Attraction Name",
          "category": "Historical|Nature|Food & Dining|Landmarks|Entertainment|Culture",
          "timeOfDay": "Morning|Afternoon|Evening",
          "description": "Specific 1-2 sentence description of this real landmark",
          "tips": "Practical real-world tip",
          "estimatedCost": "$15"
        }
      ]
    }
  ],
  "packingTips": ["Specific packing item 1", "Specific packing item 2", "Specific packing item 3"],
  "bestLocalFood": ["Specific dish 1 with brief description", "Specific dish 2 with brief description", "Specific dish 3 with brief description"]
}`;

  // 1. Try NVIDIA NIM with verified active model: meta/llama-3.2-11b-vision-instruct
  if (nvidiaKey) {
    try {
      const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${nvidiaKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'meta/llama-3.2-11b-vision-instruct',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.4,
          max_tokens: 2048,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        const content = json.choices?.[0]?.message?.content;
        if (content) {
          const parsed = extractAndParseJSON(content);
          if (parsed && parsed.dailyPlans && parsed.dailyPlans.length > 0) {
            return parsed as AITripPlan;
          }
        }
      } else {
        console.warn(`NVIDIA API returned HTTP ${response.status}: ${await response.text()}`);
      }
    } catch (err) {
      console.warn('NVIDIA NIM request failed:', err);
    }
  }

  // 2. Try OpenRouter if key is present
  if (openRouterKey) {
    const candidateModels = [
      'meta-llama/llama-3.3-70b-instruct',
      'mistralai/mistral-large-2411',
      'google/gemini-flash-1.5'
    ];

    for (const model of candidateModels) {
      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openRouterKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://tripwise.local',
            'X-Title': 'TripWise Smart Travel Planner',
          },
          body: JSON.stringify({
            model,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.5,
            max_tokens: 2048,
          }),
        });

        if (response.ok) {
          const json = await response.json();
          const content = json.choices?.[0]?.message?.content;
          if (content) {
            const parsed = extractAndParseJSON(content);
            if (parsed && parsed.dailyPlans && parsed.dailyPlans.length > 0) {
              return parsed as AITripPlan;
            }
          }
        }
      } catch (err) {
        console.warn(`OpenRouter request failed for ${model}:`, err);
      }
    }
  }

  // 3. High-fidelity Curated Real Places Fallback
  return generateCuratedFallbackPlan(cleanCity, days, theme, matchingDestinations);
}

function extractAndParseJSON(raw: string): any {
  try {
    // 1. Direct parse
    return JSON.parse(raw.trim());
  } catch {}

  try {
    // 2. Extract from markdown ```json ... ```
    const match = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (match && match[1]) {
      return JSON.parse(match[1].trim());
    }
  } catch {}

  try {
    // 3. Extract between outer curly braces
    const firstBrace = raw.indexOf('{');
    const lastBrace = raw.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      return JSON.parse(raw.substring(firstBrace, lastBrace + 1));
    }
  } catch {}

  return null;
}

function generateCuratedFallbackPlan(
  city: string,
  days: number,
  theme: string,
  matchingDestinations: any[]
): AITripPlan {
  const normCity = city.trim();
  const lowerCity = normCity.toLowerCase();

  // If we have detailed curated knowledge for this city, use it
  const knowledge = CITY_KNOWLEDGE_BASE[lowerCity];
  if (knowledge) {
    const spotsPerDay = 3;
    const dailyPlans = Array.from({ length: days }, (_, i) => {
      const dayNum = i + 1;
      const startIdx = ((dayNum - 1) * spotsPerDay) % knowledge.spots.length;
      const daySpots = [];
      for (let s = 0; s < spotsPerDay; s++) {
        const spot = knowledge.spots[(startIdx + s) % knowledge.spots.length];
        daySpots.push(spot);
      }

      return {
        day: dayNum,
        title: dayNum === 1
          ? `Arrival & Premier Landmarks of ${normCity}`
          : dayNum === 2
          ? `Deep Dive into ${theme} & Historic Quarters`
          : `Cultural Treasures & Scenic Waterfront Highlights`,
        spots: daySpots,
      };
    });

    return {
      city: normCity,
      days,
      theme,
      overview: knowledge.overview,
      dailyPlans,
      packingTips: knowledge.packingTips,
      bestLocalFood: knowledge.bestLocalFood,
    };
  }

  // If we have matching destinations from SEED_DESTINATIONS, build a realistic plan using them!
  if (matchingDestinations.length > 0) {
    const dailyPlans = Array.from({ length: days }, (_, i) => {
      const dayNum = i + 1;
      const daySpots = matchingDestinations.slice((dayNum - 1) * 2, dayNum * 2 + 1);
      const spots = (daySpots.length > 0 ? daySpots : matchingDestinations).map((d, sIdx) => ({
        name: d.name,
        category: d.category,
        timeOfDay: (sIdx === 0 ? 'Morning' : sIdx === 1 ? 'Afternoon' : 'Evening') as 'Morning' | 'Afternoon' | 'Evening',
        description: d.description,
        tips: `Best visited in ${d.bestTimeToVisit || 'morning hours'}. Located at ${d.address || d.city}.`,
        estimatedCost: `$${{ $: 15, '$$': 40, '$$$': 90, '$$$$': 180 }[d.priceLevel as string] || 20}`,
      }));

      return {
        day: dayNum,
        title: `Day ${dayNum}: ${spots[0]?.name || normCity} Exploration`,
        spots,
      };
    });

    return {
      city: normCity,
      days,
      theme,
      overview: `A curated ${days}-day journey across ${normCity} visiting top verified destinations including ${matchingDestinations.map(d => d.name).slice(0, 3).join(', ')}.`,
      dailyPlans,
      packingTips: [
        'Comfortable walking shoes suitable for historic sites and city walking',
        'Lightweight weather-appropriate apparel and compact rain shell',
        'Universal power adapter and portable charging power bank'
      ],
      bestLocalFood: [
        `Acclaimed regional culinary specialties of ${normCity}`,
        'Freshly prepared local market street delicacies',
        'Signature local heritage tea or coffee'
      ],
    };
  }

  // Global default for any unlisted city
  return {
    city: normCity,
    days,
    theme,
    overview: `An authentic ${days}-day expedition experiencing the vibrant cultural fabric, historic architecture, and local flavors of ${normCity}.`,
    dailyPlans: Array.from({ length: days }, (_, i) => ({
      day: i + 1,
      title: `Day ${i + 1}: ${normCity} Heritage & Exploration`,
      spots: [
        {
          name: `${normCity} Historic Old Town & Central Plaza`,
          category: 'Historical',
          timeOfDay: 'Morning',
          description: `Wander through the historic heart of ${normCity}, observing centuries of architectural evolution and lively civic squares.`,
          tips: 'Start early around 8:00 AM for uncrowded streets and serene atmospheric light.',
          estimatedCost: 'Free'
        },
        {
          name: `${normCity} Central Market & Food Promenade`,
          category: 'Food & Dining',
          timeOfDay: 'Afternoon',
          description: `Indulge in authentic regional delicacies, artisanal pastries, and fresh local produce at the bustling municipal market.`,
          tips: 'Ask local stallholders for their daily seasonal special recommendation.',
          estimatedCost: '$15'
        },
        {
          name: `${normCity} Panorama Viewpoint & Scenic Promenade`,
          category: 'Nature',
          timeOfDay: 'Evening',
          description: `Soak in sweeping twilight horizons and illuminated architectural landmarks as evening settles over ${normCity}.`,
          tips: 'Arrive 30 minutes before sunset for the best photography angles.',
          estimatedCost: 'Free'
        }
      ]
    })),
    packingTips: [
      'Sturdy walking footwear for diverse city terrain',
      'Compact universal travel adapter and high-capacity battery bank',
      'Weather-resistant layer and UV protection'
    ],
    bestLocalFood: [
      `Signature ${normCity} traditional heritage dish`,
      'Fresh artisanal regional breads and savory street snacks',
      'Local seasonal dessert and signature beverage'
    ]
  };
}
