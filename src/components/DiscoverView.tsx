'use client';

import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

const Globe3D = dynamic(() => import('./Globe3D'), {
  ssr: false,
  loading: () => (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: 'var(--sky)' }}>
      <span className="note">Loading 3D globe...</span>
    </div>
  ),
});

interface DiscoverViewProps {
  destinations: any[];
  allDestinations: any[];
  trip: any[];
  countries: string[];
  filterCountry: string;
  setFilterCountry: (country: string) => void;
  cities: string[];
  filterCity: string;
  setFilterCity: (city: string) => void;
  filterCat: string;
  setFilterCat: (cat: string) => void;
  sort: string;
  setSort: (s: string) => void;
  search: string;
  setSearch: (q: string) => void;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onResetFilters: () => void;
  onOpenSheet: (id: string) => void;
  onToggleAdd: (dest: any) => void;
  onGoToPlan: () => void;
  flyToPlace?: any;
}

const EM: Record<string, string> = {
  Historical: '🏛️',
  Nature: '🌿',
  'Food & Dining': '🍜',
  Landmarks: '🗼',
  Entertainment: '🎭',
  Culture: '🎨',
};

const COUNTRY_FLAGS: Record<string, string> = {
  India: '🇮🇳',
  Japan: '🇯🇵',
  France: '🇫🇷',
  USA: '🇺🇸',
  Italy: '🇮🇹',
  Indonesia: '🇮🇩',
  'United Kingdom': '🇬🇧',
  UAE: '🇦🇪',
  Singapore: '🇸🇬',
  Thailand: '🇹🇭',
  Spain: '🇪🇸',
};

const CATS = Object.keys(EM);

const fmtN = (n?: number) =>
  n && n >= 1e3 ? (n / 1e3).toFixed(1).replace('.0', '') + 'k' : n ?? 0;

