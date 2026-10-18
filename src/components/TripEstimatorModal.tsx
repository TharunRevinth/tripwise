'use client';

import React, { useState } from 'react';
import { 
  X, Calculator, DollarSign, Users, Calendar, 
  Hotel, Utensils, Compass, ShieldAlert, Sparkles 
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
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
};

export default function TripEstimatorModal({ isOpen, onClose }: TripEstimatorModalProps) {
  const [currency, setCurrency] = useState<Currency>('INR');
  const [days, setDays] = useState(4);
  const [travelers, setTravelers] = useState(2);
  const [lodgingTier, setLodgingTier] = useState<'budget' | 'comfort' | 'luxury'>('comfort');
  const [diningTier, setDiningTier] = useState<'street' | 'casual' | 'fine'>('casual');
  const [transportTier, setTransportTier] = useState<'public' | 'cabs' | 'rental'>('cabs');

  if (!isOpen) return null;

  // Base daily rates in INR
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

  // Calculations in INR
  const roomsNeeded = Math.ceil(travelers / 2);
  const totalLodging = lodgingCostPerNight * roomsNeeded * days;
  const totalDining = diningCostPerPersonPerDay * travelers * days;
  const totalTransport = transportCostPerDay * days;
  const totalActivities = activitiesCostPerPersonPerDay * travelers * days;
  const subtotal = totalLodging + totalDining + totalTransport + totalActivities;
  const buffer = Math.round(subtotal * 0.1); // 10% emergency buffer
  const totalInINR = subtotal + buffer;

  // Conversion to selected currency
  const rate = RATES_TO_INR[currency];
  const totalFormatted = Math.round(totalInINR / rate).toLocaleString();
  const perPersonFormatted = Math.round(totalInINR / rate / travelers).toLocaleString();
  const perDayFormatted = Math.round(totalInINR / rate / days).toLocaleString();

  const lodgingFormatted = Math.round(totalLodging / rate).toLocaleString();
  const diningFormatted = Math.round(totalDining / rate).toLocaleString();
  const transportFormatted = Math.round(totalTransport / rate).toLocaleString();
  const activitiesFormatted = Math.round(totalActivities / rate).toLocaleString();
  const bufferFormatted = Math.round(buffer / rate).toLocaleString();

  // Percentage calculations
  const pLodging = Math.round((totalLodging / totalInINR) * 100);
  const pDining = Math.round((totalDining / totalInINR) * 100);
  const pTransport = Math.round((totalTransport / totalInINR) * 100);
  const pActivities = Math.round((totalActivities / totalInINR) * 100);
  const pBuffer = 100 - (pLodging + pDining + pTransport + pActivities);

  const sym = SYMBOLS[currency];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 sm:p-8 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-sky-500/10 via-indigo-500/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-600 dark:text-sky-400">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Trip Budget Estimator
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Interactive real-time cost breakdown for accommodation, dining & transit
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

        {/* Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Currency Switcher */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Select Currency:
            </span>
            <div className="flex gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              {(['INR', 'USD', 'EUR', 'GBP'] as Currency[]).map((curr) => (
                <button
                  key={curr}
                  onClick={() => setCurrency(curr)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    currency === curr
                      ? 'bg-sky-500 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  {SYMBOLS[curr]} {curr}
                </button>
              ))}
            </div>
          </div>

          {/* Sliders: Days & Travelers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                  <Calendar className="w-4 h-4 text-sky-500" />
                  Trip Duration
                </span>
                <span className="text-sm font-bold text-sky-600 dark:text-sky-400">
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

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                  <Users className="w-4 h-4 text-sky-500" />
                  Travelers
                </span>
                <span className="text-sm font-bold text-sky-600 dark:text-sky-400">
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

          {/* Tiers Selection */}
          <div className="space-y-4">
            
            {/* Lodging */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                <Hotel className="w-4 h-4 text-sky-500" />
                Lodging & Accommodation
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'budget', label: 'Hostel / Budget', desc: 'Backpacker style' },
                  { id: 'comfort', label: '3-Star Hotel', desc: 'Comfortable stay' },
                  { id: 'luxury', label: '5-Star Resort', desc: 'Premium luxury' },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => setLodgingTier(tier.id as any)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      lodgingTier === tier.id
                        ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 ring-2 ring-sky-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="text-xs font-bold">{tier.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{tier.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Dining */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                <Utensils className="w-4 h-4 text-sky-500" />
                Dining Style
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'street', label: 'Street & Local', desc: 'Authentic budget' },
                  { id: 'casual', label: 'Casual Bistros', desc: 'Mid-range dining' },
                  { id: 'fine', label: 'Fine Dining', desc: 'Gourmet cuisine' },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => setDiningTier(tier.id as any)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      diningTier === tier.id
                        ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 ring-2 ring-sky-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="text-xs font-bold">{tier.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{tier.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Visual Percentage Breakdown Bar */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Budget Distribution</span>
              <span className="text-slate-500">10% Emergency Buffer Included</span>
            </div>

            <div className="h-4 rounded-full overflow-hidden flex bg-slate-200 dark:bg-slate-700">
              <div style={{ width: `${pLodging}%` }} className="bg-sky-500" title={`Lodging: ${pLodging}%`} />
              <div style={{ width: `${pDining}%` }} className="bg-amber-500" title={`Dining: ${pDining}%`} />
              <div style={{ width: `${pTransport}%` }} className="bg-emerald-500" title={`Transport: ${pTransport}%`} />
              <div style={{ width: `${pActivities}%` }} className="bg-purple-500" title={`Activities: ${pActivities}%`} />
              <div style={{ width: `${pBuffer}%` }} className="bg-rose-400" title={`Buffer: ${pBuffer}%`} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] pt-1">
              <div><span className="inline-block w-2 h-2 rounded-full bg-sky-500 mr-1.5" />Stay: {sym}{lodgingFormatted}</div>
              <div><span className="inline-block w-2 h-2 rounded-full bg-amber-500 mr-1.5" />Food: {sym}{diningFormatted}</div>
              <div><span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-1.5" />Transit: {sym}{transportFormatted}</div>
              <div><span className="inline-block w-2 h-2 rounded-full bg-purple-500 mr-1.5" />Tours: {sym}{activitiesFormatted}</div>
              <div><span className="inline-block w-2 h-2 rounded-full bg-rose-400 mr-1.5" />Buffer: {sym}{bufferFormatted}</div>
            </div>
          </div>

          {/* Grand Total Box */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-sky-600 to-indigo-700 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-sky-200 block">
                Total Estimated Trip Cost
              </span>
              <div className="text-3xl sm:text-4xl font-black mt-1">
                {sym}{totalFormatted}
              </div>
            </div>

            <div className="flex sm:flex-col gap-4 text-xs font-semibold text-sky-100 border-t sm:border-t-0 sm:border-l border-white/20 pt-3 sm:pt-0 sm:pl-6">
              <div>
                <span className="text-sky-300 block">Per Person:</span>
                <span className="text-base font-bold text-white">{sym}{perPersonFormatted}</span>
              </div>
              <div>
                <span className="text-sky-300 block">Per Day:</span>
                <span className="text-base font-bold text-white">{sym}{perDayFormatted}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
