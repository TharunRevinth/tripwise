# 🌍 TripWise — Smart Travel Planner

[![Track](https://img.shields.io/badge/Track-3%3A%20Full--Stack-blue.svg)](https://github.com)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61dafb)](https://react.dev)
[![Three.js](https://img.shields.io/badge/Three.js-3D%20Globe%20%26%20Fox-black)](https://threejs.org)
[![Supabase](https://img.shields.io/badge/Database-Supabase-3ecf8e)](https://supabase.com)
[![Open-Meteo](https://img.shields.io/badge/Weather-Open--Meteo-ff7e67)](https://open-meteo.com)
[![OpenRouter](https://img.shields.io/badge/AI-OpenRouter-6366f1)](https://openrouter.ai)

> **AWS Student Builder Group, VIT Chennai — Web Development Recruitment Task**  
> **Track:** Track 3: Full-Stack Development

---

## 📌 Project Overview

**TripWise** is a full-stack, AI-augmented travel planning application built with Next.js 15 App Router, React 19, and Three.js. It features a distinctive neo-brutalist bento design with hand-drawn accents, real-time Open-Meteo weather integration, geospatial 3D earth exploration with coordinate raycasting, OpenRouter multi-day AI itinerary generation, budget calculation, transit route estimation, and Supabase database persistence.

---

## ✨ Features & Architecture

### 1. Discover Experience
- **Neo-Brutalist Hero Bento:** Headline with self-drawing SVG squiggles, debounced search form, live count-up stats (`places` and `cities`), and animated AI shortcut.
- **Interactive 3D Toon Globe (Three.js):** Custom toon-shaded 3-band sphere with land/water mask, drifting cloud clusters, orbiting animated Flamingo GLTF model, clickable raycaster pins, and flight camera arcs.
- **Dynamic City Marquee:** Smooth continuous ticker of featured destinations with pause-on-hover.
- **Filters & Sorting:** City chips, category filters (`Historical 🏛️`, `Nature 🌿`, `Food & Dining 🍜`, `Landmarks 🗼`, `Entertainment 🎭`, `Culture 🎨`), sort by top-rated or name, skeleton loaders, and empty/error states with retry.

### 2. Slide-In Place Sheet
- Accessible slide-in drawer with overlay, keyboard `Escape` dismissal, and focus trapping.
- **Real-Time Weather Tile (Open-Meteo):** Live temperature, condition emoji, humidity, wind speed, and 5-day daily forecast with high/low temperatures.
- **Bento Fact Tiles:** Best time to visit, price tiers (`$`, `$$`, `$$$`, `$$$$`), rating with review count, address, and OpenStreetMap direct link.
- **Itinerary Add Form:** Select target day (1–10), prefilled cost per person, custom visit notes, or quick-removal if already saved.
- **Contextual Recommendations:** "More in {city}" quick-links to nearby attractions.

### 3. OpenRouter AI Planner
- Form with city autocomplete datalist, trip duration (1–7 days), vibe/theme selector (*Culture & Heritage*, *Food & Markets*, *Nature & Outdoors*, *Relax & Beaches*, *Nightlife & Fun*, *Family Friendly*), and pace chips (*relaxed*, *moderate*, *packed*).
- Animated progress bar loader while the AI crafts the multi-day schedule.
- Output cards with time-of-day timeline spots, handwritten tips, and cost estimates.
- **1-Click Add:** Add individual spots or an entire day into your itinerary, automatically matching known coordinates and tags.
- Curated **"Pack this"** checklist and **"Eat this"** local delicacy recommendations.

### 4. My Trip Itinerary, Live Currency Converter & Route Estimator
- **Day-by-Day Timeline:** Stops grouped by day with optional calendar dates derived from trip start date.
- **Interactive Stop Cards:** Thumbnail, title, editable notes (auto-PATCH on change), day selector, cost per person with live currency preview, and animated "VISITED" stamp with strike-through.
- **3D Walking Fox Mascot:** Rendered in Three.js WebGL canvas with skeletal bone walk animation when the trip is empty.
- **Live Currency Converter & Foreign Trip Variance Buffer:**
  - Real-time exchange rates via `/api/currency` (Open Exchange Rates API, 1-hour cache, resilient fallback).
  - Multi-currency support: USD (`$`), INR (`₹`), EUR (`€`), GBP (`£`), JPY (`¥`), AED (`AED`), SGD (`S$`), THB (`฿`), IDR (`Rp`), AUD (`A$`), CAD (`C$`), CHF (`CHF`).
  - **Foreign Trip Buffer (±%):** Dynamic toggles (`±0%`, `±5%`, `±10%`, `±15%`) providing realistic estimate ranges to cover credit card foreign transaction fees (2–3%), seasonal FX swings, and unexpected expenses.
  - Live FX status indicator (`● Live FX` / `○ Offline FX`).
- **Live Budget Calculator:** Dynamic progress bar turning red when exceeding budget, and over/under budget advisory.
- **Multi-Modal Transit Route Estimator:** Haversine distance calculation between consecutive stops comparing:
  - 🚶 **Walk:** Free (for distances $\le 5$ km)
  - 🚕 **Cab:** Estimated vehicle cost per group
  - 🚌 **Bus:** Regional and long-distance transit
  - 🚆 **Train:** Intercity rail travel
  - ✈️ **Flight:** Long-haul travel ($\ge 250$ km)
- Preference switch (*Cheapest*, *Balanced*, *Fastest*) with recommended mode highlighted.
- Plain-text trip export (`.txt`) with selected currency breakdown and trip reset confirmation.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | Next.js 15 (App Router), React 19, TypeScript strict mode |
| **Styling & Design System** | Pure CSS Tokens & Neo-Brutalist Bento System (`--cv`, `--pp`, `--ink`, `--tom`, `--sun`, `--mint`, `--sky`, `--pink`, `--lil`), zero external component libraries |
| **Typography** | `next/font/google`: Bricolage Grotesque (display), Instrument Sans (body), Caveat (handwritten accents) |
| **3D Graphics** | Three.js (`three` + `GLTFLoader`), equirectangular water/land projection, GLTF skeletal animations |
| **Backend & APIs** | Next.js API Routes (`/api/destinations`, `/api/itinerary`, `/api/weather`, `/api/ai-plan`, `/api/currency`) |
| **Database** | **Supabase** (PostgreSQL) via `@supabase/supabase-js` with automatic resilient local storage fallback |
| **External APIs** | **Open-Meteo API** (Live Weather, zero-config), **Open Exchange Rates** (Live FX rates), **OpenRouter AI / NVIDIA NIM** (Multi-day itinerary generation) |
| **Testing & Assets** | Playwright (`scripts/screenshots.ts`) |

---

## 🔌 Backend REST API Specification

All API responses follow the standard JSON envelope: `{ success: boolean, data?: any, error?: string, message?: string }`.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/destinations` | Search and filter destinations (`country`, `city`, `category`, `search`, `sortBy`). |
| `GET` | `/api/destinations/[id]` | Fetch single destination with real-time Open-Meteo weather. |
| `GET` | `/api/weather` | Live weather forecast from Open-Meteo (`lat`, `lon`, `city`). |
| `GET` | `/api/currency` | Live exchange rates and fallback matrix (`USD`, `INR`, `EUR`, `GBP`, `JPY`, etc.). |
| `GET` | `/api/itinerary` | Retrieve all saved itinerary items from Supabase / local persistence. |
| `POST` | `/api/itinerary` | Add a place to the itinerary with day assignment, cost, and notes. |
| `PATCH` | `/api/itinerary/[id]` | Update itinerary item (`isVisited`, `dayNumber`, `notes`, `estimatedCost`). |
| `DELETE` | `/api/itinerary/[id]` | Remove a single item from the itinerary. |
| `DELETE` | `/api/itinerary` | Clear all stops from the itinerary. |
| `POST` | `/api/ai-plan` | Generate customized multi-day itinerary via OpenRouter or NVIDIA NIM. |

---

## 🗄️ Database Setup (Supabase)

1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard and run the following script:

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

3. Add your Supabase credentials to `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
OPENROUTER_API_KEY=your-openrouter-key-here
```

*(Note: If no Supabase credentials are provided, TripWise automatically utilizes its built-in local store so the app operates with 100% functionality out of the box).*

---

## 🚀 Getting Started Locally

### 1. Clone the repository
```bash
git clone <repo-url>
cd tripwise
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build and Verify
```bash
npx tsc --noEmit
npm run lint
npm run build
```

---

## 📸 Automated Screenshot Capture

High-resolution screenshots for the submission PDF are automatically captured using Playwright across desktop (1360px) and mobile (390px) viewports:

```bash
# Ensure server is running on port 3000
npm run build
npm run start -- -p 3000

# In another terminal:
npx tsx scripts/screenshots.ts
```

Saved screenshots in `/screenshots`:
- `discover.png` — Hero bento, 3D toon globe, stats count-up
- `search-results.png` — Filtered search results
- `filtered-by-category.png` — Category chip active filtering
- `empty-results.png` — Graceful empty state with reset button
- `place-sheet.png` — Slide-in place drawer with Open-Meteo live weather
- `ai-planner-result.png` — Multi-day AI plan with timeline & pack/eat tips
- `trip-populated.png` — Day-by-day stops, budget card, transit routes
- `trip-empty.png` — Animated 3D walking Fox mascot
- `dark-mode.png` — High-contrast dark theme
- `discover-mobile.png`, `place-sheet-mobile.png`, `trip-mobile.png` — Responsive mobile layout

---

## 📜 Attributions & Licenses

- **Weather Data:** [Open-Meteo](https://open-meteo.com/) (Licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/))
- **Flamingo 3D Model:** [three.js examples](https://github.com/mrdoob/three.js) (mrdoob)
- **Fox 3D Model:** Character model by PixelMannen (CC0), rigging & walk animation by @tomkranis ([CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)), via the [Khronos glTF Sample Models](https://github.com/KhronosGroup/glTF-Sample-Models).
- **Map Links:** [OpenStreetMap](https://www.openstreetmap.org/)
