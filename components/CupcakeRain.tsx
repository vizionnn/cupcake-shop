"use client";

import React, { useEffect, useState } from "react";

interface Particle {
  id: number;
  emoji: string;
  left: number;
  duration: number;
  delay: number;
  size: number;
  blur: number;
}

export function CupcakeRain() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const emojis = ["🧁", "✨", "🍓", "💖", "🍬", "🍫"];
    const items: Particle[] = [];

    for (let i = 0; i < 22; i++) {
      items.push({
        id: i,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        left: Math.random() * 96,
        duration: 12 + Math.random() * 12,
        delay: Math.random() * 6,
        size: 1.4 + Math.random() * 1.4,
        blur: Math.random() > 0.6 ? 1.5 : 0,
      });
    }

    setParticles(items);
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 print:hidden"
      aria-hidden="true"
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute select-none opacity-40 will-change-transform animate-float-up"
          style={{
            left: `${p.left}%`,
            fontSize: `${p.size}rem`,
            filter: p.blur ? `blur(${p.blur}px)` : "none",
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            animationIterationCount: "infinite",
            animationTimingFunction: "ease-in-out",
          }}
        >
          {p.emoji}
        </span>
      ))}

      <style jsx>{`
        @keyframes floatUp {
          0% {
            transform: translateY(110vh) rotate(0deg);
            opacity: 0;
          }
          15% {
            opacity: 0.5;
          }
          85% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(-20vh) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-float-up {
          animation-name: floatUp;
        }
      `}</style>
    </div>
  );
}
