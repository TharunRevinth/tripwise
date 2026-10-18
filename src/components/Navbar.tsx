'use client';

import React, { useEffect, useState } from 'react';

interface NavbarProps {
  view: 'discover' | 'plan' | 'trip';
  setView: (v: 'discover' | 'plan' | 'trip') => void;
  tripCount: number;
}

export default function Navbar({ view, setView, tripCount }: NavbarProps) {
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('tw_dk');
      if (stored === '1' || document.documentElement.dataset.th === 'dark') {
        setIsDark(true);
        document.documentElement.dataset.th = 'dark';
      }
    }
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.dataset.th = 'dark';
      localStorage.setItem('tw_dk', '1');
    } else {
      document.documentElement.dataset.th = '';
      localStorage.removeItem('tw_dk');
    }
  };

  return (
    <header className="nav">
      <div className="wrap nv">
        <a
          className="lg"
          href="#discover"
          onClick={(e) => {
            e.preventDefault();
            setView('discover');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <svg viewBox="0 0 24 24">
            <path
              d="M2 12 22 3 15 21 11 14z"
              fill="#FF5A36"
              stroke="currentColor"
              stroke-width="2"
              stroke-linejoin="round"
            />
          </svg>
          tripwise
        </a>

        <nav className="lk" aria-label="Main">
          <button
            className={view === 'discover' ? 'on' : ''}
            onClick={() => {
              setView('discover');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            Discover
          </button>
          <button
            className={view === 'plan' ? 'on' : ''}
            onClick={() => {
              setView('plan');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            AI planner
          </button>
          <button
            className={view === 'trip' ? 'on' : ''}
            onClick={() => {
              setView('trip');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            My trip
            {tripCount > 0 && <b>{tripCount}</b>}
          </button>
        </nav>

        <button
          className="ic"
          id="dk"
          aria-label="Toggle dark mode"
          onClick={toggleDarkMode}
        >
          ◐
        </button>
      </div>
    </header>
  );
}
