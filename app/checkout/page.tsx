"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { formatBRL } from "@/lib/utils";
import { getDeliveryEstimateByCep } from "@/lib/delivery";
import { DeliveryEstimate } from "@/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { PhotoOrEmoji } from "@/components/PhotoOrEmoji";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  QrCode,
  Banknote,
  MapPin,
  Check,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, shippingFee, isLoaded, clearCart } = useCart();

  // Campos do formulário
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cep, setCep] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Pix");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  // Estados de cálculo e feedback
  const [estimate, setEstimate] = useState<DeliveryEstimate | null>(null);
  const [loadingCep, setLoadingCep] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  // Carrega dados salvos no localStorage
  useEffect(() => {
    const savedCep = localStorage.getItem("cupcake_user_cep") || "";
    const savedAddress = localStorage.getItem("cupcake_user_address") || "";
    if (savedCep) {
      setCep(savedCep.replace(/^(\d{5})(\d)/, "$1-$2"));
      setEstimate(getDeliveryEstimateByCep(savedCep));
    }
    if (savedAddress) {
      setAddress(savedAddress);
    }
  }, []);

  // Cálculos financeiros
  const discount = appliedCoupon === "NUVEM10" ? Number((subtotal * 0.1).toFixed(2)) : 0;
  const grandTotal = Number((subtotal - discount + shippingFee).toFixed(2));

  // Busca de CEP
  const handleSearchCep = async () => {
    const rawCep = cep.replace(/\D/g, "");
    if (rawCep.length !== 8) {
      toast.error("Por favor, digite um CEP válido com 8 números.");
      return;
    }

    setLoadingCep(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${rawCep}/json/`);
      const data = await res.json();

      if (data.erro) {
        toast.error("CEP não localizado.", {
          description: "Preencha seu endereço manualmente abaixo.",
        });
        setLoadingCep(false);
        return;
      }

      const est = getDeliveryEstimateByCep(rawCep);
      setEstimate(est);

      const generatedAddress = `${data.logradouro || ""}${
        data.bairro ? ` - ${data.bairro}` : ""
      }, ${data.localidade} - ${data.uf}`;
      setAddress((prev) => (prev ? prev : generatedAddress));

      localStorage.setItem("cupcake_user_cep", rawCep);
      localStorage.setItem("cupcake_user_city", `${data.localidade} - ${data.uf}`);
      localStorage.setItem("cupcake_user_address", generatedAddress);

      toast.success("Endereço e estimativa localizados!");
    } catch (err) {
      console.error(err);
      toast.error("Erro na busca de CEP.");
    } finally {
      setLoadingCep(false);
    }
  };

  // Aplicação de Cupom
  const handleApplyCoupon = async () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      toast.error("Digite o código do cupom.");
      return;
    }

    if (code === "NUVEM10") {
      setAppliedCoupon("NUVEM10");
      toast.success("Cupom NUVEM10 aplicado! 10% de desconto concedido.");
    } else {
      toast.error("Cupom inválido ou expirado.");
    }
  };

  // Finalização do Pedido
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorBanner(null);

    if (!name.trim() || !email.trim() || !address.trim()) {
      setErrorBanner("Preencha todos os campos obrigatórios.");
      return;
    }

    if (items.length === 0) {
      setErrorBanner("Sua sacola está vazia.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        customer_name: name.trim(),
        customer_email: email.trim(),
        delivery_address: address.trim(),
        customer_cep: cep.replace(/\D/g, "") || null,
        estimated_delivery: estimate?.text || "Previsão padrão — Recife/PE",
        payment_method: paymentMethod,
        coupon_code: appliedCoupon,
        items: items.map((i) => ({ product_id: i.product_id, quantity: i.quantity })),
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao registrar pedido.");
      }

      clearCart();
      toast.success("Pedido realizado com sucesso!");
      router.push(`/confirmacao/${data.order_id}`);
    } catch (err: any) {
      console.error(err);
      setErrorBanner(err.message || "Não foi possível finalizar o pedido.");
      setSubmitting(false);
    }
  };

  // Skeleton intermediário para prevenir o Hydration Flash de "Sacola vazia"
  if (!isLoaded) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 animate-fade-in" aria-busy="true" aria-label="Carregando checkout seguro...">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-9 w-48 rounded-xl" />
            <Skeleton className="h-4 w-72 rounded-md" />
          </div>
          <Skeleton className="h-5 w-40 rounded-md" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <Skeleton className="h-72 w-full rounded-3xl" />
            <Skeleton className="h-64 w-full rounded-3xl" />
          </div>
          <div className="lg:col-span-5">
            <Skeleton className="h-96 w-full rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="text-6xl">🧁</div>
        <h1 className="font-display font-bold text-3xl text-foreground">
          Sua sacola está vazia
        </h1>
        <p className="text-muted-foreground text-base">
          Você não possui doces na sacola para finalizar o pedido.
        </p>
        <Button asChild size="lg" className="rounded-full px-8 font-semibold">
          <Link href="/#cardapio">
            <span>Voltar ao Cardápio</span>
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-foreground">
            Finalizar Pedido
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Preencha seus dados para entrega rápida e pagamento seguro.
          </p>
        </div>
        <Link
          href="/carrinho"
          className="text-xs sm:text-sm font-semibold text-primary hover:underline flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar para a sacola
        </Link>
      </div>

      {errorBanner && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl text-sm font-medium">
          ⚠️ {errorBanner}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Coluna Esquerda: Dados de Entrega e Pagamento */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card: Dados Pessoais e Entrega */}
          <Card className="rounded-3xl border-border bg-card p-6 shadow-sm space-y-4">
            <CardHeader className="p-0 pb-2">
              <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <span>1. Dados de Entrega</span>
              </CardTitle>
            </CardHeader>

            <div className="space-y-3">
              <div>
                <label htmlFor="name" className="text-xs font-bold text-foreground block mb-1">
                  Nome Completo *
                </label>
                <Input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Maria Silva"
                  className="h-11 bg-white"
                />
              </div>

              <div>
                <label htmlFor="email" className="text-xs font-bold text-foreground block mb-1">
                  E-mail para confirmação e recibo *
                </label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voce@email.com"
                  className="h-11 bg-white"
                />
              </div>

              <div>
                <label htmlFor="cep" className="text-xs font-bold text-foreground block mb-1">
                  CEP de Entrega *
                </label>
                <div className="flex gap-2">
                  <Input
                    id="cep"
                    type="text"
                    maxLength={9}
                    value={cep}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, "").substring(0, 8);
                      if (val.length > 5) val = val.replace(/^(\d{5})(\d)/, "$1-$2");
                      setCep(val);
                    }}
                    placeholder="Ex: 50010-000"
                    className="h-11 bg-white"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSearchCep}
                    disabled={loadingCep}
                    className="h-11 px-5 shrink-0 font-semibold gap-1.5"
                  >
                    {loadingCep ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        <span>Buscando...</span>
                      </>
                    ) : (
                      "Buscar CEP"
                    )}
                  </Button>
                </div>
              </div>

              {estimate && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{estimate.icon}</span>
                    <div>
                      <div className="font-bold">{estimate.title}</div>
                      <div className="text-emerald-700">{estimate.desc}</div>
                    </div>
                  </div>
                  <Badge variant="success">{estimate.badge}</Badge>
                </div>
              )}

              <div>
                <label htmlFor="address" className="text-xs font-bold text-foreground block mb-1">
                  Endereço Completo (Rua, Número, Bairro, Complemento, Cidade - UF) *
                </label>
                <Textarea
                  id="address"
                  required
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ex: Av. Boa Viagem, 1500, Apto 402 - Boa Viagem, Recife - PE"
                  className="bg-white"
                />
              </div>
            </div>
          </Card>

          {/* Card: Forma de Pagamento com RadioGroup Acessível (WCAG 2.2 AA) */}
          <Card className="rounded-3xl border-border bg-card p-6 shadow-sm space-y-4">
            <CardHeader className="p-0 pb-2">
              <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                <span>2. Forma de Pagamento</span>
              </CardTitle>
            </CardHeader>

            <RadioGroup
              value={paymentMethod}
              onValueChange={setPaymentMethod}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3"
            >
              <div>
                <RadioGroupItem value="Pix" id="pay-pix" className="peer sr-only" />
                <label
                  htmlFor="pay-pix"
                  className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-border bg-card hover:bg-muted/30 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all text-center gap-2"
                >
                  <QrCode className="w-6 h-6 text-primary" />
                  <span className="text-sm font-bold text-foreground">Pix</span>
                  <span className="text-[11px] text-muted-foreground">Aprovação imediata</span>
                </label>
              </div>

              <div>
                <RadioGroupItem value="Cartão" id="pay-card" className="peer sr-only" />
                <label
                  htmlFor="pay-card"
                  className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-border bg-card hover:bg-muted/30 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all text-center gap-2"
                >
                  <CreditCard className="w-6 h-6 text-primary" />
                  <span className="text-sm font-bold text-foreground">Cartão</span>
                  <span className="text-[11px] text-muted-foreground">Crédito ou Débito</span>
                </label>
              </div>

              <div>
                <RadioGroupItem value="Na entrega" id="pay-delivery" className="peer sr-only" />
                <label
                  htmlFor="pay-delivery"
                  className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-border bg-card hover:bg-muted/30 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all text-center gap-2"
                >
                  <Banknote className="w-6 h-6 text-primary" />
                  <span className="text-sm font-bold text-foreground">Na entrega</span>
                  <span className="text-[11px] text-muted-foreground">Dinheiro ou Cartão</span>
                </label>
              </div>
            </RadioGroup>
          </Card>
        </div>

        {/* Coluna Direita: Resumo do Pedido e Cupom */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="rounded-3xl border-border bg-card p-6 shadow-sm space-y-6 sticky top-28">
            <h3 className="font-display font-bold text-xl text-foreground">
              Resumo da Compra
            </h3>

            {/* Lista dos Itens no Resumo */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
              {items.map((item) => (
                <div key={item.product_id} className="flex items-center gap-3 text-sm">
                  <div className="w-10 h-10 rounded-xl bg-[#FDF0E9] flex items-center justify-center shrink-0">
                    <PhotoOrEmoji
                      photoOrEmoji={item.emoji}
                      name={item.name}
                      className="w-full h-full object-cover"
                      emojiClassName="text-lg"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-foreground truncate">{item.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.quantity}x {formatBRL(item.price)}
                    </div>
                  </div>
                  <div className="font-semibold text-foreground text-sm">
                    {formatBRL(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            {/* Inserção de Cupom */}
            <div className="space-y-2">
              <label htmlFor="coupon" className="text-xs font-bold text-foreground block">
                Cupom de Desconto
              </label>
              <div className="flex gap-2">
                <Input
                  id="coupon"
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Ex: NUVEM10"
                  className="h-10 bg-white font-mono uppercase text-sm"
                  disabled={appliedCoupon !== null}
                />
                {appliedCoupon ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setAppliedCoupon(null);
                      setCouponCode("");
                    }}
                    className="h-10 px-4 text-xs font-bold text-destructive"
                  >
                    Remover
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleApplyCoupon}
                    className="h-10 px-4 text-xs font-bold shrink-0"
                  >
                    Aplicar
                  </Button>
                )}
              </div>
              {appliedCoupon && (
                <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1 mt-1">
                  <Check className="w-3.5 h-3.5" /> Cupom NUVEM10 ativo (-10% no subtotal)
                </div>
              )}
            </div>

            <Separator />

            {/* Linhas Financeiras */}
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-medium text-foreground">{formatBRL(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Desconto (10%)</span>
                  <span>-{formatBRL(discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-muted-foreground">
                <span>Frete</span>
                {shippingFee === 0 ? (
                  <span className="text-emerald-700 font-bold">Grátis</span>
                ) : (
                  <span className="font-medium text-foreground">{formatBRL(shippingFee)}</span>
                )}
              </div>

              <Separator className="my-1" />

              <div
                aria-live="polite"
                aria-atomic="true"
                className="flex justify-between text-lg font-bold text-foreground pt-1"
              >
                <span>Total a Pagar</span>
                <span className="text-primary font-display text-2xl">{formatBRL(grandTotal)}</span>
              </div>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              size="lg"
              className="w-full bg-primary hover:bg-[#C7415A] text-white rounded-full py-6 text-base font-semibold shadow-lg shadow-primary/25"
            >
              {submitting ? "Processando seu pedido..." : "Confirmar e Finalizar Pedido"}
            </Button>
          </Card>
        </div>
      </form>
    </div>
  );
}
