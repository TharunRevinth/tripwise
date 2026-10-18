import { NextResponse } from 'next/server';

// Default resilient fallback rates (base: USD)
const FALLBACK_RATES: Record<string, number> = {
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

export async function GET() {
  try {
    // Open Exchange Rates public endpoint (free, no auth required)
    const res = await fetch('https://open.er-api.com/v6/latest/USD', {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.rates) {
        return NextResponse.json({
          success: true,
          base: 'USD',
          rates: {
            ...FALLBACK_RATES,
            ...data.rates,
          },
          lastUpdated: data.time_last_update_utc || new Date().toISOString(),
          isLive: true,
        });
      }
    }
  } catch (err) {
    console.warn('Live currency API failed, using cached fallback rates:', err);
  }

  // Fallback response if external network is unavailable
  return NextResponse.json({
    success: true,
    base: 'USD',
    rates: FALLBACK_RATES,
    lastUpdated: new Date().toISOString(),
    isLive: false,
  });
}
