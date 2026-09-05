import React from "react";
import { supabase } from "@/lib/supabase";
import { INITIAL_PRODUCTS } from "@/lib/products-data";
import { Product } from "@/types";
import { CatalogClient } from "@/components/CatalogClient";
import { HeroPuffs } from "@/components/HeroPuffs";
import { FeaturesBar } from "@/components/FeaturesBar";
import { AnimeReveal } from "@/components/AnimeReveal";
import { Sparkles } from "lucide-react";

export const revalidate = 0; // Dados dinâmicos do Supabase

export default async function HomePage() {
  const { data: productsData } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: true });

  const products: Product[] =
    productsData && productsData.length > 0
      ? (productsData as Product[])
      : INITIAL_PRODUCTS;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-16 py-6 sm:py-10">
      {/* Hero Section Artesanal com Animações Anime.js */}
      <section className="relative overflow-hidden rounded-3xl sm:rounded-4xl bg-gradient-to-b from-[#FDF0E9] to-[#FEFAF6] dark:from-[#251812] dark:to-[#1a100a] border border-border/80 dark:border-border/50 p-8 sm:p-14 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Texto Principal com Reveal */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <AnimeReveal variant="up" delay={50} duration={500}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-card/80 border border-primary/20 dark:border-primary/30 text-xs font-semibold text-primary backdrop-blur-xs shadow-2xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Confeitaria Artesanal</span>
              </div>
            </AnimeReveal>

            <AnimeReveal variant="up" delay={150} duration={600}>
              <h1 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl text-foreground leading-[1.1] tracking-tight">
                Cupcakes <span className="text-primary italic">feitos à mão</span>,<br />
                <span className="text-[#A33448] dark:text-[#f8718a]">entregues no mesmo dia.</span>
              </h1>
            </AnimeReveal>

            <AnimeReveal variant="up" delay={250} duration={600}>
              <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Oito receitas exclusivas preparadas com cuidado e ingredientes nobres. Escolha seus favoritos, monte sua caixinha e receba com rapidez onde estiver.
              </p>
            </AnimeReveal>

            <AnimeReveal variant="up" delay={350} duration={600}>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <a
                  href="#cardapio"
                  className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-[#C7415A] text-white font-semibold text-base px-8 py-4 rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all hover:scale-105 active:scale-95 w-full sm:w-auto cursor-pointer"
                >
                  <span>Explorar Sabores</span>
                  <span className="text-lg">🧁</span>
                </a>

                <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/40 px-4 py-3 rounded-full border border-emerald-200 dark:border-emerald-800/50">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Pedidos abertos para entrega hoje</span>
                </div>
              </div>
            </AnimeReveal>
          </div>

          {/* Cluster de Puffs Flutuantes com Física do Anime.js */}
          <div className="lg:col-span-5 flex items-center justify-center relative py-6">
            <AnimeReveal variant="scale" delay={200} duration={700}>
              <HeroPuffs />
            </AnimeReveal>
          </div>
        </div>
      </section>

      {/* Faixa de Benefícios e Diferenciais com Reveal on Scroll */}
      <FeaturesBar />

      {/* Seção da Vitrine de Produtos */}
      <section className="space-y-6">
        <AnimeReveal variant="up" delay={100} duration={600}>
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Cardápio Fresquinho
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground">
              Monte sua caixinha dos sonhos
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto">
              Selecione entre sabores clássicos e recheios especiais para presentear ou saborear hoje mesmo.
            </p>
          </div>
        </AnimeReveal>

        {/* Cliente Interativo com Filtros e Stagger Anime.js */}
        <CatalogClient initialProducts={products} />
      </section>
    </div>
  );
}

