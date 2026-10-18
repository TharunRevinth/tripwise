'use client';

import React from 'react';
import { Star, MapPin, Plus, Check, Eye } from 'lucide-react';
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
    <div className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-sm hover:shadow-xl hover:border-sky-500/40 dark:hover:border-sky-500/30 transition-all duration-300">
      
      {/* Image Thumbnail Container */}
      <div 
        onClick={() => onOpenDetails(destination)}
        className="relative h-52 w-full overflow-hidden cursor-pointer bg-slate-100 dark:bg-slate-800"
      >
        <img
          src={destination.imageUrl}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-100 shadow-md">
            {destination.category}
          </span>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-md bg-amber-500/90 text-white shadow-md">
          <Star className="w-3.5 h-3.5 fill-white" />
          <span>{destination.rating.toFixed(1)}</span>
        </div>

        {/* City & Country on image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-200 drop-shadow-md">
            <MapPin className="w-3.5 h-3.5 text-sky-400" />
            <span>{destination.city}, {destination.country}</span>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white/20 backdrop-blur-sm">
            {destination.priceLevel}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 
            onClick={() => onOpenDetails(destination)}
            className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-sky-600 dark:group-hover:text-sky-400 cursor-pointer transition-colors"
          >
            {destination.name}
          </h3>

          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
            {destination.description}
          </p>

          {/* Tags */}
          <div className="mt-3.5 flex flex-wrap gap-1.5">
            {destination.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
          <button
            onClick={() => onOpenDetails(destination)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Eye className="w-4 h-4 text-slate-500" />
            <span>Details & Weather</span>
          </button>

          <button
            onClick={() => onQuickAdd(destination)}
            disabled={isSaved}
            className={`flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
              isSaved
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 cursor-default'
                : 'bg-sky-500 hover:bg-sky-600 active:scale-95 text-white shadow-sm shadow-sky-500/30'
            }`}
            title={isSaved ? 'Already added to your itinerary' : 'Add to itinerary'}
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4" />
                <span className="hidden sm:inline">Saved</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Add to Trip</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
