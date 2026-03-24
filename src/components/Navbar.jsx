import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const links = ['Work', 'Process', 'About'];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const hero = document.getElementById('hero');
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0.05 }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 rounded-full ${
        scrolled
          ? 'bg-offwhite/60 backdrop-blur-xl border border-paper shadow-lg'
          : 'bg-transparent border border-transparent'
      }`}
    >
      <div className="flex items-center gap-4 md:gap-8 px-4 md:px-6 py-2.5">
        {/* Logo */}
        <a
          href="#"
          className={`font-heading font-bold text-base md:text-lg tracking-tight transition-colors whitespace-nowrap ${
            scrolled ? 'text-ink' : 'text-offwhite'
          }`}
        >
          AUTOWERK
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className={`font-heading text-sm tracking-tight hover-lift transition-colors ${
                scrolled
                  ? 'text-ink/60 hover:text-ink'
                  : 'text-offwhite/60 hover:text-offwhite'
              }`}
            >
              {link}
            </a>
          ))}
        </div>

        {/* CTA */}
        <a
          href="#contact"
          className="btn-magnetic px-4 md:px-5 py-2 rounded-full text-sm font-heading font-semibold bg-signal text-offwhite relative overflow-hidden"
        >
          <span className="btn-bg bg-ink rounded-full" />
          <span className="relative z-10 whitespace-nowrap">Book a Call</span>
        </a>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`md:hidden transition-colors ${
            scrolled ? 'text-ink' : 'text-offwhite'
          }`}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 mt-2 bg-offwhite/90 backdrop-blur-xl rounded-[1.5rem] border border-paper shadow-lg p-4">
          {links.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              onClick={() => setMobileOpen(false)}
              className="block font-heading text-sm text-ink/70 hover:text-ink py-2 px-3 rounded-xl hover:bg-paper/50 transition-colors"
            >
              {link}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
