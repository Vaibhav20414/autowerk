import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function WordSpan({ children, className = '' }) {
  return (
    <span className={`phil-word inline-block mr-[0.3em] ${className}`}>
      {children}
    </span>
  );
}

function splitIntoWords(text, className = '') {
  return text.split(' ').map((word, i) => (
    <WordSpan key={i} className={className}>
      {word}
    </WordSpan>
  ));
}

export default function Philosophy() {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray('.phil-word');
      gsap.from(words, {
        y: 20,
        opacity: 0,
        duration: 0.4,
        stagger: 0.06,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 65%',
        },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={ref}
      className="relative py-32 md:py-48 bg-ink overflow-hidden"
    >
      {/* Parallax texture */}
      <div className="absolute inset-0 opacity-[0.07]">
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10 px-6 md:px-16 max-w-5xl">
        <p className="font-heading text-offwhite/35 text-lg md:text-2xl leading-relaxed mb-10">
          {splitIntoWords(
            'Most businesses focus on: patching broken processes with more headcount and manual oversight.'
          )}
        </p>

        <p className="font-heading text-offwhite text-2xl md:text-5xl leading-tight tracking-tight">
          {splitIntoWords('We focus on: engineering')}
          <WordSpan>
            <em className="font-drama text-signal not-italic">systems</em>
          </WordSpan>
          {splitIntoWords('that run')}
          <WordSpan>
            <em className="font-drama text-signal not-italic">themselves.</em>
          </WordSpan>
        </p>
      </div>
    </section>
  );
}
