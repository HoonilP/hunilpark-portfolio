'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

interface FloatingParticlesProps {
  particleCount?: number;
  particleColor?: string;
  particleSize?: number;
  mouseInfluence?: number;
  className?: string;
}

export default function FloatingParticles({
  particleCount = 60,
  particleColor = '59, 130, 246',
  particleSize = 2,
  mouseInfluence = 120,
  className = '',
}: FloatingParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      canvas.width = rect.width * devicePixelRatio;
      canvas.height = rect.height * devicePixelRatio;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    };

    const initParticles = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      particlesRef.current = Array.from({ length: particleCount }, () => ({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: particleSize * (0.5 + Math.random()),
        opacity: 0.2 + Math.random() * 0.4,
      }));
    };

    const animate = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect || !ctx) return;

      const w = rect.width;
      const h = rect.height;
      ctx.clearRect(0, 0, w, h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (const p of particlesRef.current) {
        // Mouse attraction
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouseInfluence && dist > 1) {
          const force = (mouseInfluence - dist) / mouseInfluence * 0.008;
          p.vx += dx / dist * force;
          p.vy += dy / dist * force;
        }

        // Damping
        p.vx *= 0.998;
        p.vy *= 0.998;

        // Random drift
        p.vx += (Math.random() - 0.5) * 0.01;
        p.vy += (Math.random() - 0.5) * 0.01;

        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        // Glow based on mouse proximity
        const glowDist = dist < mouseInfluence ? 1 - dist / mouseInfluence : 0;
        const glow = p.opacity + glowDist * 0.4;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${particleColor}, ${glow})`;
        ctx.shadowBlur = 6 + glowDist * 12;
        ctx.shadowColor = `rgba(${particleColor}, ${glow * 0.6})`;
        ctx.fill();
      }

      ctx.shadowBlur = 0;
      rafRef.current = requestAnimationFrame(animate);
    };

    resize();
    initParticles();
    animate();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    window.addEventListener('mousemove', handleMouse);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      window.removeEventListener('mousemove', handleMouse);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [particleCount, particleColor, particleSize, mouseInfluence]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 ${className}`}
      aria-hidden="true"
    />
  );
}
