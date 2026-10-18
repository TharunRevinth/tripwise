'use client';

import React, { useEffect, useState } from 'react';
import { 
  X, MapPin, Star, Calendar, Clock, DollarSign, 
  ExternalLink, CloudSun, Wind, Droplets, Plus, Check, Loader2 
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

    // Fetch live weather using our backend API
    fetch(`/api/weather?lat=${destination.latitude}&lon=${destination.longitude}&city=${encodeURIComponent(destination.city)}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setWeather(res.data);
        }
      })
      .catch((err) => console.warn('Weather fetch error in modal:', err))
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/50 hover:bg-black/75 text-white backdrop-blur-md transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Header Image */}
        <div className="relative h-64 sm:h-72 w-full bg-slate-800">
          <img
            src={destination.imageUrl}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
          
          <div className="absolute bottom-5 left-5 right-5 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sky-500 text-white shadow-md">
                {destination.category}
              </span>
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-md">
                <Star className="w-3.5 h-3.5 fill-white" />
                <span>{destination.rating.toFixed(1)} ({destination.reviewCount.toLocaleString()} reviews)</span>
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-black/40 backdrop-blur-sm">
                Cost Level: {destination.priceLevel}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {destination.name}
            </h2>

            <div className="flex items-center gap-1.5 mt-1 text-sm text-slate-300">
              <MapPin className="w-4 h-4 text-sky-400" />
              <span>{destination.city}, {destination.country}</span>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Description */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">
              About This Destination
            </h4>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              {destination.description}
            </p>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                <Clock className="w-4 h-4 text-sky-500" />
                <span>Best Season to Visit</span>
              </div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {destination.bestTimeToVisit || 'All Year Round'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-sky-500" />
                  <span>Exact Coordinates</span>
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
              <p className="text-xs font-mono text-slate-700 dark:text-slate-300 truncate">
                {destination.latitude.toFixed(4)}° N, {destination.longitude.toFixed(4)}° E
              </p>
            </div>
          </div>

          {/* Live Weather Integration Box (Open-Meteo Real External API) */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-sky-500/10 via-indigo-500/5 to-transparent border border-sky-500/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm font-bold text-sky-600 dark:text-sky-400">
                <CloudSun className="w-5 h-5 text-sky-500" />
                <span>Live Destination Weather (Open-Meteo API)</span>
              </div>
              {loadingWeather && <Loader2 className="w-4 h-4 text-sky-500 animate-spin" />}
            </div>

            {weather ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                      {weather.temperature}°C
                    </span>
                    <span className="ml-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300">
                      {weather.condition}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Droplets className="w-3.5 h-3.5 text-sky-400" />
                      Humidity {weather.humidity}%
                    </span>
                    <span className="flex items-center gap-1">
                      <Wind className="w-3.5 h-3.5 text-sky-400" />
                      Wind {weather.windSpeed} km/h
                    </span>
                  </div>
                </div>

                {/* 3-day forecast preview */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-sky-500/10">
                  {weather.forecast.slice(0, 3).map((f, i) => (
                    <div key={i} className="text-center p-2 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50">
                      <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block truncate">
                        {f.date}
                      </span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mt-0.5">
                        {f.maxTemp}° / {f.minTemp}°
                      </span>
                      <span className="text-[10px] text-sky-500 block truncate">
                        {f.condition}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                {loadingWeather ? 'Fetching real-time weather from Open-Meteo...' : 'Weather data currently unavailable.'}
              </p>
            )}
          </div>

          {/* Add to Itinerary Form */}
          <form onSubmit={handleAdd} className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-sky-500" />
              <span>Add to Your Trip Itinerary</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Assign to Day
                </label>
                <select
                  value={dayNumber}
                  onChange={(e) => setDayNumber(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  <option value={1}>Day 1 (Kickoff)</option>
                  <option value={2}>Day 2</option>
                  <option value={3}>Day 3</option>
                  <option value={4}>Day 4</option>
                  <option value={5}>Day 5</option>
                  <option value={6}>Day 6</option>
                  <option value={7}>Day 7</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Custom Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Arrive early at 8:30 AM, book tickets online..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Close
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-md ${
                  justAdded || isAlreadySaved
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-sky-500 hover:bg-sky-600 text-white shadow-sky-500/25 active:scale-95'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving to Database...</span>
                  </>
                ) : justAdded || isAlreadySaved ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{justAdded ? 'Saved to Trip!' : 'Update in Trip'}</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
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
