'use client';

import { useEffect, useRef, useState } from 'react';

interface FluidSimulationProps {
  resolution?: number;
  penSize?: number;
  particleCount?: number;
  particleColor?: string;
}

export default function FluidSimulation({
  resolution = 10,
  penSize = 40,
  particleCount = 5000,
  particleColor = '#3b82f6',
}: FluidSimulationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, px: 0, py: 0, down: false });
  const touchesRef = useRef<Map<number, { x: number; y: number; px: number; py: number }>>(new Map());
  const animationRef = useRef<number | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Resize observer
  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;

    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setDimensions({ width: Math.floor(width), height: Math.floor(height) });
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Simulation
  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0 || dimensions.height === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    if (!ctx) return;

    const mouse = mouseRef.current;
    const w = dimensions.width;
    const h = dimensions.height;
    const numCols = Math.floor(w / resolution);
    const numRows = Math.floor(h / resolution);

    if (numCols < 2 || numRows < 2) return;

    interface Cell {
      x: number; y: number; r: number; col: number; row: number;
      xv: number; yv: number; pressure: number;
      up?: Cell; down?: Cell; left?: Cell; right?: Cell;
      up_left?: Cell; up_right?: Cell; down_left?: Cell; down_right?: Cell;
    }

    interface Particle {
      x: number; y: number; px: number; py: number; xv: number; yv: number;
    }

    const vecCells: Cell[][] = [];
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      particles.push({ x, y, px: x, py: y, xv: 0, yv: 0 });
    }

    for (let col = 0; col < numCols; col++) {
      vecCells[col] = [];
      for (let row = 0; row < numRows; row++) {
        vecCells[col][row] = {
          x: col * resolution, y: row * resolution, r: resolution,
          col, row, xv: 0, yv: 0, pressure: 0,
        };
      }
    }

    // Wire neighbors
    for (let col = 0; col < numCols; col++) {
      for (let row = 0; row < numRows; row++) {
        const c = vecCells[col][row];
        const rowUp = row - 1 >= 0 ? row - 1 : numRows - 1;
        const colLeft = col - 1 >= 0 ? col - 1 : numCols - 1;
        const colRight = col + 1 < numCols ? col + 1 : 0;

        const up = vecCells[col][rowUp];
        const left = vecCells[colLeft][row];
        const upLeft = vecCells[colLeft][rowUp];
        const upRight = vecCells[colRight][rowUp];

        c.up = up; c.left = left; c.up_left = upLeft; c.up_right = upRight;
        up.down = c; left.right = c; upLeft.down_right = c; upRight.down_left = c;
      }
    }

    function changeCellVelocity(cell: Cell, mvx: number, mvy: number, size: number) {
      const dx = cell.x - mouse.x;
      const dy = cell.y - mouse.y;
      let dist = Math.sqrt(dy * dy + dx * dx);
      if (dist < size) {
        if (dist < 4) dist = size;
        const power = size / dist;
        cell.xv += mvx * power;
        cell.yv += mvy * power;
      }
    }

    function updatePressure(c: Cell) {
      c.pressure = (
        (c.up_left!.xv * 0.5 + c.left!.xv + c.down_left!.xv * 0.5
          - c.up_right!.xv * 0.5 - c.right!.xv - c.down_right!.xv * 0.5)
        + (c.up_left!.yv * 0.5 + c.up!.yv + c.up_right!.yv * 0.5
          - c.down_left!.yv * 0.5 - c.down!.yv - c.down_right!.yv * 0.5)
      ) * 0.25;
    }

    function updateVelocity(c: Cell) {
      c.xv += (
        c.up_left!.pressure * 0.5 + c.left!.pressure + c.down_left!.pressure * 0.5
        - c.up_right!.pressure * 0.5 - c.right!.pressure - c.down_right!.pressure * 0.5
      ) * 0.25;
      c.yv += (
        c.up_left!.pressure * 0.5 + c.up!.pressure + c.up_right!.pressure * 0.5
        - c.down_left!.pressure * 0.5 - c.down!.pressure - c.down_right!.pressure * 0.5
      ) * 0.25;
      c.xv *= 0.99;
      c.yv *= 0.99;
    }

    function updateParticles() {
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (p.x >= 0 && p.x < w && p.y >= 0 && p.y < h) {
          const col = Math.floor(p.x / resolution);
          const row = Math.floor(p.y / resolution);
          if (col >= 0 && col < numCols && row >= 0 && row < numRows) {
            const cell = vecCells[col][row];
            const ax = (p.x % resolution) / resolution;
            const ay = (p.y % resolution) / resolution;

            p.xv += (1 - ax) * cell.xv * 0.05;
            p.yv += (1 - ay) * cell.yv * 0.05;
            if (cell.right) { p.xv += ax * cell.right.xv * 0.05; p.yv += ax * cell.right.yv * 0.05; }
            if (cell.down) { p.xv += ay * cell.down.xv * 0.05; p.yv += ay * cell.down.yv * 0.05; }

            p.x += p.xv;
            p.y += p.yv;

            const dx = p.px - p.x;
            const dy = p.py - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const limit = Math.random() * 0.5;

            ctx.lineWidth = 1;
            ctx.beginPath();
            if (dist > limit) {
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p.px, p.py);
            } else {
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p.x + limit, p.y + limit);
            }
            ctx.stroke();

            p.px = p.x;
            p.py = p.y;
          }
        } else {
          p.x = p.px = Math.random() * w;
          p.y = p.py = Math.random() * h;
          p.xv = 0;
          p.yv = 0;
        }
        p.xv *= 0.5;
        p.yv *= 0.5;
      }
    }

    let frame = 0;

    function draw() {
      frame++;
      const time = frame * 0.008;
      const mvx = mouse.x - mouse.px;
      const mvy = mouse.y - mouse.py;

      for (let i = 0; i < vecCells.length; i++) {
        for (let j = 0; j < vecCells[i].length; j++) {
          const cell = vecCells[i][j];
          changeCellVelocity(cell, mvx, mvy, penSize);

          // Ambient flow — gentle drifting force
          const nx = cell.x / w;
          const ny = cell.y / h;
          cell.xv += Math.sin(time + ny * 4) * 0.05;
          cell.yv += Math.cos(time * 0.7 + nx * 4) * 0.05;

          // Touch velocity
          touchesRef.current.forEach((touch) => {
            const txv = touch.x - touch.px;
            const tyv = touch.y - touch.py;
            const dx = cell.x - touch.x;
            const dy = cell.y - touch.y;
            let dist = Math.sqrt(dy * dy + dx * dx);
            if (dist < penSize) {
              if (dist < 4) dist = penSize;
              const power = penSize / dist;
              cell.xv += txv * power;
              cell.yv += tyv * power;
            }
          });

          updatePressure(cell);
        }
      }

      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = particleColor;
      updateParticles();

      for (let i = 0; i < vecCells.length; i++) {
        for (let j = 0; j < vecCells[i].length; j++) {
          updateVelocity(vecCells[i][j]);
        }
      }

      mouse.px = mouse.x;
      mouse.py = mouse.y;
      touchesRef.current.forEach((t) => { t.px = t.x; t.py = t.y; });

      animationRef.current = requestAnimationFrame(draw);
    }

    // --- Event handlers ---
    const rect = () => canvas.getBoundingClientRect();

    const onMouseDown = (e: MouseEvent) => { e.preventDefault(); mouse.down = true; };
    const onMouseUp = () => { mouse.down = false; };
    const onMouseMove = (e: MouseEvent) => {
      const r = rect();
      mouse.px = mouse.x; mouse.py = mouse.y;
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    };

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const r = rect();
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        const x = t.clientX - r.left, y = t.clientY - r.top;
        touchesRef.current.set(t.identifier, { x, y, px: x, py: y });
      }
      if (e.touches.length > 0) {
        mouse.x = mouse.px = e.touches[0].clientX - r.left;
        mouse.y = mouse.py = e.touches[0].clientY - r.top;
        mouse.down = true;
      }
    };
    const onTouchEnd = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) touchesRef.current.delete(e.changedTouches[i].identifier);
      if (!e.touches.length) mouse.down = false;
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const r = rect();
      for (let i = 0; i < e.touches.length; i++) {
        const t = e.touches[i];
        const existing = touchesRef.current.get(t.identifier);
        if (existing) {
          existing.px = existing.x; existing.py = existing.y;
          existing.x = t.clientX - r.left; existing.y = t.clientY - r.top;
        }
      }
      if (e.touches.length > 0) {
        mouse.px = mouse.x; mouse.py = mouse.y;
        mouse.x = e.touches[0].clientX - r.left;
        mouse.y = e.touches[0].clientY - r.top;
      }
    };

    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd);
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });

    animationRef.current = requestAnimationFrame(draw);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchend', onTouchEnd);
      canvas.removeEventListener('touchmove', onTouchMove);
    };
  }, [dimensions, resolution, penSize, particleCount, particleColor]);

  return (
    <div ref={containerRef} className="absolute inset-0">
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="block h-full w-full"
      />
    </div>
  );
}
