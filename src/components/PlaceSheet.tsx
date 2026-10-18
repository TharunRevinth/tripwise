'use client';

import React, { useEffect, useState, useRef } from 'react';

interface PlaceSheetProps {
  placeId: string | null;
  onClose: () => void;
  allDestinations: any[];
  trip: any[];
  onAddPlace: (dest: any, details: { day: number; cost: number; notes: string }) => Promise<void>;
  onRemoveItem: (id: string) => Promise<void>;
  onOpenPlace: (id: string) => void;
  onGoToTrip: () => void;
}

const EM: Record<string, string> = {
  Historical: '🏛️',
  Nature: '🌿',
  'Food & Dining': '🍜',
  Landmarks: '🗼',
  Entertainment: '🎭',
  Culture: '🎨',
};

const CAT_COLORS: Record<string, string> = {
  Historical: 'var(--sun)',
  Nature: 'var(--mint)',
  'Food & Dining': 'var(--tom)',
  Landmarks: 'var(--sky)',
  Entertainment: 'var(--pink)',
  Culture: 'var(--lil)',
};

const wx = (c: string = '') =>
  /thunder/i.test(c)
    ? '⛈️'
    : /snow/i.test(c)
    ? '❄️'
    : /rain|drizzle|shower/i.test(c)
    ? '🌧️'
    : /fog/i.test(c)
    ? '🌫️'
    : /partly/i.test(c)
    ? '⛅'
    : /cloud|overcast/i.test(c)
    ? '☁️'
    : /clear|sun/i.test(c)
    ? '☀️'
    : '🌤️';

const defCost = (d: any) =>
  ({ $: 15, '$$': 40, '$$$': 90, '$$$$': 180 }[d?.priceLevel as string] ?? (d?.estimatedCost || 15));

const getPriceLabel = (d: any) => {
  if (!d) return 'Free';
  const tier = d.priceLevel;
  const costMap: Record<string, number> = { $: 15, '$$': 40, '$$$': 90, '$$$$': 180 };
  const approx = tier ? costMap[tier] : null;
  if (approx) {
    return `$${approx} pp (${tier})`;
  }
  if (d.estimatedCost && d.estimatedCost > 0) {
    return `$${d.estimatedCost} pp`;
  }
  return tier || 'Free admission';
};

const fmtN = (n?: number) =>
  n && n >= 1e3 ? (n / 1e3).toFixed(1).replace('.0', '') + 'k' : n ?? 0;

