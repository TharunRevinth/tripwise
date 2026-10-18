'use client';

import React, { useEffect, useState } from 'react';
import { 
  X, MapPin, Star, Calendar, Clock, DollarSign, 
  ExternalLink, CloudSun, Wind, Droplets, Plus, Check, Loader2,
  Thermometer
} from 'lucide-react';
import { Destination, WeatherData } from '@/types';

interface DestinationDetailsModalProps {
  destination: Destination | null;
  onClose: () => void;
  onAddToItinerary: (destination: Destination, dayNumber: number, notes: string) => Promise<void>;
  isAlreadySaved?: boolean;
}

export default function DestinationDetailsModal({
  destination,
  onClose,
  onAddToItinerary,
  isAlreadySaved = false,
}: DestinationDetailsModalProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [dayNumber, setDayNumber] = useState(1);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (!destination) return;

    setJustAdded(false);
    setNotes('');
    setLoadingWeather(true);

    fetch(`/api/weather?lat=${destination.latitude}&lon=${destination.longitude}&city=${encodeURIComponent(destination.city)}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setWeather(res.data);
        }
      })
      .catch((err) => console.warn('Weather fetch error:', err))
      .finally(() => setLoadingWeather(false));
  }, [destination]);

  if (!destination) return null;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onAddToItinerary(destination, dayNumber, notes);
      setJustAdded(true);
    } catch (err) {
      console.error('Failed to add to itinerary:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${destination.latitude},${destination.longitude}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/70 backdrop-blur-md">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-zinc-900/60 hover:bg-zinc-900/90 text-white backdrop-blur-md transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Image */}
        <div className="relative aspect-[16/9] w-full bg-zinc-800">
          <img
            src={destination.imageUrl}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />
          
          <div className="absolute bottom-5 left-5 right-5 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider bg-white/20 backdrop-blur-sm text-white">
                {destination.category}
              </span>
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-white/20 backdrop-blur-sm text-white">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>{destination.rating.toFixed(1)} ({destination.reviewCount.toLocaleString()} reviews)</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-white/20 backdrop-blur-sm">
                {destination.priceLevel}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              {destination.name}
            </h2>

            <div className="flex items-center gap-1.5 mt-1 text-xs text-zinc-300">
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              <span>{destination.city}, {destination.country}</span>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Description */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
              Overview
            </h4>
            <p className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed">
              {destination.description}
            </p>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                <span>Recommended Period</span>
              </div>
              <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                {destination.bestTimeToVisit || 'All year round'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center justify-between text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                <span className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Map Location</span>
                </span>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sky-500 hover:underline"
                >
                  <span>Open Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-xs font-mono text-zinc-700 dark:text-zinc-300">
                {destination.latitude.toFixed(4)} N, {destination.longitude.toFixed(4)} E
              </p>
            </div>
          </div>

          {/* Live Weather Forecast Box (Open-Meteo Real API) */}
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide">
                <CloudSun className="w-4 h-4 text-sky-500" />
                <span>Live Destination Weather (Open-Meteo)</span>
              </div>
              {loadingWeather && <Loader2 className="w-3.5 h-3.5 text-sky-500 animate-spin" />}
            </div>

            {weather ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-zinc-900 dark:text-white">
                      {weather.temperature} C
                    </span>
                    <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300 px-2 py-0.5 rounded bg-zinc-200/60 dark:bg-zinc-700/60">
                      {weather.condition}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Droplets className="w-3 h-3 text-sky-400" />
                      {weather.humidity}%
                    </span>
                    <span className="flex items-center gap-1">
                      <Wind className="w-3 h-3 text-sky-400" />
                      {weather.windSpeed} km/h
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-700/60">
                  {weather.forecast.slice(0, 3).map((f, i) => (
                    <div key={i} className="text-center p-2 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700">
                      <span className="text-[10px] font-medium text-zinc-500 block">
                        {f.date}
                      </span>
                      <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 block mt-0.5">
                        {f.maxTemp} / {f.minTemp} C
                      </span>
                      <span className="text-[10px] text-zinc-600 dark:text-zinc-400 block truncate">
                        {f.condition}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-zinc-500 italic">
                {loadingWeather ? 'Fetching weather data...' : 'Weather data unavailable.'}
              </p>
            )}
          </div>

          {/* Add to Itinerary Form */}
          <form onSubmit={handleAdd} className="pt-2 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>Itinerary Scheduling</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                  Assign Day
                </label>
                <select
                  value={dayNumber}
                  onChange={(e) => setDayNumber(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  <option value={1}>Day 1</option>
                  <option value={2}>Day 2</option>
                  <option value={3}>Day 3</option>
                  <option value={4}>Day 4</option>
                  <option value={5}>Day 5</option>
                  <option value={6}>Day 6</option>
                  <option value={7}>Day 7</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                  Travel Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Visit at morning opening, camera gear required..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  justAdded || isAlreadySaved
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-sm active:scale-95'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : justAdded || isAlreadySaved ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{justAdded ? 'Saved to Itinerary' : 'Update Itinerary'}</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Save to Itinerary</span>
                  </>
                )}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
