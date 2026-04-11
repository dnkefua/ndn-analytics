/**
 * Flat NDN Analytics Logo
 * Replaces the 3D Logo3D component with a clean, modern flat design
 */
export default function LogoFlat() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <div
        style={{
          fontFamily: "'Syne Variable', sans-serif",
          fontSize: '1.25rem',
          fontWeight: 900,
          letterSpacing: '0.12em',
          background: 'linear-gradient(135deg, #EC4899, #7C3AED, #3B82F6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        NDN
      </div>
      <div
        style={{
          fontFamily: "'JetBrains Mono Variable', monospace",
          fontSize: '0.5rem',
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: 'rgba(15, 23, 42, 0.6)',
        }}
      >
        ANALYTICS
      </div>
    </div>
  );
}
