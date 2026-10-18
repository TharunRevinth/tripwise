'use client';

import React, { useState } from 'react';

interface AIPlannerViewProps {
  cities: string[];
  allDestinations: any[];
  trip: any[];
  onAddSpotToTrip: (day: number, spot: any, city: string) => Promise<boolean>;
  showToast: (m: string) => void;
}

const THEMES = [
  'Culture & Heritage',
  'Food & Markets',
  'Nature & Outdoors',
  'Relax & Beaches',
  'Nightlife & Fun',
  'Family Friendly',
];

const PACE = ['relaxed', 'moderate', 'packed'];

export default function AIPlannerView({
  cities,
  allDestinations,
  trip,
  onAddSpotToTrip,
  showToast,
}: AIPlannerViewProps) {
  const [city, setCity] = useState<string>('Chennai');
  const [days, setDays] = useState<number>(3);
  const [theme, setTheme] = useState<string>(THEMES[0]);
  const [pace, setPace] = useState<string>('moderate');

  const [loading, setLoading] = useState<boolean>(false);
  const [plan, setPlan] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim() || loading) return;

    setLoading(true);
    setError(null);
    setPlan(null);

    try {
      const res = await fetch('/api/ai-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: city.trim(),
          days: Math.min(7, Math.max(1, days)),
          theme,
          pace,
        }),
      });

      const json = await res.json();
      if (!res.ok || json.success === false) {
        throw new Error(json.message || json.error || 'Failed to generate plan');
      }
      setPlan(json.data);
    } catch (err: any) {
      setError(err.message || 'The planner could not answer');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSingleSpot = async (dayNum: number, spot: any) => {
    const success = await onAddSpotToTrip(dayNum, spot, plan.city);
    showToast(success ? `${spot.name} added to day ${dayNum}` : `${spot.name} is already in your trip`);
  };

  const handleAddWholeDay = async (dayNum: number, spots: any[]) => {
    let added = 0;
    for (const spot of spots) {
      const ok = await onAddSpotToTrip(dayNum, spot, plan.city);
      if (ok) added++;
    }
    showToast(`${added} spot${added === 1 ? '' : 's'} added to day ${dayNum}`);
  };

  return (
    <section id="plan" className="pg ent">
      <div className="wrap pl2">
        {/* Planner Settings Form */}
        <form className="t fm" onSubmit={handleSubmit}>
          <h2>Tell us the vibe</h2>

          <label>
            City
            <input
              list="city-datalist"
              placeholder="Chennai"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <datalist id="city-datalist">
              {cities.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </label>

          <label>
            How many days
            <input
              type="number"
              min={1}
              max={7}
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
            />
          </label>

          <div>
            <b>Theme</b>
            <div className="row" style={{ marginTop: 6 }}>
              {THEMES.map((t) => (
                <button
                  type="button"
                  key={t}
                  className={`ch ${theme === t ? 'on' : ''}`}
                  onClick={() => setTheme(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <b>Pace</b>
            <div className="row" style={{ marginTop: 6 }}>
              {PACE.map((p) => (
                <button
                  type="button"
                  key={p}
                  className={`ch ${pace === p ? 'on' : ''}`}
                  onClick={() => setPace(p)}
                >
                  {p[0].toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <button className="btn" type="submit" disabled={loading}>
            {loading ? 'Planning...' : 'Plan my days'}
          </button>
        </form>

        {/* Results / Output Area */}
        <div id="pout">
          {loading && (
            <div className="t ld">
              <h3>Mapping out {city}</h3>
              <p style={{ color: 'var(--mu)' }}>
                Picking spots, ordering the days, estimating costs.
              </p>
              <div className="pr">
                <i />
              </div>
            </div>
          )}

          {!loading && error && (
            <div className="t">
              <h3 style={{ fontSize: 28 }}>The planner couldn&apos;t answer</h3>
              <p style={{ color: 'var(--mu)', margin: '6px 0 12px' }}>{error}</p>
              <button className="btn" onClick={handleSubmit}>
                Try again
              </button>
            </div>
          )}

          {!loading && !error && !plan && (
            <div className="t">
              <p className="hand">your plan shows up here</p>
              <h2 style={{ fontSize: 38, letterSpacing: -1.6 }}>Pick a city and a mood.</h2>
              <p style={{ color: 'var(--mu)', marginTop: 8 }}>
                You get a day by day schedule, rough costs, packing tips and local food to try. Add
                any spot to your trip with one tap.
              </p>
            </div>
          )}

          {!loading && !error && plan && (
            <>
              {/* Plan Header */}
              <div className="t">
                <p className="hand">{plan.theme || ''}</p>
                <h2 style={{ fontSize: 40, letterSpacing: -1.8, lineHeight: 1 }}>
                  {plan.city} in {plan.days} day{plan.days > 1 ? 's' : ''}
                </h2>
                <p style={{ marginTop: 8 }}>{plan.overview || ''}</p>
              </div>

              {/* Days List */}
              {(plan.dailyPlans || []).map((d: any) => (
                <div key={d.day} className="t">
                  <div className="dyh">
                    <h3>Day {d.day}</h3>
                    <span>{d.title}</span>
                    <button
                      className="btn sm"
                      onClick={() => handleAddWholeDay(d.day, d.spots || [])}
                    >
                      Add whole day
                    </button>
                  </div>

                  {(d.spots || []).map((s: any, idx: number) => (
                    <div key={idx} className="sp">
                      <span className="tm">{s.timeOfDay || ''}</span>
                      <div>
                        <b>{s.name}</b>
                        <p>{s.description || ''}</p>
                        {s.tips && <p className="tip">{s.tips}</p>}
                      </div>
                      <div className="r">
                        <span>{s.estimatedCost || ''}</span>
                        <button
                          className="btn o sm"
                          onClick={() => handleAddSingleSpot(d.day, s)}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}

              {/* Pack this */}
              {(plan.packingTips || []).length > 0 && (
                <div className="t" style={{ background: 'var(--sun)', color: 'var(--k)' }}>
                  <h3 style={{ fontSize: 26, letterSpacing: -1 }}>Pack this</h3>
                  <div className="sim" style={{ marginTop: 8 }}>
                    {plan.packingTips.map((item: string, idx: number) => (
                      <span
                        key={idx}
                        style={{
                          border: '2.5px solid #0D0D0D',
                          borderRadius: 10,
                          padding: '3px 12px',
                          fontWeight: 600,
                          background: '#fff8',
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Eat this */}
              {(plan.bestLocalFood || []).length > 0 && (
                <div className="t" style={{ background: 'var(--tom)', color: 'var(--k)' }}>
                  <h3 style={{ fontSize: 26, letterSpacing: -1 }}>Eat this</h3>
                  <p style={{ fontWeight: 600, marginTop: 6 }}>
                    {plan.bestLocalFood.join(', ')}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
