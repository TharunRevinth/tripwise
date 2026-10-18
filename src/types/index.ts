export type Category = 
  | 'All' 
  | 'Historical' 
  | 'Nature' 
  | 'Food & Dining' 
  | 'Landmarks' 
  | 'Entertainment' 
  | 'Culture';

export interface Destination {
  id: string;
  name: string;
  city: string;
  country: string;
  category: Category;
  description: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  latitude: number;
  longitude: number;
  priceLevel: '$' | '$$' | '$$$' | '$$$$';
  tags: string[];
  bestTimeToVisit?: string;
  address?: string;
  openingHours?: string;
}

export interface ItineraryItem {
  id: string;
  placeId: string;
  name: string;
  city: string;
  country: string;
  category: string;
  description?: string;
  imageUrl?: string;
  latitude?: number;
  longitude?: number;
  dayNumber: number;
  notes?: string;
  targetDate?: string;
  estimatedCost?: number;
  isVisited: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface WeatherData {
  city: string;
  temperature: number;
  condition: string;
  weatherCode: number;
  humidity: number;
  windSpeed: number;
  isDay: boolean;
  forecast: Array<{
    date: string;
    maxTemp: number;
    minTemp: number;
    weatherCode: number;
    condition: string;
  }>;
}

export interface TripEstimate {
  durationDays: number;
  travelers: number;
  lodgingTier: 'budget' | 'standard' | 'luxury';
  diningTier: 'street' | 'casual' | 'fine';
  transportTier: 'transit' | 'taxis' | 'rental';
  currency: 'INR' | 'USD' | 'EUR' | 'GBP';
  breakdown: {
    lodging: number;
    dining: number;
    transport: number;
    activities: number;
    buffer: number;
  };
  totalCost: number;
  perPersonCost: number;
}

export interface AISpot {
  name: string;
  category: string;
  timeOfDay: 'Morning' | 'Afternoon' | 'Evening';
  description: string;
  tips: string;
  estimatedCost: string;
}

export interface AIDayPlan {
  day: number;
  title: string;
  spots: AISpot[];
}

export interface AITripPlan {
  city: string;
  days: number;
  theme: string;
  overview: string;
  dailyPlans: AIDayPlan[];
  packingTips: string[];
  bestLocalFood: string[];
}
