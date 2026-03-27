import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import logoSrc from '../../assets/ndnanalytics logo.jpg';

/**
 * NDN Logo — Three.js plane with white-background removal and clear 3D tilt.
 *
 * White removal: hard luminance threshold (no smoothstep fringe) + NormalBlending
 * so there is no glowing fringe or "mercury wire" effect.
 * 3D effect: prominent ±28° Y-axis oscillation that is unmistakably 3D.
 */
export default function Logo3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const SIZE = 160;

    // ── Renderer ─────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(SIZE, SIZE);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);          // fully transparent background
    el.appendChild(renderer.domElement);

    // ── Scene / Camera ────────────────────────────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.z = 4.2;

    // ── Logo texture ──────────────────────────────────────────────────────────
    const texture = new THREE.TextureLoader().load(logoSrc);
    texture.colorSpace = THREE.SRGBColorSpace;

    // ── Shader — hard white removal, NormalBlending (no glowing fringe) ───────
    const mat = new THREE.ShaderMaterial({
      uniforms: { map: { value: texture } },
      transparent: true,
      depthWrite:  false,
      // NormalBlending keeps semi-transparent pixels from glowing
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
          // Luminance-based white removal — very tight range avoids fringe glow
          float lum = dot(col.rgb, vec3(0.299, 0.587, 0.114));
          // step: pixel is either fully opaque or fully gone — no gradual fade
          float alpha = step(lum, 0.93);
          if (alpha < 0.5) discard;
          gl_FragColor = vec4(col.rgb, 1.0);
        }
      `,
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2.7, 2.7), mat);
    scene.add(mesh);

    // ── Animation ─────────────────────────────────────────────────────────────
    const clock = new THREE.Clock();
    let raf: number;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Y: prominent ±28° tilt — clearly visible 3D rotation
      mesh.rotation.y = Math.sin(t * 0.55) * 0.50;
      // X: subtle ±8° nod for extra dimension
      mesh.rotation.x = Math.sin(t * 0.37) * 0.14;
      // Z: very slight roll
      mesh.rotation.z = Math.sin(t * 0.22) * 0.04;
      // Float gently
      mesh.position.y = Math.sin(t * 0.9) * 0.07;

      renderer.render(scene, camera);
    };
    animate();

    // ── Cleanup ───────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(raf);
      mat.dispose();
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: 160,
        height: 160,
        flexShrink: 0,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    />
  );
}
