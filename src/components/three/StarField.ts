import * as THREE from 'three';

interface StarLayer {
  points: THREE.Points;
  speed: number;
}

const SPECTRAL_COLORS: number[][] = [
  [155, 176, 255], // O - blue-violet
  [170, 191, 255], // B - blue-white
  [202, 215, 255], // A - white-blue
  [248, 247, 255], // F - white
  [255, 244, 234], // G - yellow-white (sun-like)
  [255, 210, 161], // K - orange
  [255, 180, 100], // M - red-orange
];
const SPECTRAL_WEIGHTS = [0.02, 0.12, 0.18, 0.22, 0.26, 0.14, 0.06];

function pickSpectralColor(): THREE.Color {
  const r = Math.random();
  let acc = 0;
  for (let i = 0; i < SPECTRAL_WEIGHTS.length; i++) {
    acc += SPECTRAL_WEIGHTS[i];
    if (r <= acc) {
      const c = SPECTRAL_COLORS[i];
      return new THREE.Color(c[0] / 255, c[1] / 255, c[2] / 255);
    }
  }
  return new THREE.Color(1, 1, 1);
}

interface LayerConfig {
  count: number;
  range: number;
  minRange: number;
  size: number;
  speed: number;
  twinkle: boolean;
}

const LAYER_CONFIGS: LayerConfig[] = [
  { count: 18000, range: 12000, minRange: 500,  size: 0.4, speed: 0.02, twinkle: false },
  { count: 6000,  range: 2500,  minRange: 150,  size: 0.8, speed: 0.08, twinkle: false },
  { count: 1500,  range: 600,   minRange: 40,   size: 1.4, speed: 0.2,  twinkle: false },
  { count: 400,   range: 150,   minRange: 10,   size: 2.2, speed: 0.5,  twinkle: true  },
];

export function createStarLayers(scene: THREE.Scene): StarLayer[] {
  return LAYER_CONFIGS.map((cfg) => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(cfg.count * 3);
    const colors = new Float32Array(cfg.count * 3);

    for (let i = 0; i < cfg.count; i++) {
      const r = cfg.minRange + Math.random() * (cfg.range - cfg.minRange);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.45;
      positions[i * 3 + 2] = r * Math.cos(phi);
      const col = pickSpectralColor();
      colors[i * 3]     = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: cfg.size,
      vertexColors: true,
      transparent: true,
      opacity: 1,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);
    return { points, speed: cfg.speed };
  });
}

export function updateStarLayers(layers: StarLayer[], _delta: number, cameraZ: number): void {
  const journeyLength = 10000;
  layers.forEach((layer) => {
    layer.points.position.z = -(cameraZ * layer.speed) % journeyLength;
  });
}
