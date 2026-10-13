"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ShoppingBag } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const NAV = [
  { href: "/#cardapio", label: "Cardápio" },
  { href: "/#abordagem", label: "Como fazemos" },
  { href: "/carrinho", label: "Sacola" },
];

export function Header() {
  const { count, openDrawer } = useCart();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:h-20 sm:px-6">
        <Link
          href="/"
          className="flex min-h-[44px] shrink-0 items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span aria-hidden className="hidden h-8 w-8 place-items-center bg-primary font-display text-lg font-bold text-white sm:grid">
            N
          </span>
          <span className="font-display text-base font-bold leading-none tracking-tight text-foreground sm:text-xl">
            Nuvem de Açúcar
          </span>
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex min-h-[44px] items-center px-4 text-sm font-bold text-foreground/80 transition-colors duration-200 ease-out hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <button
            type="button"
            onClick={openDrawer}
            aria-label={`Abrir sacola, ${count} ${count === 1 ? "item" : "itens"}`}
            className="nb-btn nb-btn-primary gap-2 px-3 sm:px-5"
          >
            <ShoppingBag className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Sacola</span>
            <span
              aria-hidden
              className="inline-grid h-5 min-w-5 place-items-center bg-white px-1 font-mono text-[11px] font-bold text-[#A9334A]"
            >
              {count}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
