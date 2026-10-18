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

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 230;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const radius = 68;

    // 1. Dark sphere base
    const sphereGeo = new THREE.SphereGeometry(radius, 64, 64);
    const sphereMat = new THREE.MeshPhongMaterial({
      color: 0x090d16,
      emissive: 0x0284c7,
      emissiveIntensity: 0.1,
      shininess: 60,
    });
    const globeMesh = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(globeMesh);

    // 2. Latitude and Longitude Rings
    const ringMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.2,
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
      const ring = new THREE.Line(ringGeo, ringMat);
      globeGroup.add(ring);
    }

    // 3. Dot Grid (Points representing globe surface)
    const dotCount = 1200;
    const dotPositions = new Float32Array(dotCount * 3);
    for (let i = 0; i < dotCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / dotCount);
      const theta = Math.sqrt(dotCount * Math.PI) * phi;
      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);
      dotPositions[i * 3] = x;
      dotPositions[i * 3 + 1] = y;
      dotPositions[i * 3 + 2] = z;
    }
    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute('position', new THREE.BufferAttribute(dotPositions, 3));
    const dotMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 1.2,
      transparent: true,
      opacity: 0.45,
    });
    const dotsMesh = new THREE.Points(dotGeo, dotMat);
    globeGroup.add(dotsMesh);

    // 4. Subtle Outer Atmosphere Glow
    const glowGeo = new THREE.SphereGeometry(radius * 1.12, 32, 32);
    const glowMat = new THREE.ShaderMaterial({
      uniforms: {
        glowColor: { value: new THREE.Color(0x0284c7) },
        viewVector: { value: camera.position },
      },
      vertexShader: `
        uniform vec3 viewVector;
        varying float intensity;
        void main() {
          vec3 vNormal = normalize(normalMatrix * normal);
          vec3 vNormel = normalize(normalMatrix * viewVector);
          intensity = pow(0.65 - dot(vNormal, vNormel), 2.2);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        varying float intensity;
        void main() {
          gl_FragColor = vec4(glowColor, intensity * 0.35);
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
    });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    globeGroup.add(glowMesh);

    // 5. City Pins
    const pinGroup = new THREE.Group();
    globeGroup.add(pinGroup);

    const pinMeshes: { mesh: THREE.Mesh; city: CityPin }[] = [];

    CITIES.forEach((city) => {
      const pos = latLonToVector3(city.lat, city.lon, radius + 1.2);
      const isSelected = city.name.toLowerCase() === selectedCity.toLowerCase();
      
      const pinGeo = new THREE.SphereGeometry(isSelected ? 3.0 : 2.2, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({
        color: isSelected ? 0x0284c7 : 0xe0f2fe,
      });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.copy(pos);
      pinMesh.userData = { city: city.name };
      pinGroup.add(pinMesh);

      // Ring around pin
      const pulseGeo = new THREE.RingGeometry(2.6, 3.4, 24);
      const pulseMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: isSelected ? 0.9 : 0.4,
      });
      const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
      pulseMesh.position.copy(pos.clone().multiplyScalar(1.01));
      pulseMesh.lookAt(pos.clone().multiplyScalar(2));
      pinGroup.add(pulseMesh);

      pinMeshes.push({ mesh: pinMesh, city });
    });

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x38bdf8, 2.0);
    dirLight.position.set(150, 100, 150);
    scene.add(dirLight);

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

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(pinMeshes.map((p) => p.mesh));

      if (intersects.length > 0) {
        setHoveredCity(intersects[0].object.userData.city);
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

    const onMouseUp = () => {
      if (!isDragging) return;
      isDragging = false;
      container.style.cursor = 'grab';

      const rect = container.getBoundingClientRect();
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(pinMeshes.map((p) => p.mesh));

      if (intersects.length > 0 && onSelectCity) {
        onSelectCity(intersects[0].object.userData.city);
      }
    };

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

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (!isDragging) {
        globeGroup.rotation.y += 0.0018;
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
    <div className="relative w-full h-[360px] sm:h-[440px] lg:h-[480px] flex items-center justify-center overflow-hidden rounded-2xl bg-zinc-950 border border-zinc-800/80 shadow-2xl">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Subtle indicator tag without emojis */}
      <div className="absolute top-4 left-4 pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-[11px] font-medium tracking-wide text-zinc-400 backdrop-blur-md">
        <span className="h-1.5 w-1.5 rounded-full bg-sky-400"></span>
        Interactive 3D Viewport
      </div>

      {hoveredCity && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 pointer-events-none px-4 py-2 rounded-xl bg-zinc-900/95 border border-sky-500/50 text-xs font-semibold text-white shadow-2xl backdrop-blur-md">
          Select destination: <span className="text-sky-400 font-bold">{hoveredCity}</span>
        </div>
      )}

      {/* Clean minimal city selector */}
      <div className="absolute bottom-4 right-4 hidden sm:flex flex-wrap gap-1.5 max-w-[280px] justify-end">
        {CITIES.map((c) => (
          <button
            key={c.name}
            onClick={() => onSelectCity && onSelectCity(c.name)}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-colors border ${
              selectedCity.toLowerCase() === c.name.toLowerCase()
                ? 'bg-sky-500 text-white border-sky-400'
                : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}
