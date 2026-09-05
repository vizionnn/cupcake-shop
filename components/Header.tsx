"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const { count, openDrawer } = useCart();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-baseline gap-2.5 group">
          <span className="font-display font-bold text-2xl sm:text-3xl text-foreground tracking-tight group-hover:text-primary transition-colors">
            Nuvem de Açúcar
          </span>
          <span className="hidden sm:inline-block text-xs font-medium text-muted-foreground uppercase tracking-widest">
            Confeitaria
          </span>
        </Link>

        {/* Navegação e Botão da Sacola */}
        <div className="flex items-center gap-3 sm:gap-6">
          <Link
            href="/#cardapio"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:inline-block"
          >
            Cardápio
          </Link>
          <Link
            href="/carrinho"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden md:inline-block"
          >
            Sacola
          </Link>

          {/* Botão para abrir o Slide-over Drawer */}
          <Button
            type="button"
            variant="default"
            size="default"
            onClick={openDrawer}
            className="relative gap-2 bg-primary hover:bg-[#C7415A] text-white rounded-full px-5 py-2.5 shadow-md shadow-primary/20"
            aria-label={`Ver carrinho com ${count} itens`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="font-medium text-sm">Sacola</span>
            <span
              className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold bg-white text-primary rounded-full ml-0.5"
              aria-live="polite"
            >
              {count}
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
}
