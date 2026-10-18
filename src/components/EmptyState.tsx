'use client';

import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  onReset?: () => void;
  resetLabel?: string;
}

export default function EmptyState({
  title = 'No destinations found',
  description = 'Try searching with a different keyword or resetting your category filters.',
  onReset,
  resetLabel = 'Reset All Filters',
}: EmptyStateProps) {
  return (
    <div className="py-16 px-4 text-center max-w-md mx-auto">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 mb-4 shadow-sm">
        <SearchX className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">
        {title}
      </h3>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        {description}
      </p>
      {onReset && (
        <button
          onClick={onReset}
          className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold transition-all shadow-md shadow-sky-500/20 active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{resetLabel}</span>
        </button>
      )}
    </div>
  );
}
