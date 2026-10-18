'use client';

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { 
  Search, Sparkles, Calculator, Luggage, ArrowUpDown, 
  RefreshCw, MapPin, AlertCircle, ArrowRight, Compass 
} from 'lucide-react';

import Navbar from '@/components/Navbar';
import DestinationCard from '@/components/DestinationCard';
import DestinationDetailsModal from '@/components/DestinationDetailsModal';
import ItineraryView from '@/components/ItineraryView';
import TripEstimatorModal from '@/components/TripEstimatorModal';
import AITripPlannerModal from '@/components/AITripPlannerModal';
import PackingChecklistModal from '@/components/PackingChecklistModal';
import SkeletonCard from '@/components/SkeletonCard';
import EmptyState from '@/components/EmptyState';
import Toast, { ToastMessage } from '@/components/Toast';

import { Destination, Category, ItineraryItem, AITripPlan } from '@/types';
import { getFeaturedCities } from '@/lib/api/destinations';

const Globe3D = dynamic(() => import('@/components/Globe3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[360px] sm:h-[440px] lg:h-[480px] rounded-2xl bg-zinc-950 border border-zinc-800 animate-pulse flex items-center justify-center text-zinc-500 text-xs font-mono">
      Initializing 3D Viewport...
    </div>
  ),
});

