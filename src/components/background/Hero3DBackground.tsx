import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './Hero3DBackground.css';

/**
 * Hero3DBackground
 * A WebGL scene used behind the glassmorphic hero.
 *  - Floating low-poly wireframe geometry (icosahedron, torus knot, octahedron) in the brand palette
 *  - Soft additive point sprites drifting through space
 *  - Camera parallax driven by pointer + scroll
 *  - Respects prefers-reduced-motion and devicePixelRatio caps
 */
export default function Hero3DBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const coarsePointer =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(max-width: 768px), (hover: none), (pointer: coarse)').matches;

    if (coarsePointer) return;

    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // === Renderer ===
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // === Scene + Camera ===
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020b18, 0.05);

    const camera = new THREE.PerspectiveCamera(
      55,
      mount.clientWidth / mount.clientHeight,
      0.1,
      200
    );
    camera.position.set(0, 0, 14);

    // === Lights ===
    const ambient = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambient);

    const cyanLight = new THREE.PointLight(0x06b6d4, 2.4, 60);
    cyanLight.position.set(-8, 6, 10);
    scene.add(cyanLight);

    const violetLight = new THREE.PointLight(0x8b5cf6, 2.2, 60);
    violetLight.position.set(9, -5, 6);
    scene.add(violetLight);

    const blueLight = new THREE.PointLight(0x3b82f6, 1.8, 80);
    blueLight.position.set(0, 8, -12);
    scene.add(blueLight);

    // === Floating wireframe geometry ===
    const shapes: THREE.LineSegments[] = [];

    const makeWireframe = (
      geom: THREE.BufferGeometry,
      color: number,
      pos: [number, number, number],
      scale = 1
    ) => {
      const edges = new THREE.EdgesGeometry(geom);
      const mat = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.55,
      });
      const mesh = new THREE.LineSegments(edges, mat);
      mesh.position.set(...pos);
      mesh.scale.setScalar(scale);
      scene.add(mesh);
      shapes.push(mesh);
      return mesh;
    };

    makeWireframe(new THREE.IcosahedronGeometry(2.2, 0), 0x06b6d4, [-6.5, 1.4, -2], 1);
    makeWireframe(new THREE.TorusKnotGeometry(1.4, 0.45, 80, 10), 0x8b5cf6, [6.4, -1.8, -1], 1);
    makeWireframe(new THREE.OctahedronGeometry(1.5, 0), 0x3b82f6, [0.4, 2.6, -4], 1.1);
    makeWireframe(new THREE.IcosahedronGeometry(1.0, 0), 0x67e8f9, [4.0, 3.2, -6], 0.9);
    makeWireframe(new THREE.DodecahedronGeometry(1.2, 0), 0x93c5fd, [-3.5, -2.6, -3], 1);

    // === Solid glowing core inside icosahedron (subtle) ===
    const coreGeom = new THREE.IcosahedronGeometry(0.9, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x0891b2,
      emissiveIntensity: 0.5,
      metalness: 0.6,
      roughness: 0.2,
      transparent: true,
      opacity: 0.25,
    });
    const core = new THREE.Mesh(coreGeom, coreMat);
    core.position.set(-6.5, 1.4, -2);
    scene.add(core);

    // === Particle field ===
    const PARTICLES = reducedMotion ? 0 : 900;
    const positions = new Float32Array(PARTICLES * 3);
    const colors = new Float32Array(PARTICLES * 3);
    const palette = [
      new THREE.Color(0x06b6d4),
      new THREE.Color(0x3b82f6),
      new THREE.Color(0x8b5cf6),
      new THREE.Color(0x67e8f9),
    ];
    for (let i = 0; i < PARTICLES; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40 - 8;
      const c = palette[i % palette.length];
      colors[i * 3]     = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.06,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // === Pointer parallax ===
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointerMove = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onPointerMove);

    // === Resize ===
    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    // === Animation loop ===
    let frame = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      const t = clock.getElapsedTime();
      const dt = clock.getDelta();

      // smooth pointer
      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;
      camera.position.x = pointer.x * 1.4;
      camera.position.y = pointer.y * 0.9;
      camera.lookAt(0, 0, 0);

      // rotate shapes
      shapes.forEach((s, i) => {
        const speed = reducedMotion ? 0 : 0.15 + i * 0.04;
        s.rotation.x += dt * speed;
        s.rotation.y += dt * speed * 0.8;
        s.position.y += Math.sin(t * 0.6 + i) * 0.0025;
      });

      // pulse core
      const pulse = 1 + Math.sin(t * 1.4) * 0.08;
      core.scale.setScalar(pulse);
      coreMat.emissiveIntensity = 0.4 + Math.sin(t * 1.6) * 0.25;

      // drift particles
      if (PARTICLES) {
        particles.rotation.y += dt * 0.02;
        const pos = particleGeo.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < PARTICLES; i++) {
          const idx = i * 3 + 1;
          pos.array[idx] += Math.sin(t * 0.4 + i * 0.05) * 0.0015;
        }
        pos.needsUpdate = true;
      }

      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      shapes.forEach(s => {
        s.geometry.dispose();
        (s.material as THREE.Material).dispose();
      });
      coreGeom.dispose();
      coreMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
      if (mount && renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="hero-3d-bg" aria-hidden="true">
      <div ref={mountRef} className="hero-3d-bg__canvas" />
      <div className="hero-3d-bg__vignette" />
      <div className="hero-3d-bg__grain" />
    </div>
  );
}
