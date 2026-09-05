"use client";

import React, { useEffect, useRef } from "react";
import { animate, createScope, stagger } from "animejs";

export function HeroPuffs() {
  const rootRef = useRef<HTMLDivElement>(null);
  const scopeRef = useRef<{ revert: () => void } | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    try {
      scopeRef.current = createScope({ root: rootRef }).add(() => {
        // 1. Levitação orgânica contínua do puff central
        animate(".hero-main-puff", {
          translateY: [-8, 8],
          scale: [1, 1.03],
          duration: 2800,
          loop: true,
          alternate: true,
          ease: "inOutSine",
        });

        // 2. Órbita flutuante do puff de morango
        animate(".hero-strawberry-puff", {
          translateY: [-10, 6],
          translateX: [-4, 6],
          rotate: [-6, 8],
          duration: 3400,
          loop: true,
          alternate: true,
          ease: "inOutQuad",
        });

        // 3. Órbita flutuante do puff de chocolate
        animate(".hero-choco-puff", {
          translateY: [8, -10],
          translateX: [5, -5],
          rotate: [6, -8],
          duration: 3100,
          loop: true,
          alternate: true,
          ease: "inOutQuad",
        });

        // 4. Brilho sutil das estrelas decorativas
        animate(".hero-sparkle", {
          scale: [0.8, 1.3],
          opacity: [0.3, 0.9],
          duration: 1800,
          loop: true,
          alternate: true,
          delay: stagger(300),
          ease: "inOutSine",
        });
      });
    } catch (err) {
      console.error("Anime.js HeroPuffs error:", err);
    }


    return () => {
      if (scopeRef.current?.revert) {
        scopeRef.current.revert();
      }
    };
  }, []);

  const handlePuffClick = (selector: string) => {
    animate(selector, {
      scale: [1, 1.25, 0.95, 1],
      rotate: [-12, 14, -6, 0],
      duration: 650,
      ease: "outElastic(1.2, .4)",
    });
  };

  return (
    <div ref={rootRef} className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
      {/* Estrelas cintilantes no fundo */}
      <span className="hero-sparkle absolute -top-4 left-6 text-xl select-none pointer-events-none">✨</span>
      <span className="hero-sparkle absolute top-12 -left-2 text-sm select-none pointer-events-none">💖</span>
      <span className="hero-sparkle absolute bottom-4 right-2 text-xl select-none pointer-events-none">✨</span>

      {/* Puff Principal - Cupcake */}
      <button
        type="button"
        onClick={() => handlePuffClick(".hero-main-puff")}
        aria-label="Interagir com cupcake"
        className="hero-main-puff cursor-pointer w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-white shadow-2xl border-2 border-primary/20 flex flex-col items-center justify-center p-4 z-10 transition-shadow hover:shadow-primary/20"
      >
        <span className="text-6xl sm:text-7xl select-none">🧁</span>
        <span className="text-xs font-bold text-primary mt-2 bg-primary/10 px-3.5 py-1 rounded-full shadow-2xs">
          Adoce seu dia ❤️
        </span>
      </button>

      {/* Puff Morango */}
      <button
        type="button"
        onClick={() => handlePuffClick(".hero-strawberry-puff")}
        aria-label="Interagir com morango"
        className="hero-strawberry-puff cursor-pointer absolute top-2 right-2 w-20 h-20 rounded-full bg-white/95 backdrop-blur-xs shadow-lg border border-red-200 flex items-center justify-center text-3xl z-20 hover:border-red-400"
      >
        <span className="select-none">🍓</span>
      </button>

      {/* Puff Cacau */}
      <button
        type="button"
        onClick={() => handlePuffClick(".hero-choco-puff")}
        aria-label="Interagir com chocolate"
        className="hero-choco-puff cursor-pointer absolute bottom-2 left-2 w-20 h-20 rounded-full bg-white/95 backdrop-blur-xs shadow-lg border border-amber-900/20 flex items-center justify-center text-3xl z-20 hover:border-amber-700"
      >
        <span className="select-none">🍫</span>
      </button>
    </div>
  );
}
