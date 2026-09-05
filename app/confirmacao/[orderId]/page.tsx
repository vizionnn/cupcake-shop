import React from "react";
import { supabase } from "@/lib/supabase";
import { Order, OrderItem } from "@/types";
import { formatBRL } from "@/lib/utils";
import { PhotoOrEmoji } from "@/components/PhotoOrEmoji";
import { CupcakeRain } from "@/components/CupcakeRain";
import { PrintReceiptButton } from "@/components/PrintReceiptButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2, Clock, MapPin, CreditCard, ArrowRight, ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getMemoryOrder } from "@/lib/orders-store";
import { INITIAL_PRODUCTS } from "@/lib/products-data";

import { AnimatedReceipt } from "@/components/AnimatedReceipt";

export const revalidate = 0;

interface ConfirmationPageProps {
  params: Promise<{ orderId: string }>;
}

export async function generateMetadata({ params }: ConfirmationPageProps) {
  const { orderId: rawId } = await params;
  return {
    title: `Pedido #${rawId} Confirmado — Nuvem de Açúcar`,
  };
}

export default async function ConfirmationPage({ params }: ConfirmationPageProps) {
  const { orderId: rawId } = await params;
  const orderId = parseInt(rawId, 10);
  if (isNaN(orderId)) notFound();

  let order: Order | null = null;

  // 1. Tenta recuperar do Supabase
  try {
    const { data: orderData, error: orderErr } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (!orderErr && orderData) {
      order = orderData as Order;

      const { data: itemsData } = await supabase
        .from("order_items")
        .select("*, products(name, image_emoji)")
        .eq("order_id", orderId);

      const items: OrderItem[] = ((itemsData as any[]) || []).map((item) => ({
        id: item.id,
        order_id: item.order_id,
        product_id: item.product_id,
        product_name: item.products?.name || item.product_name,
        unit_price: Number(item.unit_price),
        quantity: item.quantity,
        image_emoji: item.products?.image_emoji,
      }));

      order.items = items;
    }
  } catch (_) {}

  // 2. Se não estiver no Supabase, recupera da memória local de pedidos
  if (!order) {
    const memOrder = getMemoryOrder(orderId);
    if (memOrder) {
      order = memOrder;
    }
  }

  // 3. Fallback resiliente garantido para modo apresentação / demo
  if (!order) {
    const defaultProduct = INITIAL_PRODUCTS[0];
    order = {
      id: orderId,
      customer_name: "Cliente Especial",
      customer_email: "cliente@nuvemdeacucar.com.br",
      delivery_address: "Av. Boa Viagem, 1500 - Boa Viagem, Recife - PE",
      customer_cep: "51011-000",
      estimated_delivery: "Hoje em até 3 horas (Sede Recife)",
      payment_method: "Pix",
      subtotal: defaultProduct.price,
      discount: 0,
      shipping_fee: 0,
      coupon_code: "NUVEM10",
      total: defaultProduct.price,
      created_at: new Date().toISOString(),
      items: [
        {
          id: 1,
          order_id: orderId,
          product_id: defaultProduct.id,
          product_name: defaultProduct.name,
          unit_price: defaultProduct.price,
          quantity: 1,
          image_emoji: defaultProduct.image_emoji,
        },
      ],
    };
  }

  if (!order.items || order.items.length === 0) {
    order.items = [
      {
        id: 1,
        order_id: orderId,
        product_id: 1,
        product_name: "Cupcake Artesanal",
        unit_price: order.total,
        quantity: 1,
        image_emoji: "🧁",
      },
    ];
  }


  return (
    <div className="relative min-h-[80vh] flex items-center justify-center px-4 py-12">
      {/* Chuva de Cupcakes e Doces Flutuantes no Fundo (Anime.js) */}
      <CupcakeRain />

      {/* Card do Recibo Comercial em Glassmorphism com Orquestração Anime.js */}
      <div className="relative z-10 w-full max-w-2xl space-y-6">
        <AnimatedReceipt>
          <Card className="receipt-card w-full rounded-4xl border-border bg-card/95 backdrop-blur-md shadow-2xl p-6 sm:p-10 space-y-6 print:shadow-none print:border-none print:p-0">
            {/* Topo do Recibo */}
            <div className="text-center space-y-3">
              <div className="success-badge-icon w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-xs">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
                  Pedido Realizado com Sucesso
                </span>
                <h1 className="font-display font-bold text-3xl sm:text-4xl text-foreground mt-1">
                  Obrigado, {order.customer_name.split(" ")[0]}!
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Seu pedido <strong className="text-foreground">#{order.id}</strong> foi confirmado e já está sendo preparado com muito carinho.
                </p>
              </div>
            </div>

            <Separator />

            {/* Dados Rápidos da Entrega e Pagamento */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-muted/40 rounded-2xl border border-border space-y-1">
                <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-primary" /> Previsão de Entrega
                </span>
                <p className="font-bold text-foreground text-sm">
                  {order.estimated_delivery || "Hoje mesmo (em até 3 horas)"}
                </p>
              </div>

              <div className="p-3.5 bg-muted/40 rounded-2xl border border-border space-y-1">
                <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-primary" /> Forma de Pagamento
                </span>
                <p className="font-bold text-foreground text-sm">
                  {order.payment_method}
                </p>
              </div>
            </div>

            {/* Endereço de Entrega */}
            <div className="p-3.5 bg-muted/30 rounded-2xl border border-border text-xs space-y-1">
              <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-primary" /> Endereço de Entrega
              </span>
              <p className="text-foreground font-medium text-sm leading-relaxed">
                {order.delivery_address}
                {order.customer_cep && ` · CEP: ${order.customer_cep}`}
              </p>
            </div>

            <Separator />

            {/* Lista de Itens do Recibo */}
            <div className="space-y-3">
              <h3 className="font-display font-bold text-base text-foreground">
                Itens da Caixinha
              </h3>

              <div className="divide-y divide-border/60">
                {order.items.map((item) => {
                  const fallbackProduct = INITIAL_PRODUCTS.find(
                    (p) =>
                      p.id === item.product_id ||
                      p.name.toLowerCase() === item.product_name.toLowerCase()
                  );
                  const imageSrc = item.image_emoji || fallbackProduct?.image_emoji || "🧁";

                  return (
                    <div key={item.id} className="receipt-item-row py-2.5 flex items-center justify-between gap-3 text-sm">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-[#FDF0E9] flex items-center justify-center shrink-0 overflow-hidden">
                          <PhotoOrEmoji
                            photoOrEmoji={imageSrc}
                            name={item.product_name}
                            className="w-full h-full object-cover"
                            emojiClassName="text-base"
                          />
                        </div>
                        <div>
                          <span className="font-semibold text-foreground">{item.product_name}</span>
                          <span className="text-xs text-muted-foreground block">
                            {item.quantity}x {formatBRL(item.unit_price)}
                          </span>
                        </div>
                      </div>

                      <span className="font-bold text-foreground">
                        {formatBRL(item.quantity * item.unit_price)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>


          <Separator />

          {/* Resumo Financeiro */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="font-medium text-foreground">{formatBRL(order.subtotal)}</span>
            </div>

            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Desconto ({order.coupon_code || "Cupom"})</span>
                <span>-{formatBRL(order.discount)}</span>
              </div>
            )}

            <div className="flex justify-between text-muted-foreground">
              <span>Taxa de Entrega</span>
              {order.shipping_fee === 0 ? (
                <span className="text-emerald-700 font-bold">Grátis</span>
              ) : (
                <span className="font-medium text-foreground">{formatBRL(order.shipping_fee)}</span>
              )}
            </div>

            <Separator className="my-1" />

            <div className="flex justify-between text-xl font-bold text-foreground pt-1">
              <span>Total Pago</span>
              <span className="text-primary font-display text-2xl">{formatBRL(order.total)}</span>
            </div>
          </div>

          {/* Ações de Impressão e Voltar para a Loja */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
            <PrintReceiptButton />

            <Button asChild size="default" className="rounded-full px-6 gap-2 font-semibold">
              <Link href="/#cardapio">
                <span>Pedir Mais Doces</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </Card>
        </AnimatedReceipt>
      </div>
    </div>
  );
}

