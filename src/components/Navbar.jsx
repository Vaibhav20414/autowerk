import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const links = [
  { label: 'Work', to: '/#work' },
  { label: 'Case Studies', to: '/#case-studies' },
  { label: 'Process', to: '/#process' },
  { label: 'About', to: '/#about' },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const [heroPassed, setHeroPassed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrolled = heroPassed || !isHome;

  useEffect(() => {
    const hero = document.getElementById('hero');
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setHeroPassed(!entry.isIntersecting),
      { threshold: 0.05 }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, [isHome]);

  return (
    <nav
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 rounded-full ${
        scrolled
          ? 'bg-canvas/60 backdrop-blur-xl border border-paper shadow-lg'
          : 'bg-transparent border border-transparent'
      }`}
    >
      <div className="flex items-center gap-4 md:gap-8 px-4 md:px-6 py-2.5">
        {/* Logo */}
        <Link
          to="/"
          className="font-heading font-bold text-base md:text-lg tracking-tight transition-colors whitespace-nowrap text-offwhite"
        >
          AUTOWERK
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="font-heading text-sm tracking-tight hover-lift transition-colors text-offwhite/60 hover:text-offwhite whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <Link
          to="/#contact"
          className="btn-magnetic px-4 md:px-5 py-2 rounded-full text-sm font-heading font-semibold bg-beige text-ink relative overflow-hidden"
        >
          <span className="btn-bg bg-offwhite rounded-full" />
          <span className="relative z-10 whitespace-nowrap">Book a Call</span>
        </Link>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden transition-colors text-offwhite"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 mt-2 bg-canvas/90 backdrop-blur-xl rounded-[1.5rem] border border-paper shadow-lg p-4">
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className="block font-heading text-sm text-offwhite/70 hover:text-offwhite py-2 px-3 rounded-xl hover:bg-paper/50 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
