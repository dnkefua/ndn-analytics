import { useRef, useEffect, useState } from 'react';

/**
 * NDN Analytics 3D Logo Video Component
 * Displays the animated 3D logo video with hover effects
 */
export default function VideoLogo({ size = 72 }: { size?: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Ensure video plays smoothly
    video.play().catch(() => {
      // Autoplay may be blocked, that's okay
    });
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className="video-logo-container"
      style={{
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        cursor: 'pointer',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          borderRadius: '8px',
          filter: isHovered ? 'drop-shadow(0 0 12px rgba(6, 182, 212, 0.6))' : 'drop-shadow(0 0 6px rgba(6, 182, 212, 0.3))',
          transition: 'filter 0.3s ease',
        }}
      >
        <source src="/logo-3d.mp4" type="video/mp4" />
        {/* Fallback to static logo if video doesn't load */}
        <img
          src="/logo.jpg"
          alt="NDN Analytics"
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </video>

      {/* Glow ring on hover */}
      {isHovered && (
        <div
          style={{
            position: 'absolute',
            inset: -4,
            borderRadius: '12px',
            border: '1px solid rgba(6, 182, 212, 0.4)',
            animation: 'pulse 1.5s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
}