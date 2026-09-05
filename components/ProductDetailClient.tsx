"use client";

import React, { useState } from "react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { formatBRL } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus, Minus, ShoppingBag, Check } from "lucide-react";

interface ProductDetailClientProps {
  product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const totalPrice = product.price * quantity;
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="space-y-6 pt-4 border-t border-border">
      {/* Seletor de Quantidade */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-semibold text-foreground">Quantidade:</span>
        <div className="inline-flex items-center gap-2 bg-card border border-border rounded-full p-1.5 shadow-2xs">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={isOutOfStock}
            className="w-9 h-9 rounded-full bg-muted/60 hover:bg-muted flex items-center justify-center text-foreground disabled:opacity-40 transition-colors font-bold text-sm"
            aria-label="Diminuir quantidade"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-8 text-center font-bold text-sm text-foreground">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
            disabled={isOutOfStock || quantity >= product.stock}
            className="w-9 h-9 rounded-full bg-muted/60 hover:bg-muted flex items-center justify-center text-foreground disabled:opacity-40 transition-colors font-bold text-sm"
            aria-label="Aumentar quantidade"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        {product.stock > 0 && product.stock <= 5 && (
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800/40">
            Restam apenas {product.stock} unidades!
          </span>
        )}
      </div>

      {/* Botão de Adicionar com Preço Total Dinâmico */}
      <Button
        type="button"
        onClick={handleAdd}
        disabled={isOutOfStock}
        size="lg"
        className="w-full sm:w-auto min-w-[260px] bg-primary hover:bg-[#C7415A] text-white rounded-full py-6 text-base font-semibold shadow-lg shadow-primary/25 gap-2"
      >
        {added ? (
          <>
            <Check className="w-5 h-5 text-white" />
            <span>Adicionado à Sacola!</span>
          </>
        ) : isOutOfStock ? (
          <span>Esgotado no momento</span>
        ) : (
          <>
            <ShoppingBag className="w-5 h-5" />
            <span>Adicionar à Sacola · {formatBRL(totalPrice)}</span>
          </>
        )}
      </Button>
    </div>
  );
}
