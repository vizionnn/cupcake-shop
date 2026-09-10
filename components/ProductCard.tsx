"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { formatBRL } from "@/lib/utils";
import { PhotoOrEmoji } from "@/components/PhotoOrEmoji";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Check, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import { animate } from "animejs";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isExpandedMobile, setIsExpandedMobile] = useState(false);
  const [isHoverSupported, setIsHoverSupported] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const expandTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isHoveredRef = useRef(false);

  // Detecta se o dispositivo suporta hover real (mouse desktop).
  // Em telas sensíveis ao toque (mobile/tablet), hover é DESATIVADO para não causar conflitos com o toque.
  useEffect(() => {
    if (typeof window !== "undefined") {
      const media = window.matchMedia("(hover: hover) and (pointer: fine)");
      setIsHoverSupported(media.matches);

      const listener = (e: MediaQueryListEvent) => setIsHoverSupported(e.matches);
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    }
  }, []);

  // Mantém a ref síncrona com o estado
  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  // Limpa o timer ao desmontar
  useEffect(() => {
    return () => {
      if (expandTimerRef.current) clearTimeout(expandTimerRef.current);
    };
  }, []);

  // Rastreamento suave do cursor no Desktop (Hover Intent)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Ignora completamente eventos de mouse em telas touch mobile
    if (!isHoverSupported) return;

    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);
    cardRef.current.style.setProperty("--spotlight-opacity", "1");

    // Se já estiver expandido, mantém estável aberto
    if (isHoveredRef.current || isExpandedMobile) return;

    // Enquanto o mouse estiver se movendo, cancela e reinicia o timer.
    // Só expande quando o usuário PARAR o cursor por 280ms!
    if (expandTimerRef.current) {
      clearTimeout(expandTimerRef.current);
    }
    expandTimerRef.current = setTimeout(() => {
      isHoveredRef.current = true;
      setIsHovered(true);
    }, 280);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isHoverSupported) return;
    handleMouseMove(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isHoverSupported) return;

    // Proteção contra fechamento prematuro enquanto o mouse estiver dentro da área expandida
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const targetHeight = isHoveredRef.current ? 450 : 130;
      const isStillInside =
        e.clientX >= rect.left - 2 &&
        e.clientX <= rect.right + 2 &&
        e.clientY >= rect.top - 2 &&
        e.clientY <= rect.top + targetHeight + 2;

      if (isStillInside) return;
    }

    if (expandTimerRef.current) {
      clearTimeout(expandTimerRef.current);
    }
    isHoveredRef.current = false;
    setIsHovered(false);
    if (cardRef.current) {
      cardRef.current.style.setProperty("--spotlight-opacity", "0");
    }
  };

  // Acessibilidade por teclado (apenas no desktop com Tab)
  const handleFocus = () => {
    if (!isHoverSupported) return;
    isHoveredRef.current = true;
    setIsHovered(true);
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!isHoverSupported) return;
    if (!cardRef.current?.contains(e.relatedTarget as Node)) {
      isHoveredRef.current = false;
      setIsHovered(false);
    }
  };

  // Ações explícitas de abrir e fechar no Mobile (Touch)
  const handleOpenMobile = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpandedMobile(true);
  };

  const handleCloseMobile = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (expandTimerRef.current) clearTimeout(expandTimerRef.current);
    isHoveredRef.current = false;
    setIsHovered(false);
    setIsExpandedMobile(false);
    if (cardRef.current) {
      cardRef.current.style.setProperty("--spotlight-opacity", "0");
    }
  };

  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAdded(true);

    const btn = e.currentTarget;
    animate(btn, {
      scale: [1, 0.88, 1.15, 1],
      duration: 500,
      ease: "outElastic(1.2, .5)",
    });

    setTimeout(() => setAdded(false), 900);
  };

  const isOutOfStock = product.stock <= 0;
  const isExpanded = isHovered || isExpandedMobile;

  return (
    /* 
      COMPORTAMENTO RESPONSIVO ESSENCIAL (MOBILE vs DESKTOP):
      - No Mobile (< sm):
        O container usa fluxo normal (relative). Quando expandido, ocupa h-[420px], 
        empurrando os produtos abaixo suavemente como um acordeão (sem sobrepor ou cobrir nada!).
      - No Desktop (sm:):
        O container mantém a grade fixa (sm:h-[120px]) e o card expandido usa sm:absolute sm:top-0, 
        flutuando por cima da grade sem empurrar as outras colunas.
    */
    <div
      className={`w-full transition-all duration-300 ${
        isExpanded
          ? "relative h-[420px] sm:relative sm:h-[120px] z-30 sm:z-40"
          : "relative h-[116px] sm:h-[120px] z-0 hover:z-20"
      }`}
    >
      {/* 
        Card do Produto:
        - Mobile: 'relative h-[420px]' quando expandido (fluxo natural e seguro).
        - Desktop: 'sm:absolute sm:top-0 sm:left-0 sm:h-[430px]' quando expandido (sobreposição flutuante).
      */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`fluent-card-wrapper group w-full p-[1.5px] rounded-3xl bg-border/60 dark:bg-border/40 transition-[box-shadow,border-color] duration-300 ${
          isExpanded
            ? "relative h-[420px] sm:absolute sm:top-0 sm:left-0 sm:h-[430px] shadow-2xl shadow-black/40 dark:shadow-black/80 ring-1 ring-primary/25 z-30 sm:z-40"
            : "relative h-full border-transparent z-0 hover:shadow-md"
        }`}
      >
        {/* Camada 1: Borda Dinâmica (Border Reveal) */}
        <div className="fluent-border-glow" />

        {/* Camada 2: Superfície Iluminada (Spotlight) e Conteúdo */}
        <div className="relative rounded-[calc(1.5rem-1.5px)] bg-card text-card-foreground overflow-hidden z-[2] flex flex-col h-full">
          <div className="fluent-surface-spotlight" />

          {/* =========================================================================
              ESTADO EXPANDIDO (Foto ampla com descrição e botões completos)
             ========================================================================= */}
          {isExpanded ? (
            <div className="p-4 sm:p-5 flex flex-col h-full gap-3 animate-in fade-in zoom-in-95 duration-200 ease-out">
              {/* Foto Ampliada em Destaque (h-46 no mobile / h-52 no desktop) */}
              <Link
                href={`/produto/${product.id}`}
                className="block relative h-44 sm:h-52 w-full shrink-0 rounded-2xl bg-[#FDF0E9] dark:bg-[#251812] overflow-hidden group/photo border border-border/40 shadow-xs"
                aria-label={`Ver detalhes do ${product.name}`}
              >
                <div className="w-full h-full flex items-center justify-center group-hover/photo:scale-105 transition-transform duration-500">
                  <PhotoOrEmoji
                    photoOrEmoji={product.image_emoji}
                    name={product.name}
                    className="w-full h-full object-cover object-center"
                    emojiClassName="text-6xl"
                  />
                </div>

                {/* Tag de Sabor e Disponibilidade em Sobreposição */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <Badge
                    variant="pastry"
                    className="text-[10px] uppercase tracking-wider backdrop-blur-md bg-card/90 shadow-2xs"
                  >
                    {product.flavor_tag}
                  </Badge>
                  {!isOutOfStock && (
                    <span className="text-[10px] text-emerald-800 dark:text-emerald-300 font-semibold bg-emerald-100/90 dark:bg-emerald-950/70 backdrop-blur-md px-2 py-0.5 rounded-full border border-emerald-300/40">
                      ✓ Hoje
                    </span>
                  )}
                </div>

                <span className="absolute bottom-2 right-2 text-[9px] text-muted-foreground/90 bg-card/85 backdrop-blur-xs px-2 py-0.5 rounded-full border border-border/40">
                  *Foto ilustrativa
                </span>
              </Link>

              {/* Informações do Produto */}
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <Link
                    href={`/produto/${product.id}`}
                    className="hover:text-primary transition-colors block flex-1 min-w-0"
                  >
                    <h3 className="font-display font-bold text-base sm:text-lg text-foreground leading-snug truncate">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Botão de Fechar no Mobile (Touch Target acessível 44x44px conforme WCAG 2.2 AA) */}
                  <button
                    type="button"
                    onClick={handleCloseMobile}
                    className="text-xs font-semibold text-foreground hover:text-primary flex items-center justify-center gap-1 px-3 py-2 rounded-full bg-muted/80 hover:bg-muted transition-all min-h-[44px] shrink-0 cursor-pointer active:scale-95"
                    aria-label={`Recolher detalhes do ${product.name}`}
                  >
                    <span>Fechar</span>
                    <ChevronUp className="w-4 h-4 text-primary" />
                  </button>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Rodapé de Ações Fixo na Base */}
              <div className="pt-2.5 border-t border-border/40 flex items-center justify-between gap-3 mt-auto">
                <div>
                  <span className="text-[10px] text-muted-foreground block font-medium uppercase tracking-wider">
                    Preço
                  </span>
                  <span className="font-display font-bold text-lg text-primary">
                    {formatBRL(product.price)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    onClick={handleAdd}
                    disabled={isOutOfStock}
                    size="sm"
                    className="rounded-full px-4 gap-1.5 font-semibold transition-all shadow-xs shadow-primary/20 hover:shadow-md min-h-[44px]"
                  >
                    {added ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-white" />
                        <span>Adicionado</span>
                      </>
                    ) : isOutOfStock ? (
                      <span>Esgotado</span>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Adicionar</span>
                      </>
                    )}
                  </Button>

                  <Link
                    href={`/produto/${product.id}`}
                    className="w-10 h-10 rounded-full border border-border/70 hover:border-primary flex items-center justify-center text-muted-foreground hover:text-primary transition-colors min-w-[40px] min-h-[40px]"
                    title="Ver detalhes completos do cupcake"
                    aria-label={`Ver detalhes completos do ${product.name}`}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            /* =========================================================================
               ESTADO COMPACTO (Nome Completo e Botão Espiar com Touch Target de 44px)
               ========================================================================= */
            <div className="p-3 sm:p-3.5 flex items-center gap-3 h-full">
              {/* Foto Reduzida */}
              <Link
                href={`/produto/${product.id}`}
                className="relative w-16 h-16 sm:w-18 sm:h-18 shrink-0 rounded-2xl bg-[#FDF0E9] dark:bg-[#251812] overflow-hidden flex items-center justify-center border border-border/40 group-hover:scale-105 transition-transform duration-300"
                aria-label={`Ver ${product.name}`}
              >
                <PhotoOrEmoji
                  photoOrEmoji={product.image_emoji}
                  name={product.name}
                  className="w-full h-full object-cover"
                  emojiClassName="text-3xl sm:text-4xl"
                />
              </Link>

              {/* Informações com Nome Completo sem cortes */}
              <div className="flex-1 min-w-0 pr-1 flex flex-col justify-center">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Badge
                    variant="pastry"
                    className="text-[9px] sm:text-[10px] px-1.5 py-0 uppercase tracking-wider font-semibold"
                  >
                    {product.flavor_tag}
                  </Badge>
                  {isOutOfStock ? (
                    <span className="text-[9px] text-destructive font-medium">Esgotado</span>
                  ) : (
                    <span className="text-[9px] sm:text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                      Disponível hoje
                    </span>
                  )}
                </div>

                <Link
                  href={`/produto/${product.id}`}
                  className="hover:text-primary transition-colors block"
                >
                  <h3 className="font-display font-semibold text-xs sm:text-[13px] lg:text-sm text-foreground leading-snug line-clamp-2">
                    {product.name}
                  </h3>
                </Link>

                <p className="text-[10px] sm:text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                  {product.description}
                </p>
              </div>

              {/* Lado Direito: Botão Espiar e Preço */}
              <div className="shrink-0 flex flex-col items-end justify-between self-stretch py-0.5">
                {/* Botão Espiar (Touch Target acessível de 44px de altura) */}
                <button
                  type="button"
                  onClick={handleOpenMobile}
                  className="inline-flex items-center justify-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-primary px-3 py-1.5 rounded-full bg-muted/60 hover:bg-muted/90 transition-all cursor-pointer min-h-[44px] active:scale-95"
                  aria-label={`Espiar detalhes do ${product.name}`}
                >
                  <span>Espiar</span>
                  <ChevronDown className="w-3.5 h-3.5 text-primary" />
                </button>

                <div className="mt-auto">
                  <span className="font-display font-bold text-xs sm:text-sm text-primary block text-right whitespace-nowrap">
                    {formatBRL(product.price)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
