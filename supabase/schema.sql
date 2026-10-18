-- Supabase Schema for TripWise (Smart Travel Planner)
-- Execute this script in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

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

-- Enable Row Level Security (RLS)
ALTER TABLE public.itinerary_items ENABLE ROW LEVEL SECURITY;

-- Allow public read/write access for recruitment evaluation / demo purposes
CREATE POLICY "Allow public read access" 
ON public.itinerary_items FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert access" 
ON public.itinerary_items FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update access" 
ON public.itinerary_items FOR UPDATE 
USING (true);

CREATE POLICY "Allow public delete access" 
ON public.itinerary_items FOR DELETE 
USING (true);

-- Index for speedy queries by dayNumber
CREATE INDEX IF NOT EXISTS idx_itinerary_day ON public.itinerary_items ("dayNumber");
