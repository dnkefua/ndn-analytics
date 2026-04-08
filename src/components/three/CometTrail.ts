import * as THREE from 'three';

interface Comet {
  line: THREE.Line;
  velocity: THREE.Vector3;
  age: number;
  maxAge: number;
}

const MAX_COMETS = 5;
const SPAWN_INTERVAL = 300;

export function createCometSystem(scene: THREE.Scene) {
  const comets: Comet[] = [];
  let frameCount = 0;

  function spawnComet() {
    const points: THREE.Vector3[] = [];
    const origin = new THREE.Vector3(
      (Math.random() - 0.5) * 800,
      (Math.random() - 0.5) * 400,
      -Math.random() * 2000 - 200
    );
    for (let i = 0; i < 60; i++) {
      points.push(origin.clone());
    }
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({
      color: 0xaaddff,
      transparent: true,
      opacity: 0.8,
    });
    const line = new THREE.Line(geo, mat);
    scene.add(line);

    const velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 0.5,
      3 + Math.random() * 2
    );
    comets.push({ line, velocity, age: 0, maxAge: 300 });
  }

  function update() {
    frameCount++;
    if (frameCount % SPAWN_INTERVAL === 0 && comets.length < MAX_COMETS) {
      spawnComet();
    }

    for (let i = comets.length - 1; i >= 0; i--) {
      const comet = comets[i];
      comet.age++;

      const positions = comet.line.geometry.attributes.position as THREE.BufferAttribute;
      const arr = positions.array as Float32Array;
      // Shift points along trail
      for (let j = arr.length / 3 - 1; j > 0; j--) {
        arr[j * 3]     = arr[(j - 1) * 3];
        arr[j * 3 + 1] = arr[(j - 1) * 3 + 1];
        arr[j * 3 + 2] = arr[(j - 1) * 3 + 2];
      }
      // Move head
      arr[0] += comet.velocity.x;
      arr[1] += comet.velocity.y;
      arr[2] += comet.velocity.z;
      positions.needsUpdate = true;

      const progress = comet.age / comet.maxAge;
      (comet.line.material as THREE.LineBasicMaterial).opacity = Math.max(0, 1 - progress);

      if (comet.age >= comet.maxAge) {
        scene.remove(comet.line);
        comet.line.geometry.dispose();
        comets.splice(i, 1);
      }
    }
  }

  function dispose() {
    comets.forEach((c) => {
      scene.remove(c.line);
      c.line.geometry.dispose();
    });
    comets.length = 0;
  }

  return { update, dispose };
}
