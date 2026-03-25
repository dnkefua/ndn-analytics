import { useRef, useEffect } from 'react';

/**
 * NDN Logo — renders the 3D animated logo video.
 */
export default function Logo3D() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <div
      style={{
        width: 140,
        height: 140,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        background: 'transparent',
      }}
    >
      <video
        ref={videoRef}
        src="/logo.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
      />
    </div>
  );
}