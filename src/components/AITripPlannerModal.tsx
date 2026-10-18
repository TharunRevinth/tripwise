'use client';

import React, { useState } from 'react';
import { 
  X, Sparkles, Wand2, Compass, Check, Loader2, 
  Clock, MapPin, Tag, Luggage, UtensilsCrossed 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AITripPlan } from '@/types';

interface AITripPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportPlanToItinerary: (plan: AITripPlan) => Promise<void>;
  initialCity?: string;
}

export default function AITripPlannerModal({
  isOpen,
  onClose,
  onImportPlanToItinerary,
  initialCity = 'Chennai',
}: AITripPlannerModalProps) {
  const [city, setCity] = useState(initialCity === 'All' ? 'Chennai' : initialCity);
  const [days, setDays] = useState(3);
  const [theme, setTheme] = useState('Culture & Heritage');
  const [pace, setPace] = useState<'relaxed' | 'moderate' | 'packed'>('moderate');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<AITripPlan | null>(null);
  const [importing, setImporting] = useState(false);
  const [imported, setImported] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setPlan(null);
    setImported(false);

    try {
      const res = await fetch('/api/ai-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city, days, theme, pace }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setPlan(data.data);
      }
    } catch (err) {
      console.error('Failed to generate plan:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!plan || importing) return;

    setImporting(true);
    try {
      await onImportPlanToItinerary(plan);
      setImported(true);

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.error('Error importing AI plan:', err);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/70 backdrop-blur-md">
      <div 
        className="relative w-full max-w-3xl bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                AI Travel Concierge
              </h2>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                OpenRouter
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              Automated multi-day itinerary generator with custom pace and focus
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Prompt Form */}
          <form onSubmit={handleGenerate} className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Destination City
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chennai, Paris, Tokyo"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Duration
                </label>
                <select
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  <option value={1}>1 Day (Express)</option>
                  <option value={2}>2 Days (Weekend)</option>
                  <option value={3}>3 Days (Standard)</option>
                  <option value={4}>4 Days (In-Depth)</option>
                  <option value={5}>5 Days (Extended)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Theme
                </label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  <option value="Culture & Heritage">Culture & Heritage</option>
                  <option value="Food & Culinary Tour">Food & Culinary Tour</option>
                  <option value="Nature & Outdoors">Nature & Outdoors</option>
                  <option value="Architecture & Landmarks">Architecture & Landmarks</option>
                  <option value="Budget & Backpacker">Budget & Backpacker</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-zinc-500">Pace:</span>
                {(['relaxed', 'moderate', 'packed'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPace(p)}
                    className={`px-2 py-0.5 text-[11px] rounded capitalize transition-all ${
                      pace === p
                        ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-semibold'
                        : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 font-semibold text-xs transition-all active:scale-95"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Generate Schedule</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Generated Result */}
          {plan && (
            <div className="space-y-4">
              
              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                      {plan.city} • {plan.days}-Day {plan.theme} Plan
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                      {plan.overview}
                    </p>
                  </div>

                  <button
                    onClick={handleImport}
                    disabled={importing || imported}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm flex-shrink-0 ${
                      imported
                        ? 'bg-emerald-600 text-white'
                        : 'bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 active:scale-95'
                    }`}
                  >
                    {importing ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : imported ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Imported into Itinerary</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Import to Itinerary</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-700/60 text-xs">
                  <div>
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">Culinary highlights: </span>
                    <span className="text-zinc-500">{plan.bestLocalFood?.join(', ')}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">Packing advice: </span>
                    <span className="text-zinc-500">{plan.packingTips?.join(', ')}</span>
                  </div>
                </div>
              </div>

              {/* Day Schedules */}
              <div className="space-y-3">
                {plan.dailyPlans.map((dayPlan) => (
                  <div
                    key={dayPlan.day}
                    className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2.5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
                        Day {dayPlan.day}
                      </span>
                      <h4 className="text-xs font-bold text-zinc-900 dark:text-white">
                        {dayPlan.title}
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 gap-2 pt-1">
                      {dayPlan.spots.map((spot, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                                {spot.timeOfDay}
                              </span>
                              <span className="font-semibold text-xs text-zinc-900 dark:text-white">
                                {spot.name}
                              </span>
                            </div>
                            <p className="text-xs text-zinc-600 dark:text-zinc-400">
                              {spot.description}
                            </p>
                            <p className="text-[11px] text-zinc-500">
                              Note: {spot.tips}
                            </p>
                          </div>

                          <span className="text-xs font-mono font-medium text-zinc-700 dark:text-zinc-300 self-end sm:self-center">
                            {spot.estimatedCost}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
