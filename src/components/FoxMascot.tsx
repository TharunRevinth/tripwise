'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function FoxMascot() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let destroyed = false;
    let animId: number;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const W = canvas.clientWidth || 280;
    const H = canvas.clientHeight || 210;
    renderer.setSize(W, H, false);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, W / H, 0.1, 100);
    camera.position.set(0, 0.4, 4.6);
    camera.lookAt(0, 0, 0);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x9aa0b4, 1.25);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight.position.set(2, 4, 3);
    scene.add(dirLight);

    const pivot = new THREE.Group();
    scene.add(pivot);

    let mixer: THREE.AnimationMixer | null = null;

    const loader = new GLTFLoader();
    loader.load(
      '/models/Fox.glb',
      (gltf) => {
        if (destroyed) return;
        const obj = gltf.scene;
        const box = new THREE.Box3().setFromObject(obj);
        const size = box.getSize(new THREE.Vector3());
        obj.position.sub(box.getCenter(new THREE.Vector3()));
        const wrapper = new THREE.Group();
        wrapper.add(obj);
        wrapper.scale.setScalar(2.1 / Math.max(size.x, size.y, size.z));
        pivot.add(wrapper);

        mixer = new THREE.AnimationMixer(obj);
        const clip = gltf.animations.find((x) => x.name === 'Walk') || gltf.animations[0];
        if (clip) {
          mixer.clipAction(clip).play();
        }
      },
      undefined,
      (err) => console.warn('Could not load Fox model:', err)
    );

    let last = 0;
    const tick = (t: number) => {
      if (destroyed) {
        renderer.dispose();
        return;
      }
      animId = requestAnimationFrame(tick);
      pivot.rotation.y = Math.sin(t / 1400) * 0.7 + 0.6;
      if (mixer) {
        mixer.update(Math.min(0.05, (t - last) / 1000));
      }
      last = t;
      renderer.render(scene, camera);
    };
    tick(0);

    return () => {
      destroyed = true;
      cancelAnimationFrame(animId);
      renderer.dispose();
    };
  }, []);

  return <canvas id="fox" ref={canvasRef} aria-label="Walking fox mascot" />;
}
