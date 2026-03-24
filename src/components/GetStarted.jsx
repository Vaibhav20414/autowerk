import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function GetStarted() {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.gs-reveal', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 70%',
        },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="contact" ref={ref} className="px-6 md:px-16 py-32 md:py-48">
      <div className="max-w-3xl mx-auto text-center">
        <span className="gs-reveal font-mono text-xs text-signal tracking-widest uppercase">
          Get Started
        </span>
        <h2 className="gs-reveal font-heading font-bold text-ink text-4xl sm:text-5xl md:text-7xl tracking-tight mt-4 mb-6">
          Ready to{' '}
          <em className="font-drama not-italic text-signal">automate</em>?
        </h2>
        <p className="gs-reveal font-heading text-ink/50 text-base md:text-xl max-w-lg mx-auto mb-10">
          Let&apos;s map your workflows, find the friction, and build systems
          that run themselves.
        </p>
        <a
          href="#"
          className="gs-reveal btn-magnetic inline-flex px-9 py-4 md:px-10 md:py-5 rounded-full bg-signal text-offwhite font-heading font-semibold text-sm md:text-base tracking-tight relative overflow-hidden"
        >
          <span className="btn-bg bg-ink rounded-full" />
          <span className="relative z-10">Book a Consultation</span>
        </a>
      </div>
    </section>
  );
}
