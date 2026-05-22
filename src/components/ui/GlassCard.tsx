import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';

interface Props {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  glow?: string;
  style?: React.CSSProperties;
}

export default function GlassCard({
  children,
  className = '',
  href,
  onClick,
  glow = '#06B6D4',
  style = {},
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  // 3D tilt values with smooth spring settings
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 220, damping: 20 });
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 220, damping: 20 });

  // Sheen gradient position based on cursor relative coordinates
  const gxPct = useTransform(mx, v => `${(v + 0.5) * 100}%`);
  const gyPct = useTransform(my, v => `${(v + 0.5) * 100}%`);
  const sheenBg = useMotionTemplate`radial-gradient(220px circle at ${gxPct} ${gyPct}, ${glow}33, transparent 60%)`;

  const onMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const onMouseLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const inner = (
    <motion.div
      ref={ref}
      className={`glass-card ${className}`}
      style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 1000, ...style }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 250, damping: 22 }}
    >
      <motion.div
        className="glass-card__sheen"
        style={{ background: sheenBg }}
      />
      <div className="glass-card__content">{children}</div>
    </motion.div>
  );

  if (href) {
    return (
      <Link to={href} className="glass-card__link" onClick={onClick}>
        {inner}
      </Link>
    );
  }

  return inner;
}