export default function PlaceSheet({
  placeId,
  onClose,
  allDestinations,
  trip,
  onAddPlace,
  onRemoveItem,
  onOpenPlace,
  onGoToTrip,
}: PlaceSheetProps) {
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [weather, setWeather] = useState<any>(null);

  const [day, setDay] = useState<number>(1);
  const [cost, setCost] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const sheetRef = useRef<HTMLElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!placeId) {
      setDetails(null);
      setWeather(null);
      return;
    }

    previouslyFocusedElementRef.current = document.activeElement as HTMLElement;

    const base = allDestinations.find((d) => d.id === placeId);
    setDetails(base || null);
    setLoading(true);
    setCost(base ? defCost(base) : 15);
    setDay(1);
    setNotes('');

    // Fetch full details from API
    fetch(`/api/destinations/${encodeURIComponent(placeId)}`)
      .then((res) => res.json())
      .then(async (json) => {
        if (json.success && json.data) {
          const d = json.data;
          setDetails((prev: any) => ({ ...prev, ...d }));
          const calculated = defCost(d);
          setCost((prev) => (prev > 0 ? prev : calculated));
          if (d.weather) {
            setWeather(d.weather);
          } else if (d.latitude && d.longitude) {
            try {
              const wRes = await fetch(`/api/weather?lat=${d.latitude}&lon=${d.longitude}&city=${encodeURIComponent(d.city)}`);
              const wJson = await wRes.json();
              if (wJson.success && wJson.data) setWeather(wJson.data);
            } catch (err) {
              console.warn('Weather fetch failed:', err);
            }
          }
        }
      })
      .catch((err) => console.warn('Details fetch error:', err))
      .finally(() => setLoading(false));

    return () => {
      if (previouslyFocusedElementRef.current) {
        previouslyFocusedElementRef.current.focus();
      }
    };
  }, [placeId, allDestinations]);

  // Handle Escape key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && placeId) {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [placeId, onClose]);

  if (!placeId || !details) return null;

  const inTrip = trip.find((t) => t.placeId === details.id);
  const moreInCity = allDestinations.filter((y) => y.city === details.city && y.id !== details.id).slice(0, 4);
  const catColor = CAT_COLORS[details.category] || 'var(--sun)';

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onAddPlace(details, { day, cost, notes });
    } finally {
      setIsSubmitting(false);
    }
  };

  const lat = details.latitude ?? details.lat;
  const lon = details.longitude ?? details.lon;

  return (
    <>
      <div id="ov" className={placeId ? 'on' : ''} onClick={onClose} />
      <aside
        id="sh"
        ref={sheetRef}
        role="dialog"
        aria-label="Place details"
        aria-modal="true"
        className={placeId ? 'on' : ''}
        style={{ '--c': catColor } as React.CSSProperties}
      >
        <div className="hi">
          <button className="x" onClick={onClose} aria-label="Close">
            ✕
          </button>
          <span className="em">{EM[details.category] || '📍'}</span>
          {details.imageUrl && (
            <img
              src={details.imageUrl}
              alt={details.name}
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
          )}
        </div>

        <div className="sb">
          <div>
            <span
              className="stk"
              style={{ position: 'static', display: 'inline-block', background: 'var(--c)' }}
            >
              {details.category}
            </span>
            <h2 style={{ marginTop: 10 }}>{details.name}</h2>
            <p className="lo">
              {details.city}, {details.country}
            </p>
          </div>

          <p>{details.description || ''}</p>

          {weather ? (
            <div className="t wx">
              <div className="big">
                <span>{wx(weather.condition)}</span>
                <b>{Math.round(weather.temperature)}°</b>
                <div>
                  <p>{weather.condition}</p>
                  <p>
                    Humidity {weather.humidity}%, wind {Math.round(weather.windSpeed)} km/h
                  </p>
                </div>
              </div>
              <div className="fc">
                {(weather.forecast || []).slice(0, 5).map((a: any, idx: number) => (
                  <div key={idx}>
                    {new Date(a.date).toLocaleDateString('en', { weekday: 'short', timeZone: 'UTC' })}
                    <b>{wx(a.condition)}</b>
                    {Math.round(a.maxTemp)}° / {Math.round(a.minTemp)}°
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="t">
              <p>{loading ? 'Loading live weather...' : 'Live weather is unavailable right now.'}</p>
            </div>
          )}

          <div className="fx">
            <div className="t" style={{ background: 'var(--sun)', color: 'var(--k)' }}>
              <small>Best time</small>
              <b>{details.bestTimeToVisit || 'Year round'}</b>
            </div>
            <div className="t" style={{ background: 'var(--mint)', color: 'var(--k)' }}>
              <small>Price</small>
              <b style={{ fontSize: 15 }}>{getPriceLabel(details)}</b>
            </div>
            <div className="t" style={{ background: 'var(--pink)', color: 'var(--k)' }}>
              <small>Rating</small>
              <b>
                ★ {details.rating != null ? Number(details.rating).toFixed(1) : '–'} (
                {fmtN(details.reviewCount)})
              </b>
            </div>
            <div className="t">
              <small>Address</small>
              <b style={{ fontSize: 14 }}>{details.address || details.city}</b>
            </div>
          </div>

          <div className="tgs">
            {(details.tags || []).map((t: string) => (
              <span key={t}>{t}</span>
            ))}
          </div>

          {/* Interactive In-App Map Preview */}
          {isFinite(lat) && isFinite(lon) && (
            <div
              className="t"
              style={{
                padding: 0,
                overflow: 'hidden',
                borderRadius: 16,
                border: '2.5px solid var(--ink)',
                background: 'var(--pp)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  background: 'var(--cv)',
                  borderBottom: '2px solid var(--ink)',
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>🗺️</span> Location Map Preview
                </span>
                <span style={{ color: 'var(--mu)', fontSize: 11 }}>
                  {lat.toFixed(4)}°, {lon.toFixed(4)}°
                </span>
              </div>
              <div style={{ position: 'relative', width: '100%', height: 210, background: '#e5e3df' }}>
                <iframe
                  title={`Map location of ${details.name}`}
                  width="100%"
                  height="100%"
                  style={{ border: 0, display: 'block' }}
                  loading="lazy"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.012}%2C${lat - 0.012}%2C${lon + 0.012}%2C${lat + 0.012}&layer=mapnik&marker=${lat}%2C${lon}`}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  background: 'var(--pp)',
                  fontSize: 11,
                  gap: 8,
                }}
              >
                <span
                  style={{
                    color: 'var(--mu)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '65%',
                  }}
                  title={details.address || `${details.city}, ${details.country}`}
                >
                  📍 {details.address || `${details.city}, ${details.country}`}
                </span>
                <a
                  href={`https://maps.google.com/?q=${lat},${lon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontWeight: 700,
                    color: 'var(--ink)',
                    textDecoration: 'underline',
                    flexShrink: 0,
                  }}
                >
                  Google Maps ↗
                </a>
              </div>
            </div>
          )}

          {inTrip ? (
            <div className="t" style={{ background: 'var(--mint)', color: 'var(--k)' }}>
              <b>In your trip, day {inTrip.dayNumber ?? inTrip.day ?? 1}</b>
              <div className="row" style={{ marginTop: 10 }}>
                <button
                  className="btn o sm"
                  onClick={() => {
                    onClose();
                    onGoToTrip();
                  }}
                >
                  See my trip
                </button>
                <button className="btn sm" onClick={() => onRemoveItem(inTrip.id)}>
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <form className="t" onSubmit={handleAddSubmit}>
              <div className="af">
                <label>
                  Day
                  <select value={day} onChange={(e) => setDay(Number(e.target.value))}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Cost per person ($)
                  <input
                    type="number"
                    min="0"
                    value={cost}
                    onChange={(e) => setCost(Number(e.target.value))}
                  />
                </label>
                <label style={{ gridColumn: '1/-1' }}>
                  Note
                  <input
                    maxLength={280}
                    placeholder="Morning visit, buy tickets online"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </label>
                <button className="btn" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Adding...' : 'Add to my trip'}
                </button>
              </div>
            </form>
          )}

          {moreInCity.length > 0 && (
            <div>
              <b>More in {details.city}</b>
              <div className="sim" style={{ marginTop: 8 }}>
                {moreInCity.map((y) => (
                  <button key={y.id} onClick={() => onOpenPlace(y.id)}>
                    {EM[y.category] || ''} {y.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
