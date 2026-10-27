import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ——— Visual 1: Rotating Concentric Rings ——— */
function RotatingMotif() {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.proto-ring-1', {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: 'none',
        transformOrigin: 'center',
      });
      gsap.to('.proto-ring-2', {
        rotation: -360,
        duration: 30,
        repeat: -1,
        ease: 'none',
        transformOrigin: 'center',
      });
      gsap.to('.proto-ring-3', {
        rotation: 360,
        duration: 40,
        repeat: -1,
        ease: 'none',
        transformOrigin: 'center',
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <svg
      ref={ref}
      viewBox="0 0 200 200"
      className="w-28 h-28 md:w-40 md:h-40 text-signal drop-shadow-[0_0_8px_rgba(161,161,170,0.6)]"
    >
      <circle
        className="proto-ring-1"
        cx="100"
        cy="100"
        r="90"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="4 8"
      />
      <circle
        className="proto-ring-2"
        cx="100"
        cy="100"
        r="60"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="2 6"
      />
      <circle
        className="proto-ring-3"
        cx="100"
        cy="100"
        r="30"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="1 4"
      />
      <circle cx="100" cy="100" r="3" fill="currentColor" />
    </svg>
  );
}

/* ——— Visual 2: Scanning Laser Line ——— */
function ScanningLaser() {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.proto-laser', {
        y: 140,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="relative w-28 h-28 md:w-40 md:h-40">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {Array.from({ length: 8 }, (_, row) =>
          Array.from({ length: 8 }, (_, col) => (
            <circle
              key={`${row}-${col}`}
              cx={col * 25 + 12.5}
              cy={row * 25 + 12.5}
              r="2.5"
              className="fill-signal/70"
            />
          ))
        )}
      </svg>
      <div className="proto-laser absolute left-0 right-0 top-0 h-0.5 bg-offwhite shadow-[0_0_18px_3px_rgba(244,244,245,0.55)]" />
    </div>
  );
}

/* ——— Visual 3: EKG Waveform ——— */
function PulsingWaveform() {
  const pathRef = useRef(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const len = path.getTotalLength();

    const ctx = gsap.context(() => {
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 2.5,
        repeat: -1,
        ease: 'none',
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <svg viewBox="0 0 240 60" className="w-44 md:w-56 h-14 md:h-16">
      <path
        ref={pathRef}
        d="M0,30 L30,30 L40,10 L50,50 L60,20 L70,40 L80,30 L110,30 L120,5 L130,55 L140,25 L150,35 L160,30 L190,30 L200,15 L210,45 L220,30 L240,30"
        fill="none"
        stroke="#F4F4F5"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: 'drop-shadow(0 0 6px rgba(244,244,245,0.6))' }}
      />
    </svg>
  );
}

/* ——— Protocol Steps Data ——— */
const steps = [
  {
    num: '01',
    title: 'Audit',
    desc: 'Map existing workflows end-to-end. Identify friction points, redundant steps, and automation opportunities across your entire operation.',
    Visual: RotatingMotif,
  },
  {
    num: '02',
    title: 'Architect',
    desc: 'Design automated systems tailored to your business logic. Every integration point, every data flow, every edge case — accounted for.',
    Visual: ScanningLaser,
  },
  {
    num: '03',
    title: 'Deploy',
    desc: 'Build, test, and launch production-ready automations. Monitor, iterate, and scale as your business grows.',
    Visual: PulsingWaveform,
  },
];

/* ——— Protocol Section — Sticky Stacking Archive ——— */
export default function Protocol() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.protocol-card');

      cards.forEach((card, i) => {
        if (i < cards.length - 1) {
          ScrollTrigger.create({
            trigger: card,
            start: 'top top',
            pin: true,
            pinSpacing: false,
            anticipatePin: 1,
            endTrigger: cards[cards.length - 1],
            end: 'top top',
          });

          gsap.to(card.querySelector('.protocol-inner'), {
            scale: 0.94,
            filter: 'blur(6px)',
            opacity: 0.35,
            ease: 'none',
            force3D: true,
            scrollTrigger: {
              trigger: cards[i + 1],
              start: 'top bottom',
              end: 'top top',
              scrub: 1,
            },
          });
        }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="process" ref={containerRef} className="relative">
      {steps.map((step, i) => (
        <div
          key={i}
          className="protocol-card h-screen w-full"
          style={{ position: 'relative', zIndex: i + 1 }}
        >
          <div className="protocol-inner h-full flex items-center justify-center bg-canvas">
            <div className="max-w-4xl w-full mx-auto px-6 md:px-16 flex flex-col md:flex-row items-center gap-8 md:gap-16">
              <div className="flex-1">
                <span className="font-mono text-xs text-signal tracking-widest">
                  {step.num}
                </span>
                <h3 className="font-heading font-bold text-offwhite text-4xl sm:text-5xl md:text-7xl tracking-tight mt-2 mb-4">
                  {step.title}
                </h3>
                <p className="font-heading text-offwhite/50 text-base md:text-lg leading-relaxed max-w-md">
                  {step.desc}
                </p>
              </div>
              <div className="flex-shrink-0">
                <step.Visual />
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
