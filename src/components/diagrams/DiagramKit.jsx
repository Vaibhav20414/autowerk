import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TONES = {
  base: { fill: '#18181B', stroke: '#3F3F46', text: '#F4F4F5', sub: '#A1A1AA' },
  core: { fill: '#202024', stroke: '#71717A', text: '#F4F4F5', sub: '#A1A1AA' },
  human: { fill: '#2A2A2F', stroke: '#C4C4CB', text: '#F4F4F5', sub: '#B4B4BC' },
  alert: { fill: '#0F0F11', stroke: '#A1A1AA', text: '#F4F4F5', sub: '#A1A1AA', dash: '5 4' },
  tool: { fill: '#131316', stroke: '#52525B', text: '#E4E4E7', sub: '#A1A1AA' },
  done: { fill: '#F4F4F5', stroke: '#F4F4F5', text: '#09090B', sub: '#3F3F46' },
};

export function DiagramFrame({ width, height, minWidth = 820, label, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: { trigger: ref.current, start: 'top 70%' },
      });
      tl.from('.dg-node', { y: 14, opacity: 0, duration: 0.6, stagger: 0.08 })
        .fromTo(
          '.dg-draw',
          { strokeDashoffset: 1, opacity: 0 },
          { strokeDashoffset: 0, opacity: 1, duration: 0.8, stagger: 0.05, ease: 'power2.inOut' },
          0.3
        )
        .from('.dg-fade', { opacity: 0, duration: 0.8, stagger: 0.05 }, '>-0.4')
        .from('.dg-label', { opacity: 0, duration: 0.5, stagger: 0.04 }, '<');
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      className="overflow-x-auto rounded-[2rem] border border-paper bg-surface p-4 md:p-8"
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={label}
        className="w-full h-auto"
        style={{ minWidth }}
      >
        <defs>
          <marker
            id="dg-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto"
          >
            <path d="M0 0 L10 5 L0 10 z" fill="#8A8A93" />
          </marker>
        </defs>
        {children}
      </svg>
    </div>
  );
}

export function Node({ x, y, w, h, title, sub, tone = 'base' }) {
  const t = TONES[tone];
  const cy = y + h / 2;
  return (
    <g className="dg-node">
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={16}
        fill={t.fill}
        stroke={t.stroke}
        strokeWidth="1.25"
        strokeDasharray={t.dash}
      />
      <text
        x={x + w / 2}
        y={sub ? cy - 4 : cy + 5}
        textAnchor="middle"
        fill={t.text}
        className="font-heading"
        fontSize="14"
        fontWeight="600"
      >
        {title}
      </text>
      {sub && (
        <text
          x={x + w / 2}
          y={cy + 15}
          textAnchor="middle"
          fill={t.sub}
          className="font-mono"
          fontSize="10.5"
        >
          {sub}
        </text>
      )}
    </g>
  );
}

export function Diamond({ cx, cy, hw, hh, title }) {
  const t = TONES.human;
  return (
    <g className="dg-node">
      <polygon
        points={`${cx},${cy - hh} ${cx + hw},${cy} ${cx},${cy + hh} ${cx - hw},${cy}`}
        fill={t.fill}
        stroke={t.stroke}
        strokeWidth="1.25"
      />
      <text
        x={cx}
        y={cy + 5}
        textAnchor="middle"
        fill={t.text}
        className="font-heading"
        fontSize="13"
        fontWeight="600"
      >
        {title}
      </text>
    </g>
  );
}

export function Edge({ d, dashed = false, arrow = true, color }) {
  const marker = arrow ? 'url(#dg-arrow)' : undefined;
  if (dashed) {
    return (
      <path
        className="dg-fade"
        d={d}
        fill="none"
        stroke={color || '#6B6B74'}
        strokeWidth="1.25"
        strokeDasharray="5 5"
        markerEnd={marker}
      />
    );
  }
  return (
    <path
      className="dg-draw"
      d={d}
      pathLength="1"
      strokeDasharray="1"
      fill="none"
      stroke={color || '#8A8A93'}
      strokeWidth="1.5"
      strokeLinejoin="round"
      markerEnd={marker}
    />
  );
}

export function EdgeLabel({ x, y, children, anchor = 'middle', rotate }) {
  return (
    <text
      className="dg-label font-mono"
      x={x}
      y={y}
      textAnchor={anchor}
      fontSize="10.5"
      fill="#A1A1AA"
      transform={rotate ? `rotate(${rotate} ${x} ${y})` : undefined}
    >
      {children}
    </text>
  );
}

export function Legend({ x, y, w, h, items, note }) {
  const itemW = (w - 48) / items.length;
  return (
    <g className="dg-label">
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={20}
        fill="none"
        stroke="#2A2A2E"
        strokeWidth="1"
      />
      {items.map((item, i) => {
        const t = TONES[item.tone];
        const ix = x + 24 + i * itemW;
        return (
          <g key={item.label}>
            <rect
              x={ix}
              y={y + 20}
              width="16"
              height="16"
              rx="5"
              fill={t.fill}
              stroke={t.stroke}
              strokeWidth="1.25"
              strokeDasharray={t.dash}
            />
            <text
              x={ix + 24}
              y={y + 32}
              fill="#D4D4D8"
              className="font-heading"
              fontSize="12"
            >
              {item.label}
            </text>
          </g>
        );
      })}
      {note && (
        <text
          x={x + 24}
          y={y + h - 16}
          fill="#8A8A93"
          className="font-mono"
          fontSize="10.5"
        >
          {note}
        </text>
      )}
    </g>
  );
}
