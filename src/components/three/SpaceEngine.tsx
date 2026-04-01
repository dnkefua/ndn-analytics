import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const rand = (min: number, max: number) => min + Math.random() * (max - min);

function starColor(): THREE.Color {
  const t = Math.random();
  if (t < 0.04) return new THREE.Color(0.55, 0.70, 1.00);  // O/B  blue-white
  if (t < 0.18) return new THREE.Color(0.80, 0.88, 1.00);  // A    white-blue
  if (t < 0.45) return new THREE.Color(1.00, 0.97, 0.88);  // F/G  warm white
  if (t < 0.72) return new THREE.Color(1.00, 0.82, 0.55);  // K    orange
  return              new THREE.Color(1.00, 0.60, 0.35);   // M    red-orange
}

// ─── Star dome — 18 000 twinkling background stars ────────────────────────────
function buildStarDome(scene: THREE.Scene): THREE.Points {
  const N = 18_000;
  const pos = new Float32Array(N * 3);
  const col = new Float32Array(N * 3);
  const siz = new Float32Array(N);
  const phase = new Float32Array(N);

  for (let i = 0; i < N; i++) {
    const phi   = Math.acos(2 * Math.random() - 1);
    const theta = Math.random() * Math.PI * 2;
    const r     = 9000 + Math.random() * 3000;
    pos[i*3]   = r * Math.sin(phi) * Math.cos(theta);
    pos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
    pos[i*3+2] = r * Math.cos(phi);
    const c = starColor();
    const br = 0.45 + Math.random() * 0.55;
    col[i*3] = c.r*br; col[i*3+1] = c.g*br; col[i*3+2] = c.b*br;
    siz[i]   = 0.8 + Math.random() * 2.8;
    phase[i] = Math.random() * Math.PI * 2;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));
  geo.setAttribute('aSize',    new THREE.BufferAttribute(siz, 1));
  geo.setAttribute('aPhase',   new THREE.BufferAttribute(phase, 1));

  const mat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: /* glsl */ `
      attribute float aSize;
      attribute float aPhase;
      attribute vec3  color;
      varying   vec3  vColor;
      uniform   float uTime;
      void main() {
        vColor = color * (0.75 + 0.25 * sin(uTime * 1.4 + aPhase));
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = aSize;
        gl_Position  = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      varying vec3 vColor;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        if (d > 0.5) discard;
        float a = 1.0 - smoothstep(0.0, 0.5, d);
        gl_FragColor = vec4(vColor, a);
      }
    `,
    transparent: true,
    depthWrite:  false,
    blending:    THREE.AdditiveBlending,
  });

  const dome = new THREE.Points(geo, mat);
  scene.add(dome);
  return dome;
}

// ─── Foreground travel stars — recycled as camera moves ───────────────────────
const TRAVEL_COUNT  = 7_000;
const SPAWN_RADIUS  = 550;
const SPAWN_DEPTH   = 3000;

function buildTravelStars(scene: THREE.Scene): THREE.Points {
  const pos = new Float32Array(TRAVEL_COUNT * 3);
  const col = new Float32Array(TRAVEL_COUNT * 3);
  const siz = new Float32Array(TRAVEL_COUNT);

  for (let i = 0; i < TRAVEL_COUNT; i++) {
    pos[i*3]   = rand(-SPAWN_RADIUS, SPAWN_RADIUS);
    pos[i*3+1] = rand(-SPAWN_RADIUS * 0.6, SPAWN_RADIUS * 0.6);
    pos[i*3+2] = rand(-SPAWN_DEPTH, 0);
    const c = starColor();
    col[i*3] = c.r; col[i*3+1] = c.g; col[i*3+2] = c.b;
    siz[i] = rand(1.0, 3.8);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));
  geo.setAttribute('aSize',    new THREE.BufferAttribute(siz, 1));

  const mat = new THREE.ShaderMaterial({
    uniforms: { uSpeed: { value: 1.0 } },
    vertexShader: /* glsl */ `
      attribute float aSize;
      attribute vec3  color;
      uniform   float uSpeed;
      varying   vec3  vColor;
      varying   float vAlpha;
      void main() {
        vColor  = color;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        float dist = -mv.z;
        vAlpha  = clamp(0.2 + 0.8 * (1.0 - dist / 3000.0), 0.05, 1.0);
        float sz = aSize * (280.0 / max(dist, 1.0));
        sz *= (1.0 + uSpeed * 0.5);
        gl_PointSize = clamp(sz, 0.4, 10.0);
        gl_Position  = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      varying vec3  vColor;
      varying float vAlpha;
      uniform float uSpeed;
      void main() {
        vec2  uv = gl_PointCoord - 0.5;
        // Elongate along Y at high speed for streak effect
        float stretch = 1.0 + uSpeed * 2.0;
        uv.y *= stretch;
        float d = length(uv);
        if (d > 0.5) discard;
        float a = (1.0 - d * 2.0) * vAlpha;
        gl_FragColor = vec4(vColor, a);
      }
    `,
    transparent: true,
    depthWrite:  false,
    blending:    THREE.AdditiveBlending,
  });

  const pts = new THREE.Points(geo, mat);
  pts.frustumCulled = false;
  scene.add(pts);
  return pts;
}

