"use client";

import React from "react";
import { cn } from "@/lib/utils";

export type BorderBeamPreset = "rainbow" | "berry" | "cyan" | "gold" | "silver";

export interface BorderBeamProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  duration?: number; // em segundos (padrão: 4s)
  borderWidth?: number; // em pixels (padrão: 1.5px)
  preset?: BorderBeamPreset;
  customGradient?: string;
  glow?: boolean; // exibe halo de luz suave exterior
  glowOpacity?: number; // opacidade do glow (padrão: 0.6)
  reverse?: boolean;
}

export const PRESET_GRADIENTS: Record<BorderBeamPreset, string> = {
  // Prata líquida metálica refinada estilo Apple / prompt button (visível tanto no claro quanto no escuro)
  silver:
    "conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 40deg, rgba(100,116,139,0.7) 70deg, rgba(203,213,225,0.95) 95deg, rgba(255,255,255,0.95) 125deg, rgba(148,163,184,0.6) 155deg, transparent 195deg, transparent 360deg)",

  // Paleta artesanal Nuvem de Açúcar (framboesa vibrante, caramelo e baunilha)
  berry:
    "conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 40deg, rgba(255,255,255,0.95) 70deg, #f43f5e 95deg, #fb7185 125deg, #f2c14e 155deg, rgba(244,63,94,0.4) 185deg, transparent 220deg, transparent 360deg)",

  // Paleta ciano/índigo para o Console SaaS Super Admin
  cyan:
    "conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 45deg, rgba(255,255,255,0.95) 70deg, #22d3ee 95deg, #38bdf8 120deg, #6366f1 150deg, rgba(56,189,248,0.4) 180deg, transparent 220deg, transparent 360deg)",

  // Ouro e âmbar refinado
  gold:
    "conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 45deg, rgba(255,255,255,0.95) 75deg, #fef08a 95deg, #f59e0b 130deg, #d97706 165deg, rgba(251,191,36,0.4) 195deg, transparent 230deg, transparent 360deg)",

  // Espectro cromático refinado
  rainbow:
    "conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 40deg, rgba(255,255,255,0.95) 75deg, #38bdf8 95deg, #818cf8 120deg, #c084fc 145deg, #f472b6 170deg, #fbbf24 195deg, transparent 230deg, transparent 360deg)",
};

export const BorderBeam: React.FC<BorderBeamProps> = ({
  className,
  duration = 4,
  borderWidth = 1.5,
  preset = "silver",
  customGradient,
  glow = false,
  glowOpacity = 0.4,
  reverse = false,
  style,
  ...props
}) => {
  const gradient = customGradient || PRESET_GRADIENTS[preset] || PRESET_GRADIENTS.silver;
  const animationDuration = `${duration}s`;
  const animationDirection = reverse ? "reverse" : "normal";

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden will-change-transform z-20",
        className
      )}
      style={{
        // Máscara CSS: apenas a borda de borderWidth (1.5px) desenha o gradiente. O miolo é 100% excluído.
        WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
        padding: `${borderWidth}px`,
        ...style,
      }}
      {...props}
    >
      <div
        className="absolute -inset-[200%] aspect-square m-auto animate-border-beam-spin will-change-transform"
        style={{
          background: gradient,
          animationDuration,
          animationDirection,
        }}
      />
    </div>
  );
};
