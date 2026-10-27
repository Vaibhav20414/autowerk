import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { caseStudies } from '../data/caseStudies';

gsap.registerPlugin(ScrollTrigger);

export default function CaseStudies() {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.cs-card', {
        y: 60,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out',
        clearProps: 'transform',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 75%',
        },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="case-studies" ref={ref} className="px-6 md:px-16 pb-24 md:pb-32">
      <div className="mb-14">
        <span className="font-mono text-xs text-signal tracking-widest uppercase">
          Case Studies
        </span>
        <h2 className="font-heading font-bold text-offwhite text-3xl md:text-5xl tracking-tight mt-3">
          Systems in the field
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {caseStudies.map((study) => (
          <Link
            key={study.slug}
            to={`/case-studies/${study.slug}`}
            className="cs-card group hover-lift block bg-surface border border-paper rounded-[2rem] p-6 sm:p-8 shadow-sm hover:border-beige/50 transition-colors"
          >
            <div className="flex items-center justify-between mb-8">
              <span className="font-mono text-[10px] text-signal tracking-widest uppercase">
                {study.eyebrow}
              </span>
              <span className="w-9 h-9 rounded-full border border-paper flex items-center justify-center text-offwhite/60 group-hover:bg-beige group-hover:border-beige group-hover:text-ink transition-colors duration-300">
                <ArrowUpRight size={16} />
              </span>
            </div>
            <h3 className="font-heading font-bold text-offwhite text-2xl md:text-3xl tracking-tight mb-3">
              {study.title}
            </h3>
            <p className="font-heading text-offwhite/50 text-sm md:text-base leading-relaxed mb-6 max-w-xl">
              {study.summary}
            </p>
            <div className="flex flex-wrap gap-2">
              {study.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[10px] text-offwhite/50 border border-paper rounded-full px-3 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
