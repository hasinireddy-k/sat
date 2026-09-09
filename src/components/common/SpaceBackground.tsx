import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  z: number;
  baseRadius: number;
  baseAlpha: number;
  colorR: number;
  colorG: number;
  colorB: number;
  twinkleSpeed: number;
  twinklePhase: number;
  driftVx: number;
  driftVy: number;
  layer: number; // 0: Deep Universe, 1: Mid Galactic, 2: Foreground
  dispX: number; // Smooth gravitational reaction to cursor
  dispY: number;
}

export const SpaceBackground: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resizeCanvas = () => {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- Interactive State ---
    let mouseX = -1000;
    let mouseY = -1000;
    let isMouseInWindow = false;
    let panX = 0;
    let panY = 0;
    let velX = 0;
    let velY = 0;
    let isDragging = false;
    let lastPointerX = 0;
    let lastPointerY = 0;
    let orbitalPhase = 0;

    // --- Adaptive Multi-Depth Stellar Generation ---
    // Scaled realistically based on display area (600 to 950 stars)
    const starCount = Math.min(950, Math.max(550, Math.floor((width * height) / 1900)));
    const stars: Star[] = [];

    for (let i = 0; i < starCount; i++) {
      // 3 distinct depth layers
      const rand = Math.random();
      let layer: number;
      let z: number;
      let baseRadius: number;
      let baseAlpha: number;

      if (rand < 0.60) {
        // Layer 0: Distant universe & background star clusters (dense, subtle, slow)
        layer = 0;
        z = Math.random() * 600 + 600;
        baseRadius = Math.random() * 0.45 + 0.35;
        baseAlpha = Math.random() * 0.35 + 0.15;
      } else if (rand < 0.88) {
        // Layer 1: Midground galactic plane (crisp, medium parallax)
        layer = 1;
        z = Math.random() * 350 + 250;
        baseRadius = Math.random() * 0.65 + 0.65;
        baseAlpha = Math.random() * 0.4 + 0.35;
      } else {
        // Layer 2: Foreground stellar neighborhood (bright, responsive, subtle glow)
        layer = 2;
        z = Math.random() * 200 + 50;
        baseRadius = Math.random() * 0.9 + 1.2;
        baseAlpha = Math.random() * 0.35 + 0.65;
      }

      // Natural astronomical star color temperatures
      let cr = 248, cg = 250, cb = 252; // Neutral white (75%)
      const colorRand = Math.random();
      if (colorRand < 0.16) {
        // Class B / Ice-Blue star
        cr = 186; cg = 230; cb = 253;
      } else if (colorRand < 0.28) {
        // Class G-K / Warm Amber star
        cr = 254; cg = 243; cb = 199;
      }

      stars.push({
        x: Math.random() * (width + 300) - 150,
        y: Math.random() * (height + 300) - 150,
        z,
        baseRadius,
        baseAlpha,
        colorR: cr,
        colorG: cg,
        colorB: cb,
        twinkleSpeed: Math.random() * 0.025 + 0.008,
        twinklePhase: Math.random() * Math.PI * 2,
        driftVx: (Math.random() - 0.5) * 0.08,
        driftVy: (Math.random() - 0.5) * 0.08,
        layer,
        dispX: 0,
        dispY: 0
      });
    }

    // --- Window Pointer & Drag Listeners (Non-blocking, UI-friendly) ---
    const handlePointerMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isMouseInWindow = true;

      if (isDragging) {
        const dx = e.clientX - lastPointerX;
        const dy = e.clientY - lastPointerY;
        velX = dx * 0.8;
        velY = dy * 0.8;
        panX += dx;
        panY += dy;
        lastPointerX = e.clientX;
        lastPointerY = e.clientY;
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      // Never hijack clicks/drags on buttons, inputs, sliders, viewer canvases, or cards
      const target = e.target as HTMLElement | null;
      if (
        target &&
        target.closest(
          'button, input, textarea, a, select, [role="slider"], [role="button"], canvas:not(#space-galaxy-canvas), [data-interactive="true"], .interactive-element'
        )
      ) {
        return;
      }

      // Only drag on left mouse button / single touch
      if (e.button !== 0) return;

      isDragging = true;
      lastPointerX = e.clientX;
      lastPointerY = e.clientY;
      velX = 0;
      velY = 0;
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const handleMouseLeave = () => {
      isMouseInWindow = false;
      isDragging = false;
      mouseX = -1000;
      mouseY = -1000;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    window.addEventListener('pointercancel', handlePointerUp, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    // --- Main 60 FPS Render Loop ---
    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // 1. Inertial Panning & Velocity Decay
      if (!isDragging) {
        panX += velX;
        panY += velY;
        velX *= 0.94; // Smooth friction
        velY *= 0.94;
        if (Math.abs(velX) < 0.005) velX = 0;
        if (Math.abs(velY) < 0.005) velY = 0;
      }

      // 2. Base Deep Space Canvas Background
      ctx.fillStyle = '#02050e';
      ctx.fillRect(0, 0, width, height);

      // 3. Volumetric Milky Way & Cosmic Dust Lanes (Subtle Parallax)
      const nebulaPanX = panX * 0.05;
      const nebulaPanY = panY * 0.05;

      // Primary Milky Way Dust Lane (Diagonal sweep)
      const neb1 = ctx.createRadialGradient(
        width * 0.55 + nebulaPanX,
        height * 0.45 + nebulaPanY,
        50,
        width * 0.55 + nebulaPanX,
        height * 0.45 + nebulaPanY,
        Math.max(width, height) * 0.65
      );
      neb1.addColorStop(0, 'rgba(14, 38, 77, 0.12)');
      neb1.addColorStop(0.35, 'rgba(8, 47, 73, 0.06)');
      neb1.addColorStop(0.7, 'rgba(15, 23, 42, 0.03)');
      neb1.addColorStop(1, 'rgba(2, 5, 14, 0)');
      ctx.fillStyle = neb1;
      ctx.fillRect(0, 0, width, height);

      // Secondary Deep Cosmic Cloud
      const neb2 = ctx.createRadialGradient(
        width * 0.25 + nebulaPanX * 1.2,
        height * 0.7 + nebulaPanY * 1.2,
        30,
        width * 0.25 + nebulaPanX * 1.2,
        height * 0.7 + nebulaPanY * 1.2,
        Math.max(width, height) * 0.5
      );
      neb2.addColorStop(0, 'rgba(30, 27, 75, 0.08)');
      neb2.addColorStop(0.4, 'rgba(15, 23, 42, 0.04)');
      neb2.addColorStop(1, 'rgba(2, 5, 14, 0)');
      ctx.fillStyle = neb2;
      ctx.fillRect(0, 0, width, height);

      // 4. Subtle Orbital Tracks (ISRO Polar & Equatorial Path)
      ctx.save();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.06)';
      ctx.lineWidth = 1;
      ctx.setLineDash([8, 18]);

      ctx.beginPath();
      ctx.ellipse(
        width * 0.5 + nebulaPanX * 0.8,
        height * 1.08 + nebulaPanY * 0.8,
        width * 0.72,
        height * 0.62,
        -0.12,
        0,
        Math.PI * 2
      );
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(
        width * 0.65 + nebulaPanX * 0.8,
        height * 0.5 + nebulaPanY * 0.8,
        width * 0.42,
        height * 0.88,
        0.42,
        0,
        Math.PI * 2
      );
      ctx.stroke();

      // Satellite Beacon moving along orbit
      orbitalPhase += prefersReducedMotion ? 0 : 0.0012;
      const satX = width * 0.5 + nebulaPanX * 0.8 + Math.cos(orbitalPhase) * (width * 0.72);
      const satY = height * 1.08 + nebulaPanY * 0.8 + Math.sin(orbitalPhase) * (height * 0.62);
      if (satX > 0 && satX < width && satY > 0 && satY < height) {
        ctx.fillStyle = 'rgba(56, 189, 248, 0.8)';
        ctx.beginPath();
        ctx.arc(satX, satY, 2.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(56, 189, 248, 0.22)';
        ctx.beginPath();
        ctx.arc(satX, satY, 7, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      // 5. Multi-Layer Starfield Rendering with 3D Parallax & Gravitational Drift
      const layerParallax = [0.12, 0.38, 0.85]; // Speeds per layer
      const margin = 140;
      const wrapWidth = width + margin * 2;
      const wrapHeight = height + margin * 2;

      // Nearby stars cache for interactive cursor constellation lines
      const activeCluster: Array<{ x: number; y: number; dist: number }> = [];

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];

        // Intrinsic slow cosmic drift
        if (!prefersReducedMotion) {
          s.x += s.driftVx;
          s.y += s.driftVy;
        }

        // Layer-dependent parallax offset from user drag
        const pSpeed = layerParallax[s.layer];
        const layerOffsetX = panX * pSpeed;
        const layerOffsetY = panY * pSpeed;

        // Toroidal screen projection & seamless wrapping
        let screenX = ((s.x + layerOffsetX + margin) % wrapWidth + wrapWidth) % wrapWidth - margin;
        let screenY = ((s.y + layerOffsetY + margin) % wrapHeight + wrapHeight) % wrapHeight - margin;

        // Mouse Gravitational Field Interaction
        if (isMouseInWindow) {
          const dx = screenX - mouseX;
          const dy = screenY - mouseY;
          const distSq = dx * dx + dy * dy;
          const maxDist = 150;

          if (distSq < maxDist * maxDist && distSq > 1) {
            const dist = Math.sqrt(distSq);
            const normForce = Math.pow(1 - dist / maxDist, 2);
            // Subtle repulsive / gravitational deflection vector
            const pushMagnitude = normForce * 18 * (1 / (s.layer + 1));
            const targetDispX = (dx / dist) * pushMagnitude;
            const targetDispY = (dy / dist) * pushMagnitude;

            s.dispX += (targetDispX - s.dispX) * 0.15;
            s.dispY += (targetDispY - s.dispY) * 0.15;

            // Register stars near cursor for constellation line drawing
            if (dist < 115) {
              activeCluster.push({
                x: screenX + s.dispX,
                y: screenY + s.dispY,
                dist
              });
            }
          } else {
            // Smooth spring return to baseline orbit
            s.dispX += (0 - s.dispX) * 0.08;
            s.dispY += (0 - s.dispY) * 0.08;
          }
        } else {
          s.dispX += (0 - s.dispX) * 0.08;
          s.dispY += (0 - s.dispY) * 0.08;
        }

        const finalX = screenX + s.dispX;
        const finalY = screenY + s.dispY;

        // Only draw visible stars
        if (finalX < -10 || finalX > width + 10 || finalY < -10 || finalY > height + 10) {
          continue;
        }

        // Realistic stellar scintillation / twinkle
        s.twinklePhase += s.twinkleSpeed;
        const twinkle = Math.sin(s.twinklePhase) * 0.22;
        const currentAlpha = Math.max(0.08, Math.min(1.0, s.baseAlpha + twinkle));

        // Draw star body
        ctx.fillStyle = `rgba(${s.colorR}, ${s.colorG}, ${s.colorB}, ${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(finalX, finalY, s.baseRadius, 0, Math.PI * 2);
        ctx.fill();

        // Foreground stars receive a soft, realistic diffraction halo
        if (s.layer === 2 && currentAlpha > 0.5) {
          ctx.fillStyle = `rgba(${s.colorR}, ${s.colorG}, ${s.colorB}, ${currentAlpha * 0.18})`;
          ctx.beginPath();
          ctx.arc(finalX, finalY, s.baseRadius * 2.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 6. Interactive Constellation Lines Around Cursor
      if (isMouseInWindow && activeCluster.length > 0) {
        ctx.save();
        ctx.lineWidth = 0.75;

        // Connect cursor to nearby stars
        for (let i = 0; i < activeCluster.length; i++) {
          const node = activeCluster[i];
          const lineAlpha = (1 - node.dist / 115) * 0.2;
          ctx.strokeStyle = `rgba(56, 189, 248, ${lineAlpha})`;

          ctx.beginPath();
          ctx.moveTo(mouseX, mouseY);
          ctx.lineTo(node.x, node.y);
          ctx.stroke();

          // Delicate astrometric node dot
          ctx.fillStyle = `rgba(56, 189, 248, ${lineAlpha * 1.5})`;
          ctx.beginPath();
          ctx.arc(node.x, node.y, 1.8, 0, Math.PI * 2);
          ctx.fill();

          // Connect star pairs within the local constellation web
          for (let j = i + 1; j < activeCluster.length; j++) {
            const node2 = activeCluster[j];
            const pDx = node.x - node2.x;
            const pDy = node.y - node2.y;
            const pairDistSq = pDx * pDx + pDy * pDy;
            if (pairDistSq < 90 * 90) {
              const pairDist = Math.sqrt(pairDistSq);
              const pairAlpha = (1 - pairDist / 90) * 0.12;
              ctx.strokeStyle = `rgba(125, 211, 252, ${pairAlpha})`;
              ctx.beginPath();
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(node2.x, node2.y);
              ctx.stroke();
            }
          }
        }
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#02050e] select-none">
      {/* Animated Deep-Space 3D Interactive Galaxy Canvas */}
      <canvas
        id="space-galaxy-canvas"
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block pointer-events-none"
      />

      {/* Subtle Telemetry Coordinate Grid Overlay (Faint & Clean) */}
      <div className="orbital-bg opacity-40 pointer-events-none" />

      {/* Optional Children wrapper */}
      {children && (
        <div className="relative z-10 w-full h-full pointer-events-auto">
          {children}
        </div>
      )}
    </div>
  );
};
