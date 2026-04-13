export default function SkeletonLoader() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      gap: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 680 }}>
        {/* Title skeleton */}
        <div style={shimmer(260, 14, 24)} />
        {/* Subtitle skeleton */}
        <div style={shimmer(400, 10, 16)} />
        {/* Content lines */}
        <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={shimmer('100%', 8)} />
          <div style={shimmer('92%', 8)} />
          <div style={shimmer('85%', 8)} />
          <div style={shimmer('96%', 8)} />
          <div style={shimmer('60%', 8)} />
        </div>
      </div>

      <style>{`
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 0.12; }
          50% { opacity: 0.22; }
        }
      `}</style>
    </div>
  );
}

function shimmer(
  width: number | string,
  height: number,
  marginBottom = 0,
): React.CSSProperties {
  return {
    width,
    height,
    marginBottom,
    borderRadius: 6,
    background: 'var(--brand-cyan, #06B6D4)',
    animation: 'skeleton-pulse 1.6s ease-in-out infinite',
  };
}
