'use client';
import { useEffect, useRef, type CSSProperties } from 'react';

type Props = {
  cellSize?: number;
  color?: string;
  lineOpacity?: number;
  fillOpacity?: number;
  /** Cover the viewport instead of the parent. */
  fixed?: boolean;
  style?: CSSProperties;
};

/** Hairline grid whose cells light under the pointer and fade out behind it. */
export function InteractiveGrid({ cellSize = 40, color = '#006AFF', lineOpacity = 0.1, fillOpacity = 0.15, fixed, style }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current!;
    const c = canvasRef.current!;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const cell = cellSize;
    const FADE = 1000;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0, h = 0, dpr = 1, raf = 0;
    let active: string | null = null;
    const lit = new Map<string, number>();

    const draw = () => {
      raf = 0;
      const now = performance.now();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = color;
      for (const [k, t] of lit) {
        let a;
        if (k === active) a = fillOpacity;
        else {
          const p = (now - t) / FADE;
          if (p >= 1 || reduced) { lit.delete(k); continue; }
          a = fillOpacity * Math.pow(1 - p, 2);
        }
        const [col, row] = k.split(',').map(Number);
        ctx.globalAlpha = a;
        ctx.fillRect(col * cell, row * cell, cell, cell);
      }
      ctx.globalAlpha = lineOpacity;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0.5; x <= w; x += cell) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
      for (let y = 0.5; y <= h; y += cell) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
      ctx.stroke();
      ctx.globalAlpha = 1;
      if ([...lit.keys()].some((k) => k !== active)) raf = requestAnimationFrame(draw);
    };
    const wake = () => { if (!raf) raf = requestAnimationFrame(draw); };
    const resize = () => {
      const r = host.getBoundingClientRect();
      w = r.width || innerWidth;
      h = r.height || innerHeight;
      dpr = Math.min(devicePixelRatio || 1, 2);
      c.width = Math.round(w * dpr);
      c.height = Math.round(h * dpr);
      draw();
    };
    const move = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      const col = Math.floor((e.clientX - r.left) / cell), row = Math.floor((e.clientY - r.top) / cell);
      const k = col >= 0 && row >= 0 && col * cell < r.width && row * cell < r.height ? col + ',' + row : null;
      if (k === active) return;
      if (active) lit.set(active, performance.now());
      active = k;
      if (k) lit.set(k, performance.now());
      wake();
    };
    const leave = () => {
      if (active) lit.set(active, performance.now());
      active = null;
      wake();
    };
    addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();
    return () => {
      removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', leave);
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [cellSize, color, lineOpacity, fillOpacity]);

  return (
    <div ref={hostRef} aria-hidden="true" style={{ ...style, position: fixed ? 'fixed' : 'absolute', inset: 0, display: 'block', pointerEvents: 'none', overflow: 'hidden' }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
    </div>
  );
}
