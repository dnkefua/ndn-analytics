import { useRef, useEffect, useState, useCallback, useLayoutEffect } from 'react';
import * as THREE from 'three';
import logoSrc from '../../assets/ndnanalytics logo.jpg';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useLayoutEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}

export default function Logo3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const reducedMotion = useReducedMotion();
  const [inView, setInView] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const initThree = useCallback(() => {
    const el = mountRef.current;
    if (!el || !inView) return;

    const SIZE = isMobile ? 200 : 160;
    const camZ = isMobile ? 3.6 : 4.2;
    const geomScale = isMobile ? 3.2 : 2.7;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(SIZE, SIZE);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.z = camZ;

    const textureLoader = new THREE.TextureLoader();
    const tryOptimized = () => {
      try {
        const parts = (logoSrc as string).split('/');
        const filename = parts[parts.length - 1];
        const name = filename.replace(/\.[^.]+$/, '');
        return `/optimized/${encodeURIComponent(name)}.webp`;
      } catch (e) {
        return null;
      }
    };

    const optimized = tryOptimized();
    let texture: THREE.Texture | null = null;
    if (optimized) {
      textureLoader.load(optimized,
        t => { texture = t; texture.colorSpace = THREE.SRGBColorSpace; },
        undefined,
        () => {
          // fallback to original if optimized not found
          textureLoader.load(logoSrc, t => { texture = t; texture.colorSpace = THREE.SRGBColorSpace; });
        }
      );
    } else {
      texture = textureLoader.load(logoSrc);
      texture.colorSpace = THREE.SRGBColorSpace;
    }

    const mat = new THREE.ShaderMaterial({
      uniforms: { map: { value: texture } },
      transparent: true,
      depthWrite:  false,
      blending: THREE.NormalBlending,
      side: THREE.DoubleSide,
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D map;
        varying vec2 vUv;
        void main() {
          vec4 col = texture2D(map, vUv);
          float lum = dot(col.rgb, vec3(0.299, 0.587, 0.114));
          float alpha = step(lum, 0.93);
          if (alpha < 0.5) discard;
          gl_FragColor = vec4(col.rgb, 1.0);
        }
      `,
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(geomScale, geomScale), mat);
    scene.add(mesh);

    const clock = new THREE.Clock();
    let raf: number;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      if (reducedMotion) {
        mesh.rotation.y = 0;
        mesh.rotation.x = 0;
        mesh.rotation.z = 0;
        mesh.position.y = 0;
      } else {
        mesh.rotation.y = Math.sin(t * 0.55) * 0.50;
        mesh.rotation.x = Math.sin(t * 0.37) * 0.14;
        mesh.rotation.z = Math.sin(t * 0.22) * 0.04;
        mesh.position.y = Math.sin(t * 0.9) * 0.07;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      mat.dispose();
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, [isMobile, inView, reducedMotion]);

  useEffect(() => {
    const cleanup = initThree();
    return () => { cleanup?.(); };
  }, [initThree]);

  return (
    <div
      ref={sentinelRef}
      style={{
        width: isMobile ? 200 : 160,
        height: isMobile ? 200 : 160,
        flexShrink: 0,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <div
        ref={mountRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />
    </div>
  );
}
