'use client';

import React from 'react';
import { Star, MapPin, Plus, Check, ArrowRight } from 'lucide-react';
import { Destination } from '@/types';

interface DestinationCardProps {
  destination: Destination;
  isSaved?: boolean;
  onOpenDetails: (destination: Destination) => void;
  onQuickAdd: (destination: Destination) => void;
}

export default function DestinationCard({
  destination,
  isSaved = false,
  onOpenDetails,
  onQuickAdd,
}: DestinationCardProps) {
  return (
    <div className="group relative flex flex-col bg-white dark:bg-zinc-900/90 rounded-2xl border border-zinc-200/90 dark:border-zinc-800/90 overflow-hidden shadow-sm hover:shadow-xl hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300">
      
      {/* Thumbnail Container */}
      <div 
        onClick={() => onOpenDetails(destination)}
        className="relative aspect-[16/10] w-full overflow-hidden cursor-pointer bg-zinc-100 dark:bg-zinc-800"
      >
        <img
          src={destination.imageUrl}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Subtle Vignette Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider backdrop-blur-md bg-zinc-950/70 text-zinc-100 border border-white/10">
            {destination.category}
          </span>
        </div>

        {/* Rating */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold backdrop-blur-md bg-zinc-950/70 text-zinc-100 border border-white/10">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>{destination.rating.toFixed(1)}</span>
        </div>

        {/* Location & Tier Info */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
          <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-200">
            <MapPin className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
            <span className="truncate">{destination.city}, {destination.country}</span>
          </div>
          <span className="text-[11px] font-semibold font-mono px-2 py-0.5 rounded bg-white/15 backdrop-blur-sm">
            {destination.priceLevel}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 
            onClick={() => onOpenDetails(destination)}
            className="text-base font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1 group-hover:text-sky-600 dark:group-hover:text-sky-400 cursor-pointer transition-colors"
          >
            {destination.name}
          </h3>

          <p className="mt-1.5 text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
            {destination.description}
          </p>

          {/* Tags */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {destination.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-medium px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200/60 dark:border-zinc-700/60"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center gap-2">
          <button
            onClick={() => onOpenDetails(destination)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <span>Overview & Weather</span>
            <ArrowRight className="w-3 h-3 text-zinc-400" />
          </button>

          <button
            onClick={() => onQuickAdd(destination)}
            disabled={isSaved}
            className={`flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
              isSaved
                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 cursor-default'
                : 'bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-sm active:scale-95'
            }`}
            title={isSaved ? 'Already added' : 'Add to itinerary'}
          >
            {isSaved ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
