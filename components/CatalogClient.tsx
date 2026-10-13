"use client";

import React, { useState } from "react";
import { Product } from "@/types";
import { ShowcaseCard } from "@/components/ShowcaseCard";
import { Reveal } from "@/components/Reveal";

interface CatalogClientProps {
  initialProducts: Product[];
}

export function CatalogClient({ initialProducts }: CatalogClientProps) {
  const [activeFilter, setActiveFilter] = useState("Todos");
  const tags = ["Todos", ...Array.from(new Set(initialProducts.map((p) => p.flavor_tag)))];
  const filtered =
    activeFilter === "Todos" ? initialProducts : initialProducts.filter((p) => p.flavor_tag === activeFilter);

  return (
    <div className="space-y-8" id="cardapio">
      {/* Filtros: abas com sublinhado, rolagem horizontal no mobile */}
      <div
        role="tablist"
        aria-label="Filtrar por categoria"
        className="no-scrollbar -mx-4 flex gap-1 overflow-x-auto border-b border-border px-4 sm:mx-0 sm:px-0"
      >
        {tags.map((tag) => {
          const isActive = tag === activeFilter;
          return (
            <button
              key={tag}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveFilter(tag)}
              className={`-mb-px min-h-[44px] shrink-0 border-b-2 px-4 text-sm font-bold transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none ${
                isActive
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="border border-dashed border-border px-4 py-16 text-center">
          <h3 className="font-display text-lg font-semibold text-foreground">Nenhum cupcake nesta categoria</h3>
          <p className="mt-1 text-sm text-muted-foreground">Veja todos os sabores disponíveis no momento.</p>
          <button type="button" onClick={() => setActiveFilter("Todos")} className="nb-btn nb-btn-ghost mt-5">
            Ver todos os sabores
          </button>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {filtered.map((product, index) => (
            <li key={`${product.id}-${activeFilter}`}>
              <Reveal delay={(index % 4) * 60} className="h-full">
                <ShowcaseCard product={product} />
              </Reveal>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
