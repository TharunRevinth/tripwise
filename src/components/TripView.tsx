'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const FoxMascot = dynamic(() => import('./FoxMascot'), {
  ssr: false,
  loading: () => <div style={{ width: 280, height: 210 }} />,
});

interface TripViewProps {
  trip: any[];
  onOpenSheet: (placeId: string) => void;
  onPatchItem: (id: string, updates: any) => Promise<void>;
  onRemoveItem: (id: string) => Promise<void>;
  onClearTrip: () => Promise<void>;
  onGoToDiscover: () => void;
  onGoToPlan: () => void;
  showToast: (m: string) => void;
}

const SUPPORTED_CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'INR', symbol: '₹', label: 'Indian Rupee' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'GBP', symbol: '£', label: 'British Pound' },
  { code: 'JPY', symbol: '¥', label: 'Japanese Yen' },
  { code: 'AED', symbol: 'AED ', label: 'UAE Dirham' },
  { code: 'SGD', symbol: 'S$', label: 'Singapore Dollar' },
  { code: 'THB', symbol: '฿', label: 'Thai Baht' },
  { code: 'IDR', symbol: 'Rp ', label: 'Indonesian Rupiah' },
  { code: 'AUD', symbol: 'A$', label: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', label: 'Canadian Dollar' },
  { code: 'CHF', symbol: 'CHF ', label: 'Swiss Franc' },
];

const DEFAULT_RATES: Record<string, number> = {
  USD: 1.0,
  INR: 86.8,
  EUR: 0.92,
  GBP: 0.78,
  JPY: 153.5,
  AED: 3.67,
  SGD: 1.34,
  THB: 35.8,
  IDR: 15850.0,
  AUD: 1.54,
  CAD: 1.39,
  CHF: 0.88,
};

const EM: Record<string, string> = {
  Historical: '🏛️',
  Nature: '🌿',
  'Food & Dining': '🍜',
  Landmarks: '🗼',
  Entertainment: '🎭',
  Culture: '🎨',
};

const km = (a: { lat: number; lon: number }, b: { lat: number; lon: number }) => {
  const r = Math.PI / 180;
  const dl = (b.lat - a.lat) * r;
  const dn = (b.lon - a.lon) * r;
  const x =
    Math.sin(dl / 2) ** 2 +
    Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dn / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(x));
};

const hr = (h: number) => {
  if (h < 1) return Math.max(1, Math.round(h * 60)) + ' min';
  if (h < 48) return h.toFixed(1) + ' h';
  return Math.round(h / 24) + ' days';
};

const money = (n: number) => '$' + Math.round(n).toLocaleString('en-US');

const MODES = {
  walk: { n: 'Walk', e: '🚶', t: (d: number) => d / 5, c: () => 0, ok: (d: number) => d <= 5, v: false },
  cab: { n: 'Cab', e: '🚕', t: (d: number) => (d * 1.3) / 28, c: (d: number) => 1.5 + 0.7 * d, ok: (d: number) => d <= 400, v: true },
  bus: {
    n: 'Bus',
    e: '🚌',
    t: (d: number) => (d * 1.25) / 40,
    c: (d: number) => Math.max(0.4, 0.045 * d),
    ok: (d: number, a: any, b: any) => d >= 1.5 && d <= 1500 && (a.country === b.country || d < 500),
    v: false,
  },
  train: {
    n: 'Train',
    e: '🚆',
    t: (d: number) => (d * 1.2) / 65,
    c: (d: number) => Math.max(2, 0.03 * d * 1.2),
    ok: (d: number, a: any, b: any) => d >= 30 && d <= 2500 && a.country === b.country,
    v: false,
  },
  flight: { n: 'Flight', e: '✈️', t: (d: number) => d / 750 + 3, c: (d: number) => 30 + 0.07 * d, ok: (d: number) => d >= 250, v: false },
};

