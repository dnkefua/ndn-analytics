import * as THREE from 'three';

const SUN_CONFIGS = [
  { x: -2000, y: 300,  z: -1500, color: 0xfffaaa, radius: 60 },
  { x: 3000,  y: -200, z: -3000, color: 0xffddaa, radius: 40 },
  { x: -1500, y: 500,  z: -5000, color: 0xaaddff, radius: 50 },
  { x: 2500,  y: 100,  z: -6500, color: 0xffccbb, radius: 35 },
  { x: -3000, y: -300, z: -8000, color: 0xffffcc, radius: 55 },
  { x: 1000,  y: 400,  z: -9500, color: 0xffeeaa, radius: 45 },
];

export function createSuns(scene: THREE.Scene): THREE.Group[] {
  return SUN_CONFIGS.map((cfg) => {
    const group = new THREE.Group();
    group.position.set(cfg.x, cfg.y, cfg.z);

    // Core
    const coreGeo = new THREE.SphereGeometry(cfg.radius, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({ color: cfg.color });
    group.add(new THREE.Mesh(coreGeo, coreMat));

    // Glow halos
    const glowColor = new THREE.Color(cfg.color);
    [2, 3, 5, 8].forEach((scale, i) => {
      const haloGeo = new THREE.SphereGeometry(cfg.radius * scale, 16, 16);
      const haloMat = new THREE.MeshBasicMaterial({
        color: glowColor,
        transparent: true,
        opacity: [0.15, 0.08, 0.04, 0.02][i],
        side: THREE.BackSide,
      });
      group.add(new THREE.Mesh(haloGeo, haloMat));
    });

    // Point light
    const light = new THREE.PointLight(cfg.color, 0.8, cfg.radius * 30);
    group.add(light);

    scene.add(group);
    return group;
  });
}
