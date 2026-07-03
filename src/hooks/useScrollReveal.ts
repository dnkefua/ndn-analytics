import { useEffect, useRef } from 'react';

export function useScrollReveal(threshold = 0.1) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.target.classList.toggle('visible', e.isIntersecting)),
      { threshold }
    );
    const el = ref.current;
    if (el) {
      el.querySelectorAll('.reveal').forEach(child => observer.observe(child));
    }
    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}
