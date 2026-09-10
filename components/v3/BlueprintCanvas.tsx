'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Kanvas blueprint yang berdiri DI BELAKANG seluruh halaman v3: cincin,
 * garis silang, dan satu inti wireframe yang berputar sangat pelan, seperti
 * gambar teknik RX-78 yang tertinggal di atas meja gambar.
 *
 * Ia sengaja tidak tinggal di hero. Ubin-ubin bento buram dan menutup hampir
 * seluruh layar pertama; kanvas yang disembunyikan di belakangnya tidak akan
 * pernah terlihat. Sebagai latar fixed di belakang <main>, ia justru muncul
 * di ruang-ruang kosong antar section, dan identitas Gundam-nya terasa di
 * sepanjang halaman tanpa satu kata pun ditambah.
 *
 * Garis-garisnya membaca warna dari --v3-blue. Tanpa WebGL, tanpa
 * JavaScript, di layar kecil, atau di prefers-reduced-motion, halaman
 * tinggal kehilangan latar ini: tidak ada konten yang ikut hilang.
 */

/** Lingkaran sebagai satu LineLoop. */
function ring(radius: number, segments = 128): THREE.BufferGeometry {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0));
  }
  return new THREE.BufferGeometry().setFromPoints(points);
}

/** Deretan tick di sekeliling cincin, seperti skala di jangka sorong. */
function ticks(radius: number, count: number, length: number): THREE.BufferGeometry {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    points.push(new THREE.Vector3(cos * radius, sin * radius, 0));
    points.push(new THREE.Vector3(cos * (radius + length), sin * (radius + length), 0));
  }
  return new THREE.BufferGeometry().setFromPoints(points);
}

export default function BlueprintCanvas() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(min-width: 980px)').matches) return;

    const root = host.closest('.v3-root') ?? document.documentElement;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      return; /* WebGL tidak tersedia: halaman kehilangan latar, bukan isi. */
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(host.clientWidth, host.clientHeight);
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      40,
      host.clientWidth / host.clientHeight,
      0.1,
      100,
    );
    camera.position.z = 26;

    const material = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.2 });
    const value = getComputedStyle(root).getPropertyValue('--v3-blue').trim();
    if (value) material.color.set(value);

    const blueprint = new THREE.Group();
    scene.add(blueprint);

    const disposables: { dispose(): void }[] = [material];
    const track = <T extends { dispose(): void }>(resource: T): T => {
      disposables.push(resource);
      return resource;
    };

    /* Cincin-cincin besar, berputar berlawanan arah dengan kecepatan berbeda. */
    const rings = new THREE.Group();
    [7, 10.5, 14].forEach((radius) => {
      rings.add(new THREE.LineLoop(track(ring(radius)), material));
    });
    rings.add(new THREE.LineSegments(track(ticks(10.5, 72, 0.35)), material));
    blueprint.add(rings);

    /* Garis silang tipis, patokan gambar teknik. */
    const cross = track(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-20, 0, 0),
        new THREE.Vector3(20, 0, 0),
        new THREE.Vector3(0, -14, 0),
        new THREE.Vector3(0, 14, 0),
      ]),
    );
    blueprint.add(new THREE.LineSegments(cross, material));

    /* Inti wireframe yang berputar pada porosnya, minggir ke kanan atas
       supaya mengintip dari balik ruang kosong, bukan menutupi kolom teks. */
    const core = new THREE.LineSegments(
      track(new THREE.EdgesGeometry(track(new THREE.IcosahedronGeometry(3.1, 0)))),
      material,
    );
    core.position.set(10.5, 3.5, -2);
    blueprint.add(core);

    /* Parallax pointer: kamera bergeser sedikit dan mengejar dengan lerp,
       jadi gerakannya terasa seperti massa, bukan seperti tempelan kursor. */
    let pointerX = 0;
    let pointerY = 0;
    const onPointerMove = (event: PointerEvent) => {
      pointerX = (event.clientX / window.innerWidth - 0.5) * 2;
      pointerY = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const onResize = () => {
      const { clientWidth, clientHeight } = host;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
    };
    window.addEventListener('resize', onResize);

    /* Tab tersembunyi: loop berhenti, GPU ikut istirahat. */
    let running = true;
    const onVisibility = () => {
      running = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', onVisibility);

    const clock = new THREE.Clock();
    renderer.setAnimationLoop(() => {
      if (!running) return;
      const elapsed = clock.getElapsedTime();

      rings.rotation.z = elapsed * 0.02;
      core.rotation.x = elapsed * 0.16;
      core.rotation.y = elapsed * 0.11;

      /* Blueprint mengambang lebih lambat dari scroll: kedalaman murah
         tanpa satu ScrollTrigger pun. */
      blueprint.position.y = window.scrollY * 0.0016;

      camera.position.x += (pointerX * 1.4 - camera.position.x) * 0.04;
      camera.position.y += (-pointerY * 0.9 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    });

    return () => {
      renderer.setAnimationLoop(null);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      disposables.forEach((resource) => resource.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={hostRef} className="v3-blueprint" aria-hidden="true" />;
}
