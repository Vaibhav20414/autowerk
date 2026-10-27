import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import HeroGraph from './HeroGraph';

export default function Hero() {
  const heroRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('.hero-line-1', { y: 40, opacity: 0, duration: 1 })
        .from('.hero-line-2', { y: 50, opacity: 0, duration: 1.2 }, '-=0.6')
        .from('.hero-desc', { y: 30, opacity: 0, duration: 0.8 }, '-=0.5')
        .from('.hero-cta', {
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.08,
        }, '-=0.4');
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative h-[100dvh] flex items-end overflow-hidden"
    >
      {/* Animated workflow graph */}
      <div className="absolute inset-0 bg-canvas">
        <HeroGraph />
        <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/40 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_85%,rgba(15,15,17,0.85),transparent_60%)]" />
      </div>

      {/* Content — bottom-left third */}
      <div className="relative z-10 px-6 md:px-16 pb-16 md:pb-24 max-w-4xl">
        <h1 className="hero-line-1 font-heading font-bold text-offwhite text-3xl sm:text-5xl md:text-6xl tracking-tight leading-none mb-2">
          Automate the
        </h1>
        <h1 className="hero-line-2 font-drama italic text-offwhite text-6xl sm:text-8xl md:text-[11rem] leading-[0.85] tracking-tight mb-6">
          Workflow.
        </h1>
        <p className="hero-desc font-heading text-offwhite/50 text-base sm:text-lg md:text-xl max-w-lg mb-8">
          Engineering automated systems that eliminate operational friction for
          modern businesses.
        </p>
        <div className="flex flex-wrap gap-4">
          <a
            href="#work"
            className="hero-cta btn-magnetic px-7 py-3.5 sm:px-8 sm:py-4 rounded-full bg-beige text-ink font-heading font-semibold text-sm tracking-tight relative overflow-hidden"
          >
            <span className="btn-bg bg-offwhite rounded-full" />
            <span className="relative z-10">See My Work</span>
          </a>
          <a
            href="#contact"
            className="hero-cta btn-magnetic px-7 py-3.5 sm:px-8 sm:py-4 rounded-full border border-offwhite/30 text-offwhite font-heading font-semibold text-sm tracking-tight hover:border-beige hover:text-beige transition-colors"
          >
            Book a Consultation
          </a>
        </div>
      </div>
    </section>
  );
}
