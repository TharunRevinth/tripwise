import fs from 'fs';
import path from 'path';
import { supabase, isSupabaseConfigured } from './supabase';
import { ItineraryItem } from '@/types';

const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'itinerary.json');

// Ensure local persistence fallback file exists
function ensureLocalStore(): ItineraryItem[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      const initialItems: ItineraryItem[] = [
        {
          id: 'seed-1',
          placeId: 'chennai-kapaleeshwarar',
          name: 'Kapaleeshwarar Temple',
          city: 'Chennai',
          country: 'India',
          category: 'Historical',
          description: 'A 7th-century CE temple of Shiva in Mylapore, Chennai, built in traditional Dravidian architecture.',
          imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
          latitude: 13.0336,
          longitude: 80.2699,
          dayNumber: 1,
          notes: 'Visit during morning aarti (around 8:00 AM) to experience the peaceful atmosphere.',
          estimatedCost: 0,
          isVisited: false,
          createdAt: new Date().toISOString()
        },
        {
          id: 'seed-2',
          placeId: 'chennai-marina-beach',
          name: 'Marina Beach',
          city: 'Chennai',
          country: 'India',
          category: 'Nature',
          description: 'The second-longest natural urban beach in the world, stretching 13 km along the Bay of Bengal.',
          imageUrl: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80',
          latitude: 13.0500,
          longitude: 80.2824,
          dayNumber: 1,
          notes: 'Enjoy evening sunset walk and fresh roasted corn/sundal from beach stalls.',
          estimatedCost: 150,
          isVisited: false,
          createdAt: new Date().toISOString()
        }
      ];
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialItems, null, 2), 'utf-8');
      return initialItems;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading local itinerary store:', err);
    return [];
  }
}

function writeLocalStore(items: ItineraryItem[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing local itinerary store:', err);
  }
}

export async function getItineraryItems(): Promise<ItineraryItem[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('itinerary_items')
        .select('*')
        .order('dayNumber', { ascending: true })
        .order('createdAt', { ascending: true });

      if (error) {
        console.warn('Supabase query error, falling back to local store:', error.message);
        return ensureLocalStore();
      }
      return (data as ItineraryItem[]) || [];
    } catch (err) {
      console.warn('Supabase error, falling back to local store:', err);
      return ensureLocalStore();
    }
  }
  return ensureLocalStore();
}

export async function addItineraryItem(item: Omit<ItineraryItem, 'id' | 'createdAt'>): Promise<ItineraryItem> {
  const newItem: ItineraryItem = {
    ...item,
    id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('itinerary_items')
        .insert([newItem])
        .select()
        .single();

      if (error) {
        console.warn('Supabase insert error, saving locally:', error.message);
        const items = ensureLocalStore();
        items.push(newItem);
        writeLocalStore(items);
        return newItem;
      }
      return data as ItineraryItem;
    } catch (err) {
      console.warn('Supabase insert failed, saving locally:', err);
      const items = ensureLocalStore();
      items.push(newItem);
      writeLocalStore(items);
      return newItem;
    }
  }

  const items = ensureLocalStore();
  items.push(newItem);
  writeLocalStore(items);
  return newItem;
}

export async function updateItineraryItem(id: string, updates: Partial<ItineraryItem>): Promise<ItineraryItem | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('itinerary_items')
        .update({ ...updates, updatedAt: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        return data as ItineraryItem;
      }
    } catch (err) {
      console.warn('Supabase update failed, falling back to local store:', err);
    }
  }

  const items = ensureLocalStore();
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) return null;

  items[index] = {
    ...items[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  writeLocalStore(items);
  return items[index];
}

export async function deleteItineraryItem(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('itinerary_items').delete().eq('id', id);
      if (!error) return true;
    } catch (err) {
      console.warn('Supabase delete failed, falling back to local store:', err);
    }
  }

  const items = ensureLocalStore();
  const filtered = items.filter((i) => i.id !== id);
  writeLocalStore(filtered);
  return true;
}

export async function clearItinerary(): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('itinerary_items').delete().neq('id', '');
      if (!error) return true;
    } catch (err) {
      console.warn('Supabase clear failed, falling back to local store:', err);
    }
  }

  writeLocalStore([]);
  return true;
}
