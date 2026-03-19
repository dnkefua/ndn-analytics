import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const STATS = [
  { value: 10, label: 'Products', suffix: '' },
  { value: 2,  label: 'Core Stacks', suffix: '' },
  { value: 99.9, label: 'Uptime SLA', suffix: '%' },
];

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 1400;
        const start = performance.now();
        const animate = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          setVal(parseFloat((eased * target).toFixed(1)));
          if (t < 1) requestAnimationFrame(animate);
          else setVal(target);
        };
        requestAnimationFrame(animate);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{target % 1 === 0 ? Math.round(val) : val.toFixed(1)}{suffix}</span>;
}

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const els = heroRef.current?.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.target.classList.toggle('visible', e.isIntersecting)),
      { threshold: 0.1 }
    );
    els?.forEach(el => observer.observe(el));
    setTimeout(() => els?.forEach(el => el.classList.add('visible')), 100);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="hero-section" ref={heroRef}>
      <div className="container hero-inner">
        <div className="hero-eyebrow reveal">
          <span className="hero-eyebrow-dot" />
          Enterprise AI & Blockchain Intelligence
        </div>

        <h1 className="hero-title">
          <span className="hero-title-line1 reveal stagger-1">Intelligence</span>
          <br />
          <span className="hero-title-line2 reveal stagger-2 text-gradient">Redefined</span>
        </h1>

        <p className="hero-subtitle reveal stagger-3">
          NDN Analytics converges the power of Google Cloud AI with the immutable trust of Ethereum —
          delivering enterprise intelligence platforms that predict, automate, and verify at scale.
        </p>

        <div className="hero-ctas reveal stagger-4">
          <Link to="/products" className="btn btn-primary">Explore Products →</Link>
          <Link to="/contact" className="btn btn-ghost">Book a Demo</Link>
        </div>

        <div className="hero-stats reveal stagger-5">
          {STATS.map(s => (
            <div className="hero-stat" key={s.label}>
              <div className="hero-stat-value">
                <CountUp target={s.value} suffix={s.suffix} />
              </div>
              <div className="hero-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="hero-scroll-hint">
        <div className="scroll-line" />
        <span>SCROLL</span>
      </div>
    </section>
  );
}
