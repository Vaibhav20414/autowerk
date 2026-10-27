import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const navLinks = [
  { label: 'Work', to: '/#work' },
  { label: 'Case Studies', to: '/#case-studies' },
  { label: 'Process', to: '/#process' },
  { label: 'About', to: '/#about' },
  { label: 'Contact', to: '/#contact' },
];
const socialLinks = ['LinkedIn', 'GitHub', 'Twitter'];

export default function Footer() {
  return (
    <footer className="bg-ink rounded-t-[4rem] px-6 md:px-16 pt-16 md:pt-20 pb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12 mb-16">
        {/* Brand */}
        <div className="md:col-span-2">
          <h3 className="font-heading font-bold text-offwhite text-2xl tracking-tight mb-3">
            AUTOWERK
          </h3>
          <p className="font-heading text-offwhite/35 text-sm max-w-sm leading-relaxed">
            Engineering automated systems that eliminate operational friction for
            modern businesses.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="font-mono text-[10px] text-signal tracking-widest uppercase mb-4 font-bold">
            Navigation
          </h4>
          <ul className="space-y-2.5">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  className="font-heading text-offwhite/40 text-sm hover:text-offwhite hover-lift inline-flex items-center gap-1 transition-colors"
                >
                  {link.label}
                  <ArrowUpRight size={11} />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="font-mono text-[10px] text-signal tracking-widest uppercase mb-4 font-bold">
            Connect
          </h4>
          <ul className="space-y-2.5">
            {socialLinks.map((link) => (
              <li key={link}>
                <a
                  href="#"
                  className="font-heading text-offwhite/40 text-sm hover:text-offwhite hover-lift inline-flex items-center gap-1 transition-colors"
                >
                  {link}
                  <ArrowUpRight size={11} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-offwhite/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-signal pulse-dot" />
          <span className="font-mono text-[11px] text-offwhite/25">
            System Operational
          </span>
        </div>
        <span className="font-mono text-[11px] text-offwhite/15">
          &copy; {new Date().getFullYear()} AUTOWERK. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