export default function TripView({
  trip,
  onOpenSheet,
  onPatchItem,
  onRemoveItem,
  onClearTrip,
  onGoToDiscover,
  onGoToPlan,
  showToast,
}: TripViewProps) {
  // Live Currency state
  const [rates, setRates] = useState<Record<string, number>>(DEFAULT_RATES);
  const [isLiveRates, setIsLiveRates] = useState<boolean>(false);

  // Trip Settings stored in localStorage
  const [settings, setSettings] = useState<{
    trav: number;
    pref: 'cheapest' | 'balanced' | 'fastest';
    budget: number;
    start: string;
    currency: string;
    variance: number;
  }>({
    trav: 2,
    pref: 'balanced',
    budget: 1500,
    start: '',
    currency: 'USD',
    variance: 10,
  });

  useEffect(() => {
    let cancelled = false;
    fetch('/api/currency')
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data.success && data.rates) {
          setRates(data.rates);
          setIsLiveRates(Boolean(data.isLive));
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('tw_s');
      if (stored) {
        setSettings((prev) => ({ ...prev, ...JSON.parse(stored) }));
      }
    } catch (e) {}
  }, []);

  const updateSetting = (key: string, val: any) => {
    setSettings((prev) => {
      const updated = { ...prev, [key]: val };
      localStorage.setItem('tw_s', JSON.stringify(updated));
      return updated;
    });
  };

  const fmt = (n: number, overrideCurr?: string) => {
    const c = overrideCurr || settings.currency || 'USD';
    const rate = rates[c] || DEFAULT_RATES[c] || 1;
    const val = n * rate;
    const curInfo = SUPPORTED_CURRENCIES.find((x) => x.code === c);
    const sym = curInfo ? curInfo.symbol : `${c} `;
    if (c === 'INR') {
      return `${sym}${Math.round(val).toLocaleString('en-IN')}`;
    }
    return `${sym}${Math.round(val).toLocaleString('en-US')}`;
  };

  if (!trip || trip.length === 0) {
    return (
      <section id="trip" className="pg ent">
        <div className="wrap" id="tripc">
          <div className="t empty">
            <FoxMascot />
            <h2>Nothing packed yet</h2>
            <p>Find a place you like and hit the plus. Or let the AI planner fill your first days.</p>
            <div className="row">
              <button className="btn o" type="button" onClick={onGoToDiscover}>
                Browse places
              </button>
              <button className="btn" type="button" onClick={onGoToPlan}>
                Try the AI planner
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Group items by day
  const sortedTrip = [...trip].sort(
    (a, b) =>
      (a.dayNumber ?? a.day ?? 1) - (b.dayNumber ?? b.day ?? 1) ||
      String(a.createdAt).localeCompare(String(b.createdAt))
  );

  const maxDay = Math.max(...sortedTrip.map((t) => t.dayNumber ?? t.day ?? 1), 1);
  const visitedCount = sortedTrip.filter((t) => t.isVisited).length;

  // Calculate routes between stops with coords
  const stopsWithCoords = sortedTrip
    .map((t) => ({
      ...t,
      lat: t.latitude ?? t.lat,
      lon: t.longitude ?? t.lon,
    }))
    .filter((t) => isFinite(t.lat) && isFinite(t.lon));

  const legs = stopsWithCoords
    .map((t, i, arr) => {
      if (i === 0) return null;
      const prev = arr[i - 1];
      const d = km(prev, t);
      const options = (Object.keys(MODES) as Array<keyof typeof MODES>)
        .map((k) => [k, MODES[k]] as const)
        .filter(([k, m]) => m.ok(d, prev, t))
        .map(([k, m]) => ({
          k,
          h: m.t(d),
          cost: m.c(d) * (m.v ? Math.ceil(settings.trav / 4) : settings.trav),
        }));

      if (options.length === 0) return null;

      const minH = Math.min(...options.map((x) => x.h));
      const minC = Math.min(...options.map((x) => x.cost));

      const score = (x: { h: number; cost: number }) => {
        if (settings.pref === 'fastest') return x.h;
        if (settings.pref === 'cheapest') return x.cost;
        return (x.cost + 1) / (minC + 1) + (x.h + 0.05) / (minH + 0.05);
      };

      const pick = [...options].sort((p, q) => score(p) - score(q))[0];
      return { a: prev, b: t, d, options, pick };
    })
    .filter(Boolean) as Array<{
    a: any;
    b: any;
    d: number;
    options: Array<{ k: keyof typeof MODES; h: number; cost: number }>;
    pick: { k: keyof typeof MODES; h: number; cost: number };
  }>;

  const transitTotal = legs.reduce((s, l) => s + l.pick.cost, 0);
  const activitiesTotal =
    sortedTrip.reduce((s, t) => s + (Number(t.estimatedCost) || 0), 0) * settings.trav;
  const totalCost = activitiesTotal + transitTotal;

  const formatDateForDay = (d: number) => {
    if (!settings.start) return '';
    const dateObj = new Date(new Date(settings.start).getTime() + (d - 1) * 864e5);
    return dateObj.toLocaleDateString('en', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      timeZone: 'UTC',
    });
  };

  const dayOptions = Array.from({ length: Math.max(maxDay + 1, 5) }, (_, i) => i + 1);

  const handleExportPlan = () => {
    let text = `TripWise plan (${settings.currency})\n`;
    sortedTrip.forEach((y) => {
      text += `\nDay ${y.dayNumber ?? y.day ?? 1}: ${y.name}, ${y.city}${
        y.notes ? ' - ' + y.notes : ''
      } (${fmt(Number(y.estimatedCost) || 0)} pp)`;
    });
    text += `\n\nTotal estimated cost: ${fmt(totalCost)} (${settings.trav} travellers)`;
    if ((settings.variance ?? 10) > 0) {
      text += `\nEstimated foreign range (±${settings.variance}%): ${fmt(
        totalCost * (1 - (settings.variance ?? 10) / 100)
      )} – ${fmt(totalCost * (1 + (settings.variance ?? 10) / 100))}`;
    }
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
    a.download = 'tripwise-plan.txt';
    a.click();
    showToast('Plan downloaded');
  };

  return (
    <section id="trip" className="pg ent">
      <div className="wrap" id="tripc">
        <h1 className="tt">Your trip</h1>

        <div className="tg2">
          {/* Main Stops Column */}
          <div>
            {Array.from({ length: maxDay }, (_, idx) => {
              const dayNum = idx + 1;
              const dayItems = sortedTrip.filter(
                (t) => (t.dayNumber ?? t.day ?? 1) === dayNum
              );
              if (dayItems.length === 0) return null;

              const dayCost = dayItems.reduce(
                (sum, item) => sum + (Number(item.estimatedCost) || 0),
                0
              );

              return (
                <div key={dayNum}>
                  <div className="dh">
                    <h3>Day {dayNum}</h3>
                    <span>{formatDateForDay(dayNum)}</span>
                    <em>{fmt(dayCost)} pp</em>
                  </div>

                  {dayItems.map((item) => (
                    <article
                      key={item.id}
                      className={`ti ${item.isVisited ? 'done' : ''}`}
                      data-c={item.category}
                    >
                      <div className="th">
                        {EM[item.category] || '📍'}
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt=""
                            onError={(e) => (e.currentTarget.style.display = 'none')}
                          />
                        )}
                      </div>

                      <div>
                        <h4 onClick={() => onOpenSheet(item.placeId || item.id)}>
                          {item.name}
                        </h4>
                        <p>
                          {item.city}
                          {item.country ? `, ${item.country}` : ''}
                        </p>
                        <input
                          className="nt"
                          defaultValue={item.notes || ''}
                          placeholder="Add a note: timings, tickets, who's coming"
                          maxLength={280}
                          aria-label={`Note for ${item.name}`}
                          onBlur={(e) => {
                            if (e.target.value !== (item.notes || '')) {
                              onPatchItem(item.id, { notes: e.target.value.trim() });
                            }
                          }}
                        />
                      </div>

                      <div className="ct">
                        <label>
                          Day
                          <select
                            defaultValue={item.dayNumber ?? item.day ?? 1}
                            onChange={(e) => {
                              onPatchItem(item.id, { dayNumber: Number(e.target.value) });
                            }}
                          >
                            {dayOptions.map((n) => (
                              <option key={n} value={n}>
                                {n}
                              </option>
                            ))}
                          </select>
                        </label>

                        <label>
                          Cost ($)
                          <input
                            type="number"
                            min="0"
                            defaultValue={item.estimatedCost || 0}
                            onBlur={(e) => {
                              const val = Number(e.target.value);
                              if (val >= 0 && val !== item.estimatedCost) {
                                onPatchItem(item.id, { estimatedCost: val });
                              }
                            }}
                          />
                          {settings.currency !== 'USD' && (
                            <span style={{ fontSize: 10, color: 'var(--mu)', marginTop: 2 }}>
                              ≈ {fmt(item.estimatedCost || 0)}
                            </span>
                          )}
                        </label>

                        <button
                          className={`vs ${item.isVisited ? 'on' : ''}`}
                          onClick={() => {
                            onPatchItem(item.id, { isVisited: !item.isVisited });
                          }}
                        >
                          {item.isVisited ? 'Visited ✓' : 'Mark visited'}
                        </button>

                        <button
                          className="rm"
                          onClick={() => onRemoveItem(item.id)}
                          aria-label={`Remove ${item.name}`}
                        >
                          Remove
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              );
            })}
          </div>

          {/* Sticky Side Column */}
          <aside className="sd">
            {/* Visited Progress */}
            <div className="t mintb">
              <h3>
                {visitedCount} of {sortedTrip.length} visited
              </h3>
              <div className="pr">
                <i style={{ width: `${(visitedCount / sortedTrip.length) * 100}%` }} />
              </div>
            </div>

            {/* Budget Box with Live Currency and Foreign Variance Buffer */}
            <div className="t sun">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <h3 style={{ margin: 0 }}>Budget</h3>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 999,
                    border: '1.5px solid var(--k)',
                    background: isLiveRates ? '#3DDC97' : '#FFC400',
                    color: '#0D0D0D',
                  }}
                  title={isLiveRates ? 'Live FX rates via Open Exchange Rates API' : 'Using cached exchange rates'}
                >
                  {isLiveRates ? '● Live FX' : '○ Offline FX'}
                </span>
              </div>

              <div className="pf">
                <label>
                  Travellers
                  <select
                    value={settings.trav}
                    onChange={(e) => updateSetting('trav', Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Start date
                  <input
                    type="date"
                    value={settings.start}
                    onChange={(e) => updateSetting('start', e.target.value)}
                  />
                </label>

                <label>
                  Currency
                  <select
                    value={settings.currency || 'USD'}
                    onChange={(e) => updateSetting('currency', e.target.value)}
                  >
                    {SUPPORTED_CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code} ({c.symbol.trim()}) - {c.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Budget ($)
                  <input
                    type="number"
                    min="0"
                    value={settings.budget}
                    onChange={(e) => updateSetting('budget', Number(e.target.value))}
                  />
                </label>
              </div>

              {/* Foreign Variance Buffer (±%) */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--k)' }}>
                    Foreign trip buffer (±%)
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--k)', opacity: 0.85 }}>
                    Fees & FX swings
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[0, 5, 10, 15].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      className={`ch ${(settings.variance ?? 10) === pct ? 'on' : ''}`}
                      style={{ padding: '3px 8px', fontSize: 12, flex: 1, textAlign: 'center' }}
                      onClick={() => updateSetting('variance', pct)}
                    >
                      {pct === 0 ? '±0%' : `±${pct}%`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rw">
                <span>Places and tickets</span>
                <span>{fmt(activitiesTotal)}</span>
              </div>
              <div className="rw">
                <span>Getting around</span>
                <span>{fmt(transitTotal)}</span>
              </div>
              <div className="rw tot">
                <span>Total</span>
                <span>{fmt(totalCost)}</span>
              </div>
              <div className="rw">
                <span>Per person</span>
                <span>
                  {fmt(totalCost / settings.trav)}
                  {settings.currency !== 'INR' && ` (${fmt(totalCost / settings.trav, 'INR')})`}
                </span>
              </div>

              {/* Variance range estimate */}
              {(settings.variance ?? 10) > 0 && (
                <div
                  style={{
                    margin: '8px 0',
                    padding: '8px 10px',
                    borderRadius: 10,
                    border: '2px dashed var(--k)',
                    background: 'rgba(255, 255, 255, 0.45)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700 }}>
                    <span>Est. Range (±{settings.variance}%):</span>
                    <span>
                      {fmt(totalCost * (1 - (settings.variance ?? 10) / 100))} –{' '}
                      {fmt(totalCost * (1 + (settings.variance ?? 10) / 100))}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, marginTop: 3, opacity: 0.85, lineHeight: 1.3 }}>
                    Buffers for card foreign markup fees (2–3%), FX rate shifts & tips.
                  </div>
                </div>
              )}

              <div
                className={`pr ${totalCost > settings.budget ? 'over' : ''}`}
                style={{ marginTop: 10 }}
              >
                <i
                  style={{
                    width: `${Math.min(100, (totalCost / (settings.budget || 1)) * 100)}%`,
                  }}
                />
              </div>

              <p style={{ fontWeight: 600, marginTop: 6 }}>
                {totalCost > settings.budget
                  ? `About ${fmt(totalCost - settings.budget)} over budget.`
                  : `${fmt(settings.budget - totalCost)} left in the budget.`}
              </p>
            </div>

            {/* Route Planner Box */}
            <div className="t">
              <h3>Getting between stops</h3>
              <div className="row">
                {(['cheapest', 'balanced', 'fastest'] as const).map((pref) => (
                  <button
                    key={pref}
                    type="button"
                    className={`ch ${settings.pref === pref ? 'on' : ''}`}
                    onClick={() => updateSetting('pref', pref)}
                  >
                    {pref[0].toUpperCase() + pref.slice(1)}
                  </button>
                ))}
              </div>

              {legs.length > 0 ? (
                <div className="lgs">
                  {legs.map((leg, idx) => (
                    <div key={idx} className="lgx">
                      <b>
                        {leg.a.name} to {leg.b.name},{' '}
                        {leg.d < 10 ? leg.d.toFixed(1) : Math.round(leg.d)} km
                      </b>
                      {leg.options.map((opt, oIdx) => {
                        const isBest = opt.k === leg.pick.k;
                        return (
                          <div key={oIdx} className={`md ${isBest ? 'best' : ''}`}>
                            <span>
                              {MODES[opt.k].e} {MODES[opt.k].n}
                            </span>
                            <span>
                              {hr(opt.h)}, {opt.cost ? fmt(opt.cost) : 'free'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                  <p className="lo" style={{ marginTop: 8 }}>
                    Estimates from distance, not live fares.
                  </p>
                </div>
              ) : (
                <p className="lo" style={{ marginTop: 8 }}>
                  Add two or more stops with a location to compare ways to travel.
                </p>
              )}
            </div>

            {/* Quick Actions */}
            <div className="row">
              <button className="btn o" type="button" onClick={handleExportPlan}>
                Export plan
              </button>
              <button className="btn o" type="button" onClick={onClearTrip}>
                Clear trip
              </button>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
