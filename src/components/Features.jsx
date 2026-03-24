import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Zap, Link2, Settings } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

/* ——————————————————————————————————————————
   Card 1 — Diagnostic Shuffler
   ——————————————————————————————————————————*/
function DiagnosticShuffler() {
  const subLabels = ['Task Routing', 'Error Handling', 'Queue Management'];
  const [order, setOrder] = useState([0, 1, 2]);

  useEffect(() => {
    const id = setInterval(() => {
      setOrder((prev) => {
        const next = [...prev];
        next.unshift(next.pop());
        return next;
      });
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-offwhite border border-paper rounded-[2rem] p-6 sm:p-8 shadow-sm h-full">
      <div className="flex items-center gap-2 mb-2">
        <Zap size={18} className="text-signal" />
        <span className="font-heading font-semibold text-ink text-sm tracking-tight">
          Workflow Automation
        </span>
      </div>
      <p className="font-heading text-ink/50 text-sm mb-8">
        Intelligent task routing and queue management that runs 24/7.
      </p>

      <div className="relative h-40">
        {order.map((cardIdx, stackPos) => (
          <div
            key={cardIdx}
            className="absolute left-0 right-0 bg-white rounded-xl p-4 border border-paper/80"
            style={{
              top: stackPos * 14,
              zIndex: 3 - stackPos,
              opacity: 1 - stackPos * 0.25,
              transform: `scale(${1 - stackPos * 0.04})`,
              transition:
                'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-ink/60">
                {subLabels[cardIdx]}
              </span>
              <span className="text-[10px] font-mono text-signal font-bold tracking-wider">
                ACTIVE
              </span>
            </div>
            <div className="mt-3 h-1.5 bg-paper rounded-full overflow-hidden">
              <div
                className="h-full bg-signal/40 rounded-full transition-all duration-1000"
                style={{ width: `${55 + cardIdx * 18}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ——————————————————————————————————————————
   Card 2 — Telemetry Typewriter
   ——————————————————————————————————————————*/
const MESSAGES = [
  '→ Syncing CRM → ERP pipeline...',
  '→ API bridge: Slack ↔ Salesforce',
  '→ Webhook deployed: 12ms latency',
  '→ Batch processor: 2,847 rec/min',
  '→ OAuth 2.0 token refresh: OK',
  '→ Data transform: CSV → JSON ✓',
];

function TelemetryTypewriter() {
  const [lines, setLines] = useState([]);
  const [msgIdx, setMsgIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    const msg = MESSAGES[msgIdx];
    if (charIdx < msg.length) {
      const t = setTimeout(() => {
        setDisplayText((p) => p + msg[charIdx]);
        setCharIdx((p) => p + 1);
      }, 35);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setLines((p) => [...p.slice(-3), msg]);
      setDisplayText('');
      setCharIdx(0);
      setMsgIdx((p) => (p + 1) % MESSAGES.length);
    }, 1200);
    return () => clearTimeout(t);
  }, [charIdx, msgIdx]);

  return (
    <div className="bg-offwhite border border-paper rounded-[2rem] p-6 sm:p-8 shadow-sm h-full">
      <div className="flex items-center gap-2 mb-2">
        <Link2 size={18} className="text-signal" />
        <span className="font-heading font-semibold text-ink text-sm tracking-tight">
          Custom Integrations
        </span>
      </div>
      <p className="font-heading text-ink/50 text-sm mb-4">
        Connecting your tools into a unified, real-time data pipeline.
      </p>

      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-signal pulse-dot" />
        <span className="font-mono text-[10px] text-signal font-bold tracking-wider">
          LIVE FEED
        </span>
      </div>

      <div className="bg-ink rounded-xl p-4 h-[152px] overflow-hidden">
        <div className="font-mono text-xs leading-relaxed space-y-1">
          {lines.map((line, i) => (
            <div key={i} className="text-offwhite/30">
              {line}
            </div>
          ))}
          <div className="text-offwhite">
            {displayText}
            <span className="blink text-signal">█</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ——————————————————————————————————————————
   Card 3 — Cursor Protocol Scheduler
   ——————————————————————————————————————————*/
const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function CursorScheduler() {
  const [activeDays, setActiveDays] = useState([1, 3]);
  const [cursorPos, setCursorPos] = useState({ x: -30, y: -30 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const [pressing, setPressing] = useState(-1);
  const running = useRef(false);

  useEffect(() => {
    const run = () => {
      if (running.current) return;
      running.current = true;

      const pool = [0, 2, 4, 5, 6].filter((d) => !activeDays.includes(d));
      const target = pool.length > 0 ? pool[0] : 4;

      setCursorVisible(true);
      setCursorPos({ x: 240, y: -10 });

      setTimeout(() => setCursorPos({ x: target * 36 + 16, y: 16 }), 400);
      setTimeout(() => setPressing(target), 800);
      setTimeout(() => {
        setPressing(-1);
        setActiveDays((p) =>
          p.includes(target) ? p : [...p, target]
        );
      }, 1050);
      setTimeout(() => setCursorPos({ x: 60, y: 60 }), 1400);
      setTimeout(() => {
        setCursorVisible(false);
        running.current = false;
      }, 2200);
    };

    const t1 = setTimeout(run, 800);
    const iv = setInterval(run, 4000);
    return () => {
      clearTimeout(t1);
      clearInterval(iv);
    };
  }, [activeDays]);

  return (
    <div className="bg-offwhite border border-paper rounded-[2rem] p-6 sm:p-8 shadow-sm h-full">
      <div className="flex items-center gap-2 mb-2">
        <Settings size={18} className="text-signal" />
        <span className="font-heading font-semibold text-ink text-sm tracking-tight">
          Process Optimization
        </span>
      </div>
      <p className="font-heading text-ink/50 text-sm mb-8">
        Streamlined scheduling and resource allocation that adapts in real-time.
      </p>

      <div className="relative">
        <div className="flex gap-1 mb-4">
          {DAYS.map((day, i) => (
            <div
              key={i}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono transition-all duration-300 ${
                activeDays.includes(i)
                  ? 'bg-signal text-offwhite'
                  : 'bg-paper text-ink/40'
              } ${pressing === i ? 'scale-90' : ''}`}
            >
              {day}
            </div>
          ))}
        </div>

        <div className="inline-flex px-4 py-2 rounded-lg bg-ink text-offwhite font-mono text-xs tracking-wide">
          Save Protocol
        </div>

        {/* Animated SVG cursor */}
        <svg
          className="absolute pointer-events-none"
          style={{
            left: cursorPos.x,
            top: cursorPos.y,
            width: 18,
            height: 18,
            transition:
              'left 0.4s cubic-bezier(.4,0,.2,1), top 0.4s cubic-bezier(.4,0,.2,1), opacity 0.25s',
            opacity: cursorVisible ? 1 : 0,
          }}
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M5 3l14 8-6 2-4 7-4-17z"
            fill="#111"
            stroke="#111"
            strokeWidth="1"
          />
        </svg>
      </div>
    </div>
  );
}

/* ——————————————————————————————————————————
   Features Section
   ——————————————————————————————————————————*/
export default function Features() {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.feature-card', {
        y: 60,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 75%',
        },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="work" ref={ref} className="px-6 md:px-16 py-24 md:py-32">
      <div className="mb-14">
        <span className="font-mono text-xs text-signal tracking-widest uppercase">
          What I Build
        </span>
        <h2 className="font-heading font-bold text-ink text-3xl md:text-5xl tracking-tight mt-3">
          Functional Artifacts
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="feature-card">
          <DiagnosticShuffler />
        </div>
        <div className="feature-card">
          <TelemetryTypewriter />
        </div>
        <div className="feature-card">
          <CursorScheduler />
        </div>
      </div>
    </section>
  );
}
