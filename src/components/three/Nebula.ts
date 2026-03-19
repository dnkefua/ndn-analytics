import * as THREE from 'three';

interface NebulaConfig {
  color: number;
  z: number;
  count: number;
  spread: number;
}

const NEBULA_CONFIGS: NebulaConfig[] = [
  { color: 0x4488ff, z: -800,  count: 8000, spread: 600 },
  { color: 0xff4466, z: -2000, count: 6000, spread: 500 },
  { color: 0x44ffaa, z: -3500, count: 5000, spread: 550 },
  { color: 0xaa66ff, z: -5500, count: 7000, spread: 650 },
];

export function createNebulae(scene: THREE.Scene): THREE.Points[] {
  return NEBULA_CONFIGS.map((cfg) => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(cfg.count * 3);
    const color = new THREE.Color(cfg.color);

    for (let i = 0; i < cfg.count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * cfg.spread;
      positions[i * 3 + 1] = (Math.random() - 0.5) * cfg.spread * 0.4;
      positions[i * 3 + 2] = cfg.z + (Math.random() - 0.5) * 200;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      size: 3.5,
      color,
      transparent: true,
      opacity: 0.08,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);
    return points;
  });
}
