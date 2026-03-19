import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// ─── Constants ───────────────────────────────────────────────────────────────
const TUNNEL_DEPTH   = 2000;   // how far ahead stars are spawned
const STAR_COUNT     = 6000;   // total stars in tunnel
const NEBULA_COUNT   = 3000;
const BASE_SPEED     = 1.2;    // units per frame at rest
const SECTORS = ['α-001', 'β-042', 'γ-117', 'δ-203', 'ε-089', 'ζ-451', 'η-072', 'θ-318'];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function randRange(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function starColor(): [number, number, number] {
  const type = Math.random();
  if (type < 0.05) return [0.6,  0.7,  1.0];  // blue-white (O/B)
  if (type < 0.25) return [0.85, 0.9,  1.0];  // white-blue (A)
  if (type < 0.5)  return [1.0,  0.98, 0.9];  // white (F/G)
  if (type < 0.75) return [1.0,  0.85, 0.6];  // orange (K)
  return               [1.0,  0.65, 0.4];      // red (M)
}

// ─── Build tunnel star field ──────────────────────────────────────────────────
function buildStarField(scene: THREE.Scene) {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(STAR_COUNT * 3);
  const col = new Float32Array(STAR_COUNT * 3);
  const siz = new Float32Array(STAR_COUNT);

  for (let i = 0; i < STAR_COUNT; i++) {
    pos[i * 3]     = randRange(-600, 600);
    pos[i * 3 + 1] = randRange(-350, 350);
    pos[i * 3 + 2] = randRange(-TUNNEL_DEPTH, 10);
    const [r, g, b] = starColor();
    col[i * 3] = r; col[i * 3 + 1] = g; col[i * 3 + 2] = b;
    siz[i] = randRange(1.0, 4.0);
  }

  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));
  geo.setAttribute('size',     new THREE.BufferAttribute(siz, 1));

  const mat = new THREE.ShaderMaterial({
    uniforms: { opacity: { value: 1.0 } },
    vertexShader: `
      attribute float size;
      attribute vec3 color;
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        vColor = color;
        vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
        float dist = length(mvPos.xyz);
        vAlpha = clamp(1.0 - dist / ${TUNNEL_DEPTH}.0, 0.1, 1.0);
        gl_PointSize = size * (300.0 / -mvPos.z);
        gl_PointSize = clamp(gl_PointSize, 0.5, 8.0);
        gl_Position = projectionMatrix * mvPos;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        float d = length(gl_PointCoord - vec2(0.5));
        if (d > 0.5) discard;
        float alpha = (1.0 - d * 2.0) * vAlpha;
        gl_FragColor = vec4(vColor, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geo, mat);
  scene.add(points);
  return points;
}

// ─── Build distant background star dome (static) ─────────────────────────────
function buildStarDome(scene: THREE.Scene) {
  const BG_COUNT = 12000;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(BG_COUNT * 3);
  const col = new Float32Array(BG_COUNT * 3);

  for (let i = 0; i < BG_COUNT; i++) {
    // Random point on sphere surface at large radius
    const phi   = Math.acos(2 * Math.random() - 1);
    const theta = Math.random() * Math.PI * 2;
    const r     = 8000 + Math.random() * 4000;
    pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pos[i * 3 + 2] = r * Math.cos(phi);
    const [rv, gv, bv] = starColor();
    const bright = 0.4 + Math.random() * 0.6;
    col[i * 3] = rv * bright; col[i * 3 + 1] = gv * bright; col[i * 3 + 2] = bv * bright;
  }

  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));

  const mat = new THREE.PointsMaterial({
    size: 1.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    sizeAttenuation: false,  // fixed screen size — always visible
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const dome = new THREE.Points(geo, mat);
  scene.add(dome);
  return dome;
}

// ─── Nebula cloud ─────────────────────────────────────────────────────────────
function buildNebula(scene: THREE.Scene) {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(NEBULA_COUNT * 3);
  const col = new Float32Array(NEBULA_COUNT * 3);

  const clouds = [
    { x: 200, y: 80,  z: -400, r: 0.3, g: 0.5, b: 1.0 },
    { x: -300, y: -60, z: -800, r: 1.0, g: 0.2, b: 0.5 },
    { x: 100, y: 150, z: -1200, r: 0.4, g: 1.0, b: 0.7 },
    { x: -200, y: 60, z: -600, r: 0.7, g: 0.3, b: 1.0 },
  ];

  let idx = 0;
  clouds.forEach(c => {
    const perCloud = NEBULA_COUNT / clouds.length;
    for (let i = 0; i < perCloud && idx < NEBULA_COUNT; i++, idx++) {
      pos[idx * 3]     = c.x + randRange(-120, 120);
      pos[idx * 3 + 1] = c.y + randRange(-60, 60);
      pos[idx * 3 + 2] = c.z + randRange(-80, 80);
      const bright = 0.4 + Math.random() * 0.4;
      col[idx * 3] = c.r * bright; col[idx * 3 + 1] = c.g * bright; col[idx * 3 + 2] = c.b * bright;
    }
  });

  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));

  const mat = new THREE.PointsMaterial({
    size: 6,
    vertexColors: true,
    transparent: true,
    opacity: 0.12,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const cloud = new THREE.Points(geo, mat);
  scene.add(cloud);
  return cloud;
}

// ─── Planet ───────────────────────────────────────────────────────────────────
function buildPlanet(
  scene: THREE.Scene,
  x: number, y: number, z: number,
  radius: number,
  color: number,
  glowColor: number,
  hasRings = false
): THREE.Group {
  const group = new THREE.Group();
  group.position.set(x, y, z);

  // Planet body
  const geo = new THREE.SphereGeometry(radius, 48, 48);

  // Simple procedural texture via canvas
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  const baseCol = new THREE.Color(color);
  ctx.fillStyle = `rgb(${Math.round(baseCol.r*255)},${Math.round(baseCol.g*255)},${Math.round(baseCol.b*255)})`;
  ctx.fillRect(0, 0, 256, 256);
  // Add some noise blobs
  for (let i = 0; i < 40; i++) {
    const r = Math.random() * 255, g = Math.random() * 255, b2 = Math.random() * 255;
    ctx.fillStyle = `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b2)},0.3)`;
    ctx.beginPath();
    ctx.arc(Math.random()*256, Math.random()*256, Math.random()*40+10, 0, Math.PI*2);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(canvas);

  const mat = new THREE.MeshPhongMaterial({ map: tex, shininess: 25 });
  group.add(new THREE.Mesh(geo, mat));

  // Atmosphere glow
  const glowC = new THREE.Color(glowColor);
  [1.08, 1.18, 1.30].forEach((scale, i) => {
    const atmGeo = new THREE.SphereGeometry(radius * scale, 24, 24);
    const atmMat = new THREE.MeshBasicMaterial({
      color: glowC,
      transparent: true,
      opacity: [0.15, 0.08, 0.04][i],
      side: THREE.BackSide,
    });
    group.add(new THREE.Mesh(atmGeo, atmMat));
  });

  // Rings
  if (hasRings) {
    const ringGeo = new THREE.RingGeometry(radius * 1.5, radius * 2.6, 80);
    const ringMat = new THREE.MeshBasicMaterial({
      color: glowC,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 3.5;
    group.add(ring);
  }

  scene.add(group);
  return group;
}

// ─── Warp streaks ─────────────────────────────────────────────────────────────
function buildWarpStreaks(scene: THREE.Scene) {
  const COUNT = 150;
  const positions = new Float32Array(COUNT * 6);

  for (let i = 0; i < COUNT; i++) {
    const x = randRange(-400, 400);
    const y = randRange(-250, 250);
    const z = randRange(-200, -10);
    positions[i*6]   = x; positions[i*6+1] = y; positions[i*6+2] = z;
    positions[i*6+3] = x; positions[i*6+4] = y; positions[i*6+5] = z - 20;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const mat = new THREE.LineBasicMaterial({
    color: 0x88eeff,
    transparent: true,
    opacity: 0,
  });

  const streaks = new THREE.LineSegments(geo, mat);
  scene.add(streaks);
  return streaks;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function SpaceEngine() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // ── Renderer ──
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // ── Scene ──
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x010309);
    scene.fog = new THREE.FogExp2(0x010309, 0.00008);

    // ── Camera ──
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 20000);
    camera.position.set(0, 0, 0);

    // ── Lights ──
    scene.add(new THREE.AmbientLight(0x334466, 1.0));
    const sun = new THREE.DirectionalLight(0xffffff, 1.5);
    sun.position.set(5, 8, 3);
    scene.add(sun);

    // ── Objects ──
    const tunnelStars = buildStarField(scene);
    const starDome    = buildStarDome(scene);
    buildNebula(scene);

    // Planets along path
    const planets = [
      buildPlanet(scene,  180, 30,  -350, 14, 0x2244aa, 0x4488ff),
      buildPlanet(scene, -240, -20, -700, 22, 0xcc7722, 0xff9944, false),
      buildPlanet(scene,  260, -60, -950, 18, 0x44aacc, 0x66ddff, true),
      buildPlanet(scene, -200, 80, -1400, 12, 0xaa3322, 0xff4422),
      buildPlanet(scene,  300,  0,  -1700, 26, 0x8833bb, 0xcc66ff, true),
    ];

    const warpStreaks = buildWarpStreaks(scene);

    // ── State ──
    let cameraZ    = 0;
    let speed      = BASE_SPEED;
    let mouseX     = 0;
    let mouseY     = 0;
    let scrollY    = 0;
    let elapsed    = 0;
    let frameIdx   = 0;
    let lastTime   = performance.now();

    // ── Event Listeners ──
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const onScroll = () => { scrollY = window.scrollY; };
    const onTouch  = (e: TouchEvent) => {
      if (!e.touches.length) return;
      mouseX = (e.touches[0].clientX / window.innerWidth  - 0.5) * 2;
      mouseY = (e.touches[0].clientY / window.innerHeight - 0.5) * 2;
    };
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll',    onScroll,    { passive: true });
    window.addEventListener('touchmove', onTouch,     { passive: true });
    window.addEventListener('resize',    onResize);

    // ── Animation ──
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const now   = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.05); // cap at 50ms
      lastTime    = now;
      elapsed    += delta;
      frameIdx++;

      // Speed: base + scroll boost
      const scrollBoost = (scrollY / Math.max(document.body.scrollHeight - window.innerHeight, 1)) * 4;
      const targetSpeed = BASE_SPEED + scrollBoost;
      speed += (targetSpeed - speed) * 0.06;

      // Move camera forward (into -Z)
      cameraZ -= speed * delta * 60;

      // Recycle tunnel stars that have passed behind camera
      const posArr = tunnelStars.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < STAR_COUNT; i++) {
        if (posArr[i * 3 + 2] > cameraZ + 20) {
          posArr[i * 3]     = randRange(-600, 600);
          posArr[i * 3 + 1] = randRange(-350, 350);
          posArr[i * 3 + 2] = cameraZ - TUNNEL_DEPTH + randRange(-50, 50);
        }
      }
      tunnelStars.geometry.attributes.position.needsUpdate = true;
      tunnelStars.position.z = 0; // positions are in world space

      // Star dome rotates slowly with camera parallax
      starDome.rotation.y = elapsed * 0.003;
      starDome.position.copy(camera.position); // always centered on camera

      // Camera motion: forward + mouse parallax + organic drift
      camera.position.z = cameraZ;
      camera.position.x += (-mouseX * 12 - camera.position.x) * 0.02;
      camera.position.y += ( mouseY * 6  - camera.position.y) * 0.02;
      camera.position.x += Math.sin(elapsed * 0.07) * 0.3;
      camera.position.y += Math.cos(elapsed * 0.11) * 0.15;

      // Camera look-ahead tilt
      camera.rotation.y += (-mouseX * 0.05 - camera.rotation.y) * 0.04;
      camera.rotation.x += ( mouseY * 0.03 - camera.rotation.x) * 0.04;

      // Rotate planets
      planets.forEach((p, i) => {
        if (p.children[0]) p.children[0].rotation.y += 0.001 * (i % 2 === 0 ? 1 : -1);
      });

      // Warp streaks appear at high speed
      const warpMat = warpStreaks.material as THREE.LineBasicMaterial;
      const warpTarget = speed > 2 ? Math.min((speed - 2) * 0.4, 0.85) : 0;
      warpMat.opacity += (warpTarget - warpMat.opacity) * 0.08;
      warpStreaks.position.copy(camera.position);

      if (speed > 2) {
        const warpPos = warpStreaks.geometry.attributes.position.array as Float32Array;
        const streakLen = speed * 8;
        for (let i = 0; i < 150; i++) {
          warpPos[i * 6 + 5] = warpPos[i * 6 + 2] - streakLen;
        }
        warpStreaks.geometry.attributes.position.needsUpdate = true;
      }

      // Sector + HUD
      const sector = SECTORS[Math.floor(Math.abs(cameraZ) / 1200) % SECTORS.length];
      window.dispatchEvent(new CustomEvent('spaceHUD', {
        detail: { speed: speed / BASE_SPEED, sector }
      }));

      renderer.render(scene, camera);
    };

    animate();

    // ── Cleanup ──
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll',    onScroll);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('resize',    onResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    />
  );
}
