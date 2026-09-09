import React, { useEffect, useRef } from 'react';

export const SpaceBackground: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Constellation nodes (stars)
    const starCount = Math.min(65, Math.floor((width * height) / 22000));
    const stars: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      twinkleSpeed: number;
    }> = [];

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        radius: Math.random() * 1.3 + 0.5,
        alpha: Math.random() * 0.5 + 0.25,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
      });
    }

    let orbitalPhase = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw subtle orbital curves (ISRO Earth-Observation paths)
      ctx.save();
      ctx.strokeStyle = 'rgba(0, 132, 255, 0.07)';
      ctx.lineWidth = 1;
      ctx.setLineDash([8, 16]);

      // Primary equatorial orbit
      ctx.beginPath();
      ctx.ellipse(width * 0.5, height * 1.05, width * 0.7, height * 0.6, -0.12, 0, Math.PI * 2);
      ctx.stroke();

      // Polar orbit
      ctx.beginPath();
      ctx.ellipse(width * 0.65, height * 0.5, width * 0.45, height * 0.9, 0.45, 0, Math.PI * 2);
      ctx.stroke();

      // Satellite beacon on orbit
      orbitalPhase += prefersReducedMotion ? 0 : 0.0015;
      const satX = width * 0.5 + Math.cos(orbitalPhase) * (width * 0.7);
      const satY = height * 1.05 + Math.sin(orbitalPhase) * (height * 0.6);
      if (satX > 0 && satX < width && satY > 0 && satY < height) {
        ctx.fillStyle = 'rgba(56, 189, 248, 0.7)';
        ctx.beginPath();
        ctx.arc(satX, satY, 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
        ctx.beginPath();
        ctx.arc(satX, satY, 6, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      // 2. Draw stars & constellation network connections
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];

        if (!prefersReducedMotion) {
          s.x += s.vx;
          s.y += s.vy;
          if (s.x < 0) s.x = width;
          if (s.x > width) s.x = 0;
          if (s.y < 0) s.y = height;
          if (s.y > height) s.y = 0;
          s.alpha += Math.sin(Date.now() * s.twinkleSpeed) * 0.005;
          s.alpha = Math.max(0.2, Math.min(0.85, s.alpha));
        }

        ctx.fillStyle = `rgba(224, 242, 254, ${s.alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby stars with faint constellation lines
        for (let j = i + 1; j < stars.length; j++) {
          const s2 = stars[j];
          const dx = s.x - s2.x;
          const dy = s.y - s2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const lineAlpha = (1 - dist / 110) * 0.08;
            ctx.strokeStyle = `rgba(0, 163, 255, ${lineAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(s2.x, s2.y);
            ctx.stroke();
          }
        }
      }

      if (!prefersReducedMotion) {
        animId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#030712]">
      {/* Animated Telemetry & Orbit Background Grid */}
      <div className="orbital-bg" />

      {/* Layered Starfields with Parallax Drift */}
      <div className="starfield star-layer-1" />
      <div className="starfield star-layer-2" />
      <div className="starfield star-layer-3" />

      {/* Deep Space Atmospheric Nebulae Pulses */}
      <div className="deep-space-nebula-1" />
      <div className="deep-space-nebula-2" />

      {/* Floating Orbital Planet Light Spheres */}
      <div className="planet-glow-sphere" />
      <div className="moon-orbit-sphere" />

      {/* Rotating Concentric Orbital Arcs */}
      <div className="orbital-arcs" />

      {/* Soft radial Earth observation glow pulses */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-900/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[10%] w-[700px] h-[700px] bg-cyan-950/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[35%] left-[25%] w-[400px] h-[400px] bg-indigo-950/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Interactive Constellation, Star Twinkle & Orbit Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block opacity-85" />

      {children && (
        <div className="relative z-10 w-full h-full pointer-events-auto">
          {children}
        </div>
      )}
    </div>
  );
};
