"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatBRL } from "@/lib/utils";
import { PhotoOrEmoji } from "@/components/PhotoOrEmoji";
import { CepCalculator } from "@/components/CepCalculator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

export function CartDrawer() {
  const {
    items,
    count,
    subtotal,
    shippingFee,
    diffForFreeShipping,
    grandTotal,
    isDrawerOpen,
    setIsDrawerOpen,
    updateQuantity,
    removeFromCart,
  } = useCart();

  return (
    <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-6 bg-background">
        <SheetHeader className="text-left pb-4">
          <div className="flex items-center justify-between pr-8">
            <SheetTitle className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              Sua Sacola
            </SheetTitle>
            <span className="text-xs font-semibold px-2.5 py-1 bg-muted rounded-full text-muted-foreground">
              {count} {count === 1 ? "doce" : "doces"}
            </span>
          </div>
        </SheetHeader>

        {items.length === 0 ? (
          /* Empty State Convidativo com CTA */
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-4xl shadow-inner">
              🧁
            </div>
            <div className="space-y-1.5">
              <h3 className="font-display font-semibold text-lg text-foreground">
                Sua sacola ainda está vazia
              </h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Nossos cupcakes são assados diariamente com amor e ingredientes nobres. Escolha seus sabores favoritos!
              </p>
            </div>
            <Button
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              className="mt-2 bg-primary hover:bg-[#C7415A] text-white rounded-full px-6 py-2.5 font-semibold"
            >
              Explorar Cardápio 🧁
            </Button>
          </div>
        ) : (
          <>
            {/* Aviso de Frete Grátis com Barra de Progresso */}
            <div className="pt-2 pb-1">
              {shippingFee === 0 ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-medium flex items-center gap-2">
                  <span>🎉</span>
                  <span>Parabéns! Você ganhou <strong>Frete Grátis</strong> para este pedido!</span>
                </div>
              ) : (
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl text-xs space-y-1.5">
                  <div className="flex justify-between font-medium">
                    <span>Falta <strong>{formatBRL(diffForFreeShipping)}</strong> para ter <strong>Frete Grátis</strong>!</span>
                  </div>
                  <div className="w-full bg-amber-200/60 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (subtotal / 49.9) * 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Lista de Itens do Carrinho */}
            <div className="flex-1 overflow-y-auto pr-1 py-2 space-y-3">
              {items.map((item) => (
                <div
                  key={item.product_id}
                  className="flex items-center gap-3 p-3 bg-card rounded-2xl border border-border/80 shadow-xs hover:border-border transition-all"
                >
                  <Link
                    href={`/produto/${item.product_id}`}
                    onClick={() => setIsDrawerOpen(false)}
                    className="w-14 h-14 rounded-xl bg-[#FDF0E9] flex items-center justify-center shrink-0 overflow-hidden"
                  >
                    <PhotoOrEmoji
                      photoOrEmoji={item.emoji}
                      name={item.name}
                      className="w-full h-full object-cover"
                      emojiClassName="text-2xl"
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/produto/${item.product_id}`}
                      onClick={() => setIsDrawerOpen(false)}
                      className="font-display font-semibold text-sm text-foreground hover:text-primary transition-colors line-clamp-1 block"
                    >
                      {item.name}
                    </Link>
                    <div className="text-xs font-bold text-primary mt-0.5">
                      {formatBRL(item.price)}
                    </div>
                  </div>

                  {/* Controles de Quantidade acessíveis (Touch target 44×44px conforme WCAG 2.5.8) */}
                  <div className="flex items-center gap-1 bg-muted/60 border border-border/80 rounded-full p-0.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product_id, -1)}
                      className="min-w-[44px] min-h-[44px] flex items-center justify-center text-foreground hover:text-primary active:scale-95 transition-all text-xs font-bold"
                      aria-label={`Diminuir quantidade de ${item.name}`}
                    >
                      <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-2xs hover:bg-muted">
                        <Minus className="w-3 h-3" />
                      </span>
                    </button>
                    <span className="w-5 text-center text-xs font-bold text-foreground">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product_id, 1)}
                      className="min-w-[44px] min-h-[44px] flex items-center justify-center text-foreground hover:text-primary active:scale-95 transition-all text-xs font-bold"
                      aria-label={`Aumentar quantidade de ${item.name}`}
                    >
                      <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-2xs hover:bg-muted">
                        <Plus className="w-3 h-3" />
                      </span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.product_id)}
                    className="min-w-[44px] min-h-[44px] flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors shrink-0"
                    aria-label={`Remover ${item.name} da sacola`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {/* Calculadora de CEP dentro da gaveta */}
              <div className="pt-2">
                <CepCalculator compact={true} />
              </div>
            </div>

            {/* Rodapé Financeiro e Botão de Checkout */}
            <div className="pt-4 border-t border-border space-y-3 bg-background">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-medium text-foreground">{formatBRL(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Frete estimado</span>
                  {shippingFee === 0 ? (
                    <span className="text-emerald-600 font-bold">Grátis</span>
                  ) : (
                    <span className="font-medium text-foreground">{formatBRL(shippingFee)}</span>
                  )}
                </div>
                <Separator className="my-1" />
                <div
                  aria-live="polite"
                  aria-atomic="true"
                  className="flex justify-between text-base font-bold text-foreground pt-1"
                >
                  <span>Total</span>
                  <span className="text-primary font-display text-lg">{formatBRL(grandTotal)}</span>
                </div>
              </div>

              <Button
                asChild
                className="w-full bg-primary hover:bg-[#C7415A] text-white rounded-full py-6 text-base font-semibold shadow-lg shadow-primary/25 gap-2"
              >
                <Link href="/checkout" onClick={() => setIsDrawerOpen(false)}>
                  <span>Finalizar Pedido</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
