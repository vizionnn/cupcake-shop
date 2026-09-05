"use client";

import React, { useEffect, useRef, useState } from "react";
import { animate, stagger } from "animejs";

interface AnimeRevealProps {
  children: React.ReactNode;
  className?: string;
  variant?: "up" | "fade" | "scale" | "stagger-children" | "left" | "right";
  delay?: number;
  duration?: number;
  threshold?: number;
  staggerTime?: number;
}

export function AnimeReveal({
  children,
  className = "",
  variant = "up",
  delay = 0,
  duration = 600,
  threshold = 0.06,
  staggerTime = 80,
}: AnimeRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasRevealed, setHasRevealed] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Respeita acessibilidade WCAG 2.2 AA (prefers-reduced-motion)
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setHasRevealed(true);
      el.style.opacity = "1";
      el.style.transform = "none";
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasRevealed) {
            setHasRevealed(true);
            observer.unobserve(el);

            if (variant === "stagger-children") {
              const childrenNodes = el.querySelectorAll(".anime-child");
              if (childrenNodes.length > 0) {
                animate(childrenNodes, {
                  opacity: [0, 1],
                  translateY: [28, 0],
                  scale: [0.96, 1],
                  delay: stagger(staggerTime, { start: delay }),
                  duration,
                  ease: "outQuad",
                  onComplete: () => {
                    childrenNodes.forEach(
                      (c) => ((c as HTMLElement).style.transform = "")
                    );
                  },
                });
              } else {
                animate(el.children, {
                  opacity: [0, 1],
                  translateY: [24, 0],
                  delay: stagger(staggerTime, { start: delay }),
                  duration,
                  ease: "outQuad",
                  onComplete: () => {
                    Array.from(el.children).forEach(
                      (c) => ((c as HTMLElement).style.transform = "")
                    );
                  },
                });
              }
            } else if (variant === "scale") {
              animate(el, {
                opacity: [0, 1],
                scale: [0.92, 1],
                delay,
                duration,
                ease: "outBack",
                onComplete: () => {
                  el.style.transform = "";
                },
              });
            } else if (variant === "left") {
              animate(el, {
                opacity: [0, 1],
                translateX: [-28, 0],
                delay,
                duration,
                ease: "outQuad",
                onComplete: () => {
                  el.style.transform = "";
                },
              });
            } else if (variant === "right") {
              animate(el, {
                opacity: [0, 1],
                translateX: [28, 0],
                delay,
                duration,
                ease: "outQuad",
                onComplete: () => {
                  el.style.transform = "";
                },
              });
            } else if (variant === "fade") {
              animate(el, {
                opacity: [0, 1],
                delay,
                duration,
                ease: "outQuad",
                onComplete: () => {
                  el.style.transform = "";
                },
              });
            } else {
              // Padrão: "up" (fade-in suave + slide up)
              animate(el, {
                opacity: [0, 1],
                translateY: [30, 0],
                delay,
                duration,
                ease: "outQuad",
                onComplete: () => {
                  el.style.transform = "";
                },
              });
            }
          }
        });
      },
      { threshold, rootMargin: "0px 0px -20px 0px" }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [variant, delay, duration, threshold, staggerTime, hasRevealed]);

  return (
    <div
      ref={containerRef}
      className={`opacity-0 will-change-[opacity,transform] ${className}`}
    >
      {children}
    </div>
  );
}

