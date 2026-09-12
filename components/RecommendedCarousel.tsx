"use client";

import React, { useRef, useState, useEffect } from "react";
import { Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LiquidButton } from "@/components/ui/liquid-glass-button";

interface RecommendedCarouselProps {
  products: Product[];
}

export function RecommendedCarousel({ products }: RecommendedCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  // Coordenação de card único ativo no carrossel
  const [activeExpandedId, setActiveExpandedId] = useState<number | null>(null);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [products]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.75;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative group">
      {/* Controles de navegação do carrossel (Touch Targets de 44px conforme WCAG 2.2 AA) */}
      <div className="hidden sm:flex items-center gap-2 absolute -top-14 right-0 z-10">
        <LiquidButton
          type="button"
          variant="light"
          size="icon"
          preset="gold"
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          aria-label="Rolar carrossel para a esquerda"
          className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full shadow-xs disabled:opacity-30"
        >
          <ChevronLeft className="w-4 h-4 text-foreground" />
        </LiquidButton>

        <LiquidButton
          type="button"
          variant="light"
          size="icon"
          preset="gold"
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          aria-label="Rolar carrossel para a direita"
          className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full shadow-xs disabled:opacity-30"
        >
          <ChevronRight className="w-4 h-4 text-foreground" />
        </LiquidButton>
      </div>

      {/* 
        Trilho de Cards do Carrossel:
        - Largura fluida 'w-[84vw] max-w-[340px] sm:w-[350px]' (Regra Antiquebra Mobile: Zero Horizontal Overflow).
        - 'min-h-[460px] pb-6 pt-2' para garantir que os cards expandidos de 430px com sombras e feixes não sofram corte.
      */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex items-start gap-4 sm:gap-6 overflow-x-auto min-h-[460px] pb-6 pt-2 snap-x snap-mandatory scroll-smooth no-scrollbar transition-all duration-300 px-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((item) => {
          const isThisExpanded = activeExpandedId === item.id;

          return (
            <div
              key={item.id}
              className={`w-[84vw] max-w-[340px] sm:w-[350px] shrink-0 snap-start flex flex-col relative ${
                isThisExpanded ? "z-40" : "z-0 hover:z-20"
              } focus-within:z-40 transition-[z-index] duration-300`}
            >
              <ProductCard
                product={item}
                isExpandedControlled={isThisExpanded}
                onExpandControlled={() => setActiveExpandedId(item.id)}
                onCollapseControlled={() => {
                  setActiveExpandedId((current) => (current === item.id ? null : current));
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
