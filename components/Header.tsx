"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Header() {
  const { count, openDrawer } = useCart();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-baseline gap-2 group shrink-0">
          <span className="font-display font-bold text-lg sm:text-3xl text-foreground tracking-tight group-hover:text-primary transition-colors whitespace-nowrap">
            Nuvem de Açúcar
          </span>
          <span className="hidden sm:inline-block text-xs font-medium text-muted-foreground uppercase tracking-widest">
            Confeitaria
          </span>
        </Link>

        {/* Navegação, Switch iOS de Tema e Botão da Sacola */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <Link
            href="/#cardapio"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:inline-block"
          >
            Cardápio
          </Link>

          {/* Chave seletora de Modo Escuro/Claro estilo iOS com Anime.js */}
          <ThemeToggle />

          <Link
            href="/carrinho"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden md:inline-block"
          >
            Sacola
          </Link>

          {/* Botão para abrir o Slide-over Drawer em Vidro Líquido com Feixe Berry */}
          <LiquidButton
            type="button"
            preset="berry"
            hasBeam={true}
            duration={4}
            onClick={openDrawer}
            className="relative p-0 sm:px-5 sm:py-2.5 min-w-[42px] min-h-[42px] sm:min-w-[44px] sm:min-h-[44px] w-10 h-10 sm:w-auto sm:h-11 shadow-md shadow-primary/25 rounded-full shrink-0"
            aria-label={`Ver carrinho com ${count} itens`}
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              <ShoppingBag className="w-4 h-4 text-white shrink-0" />
              <span className="font-semibold text-sm text-white hidden sm:inline">Sacola</span>
              <span
                className="inline-flex items-center justify-center min-w-[19px] h-[19px] px-1 text-[11px] font-bold bg-white text-primary rounded-full shadow-2xs"
                aria-live="polite"
              >
                {count}
              </span>
            </div>
          </LiquidButton>
        </div>
      </div>
    </header>
  );
}
