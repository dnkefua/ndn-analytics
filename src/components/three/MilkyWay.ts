import * as THREE from 'three';

export function createMilkyWay(scene: THREE.Scene): THREE.Points {
  const count = 25000;
  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2;
    const band = Math.sin(t * 3) * 200;
    const spread = 120;
    positions[i * 3]     = (Math.random() - 0.5) * 8000;
    positions[i * 3 + 1] = band + (Math.random() - 0.5) * spread;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 3000 - 1000;

    const brightness = 0.3 + Math.random() * 0.4;
    colors[i * 3]     = brightness * 0.7;
    colors[i * 3 + 1] = brightness * 0.8;
    colors[i * 3 + 2] = brightness * 1.0;
  }

  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.35,
    vertexColors: true,
    transparent: true,
    opacity: 0.45,
    sizeAttenuation: true,
  });

  const points = new THREE.Points(geo, mat);
  scene.add(points);
  return points;
}
