"use client";

import React, { useState } from "react";
import { Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";
import { AnimeReveal } from "@/components/AnimeReveal";
import { LiquidButton } from "@/components/ui/liquid-glass-button";

interface CatalogClientProps {
  initialProducts: Product[];
}

export function CatalogClient({ initialProducts }: CatalogClientProps) {
  const [activeFilter, setActiveFilter] = useState("Todos");
  // Coordenação centralizada: apenas 1 card expandido por vez na vitrine inteira
  const [activeExpandedId, setActiveExpandedId] = useState<number | null>(null);

  const tags = ["Todos", ...Array.from(new Set(initialProducts.map((p) => p.flavor_tag)))];

  const filteredProducts =
    activeFilter === "Todos"
      ? initialProducts
      : initialProducts.filter((p) => p.flavor_tag === activeFilter);

  const handleFilterChange = (tag: string) => {
    setActiveFilter(tag);
    // Fecha qualquer card aberto ao mudar de categoria para preservar o alinhamento
    setActiveExpandedId(null);
  };

  return (
    <div className="space-y-8" id="cardapio">
      {/* Filtros de Categoria em Pílulas com Touch Targets de 44px */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
        {tags.map((tag) => {
          const isActive = tag === activeFilter;
          return (
            <LiquidButton
              key={tag}
              type="button"
              variant={isActive ? "default" : "light"}
              preset="berry"
              hasBeam={isActive}
              size="default"
              onClick={() => handleFilterChange(tag)}
              className={`px-5 font-semibold text-sm ${
                isActive ? "scale-105 shadow-md shadow-primary/25" : "text-muted-foreground"
              }`}
            >
              {tag}
            </LiquidButton>
          );
        })}
      </div>

      {/* Grid de Produtos com Reveal on Scroll e Coordenação Dinâmica de Z-Index */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 px-4 bg-card rounded-3xl border border-border space-y-3">
          <div className="text-4xl">🧁🔍</div>
          <h3 className="font-display font-semibold text-lg text-foreground">
            Nenhum cupcake nesta categoria
          </h3>
          <p className="text-sm text-muted-foreground">
            Que tal conferir todos os sabores disponíveis no momento?
          </p>
          <LiquidButton
            type="button"
            variant="light"
            size="default"
            onClick={() => handleFilterChange("Todos")}
            className="text-primary font-semibold inline-flex items-center justify-center mx-auto"
          >
            Ver todos os sabores →
          </LiquidButton>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-start pb-28">
          {filteredProducts.map((product, index) => {
            const isThisExpanded = activeExpandedId === product.id;

            return (
              <AnimeReveal
                key={`${product.id}-${activeFilter}`}
                variant="up"
                delay={(index % 4) * 60}
                duration={600}
                threshold={0.06}
                className={`relative ${
                  isThisExpanded ? "z-40" : "z-0 hover:z-20"
                } focus-within:z-40 transition-[z-index] duration-300`}
              >
                <ProductCard
                  product={product}
                  isExpandedControlled={isThisExpanded}
                  onExpandControlled={() => setActiveExpandedId(product.id)}
                  onCollapseControlled={() => {
                    setActiveExpandedId((current) => (current === product.id ? null : current));
                  }}
                />
              </AnimeReveal>
            );
          })}
        </div>
      )}
    </div>
  );
}
