import React from "react";
import { supabase } from "@/lib/supabase";
import { INITIAL_PRODUCTS } from "@/lib/products-data";
import { Product } from "@/types";
import { CatalogClient } from "@/components/CatalogClient";
import Link from "next/link";
import { ArrowDown, Sparkles } from "lucide-react";

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
      {/* Hero Section Artesanal */}
      <section className="relative overflow-hidden rounded-3xl sm:rounded-4xl bg-gradient-to-b from-[#FDF0E9] to-[#FEFAF6] border border-border/80 p-8 sm:p-14 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Texto Principal */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-primary/20 text-xs font-semibold text-primary backdrop-blur-xs shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Confeitaria Artesanal</span>
            </div>

            <h1 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl text-foreground leading-[1.1] tracking-tight">
              Cupcakes <span className="text-primary italic">feitos à mão</span>,<br />
              <span className="text-[#A33448]">entregues no mesmo dia.</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Oito receitas exclusivas preparadas com cuidado e ingredientes nobres. Escolha seus favoritos, monte sua caixinha e receba com rapidez onde estiver.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#cardapio"
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-[#C7415A] text-white font-semibold text-base px-8 py-4 rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all hover:scale-105 active:scale-95 w-full sm:w-auto"
              >
                <span>Explorar Sabores</span>
                <span className="text-lg">🧁</span>
              </a>

              <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-100/80 px-4 py-3 rounded-full border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Pedidos abertos para entrega hoje</span>
              </div>
            </div>
          </div>

          {/* Cluster de Puffs Flutuantes */}
          <div className="lg:col-span-5 flex items-center justify-center relative py-6">
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
              {/* Puff Principal */}
              <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-white shadow-2xl border border-primary/15 flex flex-col items-center justify-center p-4 hover:scale-105 transition-transform duration-300 z-10">
                <span className="text-6xl sm:text-7xl animate-bounce duration-1000">🧁</span>
                <span className="text-xs font-bold text-primary mt-2 bg-primary/10 px-3 py-1 rounded-full">
                  Adoce seu dia ❤️
                </span>
              </div>

              {/* Puff Morango */}
              <div className="absolute top-2 right-2 w-20 h-20 rounded-full bg-white/90 backdrop-blur-xs shadow-lg border border-red-200 flex items-center justify-center text-3xl hover:rotate-12 transition-transform">
                🍓
              </div>

              {/* Puff Cacau */}
              <div className="absolute bottom-2 left-2 w-20 h-20 rounded-full bg-white/90 backdrop-blur-xs shadow-lg border border-amber-900/20 flex items-center justify-center text-3xl hover:-rotate-12 transition-transform">
                🍫
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção da Vitrine de Produtos */}
      <section className="space-y-6">
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

        {/* Cliente Interativo com Filtros */}
        <CatalogClient initialProducts={products} />
      </section>
    </div>
  );
}
