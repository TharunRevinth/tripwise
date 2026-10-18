# Supabase Database Setup & SQL Queries Guide

This guide provides the complete, copy-paste ready SQL commands to initialize your Supabase PostgreSQL database for **TripWise**, configure Row Level Security (RLS), and assign permissions for anonymous and authenticated access.

---

## 1. Quick Setup in Supabase Dashboard

1. Log into your project at [https://supabase.com/dashboard](https://supabase.com/dashboard).
2. Select your project.
3. In the left navigation menu, click **SQL Editor** (icon with `>_`).
4. Click **New Query** (or the **+** button).
5. Paste the complete SQL script below into the editor.
6. Click **Run** (or press `Ctrl+Enter` / `Cmd+Enter`).
7. Confirm the result shows `Success. No rows returned` or returns the verification row.

---

## 2. Complete SQL Script

```sql
-- ==============================================================================
-- TripWise - Supabase Database Schema, Tables, and Security Roles (RLS)
-- ==============================================================================

-- Step 1: Create Itinerary Items Table
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
    "dayNumber" INTEGER DEFAULT 1 NOT NULL,
    notes TEXT,
    "targetDate" TEXT,
    "estimatedCost" DOUBLE PRECISION DEFAULT 0 NOT NULL,
    "isVisited" BOOLEAN DEFAULT false NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Step 2: Create Performance Indexes for Fast Lookups and Sorting
CREATE INDEX IF NOT EXISTS idx_itinerary_items_day_created 
    ON public.itinerary_items ("dayNumber" ASC, "createdAt" ASC);

CREATE INDEX IF NOT EXISTS idx_itinerary_items_placeId 
    ON public.itinerary_items ("placeId");

CREATE INDEX IF NOT EXISTS idx_itinerary_items_city 
    ON public.itinerary_items (city);

-- Step 3: Automatic Timestamp Updater Trigger
CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_itinerary_items_updated_at ON public.itinerary_items;
CREATE TRIGGER trg_itinerary_items_updated_at
    BEFORE UPDATE ON public.itinerary_items
    FOR EACH ROW
    EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- Step 4: Enable Row Level Security (RLS)
ALTER TABLE public.itinerary_items ENABLE ROW LEVEL SECURITY;

-- Step 5: Configure Permissions & Policies for Anonymous and Authenticated Roles
-- Grants full CRUD access to client sessions using the Supabase public anon key.

-- Policy: SELECT (Read Itinerary)
DROP POLICY IF EXISTS "Allow public read access" ON public.itinerary_items;
CREATE POLICY "Allow public read access"
    ON public.itinerary_items
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Policy: INSERT (Add Destinations to Trip)
DROP POLICY IF EXISTS "Allow public insert access" ON public.itinerary_items;
CREATE POLICY "Allow public insert access"
    ON public.itinerary_items
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Policy: UPDATE (Modify Day, Notes, Cost, Visited Status)
DROP POLICY IF EXISTS "Allow public update access" ON public.itinerary_items;
CREATE POLICY "Allow public update access"
    ON public.itinerary_items
    FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- Policy: DELETE (Remove Single Item or Clear Trip)
DROP POLICY IF EXISTS "Allow public delete access" ON public.itinerary_items;
CREATE POLICY "Allow public delete access"
    ON public.itinerary_items
    FOR DELETE
    TO anon, authenticated
    USING (true);

-- Step 6: Enable Realtime Broadcasting (Optional: allows live sync across tabs)
ALTER PUBLICATION supabase_realtime ADD TABLE public.itinerary_items;

-- Step 7: Verify Table and Security Status
SELECT 
    schemaname, 
    tablename, 
    rowsecurity AS rls_enabled 
FROM pg_tables 
WHERE tablename = 'itinerary_items';
```

---

## 3. Retrieve Environment Variables from Supabase

After running the query, link your project to TripWise:

1. In the Supabase Dashboard, click **Project Settings** (gear icon at the bottom left).
2. Click **API** under the Configuration menu.
3. Locate the **Project URL** and **Project API Keys**:
   - `Project URL`: Copy this value (e.g. `https://xyzcompany.supabase.co`).
   - `anon` `public` key: Copy this token.
4. Add these values into your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key-here
```

5. Restart your development or production server:
```bash
npm run dev
# or for production:
npm run build && npm run start -- -p 3000
```

---

## 4. Verification Check

To test that Supabase is storing items correctly:
1. Open TripWise in your browser (`http://localhost:3000`).
2. Add any destination to your trip.
3. In Supabase Dashboard, open **Table Editor** -> `itinerary_items`.
4. You should see the newly inserted destination with all fields populated!
