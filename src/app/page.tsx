'use client';

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { 
  Search, SlidersHorizontal, Sparkles, Calculator, 
  Luggage, ArrowUpDown, RefreshCw, Compass, MapPin, 
  CheckCircle2, Plus, AlertCircle 
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

// Dynamically import 3D globe to ensure client-only Three.js rendering
const Globe3D = dynamic(() => import('@/components/Globe3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[340px] sm:h-[420px] lg:h-[460px] rounded-3xl bg-slate-900 animate-pulse flex items-center justify-center text-sky-400 text-sm font-semibold">
      Loading 3D Globe...
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
  // Navigation & View state
  const [activeTab, setActiveTab] = useState<'explore' | 'itinerary' | 'estimator' | 'ai-planner'>('explore');

  // Filter & Search states
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [sortBy, setSortBy] = useState<'rating-desc' | 'name-asc' | 'name-desc'>('rating-desc');

  // Data states
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [itineraryItems, setItineraryItems] = useState<ItineraryItem[]>([]);
  const [loadingDestinations, setLoadingDestinations] = useState<boolean>(true);
  const [errorDestinations, setErrorDestinations] = useState<string | null>(null);

  // Modals
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [isEstimatorOpen, setIsEstimatorOpen] = useState(false);
  const [isAIPlannerOpen, setIsAIPlannerOpen] = useState(false);
  const [isPackingOpen, setIsPackingOpen] = useState(false);

  // Toast notifications
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

  // Fetch Destinations from REST API
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
      setErrorDestinations('Unable to load destinations. Check your connection or retry.');
    } finally {
      setLoadingDestinations(false);
    }
  };

  // Fetch Itinerary from REST API
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

  // Initial load
  useEffect(() => {
    loadDestinations();
    loadItinerary();
  }, [selectedCity, selectedCategory, sortBy]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      loadDestinations();
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle Tab Switch from Nav
  const handleTabChange = (tab: 'explore' | 'itinerary' | 'estimator' | 'ai-planner') => {
    if (tab === 'estimator') {
      setIsEstimatorOpen(true);
    } else if (tab === 'ai-planner') {
      setIsAIPlannerOpen(true);
    } else {
      setActiveTab(tab);
    }
  };

  // Check if destination is in itinerary
  const savedPlaceIds = useMemo(() => {
    return new Set(itineraryItems.map((item) => item.placeId));
  }, [itineraryItems]);

  // Add to Itinerary
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
        addToast(`Added "${destination.name}" to Day ${dayNumber}!`, 'success');
      } else {
        throw new Error(json.error || 'Failed to add');
      }
    } catch (err: any) {
      addToast(err.message || 'Error saving to itinerary', 'error');
    }
  };

  // Remove Itinerary Item
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

  // Toggle Visited
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

  // Clear Itinerary
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

  // Import AI Plan
  const handleImportAIPlan = async (plan: AITripPlan) => {
    for (const dayPlan of plan.dailyPlans) {
      for (const spot of dayPlan.spots) {
        await handleAddToItinerary(
          {
            id: `ai-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            name: spot.name,
            city: plan.city,
            country: 'Featured Destination',
            category: (spot.category as Category) || 'Landmarks',
            description: spot.description,
            imageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
            rating: 4.8,
            reviewCount: 95,
            latitude: 13.0827,
            longitude: 80.2707,
            priceLevel: '$$',
            tags: ['AI Plan', spot.timeOfDay],
          },
          dayPlan.day,
          `${spot.timeOfDay} • ${spot.tips}`
        );
      }
    }
    addToast(`Successfully imported ${plan.city} AI Plan into your Trip!`, 'success');
  };

  const cities = getFeaturedCities();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        itineraryCount={itineraryItems.length}
      />

      {/* Main Container */}
      <main className="flex-1">
        {activeTab === 'explore' ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 sm:space-y-12">
            
            {/* Hero Section with Interactive 3D Earth Globe */}
            <section className="relative">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Left: Hero Headline & Fast Actions */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-100 dark:bg-sky-950/70 border border-sky-300 dark:border-sky-800 text-sky-700 dark:text-sky-300 text-xs font-bold shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                    <span>AWS Student Builder Group Recruitment Project</span>
                  </div>

                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                    Smart Travel Planning, <span className="bg-gradient-to-r from-sky-500 via-indigo-500 to-sky-400 bg-clip-text text-transparent">Reimagined.</span>
                  </h1>

                  <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                    Explore global destinations, discover real-time Open-Meteo weather forecasts, calculate trip budgets, and generate AI itineraries saved directly to Supabase.
                  </p>

                  {/* Feature Quick Launch Cards */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={() => setIsAIPlannerOpen(true)}
                      className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 text-left hover:scale-[1.02] transition-transform duration-200 group"
                    >
                      <Sparkles className="w-5 h-5 text-indigo-500 group-hover:rotate-12 transition-transform" />
                      <div className="font-bold text-sm text-slate-900 dark:text-white mt-2">
                        AI Concierge
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        OpenRouter itinerary generator
                      </div>
                    </button>

                    <button
                      onClick={() => setIsEstimatorOpen(true)}
                      className="p-4 rounded-2xl bg-gradient-to-br from-sky-500/10 to-blue-500/10 border border-sky-500/30 text-left hover:scale-[1.02] transition-transform duration-200 group"
                    >
                      <Calculator className="w-5 h-5 text-sky-500 group-hover:scale-110 transition-transform" />
                      <div className="font-bold text-sm text-slate-900 dark:text-white mt-2">
                        Trip Estimator
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Multi-currency budget calculator
                      </div>
                    </button>
                  </div>
                </div>

                {/* Right: Interactive 3D Earth Globe Canvas */}
                <div className="lg:col-span-7">
                  <Globe3D
                    selectedCity={selectedCity}
                    onSelectCity={(city) => {
                      setSelectedCity(city);
                      addToast(`Filtered places for ${city}`, 'info');
                    }}
                  />
                </div>

              </div>
            </section>

            {/* Sticky Search & Discovery Toolbar */}
            <section className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              
              {/* City Selection Bar */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2 flex-shrink-0 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-sky-500" />
                  City:
                </span>
                {cities.map((city) => (
                  <button
                    key={city}
                    onClick={() => setSelectedCity(city)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
                      selectedCity.toLowerCase() === city.toLowerCase()
                        ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25 scale-105'
                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>

              {/* Search Bar + Sort Dropdown */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2">
                <div className="md:col-span-8 relative">
                  <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search destinations by name, keywords, or tags (e.g. Temple, Beach, Art, Pasta)..."
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
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
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none appearance-none"
                    >
                      <option value="rating-desc">Sort: Highest Rated ⭐</option>
                      <option value="name-asc">Sort: Name (A to Z)</option>
                      <option value="name-desc">Sort: Name (Z to A)</option>
                    </select>
                    <ArrowUpDown className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>

                  <button
                    onClick={() => setIsPackingOpen(true)}
                    className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    title="Open Packing Checklist"
                  >
                    <Luggage className="w-5 h-5 text-sky-500" />
                  </button>
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pt-2 scrollbar-none">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2 flex-shrink-0">
                  Category:
                </span>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex-shrink-0 ${
                      selectedCategory === cat
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

            </section>

            {/* Destination Grid & States */}
            <section className="space-y-6">
              
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    Featured Places
                  </h2>
                  <p className="text-xs text-slate-500">
                    Showing {destinations.length} destination{destinations.length !== 1 ? 's' : ''} in {selectedCity === 'All' ? 'global collection' : selectedCity}
                  </p>
                </div>

                <button
                  onClick={loadDestinations}
                  className="flex items-center gap-1.5 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingDestinations ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>

              {/* Loading Skeleton State */}
              {loadingDestinations && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              )}

              {/* Error State */}
              {!loadingDestinations && errorDestinations && (
                <div className="p-8 rounded-3xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-center max-w-lg mx-auto">
                  <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-rose-700 dark:text-rose-300">
                    Connection Error
                  </h3>
                  <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">
                    {errorDestinations}
                  </p>
                  <button
                    onClick={loadDestinations}
                    className="mt-4 px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors"
                  >
                    Retry Connection
                  </button>
                </div>
              )}

              {/* Empty State */}
              {!loadingDestinations && !errorDestinations && destinations.length === 0 && (
                <EmptyState
                  title="No places match your criteria"
                  description="Try clearing your search query or selecting a different city or category."
                  onReset={() => {
                    setSelectedCity('All');
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                />
              )}

              {/* Real Destination Cards */}
              {!loadingDestinations && !errorDestinations && destinations.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 dark:text-slate-300">TripWise — Smart Travel Planner</span>
            <span>•</span>
            <span>AWS Student Builder Group Recruitment Task</span>
          </div>
          <div>
            Built with Next.js 15, Three.js, Open-Meteo, OpenRouter & Supabase.
          </div>
        </div>
      </footer>

      {/* Modals & Overlays */}
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
        cityName={selectedCity === 'All' ? 'Your Trip' : selectedCity}
      />

      {/* Global Toast Feedbacks */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
