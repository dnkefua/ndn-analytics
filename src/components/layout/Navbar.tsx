import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo3D from '../three/Logo3D';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'Products',   href: '/products'  },
  { label: 'Solutions',  href: '/solutions' },
  { label: 'Technology', href: '/tech'      },
  { label: 'About',      href: '/about'     },
  { label: 'Contact',    href: '/contact'   },
];

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="nav-inner">

        {/* ── Logo ── */}
        <Link to="/" className="nav-logo">
          <Logo3D />
        </Link>

        {/* ── Links ── */}
        <div className={`nav-links${menuOpen ? ' open' : ''}`}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`nav-link${location.pathname === link.href ? ' active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/contact" className="btn btn-primary nav-cta">Book Demo</Link>
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
