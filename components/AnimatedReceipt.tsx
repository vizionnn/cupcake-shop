"use client";

import React, { useEffect, useRef } from "react";
import { animate, createScope, stagger } from "animejs";

interface AnimatedReceiptProps {
  children: React.ReactNode;
}

export function AnimatedReceipt({ children }: AnimatedReceiptProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const scopeRef = useRef<{ revert: () => void } | null>(null);

  useEffect(() => {
    // 1. Respeito às diretrizes de Acessibilidade UX (WCAG 2.2 AA - prefers-reduced-motion)
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    try {
      scopeRef.current = createScope({ root: rootRef }).add(() => {
        // 2. Aparição elegante e suave do recibo comercial
        animate(".receipt-card", {
          opacity: [0, 1],
          translateY: [28, 0],
          duration: 600,
          ease: "outQuad",
        });

        // 3. Pop tátil com física no badge de confirmação
        animate(".success-badge-icon", {
          scale: [0, 1.25, 1],
          opacity: [0, 1],
          duration: 750,
          delay: 120,
          ease: "outBack",
        });

        // 4. Efeito staggered suave nos itens da caixinha (percepção de carinho artesanal)
        animate(".receipt-item-row", {
          opacity: [0, 1],
          translateX: [-16, 0],
          delay: stagger(75, { start: 350 }),
          duration: 450,
          ease: "outQuad",
        });
      });
    } catch (err) {
      console.error("Anime.js scope initialization:", err);
    }


    return () => {
      if (scopeRef.current?.revert) {
        scopeRef.current.revert();
      }
    };
  }, []);

  return (
    <div ref={rootRef} className="w-full flex justify-center">
      {children}
    </div>
  );
}
