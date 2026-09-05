import React from "react";
import { supabase } from "@/lib/supabase";
import { Product } from "@/types";
import { formatBRL } from "@/lib/utils";
import { PhotoOrEmoji } from "@/components/PhotoOrEmoji";
import { ProductDetailClient } from "@/components/ProductDetailClient";
import { ProductCard } from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Clock, Sparkles } from "lucide-react";
import { notFound } from "next/navigation";

export const revalidate = 0;

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { id: rawId } = await params;
  const id = parseInt(rawId, 10);
  if (isNaN(id)) return { title: "Cupcake não encontrado" };

  const { data: product } = await supabase
    .from("products")
    .select("name, description")
    .eq("id", id)
    .single();

  if (!product) return { title: "Cupcake não encontrado — Nuvem de Açúcar" };

  return {
    title: `${product.name} — Nuvem de Açúcar`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id: rawId } = await params;
  const id = parseInt(rawId, 10);
  if (isNaN(id)) notFound();

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="text-6xl">🧁🔍</div>
        <h1 className="font-display font-bold text-3xl text-foreground">
          Cupcake não encontrado
        </h1>
        <p className="text-muted-foreground text-base">
          O sabor solicitado não está cadastrado em nosso cardápio atual.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-primary hover:bg-[#C7415A] text-white font-semibold px-6 py-3 rounded-full transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para o Cardápio</span>
        </Link>
      </div>
    );
  }

  // Busca 4 cupcakes recomendados (excluindo o atual)
  const { data: recData } = await supabase
    .from("products")
    .select("*")
    .neq("id", product.id)
    .limit(4);

  const recommended: Product[] = (recData as Product[]) || [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-16">
      {/* Breadcrumb e Voltar */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Início
        </Link>
        <span>/</span>
        <Link href="/#cardapio" className="hover:text-foreground transition-colors">
          Cardápio
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium truncate">{product.name}</span>
      </div>

      {/* Grid Principal do Produto */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Foto em Destaque */}
        <div className="md:col-span-6">
          <div className="aspect-square w-full rounded-4xl bg-gradient-to-b from-[#FDF0E9] to-white border border-border flex items-center justify-center overflow-hidden shadow-lg shadow-primary/5 p-8 relative">
            <PhotoOrEmoji
              photoOrEmoji={product.image_emoji}
              name={product.name}
              className="w-full h-full object-contain drop-shadow-md"
              emojiClassName="text-9xl"
            />
            <span className="absolute bottom-4 left-4 text-xs text-muted-foreground bg-white/80 backdrop-blur-xs px-3 py-1 rounded-full border border-border">
              ✨ Assado na data de hoje
            </span>
          </div>
        </div>

        {/* Informações e Compra */}
        <div className="md:col-span-6 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Badge variant="pastry" className="text-xs uppercase tracking-wider">
                {product.flavor_tag}
              </Badge>
              {product.stock > 0 ? (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  ✓ Em estoque hoje
                </span>
              ) : (
                <Badge variant="destructive" className="text-xs">
                  Esgotado
                </Badge>
              )}
            </div>

            <h1 className="font-display font-bold text-3xl sm:text-4xl text-foreground">
              {product.name}
            </h1>

            <div className="font-display font-bold text-3xl text-primary">
              {formatBRL(product.price)}
            </div>

            <p className="text-muted-foreground text-base leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Ações de Quantidade e Adição */}
          <ProductDetailClient product={product} />

          {/* Card de Conservação e Alérgenos (Destaque UX elogiado!) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <Card className="rounded-2xl border-border bg-card shadow-xs">
              <CardContent className="p-4 space-y-1">
                <div className="flex items-center gap-2 text-primary font-semibold text-xs">
                  <Clock className="w-4 h-4" />
                  <span>Conservação</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Consumir em até 2 dias sob refrigeração ou até 24h em temperatura ambiente fresca.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border bg-card shadow-xs">
              <CardContent className="p-4 space-y-1">
                <div className="flex items-center gap-2 text-primary font-semibold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Alérgenos</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {product.ingredients || "Contém trigo, leite e ovos. Pode conter traços de nozes."}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Carrossel de Recomendados */}
      {recommended.length > 0 && (
        <section className="space-y-6 pt-10 border-t border-border">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                Combine Sabores
              </span>
              <h2 className="font-display font-bold text-2xl text-foreground">
                Você também vai amar
              </h2>
            </div>
            <Link
              href="/#cardapio"
              className="text-xs sm:text-sm font-semibold text-primary hover:underline"
            >
              Ver cardápio completo →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommended.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
