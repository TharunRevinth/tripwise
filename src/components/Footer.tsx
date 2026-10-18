'use client';

import React from 'react';

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        Places and itinerary data come from the TripWise API. Weather by{' '}
        <a href="https://open-meteo.com/" target="_blank" rel="noopener">
          Open-Meteo
        </a>{' '}
        (CC BY 4.0). 3D models: Flamingo from the{' '}
        <a href="https://github.com/mrdoob/three.js" target="_blank" rel="noopener">
          three.js examples
        </a>
        ; Fox by PixelMannen (CC0) with rigging by @tomkranis (CC BY 4.0), via the{' '}
        <a
          href="https://github.com/KhronosGroup/glTF-Sample-Models"
          target="_blank"
          rel="noopener"
        >
          Khronos glTF samples
        </a>
        .
      </div>
    </footer>
  );
}