const CATEGORIES: Category[] = [
  'All',
  'Historical',
  'Nature',
  'Food & Dining',
  'Landmarks',
  'Entertainment',
  'Culture',
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'explore' | 'itinerary' | 'estimator' | 'ai-planner'>('explore');

  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [sortBy, setSortBy] = useState<'rating-desc' | 'name-asc' | 'name-desc'>('rating-desc');

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [itineraryItems, setItineraryItems] = useState<ItineraryItem[]>([]);
  const [loadingDestinations, setLoadingDestinations] = useState<boolean>(true);
  const [errorDestinations, setErrorDestinations] = useState<string | null>(null);

  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [isEstimatorOpen, setIsEstimatorOpen] = useState(false);
  const [isAIPlannerOpen, setIsAIPlannerOpen] = useState(false);
  const [isPackingOpen, setIsPackingOpen] = useState(false);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const loadDestinations = async () => {
    setLoadingDestinations(true);
    setErrorDestinations(null);
    try {
      const params = new URLSearchParams();
      if (selectedCity && selectedCity !== 'All') params.set('city', selectedCity);
      if (searchQuery.trim()) params.set('search', searchQuery.trim());
      if (selectedCategory && selectedCategory !== 'All') params.set('category', selectedCategory);
      if (sortBy) params.set('sortBy', sortBy);

      const res = await fetch(`/api/destinations?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.success) {
        setDestinations(json.data);
      } else {
        throw new Error(json.error || 'Failed to load destinations');
      }
    } catch (err: any) {
      console.error('Error fetching destinations:', err);
      setErrorDestinations('Unable to load destinations. Check connection or retry.');
    } finally {
      setLoadingDestinations(false);
    }
  };

  const loadItinerary = async () => {
    try {
      const res = await fetch('/api/itinerary');
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setItineraryItems(json.data);
        }
      }
    } catch (err) {
      console.error('Error loading itinerary:', err);
    }
  };

  useEffect(() => {
    loadDestinations();
    loadItinerary();
  }, [selectedCity, selectedCategory, sortBy]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadDestinations();
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleTabChange = (tab: 'explore' | 'itinerary' | 'estimator' | 'ai-planner') => {
    if (tab === 'estimator') {
      setIsEstimatorOpen(true);
    } else if (tab === 'ai-planner') {
      setIsAIPlannerOpen(true);
    } else {
      setActiveTab(tab);
    }
  };

  const savedPlaceIds = useMemo(() => {
    return new Set(itineraryItems.map((item) => item.placeId));
  }, [itineraryItems]);

  const handleAddToItinerary = async (destination: Destination, dayNumber: number = 1, notes: string = '') => {
    try {
      const res = await fetch('/api/itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          placeId: destination.id,
          name: destination.name,
          city: destination.city,
          country: destination.country,
          category: destination.category,
          description: destination.description,
          imageUrl: destination.imageUrl,
          latitude: destination.latitude,
          longitude: destination.longitude,
          dayNumber,
          notes,
          estimatedCost: destination.priceLevel === '$$$$' ? 100 : destination.priceLevel === '$$$' ? 50 : 20,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setItineraryItems((prev) => [...prev, json.data]);
        addToast(`Added "${destination.name}" to Day ${dayNumber}`, 'success');
      } else {
        throw new Error(json.error || 'Failed to add');
      }
    } catch (err: any) {
      addToast(err.message || 'Error saving to itinerary', 'error');
    }
  };

  const handleRemoveItineraryItem = async (id: string) => {
    try {
      const res = await fetch(`/api/itinerary/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setItineraryItems((prev) => prev.filter((item) => item.id !== id));
        addToast('Removed from itinerary', 'info');
      }
    } catch (err) {
      addToast('Error removing item', 'error');
    }
  };

  const handleToggleVisited = async (id: string, isVisited: boolean) => {
    try {
      const res = await fetch(`/api/itinerary/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVisited }),
      });
      if (res.ok) {
        setItineraryItems((prev) =>
          prev.map((item) => (item.id === id ? { ...item, isVisited } : item))
        );
      }
    } catch (err) {
      console.error('Error toggling visited status:', err);
    }
  };

  const handleClearItinerary = async () => {
    try {
      const res = await fetch('/api/itinerary', { method: 'DELETE' });
      if (res.ok) {
        setItineraryItems([]);
        addToast('Itinerary cleared', 'info');
      }
    } catch (err) {
      addToast('Error clearing itinerary', 'error');
    }
  };

  const handleImportAIPlan = async (plan: AITripPlan) => {
    for (const dayPlan of plan.dailyPlans) {
      for (const spot of dayPlan.spots) {
        await handleAddToItinerary(
          {
            id: `ai-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            name: spot.name,
            city: plan.city,
            country: 'Selected Destination',
            category: (spot.category as Category) || 'Landmarks',
            description: spot.description,
            imageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
            rating: 4.8,
            reviewCount: 95,
            latitude: 13.0827,
            longitude: 80.2707,
            priceLevel: '$$',
            tags: ['AI Curated', spot.timeOfDay],
          },
          dayPlan.day,
          `${spot.timeOfDay} - ${spot.tips}`
        );
      }
    }
    addToast(`Imported ${plan.city} AI itinerary`, 'success');
  };

  const cities = getFeaturedCities();

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        itineraryCount={itineraryItems.length}
      />

      <main className="flex-1">
        {activeTab === 'explore' ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
            
            {/* Hero Section */}
            <section>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Left Column */}
                <div className="lg:col-span-5 space-y-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold">
                    <span>Recruitment Task</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-400"></span>
                    <span>Track 3: Full-Stack</span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-zinc-900 dark:text-white leading-[1.15]">
                    Explore places. Build your itinerary.
                  </h1>

                  <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    A comprehensive travel planning application with real-time weather forecasts, interactive 3D geospatial navigation, AI itinerary generation, and Supabase data persistence.
                  </p>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <button
                      onClick={() => setIsAIPlannerOpen(true)}
                      className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-left hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors group shadow-sm"
                    >
                      <div className="flex items-center justify-between text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white">
                        <Sparkles className="w-4 h-4 text-sky-500" />
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                      <div className="font-semibold text-xs text-zinc-900 dark:text-white mt-2">
                        AI Concierge
                      </div>
                      <div className="text-[11px] text-zinc-500 mt-0.5">
                        OpenRouter multi-day generator
                      </div>
                    </button>

                    <button
                      onClick={() => setIsEstimatorOpen(true)}
                      className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-left hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors group shadow-sm"
                    >
                      <div className="flex items-center justify-between text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white">
                        <Calculator className="w-4 h-4 text-sky-500" />
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                      <div className="font-semibold text-xs text-zinc-900 dark:text-white mt-2">
                        Budget Estimator
                      </div>
                      <div className="text-[11px] text-zinc-500 mt-0.5">
                        Multi-currency expense calculator
                      </div>
                    </button>
                  </div>
                </div>

                {/* Right: 3D Globe */}
                <div className="lg:col-span-7">
                  <Globe3D
                    selectedCity={selectedCity}
                    onSelectCity={(city) => {
                      setSelectedCity(city);
                      addToast(`Selected city: ${city}`, 'info');
                    }}
                  />
                </div>

              </div>
            </section>

            {/* Filter & Search Toolbar */}
            <section className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800/90 shadow-sm space-y-3.5">
              
              {/* City Selection Bar */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mr-2 flex-shrink-0 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-zinc-400" />
                  City:
                </span>
                {cities.map((city) => (
                  <button
                    key={city}
                    onClick={() => setSelectedCity(city)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex-shrink-0 ${
                      selectedCity.toLowerCase() === city.toLowerCase()
                        ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-semibold'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>

              {/* Search + Sort */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 pt-1">
                <div className="md:col-span-8 relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search destinations by title, keyword, or features..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-white text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-zinc-400 hover:text-zinc-600"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="md:col-span-4 flex gap-2">
                  <div className="relative flex-1">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none appearance-none"
                    >
                      <option value="rating-desc">Sort: Highest Rated</option>
                      <option value="name-asc">Sort: Name (A to Z)</option>
                      <option value="name-desc">Sort: Name (Z to A)</option>
                    </select>
                    <ArrowUpDown className="w-3.5 h-3.5 absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                  </div>

                  <button
                    onClick={() => setIsPackingOpen(true)}
                    className="px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors flex items-center gap-1.5 text-xs font-medium"
                    title="Packing Checklist"
                  >
                    <Luggage className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Packing</span>
                  </button>
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pt-1 scrollbar-none">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mr-2 flex-shrink-0">
                  Category:
                </span>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-xs transition-all flex-shrink-0 ${
                      selectedCategory === cat
                        ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-semibold'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 hover:text-zinc-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

            </section>

            {/* Destination Grid & States */}
            <section className="space-y-5">
              
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight">
                    Destinations
                  </h2>
                  <p className="text-xs text-zinc-500">
                    Showing {destinations.length} destination{destinations.length !== 1 ? 's' : ''} in {selectedCity === 'All' ? 'global index' : selectedCity}
                  </p>
                </div>

                <button
                  onClick={loadDestinations}
                  className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                >
                  <RefreshCw className={`w-3 h-3 ${loadingDestinations ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>

              {loadingDestinations && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              )}

              {!loadingDestinations && errorDestinations && (
                <div className="p-8 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center max-w-sm mx-auto">
                  <AlertCircle className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
                  <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                    Connection Error
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1">
                    {errorDestinations}
                  </p>
                  <button
                    onClick={loadDestinations}
                    className="mt-3 px-3 py-1.5 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs font-semibold"
                  >
                    Retry
                  </button>
                </div>
              )}

              {!loadingDestinations && !errorDestinations && destinations.length === 0 && (
                <EmptyState
                  title="No destinations match query"
                  description="Try resetting search keywords or category filters."
                  onReset={() => {
                    setSelectedCity('All');
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                />
              )}

              {!loadingDestinations && !errorDestinations && destinations.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {destinations.map((dest) => (
                    <DestinationCard
                      key={dest.id}
                      destination={dest}
                      isSaved={savedPlaceIds.has(dest.id)}
                      onOpenDetails={(d) => setSelectedDestination(d)}
                      onQuickAdd={(d) => handleAddToItinerary(d, 1)}
                    />
                  ))}
                </div>
              )}

            </section>

          </div>
        ) : (
          <ItineraryView
            items={itineraryItems}
            onRemoveItem={handleRemoveItineraryItem}
            onToggleVisited={handleToggleVisited}
            onClearAll={handleClearItinerary}
            onGoToExplore={() => setActiveTab('explore')}
            onOpenAIPlanner={() => setIsAIPlannerOpen(true)}
          />
        )}
      </main>

      <footer className="mt-16 border-t border-zinc-200 dark:border-zinc-800/80 bg-white/50 dark:bg-zinc-950/50 py-6 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">TripWise — Smart Travel Planner</span>
            <span>•</span>
            <span>Track 3: Full-Stack Development</span>
          </div>
          <div>
            Next.js 15, Three.js, Open-Meteo, OpenRouter, and Supabase.
          </div>
        </div>
      </footer>

      <DestinationDetailsModal
        destination={selectedDestination}
        onClose={() => setSelectedDestination(null)}
        onAddToItinerary={async (dest, day, notes) => {
          await handleAddToItinerary(dest, day, notes);
        }}
        isAlreadySaved={selectedDestination ? savedPlaceIds.has(selectedDestination.id) : false}
      />

      <TripEstimatorModal
        isOpen={isEstimatorOpen}
        onClose={() => setIsEstimatorOpen(false)}
      />

      <AITripPlannerModal
        isOpen={isAIPlannerOpen}
        onClose={() => setIsAIPlannerOpen(false)}
        onImportPlanToItinerary={handleImportAIPlan}
        initialCity={selectedCity}
      />

      <PackingChecklistModal
        isOpen={isPackingOpen}
        onClose={() => setIsPackingOpen(false)}
        cityName={selectedCity === 'All' ? 'Your Destination' : selectedCity}
      />

      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
