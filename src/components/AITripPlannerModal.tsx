'use client';

import React, { useState } from 'react';
import { 
  X, Sparkles, Wand2, Compass, Check, Loader2, 
  Clock, MapPin, Tag, Luggage, UtensilsCrossed 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AITripPlan, Destination } from '@/types';

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
      console.error('Failed to generate AI plan:', err);
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

      // Trigger celebratory confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.error('Error importing AI plan to itinerary:', err);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 sm:p-8 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-sky-500/5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  OpenRouter AI Travel Concierge
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  AI Powered
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Generate personalized multi-day itineraries and insider travel guidance
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Prompt Form */}
          <form onSubmit={handleGenerate} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Destination City
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chennai, Paris, Tokyo..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Duration (Days)
                </label>
                <select
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value={1}>1 Day (Express Tour)</option>
                  <option value={2}>2 Days (Weekend Getaway)</option>
                  <option value={3}>3 Days (Standard Explorer)</option>
                  <option value={4}>4 Days (Deep Exploration)</option>
                  <option value={5}>5 Days (Complete Vacation)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Travel Theme
                </label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="Culture & Heritage">Culture & Heritage</option>
                  <option value="Food & Culinary Journey">Food & Culinary Journey</option>
                  <option value="Nature & Serene Escapes">Nature & Serene Escapes</option>
                  <option value="Iconic Architecture & Sights">Iconic Architecture & Sights</option>
                  <option value="Backpacker & Budget Discovery">Backpacker & Budget Discovery</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Pace:</span>
                {(['relaxed', 'moderate', 'packed'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPace(p)}
                    className={`px-2.5 py-1 text-xs rounded-lg capitalize font-medium transition-all ${
                      pace === p
                        ? 'bg-indigo-500 text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 active:scale-95 transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Consulting AI Concierge...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>Generate Itinerary</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Generated Result */}
          {plan && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Overview Card */}
              <div className="p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">
                      {plan.city} • {plan.days}-Day {plan.theme} Plan
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                      {plan.overview}
                    </p>
                  </div>

                  <button
                    onClick={handleImport}
                    disabled={importing || imported}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex-shrink-0 ${
                      imported
                        ? 'bg-emerald-600 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95 shadow-indigo-500/25'
                    }`}
                  >
                    {importing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving to Database...</span>
                      </>
                    ) : imported ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Imported into My Trip!</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Import All to My Trip</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Local Food & Packing Preview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-indigo-500/20 text-xs">
                  <div className="flex items-start gap-2">
                    <UtensilsCrossed className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200">Recommended Local Food:</span>
                      <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                        {plan.bestLocalFood?.join(', ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Luggage className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200">Key Packing Recommendations:</span>
                      <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                        {plan.packingTips?.join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Day-by-Day AI Schedule */}
              <div className="space-y-4">
                {plan.dailyPlans.map((dayPlan) => (
                  <div
                    key={dayPlan.day}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3"
                  >
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-xl bg-indigo-500 text-white font-black text-xs">
                        Day {dayPlan.day}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {dayPlan.title}
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 gap-3 pt-1">
                      {dayPlan.spots.map((spot, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
                                {spot.timeOfDay}
                              </span>
                              <span className="font-bold text-sm text-slate-900 dark:text-white">
                                {spot.name}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-300">
                              {spot.description}
                            </p>
                            <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium italic">
                              💡 Tip: {spot.tips}
                            </p>
                          </div>

                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 self-end sm:self-center bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
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
