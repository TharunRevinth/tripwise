'use client';

import React, { useState } from 'react';
import { X, CheckSquare, Square, Luggage, Plus, RotateCcw } from 'lucide-react';

interface PackingChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  cityName?: string;
}

const DEFAULT_ITEMS = [
  { id: '1', text: 'Passport / Government ID & Visa copies', category: 'Documents', checked: true },
  { id: '2', text: 'Flight / Train tickets & Hotel confirmations', category: 'Documents', checked: false },
  { id: '3', text: 'Universal travel adapter & fast multi-port charger', category: 'Electronics', checked: false },
  { id: '4', text: 'High-capacity power bank (10,000+ mAh)', category: 'Electronics', checked: false },
  { id: '5', text: 'Light breathable walking shoes & moisture-wick socks', category: 'Clothing', checked: false },
  { id: '6', text: 'Weather shell / compact windbreaker jacket', category: 'Clothing', checked: false },
  { id: '7', text: 'First-aid kit (pain relief, band-aids, motion sickness meds)', category: 'Health', checked: false },
  { id: '8', text: 'Refillable insulated water bottle', category: 'Essentials', checked: false },
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-sky-500/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-600 dark:text-sky-400">
              <Luggage className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Smart Packing Checklist
              </h3>
              <p className="text-xs text-slate-500">
                Tailored essentials for {cityName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Progress */}
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
              <span>Packing Progress</span>
              <span>{completedCount}/{items.length} Packed ({progressPercent}%)</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* List */}
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  item.checked
                    ? 'border-emerald-200 dark:border-emerald-950 bg-emerald-50/30 dark:bg-emerald-950/20 opacity-70'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.checked ? (
                    <CheckSquare className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  )}
                  <span className={`text-xs sm:text-sm font-medium ${item.checked ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                    {item.text}
                  </span>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                  {item.category}
                </span>
              </div>
            ))}
          </div>

          {/* Add custom item */}
          <form onSubmit={addItem} className="flex gap-2">
            <input
              type="text"
              placeholder="Add another item..."
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </form>

          {/* Bottom */}
          <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={resetItems}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Defaults</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
