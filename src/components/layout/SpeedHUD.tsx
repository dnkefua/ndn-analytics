import { useEffect, useState } from 'react';

export default function SpeedHUD() {
  const [speed, setSpeed] = useState(0.6);
  const [sector, setSector] = useState('α-001');

  useEffect(() => {
    const handler = (e: Event) => {
      const { speed: s, sector: sec } = (e as CustomEvent).detail;
      setSpeed(s);
      setSector(sec);
    };
    window.addEventListener('spaceHUD', handler);
    return () => window.removeEventListener('spaceHUD', handler);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      left: 24,
      zIndex: 10,
      fontFamily: "'JetBrains Mono Variable', 'JetBrains Mono', monospace",
      fontSize: '0.65rem',
      color: 'rgba(6,182,212,0.6)',
      letterSpacing: '0.12em',
      lineHeight: 1.8,
      pointerEvents: 'none',
    }}
      aria-hidden="true"
    >
      <div>VEL: {speed.toFixed(2)} kpc/s</div>
      <div>SEC: {sector}</div>
      <div style={{ width: 80, height: 2, background: 'rgba(6,182,212,0.15)', marginTop: 4, borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${Math.min(speed / 4 * 100, 100)}%`, height: '100%', background: 'rgba(6,182,212,0.7)', transition: 'width 0.3s' }} />
      </div>
    </div>
  );
}
