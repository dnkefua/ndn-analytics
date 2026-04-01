import { useEffect, useRef } from 'react';
import './CustomCursor.css';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hide on touch devices
    if ('ontouchstart' in window) return;

    let x = 0, y = 0, ringX = 0, ringY = 0;
    let animId: number;

    const move = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
    };

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${x - 4}px, ${y - 4}px)`;
      }
      ringX += (x - ringX) * 0.12;
      ringY += (y - ringY) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px)`;
      }
    };

    const handleLinkHover = (e: Event) => {
      const target = e.target as HTMLElement;
      const isLink = target.closest('a, button, [role="button"]');
      ringRef.current?.classList.toggle('expanded', !!isLink);
    };

    window.addEventListener('mousemove', move, { passive: true });
    document.addEventListener('mouseover', handleLinkHover);
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseover', handleLinkHover);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
