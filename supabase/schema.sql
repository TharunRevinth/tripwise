-- ==============================================================================
-- TripWise - Supabase Database Schema, Tables, and Security Roles (RLS)
-- ==============================================================================
-- Description:
-- Run this complete script directly in the Supabase SQL Editor:
-- Dashboard -> SQL Editor -> New query -> Paste & Run (Ctrl+Enter / Cmd+Enter).
-- ==============================================================================

-- 1. Create Itinerary Items Table
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

-- 2. Performance Indexes for Fast Lookups and Sorting
CREATE INDEX IF NOT EXISTS idx_itinerary_items_day_created 
    ON public.itinerary_items ("dayNumber" ASC, "createdAt" ASC);

CREATE INDEX IF NOT EXISTS idx_itinerary_items_placeId 
    ON public.itinerary_items ("placeId");

CREATE INDEX IF NOT EXISTS idx_itinerary_items_city 
    ON public.itinerary_items (city);

-- 3. Automatic Timestamp Updater Trigger
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

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.itinerary_items ENABLE ROW LEVEL SECURITY;

-- 5. Security Policies for Anonymous (`anon`) and Authenticated (`authenticated`) Roles
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

-- 6. Enable Realtime Broadcasting (Optional: allows live itinerary sync across tabs)
ALTER PUBLICATION supabase_realtime ADD TABLE public.itinerary_items;

-- 7. Verification Query (Checks table and row count)
SELECT 
    schemaname, 
    tablename, 
    rowsecurity AS rls_enabled 
FROM pg_tables 
WHERE tablename = 'itinerary_items';
