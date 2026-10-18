'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface GlobeProps {
  destinations: any[];
  trip: any[];
  onSelectPlace?: (id: string) => void;
  flyToPlace?: any;
}

export default function Globe3D({ destinations, trip, onSelectPlace, flyToPlace }: GlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const globeInstanceRef = useRef<any>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let destroyed = false;
    let animId: number;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 50);
    const Z = new THREE.Color('#5EB0FF');

    // Toon-shaded core sphere
    const core = new THREE.Mesh(
      new THREE.SphereGeometry(1, 64, 64),
      new THREE.ShaderMaterial({
        uniforms: { a: { value: Z.clone().offsetHSL(0, 0, 0.08) } },
        vertexShader: `
          varying vec3 n;
          void main() {
            n = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 a;
          varying vec3 n;
          void main() {
            float l = dot(n, normalize(vec3(-0.5, 0.6, 0.7)));
            gl_FragColor = vec4(a * (l > 0.15 ? 1.0 : l > -0.35 ? 0.86 : 0.72), 1.0);
          }
        `,
      })
    );
    scene.add(core);

    // Thick black back-face outline
    const outline = new THREE.Mesh(
      new THREE.SphereGeometry(1.04, 48, 48),
      new THREE.MeshBasicMaterial({ color: 0x0d0d0d, side: THREE.BackSide })
    );
    scene.add(outline);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const marksGroup = new THREE.Group();
    const arcsGroup = new THREE.Group();
    globeGroup.add(marksGroup, arcsGroup);

    let dotsMesh: THREE.Points | null = null;

    const vec = (la: number, lo: number, r: number) => {
      const p = ((90 - la) * Math.PI) / 180;
      const t = ((lo + 180) * Math.PI) / 180;
      return new THREE.Vector3(-r * Math.sin(p) * Math.cos(t), r * Math.cos(p), r * Math.sin(p) * Math.sin(t));
    };

    const buildDots = (keep: (la: number, lo: number) => boolean, N: number) => {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i < N; i++) {
        const la = Math.asin(1 - (2 * (i + 0.5)) / N) * 57.2958;
        const lo = ((i * 137.508) % 360) - 180;
        if (keep(la, lo)) pts.push(vec(la, lo, 1));
      }
      if (dotsMesh) globeGroup.remove(dotsMesh);
      dotsMesh = new THREE.Points(
        new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.PointsMaterial({ size: 0.016, color: 0xffffff })
      );
      globeGroup.add(dotsMesh);
    };

    // Initial fallback dots
    buildDots(() => true, 2200);

    // Load earth-water mask
    const img = new Image();
    img.src = '/img/earth-water.png';
    img.onload = () => {
      if (destroyed) return;
      try {
        const W = 720;
        const H = 360;
        const offCanvas = document.createElement('canvas');
        offCanvas.width = W;
        offCanvas.height = H;
        const ctx = offCanvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, W, H);
        const data = ctx.getImageData(0, 0, W, H).data;
        const at = (la: number, lo: number) => {
          const y = ((90 - la) / 180) * H | 0;
          const x = ((lo + 180) / 360) * W | 0;
          return data[(y * W + x) * 4];
        };
        let count = 0;
        for (let i = 0; i < 400; i++) {
          const la = Math.asin(1 - (2 * (i + 0.5)) / 400) * 57.3;
          const lo = ((i * 137.5) % 360) - 180;
          if (at(la, lo) < 128) count++;
        }
        const inv = count > 200;
        buildDots((la, lo) => (inv ? at(la, lo) >= 128 : at(la, lo) < 128), 20000);
      } catch (err) {
        console.warn('Earth mask failed, using procedural dots:', err);
      }
    };

    // Orbiting clouds
    const clouds = [0, 1, 2, 3].map((i) => {
      const q = new THREE.Group();
      [
        [0, 0, 0.09],
        [0.1, -0.015, 0.07],
        [-0.1, -0.015, 0.065],
        [0.04, 0.06, 0.06],
      ].forEach(([x, y, s]) => {
        const m = new THREE.Mesh(new THREE.SphereGeometry(s, 12, 12), new THREE.MeshBasicMaterial({ color: 0xffffff }));
        m.position.set(x, y, 0);
        q.add(m);
      });
      q.position.z = 1.3;
      const pivot = new THREE.Group();
      pivot.add(q);
      pivot.rotation.set(i * 0.9 - 1, i * 1.7, 0);
      pivot.userData.s = 0.0025 + i * 0.0008;
      scene.add(pivot);
      return pivot;
    });

    // Orbiting Flamingo model
    let flamingoPivot: THREE.Group | null = null;
    let mixer: THREE.AnimationMixer | null = null;
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
      '/models/Flamingo.glb',
      (gltf) => {
        if (destroyed) return;
        const obj = gltf.scene;
        const box = new THREE.Box3().setFromObject(obj);
        const len = box.getSize(new THREE.Vector3()).length();
        obj.position.sub(box.getCenter(new THREE.Vector3()));
        const wrapper = new THREE.Group();
        wrapper.add(obj);
        wrapper.scale.setScalar(0.3 / len);
        wrapper.rotation.y = -Math.PI / 2;

        flamingoPivot = new THREE.Group();
        flamingoPivot.add(wrapper);
        scene.add(flamingoPivot);

        mixer = new THREE.AnimationMixer(obj);
        gltf.animations.forEach((clip) => mixer?.clipAction(clip).play());
      },
      undefined,
      (err) => console.warn('Could not load Flamingo:', err)
    );

    // Resize handling
    const resize = () => {
      if (!container || !canvas) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.position.set(0, 0, w / h < 0.9 ? 4.9 : 3.9);
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    // Interaction state
    const target = { x: 0.3, y: -1.6 };
    let lastInteraction = 0;
    const raycaster = new THREE.Raycaster();
    let hoveredId: string | null = null;
    let selectedId: string | null = null;

    const raycast = (e: MouseEvent | PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(marksGroup.children.filter((m) => m.userData.id));
      return hits[0] || null;
    };

    let pointerDown: { x: number; y: number; m: number } | null = null;

    canvas.onpointerdown = (e) => {
      pointerDown = { x: e.clientX, y: e.clientY, m: 0 };
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = 'grabbing';
    };

    canvas.onpointermove = (e) => {
      if (pointerDown) {
        const dx = e.clientX - pointerDown.x;
        const dy = e.clientY - pointerDown.y;
        pointerDown.m += Math.abs(dx) + Math.abs(dy);
        pointerDown.x = e.clientX;
        pointerDown.y = e.clientY;
        target.y += dx * 0.006;
        target.x = Math.max(-1.2, Math.min(1.2, target.x + dy * 0.006));
        lastInteraction = performance.now();
        return;
      }

      const hit = raycast(e);
      const id = hit ? hit.object.userData.id : null;
      canvas.style.cursor = hit ? 'pointer' : 'grab';
      if (id !== hoveredId) {
        hoveredId = id;
        const dest = id && globeInstanceRef.current?.destinations?.find((x: any) => x.id === id);
        const tag = tagRef.current;
        if (tag) {
          if (dest) {
            tag.classList.remove('hide');
            tag.textContent = `${dest.category || '📍'} ${dest.name}`;
          } else {
            tag.classList.add('hide');
          }
        }
      }
    };

    canvas.onpointerup = (e) => {
      canvas.style.cursor = 'grab';
      if (pointerDown && pointerDown.m < 6) {
        const hit = raycast(e);
        if (hit && onSelectPlace) {
          onSelectPlace(hit.object.userData.id);
        }
      }
      pointerDown = null;
    };

    // Render loop
    let lastTime = 0;
    const animate = (time: number) => {
      if (destroyed) return;
      animId = requestAnimationFrame(animate);

      const dt = Math.min(0.05, (time - lastTime) / 1000);
      lastTime = time;

      if (time - lastInteraction > 3500) {
        target.y += 0.0022;
      }
      globeGroup.rotation.y += (target.y - globeGroup.rotation.y) * 0.07;
      globeGroup.rotation.x += (target.x - globeGroup.rotation.x) * 0.07;

      clouds.forEach((p) => (p.rotation.y += p.userData.s));

      if (flamingoPivot && mixer) {
        const a = time / 1700;
        const getP = (val: number) =>
          new THREE.Vector3(Math.cos(val) * 1.4, Math.sin(val) * 0.55 + 0.15 * Math.sin(val * 2), Math.sin(val) * 1.4 * 0.9);
        flamingoPivot.position.copy(getP(a));
        flamingoPivot.lookAt(getP(a + 0.05));
        mixer.update(dt);
      }

      marksGroup.children.forEach((m) => {
        if (m.userData.id) {
          m.scale.setScalar(m.userData.id === selectedId || m.userData.id === hoveredId ? 1.7 : 1);
        }
      });

      renderer.render(scene, camera);
    };
    animate(0);

    // Controller methods
    const updateMarks = (list: any[], tripItems: any[]) => {
      marksGroup.clear();
      list.forEach((d: any) => {
        const lat = d.latitude ?? d.lat;
        const lon = d.longitude ?? d.lon;
        if (!isFinite(lat) || !isFinite(lon)) return;
        const p = vec(lat, lon, 1.02);
        const inTrip = tripItems.some((t: any) => t.placeId === d.id);
        const m = new THREE.Mesh(
          new THREE.SphereGeometry(0.03, 14, 14),
          new THREE.MeshBasicMaterial({ color: inTrip ? 0x3ddc97 : 0xff5a36 })
        );
        const o = new THREE.Mesh(
          new THREE.SphereGeometry(0.044, 14, 14),
          new THREE.MeshBasicMaterial({ color: 0x0d0d0d, side: THREE.BackSide })
        );
        m.position.copy(p);
        o.position.copy(p);
        m.userData.id = d.id;
        marksGroup.add(m, o);
      });
    };

    const updateArcs = (tripItems: any[]) => {
      arcsGroup.clear();
      const valid = [...tripItems].filter((t: any) => {
        const lat = t.latitude ?? t.lat;
        const lon = t.longitude ?? t.lon;
        return isFinite(lat) && isFinite(lon);
      });
      valid.sort((a: any, b: any) => (a.dayNumber ?? a.day ?? 1) - (b.dayNumber ?? b.day ?? 1));

      for (let i = 1; i < valid.length; i++) {
        const aLat = valid[i - 1].latitude ?? valid[i - 1].lat;
        const aLon = valid[i - 1].longitude ?? valid[i - 1].lon;
        const bLat = valid[i].latitude ?? valid[i].lat;
        const bLon = valid[i].longitude ?? valid[i].lon;

        const a = vec(aLat, aLon, 1.02);
        const b = vec(bLat, bLon, 1.02);
        const mid = a
          .clone()
          .add(b)
          .multiplyScalar(0.5)
          .normalize()
          .multiplyScalar(1.02 + a.distanceTo(b) * 0.5);

        const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
        const tube = new THREE.Mesh(
          new THREE.TubeGeometry(curve, 40, 0.006, 6),
          new THREE.MeshBasicMaterial({ color: 0x0d0d0d })
        );
        arcsGroup.add(tube);
      }
    };

    const fly = (d: any) => {
      const lat = d.latitude ?? d.lat;
      const lon = d.longitude ?? d.lon;
      if (!isFinite(lat) || !isFinite(lon)) return;
      selectedId = d.id;
      const v = vec(lat, lon, 1);
      const a = Math.atan2(-v.x, v.z);
      const w =
        (((a - globeGroup.rotation.y + Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI) - Math.PI;
      target.y = globeGroup.rotation.y + w;
      target.x = (lat * Math.PI) / 180;
      lastInteraction = performance.now() + 4000;
    };

    globeInstanceRef.current = {
      updateMarks,
      updateArcs,
      fly,
      destinations,
    };

    return () => {
      destroyed = true;
      cancelAnimationFrame(animId);
      ro.disconnect();
      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update marks and destinations when props change
  useEffect(() => {
    if (globeInstanceRef.current) {
      globeInstanceRef.current.destinations = destinations;
      globeInstanceRef.current.updateMarks(destinations, trip);
      globeInstanceRef.current.updateArcs(trip);
    }
  }, [destinations, trip]);

  // Handle camera fly
  useEffect(() => {
    if (flyToPlace && globeInstanceRef.current) {
      globeInstanceRef.current.fly(flyToPlace);
    }
  }, [flyToPlace]);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
      <canvas id="globe" ref={canvasRef} aria-label="Interactive 3D globe" />
      <span className="note">drag me, tap a pin</span>
      <div className="gt hide" id="gtag" ref={tagRef}></div>
    </div>
  );
}
