import { useState } from 'react';
import VideoLogo from './VideoLogo';

/**
 * NDN Analytics Logo for Navbar
 * Uses the 3D video logo with fallback options
 */
export default function LogoDisplay() {
  const [useVideo, setUseVideo] = useState(true);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      {useVideo ? (
        <VideoLogo size={44} />
      ) : (
        <img
          src="/logo.jpg"
          alt="NDN Analytics"
          style={{
            width: 44,
            height: 44,
            objectFit: 'contain',
            borderRadius: '6px',
          }}
          onError={() => setUseVideo(false)}
        />
      )}
    </div>
  );
}