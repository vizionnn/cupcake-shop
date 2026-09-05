"use client";

import React, { useEffect, useRef, useState } from "react";
import { animate, createScope } from "animejs";

interface Particle {
  id: number;
  emoji: string;
  left: number;
  size: number;
  speed: number;
  delay: number;
  blur: number;
}

export function CupcakeRain() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scopeRef = useRef<{ revert: () => void } | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const emojis = ["🧁", "✨", "🍓", "💖", "🍬", "🍫"];
    const items: Particle[] = [];

    for (let i = 0; i < 22; i++) {
      items.push({
        id: i,
        emoji: emojis[i % emojis.length],
        left: 3 + Math.random() * 94,
        size: 1.3 + Math.random() * 1.4,
        speed: 12000 + Math.random() * 9000,
        delay: Math.random() * 5000,
        blur: Math.random() > 0.65 ? 1.5 : 0,
      });
    }

    setParticles(items);
  }, []);

  useEffect(() => {
    if (particles.length === 0 || !containerRef.current) return;

    // Respeito a WCAG 2.2 AA (prefers-reduced-motion)
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    try {
      scopeRef.current = createScope({ root: containerRef }).add(() => {
        particles.forEach((p) => {
          // Flutuação ascendente contínua orquestrada com curvas Anime.js
          animate(`.particle-${p.id}`, {
            translateY: ["110vh", "-20vh"],
            translateX: [
              { to: -15 + Math.random() * 30, duration: p.speed * 0.5, ease: "inOutQuad" },
              { to: -20 + Math.random() * 40, duration: p.speed * 0.5, ease: "inOutQuad" },
            ],
            rotate: -25 + Math.random() * 50,
            opacity: [
              { to: 0.5, duration: p.speed * 0.15, ease: "outQuad" },
              { to: 0.5, duration: p.speed * 0.7 },
              { to: 0, duration: p.speed * 0.15, ease: "inQuad" },
            ],
            duration: p.speed,
            delay: p.delay,
            loop: true,
            ease: "linear",
          });
        });
      });
    } catch (err) {
      console.error("Erro no Anime.js CupcakeRain:", err);
    }

    return () => {
      if (scopeRef.current?.revert) {
        scopeRef.current.revert();
      }
    };
  }, [particles]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 print:hidden"
      aria-hidden="true"
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className={`particle-${p.id} absolute select-none opacity-0 will-change-transform`}
          style={{
            left: `${p.left}%`,
            fontSize: `${p.size}rem`,
            filter: p.blur ? `blur(${p.blur}px)` : "none",
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
}
