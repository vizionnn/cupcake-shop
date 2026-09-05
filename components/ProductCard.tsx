"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { formatBRL } from "@/lib/utils";
import { PhotoOrEmoji } from "@/components/PhotoOrEmoji";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Check } from "lucide-react";

import { animate } from "animejs";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
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
    <Card className="group overflow-hidden rounded-3xl border-border bg-card hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 flex flex-col">
      {/* Foto / Imagem */}
      <Link
        href={`/produto/${product.id}`}
        className="block relative aspect-4/3 w-full bg-[#FDF0E9] dark:bg-[#251812] overflow-hidden"
        aria-label={`Ver detalhes do ${product.name}`}
      >
        <div className="w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
          <PhotoOrEmoji
            photoOrEmoji={product.image_emoji}
            name={product.name}
            className="w-full h-full object-cover"
            emojiClassName="text-6xl"
          />
        </div>
        <span className="absolute bottom-2 left-3 text-[10px] text-muted-foreground/80 bg-card/80 backdrop-blur-xs px-2 py-0.5 rounded-full border border-border/40">
          *Foto ilustrativa
        </span>
      </Link>

      <CardContent className="p-5 flex-1 flex flex-col">
        <div className="flex items-center justify-between gap-2 mb-2">
          <Badge variant="pastry" className="text-[11px] uppercase tracking-wider">
            {product.flavor_tag}
          </Badge>
          {isOutOfStock ? (
            <Badge variant="destructive" className="text-[10px]">
              Esgotado
            </Badge>
          ) : (
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
              Disponível hoje
            </span>
          )}
        </div>

        <Link
          href={`/produto/${product.id}`}
          className="group-hover:text-primary transition-colors block"
        >
          <h3 className="font-display font-semibold text-base sm:text-lg text-foreground line-clamp-2 min-h-[3rem] sm:min-h-[3.5rem] flex items-center leading-snug">
            {product.name}
          </h3>
        </Link>

        <p className="text-xs text-muted-foreground line-clamp-2 mt-1.5 leading-relaxed flex-1">
          {product.description}
        </p>
      </CardContent>

      <CardFooter className="p-5 pt-0 flex items-center justify-between gap-3 border-t border-border/40 mt-auto">
        <div>
          <span className="text-[11px] text-muted-foreground block font-medium">
            Preço unitário
          </span>
          <span className="font-display font-bold text-lg text-primary">
            {formatBRL(product.price)}
          </span>
        </div>

        <Button
          type="button"
          onClick={handleAdd}
          disabled={isOutOfStock}
          size="sm"
          className="rounded-full px-4 gap-1.5 font-semibold transition-all"
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
      </CardFooter>
    </Card>
  );
}
