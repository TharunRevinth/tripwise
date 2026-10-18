import type { Metadata } from 'next';
import { Bricolage_Grotesque, Instrument_Sans, Caveat } from 'next/font/google';
import './globals.css';

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
});

const instrument = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument',
  display: 'swap',
});

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TripWise · plan the trip, pack the day',
  description: 'Smart Travel Planner with Interactive 3D Globe, Real-Time Weather, AI Planner, and Route Estimates.',
  keywords: ['TripWise', 'Travel Planner', 'Full-Stack', 'Next.js', 'Supabase', 'Open-Meteo', 'Three.js'],
  authors: [{ name: 'AWS Student Builder Group Applicant' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${instrument.variable} ${bricolage.variable} ${caveat.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
