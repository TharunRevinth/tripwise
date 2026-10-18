# TripWise — Backend & API Specifications

This document defines the complete backend architecture, database schemas, external API integrations, and REST API contracts for **TripWise (Smart Travel Planner)**. You can feed this entire document into **Claude 3.7**, **Manus**, or any other AI code-generation agent to implement or extend the backend services and frontend connections.

---

## 1. System Architecture Overview

```
                      +-----------------------------+
                      |       Client Frontend       |
                      |   (Next.js 15 / React 19)   |
                      +--------------+--------------+
                                     |
               +---------------------+---------------------+
               |                     |                     |
         [ REST API ]          [ REST API ]          [ REST API ]
     /api/destinations        /api/itinerary          /api/weather
     /api/destinations/[id]   /api/itinerary/[id]     /api/ai-plan
               |                     |                     |
               v                     v                     v
   +-----------------------+ +---------------+ +-----------------------+
   |   Destination Layer   | | Supabase (DB) | |   External Services   |
   | - Geoapify Places API | | PostgreSQL /  | | - Open-Meteo (Weather)|
   | - Curated Seed Cache  | | Local Fallback| | - OpenRouter (AI Plan)|
   +-----------------------+ +---------------+ +-----------------------+
```

---

## 2. Database Schema (Supabase / PostgreSQL)

### 2.1 Table: `itinerary_items`

```sql
CREATE TABLE IF NOT EXISTS public.itinerary_items (
    id TEXT PRIMARY KEY,
    "placeId" TEXT NOT NULL,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    country TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    "imageUrl" TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    "dayNumber" INTEGER DEFAULT 1,
    notes TEXT,
    "targetDate" TEXT,
    "estimatedCost" DOUBLE PRECISION DEFAULT 0,
    "isVisited" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Row Level Security
ALTER TABLE public.itinerary_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read" ON public.itinerary_items FOR SELECT USING (true);
CREATE POLICY "Public Insert" ON public.itinerary_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update" ON public.itinerary_items FOR UPDATE USING (true);
CREATE POLICY "Public Delete" ON public.itinerary_items FOR DELETE USING (true);

-- Index for ordering by day
CREATE INDEX IF NOT EXISTS idx_itinerary_day ON public.itinerary_items ("dayNumber");
```

### 2.2 TypeScript Interface

```typescript
export interface ItineraryItem {
  id: string;
  placeId: string;
  name: string;
  city: string;
  country: string;
  category: 'Historical' | 'Nature' | 'Food & Dining' | 'Landmarks' | 'Entertainment' | 'Culture';
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
```

---

## 3. Environment Variables Configuration

Create a `.env.local` file with the following variables:

```env
# Supabase Database Configuration
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>

# OpenRouter AI Configuration
OPENROUTER_API_KEY=<your-openrouter-api-key>

# Optional External Places API
GEOAPIFY_API_KEY=<your-geoapify-key>

# Note: Open-Meteo Weather API requires NO API key.
```

---

## 4. REST API Endpoint Specifications

### 4.1 Destination Discovery

#### `GET /api/destinations`
Fetches a list of destinations with support for search, category filtering, and sorting.

- **Query Parameters:**
  - `city` (string, optional): e.g. `Chennai`, `Tokyo`, `Paris`, `All`
  - `search` (string, optional): Free text query matching name, tags, or description
  - `category` (string, optional): `Historical`, `Nature`, `Food & Dining`, `Landmarks`, `Entertainment`, `Culture`, `All`
  - `sortBy` (string, optional): `rating-desc`, `name-asc`, `name-desc`

- **Response `200 OK`:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": "chennai-kapaleeshwarar",
      "name": "Kapaleeshwarar Temple",
      "city": "Chennai",
      "country": "India",
      "category": "Historical",
      "description": "A 7th-century Dravidian marvel dedicated to Lord Shiva in Mylapore.",
      "imageUrl": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220",
      "rating": 4.8,
      "reviewCount": 3420,
      "latitude": 13.0336,
      "longitude": 80.2699,
      "priceLevel": "$",
      "tags": ["Architecture", "Heritage", "Ancient"],
      "bestTimeToVisit": "November to February",
      "address": "Kutchery Rd, Mylapore, Chennai 600004"
    }
  ]
}
```

---

#### `GET /api/destinations/[id]`
Retrieves full details for a specific destination along with live destination weather.

- **URL Parameter:** `id` (e.g. `chennai-kapaleeshwarar`)
- **Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "id": "chennai-kapaleeshwarar",
    "name": "Kapaleeshwarar Temple",
    "city": "Chennai",
    "country": "India",
    "category": "Historical",
    "latitude": 13.0336,
    "longitude": 80.2699,
    "weather": {
      "temperature": 29,
      "condition": "Partly Cloudy",
      "humidity": 76,
      "windSpeed": 13,
      "forecast": [
        { "date": "2026-10-18", "maxTemp": 30, "minTemp": 25, "condition": "Partly Cloudy" }
      ]
    }
  }
}
```

---

### 4.2 Itinerary Management (Supabase CRUD)

#### `GET /api/itinerary`
Retrieves all items stored in the itinerary database, grouped and sorted by `dayNumber` ascending.

