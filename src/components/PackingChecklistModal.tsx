'use client';

import React, { useState } from 'react';
import { X, CheckSquare, Square, Luggage, Plus, RotateCcw } from 'lucide-react';

interface PackingChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  cityName?: string;
}

const DEFAULT_ITEMS = [
  { id: '1', text: 'Passport and Government Identification', category: 'Documents', checked: true },
  { id: '2', text: 'Boarding passes and accommodation vouchers', category: 'Documents', checked: false },
  { id: '3', text: 'Universal travel power adapter', category: 'Electronics', checked: false },
  { id: '4', text: 'External power bank (10,000 mAh)', category: 'Electronics', checked: false },
  { id: '5', text: 'Walking shoes and comfortable footwear', category: 'Clothing', checked: false },
  { id: '6', text: 'Compact weather protection shell', category: 'Clothing', checked: false },
  { id: '7', text: 'Medical kit and prescription medication', category: 'Health', checked: false },
  { id: '8', text: 'Reusable insulated bottle', category: 'Essentials', checked: false },
];

export default function PackingChecklistModal({ isOpen, onClose, cityName = 'Your Destination' }: PackingChecklistModalProps) {
  const [items, setItems] = useState(DEFAULT_ITEMS);
  const [newItemText, setNewItemText] = useState('');

  if (!isOpen) return null;

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;

    setItems((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: newItemText.trim(),
        category: 'Custom',
        checked: false,
      },
    ]);
    setNewItemText('');
  };

  const resetItems = () => setItems(DEFAULT_ITEMS);

  const completedCount = items.filter((i) => i.checked).length;
  const progressPercent = Math.round((completedCount / items.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/70 backdrop-blur-md">
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
              Packing Checklist
            </h3>
            <p className="text-xs text-zinc-500">
              Essential items for travel to {cityName}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <div className="flex justify-between text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
              <span>Status</span>
              <span>{completedCount}/{items.length} items ({progressPercent}%)</span>
            </div>
            <div className="h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all ${
                  item.checked
                    ? 'border-zinc-200 dark:border-zinc-800 opacity-60'
                    : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.checked ? (
                    <CheckSquare className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                  )}
                  <span className={`text-xs font-medium ${item.checked ? 'line-through text-zinc-400' : 'text-zinc-800 dark:text-zinc-200'}`}>
                    {item.text}
                  </span>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                  {item.category}
                </span>
              </div>
            ))}
          </div>

          <form onSubmit={addItem} className="flex gap-2">
            <input
              type="text"
              placeholder="Add checklist item..."
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 text-xs font-semibold"
            >
              Add
            </button>
          </form>

          <div className="flex justify-between items-center pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <button
              onClick={resetItems}
              className="text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            >
              Reset List
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
