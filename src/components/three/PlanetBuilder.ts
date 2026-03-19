import * as THREE from 'three';

type TextureType = 'earth' | 'gas' | 'ice' | 'lava' | 'ringed' | 'purple';

const PALETTES: Record<TextureType, number[][]> = {
  earth:  [[20,60,120],[30,90,50],[40,120,60],[180,170,140],[220,220,240]],
  gas:    [[180,120,50],[200,140,60],[160,100,40],[220,170,80],[140,80,30]],
  ice:    [[140,180,220],[160,200,240],[100,140,180],[200,220,245],[80,120,160]],
  lava:   [[60,10,5],[120,30,10],[200,60,15],[255,120,20],[40,5,0]],
  ringed: [[190,160,110],[210,180,130],[170,140,90],[230,200,150],[150,120,70]],
  purple: [[80,40,120],[100,50,150],[60,20,90],[140,80,200],[40,10,60]],
};

function generateTexture(type: TextureType, size = 512): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const palette = PALETTES[type];

  // Base fill
  ctx.fillStyle = `rgb(${palette[0].join(',')})`;
  ctx.fillRect(0, 0, size, size);

  if (type === 'gas') {
    // Horizontal bands
    for (let y = 0; y < size; y += Math.random() * 20 + 8) {
      const p = palette[Math.floor(Math.random() * palette.length)];
      ctx.fillStyle = `rgba(${p.join(',')},0.6)`;
      ctx.fillRect(0, y, size, Math.random() * 16 + 4);
    }
  } else if (type === 'lava') {
    // Random blobs + bright veins
    for (let i = 0; i < 80; i++) {
      const p = palette[Math.floor(Math.random() * palette.length)];
      ctx.beginPath();
      ctx.arc(Math.random()*size, Math.random()*size, Math.random()*30+5, 0, Math.PI*2);
      ctx.fillStyle = `rgba(${p.join(',')},0.7)`;
      ctx.fill();
    }
    // Bright emissive dots
    for (let i = 0; i < 40; i++) {
      ctx.beginPath();
      ctx.arc(Math.random()*size, Math.random()*size, Math.random()*4+1, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(255,200,50,0.9)';
      ctx.fill();
    }
  } else if (type === 'ice') {
    // Base + crack lines
    for (let i = 0; i < 60; i++) {
      const p = palette[Math.floor(Math.random() * palette.length)];
      ctx.beginPath();
      ctx.arc(Math.random()*size, Math.random()*size, Math.random()*40+10, 0, Math.PI*2);
      ctx.fillStyle = `rgba(${p.join(',')},0.4)`;
      ctx.fill();
    }
    ctx.strokeStyle = 'rgba(200,230,255,0.3)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random()*size, Math.random()*size);
      ctx.lineTo(Math.random()*size, Math.random()*size);
      ctx.stroke();
    }
  } else {
    // Generic blob texture
    for (let i = 0; i < 100; i++) {
      const p = palette[Math.floor(Math.random() * palette.length)];
      ctx.beginPath();
      ctx.arc(Math.random()*size, Math.random()*size, Math.random()*50+10, 0, Math.PI*2);
      ctx.fillStyle = `rgba(${p.join(',')},0.5)`;
      ctx.fill();
    }
  }

  return new THREE.CanvasTexture(canvas);
}

interface PlanetConfig {
  radius: number;
  z: number;
  x?: number;
  y?: number;
  type: TextureType;
  atmosphereColor: number;
  rings?: boolean;
  moons?: number;
  emissive?: boolean;
  light?: boolean;
}

