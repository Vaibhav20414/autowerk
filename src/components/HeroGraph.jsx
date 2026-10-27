import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const GREY = [161, 161, 170];
const BEIGE = [232, 216, 183];
const PACKET_RGB = '244,244,245';

const REACH = 170;
const REPEL = 6500;
const K_HOME = 14;
const K_EDGE = 7;
const DAMPING = 3.4;
const GHOST_AFTER_MS = 3000;

const mix = (g) =>
  GREY.map((c, i) => Math.round(c + (BEIGE[i] - c) * g)).join(',');

function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildGraph(w, h, count) {
  const rand = mulberry32(11);
  const cols = Math.max(4, Math.round(Math.sqrt(count * (w / h))));
  const rows = Math.max(4, Math.ceil(count / cols));
  const nodes = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const nx = (c + 0.5 + (rand() - 0.5) * 0.7) / cols;
      const ny = (r + 0.5 + (rand() - 0.5) * 0.7) / rows;
      if (nx < 0.55 && ny > 0.5 && rand() < 0.7) continue;
      nodes.push({
        nx,
        ny,
        phase: rand() * Math.PI * 2,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        hx: 0,
        hy: 0,
        ax: 0,
        ay: 0,
        glow: 0,
        pulse: 0,
      });
    }
  }

  const aspect = w / h;
  const dist = (a, b) => Math.hypot((a.nx - b.nx) * aspect, a.ny - b.ny);
  const seen = new Set();
  const edges = [];
  const adj = nodes.map(() => []);

  nodes.forEach((n, i) => {
    nodes
      .map((m, j) => ({ j, d: i === j ? Infinity : dist(n, m) }))
      .sort((p, q) => p.d - q.d)
      .slice(0, 3)
      .forEach(({ j }) => {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (seen.has(key)) return;
        seen.add(key);
        adj[i].push(edges.length);
        adj[j].push(edges.length);
        edges.push({ a: i, b: j, rest: 0 });
      });
  });

  const packets = [];
  const packetCount = Math.round(nodes.length * 0.5);
  for (let k = 0; k < packetCount; k++) {
    const edge = edges[Math.floor(rand() * edges.length)];
    const forward = rand() > 0.5;
    packets.push({
      edge,
      from: forward ? edge.a : edge.b,
      to: forward ? edge.b : edge.a,
      t: rand(),
      speed: 70 + rand() * 60,
    });
  }

  return { nodes, edges, adj, packets };
}

