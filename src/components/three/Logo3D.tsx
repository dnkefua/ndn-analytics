import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * NDN Logo Mark — a glowing hexagonal crystal prism.
 * Flat-shaded dark faces + bright cyan edge wireframe + inner pulse light.
 * Tilts toward mouse cursor on hover, particle scatter on close approach.
 */
export default function Logo3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const W = 100, H = 100;

    // ── Renderer ──────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // ── Scene / Camera ────────────────────────────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);
    camera.position.z = 7.5;

    // ── Lighting ──────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x112233, 0.8));

    const keyLight = new THREE.DirectionalLight(0x06B6D4, 2.0);
    keyLight.position.set(3, 5, 6);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x7C3AED, 1.2);
    rimLight.position.set(-4, -2, 2);
    scene.add(rimLight);

    // ── Build hexagonal prism ─────────────────────────────────────────────────
    // Use toNonIndexed so every face gets its own vertices → true flat shading
    const prismGeoBase = new THREE.CylinderGeometry(1.3, 1.3, 2.6, 6, 1);
    const prismGeo     = prismGeoBase.toNonIndexed();
    prismGeo.computeVertexNormals();

    // Per-face color tint (8 groups: 1 top cap + 6 sides + 1 bottom cap)
    const faceColors = [
      new THREE.Color(0x0a2540), // top cap
      new THREE.Color(0x062030), // side 1
      new THREE.Color(0x082535), // side 2
      new THREE.Color(0x041828), // side 3
      new THREE.Color(0x0a2030), // side 4
      new THREE.Color(0x062535), // side 5
      new THREE.Color(0x082030), // side 6
      new THREE.Color(0x041825), // bottom cap
    ];

    // Assign vertex colors per face triangle
    const posCount  = prismGeo.attributes.position.count;
    const colBuffer = new Float32Array(posCount * 3);
    // CylinderGeometry toNonIndexed triangle layout: top cap first, then sides, then bottom cap
    for (let i = 0; i < posCount; i++) {
      const faceIndex = Math.floor(i / 3);
      // rough group assignment (6 top tris, 12 side tris, 6 bottom tris)
      let colorIdx = 0;
      if      (faceIndex < 6)        colorIdx = 0; // top cap
      else if (faceIndex < 18) colorIdx = 1 + ((faceIndex - 6) % 6); // sides
      else                           colorIdx = 7; // bottom cap
      const c = faceColors[colorIdx];
      colBuffer[i*3]   = c.r;
      colBuffer[i*3+1] = c.g;
      colBuffer[i*3+2] = c.b;
    }
    prismGeo.setAttribute('color', new THREE.BufferAttribute(colBuffer, 3));

    const prismMat = new THREE.MeshPhongMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.82,
      flatShading: true,
      shininess: 140,
      specular: new THREE.Color(0x06B6D4),
    });

    const prism = new THREE.Mesh(prismGeo, prismMat);

    // ── Edge wireframe ────────────────────────────────────────────────────────
    const edgesGeo = new THREE.EdgesGeometry(new THREE.CylinderGeometry(1.3, 1.3, 2.6, 6, 1));
    const edgesMat = new THREE.LineBasicMaterial({
      color: 0x06B6D4,
      transparent: true,
      opacity: 0.95,
    });
    const edges = new THREE.LineSegments(edgesGeo, edgesMat);

    // ── Outer wireframe cage (slightly bigger, secondary color) ───────────────
    const outerGeo = new THREE.EdgesGeometry(new THREE.CylinderGeometry(1.52, 1.52, 2.85, 6, 1));
    const outerMat = new THREE.LineBasicMaterial({
      color: 0x4F46E5,
      transparent: true,
      opacity: 0.35,
    });
    const outerCage = new THREE.LineSegments(outerGeo, outerMat);

    // ── Inner glow point light ────────────────────────────────────────────────
    const innerLight = new THREE.PointLight(0x06B6D4, 2.5, 6);
    prism.add(innerLight);

    // ── Group ─────────────────────────────────────────────────────────────────
    const group = new THREE.Group();
    group.add(prism, edges, outerCage);
    // Tilt slightly for visual interest
    group.rotation.z = 0.15;
    scene.add(group);

    // ── Particle pool ─────────────────────────────────────────────────────────
    const particles: { mesh: THREE.Mesh; vel: THREE.Vector3; life: number }[] = [];
    const pGeo = new THREE.SphereGeometry(0.05, 4, 4);

    // ── State ─────────────────────────────────────────────────────────────────
    let elapsed     = 0;
    let nearMouse   = false;
    let targetRotX  = 0;
    let targetRotY  = 0;
    let edgeTarget  = 0.95;
    let lightTarget = 2.5;

    // ── Mouse interaction ─────────────────────────────────────────────────────
    const onMouseMove = (e: MouseEvent) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = e.clientX - cx;
      const dy   = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 180) {
        nearMouse   = true;
        targetRotY  =  (dx / 180) * 0.9;
        targetRotX  = -(dy / 180) * 0.6;
        edgeTarget  = 1.0;
        lightTarget = 4.5;

        // Scatter particles
        if (Math.random() < 0.25 && particles.length < 20) {
          const pMat = new THREE.MeshBasicMaterial({
            color: Math.random() > 0.5 ? 0x06B6D4 : 0x7C3AED,
            transparent: true,
            opacity: 1.0,
          });
          const pm = new THREE.Mesh(pGeo, pMat);
          const angle = Math.random() * Math.PI * 2;
          const r = 1.2 + Math.random() * 0.6;
          pm.position.set(
            Math.cos(angle) * r,
            (Math.random() - 0.5) * 2.6,
            Math.sin(angle) * r * 0.5
          );
          scene.add(pm);
          particles.push({
            mesh: pm,
            vel: new THREE.Vector3(
              (Math.random() - 0.5) * 0.12,
              (Math.random() - 0.5) * 0.12,
              (Math.random() - 0.5) * 0.06,
            ),
            life: 1.0,
          });
        }
      } else {
        nearMouse   = false;
        targetRotX  = 0;
        targetRotY  = 0;
        edgeTarget  = 0.95;
        lightTarget = 2.5;
      }
    };

    window.addEventListener('mousemove', onMouseMove);

    // ── Animation loop ────────────────────────────────────────────────────────
    let animId: number;
    let lastTime = performance.now();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const now = performance.now();
      const dt  = Math.min((now - lastTime) / 1000, 0.05);
      lastTime  = now;
      elapsed  += dt;

      // Continuous Y-axis spin (slow, ~12s per revolution)
      const baseRotY = elapsed * (Math.PI * 2 / 12);

      if (nearMouse) {
        group.rotation.y += (targetRotY - group.rotation.y) * 0.1;
        group.rotation.x += (targetRotX - group.rotation.x) * 0.1;
      } else {
        group.rotation.y = baseRotY;
        group.rotation.x += (Math.sin(elapsed * 0.4) * 0.08 - group.rotation.x) * 0.05;
      }

      // Breathing scale
      const breathe = 1 + Math.sin(elapsed * 1.3) * 0.025;
      group.scale.setScalar(breathe);

      // Edge glow pulse (outer cage opacity pulses with breathe)
      edgesMat.opacity  += (edgeTarget - edgesMat.opacity)  * 0.08;
      outerMat.opacity   = 0.25 + Math.sin(elapsed * 2.2) * 0.12;
      innerLight.intensity += (lightTarget - innerLight.intensity) * 0.07;

      // Inner light color oscillates cyan ↔ blue
      const t = (Math.sin(elapsed * 0.9) + 1) / 2;
      innerLight.color.setRGB(0.06 + t * 0.25, 0.72 - t * 0.4, 0.83 + t * 0.17);

      // Outer cage rotation slightly behind main group
      outerCage.rotation.y = baseRotY * 0.7 + 0.4;

      // Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.mesh.position.add(p.vel);
        p.life -= dt * 2.0;
        (p.mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, p.life);
        if (p.life <= 0) {
          scene.remove(p.mesh);
          particles.splice(i, 1);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // ── Cleanup ───────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      particles.forEach(p => scene.remove(p.mesh));
      prismGeo.dispose();
      prismMat.dispose();
      edgesGeo.dispose();
      edgesMat.dispose();
      outerGeo.dispose();
      outerMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{ width: 100, height: 100, display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
    />
  );
}
