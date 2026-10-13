"use client";

import React, { useEffect, useRef } from "react";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

// Revelação ao rolar: fade + slide ascendente curto (transitions.dev: distance-medium, ease-smooth-out).
// A regra .reveal só existe em prefers-reduced-motion: no-preference, então sem animação o conteúdo já nasce visível.
export function Reveal({ children, className = "", delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-in");
          io.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -24px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

export function Zigzag({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      width="56"
      height="10"
      viewBox="0 0 56 10"
      fill="none"
      className={`text-primary ${className}`}
    >
      <path d="M1 9 6 2l5 7 5-7 5 7 5-7 5 7 5-7 5 7 5-7 4 5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
