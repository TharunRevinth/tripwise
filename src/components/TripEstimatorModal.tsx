'use client';

import React, { useState } from 'react';
import { 
  X, Calculator, Calendar, Users, Hotel, Utensils, Compass 
} from 'lucide-react';

interface TripEstimatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Currency = 'INR' | 'USD' | 'EUR' | 'GBP';

const RATES_TO_INR: Record<Currency, number> = {
  INR: 1,
  USD: 87.5,
  EUR: 94.2,
  GBP: 110.0,
};

const SYMBOLS: Record<Currency, string> = {
  INR: 'INR ',
  USD: '$',
  EUR: 'EUR ',
  GBP: 'GBP ',
};

export default function TripEstimatorModal({ isOpen, onClose }: TripEstimatorModalProps) {
  const [currency, setCurrency] = useState<Currency>('INR');
  const [days, setDays] = useState(4);
  const [travelers, setTravelers] = useState(2);
  const [lodgingTier, setLodgingTier] = useState<'budget' | 'comfort' | 'luxury'>('comfort');
  const [diningTier, setDiningTier] = useState<'street' | 'casual' | 'fine'>('casual');
  const [transportTier, setTransportTier] = useState<'public' | 'cabs' | 'rental'>('cabs');

  if (!isOpen) return null;

  const lodgingCostPerNight = {
    budget: 1500,
    comfort: 4500,
    luxury: 14000,
  }[lodgingTier];

  const diningCostPerPersonPerDay = {
    street: 600,
    casual: 1600,
    fine: 4500,
  }[diningTier];

  const transportCostPerDay = {
    public: 300,
    cabs: 1200,
    rental: 3000,
  }[transportTier];

  const activitiesCostPerPersonPerDay = 800;

  const roomsNeeded = Math.ceil(travelers / 2);
  const totalLodging = lodgingCostPerNight * roomsNeeded * days;
  const totalDining = diningCostPerPersonPerDay * travelers * days;
  const totalTransport = transportCostPerDay * days;
  const totalActivities = activitiesCostPerPersonPerDay * travelers * days;
  const subtotal = totalLodging + totalDining + totalTransport + totalActivities;
  const buffer = Math.round(subtotal * 0.1);
  const totalInINR = subtotal + buffer;

  const rate = RATES_TO_INR[currency];
  const totalFormatted = Math.round(totalInINR / rate).toLocaleString();
  const perPersonFormatted = Math.round(totalInINR / rate / travelers).toLocaleString();
  const perDayFormatted = Math.round(totalInINR / rate / days).toLocaleString();

  const lodgingFormatted = Math.round(totalLodging / rate).toLocaleString();
  const diningFormatted = Math.round(totalDining / rate).toLocaleString();
  const transportFormatted = Math.round(totalTransport / rate).toLocaleString();
  const activitiesFormatted = Math.round(totalActivities / rate).toLocaleString();
  const bufferFormatted = Math.round(buffer / rate).toLocaleString();

  const pLodging = Math.round((totalLodging / totalInINR) * 100);
  const pDining = Math.round((totalDining / totalInINR) * 100);
  const pTransport = Math.round((totalTransport / totalInINR) * 100);
  const pActivities = Math.round((totalActivities / totalInINR) * 100);
  const pBuffer = 100 - (pLodging + pDining + pTransport + pActivities);

  const sym = SYMBOLS[currency];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/70 backdrop-blur-md">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
              Trip Budget Estimator
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Cost forecast across accommodation, dining, and transit
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          
          {/* Currency Switcher */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Currency
            </span>
            <div className="flex gap-1 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
              {(['INR', 'USD', 'EUR', 'GBP'] as Currency[]).map((curr) => (
                <button
                  key={curr}
                  onClick={() => setCurrency(curr)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    currency === curr
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>
          </div>

          {/* Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                  Duration
                </span>
                <span className="text-xs font-bold text-zinc-900 dark:text-white">
                  {days} Days
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={14}
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full accent-sky-500"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                  Travelers
                </span>
                <span className="text-xs font-bold text-zinc-900 dark:text-white">
                  {travelers} Person{travelers > 1 ? 's' : ''}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={8}
                value={travelers}
                onChange={(e) => setTravelers(Number(e.target.value))}
                className="w-full accent-sky-500"
              />
            </div>
          </div>

          {/* Tiers */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Lodging Standard
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'budget', label: 'Budget Hostel', desc: 'Dorm or economy room' },
                  { id: 'comfort', label: '3-Star Hotel', desc: 'Standard private room' },
                  { id: 'luxury', label: '5-Star Resort', desc: 'Premium luxury suites' },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => setLodgingTier(tier.id as any)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      lodgingTier === tier.id
                        ? 'border-zinc-900 bg-zinc-100 dark:border-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold'
                        : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                    }`}
                  >
                    <div className="text-xs">{tier.label}</div>
                    <div className="text-[10px] text-zinc-400 mt-0.5">{tier.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Dining Preference
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'street', label: 'Local Food', desc: 'Markets & street stalls' },
                  { id: 'casual', label: 'Casual Bistros', desc: 'Mid-range restaurants' },
                  { id: 'fine', label: 'Fine Dining', desc: 'Chef-curated tasting' },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => setDiningTier(tier.id as any)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      diningTier === tier.id
                        ? 'border-zinc-900 bg-zinc-100 dark:border-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold'
                        : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                    }`}
                  >
                    <div className="text-xs">{tier.label}</div>
                    <div className="text-[10px] text-zinc-400 mt-0.5">{tier.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Breakdown Bar */}
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              <span>Cost Allocation</span>
              <span className="text-zinc-400 text-[11px]">Includes 10% contingency</span>
            </div>

            <div className="h-2.5 rounded-full overflow-hidden flex bg-zinc-200 dark:bg-zinc-700">
              <div style={{ width: `${pLodging}%` }} className="bg-sky-500" />
              <div style={{ width: `${pDining}%` }} className="bg-amber-500" />
              <div style={{ width: `${pTransport}%` }} className="bg-emerald-500" />
              <div style={{ width: `${pActivities}%` }} className="bg-purple-500" />
              <div style={{ width: `${pBuffer}%` }} className="bg-zinc-400" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] pt-1 text-zinc-600 dark:text-zinc-400">
              <div>Stay: {sym}{lodgingFormatted}</div>
              <div>Food: {sym}{diningFormatted}</div>
              <div>Transit: {sym}{transportFormatted}</div>
              <div>Tours: {sym}{activitiesFormatted}</div>
              <div>Buffer: {sym}{bufferFormatted}</div>
            </div>
          </div>

          {/* Grand Total */}
          <div className="p-5 rounded-2xl bg-zinc-900 dark:bg-zinc-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-zinc-800">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-zinc-400 block font-semibold">
                Estimated Total Trip Cost
              </span>
              <div className="text-2xl sm:text-3xl font-bold mt-0.5 font-mono">
                {sym}{totalFormatted}
              </div>
            </div>

            <div className="flex sm:flex-col gap-3 text-xs text-zinc-300 border-t sm:border-t-0 sm:border-l border-zinc-800 pt-2 sm:pt-0 sm:pl-5">
              <div>
                <span className="text-zinc-400 block text-[10px] uppercase">Per Person:</span>
                <span className="font-semibold text-white font-mono">{sym}{perPersonFormatted}</span>
              </div>
              <div>
                <span className="text-zinc-400 block text-[10px] uppercase">Daily Average:</span>
                <span className="font-semibold text-white font-mono">{sym}{perDayFormatted}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