- **Response `200 OK`:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "item-1792322446463-u9ytn",
      "placeId": "chennai-kapaleeshwarar",
      "name": "Kapaleeshwarar Temple",
      "city": "Chennai",
      "country": "India",
      "category": "Historical",
      "dayNumber": 1,
      "notes": "Visit early morning at 8:00 AM",
      "estimatedCost": 20,
      "isVisited": false,
      "createdAt": "2026-10-18T11:20:46.464Z"
    }
  ]
}
```

---

#### `POST /api/itinerary`
Adds a destination to the itinerary database.

- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "placeId": "tokyo-sensoji",
  "name": "Senso-ji Temple",
  "city": "Tokyo",
  "country": "Japan",
  "category": "Historical",
  "description": "Ancient Buddhist temple in Asakusa",
  "imageUrl": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26",
  "latitude": 35.7148,
  "longitude": 139.7967,
  "dayNumber": 2,
  "notes": "Eat melonpan at Nakamise street",
  "estimatedCost": 15
}
```
- **Response `201 Created`:**
```json
{
  "success": true,
  "message": "Destination successfully added to your itinerary.",
  "data": {
    "id": "item-1792322446463-u9ytn",
    "placeId": "tokyo-sensoji",
    "name": "Senso-ji Temple",
    "city": "Tokyo",
    "country": "Japan",
    "category": "Historical",
    "dayNumber": 2,
    "notes": "Eat melonpan at Nakamise street",
    "estimatedCost": 15,
    "isVisited": false,
    "createdAt": "2026-10-18T11:20:46.464Z"
  }
}
```

---

#### `PATCH /api/itinerary/[id]`
Updates an itinerary item's status, day assignment, or notes.

- **Headers:** `Content-Type: application/json`
- **Request Body (Partial):**
```json
{
  "isVisited": true,
  "dayNumber": 3,
  "notes": "Updated note: visited and took photos"
}
```
- **Response `200 OK`:**
```json
{
  "success": true,
  "message": "Itinerary item updated successfully.",
  "data": {
    "id": "item-1792322446463-u9ytn",
    "isVisited": true,
    "dayNumber": 3,
    "notes": "Updated note: visited and took photos",
    "updatedAt": "2026-10-18T11:25:00.000Z"
  }
}
```

---

#### `DELETE /api/itinerary/[id]`
Deletes a specific item from the itinerary.

- **Response `200 OK`:**
```json
{
  "success": true,
  "message": "Itinerary item successfully removed."
}
```

---

#### `DELETE /api/itinerary`
Clears the entire itinerary table.

- **Response `200 OK`:**
```json
{
  "success": true,
  "message": "Itinerary successfully cleared."
}
```

---

### 4.3 External Weather API (Open-Meteo)

#### `GET /api/weather`
Queries live destination meteorological data from Open-Meteo.

- **Query Parameters:**
  - `lat` (float, required): Latitude
  - `lon` (float, required): Longitude
  - `city` (string, optional): City display name

- **Upstream Open-Meteo Request:**
```
https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto
```

- **Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "city": "Chennai",
    "temperature": 29,
    "condition": "Partly Cloudy",
    "weatherCode": 2,
    "humidity": 76,
    "windSpeed": 13,
    "isDay": true,
    "forecast": [
      {
        "date": "2026-10-18",
        "maxTemp": 30,
        "minTemp": 25,
        "weatherCode": 2,
        "condition": "Partly Cloudy"
      },
      {
        "date": "2026-10-19",
        "maxTemp": 31,
        "minTemp": 26,
        "weatherCode": 95,
        "condition": "Thunderstorm"
      }
    ]
  }
}
```

---

### 4.4 AI Smart Itinerary Planner (OpenRouter)

#### `POST /api/ai-plan`
Generates a structured multi-day itinerary using an LLM on OpenRouter (default: `google/gemini-2.0-flash`).

- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "city": "Chennai",
  "days": 3,
  "theme": "Culture & Heritage",
  "pace": "moderate"
}
```

- **Upstream OpenRouter Request:**
  - **Endpoint:** `https://openrouter.ai/api/v1/chat/completions`
  - **Header:** `Authorization: Bearer {OPENROUTER_API_KEY}`
  - **Payload:**
    ```json
    {
      "model": "google/gemini-2.0-flash",
      "messages": [
        {
          "role": "user",
          "content": "Generate a structured JSON itinerary for {city} with {days} days, theme {theme}, pace {pace}."
        }
      ]
    }
    ```

- **Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "city": "Chennai",
    "days": 3,
    "theme": "Culture & Heritage",
    "overview": "A 3-day exploration of Chennai's ancient Dravidian temples, colonial forts, and coastal heritage.",
    "dailyPlans": [
      {
        "day": 1,
        "title": "Mylapore & Ancient Traditions",
        "spots": [
          {
            "name": "Kapaleeshwarar Temple",
            "category": "Historical",
            "timeOfDay": "Morning",
            "description": "Marvel at the colorful gopuram and morning rituals.",
            "tips": "Dress conservatively and remove shoes before entering.",
            "estimatedCost": "Free / Small donation"
          },
          {
            "name": "Mylapore Filter Coffee & Tiffin",
            "category": "Food & Dining",
            "timeOfDay": "Afternoon",
            "description": "Authentic crispy ghee roast dosas and frothed filter coffee.",
            "tips": "Try the freshly ground podi chutney.",
            "estimatedCost": "$3 - $5"
          }
        ]
      }
    ],
    "packingTips": [
      "Light cotton clothing",
      "Slip-on footwear for temples",
      "Umbrella or sun protection"
    ],
    "bestLocalFood": [
      "Ghee Podi Idli",
      "South Indian Filter Coffee",
      "Chettinad Curry"
    ]
  }
}
```

---

## 5. Resilient Fallback Architecture

To ensure the application **never fails** even during offline development or when evaluators test without external API credentials:

1. **Database Fallback:** If `NEXT_PUBLIC_SUPABASE_URL` is missing or the database connection drops, `itineraryStore.ts` writes to a local file store at `.data/itinerary.json`.
2. **AI Fallback:** If `OPENROUTER_API_KEY` is not provided, the API automatically triggers an algorithmic schedule generator producing identical JSON structures.
3. **Weather Fallback:** If Open-Meteo is unreachable, cached seasonal climate averages are returned gracefully.
