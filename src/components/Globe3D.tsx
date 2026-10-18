'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Globe3DProps {
  selectedCity?: string;
  onSelectCity?: (city: string) => void;
}

interface CityPin {
  name: string;
  lat: number;
  lon: number;
  country: string;
}

const CITIES: CityPin[] = [
  { name: 'Chennai', lat: 13.0827, lon: 80.2707, country: 'India' },
  { name: 'Tokyo', lat: 35.6762, lon: 139.6503, country: 'Japan' },
  { name: 'Paris', lat: 48.8566, lon: 2.3522, country: 'France' },
  { name: 'New York', lat: 40.7128, lon: -74.006, country: 'USA' },
  { name: 'Rome', lat: 41.9028, lon: 12.4964, country: 'Italy' },
  { name: 'Bali', lat: -8.4095, lon: 115.1889, country: 'Indonesia' },
];

function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

export default function Globe3D({ selectedCity = 'All', onSelectCity }: Globe3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 240;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Globe group for rotation
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const radius = 70;

    // 1. Inner Sphere (Earth Body)
    const sphereGeo = new THREE.SphereGeometry(radius, 64, 64);
    const sphereMat = new THREE.MeshPhongMaterial({
      color: 0x0f172a,
      emissive: 0x0284c7,
      emissiveIntensity: 0.15,
      shininess: 40,
      wireframe: false,
    });
    const globeMesh = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(globeMesh);

    // 2. Wireframe / Latitude-Longitude Grid Rings
    const gridMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.25,
    });
    for (let lat = -60; lat <= 60; lat += 30) {
      const ringRadius = radius * Math.cos((lat * Math.PI) / 180);
      const ringY = radius * Math.sin((lat * Math.PI) / 180);
      const ringGeo = new THREE.BufferGeometry();
      const points: THREE.Vector3[] = [];
      for (let i = 0; i <= 64; i++) {
        const theta = (i / 64) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * ringRadius, ringY, Math.sin(theta) * ringRadius));
      }
      ringGeo.setFromPoints(points);
      const ring = new THREE.Line(ringGeo, gridMat);
      globeGroup.add(ring);
    }

    // 3. Atmosphere Outer Glow
    const glowGeo = new THREE.SphereGeometry(radius * 1.15, 32, 32);
    const glowMat = new THREE.ShaderMaterial({
      uniforms: {
        glowColor: { value: new THREE.Color(0x38bdf8) },
        viewVector: { value: camera.position },
      },
      vertexShader: `
        uniform vec3 viewVector;
        varying float intensity;
        void main() {
          vec3 vNormal = normalize(normalMatrix * normal);
          vec3 vNormel = normalize(normalMatrix * viewVector);
          intensity = pow(0.6 - dot(vNormal, vNormel), 2.0);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        varying float intensity;
        void main() {
          vec3 glow = glowColor * intensity;
          gl_FragColor = vec4(glow, intensity * 0.4);
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
    });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    globeGroup.add(glowMesh);

    // 4. City Pins (Interactive)
    const pinGroup = new THREE.Group();
    globeGroup.add(pinGroup);

    const pinMeshes: { mesh: THREE.Mesh; city: CityPin }[] = [];

    CITIES.forEach((city) => {
      const pos = latLonToVector3(city.lat, city.lon, radius + 1.2);
      
      // Pin Sphere
      const pinGeo = new THREE.SphereGeometry(2.4, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({
        color: city.name.toLowerCase() === selectedCity.toLowerCase() ? 0xef4444 : 0x38bdf8,
      });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.copy(pos);
      pinMesh.userData = { city: city.name };
      pinGroup.add(pinMesh);

      // Outer Pulse Ring
      const pulseGeo = new THREE.RingGeometry(2.8, 3.8, 24);
      const pulseMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
      });
      const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
      pulseMesh.position.copy(pos.clone().multiplyScalar(1.01));
      pulseMesh.lookAt(pos.clone().multiplyScalar(2));
      pinGroup.add(pulseMesh);

      pinMeshes.push({ mesh: pinMesh, city });
    });

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x38bdf8, 2.5);
    dirLight.position.set(150, 100, 150);
    scene.add(dirLight);

    const backLight = new THREE.DirectionalLight(0x818cf8, 1.5);
    backLight.position.set(-150, -50, -100);
    scene.add(backLight);

    // Mouse Interaction / Dragging
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / height) * 2 + 1;

      // Check pin hover
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(pinMeshes.map((p) => p.mesh));

      if (intersects.length > 0) {
        const hitCity = intersects[0].object.userData.city;
        setHoveredCity(hitCity);
        container.style.cursor = 'pointer';
      } else {
        setHoveredCity(null);
        container.style.cursor = isDragging ? 'grabbing' : 'grab';
      }

      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        globeGroup.rotation.y += deltaX * 0.005;
        globeGroup.rotation.x += deltaY * 0.005;

        previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    };

    const onMouseUp = (e: MouseEvent) => {
      if (!isDragging) return;
      isDragging = false;
      container.style.cursor = 'grab';

      // Click pin trigger
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(pinMeshes.map((p) => p.mesh));

      if (intersects.length > 0) {
        const cityName = intersects[0].object.userData.city;
        if (onSelectCity) onSelectCity(cityName);
      }
    };

    // Touch support for mobile
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - previousMousePosition.x;
        const deltaY = e.touches[0].clientY - previousMousePosition.y;

        globeGroup.rotation.y += deltaX * 0.006;
        globeGroup.rotation.x += deltaY * 0.006;

        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // Resize Observer
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Slow elegant auto-spin when idle
      if (!isDragging) {
        globeGroup.rotation.y += 0.002;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isClient, selectedCity, onSelectCity]);

  return (
    <div className="relative w-full h-[340px] sm:h-[420px] lg:h-[460px] flex items-center justify-center overflow-hidden rounded-3xl bg-radial from-sky-950/40 via-slate-900/60 to-slate-950/90 border border-sky-500/20 shadow-2xl backdrop-blur-xl">
      {/* 3D Canvas Mount Point */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Interactive Badge */}
      <div className="absolute top-4 left-4 pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-sky-500/30 text-xs font-medium text-sky-300 backdrop-blur-md shadow-lg">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
        </span>
        Interactive 3D Earth • Drag to rotate & click city pins
      </div>

      {/* Hovered City Tooltip */}
      {hoveredCity && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none px-4 py-2 rounded-xl bg-slate-900/90 border border-sky-400 text-sky-200 text-sm font-semibold shadow-2xl backdrop-blur-md flex items-center gap-2">
          <span>📍 Click to explore</span>
          <span className="text-white font-bold">{hoveredCity}</span>
        </div>
      )}

      {/* Quick City Jump Buttons on Globe Overlay */}
      <div className="absolute bottom-3 right-3 hidden sm:flex flex-wrap gap-1.5 max-w-[280px] justify-end">
        {CITIES.map((c) => (
          <button
            key={c.name}
            onClick={() => onSelectCity && onSelectCity(c.name)}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all duration-200 border ${
              selectedCity.toLowerCase() === c.name.toLowerCase()
                ? 'bg-sky-500 text-white border-sky-400 shadow-md shadow-sky-500/30'
                : 'bg-slate-900/70 text-slate-300 border-slate-700/60 hover:bg-slate-800 hover:border-sky-500/50'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}