const PLANET_CONFIGS: PlanetConfig[] = [
  { radius: 16, z: -350,  x: 180,  type: 'earth',  atmosphereColor: 0x2255ff, moons: 1 },
  { radius: 28, z: -1000, x: -250, type: 'gas',    atmosphereColor: 0xff8833, moons: 3 },
  { radius: 14, z: -2000, x: 200,  type: 'ice',    atmosphereColor: 0x88ccff, moons: 1 },
  { radius: 12, z: -3000, x: -180, type: 'lava',   atmosphereColor: 0xff2200, moons: 0, emissive: true, light: true },
  { radius: 24, z: -4200, x: 300,  type: 'ringed', atmosphereColor: 0xffaa44, rings: true, moons: 2 },
  { radius: 18, z: -5600, x: -220, type: 'purple', atmosphereColor: 0x9933ff, moons: 1 },
  { radius: 32, z: -7200, x: 280,  type: 'gas',    atmosphereColor: 0xff4422, rings: true, moons: 3 },
  { radius: 20, z: -9000, x: -200, type: 'ice',    atmosphereColor: 0xaaddff, moons: 1 },
];

export function createPlanets(scene: THREE.Scene): THREE.Group[] {
  return PLANET_CONFIGS.map((cfg) => {
    const group = new THREE.Group();
    group.position.set(cfg.x ?? 0, cfg.y ?? 0, cfg.z);

    // Planet mesh
    const geo = new THREE.SphereGeometry(cfg.radius, 64, 64);
    const tex = generateTexture(cfg.type);
    const mat = new THREE.MeshPhongMaterial({
      map: tex,
      shininess: cfg.type === 'ice' ? 80 : 20,
      emissive: cfg.emissive ? new THREE.Color(0xff3300) : undefined,
      emissiveIntensity: cfg.emissive ? 0.3 : 0,
    });
    const planet = new THREE.Mesh(geo, mat);
    group.add(planet);

    // Atmosphere layers
    const atmColor = new THREE.Color(cfg.atmosphereColor);
    [1.06, 1.12, 1.20].forEach((scale, i) => {
      const atmGeo = new THREE.SphereGeometry(cfg.radius * scale, 32, 32);
      const atmMat = new THREE.MeshPhongMaterial({
        color: atmColor,
        transparent: true,
        opacity: [0.18, 0.10, 0.05][i],
        side: THREE.BackSide,
      });
      group.add(new THREE.Mesh(atmGeo, atmMat));
    });

    // Rings
    if (cfg.rings) {
      const inner = cfg.radius * 1.4;
      const outer = cfg.radius * 2.4;
      const ringGeo = new THREE.RingGeometry(inner, outer, 128);
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(cfg.atmosphereColor).lerp(new THREE.Color(0xffffff), 0.3),
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 3;
      group.add(ring);
    }

    // Moons
    for (let m = 0; m < (cfg.moons ?? 0); m++) {
      const pivot = new THREE.Object3D();
      pivot.rotation.z = (Math.random() - 0.5) * 0.5;
      const moonRadius = m === 0 && cfg.z === -9000 ? 12 : cfg.radius * 0.18 + Math.random() * 0.1 * cfg.radius;
      const dist = cfg.radius * (2 + m * 0.8);
      const moonGeo = new THREE.SphereGeometry(moonRadius, 24, 24);
      const moonMat = new THREE.MeshPhongMaterial({ color: 0xaaaaaa, shininess: 10 });
      const moon = new THREE.Mesh(moonGeo, moonMat);
      moon.position.x = dist;
      pivot.add(moon);
      (pivot as any)._moonSpeed = 0.002 + Math.random() * 0.003;
      (pivot as any)._moonAngle = Math.random() * Math.PI * 2;
      group.add(pivot);
    }

    // Local light for lava
    if (cfg.light) {
      const light = new THREE.PointLight(0xff3300, 2, cfg.radius * 8);
      group.add(light);
    }

    scene.add(group);
    return group;
  });
}

export function updatePlanets(planets: THREE.Group[], _elapsed: number): void {
  planets.forEach((group) => {
    group.children.forEach((child) => {
      if ((child as any)._moonSpeed !== undefined) {
        (child as any)._moonAngle += (child as any)._moonSpeed;
        child.rotation.y = (child as any)._moonAngle;
      }
    });
    // Slow self rotation
    const planet = group.children[0] as THREE.Mesh;
    if (planet) planet.rotation.y += 0.001;
  });
}
