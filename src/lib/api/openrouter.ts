import { AITripPlan } from '@/types';

interface GeneratePlanParams {
  city: string;
  days: number;
  theme: string;
  pace?: 'relaxed' | 'moderate' | 'packed';
}

export async function generateAITripPlan({
  city,
  days,
  theme,
  pace = 'moderate'
}: GeneratePlanParams): Promise<AITripPlan> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (apiKey) {
    try {
      const prompt = `You are TripWise AI, an expert travel concierge.
Generate a high-value, realistic, structured ${days}-day travel itinerary for "${city}" with a focus on "${theme}" and a "${pace}" pace.
Return ONLY valid raw JSON with this exact schema (no markdown fences, no extra commentary):
{
  "city": "${city}",
  "days": ${days},
  "theme": "${theme}",
  "overview": "2-3 sentences introducing why ${city} is great for this theme",
  "dailyPlans": [
    {
      "day": 1,
      "title": "Theme for Day 1",
      "spots": [
        {
          "name": "Attraction or Place Name",
          "category": "Historical|Nature|Food & Dining|Landmarks|Entertainment|Culture",
          "timeOfDay": "Morning|Afternoon|Evening",
          "description": "Engaging 1-2 sentence description",
          "tips": "Pro visitor tip",
          "estimatedCost": "Approx cost in local currency or USD"
        }
      ]
    }
  ],
  "packingTips": ["Pack item 1", "Pack item 2", "Pack item 3"],
  "bestLocalFood": ["Dish 1 - description", "Dish 2 - description"]
}`;

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://tripwise.local',
          'X-Title': 'TripWise Smart Travel Planner',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.0-flash',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        const content = json.choices?.[0]?.message?.content;
        if (content) {
          const cleaned = content.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
          const parsed = JSON.parse(cleaned);
          return parsed as AITripPlan;
        }
      }
    } catch (err) {
      console.warn('OpenRouter API request failed, falling back to smart local generator:', err);
    }
  }

  // Smart local algorithmic itinerary generator fallback
  return generateCuratedFallbackPlan(city, days, theme);
}

function generateCuratedFallbackPlan(city: string, days: number, theme: string): AITripPlan {
  const normCity = city.trim();
  
  const dailyPlans = Array.from({ length: days }, (_, i) => {
    const dayNum = i + 1;
    return {
      day: dayNum,
      title: dayNum === 1 
        ? `Arrival & Iconic Foundations of ${normCity}` 
        : dayNum === 2 
        ? `Deep Dive into ${theme} & Hidden Alleyways` 
        : `Cultural Treasures & Golden Sunset Horizons`,
      spots: [
        {
          name: `${normCity} Morning Landmark Discovery`,
          category: 'Landmarks',
          timeOfDay: 'Morning' as const,
          description: `Kick off day ${dayNum} exploring historic districts and architectural icons while the morning light is soft and crowds are thin.`,
          tips: 'Arrive 15 minutes before opening for serene photography.',
          estimatedCost: '$10 - $25'
        },
        {
          name: `Authentic ${normCity} Culinary Experience`,
          category: 'Food & Dining',
          timeOfDay: 'Afternoon' as const,
          description: `Savor acclaimed regional specialties at renowned local eateries and bustling food halls.`,
          tips: 'Ask for the chef’s seasonal special and local beverage pairing.',
          estimatedCost: '$15 - $35'
        },
        {
          name: `Sunset Horizon & Evening Promenade in ${normCity}`,
          category: 'Entertainment',
          timeOfDay: 'Evening' as const,
          description: `Wind down your day with a panoramic sunset view followed by vibrant evening street performances.`,
          tips: 'Book an elevated terrace spot in advance.',
          estimatedCost: '$5 - $20'
        }
      ]
    };
  });

  return {
    city: normCity,
    days,
    theme,
    overview: `A curated ${days}-day expedition through ${normCity} highlighting top-rated ${theme.toLowerCase()} experiences, hand-picked authentic culinary stops, and iconic landmarks.`,
    dailyPlans,
    packingTips: [
      'Comfortable walking footwear for cobblestones and walking paths',
      'Universal power adapter and portable power bank',
      'Light breathable layers plus a compact rain shell'
    ],
    bestLocalFood: [
      `Signature ${normCity} Heritage Dish`,
      'Traditional Local Street Pastry or Savory Snack',
      'Artisanal Local Coffee or Spiced Tea'
    ]
  };
}
