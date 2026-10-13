import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { INITIAL_PRODUCTS } from "@/lib/products-data";
import { Product } from "@/types";
import { CatalogClient } from "@/components/CatalogClient";
import { Reveal, Zigzag } from "@/components/Reveal";
import { formatBRL } from "@/lib/utils";

export const revalidate = 0; // Dados dinâmicos do Supabase

const PILLARS = [
  {
    n: "01",
    title: "Assados na manhã",
    text: "Cada fornada sai do forno no mesmo dia, com manteiga, cacau nobre e frutas frescas. Nada de estoque congelado.",
  },
  {
    n: "02",
    title: "Entrega em até 3 horas",
    text: "Rotas diretas para Recife e Região Metropolitana. Frete grátis acima de R$ 49,90, calculado pelo seu CEP.",
  },
  {
    n: "03",
    title: "Caixinha de presente",
    text: "Embalagem rígida decorada, com fita de cetim inclusa, pronta para entregar a quem você quer agradar.",
  },
];

const STEPS = [
  "Você escolhe os sabores e monta a caixinha pelo cardápio.",
  "Informa o CEP e vê o frete e o prazo antes de pagar, sem surpresas.",
  "Assamos, embalamos e levamos até a sua porta, com Pix ou cartão.",
];

export default async function HomePage() {
  const { data: productsData } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: true });

  const products: Product[] =
    productsData && productsData.length > 0 ? (productsData as Product[]) : INITIAL_PRODUCTS;

  const featured = products.find((p) => p.name === "Red Velvet") ?? products[0];
  const approachPhoto = products.find((p) => p.name.startsWith("Ninho")) ?? products[0];
  const mostAffordable = [...products].sort((a, b) => a.price - b.price)[0];

  return (
    <>
      {/* HERO: texto à esquerda, foto em arco à direita */}
      <section className="mx-auto grid max-w-6xl gap-12 px-4 pb-20 pt-10 sm:px-6 sm:pt-16 lg:grid-cols-12 lg:items-center lg:gap-12 lg:pb-24">
        <div className="lg:col-span-7">
          <Reveal>
            <p className="eyebrow">Confeitaria artesanal · Recife/PE</p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-5 text-balance font-display text-[2.5rem] font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Cupcakes feitos à mão, <span className="text-primary">entregues no mesmo dia.</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              {products.length} receitas autorais, assadas todas as manhãs. Escolha seus sabores, monte a caixinha e
              receba em até 3 horas.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
              <a href="#cardapio" className="nb-btn nb-btn-primary w-full sm:w-auto">
                Ver cardápio
                <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
              <Link href="/#abordagem" className="nb-link">
                Como fazemos
              </Link>
            </div>
          </Reveal>
          <Reveal delay={320}>
            <dl className="mt-12 grid grid-cols-3 border-t border-border pt-6">
              {[
                [String(products.length), "receitas"],
                ["3h", "entrega máx."],
                [formatBRL(mostAffordable.price), "a partir de"],
              ].map(([value, label]) => (
                <div key={label} className="pr-3">
                  <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">{label}</dt>
                  <dd className="mt-1 font-display text-2xl font-bold text-foreground sm:text-3xl">{value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <Reveal delay={120} className="lg:col-span-5">
          <Link
            href={`/produto/${featured.id}`}
            className="group relative mx-auto block w-full max-w-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
            aria-label={`Ver ${featured.name}`}
          >
            <div className="aspect-[4/5] overflow-hidden rounded-t-[999px] bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featured.image_emoji}
                alt={`${featured.name}, cupcake artesanal`}
                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
              />
            </div>
            <div className="absolute -bottom-4 left-4 right-4 flex items-center justify-between gap-3 bg-background px-4 py-3 shadow-[0_0_0_1px_hsl(var(--border))] sm:left-auto sm:right-[-1rem] sm:min-w-[16rem]">
              <div className="min-w-0">
                <p className="eyebrow">Destaque</p>
                <p className="truncate font-display text-lg font-semibold text-foreground">{featured.name}</p>
              </div>
              <span className="font-display text-lg font-bold text-foreground">{formatBRL(featured.price)}</span>
            </div>
          </Link>
        </Reveal>
      </section>

      {/* PILARES: faixa cacau em 3 colunas, centro em destaque */}
      <section className="bg-[#3B2318] text-[#FDF6F0]" aria-labelledby="pilares-titulo">
        <h2 id="pilares-titulo" className="sr-only">
          Por que Nuvem de Açúcar
        </h2>
        <div className="mx-auto grid max-w-6xl md:grid-cols-3">
          {PILLARS.map((item, i) => (
            <Reveal key={item.n} delay={i * 80}>
              <div
                className={`h-full px-6 py-10 sm:px-8 sm:py-14 ${
                  i === 1 ? "bg-[#C7415A]" : ""
                } ${i > 0 ? "border-t border-[#FDF6F0]/15 md:border-l md:border-t-0" : ""}`}
              >
                <p className="font-mono text-xs tracking-[0.16em] text-[#F2C14E]">{item.n}</p>
                <h3 className="mt-4 font-display text-2xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-[#FDF6F0]/85">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CARDÁPIO */}
      <section className="mx-auto max-w-6xl scroll-mt-24 px-4 pt-20 sm:px-6 sm:pt-28">
        <Reveal>
          <Zigzag />
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Cardápio</h2>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
            Clássicos e receitas especiais. Toque no cupcake para ver ingredientes e alérgenos.
          </p>
        </Reveal>
        <div className="mt-8">
          <CatalogClient initialProducts={products} />
        </div>
      </section>

      {/* ABORDAGEM */}
      <section id="abordagem" className="mx-auto max-w-6xl scroll-mt-24 px-4 pt-24 sm:px-6 sm:pt-32">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <Zigzag />
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Como fazemos
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">
              Uma confeitaria pequena, com poucas receitas e muito cuidado. Cada fornada é assada no dia da entrega.
            </p>
          </Reveal>
          <Reveal delay={100} className="lg:col-span-3">
            <div className="mx-auto aspect-square w-full max-w-xs overflow-hidden rounded-full bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={approachPhoto.image_emoji}
                alt={`${approachPhoto.name}, cupcake artesanal`}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={180} className="lg:col-span-4">
            <ol className="space-y-6">
              {STEPS.map((step, i) => (
                <li key={step} className="flex gap-4">
                  <span aria-hidden className="mt-3 h-0.5 w-6 shrink-0 bg-primary" />
                  <p className="text-base leading-relaxed text-muted-foreground">
                    <span className="sr-only">Passo {i + 1}: </span>
                    {step}
                  </p>
                </li>
              ))}
            </ol>
            <a href="#cardapio" className="nb-link mt-4">
              Montar minha caixinha
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
