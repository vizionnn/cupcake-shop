"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Plus } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { formatBRL } from "@/lib/utils";
import { PhotoOrEmoji } from "@/components/PhotoOrEmoji";

// Card de vitrine: foto em destaque, hierarquia nome > preço > ação.
// Toda a área da foto e do nome é um único link; o botão de compra é o único CTA.
export function ShowcaseCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const isOutOfStock = product.stock <= 0;

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <article className="group flex h-full flex-col border border-border bg-card transition-[border-color,box-shadow] duration-200 ease-out hover:border-foreground/30 motion-reduce:transition-none">
      <Link
        href={`/produto/${product.id}`}
        className="flex flex-1 flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
        aria-label={`Ver ${product.name}`}
      >
        <div className="relative aspect-square overflow-hidden bg-muted">
          <PhotoOrEmoji
            photoOrEmoji={product.image_emoji}
            name={product.name}
            className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
            emojiClassName="text-5xl"
          />
          <span className="absolute left-0 top-3 bg-background px-2.5 py-1 font-mono text-[0.625rem] font-medium uppercase tracking-[0.14em] text-foreground">
            {product.flavor_tag}
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-1 p-3 sm:p-4">
          <h3 className="font-display text-base font-semibold leading-snug text-foreground sm:text-lg">
            {product.name}
          </h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>
        </div>
      </Link>
      <div className="flex items-center justify-between gap-2 border-t border-border p-3 sm:p-4">
        <span className="font-display text-lg font-bold text-foreground">{formatBRL(product.price)}</span>
        <button
          type="button"
          onClick={handleAdd}
          disabled={isOutOfStock}
          aria-label={isOutOfStock ? `${product.name} esgotado` : `Adicionar ${product.name} à sacola`}
          className="nb-btn nb-btn-primary min-w-[44px] px-3 sm:px-4"
        >
          {added ? <Check className="h-4 w-4" aria-hidden /> : <Plus className="h-4 w-4" aria-hidden />}
          <span className="hidden sm:inline">{isOutOfStock ? "Esgotado" : added ? "Na sacola" : "Adicionar"}</span>
        </button>
      </div>
    </article>
  );
}
