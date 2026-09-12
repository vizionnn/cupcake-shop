"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { formatBRL } from "@/lib/utils";
import { PhotoOrEmoji } from "@/components/PhotoOrEmoji";
import { Badge } from "@/components/ui/badge";
import { Plus, Check, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import { animate } from "animejs";
import { BorderBeam } from "@/components/ui/border-beam";

interface ProductCardProps {
  product: Product;
  isExpandedControlled?: boolean;
  onExpandControlled?: () => void;
  onCollapseControlled?: () => void;
}

export function ProductCard({
  product,
  isExpandedControlled,
  onExpandControlled,
  onCollapseControlled,
}: ProductCardProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isExpandedMobile, setIsExpandedMobile] = useState(false);
  const [isHoverSupported, setIsHoverSupported] = useState(false);

  const [isClosing, setIsClosing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
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
    isHoveredRef.current = isExpandedControlled !== undefined ? isExpandedControlled : isHovered;
  }, [isHovered, isExpandedControlled]);

  // Limpa os timers ao desmontar
  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const isExpanded =
    (isExpandedControlled !== undefined ? isExpandedControlled : isHovered) ||
    isExpandedMobile;

  // Inicia o timer de 500ms de repouso (Hover Intent)
  const startHoverIntentTimer = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => {
      // O mouse ficou 500ms parado em cima do produto!
      setIsClosing(false);
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
      if (onExpandControlled) {
        onExpandControlled();
      } else {
        setIsHovered(true);
      }
      isHoveredRef.current = true;
      hoverTimerRef.current = null;
    }, 500);
  };

  // Rastreamento suave do cursor no Desktop (Hover Intent Rigoroso)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isHoverSupported) return;

    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);
    cardRef.current.style.setProperty("--spotlight-opacity", "1");

    // Se já estiver expandido, mantém estável aberto
    if (isExpanded) return;

    // Enquanto o mouse estiver se mexendo (voando pelo card), cancela o timer.
    // Exigência estrita: se o usuário passar tempo mexendo sem pousar, NÃO abre!
    if (lastPosRef.current) {
      const dx = Math.abs(e.clientX - lastPosRef.current.x);
      const dy = Math.abs(e.clientY - lastPosRef.current.y);
      if (dx > 3 || dy > 3) {
        if (hoverTimerRef.current) {
          clearTimeout(hoverTimerRef.current);
          hoverTimerRef.current = null;
        }
      }
    }
    lastPosRef.current = { x: e.clientX, y: e.clientY };

    // Se não há timer ativo, inicia a contagem de 500ms de pouso
    if (!hoverTimerRef.current) {
      startHoverIntentTimer();
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isHoverSupported) return;
    lastPosRef.current = { x: e.clientX, y: e.clientY };
    if (!isExpanded) {
      startHoverIntentTimer();
    }
  };

  const handleMouseLeave = () => {
    if (!isHoverSupported) return;

    // 1. Cancela imediatamente qualquer timer de abertura pendente
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    lastPosRef.current = null;

    // 2. Aciona o estado de fechamento por 500ms para preservar a elevação e a animação fluida reversa
    if (isExpanded) {
      setIsClosing(true);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      closeTimerRef.current = setTimeout(() => {
        setIsClosing(false);
        closeTimerRef.current = null;
      }, 500);
    }

    isHoveredRef.current = false;
    setIsHovered(false);
    if (onCollapseControlled) {
      onCollapseControlled();
    }

    if (cardRef.current) {
      cardRef.current.style.setProperty("--spotlight-opacity", "0");
    }
  };

  // Acessibilidade por teclado (apenas no desktop com Tab)
  const handleFocus = () => {
    if (!isHoverSupported) return;
    setIsClosing(false);
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    if (onExpandControlled) {
      onExpandControlled();
    } else {
      setIsHovered(true);
    }
    isHoveredRef.current = true;
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!isHoverSupported) return;
    if (!cardRef.current?.contains(e.relatedTarget as Node)) {
      if (isExpanded) {
        setIsClosing(true);
        if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
        closeTimerRef.current = setTimeout(() => {
          setIsClosing(false);
          closeTimerRef.current = null;
        }, 500);
      }
      isHoveredRef.current = false;
      setIsHovered(false);
      if (onCollapseControlled) {
        onCollapseControlled();
      }
    }
  };

  // Ações explícitas de abrir e fechar no Mobile (Touch)
  const handleOpenMobile = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsClosing(false);
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    if (onExpandControlled) {
      onExpandControlled();
    } else {
      setIsExpandedMobile(true);
    }
  };

  const handleCloseMobile = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    setIsClosing(true);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setIsClosing(false);
      closeTimerRef.current = null;
    }, 500);
    isHoveredRef.current = false;
    setIsHovered(false);
    setIsExpandedMobile(false);
    if (onCollapseControlled) {
      onCollapseControlled();
    }
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

  return (
    /* 
      CONTAINER PRINCIPAL COM TRANSIÇÃO CONTÍNUA E FLUIDA DE 500MS:
      - No Desktop (sm:):
        O slot da grade preserva sm:h-[120px] de forma estável.
        O card permanece sempre em 'sm:absolute sm:top-0 sm:left-0 sm:w-full',
        permitindo que o CSS interpole suavemente a propriedade 'height' de 120px até 430px (e vice-versa) em 500ms.
      - No Mobile (< sm):
        O fluxo usa acordeão suave com 'h-[116px]' <-> 'h-[430px]' com 'duration-500 ease-in-out'.
    */
    <div
      className={`w-full transition-all duration-500 ease-in-out ${
        isExpanded
          ? "relative h-[430px] sm:relative sm:h-[120px] z-30 sm:z-40"
          : isClosing
          ? "relative h-[116px] sm:relative sm:h-[120px] z-30 sm:z-40"
          : "relative h-[116px] sm:h-[120px] z-0 hover:z-20"
      }`}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`fluent-card-wrapper group w-full p-[1.5px] rounded-3xl bg-border/60 dark:bg-border/40 transition-all duration-500 ease-in-out sm:absolute sm:top-0 sm:left-0 sm:w-full ${
          isExpanded
            ? "relative h-[430px] sm:h-[430px] shadow-2xl shadow-black/40 dark:shadow-black/80 ring-1 ring-primary/25 z-40"
            : isClosing
            ? "relative h-[116px] sm:h-[120px] shadow-lg ring-0 z-40"
            : "relative h-[116px] sm:h-[120px] border-transparent shadow-xs hover:shadow-md z-10"
        }`}
      >
        {/* Camada 1: Borda Dinâmica (Border Reveal) */}
        <div className="fluent-border-glow" />

        {/* Camada 2: Superfície Iluminada (Spotlight) e Conteúdo Persistente com Crossfade Reverso */}
        <div className="relative rounded-[calc(1.5rem-1.5px)] bg-card text-card-foreground overflow-hidden z-[2] w-full h-full">
          <div className="fluent-surface-spotlight" />

          {/* =========================================================================
              CAMADA COMPACTA (Visível no estado fechado, fade-out e fade-in suave em 500ms)
             ========================================================================= */}
          <div
            aria-hidden={isExpanded}
            className={`absolute inset-x-0 top-0 h-[116px] sm:h-[120px] p-3 sm:p-3.5 flex items-center gap-3 transition-all duration-500 ease-in-out ${
              isExpanded
                ? "opacity-0 pointer-events-none scale-95 -translate-y-2"
                : "opacity-100 pointer-events-auto scale-100 translate-y-0"
            }`}
          >
            {/* Foto Reduzida */}
            <Link
              href={`/produto/${product.id}`}
              tabIndex={isExpanded ? -1 : 0}
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

            {/* Informações com Nome Completo */}
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
                tabIndex={isExpanded ? -1 : 0}
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
              <button
                type="button"
                tabIndex={isExpanded ? -1 : 0}
                onClick={handleOpenMobile}
                className="inline-flex items-center justify-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-primary px-3 py-1.5 rounded-full bg-muted/60 hover:bg-muted/90 transition-all cursor-pointer min-h-[44px] min-w-[44px] active:scale-95"
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

          {/* =========================================================================
              CAMADA EXPANDIDA (Visível no estado aberto, fade-in e fade-out reverso suave em 500ms)
             ========================================================================= */}
          <div
            aria-hidden={!isExpanded}
            className={`absolute inset-x-0 top-0 h-[430px] p-4 sm:p-5 flex flex-col gap-3 transition-all duration-500 ease-in-out ${
              isExpanded
                ? "opacity-100 pointer-events-auto scale-100 translate-y-0"
                : "opacity-0 pointer-events-none scale-95 translate-y-3"
            }`}
          >
            {/* Foto Ampliada em Destaque */}
            <Link
              href={`/produto/${product.id}`}
              tabIndex={isExpanded ? 0 : -1}
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
                  tabIndex={isExpanded ? 0 : -1}
                  className="hover:text-primary transition-colors block flex-1 min-w-0"
                >
                  <h3 className="font-display font-bold text-base sm:text-lg text-foreground leading-snug truncate">
                    {product.name}
                  </h3>
                </Link>

                {/* Botão de Fechar no Mobile (Touch Target 44x44px conforme WCAG 2.2 AA) */}
                <button
                  type="button"
                  tabIndex={isExpanded ? 0 : -1}
                  onClick={handleCloseMobile}
                  className="text-xs font-semibold text-foreground hover:text-primary flex items-center justify-center gap-1 px-3 py-2 rounded-full bg-muted/80 hover:bg-muted transition-all min-h-[44px] min-w-[44px] shrink-0 cursor-pointer active:scale-95"
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
                <button
                  type="button"
                  tabIndex={isExpanded ? 0 : -1}
                  onClick={handleAdd}
                  disabled={isOutOfStock}
                  className="relative overflow-hidden inline-flex items-center justify-center rounded-full px-4.5 py-2 text-xs font-bold gap-1.5 bg-gradient-to-b from-primary via-[#d13b56] to-[#a3223b] hover:from-[#f43f5e] hover:to-[#be123c] text-white shadow-md shadow-primary/25 border border-white/20 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none min-h-[44px] cursor-pointer select-none group"
                >
                  {!isOutOfStock && <BorderBeam preset="berry" duration={4} borderWidth={1.5} />}
                  <span className="relative z-10 flex items-center gap-1.5">
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
                  </span>
                </button>

                <Link
                  href={`/produto/${product.id}`}
                  tabIndex={isExpanded ? 0 : -1}
                  className="w-11 h-11 rounded-full border border-border/70 hover:border-primary flex items-center justify-center text-muted-foreground hover:text-primary transition-colors min-w-[44px] min-h-[44px] active:scale-95"
                  title="Ver detalhes completos do cupcake"
                  aria-label={`Ver detalhes completos do ${product.name}`}
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
