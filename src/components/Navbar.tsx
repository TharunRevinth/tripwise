'use client';

import React, { useState } from 'react';
import { Compass, Calendar, Calculator, Sparkles, Menu, X, Plane } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  activeTab: 'explore' | 'itinerary' | 'estimator' | 'ai-planner';
  setActiveTab: (tab: 'explore' | 'itinerary' | 'estimator' | 'ai-planner') => void;
  itineraryCount: number;
}

export default function Navbar({ activeTab, setActiveTab, itineraryCount }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'explore' as const, label: 'Explore Places', icon: Compass },
    { 
      id: 'itinerary' as const, 
      label: 'My Itinerary', 
      icon: Calendar,
      badge: itineraryCount > 0 ? itineraryCount : null
    },
    { id: 'estimator' as const, label: 'Trip Estimator', icon: Calculator },
    { id: 'ai-planner' as const, label: 'AI Planner', icon: Sparkles, highlight: true },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveTab('explore')} 
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/25 group-hover:scale-105 transition-transform duration-200">
              <Plane className="w-5 h-5 sm:w-6 sm:h-6 -rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-400 bg-clip-text text-transparent">
                  TripWise
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                  3D + AI
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 -mt-1 hidden sm:block">
                Smart Travel Planner
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 border border-sky-200/80 dark:border-sky-800/80 shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-sky-500' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span>{item.label}</span>

                  {item.badge !== null && item.badge !== undefined && (
                    <span className="ml-1 px-1.5 py-0.5 text-[11px] font-bold rounded-full bg-sky-500 text-white animate-pulse">
                      {item.badge}
                    </span>
                  )}

                  {item.highlight && !isActive && (
                    <span className="px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                      OpenRouter
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Side: Theme Toggle & Mobile Menu Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 dark:border-slate-800 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                    isActive
                      ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-sky-500" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== null && item.badge !== undefined && (
                    <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-sky-500 text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
