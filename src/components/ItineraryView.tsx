'use client';

import React, { useState } from 'react';
import { 
  Calendar, Trash2, CheckCircle2, Circle, MapPin, 
  Download, Printer, Plus, Sparkles, AlertCircle, ArrowUpDown 
} from 'lucide-react';
import { ItineraryItem } from '@/types';

interface ItineraryViewProps {
  items: ItineraryItem[];
  onRemoveItem: (id: string) => Promise<void>;
  onToggleVisited: (id: string, isVisited: boolean) => Promise<void>;
  onClearAll: () => Promise<void>;
  onGoToExplore: () => void;
  onOpenAIPlanner: () => void;
}

export default function ItineraryView({
  items,
  onRemoveItem,
  onToggleVisited,
  onClearAll,
  onGoToExplore,
  onOpenAIPlanner,
}: ItineraryViewProps) {
  const [selectedDayFilter, setSelectedDayFilter] = useState<number | 'all'>('all');

  // Group items by Day
  const groupedByDay: { [day: number]: ItineraryItem[] } = {};
  items.forEach((item) => {
    const day = item.dayNumber || 1;
    if (!groupedByDay[day]) groupedByDay[day] = [];
    groupedByDay[day].push(item);
  });

  const availableDays = Object.keys(groupedByDay)
    .map(Number)
    .sort((a, b) => a - b);

  const displayedDays = selectedDayFilter === 'all' 
    ? availableDays 
    : availableDays.filter((d) => d === selectedDayFilter);

  const totalVisited = items.filter((i) => i.isVisited).length;
  const progressPercent = items.length > 0 ? Math.round((totalVisited / items.length) * 100) : 0;

  // Export to Calendar (.ics)
  const handleExportICS = () => {
    if (items.length === 0) return;

    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//TripWise//Smart Travel Planner//EN',
      'CALSCALE:GREGORIAN',
    ];

    items.forEach((item, idx) => {
      const dt = new Date();
      dt.setDate(dt.getDate() + (item.dayNumber - 1));
      const dateStr = dt.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

      icsContent.push(
        'BEGIN:VEVENT',
        `UID:tripwise-${item.id}@tripwise.app`,
        `DTSTAMP:${dateStr}`,
        `DTSTART:${dateStr}`,
        `SUMMARY:${item.name} (${item.city})`,
        `DESCRIPTION:${item.notes || item.description || 'TripWise Itinerary Visit'}`,
        `LOCATION:${item.city}, ${item.country}`,
        'END:VEVENT'
      );
    });

    icsContent.push('END:VCALENDAR');

    const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `TripWise_Itinerary.ics`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-sky-100 dark:bg-sky-950/60 border border-sky-300 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400 mb-6 shadow-xl">
          <Calendar className="w-10 h-10" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Your Itinerary is Currently Empty
        </h2>
        <p className="mt-3 text-base text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          Start exploring world-class destinations or use our OpenRouter AI Generator to create a customized multi-day travel plan in seconds.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onGoToExplore}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm shadow-lg shadow-sky-500/25 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Explore Places</span>
          </button>
          <button
            onClick={onOpenAIPlanner}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Plan with AI</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-10 px-4 sm:px-6">
      
      {/* Top Banner / Stats Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              My Trip Itinerary
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800">
              Supabase / DB Synced
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {items.length} destination{items.length > 1 ? 's' : ''} organized across {availableDays.length} day{availableDays.length > 1 ? 's' : ''}.
          </p>

          {/* Progress Bar */}
          <div className="mt-4 flex items-center gap-3 max-w-sm">
            <div className="flex-1 h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700">
              <div 
                className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 transition-all duration-500" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {totalVisited}/{items.length} Visited ({progressPercent}%)
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportICS}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
            title="Download .ics file for Apple/Google Calendar"
          >
            <Download className="w-4 h-4 text-sky-500" />
            <span>Export to Calendar (.ics)</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print View</span>
          </button>

          <button
            onClick={() => {
              if (confirm('Are you sure you want to clear your entire itinerary?')) {
                onClearAll();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-100 dark:hover:bg-rose-950/40 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Trip</span>
          </button>
        </div>
      </div>

      {/* Day Filter Chips */}
      {availableDays.length > 1 && (
        <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1">
            Filter Day:
          </span>
          <button
            onClick={() => setSelectedDayFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedDayFilter === 'all'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            All Days ({items.length})
          </button>
          {availableDays.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDayFilter(day)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedDayFilter === day
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              Day {day} ({groupedByDay[day].length})
            </button>
          ))}
        </div>
      )}

      {/* Itinerary Timeline by Day */}
      <div className="mt-8 space-y-10">
        {displayedDays.map((day) => {
          const dayItems = groupedByDay[day] || [];

          return (
            <div key={day} className="space-y-4">
              
              {/* Day Header Badge */}
              <div className="flex items-center gap-3">
                <div className="px-4 py-1.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-black text-sm tracking-wide shadow-md">
                  Day {day}
                </div>
                <div className="h-[1px] flex-1 bg-slate-200 dark:bg-slate-800" />
                <span className="text-xs font-semibold text-slate-500">
                  {dayItems.length} place{dayItems.length > 1 ? 's' : ''} planned
                </span>
              </div>

              {/* Items in this Day */}
              <div className="grid grid-cols-1 gap-4">
                {dayItems.map((item, index) => (
                  <div
                    key={item.id}
                    className={`relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border transition-all duration-200 ${
                      item.isVisited
                        ? 'border-emerald-300 dark:border-emerald-900/60 bg-emerald-50/20 dark:bg-emerald-950/10 opacity-75'
                        : 'border-slate-200/80 dark:border-slate-800 hover:border-sky-500/40 shadow-sm'
                    }`}
                  >
                    {/* Item Details */}
                    <div className="flex items-start gap-4 flex-1">
                      {/* Checkbox toggle */}
                      <button
                        onClick={() => onToggleVisited(item.id, !item.isVisited)}
                        className="mt-1 flex-shrink-0 text-slate-400 hover:text-emerald-500 transition-colors"
                        title={item.isVisited ? 'Mark as planned' : 'Mark as visited'}
                      >
                        {item.isVisited ? (
                          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                        ) : (
                          <Circle className="w-6 h-6" />
                        )}
                      </button>

                      {/* Destination Thumbnail */}
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover flex-shrink-0 border border-slate-200 dark:border-slate-800"
                        />
                      )}

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className={`text-base sm:text-lg font-bold ${item.isVisited ? 'line-through text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                            {item.name}
                          </h3>
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {item.category}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                          <MapPin className="w-3.5 h-3.5 text-sky-500" />
                          <span>{item.city}, {item.country}</span>
                        </div>

                        {item.notes && (
                          <p className="text-xs italic text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/40 px-2.5 py-1 rounded-lg border border-sky-200/60 dark:border-sky-900/60 mt-1 inline-block">
                            "{item.notes}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 sm:mt-0 flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                        title="Remove from itinerary"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
