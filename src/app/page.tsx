'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import DiscoverView from '@/components/DiscoverView';
import AIPlannerView from '@/components/AIPlannerView';
import TripView from '@/components/TripView';
import PlaceSheet from '@/components/PlaceSheet';
import Footer from '@/components/Footer';

// Normalizers per backend contract
const nd = (d: any) => ({
  ...d,
  lat: d.latitude,
  lon: d.longitude,
});

const ni = (t: any) => ({
  ...t,
  lat: t.latitude,
  lon: t.longitude,
  day: t.dayNumber,
});

const byDay = (a: any, b: any) =>
  a.day - b.day || String(a.createdAt || '').localeCompare(String(b.createdAt || ''));

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const num = (s: any) => +(String(s).match(/\d+(\.\d+)?/) || [0])[0];

const defCost = (d: any) =>
  ({ $: 15, '$$': 40, '$$$': 90, '$$$$': 180 }[d?.priceLevel as string] ?? 0);

export default function HomePage() {
  const [view, setView] = useState<'discover' | 'plan' | 'trip'>('discover');
  const [destinations, setDestinations] = useState<any[]>([]);
  const [allDestinations, setAllDestinations] = useState<any[]>([]);
  const [trip, setTrip] = useState<any[]>([]);

  const [filterCountry, setFilterCountry] = useState<string>('');
  const [filterCity, setFilterCity] = useState<string>('');
  const [filterCat, setFilterCat] = useState<string>('');
  const [sort, setSort] = useState<string>('rating-desc');
  const [search, setSearch] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [flyToPlace, setFlyToPlace] = useState<any>(null);

  const [toast, setToast] = useState<{ message: string; visible: boolean }>({
    message: '',
    visible: false,
  });

  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true });
    const timer = setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  // Fetch all destinations once to derive cities, countries, and fallback data
  const fetchAllDestinations = useCallback(async () => {
    try {
      const res = await fetch('/api/destinations?sortBy=rating-desc');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        const normalized = json.data.map(nd);
        setAllDestinations(normalized);
      }
    } catch (err) {
      console.error('Error fetching all destinations:', err);
    }
  }, []);

  // Fetch filtered destinations
  const queryDestinations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filterCountry) params.set('country', filterCountry);
      if (filterCity) params.set('city', filterCity);
      if (search.trim()) params.set('search', search.trim());
      if (filterCat) params.set('category', filterCat);
      if (sort) params.set('sortBy', sort);

      const res = await fetch(`/api/destinations?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        const list = json.data.map(nd);
        setDestinations(list);
      } else {
        throw new Error(json.message || json.error || 'Failed to fetch places');
      }
    } catch (err: any) {
      console.error('Error querying destinations:', err);
      setError(err.message || 'Unable to connect to destinations API');
    } finally {
      setLoading(false);
    }
  }, [filterCountry, filterCity, search, filterCat, sort]);

  // Fetch trip
  const fetchTrip = useCallback(async () => {
    try {
      const res = await fetch('/api/itinerary');
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          const normalized = json.data.map(ni).sort(byDay);
          setTrip(normalized);
        }
      }
    } catch (err) {
      console.error('Error fetching itinerary:', err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchAllDestinations();
    fetchTrip();
  }, [fetchAllDestinations, fetchTrip]);

  // Query destinations whenever filters change (with debounce on search)
  useEffect(() => {
    const timer = setTimeout(() => {
      queryDestinations();
    }, 300);
    return () => clearTimeout(timer);
  }, [queryDestinations]);

  // Handle URL hash changes
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#trip') setView('trip');
      else if (hash === '#plan') setView('plan');
      else if (hash === '#discover') setView('discover');
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Derive unique countries
  const countries = useMemo(() => {
    return Array.from(new Set(allDestinations.map((d) => d.country))).filter(Boolean);
  }, [allDestinations]);

  // Derive unique cities (scoped by country if country filter is active)
  const cities = useMemo(() => {
    const list = filterCountry
      ? allDestinations.filter((d) => d.country.toLowerCase() === filterCountry.toLowerCase())
      : allDestinations;
    return Array.from(new Set(list.map((d) => d.city))).filter(Boolean);
  }, [allDestinations, filterCountry]);

  // Add place to trip
  const handleAddPlace = async (
    dest: any,
    details: { day: number; cost: number; notes: string }
  ) => {
    try {
      const payload = {
        placeId: dest.id,
        name: dest.name,
        city: dest.city,
        country: dest.country,
        category: dest.category,
        description: dest.description,
        imageUrl: dest.imageUrl,
        latitude: dest.latitude ?? dest.lat,
        longitude: dest.longitude ?? dest.lon,
        dayNumber: details.day || 1,
        notes: details.notes || '',
        estimatedCost: details.cost ?? defCost(dest),
      };

      const res = await fetch('/api/itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || json.success === false) {
        throw new Error(json.message || json.error || 'Failed to add place');
      }

      const item = ni(json.data);
      setTrip((prev) => [...prev.filter((t) => t.id !== item.id), item].sort(byDay));
      showToast(`${dest.name} is in your trip`);
    } catch (err: any) {
      showToast(`Couldn't add it: ${err.message}`);
      throw err;
    }
  };

  // Toggle add/remove from card
  const handleToggleAdd = async (dest: any) => {
    const existing = trip.find((t) => t.placeId === dest.id);
    if (existing) {
      await handleRemoveItem(existing.id);
    } else {
      await handleAddPlace(dest, {
        day: 1,
        cost: defCost(dest),
        notes: '',
      });
    }
  };

  // Remove place from trip
  const handleRemoveItem = async (id: string) => {
    const item = trip.find((t) => t.id === id);
    const prevTrip = [...trip];
    // Optimistic update
    setTrip((prev) => prev.filter((t) => t.id !== id));

    try {
      const res = await fetch(`/api/itinerary/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      showToast(`Removed ${item ? item.name : 'stop'}`);
    } catch (err: any) {
      setTrip(prevTrip);
      showToast(`Couldn't remove it: ${err.message}`);
    }
  };

  // Patch item (isVisited, dayNumber, notes, estimatedCost)
  const handlePatchItem = async (id: string, updates: any) => {
    const prevTrip = [...trip];
    setTrip((prev) =>
      prev
        .map((t) => {
          if (t.id === id) {
            const next = { ...t, ...updates };
            if ('dayNumber' in updates) next.day = updates.dayNumber;
            return next;
          }
          return t;
        })
        .sort(byDay)
    );

    try {
      const res = await fetch(`/api/itinerary/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch (err: any) {
      setTrip(prevTrip);
      showToast("Couldn't save that change");
    }
  };

  // Clear entire trip
  const handleClearTrip = async () => {
    if (!window.confirm('Remove every stop from your trip?')) return;
    const prevTrip = [...trip];
    setTrip([]);

    try {
      const res = await fetch('/api/itinerary', { method: 'DELETE' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      showToast('Trip cleared');
    } catch (err: any) {
      setTrip(prevTrip);
      showToast(`Couldn't clear: ${err.message}`);
    }
  };

  // Add AI spot to trip
  const handleAddSpotToTrip = async (
    day: number,
    spot: any,
    city: string
  ): Promise<boolean> => {
    const q = city.toLowerCase();
    const citySpots = allDestinations.filter((d) => d.city.toLowerCase() === q);
    const match = citySpots.find(
      (d) =>
        d.name.toLowerCase().includes(spot.name.toLowerCase()) ||
        spot.name.toLowerCase().includes(d.name.toLowerCase())
    );

    const placeId = match ? match.id : `ai-${slug(city + ' ' + spot.name)}`;
    if (trip.some((t) => t.placeId === placeId)) {
      return false;
    }

    const avgCoords = citySpots.length
      ? {
          latitude: citySpots.reduce((a, b) => a + (b.lat || 0), 0) / citySpots.length,
          longitude: citySpots.reduce((a, b) => a + (b.lon || 0), 0) / citySpots.length,
        }
      : { latitude: 0, longitude: 0 };

    const payload = {
      placeId,
      name: match ? match.name : spot.name,
      city: match ? match.city : city,
      country: match ? match.country : citySpots[0]?.country || '',
      category: ['Historical', 'Nature', 'Food & Dining', 'Landmarks', 'Entertainment', 'Culture'].includes(
        spot.category
      )
        ? spot.category
        : 'Culture',
      description: spot.description || '',
      imageUrl: match ? match.imageUrl : undefined,
      latitude: match ? (match.latitude ?? match.lat) : avgCoords.latitude,
      longitude: match ? (match.longitude ?? match.lon) : avgCoords.longitude,
      dayNumber: day,
      notes: spot.tips || '',
      estimatedCost: num(spot.estimatedCost),
    };

    try {
      const res = await fetch('/api/itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || json.success === false) return false;
      const item = ni(json.data);
      setTrip((prev) => [...prev, item].sort(byDay));
      return true;
    } catch (err) {
      return false;
    }
  };

  // Fly globe to country when country chip is clicked
  const handleSetFilterCountry = (country: string) => {
    setFilterCountry(country);
    if (country) {
      // If current city is not in this country, clear city
      const isCurrentCityInCountry = allDestinations.some(
        (d) =>
          d.city.toLowerCase() === filterCity.toLowerCase() &&
          d.country.toLowerCase() === country.toLowerCase()
      );
      if (!isCurrentCityInCountry) {
        setFilterCity('');
      }

      const countryDest = allDestinations.filter(
        (d) => d.country.toLowerCase() === country.toLowerCase() && isFinite(d.lat)
      );
      if (countryDest.length) {
        setFlyToPlace({
          id: null,
          lat: countryDest.reduce((a, b) => a + b.lat, 0) / countryDest.length,
          lon: countryDest.reduce((a, b) => a + b.lon, 0) / countryDest.length,
        });
      }
    } else {
      setFilterCity('');
    }
  };

  // Fly globe to city when city chip clicked
  const handleSetFilterCity = (city: string) => {
    setFilterCity(city);
    if (city) {
      const cityDest = allDestinations.filter(
        (d) => d.city.toLowerCase() === city.toLowerCase() && isFinite(d.lat)
      );
      if (cityDest.length) {
        // Automatically align country if not set
        if (!filterCountry || filterCountry.toLowerCase() !== cityDest[0].country.toLowerCase()) {
          setFilterCountry(cityDest[0].country);
        }
        setFlyToPlace({
          id: null,
          lat: cityDest.reduce((a, b) => a + b.lat, 0) / cityDest.length,
          lon: cityDest.reduce((a, b) => a + b.lon, 0) / cityDest.length,
        });
      }
    }
  };

  return (
    <>
      <Navbar view={view} setView={setView} tripCount={trip.length} />

      <main>
        {view === 'discover' && (
          <DiscoverView
            destinations={destinations}
            allDestinations={allDestinations}
            trip={trip}
            countries={countries}
            filterCountry={filterCountry}
            setFilterCountry={handleSetFilterCountry}
            cities={cities}
            filterCity={filterCity}
            setFilterCity={handleSetFilterCity}
            filterCat={filterCat}
            setFilterCat={setFilterCat}
            sort={sort}
            setSort={setSort}
            search={search}
            setSearch={setSearch}
            loading={loading}
            error={error}
            onRetry={queryDestinations}
            onResetFilters={() => {
              setFilterCountry('');
              setFilterCity('');
              setFilterCat('');
              setSearch('');
              setSort('rating-desc');
            }}
            onOpenSheet={(id) => setSelectedPlaceId(id)}
            onToggleAdd={handleToggleAdd}
            onGoToPlan={() => setView('plan')}
            flyToPlace={flyToPlace}
          />
        )}

        {view === 'plan' && (
          <AIPlannerView
            cities={cities}
            allDestinations={allDestinations}
            trip={trip}
            onAddSpotToTrip={handleAddSpotToTrip}
            showToast={showToast}
          />
        )}

        {view === 'trip' && (
          <TripView
            trip={trip}
            onOpenSheet={(id) => setSelectedPlaceId(id)}
            onPatchItem={handlePatchItem}
            onRemoveItem={handleRemoveItem}
            onClearTrip={handleClearTrip}
            onGoToDiscover={() => setView('discover')}
            onGoToPlan={() => setView('plan')}
            showToast={showToast}
          />
        )}
      </main>

      <Footer />

      {/* Place Sheet Dialog */}
      <PlaceSheet
        placeId={selectedPlaceId}
        onClose={() => setSelectedPlaceId(null)}
        allDestinations={allDestinations}
        trip={trip}
        onAddPlace={handleAddPlace}
        onRemoveItem={handleRemoveItem}
        onOpenPlace={(id) => setSelectedPlaceId(id)}
        onGoToTrip={() => setView('trip')}
      />

      {/* Toast Notification */}
      <div
        id="toast"
        role="status"
        aria-live="polite"
        className={toast.visible ? 'on' : ''}
      >
        {toast.message}
      </div>
    </>
  );
}