// ─── Nebula / gas cloud ───────────────────────────────────────────────────────
function buildNebula(scene: THREE.Scene) {
  const clouds = [
    { pos: [500, 120, -800],  col: [0.25, 0.45, 1.0],  spread: 200 },
    { pos: [-600, -80, -1500], col: [1.0,  0.18, 0.4],  spread: 280 },
    { pos: [400, 200, -2200], col: [0.35, 1.0,  0.55], spread: 220 },
    { pos: [-500, 60, -3000], col: [0.6,  0.25, 1.0],  spread: 180 },
    { pos: [100, -150, -2700], col: [1.0, 0.55, 0.2],  spread: 160 },
  ];

  clouds.forEach(c => {
    const N = 600;
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = Math.random() * c.spread;
      pos[i*3]   = c.pos[0] + r * Math.sin(phi) * Math.cos(theta);
      pos[i*3+1] = c.pos[1] + r * Math.sin(phi) * Math.sin(theta) * 0.5;
      pos[i*3+2] = c.pos[2] + r * Math.cos(phi) * 0.4;
      const br = 0.3 + Math.random() * 0.5;
      col[i*3] = c.col[0]*br; col[i*3+1] = c.col[1]*br; col[i*3+2] = c.col[2]*br;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));
    const mat = new THREE.PointsMaterial({
      size: 22, vertexColors: true, transparent: true, opacity: 0.09,
      sizeAttenuation: true, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    scene.add(new THREE.Points(geo, mat));
  });
}

// ─── Planet builder ───────────────────────────────────────────────────────────
interface PlanetDef {
  x: number; y: number; z: number;
  radius: number;
  surfaceColor: number;
  glowColor: number;
  rings?: boolean;
  ringTilt?: number;
  cloudColor?: number;
  bands?: boolean;
}

