"use client";

import React, { useRef, useState, useEffect } from "react";
import { Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RecommendedCarouselProps {
  products: Product[];
}

export function RecommendedCarousel({ products }: RecommendedCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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
      {/* Controles de navegação do carrossel */}
      <div className="hidden sm:flex items-center gap-2 absolute -top-14 right-0 z-10">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          aria-label="Rolar carrossel para a esquerda"
          className="w-9 h-9 rounded-full border-border bg-card hover:bg-muted shadow-xs disabled:opacity-30 transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          aria-label="Rolar carrossel para a direita"
          className="w-9 h-9 rounded-full border-border bg-card hover:bg-muted shadow-xs disabled:opacity-30 transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Trilho de Cards do Carrossel com Snap suave e suporte a expansão sem cortes */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex items-start gap-5 sm:gap-6 overflow-x-auto min-h-[440px] pb-4 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar transition-all duration-300"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((item) => (
          <div
            key={item.id}
            className="w-[320px] sm:w-[350px] shrink-0 snap-start flex flex-col relative hover:z-30 focus-within:z-30"
          >
            <ProductCard product={item} />
          </div>
        ))}
      </div>
    </div>
  );
}
