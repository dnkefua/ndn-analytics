import './FloatingParticles.css';

/**
 * Floating Particles Background
 * Replaces the 3D SpaceEngine with CSS-animated geometric shapes
 * Inspired by Google's Antigravity download page aesthetic
 */
export default function FloatingParticlesBackground() {
  return (
    <div className="floating-particles-container">
      {/* Gradient overlay */}
      <div className="particles-gradient" />

      {/* Animated particles */}
      <div className="particle particle-1" />
      <div className="particle particle-2" />
      <div className="particle particle-3" />
      <div className="particle particle-4" />
      <div className="particle particle-5" />
      <div className="particle particle-6" />
      <div className="particle particle-7" />
      <div className="particle particle-8" />
      <div className="particle particle-9" />
      <div className="particle particle-10" />
      <div className="particle particle-11" />
      <div className="particle particle-12" />
    </div>
  );
}