function buildPlanet(scene: THREE.Scene, def: PlanetDef, sunLight: THREE.PointLight): THREE.Group {
  const group = new THREE.Group();
  group.position.set(def.x, def.y, def.z);

  const r = def.radius;

  // ── Surface texture via canvas ──
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  const base = new THREE.Color(def.surfaceColor);
  ctx.fillStyle = `rgb(${~~(base.r*255)},${~~(base.g*255)},${~~(base.b*255)})`;
  ctx.fillRect(0, 0, 512, 256);

  if (def.bands) {
    // Gas giant horizontal bands
    for (let i = 0; i < 16; i++) {
      const y = i * 16;
      const br = 0.7 + Math.random() * 0.4;
      ctx.fillStyle = `rgba(${~~(base.r*255*br)},${~~(base.g*255*br)},${~~(base.b*255*br)},0.5)`;
      ctx.fillRect(0, y, 512, 8 + Math.random() * 8);
    }
    // Storm spots
    for (let i = 0; i < 3; i++) {
      const gx = Math.random() * 512, gy = 60 + Math.random() * 136;
      const rad = 15 + Math.random() * 25;
      const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, rad);
      g.addColorStop(0, `rgba(255,200,150,0.3)`);
      g.addColorStop(1, `rgba(255,200,150,0)`);
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.ellipse(gx, gy, rad, rad*0.6, 0, 0, Math.PI*2); ctx.fill();
    }
  } else {
    // Rocky/icy craters and surface variation
    for (let i = 0; i < 60; i++) {
      const cx = Math.random() * 512, cy = Math.random() * 256;
      const cr = 3 + Math.random() * 20;
      const br = 0.5 + Math.random() * 0.6;
      ctx.fillStyle = `rgba(${~~(base.r*255*br)},${~~(base.g*255*br)},${~~(base.b*255*br)},0.4)`;
      ctx.beginPath(); ctx.arc(cx, cy, cr, 0, Math.PI*2); ctx.fill();
    }
    // Polar icecap-like white smudge
    const grad = ctx.createRadialGradient(256, 0, 0, 256, 0, 80);
    grad.addColorStop(0, 'rgba(255,255,255,0.25)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, 512, 256);
  }

  const tex = new THREE.CanvasTexture(canvas);
  const planetMat = new THREE.MeshPhongMaterial({
    map: tex,
    shininess: def.bands ? 8 : 18,
    specular: new THREE.Color(0.15, 0.15, 0.15),
  });
  const body = new THREE.Mesh(new THREE.SphereGeometry(r, 64, 64), planetMat);
  group.add(body);

  // ── Atmosphere glow layers ──
  const glow = new THREE.Color(def.glowColor);
  ([
    { scale: 1.06, opacity: 0.22 },
    { scale: 1.14, opacity: 0.10 },
    { scale: 1.26, opacity: 0.05 },
  ] as { scale: number; opacity: number }[]).forEach(({ scale, opacity }) => {
    const m = new THREE.MeshBasicMaterial({
      color: glow, transparent: true, opacity,
      side: THREE.BackSide, depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    group.add(new THREE.Mesh(new THREE.SphereGeometry(r * scale, 32, 32), m));
  });

  // ── Cloud layer ──
  if (def.cloudColor !== undefined) {
    const cloudCanvas = document.createElement('canvas');
    cloudCanvas.width = 512; cloudCanvas.height = 256;
    const cc = cloudCanvas.getContext('2d')!;
    const cloudBase = new THREE.Color(def.cloudColor);
    cc.fillStyle = 'rgba(0,0,0,0)';
    cc.fillRect(0, 0, 512, 256);
    for (let i = 0; i < 25; i++) {
      const cx = Math.random()*512, cy = Math.random()*256;
      const g2 = cc.createRadialGradient(cx, cy, 0, cx, cy, 40 + Math.random()*60);
      g2.addColorStop(0, `rgba(${~~(cloudBase.r*255)},${~~(cloudBase.g*255)},${~~(cloudBase.b*255)},0.28)`);
      g2.addColorStop(1, 'rgba(0,0,0,0)');
      cc.fillStyle = g2; cc.fillRect(cx-100, cy-100, 200, 200);
    }
    const cloudTex = new THREE.CanvasTexture(cloudCanvas);
    const cloudMat = new THREE.MeshBasicMaterial({
      map: cloudTex, transparent: true, opacity: 0.6,
      depthWrite: false, blending: THREE.NormalBlending,
    });
    const cloudMesh = new THREE.Mesh(new THREE.SphereGeometry(r * 1.015, 48, 48), cloudMat);
    group.add(cloudMesh);
  }

  // ── Rings ──
  if (def.rings) {
    const innerR = r * 1.45, outerR = r * 2.8;
    const ringCanvas = document.createElement('canvas');
    ringCanvas.width = 512; ringCanvas.height = 1;
    const rc = ringCanvas.getContext('2d')!;
    const ringGrad = rc.createLinearGradient(0, 0, 512, 0);
    const gc = new THREE.Color(def.glowColor);
    const rr = ~~(gc.r*255), rg = ~~(gc.g*255), rb = ~~(gc.b*255);
    ringGrad.addColorStop(0.00, `rgba(${rr},${rg},${rb},0)`);
    ringGrad.addColorStop(0.10, `rgba(${rr},${rg},${rb},0.55)`);
    ringGrad.addColorStop(0.35, `rgba(${rr},${rg},${rb},0.3)`);
    ringGrad.addColorStop(0.60, `rgba(${rr},${rg},${rb},0.65)`);
    ringGrad.addColorStop(0.85, `rgba(${rr},${rg},${rb},0.2)`);
    ringGrad.addColorStop(1.00, `rgba(${rr},${rg},${rb},0)`);
    rc.fillStyle = ringGrad;
    rc.fillRect(0, 0, 512, 1);
    const ringTex = new THREE.CanvasTexture(ringCanvas);

    const ringGeo = new THREE.RingGeometry(innerR, outerR, 128, 4);
    // Fix UV mapping for the ring so gradient maps correctly
    const uvAttr = ringGeo.attributes.uv;
    const posAttr = ringGeo.attributes.position;
    for (let i = 0; i < uvAttr.count; i++) {
      const px = posAttr.getX(i), py = posAttr.getY(i);
      const dist = Math.sqrt(px*px + py*py);
      uvAttr.setXY(i, (dist - innerR) / (outerR - innerR), 0.5);
    }

    const ringMat = new THREE.MeshBasicMaterial({
      map: ringTex, transparent: true, side: THREE.DoubleSide,
      depthWrite: false, blending: THREE.AdditiveBlending,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = def.ringTilt ?? Math.PI / 3.2;
    group.add(ring);
  }

  scene.add(group);

  // Add this planet's position to sunLight (re-used reference; sun illuminates all)
  void sunLight;

  return group;
}

// ─── Sun ──────────────────────────────────────────────────────────────────────
function buildSun(scene: THREE.Scene, z: number): { group: THREE.Group; light: THREE.PointLight } {
  const group = new THREE.Group();
  group.position.set(0, 0, z);

  // Core sphere
  const coreMat = new THREE.MeshBasicMaterial({ color: 0xfff8e7 });
  group.add(new THREE.Mesh(new THREE.SphereGeometry(120, 48, 48), coreMat));

  // Corona layers
  const coronaDefs = [
    { r: 130, opacity: 0.45, color: 0xffd060 },
    { r: 155, opacity: 0.22, color: 0xff9922 },
    { r: 195, opacity: 0.10, color: 0xff6600 },
    { r: 260, opacity: 0.05, color: 0xff4400 },
    { r: 380, opacity: 0.025, color: 0xff2200 },
    { r: 600, opacity: 0.01,  color: 0xff1100 },
  ];
  coronaDefs.forEach(({ r, opacity, color }) => {
    const m = new THREE.MeshBasicMaterial({
      color, transparent: true, opacity,
      side: THREE.BackSide, depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    group.add(new THREE.Mesh(new THREE.SphereGeometry(r, 32, 32), m));
  });

  scene.add(group);

  // Point light — illuminates all planets
  const light = new THREE.PointLight(0xfff5cc, 3.0, 8000, 1.4);
  light.position.set(0, 0, z);
  scene.add(light);

  return { group, light };
}

// ─── Asteroid belt ────────────────────────────────────────────────────────────
function buildAsteroidBelt(scene: THREE.Scene, z: number) {
  const N = 1200;
  const pos = new Float32Array(N * 3);
  const col = new Float32Array(N * 3);
  const siz = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist  = 220 + Math.random() * 160;
    pos[i*3]   = Math.cos(angle) * dist;
    pos[i*3+1] = rand(-18, 18);
    pos[i*3+2] = z + rand(-120, 120);
    const br = 0.3 + Math.random() * 0.4;
    col[i*3] = br*0.7; col[i*3+1] = br*0.65; col[i*3+2] = br*0.55;
    siz[i] = rand(1.5, 5.5);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));
  const mat = new THREE.PointsMaterial({
    size: 3.5, vertexColors: true, transparent: true, opacity: 0.7,
    sizeAttenuation: true, depthWrite: false,
  });
  scene.add(new THREE.Points(geo, mat));
}

// ─── Camera spline path ───────────────────────────────────────────────────────
// Waypoints thread CLOSE to each planet (approach then veer off)
function buildCameraPath(): THREE.CatmullRomCurve3 {
  const pts = [
    // Start: outer space, centered
    new THREE.Vector3(  0,    0,    0),
    // Fly toward Neptune-like — pass close on the right
    new THREE.Vector3(200,   20, -550),
    new THREE.Vector3(290,   35, -700),   // near planet 1
    new THREE.Vector3(150,   10, -850),
    // Swing to left for Uranus-like
    new THREE.Vector3(-150, -15, -1050),
    new THREE.Vector3(-320, -30, -1200),  // near planet 2
    new THREE.Vector3(-180,  -5, -1350),
    // Veer right for Saturn-like (dramatic close pass)
    new THREE.Vector3( 100,  30, -1550),
    new THREE.Vector3( 260,  55, -1700),  // near planet 3
    new THREE.Vector3( 140,  20, -1850),
    // Sweep left for Jupiter (largest — most dramatic pass)
    new THREE.Vector3(-100, -20, -2050),
    new THREE.Vector3(-330, -45, -2300),  // near planet 4
    new THREE.Vector3(-180, -15, -2500),
    // Asteroid belt — dive through center
    new THREE.Vector3(  30,   0, -2650),
    // Mars-like on the right
    new THREE.Vector3( 170,  20, -2900),  // near planet 5
    new THREE.Vector3(  80,  10, -3050),
    // Earth-like on the left
    new THREE.Vector3(-160,  15, -3200),  // near planet 6
    new THREE.Vector3( -40,   5, -3400),
    // Final approach to sun — center, head-on
    new THREE.Vector3(  30,  10, -3700),
    new THREE.Vector3(   0,   0, -4100),
  ];
  const curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.5);
  return curve;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function SpaceEngine() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // ── Renderer ──
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping      = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // ── Scene ──
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x010308);
    scene.fog = new THREE.FogExp2(0x010308, 0.000055);

    // ── Camera ──
    const camera = new THREE.PerspectiveCamera(68, window.innerWidth / window.innerHeight, 0.5, 18000);

    // ── Lights ──
    scene.add(new THREE.AmbientLight(0x223355, 0.6));

    // ── Build world ──
    const starDome    = buildStarDome(scene);
    const travelStars = buildTravelStars(scene);
    buildNebula(scene);

    // Planet definitions (outer → inner, mirroring camera path waypoints)
    const SUN_Z = -4100;
    const { group: sunGroup, light: sunLight } = buildSun(scene, SUN_Z);

    const planetDefs: PlanetDef[] = [
      // 1 — Neptune-like (ice blue)
      { x: 290,  y: 35,  z: -700, radius: 20, surfaceColor: 0x2244bb, glowColor: 0x4488ff, rings: false },
      // 2 — Uranus-like (cyan/teal, tilted rings)
      { x: -320, y: -30, z: -1200, radius: 17, surfaceColor: 0x33aacc, glowColor: 0x55ddff, rings: true, ringTilt: 1.55 },
      // 3 — Saturn-like (golden, dramatic rings)
      { x: 260,  y: 55,  z: -1700, radius: 28, surfaceColor: 0xcc9944, glowColor: 0xffdd88, rings: true, ringTilt: Math.PI/3.8, bands: true },
      // 4 — Jupiter-like (largest, orange bands)
      { x: -330, y: -45, z: -2300, radius: 42, surfaceColor: 0xcc7733, glowColor: 0xff9944, bands: true },
      // 5 — Mars-like (red, small)
      { x: 170,  y: 20,  z: -2900, radius: 11, surfaceColor: 0xaa3322, glowColor: 0xff4422 },
      // 6 — Earth-like (blue-green, cloud layer)
      { x: -160, y: 15,  z: -3200, radius: 14, surfaceColor: 0x225599, glowColor: 0x4499ff, cloudColor: 0xffffff },
    ];

    const planets = planetDefs.map(def => buildPlanet(scene, def, sunLight));

    buildAsteroidBelt(scene, -2650);

    // ── Camera path ──
    const camPath    = buildCameraPath();
    const JOURNEY_T  = 80;    // seconds for one full journey
    const PAUSE_T    = 4;     // seconds of dark fade at end before loop
    let   elapsed    = 0;
    let   mouseX     = 0;
    let   mouseY     = 0;
    let   scrollFrac = 0;
    let   lastTime   = performance.now();
    let   fading     = false;

    // Overlay div for fade effect
    const fadeDiv = document.createElement('div');
    Object.assign(fadeDiv.style, {
      position: 'absolute', inset: '0', background: '#010308',
      opacity: '0', pointerEvents: 'none', transition: 'opacity 1.2s ease',
      zIndex: '1',
    });
    container.appendChild(fadeDiv);

    // ── Events ──
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const onScroll = () => {
      scrollFrac = window.scrollY / Math.max(document.body.scrollHeight - window.innerHeight, 1);
    };
    const onTouch = (e: TouchEvent) => {
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

    // ── Animation loop ──
    let animId: number;
    const SECTORS = ['α-001','β-042','γ-117','δ-203','ε-089','ζ-451','η-072','θ-318'];
    const upVec   = new THREE.Vector3(0, 1, 0);
    const lookAt  = new THREE.Vector3();
    const camPos  = new THREE.Vector3();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const now   = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      // Speed: base + scroll boost
      const scrollSpeed = scrollFrac * 3.5;
      const totalSpeed  = 1.0 + scrollSpeed;
      elapsed += delta * totalSpeed;

      // Compute t along path (0–1), looping with fade
      const cycleT    = elapsed % (JOURNEY_T + PAUSE_T);
      const journeyT  = Math.min(cycleT / JOURNEY_T, 1.0);

      // Fade out near end, fade in on loop
      if (cycleT > JOURNEY_T - 1.5 && !fading) {
        fading = true;
        fadeDiv.style.opacity = '1';
        setTimeout(() => {
          // During black: reset elapsed so t = 0
          elapsed = Math.floor(elapsed / (JOURNEY_T + PAUSE_T)) * (JOURNEY_T + PAUSE_T);
          fading  = false;
          fadeDiv.style.opacity = '0';
        }, 1300);
      }

      // ── Camera position on spline ──
      camPath.getPointAt(Math.min(journeyT, 0.999), camPos);

      // Mouse parallax — offset perpendicular to path
      const offsetX = mouseX * 18;
      const offsetY = mouseY * -10;

      // Organic drift
      const drift = elapsed;
      camPos.x += offsetX + Math.sin(drift * 0.04) * 5;
      camPos.y += offsetY + Math.cos(drift * 0.07) * 3;
      camera.position.lerp(camPos, 0.04);

      // Look slightly ahead on the spline
      const lookT = Math.min(journeyT + 0.018, 0.999);
      camPath.getPointAt(lookT, lookAt);
      lookAt.x += offsetX * 0.3;
      lookAt.y += offsetY * 0.3;
      camera.up.copy(upVec);
      camera.lookAt(lookAt);

      // ── Star dome follows camera ──
      starDome.position.copy(camera.position);
      (starDome.material as THREE.ShaderMaterial).uniforms.uTime.value = elapsed;
      starDome.rotation.y = elapsed * 0.0015;

      // ── Travel stars: recycle passed stars ──
      const travelMat = travelStars.material as THREE.ShaderMaterial;
      travelMat.uniforms.uSpeed.value = totalSpeed;
      const posArr = travelStars.geometry.attributes.position.array as Float32Array;
      const camZ   = camera.position.z;
      for (let i = 0; i < TRAVEL_COUNT; i++) {
        if (posArr[i*3+2] > camZ + 30) {
          posArr[i*3]   = rand(-SPAWN_RADIUS, SPAWN_RADIUS);
          posArr[i*3+1] = rand(-SPAWN_RADIUS*0.6, SPAWN_RADIUS*0.6);
          posArr[i*3+2] = camZ - rand(200, SPAWN_DEPTH);
        }
      }
      travelStars.geometry.attributes.position.needsUpdate = true;
      travelStars.position.set(0, 0, 0);

      // ── Planet rotation ──
      planets.forEach((p, i) => {
        // First child is the body sphere
        if (p.children[0]) p.children[0].rotation.y += 0.0004 * (i % 2 === 0 ? 1 : -1.3);
        // Cloud layer (if exists) rotates slightly differently
        if (p.children[4]) p.children[4].rotation.y += 0.0006;
      });

      // ── Sun pulse + approach lighting ──
      const distToSun = camera.position.distanceTo(new THREE.Vector3(0, 0, SUN_Z));
      const sunIntensity = THREE.MathUtils.clamp(1.5 + (5000 - distToSun) / 1200, 1.5, 8.0);
      sunLight.intensity = sunIntensity;
      // Sun corona pulse
      sunGroup.children.forEach((child, i) => {
        if (i > 0) {
          const m = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
          m.opacity = m.opacity * 0.97 + (0.03 + Math.sin(elapsed * 0.8 + i) * 0.01) * 0.03;
        }
      });

      // ── Dispatch HUD event ──
      const sector = SECTORS[Math.floor(journeyT * SECTORS.length) % SECTORS.length];
      window.dispatchEvent(new CustomEvent('spaceHUD', {
        detail: { speed: totalSpeed, sector }
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
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      if (container.contains(fadeDiv)) container.removeChild(fadeDiv);
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
      aria-hidden="true"
    />
  );
}
