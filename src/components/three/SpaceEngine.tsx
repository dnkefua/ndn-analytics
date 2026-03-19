import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createStarLayers } from './StarField';
import { createMilkyWay } from './MilkyWay';
import { createNebulae } from './Nebula';
import { createPlanets, updatePlanets } from './PlanetBuilder';
import { createAsteroidFields, updateAsteroidFields } from './AsteroidField';
import { createSuns } from './SunBuilder';
import { createCometSystem } from './CometTrail';
import { createWarpStreaks, updateWarpStreaks } from './WarpStreaks';

const JOURNEY_LENGTH = 10000;
const SECTORS = ['α-001', 'β-042', 'γ-117', 'δ-203', 'ε-089', 'ζ-451', 'η-072', 'θ-318'];

export function getSector(z: number): string {
  const idx = Math.floor(Math.abs(z) / (JOURNEY_LENGTH / SECTORS.length)) % SECTORS.length;
  return SECTORS[idx];
}

export default function SpaceEngine() {
  const mountRef = useRef<HTMLDivElement>(null);
  const speedRef = useRef(0);
  const sectorRef = useRef(SECTORS[0]);

  useEffect(() => {
    if (!mountRef.current) return;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.setClearColor(0x010309, 1);
    mountRef.current.appendChild(renderer.domElement);

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x010309, 0.000018);

    // Ambient light
    scene.add(new THREE.AmbientLight(0x223355, 0.6));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(1, 1, 2);
    scene.add(dirLight);

    // Camera
    const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 30000);
    camera.position.set(0, 0, 0);

    // Objects
    const starLayers = createStarLayers(scene);
    createMilkyWay(scene);
    createNebulae(scene);
    const planets = createPlanets(scene);
    const asteroids = createAsteroidFields(scene);
    createSuns(scene);
    const comets = createCometSystem(scene);
    const warpStreaks = createWarpStreaks(scene);

    // State
    let scrollY = 0;
    let mouseX = 0;
    let mouseY = 0;
    let cameraZ = 0;
    let baseSpeed = 0.6;
    let lastTime = performance.now();

    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    const handleMouse = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouse, { passive: true });
    window.addEventListener('resize', handleResize);

    // Touch support
    const handleTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseX = (e.touches[0].clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.touches[0].clientY / window.innerHeight - 0.5) * 2;
      }
    };
    window.addEventListener('touchmove', handleTouch, { passive: true });

    let animId: number;

    function animate() {
      animId = requestAnimationFrame(animate);
      const now = performance.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      const elapsed = now / 1000;

      // Speed based on scroll
      const scrollSpeed = (scrollY / (document.body.scrollHeight - window.innerHeight || 1)) * 3;
      const targetSpeed = baseSpeed + scrollSpeed;
      speedRef.current += (targetSpeed - speedRef.current) * 0.05;

      // Forward travel
      cameraZ -= speedRef.current * delta * 60;
      if (cameraZ < -JOURNEY_LENGTH) cameraZ += JOURNEY_LENGTH;

      // Sector tracking
      sectorRef.current = getSector(cameraZ);

      // Camera movement
      camera.position.z = cameraZ;
      camera.position.x += (mouseX * 8 - camera.position.x) * 0.02;
      camera.position.y += (-mouseY * 4 - camera.position.y) * 0.02;
      camera.position.x += Math.sin(elapsed * 0.1) * 0.2;
      camera.position.y += Math.cos(elapsed * 0.13) * 0.1;
      camera.rotation.y += (-mouseX * 0.04 - camera.rotation.y) * 0.03;
      camera.rotation.x += (-mouseY * 0.02 - camera.rotation.x) * 0.03;

      // Star parallax
      starLayers.forEach((layer, i) => {
        const ratio = [0.02, 0.08, 0.2, 0.5][i] ?? 0.5;
        layer.points.position.z = cameraZ * ratio;
      });

      updatePlanets(planets, elapsed);
      updateAsteroidFields(asteroids, elapsed);
      comets.update(cameraZ);
      updateWarpStreaks(warpStreaks, speedRef.current, camera.position);

      // Dispatch speed/sector for HUD
      window.dispatchEvent(new CustomEvent('spaceHUD', {
        detail: { speed: speedRef.current, sector: sectorRef.current }
      }));

      renderer.render(scene, camera);
    }

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('touchmove', handleTouch);
      comets.dispose();
      renderer.dispose();
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