export default function DiscoverView({
  destinations,
  allDestinations,
  trip,
  countries,
  filterCountry,
  setFilterCountry,
  cities,
  filterCity,
  setFilterCity,
  filterCat,
  setFilterCat,
  sort,
  setSort,
  search,
  setSearch,
  loading,
  error,
  onRetry,
  onResetFilters,
  onOpenSheet,
  onToggleAdd,
  onGoToPlan,
  flyToPlace,
}: DiscoverViewProps) {
  const count1Ref = useRef<HTMLElement>(null);
  const count2Ref = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Count up animations
  useEffect(() => {
    const countUp = (el: HTMLElement | null, target: number) => {
      if (!el || target <= 0) return;
      const t0 = performance.now();
      const tick = (now: number) => {
        const k = Math.min(1, (now - t0) / 900);
        el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3))).toString();
        if (k < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    countUp(count1Ref.current, allDestinations.length);
    countUp(count2Ref.current, cities.length);
  }, [allDestinations.length, cities.length]);

  // Staggered card animation on scroll
  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll('.cd');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('seen');
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    cards.forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, [destinations, loading]);

  const marqueeText = (cities.length ? cities : ['Chennai', 'Tokyo', 'Paris', 'New York', 'Rome', 'Kyoto', 'Bali'])
    .map((c) => `${c} ● `)
    .join('');

  return (
    <section id="discover" className="pg ent">
      <div className="wrap">
        <div className="bento">
          {/* Main Title & Search */}
          <div className="t a">
            <p className="hand">where to this time?</p>
            <h1>
              Your next trip,{' '}
              <span className="sq">
                sorted.
                <svg viewBox="0 0 220 14" preserveAspectRatio="none">
                  <path d="M3 9Q20 1 38 9T74 9T110 9T146 9T182 9T217 7" />
                </svg>
              </span>
            </h1>
            <p className="lead">
              Browse authentic places by country &amp; city, check the weather before you commit, then drop
              them into a day by day plan with costs and routes.
            </p>
            <form
              className="sf"
              onSubmit={(e) => {
                e.preventDefault();
                const el = document.getElementById('results');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <input
                id="q"
                type="search"
                placeholder="Try Tokyo, temples, ramen, Taj Mahal..."
                aria-label="Search places"
                autoComplete="off"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="btn" type="submit">
                Search
              </button>
            </form>
          </div>

          {/* 3D Globe Tile */}
          <div className="t g">
            <Globe3D
              destinations={destinations}
              trip={trip}
              onSelectPlace={onOpenSheet}
              flyToPlace={flyToPlace}
            />
          </div>

          {/* Stats Tile */}
          <div className="t s">
            <div>
              <b ref={count1Ref}>0</b>places
            </div>
            <div>
              <b ref={count2Ref}>0</b>cities
            </div>
          </div>

          {/* AI Banner Tile */}
          <button className="t ai" type="button" onClick={onGoToPlan}>
            <span className="hand">no time to plan?</span>
            <strong>Let the AI draft your days</strong>
            <svg viewBox="0 0 100 50">
              <path d="M5 40C30 5 70 5 92 28M76 18 93 29 74 36" />
            </svg>
          </button>
        </div>
      </div>

      {/* Marquee */}
      <div className="mq" aria-hidden="true">
        <div>
          <span>{marqueeText.repeat(8)}</span>
        </div>
      </div>

      {/* Results Section */}
      <div className="wrap" id="results">
        <div className="sh2">
          <div>
            <h2>Places worth the trip</h2>
            <p style={{ color: 'var(--mu)', fontSize: 14, marginTop: 4 }}>
              {filterCity
                ? `Showing top destinations in ${filterCity}${filterCountry ? `, ${filterCountry}` : ''}`
                : filterCountry
                ? `Showing handpicked highlights across ${filterCountry}`
                : 'Showing curated destinations worldwide — pick a country to zoom in'}
            </p>
          </div>
          <span id="count">
            {loading
              ? 'Loading...'
              : `${destinations.length} ${destinations.length === 1 ? 'place' : 'places'}`}
          </span>
        </div>

        {/* Hierarchical Filters: Country -> City -> Category & Sort */}
        <div className="fb">
          {/* Step 1: Country Filter */}
          <div className="row" id="countryc">
            <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--mu)', minWidth: 70 }}>
              Country:
            </span>
            <button
              className={`ch ${!filterCountry ? 'on' : ''}`}
              onClick={() => setFilterCountry('')}
            >
              🌐 All countries
            </button>
            {countries.map((c) => (
              <button
                key={c}
                className={`ch ${filterCountry === c ? 'on' : ''}`}
                onClick={() => setFilterCountry(c)}
              >
                {COUNTRY_FLAGS[c] || '📍'} {c}
              </button>
            ))}
          </div>

          {/* Step 2: City Filter (Scoped to Country) */}
          <div className="row" id="cityc">
            <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--mu)', minWidth: 70 }}>
              City:
            </span>
            <button
              className={`ch ${!filterCity ? 'on' : ''}`}
              onClick={() => setFilterCity('')}
            >
              {filterCountry ? `All in ${filterCountry}` : 'All cities'}
            </button>
            {cities.map((c) => (
              <button
                key={c}
                className={`ch ${filterCity === c ? 'on' : ''}`}
                onClick={() => setFilterCity(c)}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Step 3: Category Chips & Sort Dropdown */}
          <div className="row" id="catc">
            <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--mu)', minWidth: 70 }}>
              Category:
            </span>
            <button
              className={`ch ${!filterCat ? 'on' : ''}`}
              onClick={() => setFilterCat('')}
            >
              Everything
            </button>
            {CATS.map((c) => (
              <button
                key={c}
                className={`ch ${filterCat === c ? 'on' : ''}`}
                onClick={() => setFilterCat(c)}
              >
                {EM[c]} {c}
              </button>
            ))}
            <select
              id="sort"
              aria-label="Sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="rating-desc">Top rated</option>
              <option value="name-asc">Name A to Z</option>
              <option value="name-desc">Name Z to A</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        <div className="cards" id="grid" ref={gridRef}>
          {loading && (
            <>
              <div className="sk" />
              <div className="sk" />
              <div className="sk" />
              <div className="sk" />
              <div className="sk" />
              <div className="sk" />
            </>
          )}

          {!loading && error && (
            <div className="state">
              <h3>Couldn&apos;t load places</h3>
              <p>{error}. Check the backend is running, then try again.</p>
              <button className="btn" onClick={onRetry}>
                Try again
              </button>
            </div>
          )}

          {!loading && !error && destinations.length === 0 && (
            <div className="state">
              <h3>Nothing matches that</h3>
              <p>Try selecting another country or city, or clear your search keywords.</p>
              <button className="btn" onClick={onResetFilters}>
                Reset filters
              </button>
            </div>
          )}

          {!loading &&
            !error &&
            destinations.map((d, i) => {
              const inTrip = trip.some((t) => t.placeId === d.id);
              return (
                <article
                  key={d.id}
                  className="cd"
                  data-id={d.id}
                  data-c={d.category}
                  tabIndex={0}
                  style={{ '--i': i % 5 } as React.CSSProperties}
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest('.add')) return;
                    onOpenSheet(d.id);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') onOpenSheet(d.id);
                  }}
                >
                  <div className="ph">
                    <span className="em">{EM[d.category] || '📍'}</span>
                    {d.imageUrl && (
                      <img
                        src={d.imageUrl}
                        alt={d.name}
                        loading="lazy"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                    )}
                    <span className="stk">{d.category}</span>
                    <button
                      className={`add ${inTrip ? 'in' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleAdd(d);
                      }}
                      aria-label={inTrip ? 'Remove from trip' : 'Add to trip'}
                    >
                      {inTrip ? '✓' : '+'}
                    </button>
                  </div>

                  <div className="bd">
                    <h3>{d.name}</h3>
                    <p className="lo">
                      {d.city}, {d.country}
                    </p>
                    <div className="mt">
                      <span className="rt">
                        ★ {d.rating != null ? Number(d.rating).toFixed(1) : '–'}{' '}
                        <small>({fmtN(d.reviewCount)})</small>
                      </span>
                      <span className="pl">{d.priceLevel || 'Free'}</span>
                    </div>
                    <div className="tgs">
                      {(d.tags || []).slice(0, 3).map((t: string) => (
                        <span key={t}>{t}</span>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
        </div>
      </div>
    </section>
  );
}
