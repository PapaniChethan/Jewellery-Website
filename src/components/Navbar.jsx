import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import logoMark from '../images/Logo/logo-chocolate.png';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

/**
 * Navbar
 * -------------------------------------------------------------------------
 * Sticky/fixed navbar that gains a background + tightens its padding once
 * the page has scrolled (see .nav--scrolled in global.css). On mobile it
 * swaps to an animated hamburger that opens a full-screen menu.
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu whenever the route changes.
  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    if (!open) return;
    gsap.fromTo(
      '.mobile-menu a',
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out', delay: 0.1 }
    );
  }, [open]);

  return (
    <>
      <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
        <Link to="/" className="nav__logo">
          <img className="nav__logo-mark" src={logoMark} alt="" width="476" height="440" decoding="async" />
          <span className="gold-text">Sri Ranganatha Jewellery</span>
        </Link>

        <nav className="nav__links" aria-label="Primary">
          {LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'} className={({ isActive }) => (isActive ? 'active' : '')}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav__right">
          <Link to="/shop" className="btn btn--solid">
            Shop Now
          </Link>
          <button
            className={`nav__burger ${open ? 'is-open' : ''}`}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {open && (
        <div className="mobile-menu" role="dialog" aria-modal="true">
          {LINKS.map((link) => (
            <Link key={link.to} to={link.to} className="gold-text">
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
