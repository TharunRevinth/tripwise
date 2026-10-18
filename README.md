# 🌍 TripWise — Smart Travel Planner

[![Track](https://img.shields.io/badge/Track-3%3A%20Full--Stack-blue.svg)](https://github.com)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8)](https://tailwindcss.com)
[![Three.js](https://img.shields.io/badge/Three.js-3D%20Globe-black)](https://threejs.org)
[![Supabase](https://img.shields.io/badge/Database-Supabase-3ecf8e)](https://supabase.com)
[![Open-Meteo](https://img.shields.io/badge/Weather-Open--Meteo-ff7e67)](https://open-meteo.com)
[![OpenRouter](https://img.shields.io/badge/AI-OpenRouter-6366f1)](https://openrouter.ai)

> **AWS Student Builder Group, VIT Chennai — Web Development Recruitment Task**  
> **Track:** Track 3: Full-Stack Development

---

## 📌 Project Overview
Planning a trip often involves searching across fragmented websites to discover places, compare options, and keep track of destinations worth visiting. **TripWise** makes this process effortless.

**TripWise** is a full-stack, AI-enhanced travel planning application featuring:
1. **Interactive 3D Earth Globe (Three.js):** Drag to rotate Earth, click glowing city pins (Chennai, Tokyo, Paris, New York, Rome, Bali) to filter destinations.
2. **Destination Exploration:** Search, category filter (Historical, Nature, Dining, Landmarks, Entertainment, Culture), and sorting.
3. **Live Weather Widget (Open-Meteo API):** Real-time temperature, condition, humidity, wind, and multi-day forecast for any destination without requiring an API key.
4. **Itinerary Management:** Add destinations with custom notes and day assignments (Day 1, Day 2, etc.), mark as visited, export to Calendar (`.ics`), and print view.
5. **Database Persistence (Supabase + Resilient Local Fallback):** Saved itinerary items are stored in Supabase with automatic local storage fallback for offline resilience.
6. **AI Travel Concierge (OpenRouter):** Generates structured multi-day itineraries, packing tips, and local dining advice with 1-click import into your trip.
7. **Interactive Trip Budget Estimator:** Multi-currency calculator (INR ₹, USD $, EUR €, GBP £) with visual breakdown for lodging, food, transit, and buffer.
8. **Dark / Light Mode:** Smooth theme transitions with system preference detection.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, Lucide React Icons |
| **3D Visuals** | Three.js (`three`) — Interactive 3D Earth Globe with coordinate raycasting |
| **Backend & REST APIs** | Next.js API Routes (`/api/destinations`, `/api/itinerary`, `/api/weather`, `/api/ai-plan`) |
| **Database** | **Supabase** (PostgreSQL) via `@supabase/supabase-js` with local JSON persistent fallback |
| **External APIs** | **Open-Meteo API** (Live Weather, zero-config), **OpenRouter AI** (Smart Itineraries), **Geoapify Places** |
| **Deployment** | Vercel |

---

## 🔌 REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/destinations` | Search and filter destinations (`city`, `category`, `search`, `sortBy`). |
| `GET` | `/api/destinations/[id]` | Fetch single destination with real-time Open-Meteo weather. |
| `GET` | `/api/weather` | Live weather forecast from Open-Meteo (`lat`, `lon`, `city`). |
| `GET` | `/api/itinerary` | Retrieve all saved itinerary items from the database. |
| `POST` | `/api/itinerary` | Add a place to the itinerary with target day and notes. |
| `PATCH` | `/api/itinerary/[id]` | Update itinerary item (day assignment, notes, or visited state). |
| `DELETE` | `/api/itinerary/[id]` | Remove an item from the itinerary. |
| `DELETE` | `/api/itinerary` | Clear entire itinerary. |
| `POST` | `/api/ai-plan` | Generate customized multi-day itinerary via OpenRouter. |

---

## 🗄️ Database Setup (Supabase)

1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard and execute the script in [`supabase/schema.sql`](./supabase/schema.sql):

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

ALTER TABLE public.itinerary_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Access" ON public.itinerary_items FOR ALL USING (true);
```

3. Add your Supabase keys to `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

*(Note: If no Supabase credentials are provided, TripWise automatically utilizes its built-in local store so the app operates with 100% functionality out of the box).*

---

## 🚀 Getting Started Locally

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd tripwise
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables (optional)
```bash
cp .env.example .env.local
```

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 Submission Compliance Checklist
- [x] **Track Selected:** Track 3 (Full-Stack Development)
- [x] **Real External API:** Open-Meteo Weather API + OpenRouter AI Integration
- [x] **Destination Exploration:** Responsive card grid, tags, ratings, price tiers
- [x] **Search, Filter & Sort:** Debounced search, category filters, and sorting
- [x] **Destination Details:** Modal with comprehensive info & live Open-Meteo weather
- [x] **Itinerary Management:** Add, view, remove, organize by day, and persist in Supabase
- [x] **UI Polish:** Three.js 3D Earth Globe, Dark/Light mode, Trip Budget Estimator, Calendar export (`.ics`), Skeleton loaders, and error handling.
