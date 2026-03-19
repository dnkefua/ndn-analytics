import * as THREE from 'three';

export function createWarpStreaks(scene: THREE.Scene): THREE.LineSegments {
  const count = 200;
  const positions = new Float32Array(count * 6); // 2 points per line

  for (let i = 0; i < count; i++) {
    const x = (Math.random() - 0.5) * 600;
    const y = (Math.random() - 0.5) * 400;
    const z = -Math.random() * 300 - 50;
    positions[i * 6]     = x;
    positions[i * 6 + 1] = y;
    positions[i * 6 + 2] = z;
    positions[i * 6 + 3] = x;
    positions[i * 6 + 4] = y;
    positions[i * 6 + 5] = z + 10;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const mat = new THREE.LineBasicMaterial({
    color: 0x88ddff,
    transparent: true,
    opacity: 0,
  });

  const streaks = new THREE.LineSegments(geo, mat);
  scene.add(streaks);
  return streaks;
}

export function updateWarpStreaks(
  streaks: THREE.LineSegments,
  speed: number,
  cameraPosition: THREE.Vector3
): void {
  const visible = speed > 1.5;
  const mat = streaks.material as THREE.LineBasicMaterial;
  const targetOpacity = visible ? Math.min((speed - 1.5) * 0.5, 0.8) : 0;
  mat.opacity += (targetOpacity - mat.opacity) * 0.1;

  if (visible) {
    const positions = streaks.geometry.attributes.position as THREE.BufferAttribute;
    const arr = positions.array as Float32Array;
    const streakLength = Math.min(speed * 15, 120);
    const count = arr.length / 6;

    for (let i = 0; i < count; i++) {
      arr[i * 6 + 5] = arr[i * 6 + 2] + streakLength;
    }
    positions.needsUpdate = true;
  }

  streaks.position.copy(cameraPosition);
  streaks.position.z -= 100;
}
