"use client";

import React from "react";
import { Sparkles, Clock, Gift, ShieldCheck } from "lucide-react";
import { AnimeReveal } from "@/components/AnimeReveal";

export function FeaturesBar() {
  const features = [
    {
      icon: Sparkles,
      title: "Artesanal do Dia",
      desc: "Assados todas as manhãs com manteiga e cacau nobre",
      color: "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 border-rose-200 dark:border-rose-900/50",
    },
    {
      icon: Clock,
      title: "Entrega em até 3h",
      desc: "Preparo imediato com rotas expressas para Recife e RMR",
      color: "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-300 border-amber-200 dark:border-amber-900/50",
    },
    {
      icon: Gift,
      title: "Embalagem Presente",
      desc: "Caixinha rígida decorada com fita de cetim inclusa",
      color: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/50",
    },
    {
      icon: ShieldCheck,
      title: "Pagamento 100% Seguro",
      desc: "Pix com confirmação em tempo real ou cartão na entrega",
      color: "bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-300 border-sky-200 dark:border-sky-900/50",
    },
  ];

  return (
    <AnimeReveal variant="stagger-children" staggerTime={100} delay={50}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="anime-child p-5 rounded-3xl bg-card border border-border/80 shadow-2xs hover:shadow-md hover:border-primary/30 transition-all hover:-translate-y-1 duration-300 flex items-start gap-3.5 group"
            >
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${item.color} group-hover:scale-110 transition-transform duration-300`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-display font-semibold text-sm text-foreground">
                  {item.title}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </AnimeReveal>
  );
}
