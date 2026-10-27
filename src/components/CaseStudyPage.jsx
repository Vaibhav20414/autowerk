import { useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft } from 'lucide-react';
import { getCaseStudy } from '../data/caseStudies';
import SystemFlowDiagram from './diagrams/SystemFlowDiagram';
import AgentStateDiagram from './diagrams/AgentStateDiagram';

gsap.registerPlugin(ScrollTrigger);

const DIAGRAMS = {
  'system-flow': SystemFlowDiagram,
  'agent-states': AgentStateDiagram,
};

function NotFound() {
  return (
    <main className="min-h-[70dvh] flex flex-col items-center justify-center text-center px-6 pt-32 pb-24">
      <span className="font-mono text-xs text-signal tracking-widest uppercase">404</span>
      <h1 className="font-heading font-bold text-offwhite text-4xl md:text-6xl tracking-tight mt-3 mb-6">
        Case study not found
      </h1>
      <Link
        to="/#case-studies"
        className="hover-lift font-heading text-offwhite/60 hover:text-offwhite inline-flex items-center gap-2 transition-colors"
      >
        <ArrowLeft size={16} /> All case studies
      </Link>
    </main>
  );
}

function SectionHeading({ eyebrow, title }) {
  return (
    <div className="cs-reveal mb-10">
      <span className="font-mono text-xs text-signal tracking-widest uppercase">{eyebrow}</span>
      <h2 className="font-heading font-bold text-offwhite text-3xl md:text-5xl tracking-tight mt-3">
        {title}
      </h2>
    </div>
  );
}

export default function CaseStudyPage() {
  const { slug } = useParams();
  const study = getCaseStudy(slug);
  const ref = useRef(null);

  useEffect(() => {
    if (!study) return;
    const ctx = gsap.context(() => {
      gsap.from('.cs-head', {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: 'power3.out',
      });
      gsap.utils.toArray('.cs-reveal').forEach((el) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
        });
      });
      gsap.utils.toArray('.cs-stagger').forEach((group) => {
        gsap.from(group.children, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: group, start: 'top 80%' },
        });
      });
    }, ref);
    return () => ctx.revert();
  }, [study]);

  if (!study) return <NotFound />;

  return (
    <main ref={ref} className="pt-32 md:pt-40">
      {/* Header */}
      <header className="px-6 md:px-16 pb-20 md:pb-28 max-w-6xl">
        <Link
          to="/#case-studies"
          className="cs-head hover-lift font-mono text-xs text-offwhite/50 hover:text-offwhite inline-flex items-center gap-2 transition-colors mb-10"
        >
          <ArrowLeft size={14} /> All case studies
        </Link>
        <span className="cs-head block font-mono text-xs text-signal tracking-widest uppercase">
          {study.eyebrow}
        </span>
        <h1 className="cs-head font-heading font-bold text-offwhite text-5xl sm:text-6xl md:text-8xl tracking-tight leading-[0.95] mt-4 mb-6">
          {study.title}
        </h1>
        <p className="cs-head font-heading text-offwhite/60 text-lg md:text-2xl leading-relaxed max-w-3xl mb-8">
          {study.summary}
        </p>
        <div className="cs-head flex flex-wrap items-center gap-x-8 gap-y-3">
          <div>
            <span className="block font-mono text-[10px] text-offwhite/40 tracking-widest uppercase">
              Client
            </span>
            <span className="font-heading text-offwhite text-sm">{study.client}</span>
          </div>
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
        </div>
      </header>

      {/* Problem / Solution */}
      <section className="px-6 md:px-16 pb-24 md:pb-32">
        <div className="cs-stagger grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface border border-paper rounded-[2rem] p-6 sm:p-10">
            <span className="font-mono text-xs text-signal tracking-widest uppercase">
              The problem
            </span>
            <p className="font-heading text-offwhite/70 text-base md:text-lg leading-relaxed mt-4">
              {study.problem}
            </p>
          </div>
          <div className="bg-surface border border-paper rounded-[2rem] p-6 sm:p-10">
            <span className="font-mono text-xs text-signal tracking-widest uppercase">
              The system
            </span>
            <p className="font-heading text-offwhite/70 text-base md:text-lg leading-relaxed mt-4">
              {study.solution}
            </p>
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section className="px-6 md:px-16 pb-24 md:pb-32">
        <SectionHeading eyebrow="What it delivers" title="Outcomes" />
        <div className="cs-stagger grid grid-cols-1 md:grid-cols-3 gap-6">
          {study.outcomes.map((o, i) => (
            <div
              key={o.title}
              className="bg-surface border border-paper rounded-[2rem] p-6 sm:p-8"
            >
              <span className="font-mono text-xs text-signal tracking-widest">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="font-heading font-bold text-offwhite text-xl tracking-tight mt-3 mb-2">
                {o.title}
              </h3>
              <p className="font-heading text-offwhite/50 text-sm leading-relaxed">{o.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-ink py-24 md:py-32 px-6 md:px-16">
        <SectionHeading eyebrow="Under the hood" title="How it works" />
        <ol className="cs-stagger grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-4">
          {study.howItWorks.map((step, i) => (
            <li key={step.title} className="border-t border-paper pt-5">
              <span className="font-mono text-xs text-signal tracking-widest">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="font-heading font-bold text-offwhite text-lg tracking-tight mt-2 mb-2">
                {step.title}
              </h3>
              <p className="font-heading text-offwhite/50 text-sm leading-relaxed">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Diagrams */}
      <section className="px-6 md:px-16 py-24 md:py-32 space-y-20">
        {study.diagrams.map((d) => {
          const Diagram = DIAGRAMS[d.key];
          if (!Diagram) return null;
          return (
            <div key={d.key}>
              <SectionHeading eyebrow="Architecture" title={d.title} />
              <p className="cs-reveal font-heading text-offwhite/50 text-base md:text-lg leading-relaxed max-w-2xl -mt-4 mb-8">
                {d.caption}
              </p>
              <Diagram />
            </div>
          );
        })}
      </section>

      {/* Stack */}
      <section className="px-6 md:px-16 pb-24 md:pb-32">
        <SectionHeading eyebrow="Built with" title="Stack" />
        <div className="cs-reveal flex flex-wrap gap-3">
          {study.stack.map((item) => (
            <span
              key={item}
              className="font-mono text-xs text-offwhite/70 bg-surface border border-paper rounded-full px-4 py-2"
            >
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-16 pb-32 md:pb-48">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="cs-reveal font-heading font-bold text-offwhite text-4xl sm:text-5xl md:text-6xl tracking-tight mb-6">
            Want a system like this?
          </h2>
          <p className="cs-reveal font-heading text-offwhite/50 text-base md:text-xl max-w-lg mx-auto mb-10">
            Let&apos;s map your workflows and build something that runs itself.
          </p>
          <Link
            to="/#contact"
            className="cs-reveal btn-magnetic inline-flex px-9 py-4 md:px-10 md:py-5 rounded-full bg-beige text-ink font-heading font-semibold text-sm md:text-base tracking-tight relative overflow-hidden"
          >
            <span className="btn-bg bg-offwhite rounded-full" />
            <span className="relative z-10">Book a Consultation</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