export default function HeroGraph() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx2d = canvas.getContext('2d');
    const parent = canvas.parentElement;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = parent.clientWidth;
    let h = parent.clientHeight;
    const graph = buildGraph(w, h, w < 768 ? 26 : 48);
    const real = { cx: -9999, cy: -9999, vx: 0, vy: 0, lastMove: -Infinity, lastT: 0 };
    const ghost = { x: 0, y: 0, px: 0, py: 0 };
    const ripples = [];
    let ptr = { x: 0, y: 0, vx: 0, vy: 0, active: false };
    let raf = 0;
    let last = 0;
    let time = 0;
    let visible = true;

    const layoutHomes = () => {
      graph.nodes.forEach((n) => {
        n.hx = n.nx * w + Math.sin(time * 0.25 + n.phase) * 5;
        n.hy = n.ny * h + Math.cos(time * 0.2 + n.phase) * 5;
      });
    };

    const resetPositions = () => {
      layoutHomes();
      graph.nodes.forEach((n) => {
        n.x = n.hx;
        n.y = n.hy;
        n.vx = 0;
        n.vy = 0;
      });
      graph.edges.forEach((e) => {
        const a = graph.nodes[e.a];
        const b = graph.nodes[e.b];
        e.rest = Math.hypot(a.nx * w - b.nx * w, a.ny * h - b.ny * h);
      });
    };

    const resize = () => {
      w = parent.clientWidth;
      h = parent.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
      resetPositions();
      if (reduceMotion) draw();
    };

    function draw() {
      const { nodes, edges, packets } = graph;
      ctx2d.clearRect(0, 0, w, h);

      if (ptr.active) {
        const glow = ctx2d.createRadialGradient(ptr.x, ptr.y, 0, ptr.x, ptr.y, REACH * 1.2);
        glow.addColorStop(0, `rgba(${mix(1)},0.2)`);
        glow.addColorStop(1, `rgba(${mix(1)},0)`);
        ctx2d.fillStyle = glow;
        ctx2d.fillRect(ptr.x - REACH * 1.2, ptr.y - REACH * 1.2, REACH * 2.4, REACH * 2.4);
      }

      ctx2d.lineWidth = 1;
      edges.forEach((e) => {
        const a = nodes[e.a];
        const b = nodes[e.b];
        const g = Math.max(a.glow, b.glow);
        const stretch = Math.min(Math.abs(Math.hypot(b.x - a.x, b.y - a.y) - e.rest) / (e.rest || 1), 0.6);
        ctx2d.strokeStyle = `rgba(${mix(g)},${0.14 + g * 0.55 + stretch * 0.3})`;
        ctx2d.beginPath();
        ctx2d.moveTo(a.x, a.y);
        ctx2d.lineTo(b.x, b.y);
        ctx2d.stroke();
      });

      nodes.forEach((n) => {
        const col = mix(n.glow);
        if (n.pulse > 0) {
          ctx2d.strokeStyle = `rgba(${col},${n.pulse * 0.55})`;
          ctx2d.beginPath();
          ctx2d.arc(n.x, n.y, 4 + (1 - n.pulse) * 20, 0, Math.PI * 2);
          ctx2d.stroke();
        }
        ctx2d.strokeStyle = `rgba(${col},${0.28 + n.glow * 0.5})`;
        ctx2d.beginPath();
        ctx2d.arc(n.x, n.y, 5.5 + n.glow * 4, 0, Math.PI * 2);
        ctx2d.stroke();
        ctx2d.fillStyle = `rgba(${col},0.92)`;
        ctx2d.beginPath();
        ctx2d.arc(n.x, n.y, 2.2 + n.glow * 2, 0, Math.PI * 2);
        ctx2d.fill();
      });

      packets.forEach((k) => {
        const a = nodes[k.from];
        const b = nodes[k.to];
        const x = a.x + (b.x - a.x) * k.t;
        const y = a.y + (b.y - a.y) * k.t;
        const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
        const tx = x - ((b.x - a.x) / len) * 24;
        const ty = y - ((b.y - a.y) / len) * 24;

        const grad = ctx2d.createLinearGradient(tx, ty, x, y);
        grad.addColorStop(0, `rgba(${PACKET_RGB},0)`);
        grad.addColorStop(1, `rgba(${PACKET_RGB},0.65)`);
        ctx2d.strokeStyle = grad;
        ctx2d.lineWidth = 1.5;
        ctx2d.beginPath();
        ctx2d.moveTo(tx, ty);
        ctx2d.lineTo(x, y);
        ctx2d.stroke();

        ctx2d.shadowColor = `rgba(${PACKET_RGB},0.9)`;
        ctx2d.shadowBlur = 12;
        ctx2d.fillStyle = `rgb(${PACKET_RGB})`;
        ctx2d.beginPath();
        ctx2d.arc(x, y, 2, 0, Math.PI * 2);
        ctx2d.fill();
        ctx2d.shadowBlur = 0;
      });

      ripples.forEach((r) => {
        ctx2d.strokeStyle = `rgba(${mix(1)},${(1 - r.t) * 0.7})`;
        ctx2d.lineWidth = 2;
        ctx2d.beginPath();
        ctx2d.arc(r.x, r.y, r.t * 380, 0, Math.PI * 2);
        ctx2d.stroke();
      });
    }

    function resolvePointer(now, dt) {
      const rect = canvas.getBoundingClientRect();
      const px = real.cx - rect.left;
      const py = real.cy - rect.top;
      const inside = px >= 0 && py >= 0 && px <= w && py <= h;

      if (inside && now - real.lastMove < GHOST_AFTER_MS) {
        real.vx *= Math.exp(-dt * 6);
        real.vy *= Math.exp(-dt * 6);
        ptr = { x: px, y: py, vx: real.vx, vy: real.vy, active: true };
        return;
      }

      ghost.px = ghost.x;
      ghost.py = ghost.y;
      ghost.x = w * 0.64 + Math.sin(time * 0.55) * w * 0.24;
      ghost.y = h * 0.38 + Math.cos(time * 0.4) * h * 0.2;
      ptr = {
        x: ghost.x,
        y: ghost.y,
        vx: dt ? (ghost.x - ghost.px) / dt : 0,
        vy: dt ? (ghost.y - ghost.py) / dt : 0,
        active: true,
      };
    }

    function step(dt, now) {
      const { nodes, edges, adj, packets } = graph;
      time += dt;
      layoutHomes();
      resolvePointer(now, dt);

      const sub = 2;
      const hs = dt / sub;
      for (let s = 0; s < sub; s++) {
        nodes.forEach((n) => {
          n.ax = (n.hx - n.x) * K_HOME - n.vx * DAMPING;
          n.ay = (n.hy - n.y) * K_HOME - n.vy * DAMPING;
        });

        edges.forEach((e) => {
          const a = nodes[e.a];
          const b = nodes[e.b];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const d = Math.hypot(dx, dy) || 1;
          const f = (d - e.rest) * K_EDGE;
          a.ax += (dx / d) * f;
          a.ay += (dy / d) * f;
          b.ax -= (dx / d) * f;
          b.ay -= (dy / d) * f;
        });

        nodes.forEach((n) => {
          const dx = n.x - ptr.x;
          const dy = n.y - ptr.y;
          const d = Math.hypot(dx, dy);
          if (d < REACH && d > 0.001) {
            const t = 1 - d / REACH;
            n.ax += (dx / d) * t * t * REPEL + ptr.vx * t * 1.2;
            n.ay += (dy / d) * t * t * REPEL + ptr.vy * t * 1.2;
          }
          n.vx += n.ax * hs;
          n.vy += n.ay * hs;
          n.x += n.vx * hs;
          n.y += n.vy * hs;
        });
      }

      nodes.forEach((n) => {
        const d = Math.hypot(n.x - ptr.x, n.y - ptr.y);
        const target = Math.max(0, 1 - d / (REACH * 1.7));
        n.glow += (target - n.glow) * Math.min(1, dt * 8);
        n.pulse = Math.max(0, n.pulse - dt * 1.2);
      });

      for (let i = ripples.length - 1; i >= 0; i--) {
        ripples[i].t += dt * 1.4;
        if (ripples[i].t >= 1) ripples.splice(i, 1);
      }

      packets.forEach((k) => {
        const a = nodes[k.from];
        const b = nodes[k.to];
        const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
        k.t += (k.speed * dt) / len;
        if (k.t < 1) return;

        b.pulse = 1;
        const here = k.to;
        const options = adj[here].filter((ei) => edges[ei] !== k.edge);
        const pool = options.length ? options : adj[here];
        const next = edges[pool[Math.floor(Math.random() * pool.length)]];
        k.edge = next;
        k.from = here;
        k.to = next.a === here ? next.b : next.a;
        k.t = 0;
        k.speed = 70 + Math.random() * 60;
      });
    }

    function tick(now) {
      const dt = last ? Math.min((now - last) / 1000, 0.033) : 0;
      last = now;
      if (dt) step(dt, now);
      draw();
      raf = requestAnimationFrame(tick);
    }

    const start = () => {
      if (reduceMotion || raf || !visible || document.hidden) return;
      last = 0;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const onMove = (e) => {
      const now = performance.now();
      const dt = Math.max((now - real.lastT) / 1000, 0.008);
      if (real.lastMove > -Infinity) {
        real.vx += ((e.clientX - real.cx) / dt - real.vx) * 0.25;
        real.vy += ((e.clientY - real.cy) / dt - real.vy) * 0.25;
      }
      real.cx = e.clientX;
      real.cy = e.clientY;
      real.lastT = now;
      real.lastMove = now;
    };

    const onDown = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || y < 0 || x > w || y > h) return;
      real.cx = e.clientX;
      real.cy = e.clientY;
      real.lastMove = performance.now();
      ripples.push({ x, y, t: 0 });
      graph.nodes.forEach((n) => {
        const dx = n.x - x;
        const dy = n.y - y;
        const d = Math.hypot(dx, dy) || 1;
        if (d < 340) {
          const f = (1 - d / 340) * 900;
          n.vx += (dx / d) * f;
          n.vy += (dy / d) * f;
          n.pulse = 1;
        }
      });
    };

    const onVisibility = () => (document.hidden ? stop() : start());

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(parent);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    intersection.observe(parent);

    resize();
    draw();
    if (!reduceMotion) {
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerdown', onDown);
      document.addEventListener('visibilitychange', onVisibility);
      start();
    }

    const gsapCtx = gsap.context(() => {
      gsap.from(canvas, { opacity: 0, duration: 1.5, ease: 'power3.out' });
    }, parent);

    return () => {
      stop();
      resizeObserver.disconnect();
      intersection.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      document.removeEventListener('visibilitychange', onVisibility);
      gsapCtx.revert();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0" />;
}
