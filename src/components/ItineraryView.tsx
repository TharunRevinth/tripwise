'use client';

import React, { useState } from 'react';
import { 
  Calendar, Trash2, CheckCircle2, Circle, MapPin, 
  Download, Printer, Plus, Sparkles 
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

  const handleExportICS = () => {
    if (items.length === 0) return;

    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//TripWise//Smart Travel Planner//EN',
      'CALSCALE:GREGORIAN',
    ];

    items.forEach((item) => {
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
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-500 dark:text-zinc-400 mb-5">
          <Calendar className="w-7 h-7" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          No destinations planned yet
        </h2>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
          Explore destinations or generate a complete multi-day schedule with the AI Travel Concierge.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onGoToExplore}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 font-semibold text-xs shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Explore Destinations</span>
          </button>
          <button
            onClick={onOpenAIPlanner}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700 font-semibold text-xs transition-all"
          >
            <Sparkles className="w-4 h-4 text-sky-500" />
            <span>Generate Plan via AI</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      
      {/* Top Banner / Stats Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800/90 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
              Trip Itinerary
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
              Supabase Synced
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-500">
            {items.length} destination{items.length > 1 ? 's' : ''} across {availableDays.length} day{availableDays.length > 1 ? 's' : ''}
          </p>

          <div className="mt-3 flex items-center gap-3 max-w-xs">
            <div className="flex-1 h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-300" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">
              {totalVisited}/{items.length} Visited ({progressPercent}%)
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportICS}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 text-xs font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Calendar (.ics)</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 text-xs font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          <button
            onClick={() => {
              if (confirm('Clear entire itinerary?')) {
                onClearAll();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-rose-600 dark:text-rose-400 text-xs font-semibold hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Day Filter Chips */}
      {availableDays.length > 1 && (
        <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mr-1">
            Filter:
          </span>
          <button
            onClick={() => setSelectedDayFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedDayFilter === 'all'
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700'
            }`}
          >
            All Days ({items.length})
          </button>
          {availableDays.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDayFilter(day)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedDayFilter === day
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                  : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700'
              }`}
            >
              Day {day} ({groupedByDay[day].length})
            </button>
          ))}
        </div>
      )}

      {/* Itinerary Timeline */}
      <div className="mt-6 space-y-8">
        {displayedDays.map((day) => {
          const dayItems = groupedByDay[day] || [];

          return (
            <div key={day} className="space-y-3">
              
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
                  Day {day}
                </span>
                <div className="h-[1px] flex-1 bg-zinc-200 dark:bg-zinc-800" />
                <span className="text-xs text-zinc-400 font-medium">
                  {dayItems.length} place{dayItems.length > 1 ? 's' : ''}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {dayItems.map((item) => (
                  <div
                    key={item.id}
                    className={`relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-white dark:bg-zinc-900 border transition-all duration-200 ${
                      item.isVisited
                        ? 'border-zinc-200 dark:border-zinc-800 opacity-60'
                        : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start gap-3.5 flex-1">
                      <button
                        onClick={() => onToggleVisited(item.id, !item.isVisited)}
                        className="mt-1 flex-shrink-0 text-zinc-400 hover:text-emerald-500 transition-colors"
                      >
                        {item.isVisited ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </button>

                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-14 h-14 rounded-lg object-cover flex-shrink-0 border border-zinc-200 dark:border-zinc-800"
                        />
                      )}

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className={`text-sm sm:text-base font-bold ${item.isVisited ? 'line-through text-zinc-400' : 'text-zinc-900 dark:text-zinc-100'}`}>
                            {item.name}
                          </h3>
                          <span className="px-2 py-0.2 rounded text-[10px] font-semibold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                            {item.category}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                          <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                          <span>{item.city}, {item.country}</span>
                        </div>

                        {item.notes && (
                          <p className="text-xs text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/60 px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-700 mt-1 inline-block">
                            {item.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 sm:mt-0 flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        title="Remove"
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
