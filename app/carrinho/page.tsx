"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatBRL } from "@/lib/utils";
import { PhotoOrEmoji } from "@/components/PhotoOrEmoji";
import { CepCalculator } from "@/components/CepCalculator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plus, Minus, Trash2, ArrowRight, ShoppingBag, ArrowLeft } from "lucide-react";

export default function CartPage() {
  const {
    items,
    count,
    subtotal,
    shippingFee,
    diffForFreeShipping,
    grandTotal,
    updateQuantity,
    removeFromCart,
  } = useCart();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Cabeçalho da Página */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-foreground">
            Sua Sacola
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Revise seus cupcakes antes de prosseguir para a entrega.
          </p>
        </div>
        <Link
          href="/#cardapio"
          className="text-xs sm:text-sm font-semibold text-primary hover:underline flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Continuar comprando
        </Link>
      </div>

      {items.length === 0 ? (
        /* Empty State Enriquecido (Resolvendo o apontamento da auditoria de UX!) */
        <Card className="rounded-3xl border-border bg-card p-8 sm:p-16 text-center space-y-5">
          <div className="w-24 h-24 rounded-full bg-primary/10 mx-auto flex items-center justify-center text-5xl shadow-inner">
            🧁
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="font-display font-bold text-2xl text-foreground">
              Sua sacola ainda está vazia
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Que tal escolher agora mesmo os seus sabores favoritos da nossa fornada artesanal?
            </p>
          </div>
          <Button asChild size="lg" className="rounded-full px-8 font-semibold shadow-lg shadow-primary/25">
            <Link href="/#cardapio">
              <span>Explorar Cardápio 🧁</span>
            </Link>
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Coluna Esquerda: Lista de Itens */}
          <div className="lg:col-span-7 space-y-4">
            {/* Aviso de Frete Grátis */}
            {shippingFee === 0 ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-sm font-medium flex items-center gap-2.5">
                <span className="text-xl">🎉</span>
                <span>Parabéns! Você atingiu o valor mínimo e ganhou <strong>Frete Grátis</strong>!</span>
              </div>
            ) : (
              <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl text-sm space-y-2">
                <div className="flex justify-between font-medium">
                  <span>Adicione mais <strong>{formatBRL(diffForFreeShipping)}</strong> para ganhar <strong>Frete Grátis</strong>!</span>
                </div>
                <div className="w-full bg-amber-200/60 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (subtotal / 49.9) * 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Cards dos Itens */}
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.product_id}
                  className="flex items-center gap-4 p-4 bg-card rounded-3xl border border-border shadow-xs"
                >
                  <Link
                    href={`/produto/${item.product_id}`}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#FDF0E9] flex items-center justify-center shrink-0 overflow-hidden"
                  >
                    <PhotoOrEmoji
                      photoOrEmoji={item.emoji}
                      name={item.name}
                      className="w-full h-full object-cover"
                      emojiClassName="text-3xl"
                    />
                  </Link>

                  <div className="flex-1 min-w-0 space-y-1">
                    <Link
                      href={`/produto/${item.product_id}`}
                      className="font-display font-semibold text-base text-foreground hover:text-primary transition-colors line-clamp-1"
                    >
                      {item.name}
                    </Link>
                    <div className="text-sm font-bold text-primary">
                      {formatBRL(item.price)}
                    </div>
                  </div>

                  {/* Controles de Quantidade */}
                  <div className="flex items-center gap-2 bg-muted/60 border border-border rounded-full p-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product_id, -1)}
                      className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-foreground hover:bg-muted active:scale-95 transition-all text-xs font-bold shadow-2xs"
                      aria-label="Diminuir quantidade"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-foreground">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product_id, 1)}
                      className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-foreground hover:bg-muted active:scale-95 transition-all text-xs font-bold shadow-2xs"
                      aria-label="Aumentar quantidade"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.product_id)}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors shrink-0"
                    aria-label={`Remover ${item.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Calculadora de CEP */}
            <div className="pt-2">
              <CepCalculator />
            </div>
          </div>

          {/* Coluna Direita: Resumo do Pedido */}
          <div className="lg:col-span-5">
            <Card className="rounded-3xl border-border bg-card p-6 shadow-sm sticky top-28 space-y-6">
              <h3 className="font-display font-bold text-xl text-foreground">
                Resumo do Pedido
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Itens ({count})</span>
                  <span className="font-medium text-foreground">{formatBRL(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Frete</span>
                  {shippingFee === 0 ? (
                    <span className="text-emerald-600 font-bold">Grátis</span>
                  ) : (
                    <span className="font-medium text-foreground">{formatBRL(shippingFee)}</span>
                  )}
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-lg font-bold text-foreground">
                  <span>Total estimado</span>
                  <span className="text-primary font-display text-2xl">{formatBRL(grandTotal)}</span>
                </div>
              </div>

              <Button
                asChild
                size="lg"
                className="w-full bg-primary hover:bg-[#C7415A] text-white rounded-full py-6 text-base font-semibold shadow-lg shadow-primary/25 gap-2"
              >
                <Link href="/checkout">
                  <span>Continuar para o Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                🔒 Pagamento 100% seguro via Pix ou Cartão no Checkout.
              </p>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
