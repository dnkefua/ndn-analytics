import * as THREE from 'three';

const FIELD_CONFIGS = [
  { z: -650,  count: 1200, radius: 120 },
  { z: -2500, count: 1500, radius: 160 },
  { z: -5000, count: 800,  radius: 100 },
  { z: -8000, count: 1000, radius: 140 },
];

export function createAsteroidFields(scene: THREE.Scene): THREE.Points[] {
  return FIELD_CONFIGS.map((cfg) => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(cfg.count * 3);

    for (let i = 0; i < cfg.count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = cfg.radius * (0.6 + Math.random() * 0.8);
      positions[i * 3]     = Math.cos(angle) * r;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = cfg.z + Math.sin(angle) * r * 0.3;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      size: 1.2,
      color: 0x887766,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);
    return points;
  });
}

export function updateAsteroidFields(fields: THREE.Points[]): void {
  fields.forEach((field, i) => {
    field.rotation.y += 0.0002 * (i % 2 === 0 ? 1 : -1);
  });
}
