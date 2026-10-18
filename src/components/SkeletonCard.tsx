'use client';

import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm animate-pulse">
      <div className="h-52 w-full bg-slate-200 dark:bg-slate-800" />
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-lg w-3/4" />
          <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded-lg w-full" />
          <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded-lg w-5/6" />
          <div className="flex gap-2 pt-2">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-16" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-20" />
          </div>
        </div>
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
          <div className="h-9 bg-slate-200 dark:bg-slate-800 rounded-xl flex-1" />
          <div className="h-9 bg-slate-200 dark:bg-slate-800 rounded-xl w-28" />
        </div>
      </div>
    </div>
  );
}
