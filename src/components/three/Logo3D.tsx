import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Logo3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const W = 180, H = 40;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
    camera.position.z = 14;

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const dirLight = new THREE.DirectionalLight(0x06B6D4, 1.5);
    dirLight.position.set(2, 3, 5);
    scene.add(dirLight);
    const rimLight = new THREE.DirectionalLight(0x4F46E5, 0.8);
    rimLight.position.set(-3, -1, 2);
    scene.add(rimLight);

    // Build letter blocks for "NDN"
    const letterGroup = new THREE.Group();
    const mat = new THREE.MeshPhongMaterial({
      color: 0x06B6D4,
      emissive: 0x0a3040,
      emissiveIntensity: 0.3,
      specular: 0xffffff,
      shininess: 120,
    });

    // N - left vertical, diagonal, right vertical
    const barGeo = new THREE.BoxGeometry(0.6, 3.5, 0.5);
    const diagGeo = new THREE.BoxGeometry(0.55, 4.2, 0.5);

    function makeBar(x: number, y: number, z: number, rx = 0, ry = 0, rz = 0) {
      const mesh = new THREE.Mesh(barGeo, mat);
      mesh.position.set(x, y, z);
      mesh.rotation.set(rx, ry, rz);
      return mesh;
    }

    // Letter N (offset x: -4.5)
    letterGroup.add(makeBar(-4.5, 0, 0));
    letterGroup.add(makeBar(-3.0, 0, 0));
    const diag1 = new THREE.Mesh(diagGeo, mat);
    diag1.position.set(-3.75, 0, 0);
    diag1.rotation.z = -0.35;
    letterGroup.add(diag1);

    // Letter D (offset x: -1)
    const dLeft = makeBar(-1.2, 0, 0);
    letterGroup.add(dLeft);
    // D curve approximation with boxes
    [[-0.5, 1.35, 0], [0.3, 0.9, 0], [0.6, 0, 0], [0.3, -0.9, 0], [-0.5, -1.35, 0]].forEach(([x, y, z]) => {
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.65, 0.5), mat);
      b.position.set(x as number - 0.8, y as number, z as number);
      letterGroup.add(b);
    });

    // Letter N2 (offset x: 2.5)
    letterGroup.add(makeBar(2.5, 0, 0));
    letterGroup.add(makeBar(4.0, 0, 0));
    const diag2 = new THREE.Mesh(diagGeo, mat);
    diag2.position.set(3.25, 0, 0);
    diag2.rotation.z = -0.35;
    letterGroup.add(diag2);

    scene.add(letterGroup);

    // Particle burst pool
    const particles: { mesh: THREE.Mesh; vel: THREE.Vector3; life: number }[] = [];
    const particleGeo = new THREE.SphereGeometry(0.08, 6, 6);
    const particleMat = new THREE.MeshBasicMaterial({ color: 0x06B6D4, transparent: true });

    let mouseNear = false;
    let targetRotX = 0, targetRotY = 0;
    let idleAngle = 0;
    let breathScale = 1;
    let emissiveTarget = 0.3;

    const handleMouseMove = (e: MouseEvent) => {
      if (!mountRef.current) return;
      const rect = mountRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 200) {
        mouseNear = true;
        targetRotY = (dx / 200) * 0.6;
        targetRotX = (-dy / 200) * 0.4;
        emissiveTarget = 0.8;

        // Particle burst on enter proximity
        if (Math.random() < 0.15) {
          const pm = new THREE.Mesh(particleGeo, particleMat.clone());
          pm.position.set((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 3, 0);
          scene.add(pm);
          particles.push({
            mesh: pm,
            vel: new THREE.Vector3((Math.random() - 0.5) * 0.3, (Math.random() - 0.5) * 0.3, 0.1 + Math.random() * 0.2),
            life: 1.0,
          });
        }
      } else {
        mouseNear = false;
        targetRotX = 0;
        targetRotY = 0;
        emissiveTarget = 0.3;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animId: number;
    let lastTime = performance.now();

    function animate() {
      animId = requestAnimationFrame(animate);
      const now = performance.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      idleAngle += 0.003;
      breathScale = 1 + Math.sin(idleAngle * 0.7) * 0.015;

      if (!mouseNear) {
        letterGroup.rotation.y += (idleAngle * 0.5 - letterGroup.rotation.y) * 0.02;
      } else {
        letterGroup.rotation.y += (targetRotY - letterGroup.rotation.y) * 0.1;
        letterGroup.rotation.x += (targetRotX - letterGroup.rotation.x) * 0.1;
      }
      letterGroup.scale.setScalar(breathScale);
      mat.emissiveIntensity += (emissiveTarget - mat.emissiveIntensity) * 0.05;

      // Update particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.mesh.position.add(p.vel);
        p.life -= delta * 1.5;
        (p.mesh.material as THREE.MeshBasicMaterial).opacity = p.life;
        if (p.life <= 0) {
          scene.remove(p.mesh);
          particles.splice(i, 1);
        }
      }

      renderer.render(scene, camera);
    }

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      renderer.dispose();
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} style={{ width: 180, height: 40, display: 'inline-block', verticalAlign: 'middle' }} />;
}
