import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LogoFlat from './LogoFlat';
import useABTest from '../../lib/abtest';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'About',        href: '/about'        },
  { label: 'Products',     href: '/products'     },
  { label: 'Solutions',    href: '/solutions'    },
  { label: 'White Paper',  href: '/whitepaper'   },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'Blog',         href: '/blog'         },
];

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const variant = useABTest('nav_cta');
  const ctaText = variant === 'A' ? 'Book Demo' : 'Try Alpha';

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useLayoutEffect(() => { setMenuOpen(false); }, [location]);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!menuOpen) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;
    if (Math.abs(dy) > Math.abs(dx) && dy > 50) {
      setMenuOpen(false);
    }
  }, [menuOpen]);

  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    menu.addEventListener('touchstart', handleTouchStart, { passive: true });
    menu.addEventListener('touchmove', handleTouchMove, { passive: true });
    return () => {
      menu.removeEventListener('touchstart', handleTouchStart);
      menu.removeEventListener('touchmove', handleTouchMove);
    };
  }, [handleTouchStart, handleTouchMove]);

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="nav-inner">

        {/* ── Logo ── */}
        <Link to="/" className="nav-logo">
          <LogoFlat />
        </Link>

        {/* ── Links ── */}
        <div
          ref={menuRef}
          className={`nav-links${menuOpen ? ' open' : ''}`}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`nav-link${location.pathname === link.href ? ' active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/contact" className={`btn btn-primary nav-cta ${variant === 'B' ? 'nav-cta-variant-b' : ''}`}>{ctaText}</Link>
        </div>

        {/* ── Mobile burger ── */}
        <button
          className={`nav-burger${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>

      </div>
    </nav>
  );
}
