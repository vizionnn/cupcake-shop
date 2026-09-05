"use client";

import React, { useEffect, useRef, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { animate } from "animejs";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const knobRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  // Inicialização sincronizada com localStorage e preferência do sistema
  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("theme");
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const isCurrentlyDark =
        stored === "dark" || (!stored && systemPrefersDark) || document.documentElement.classList.contains("dark");

      setIsDark(isCurrentlyDark);

      if (isCurrentlyDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }

      if (knobRef.current) {
        knobRef.current.style.transform = isCurrentlyDark ? "translateX(20px)" : "translateX(0px)";
      }
    } catch (err) {
      console.warn("Falha ao ler tema do localStorage:", err);
    }
  }, []);

  const handleToggle = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);

    try {
      if (nextDark) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    } catch (err) {
      console.warn("Falha ao persistir tema:", err);
    }

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Animação com Anime.js simulando o feedback tátil e elástico do switch do iOS
    if (!prefersReducedMotion) {
      if (knobRef.current) {
        animate(knobRef.current, {
          translateX: nextDark ? 20 : 0,
          scaleX: [1, 1.26, 0.94, 1],
          scaleY: [1, 0.86, 1.05, 1],
          duration: 380,
          ease: "outBack(1.6)",
        });
      }

      if (iconRef.current) {
        animate(iconRef.current, {
          rotate: nextDark ? [-40, 0] : [40, 0],
          scale: [0.75, 1.1, 1],
          duration: 350,
          ease: "outQuad",
        });
      }
    } else if (knobRef.current) {
      knobRef.current.style.transform = nextDark ? "translateX(20px)" : "translateX(0px)";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={
        isDark
          ? "Modo escuro ativado. Clique para alternar para modo claro"
          : "Modo claro ativado. Clique para alternar para modo escuro"
      }
      tabIndex={0}
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      className="group relative inline-flex items-center justify-center p-1.5 rounded-full touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-transform active:scale-95"
      title={isDark ? "Mudar para modo claro" : "Mudar para modo escuro"}
    >
      {/* Trilho (Track) no estilo iOS Switch (51x31px Apple HIG) */}
      <div
        className={`w-[51px] h-[31px] rounded-full relative transition-colors duration-300 border shadow-inner flex items-center justify-between px-1.5 ${
          isDark
            ? "bg-[#38231C] border-[#5A382C] shadow-black/40"
            : "bg-[#E5DCD4] border-[#D1C3B7] shadow-black/5"
        }`}
      >
        {/* Ícone fixo de Sol à esquerda no trilho */}
        <Sun
          className={`w-3.5 h-3.5 transition-opacity duration-200 ${
            isDark ? "opacity-25 text-amber-300/60" : "opacity-80 text-amber-600"
          }`}
          aria-hidden="true"
        />

        {/* Ícone fixo de Lua à direita no trilho */}
        <Moon
          className={`w-3.5 h-3.5 transition-opacity duration-200 ${
            isDark ? "opacity-90 text-primary" : "opacity-20 text-muted-foreground"
          }`}
          aria-hidden="true"
        />

        {/* Botão deslizante (Knob/Thumb) estilo iPhone com sombra e ícone dinâmico */}
        <div
          ref={knobRef}
          style={{
            transform: mounted && isDark ? "translateX(20px)" : "translateX(0px)",
          }}
          className="absolute left-[2px] top-[2px] w-[27px] h-[27px] rounded-full bg-white dark:bg-[#FDF6F0] shadow-[0_3px_8px_rgba(0,0,0,0.18),0_1px_2px_rgba(0,0,0,0.12)] flex items-center justify-center pointer-events-none z-10 transition-[background-color]"
        >
          <div ref={iconRef} className="flex items-center justify-center">
            {mounted && isDark ? (
              <Moon className="w-3.5 h-3.5 text-primary fill-primary/20" aria-hidden="true" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" aria-hidden="true" />
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
