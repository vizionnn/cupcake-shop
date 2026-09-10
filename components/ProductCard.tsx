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

  const cardRef = useRef<HTMLDivElement>(null);
  const expandTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isHoveredRef = useRef(false);

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

  // Rastreamento suave do cursor e lógica de Hover Intent (só abre quando o mouse parar)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);
    cardRef.current.style.setProperty("--spotlight-opacity", "1");

    // Se já estiver expandido, o card se mantém estável aberto
    if (isHoveredRef.current || isExpandedMobile) return;

    // Enquanto o mouse estiver se movendo dentro do card, reinicia o timer.
    // O card só abre quando o usuário PARAR o cursor por 300ms!
    if (expandTimerRef.current) {
      clearTimeout(expandTimerRef.current);
    }
    expandTimerRef.current = setTimeout(() => {
      isHoveredRef.current = true;
      setIsHovered(true);
    }, 300);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    handleMouseMove(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    // PROTEÇÃO TOTAL CONTRA O LOOP DE CONTRAÇÃO:
    // Se o card estiver expandido, consideramos a altura completa (450px) para que
    // qualquer movimento do cursor dentro do card expandido mantenha o card aberto!
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const targetHeight = isHoveredRef.current ? 450 : 130;
      const isStillInside =
        e.clientX >= rect.left - 2 &&
        e.clientX <= rect.right + 2 &&
        e.clientY >= rect.top - 2 &&
        e.clientY <= rect.top + targetHeight + 2;

      if (isStillInside) {
        return; // O mouse ainda está sobre o card, não fecha!
      }
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

  // Acessibilidade por teclado
  const handleFocus = () => {
    isHoveredRef.current = true;
    setIsHovered(true);
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!cardRef.current?.contains(e.relatedTarget as Node)) {
      isHoveredRef.current = false;
      setIsHovered(false);
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
    /* Container pai fixo na grade para garantir que nenhum elemento vizinho seja empurrado */
    <div
      className={`relative w-full h-[116px] sm:h-[120px] transition-all duration-300 ${
        isExpanded ? "z-40" : "z-0 hover:z-20"
      }`}
    >
      {/* Card absoluto que flutua por cima dos elementos inferiores quando expandido */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`fluent-card-wrapper group absolute top-0 left-0 w-full p-[1.5px] rounded-3xl bg-border/60 dark:bg-border/40 transition-[box-shadow,border-color] duration-300 ${
          isExpanded
            ? "shadow-2xl shadow-black/40 dark:shadow-black/80 ring-1 ring-primary/25 z-40 h-[420px] sm:h-[430px]"
            : "hover:shadow-md border-transparent z-0 h-full"
        }`}
      >
        {/* Camada 1: Borda Dinâmica (Border Reveal) */}
        <div className="fluent-border-glow" />

        {/* Camada 2: Superfície Iluminada (Spotlight) e Conteúdo */}
        <div className="relative rounded-[calc(1.5rem-1.5px)] bg-card text-card-foreground overflow-hidden z-[2] flex flex-col h-full transition-all duration-500">
          <div className="fluent-surface-spotlight" />

          {/* =========================================================================
              ESTADO EXPANDIDO (Altura fixa padronizada: 420px mobile / 430px desktop)
              Estável e imune a loops de contração
             ========================================================================= */}
          {isExpanded ? (
            <div className="p-4 sm:p-5 flex flex-col h-full gap-3 animate-in fade-in zoom-in-95 duration-300 ease-out">
              {/* Foto Ampliada em Destaque com Altura Fixa Padronizada (h-48 / h-52) */}
              <Link
                href={`/produto/${product.id}`}
                className="block relative h-48 sm:h-52 w-full shrink-0 rounded-2xl bg-[#FDF0E9] dark:bg-[#251812] overflow-hidden group/photo border border-border/40 shadow-xs"
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

                  {/* Botão de Fechar no Mobile */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsExpandedMobile(false);
                    }}
                    className="sm:hidden text-xs text-muted-foreground hover:text-foreground flex items-center gap-0.5 px-2 py-1 rounded-full bg-muted/60 shrink-0"
                    aria-label="Recolher detalhes"
                  >
                    <span>Fechar</span>
                    <ChevronUp className="w-3.5 h-3.5" />
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
                    className="rounded-full px-4 gap-1.5 font-semibold transition-all shadow-xs shadow-primary/20 hover:shadow-md"
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
                    className="w-8 h-8 rounded-full border border-border/70 hover:border-primary flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
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
               ESTADO COMPACTO (Altura fixa uniforme com Nome Completo sem cortes)
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

              {/* Lado Direito: Espiar e Preço */}
              <div className="shrink-0 flex flex-col items-end justify-between self-stretch py-0.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpandedMobile(true);
                  }}
                  className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-muted-foreground hover:text-primary px-2 py-0.5 rounded-full bg-muted/40 hover:bg-muted/70 transition-all cursor-pointer"
                  aria-label={`Expandir detalhes do ${product.name}`}
                >
                  <span>Espiar</span>
                  <ChevronDown className="w-3 h-3 text-primary" />
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
