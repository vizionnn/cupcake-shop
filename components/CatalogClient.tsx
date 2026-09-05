"use client";

import React, { useState } from "react";
import { Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";
import { AnimeReveal } from "@/components/AnimeReveal";

interface CatalogClientProps {
  initialProducts: Product[];
}

export function CatalogClient({ initialProducts }: CatalogClientProps) {
  const [activeFilter, setActiveFilter] = useState("Todos");

  const tags = ["Todos", ...Array.from(new Set(initialProducts.map((p) => p.flavor_tag)))];

  const filteredProducts =
    activeFilter === "Todos"
      ? initialProducts
      : initialProducts.filter((p) => p.flavor_tag === activeFilter);

  return (
    <div className="space-y-8" id="cardapio">
      {/* Filtros de Categoria */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
        {tags.map((tag) => {
          const isActive = tag === activeFilter;
          return (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveFilter(tag)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-all cursor-pointer ${
                isActive
                  ? "bg-primary text-white shadow-md shadow-primary/25 scale-105"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 hover:bg-muted/40 active:scale-95"
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>

      {/* Grid de Produtos com Reveal on Scroll por Card */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 px-4 bg-card rounded-3xl border border-border space-y-3">
          <div className="text-4xl">🧁🔍</div>
          <h3 className="font-display font-semibold text-lg text-foreground">
            Nenhum cupcake nesta categoria
          </h3>
          <p className="text-sm text-muted-foreground">
            Que tal conferir todos os sabores disponíveis no momento?
          </p>
          <button
            type="button"
            onClick={() => setActiveFilter("Todos")}
            className="text-primary hover:underline text-sm font-semibold inline-block"
          >
            Ver todos os sabores →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <AnimeReveal
              key={`${product.id}-${activeFilter}`}
              variant="up"
              delay={(index % 4) * 60}
              duration={600}
              threshold={0.06}
            >
              <ProductCard product={product} />
            </AnimeReveal>
          ))}
        </div>
      )}
    </div>
  );
}


