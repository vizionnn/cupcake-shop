import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingProduct() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-16 animate-fade-in" aria-busy="true" aria-label="Carregando detalhes do cupcake...">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-16 rounded-md" />
        <span className="text-muted-foreground">/</span>
        <Skeleton className="h-4 w-32 rounded-md" />
      </div>

      {/* Grid Principal: Foto e Detalhes */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Galeria Skeleton */}
        <div className="md:col-span-6 space-y-4">
          <Skeleton className="aspect-4/3 w-full rounded-3xl" />
          <div className="flex gap-3">
            <Skeleton className="w-20 h-20 rounded-2xl" />
            <Skeleton className="w-20 h-20 rounded-2xl" />
            <Skeleton className="w-20 h-20 rounded-2xl" />
          </div>
        </div>

        {/* Informações Skeleton */}
        <div className="md:col-span-6 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-32 rounded-full" />
            </div>
            <Skeleton className="h-10 sm:h-12 w-4/5 rounded-2xl" />
            <Skeleton className="h-8 w-28 rounded-xl" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-5/6 rounded-md" />
          </div>

          {/* Quantidade e Botão Skeleton */}
          <div className="space-y-6 pt-4 border-t border-border">
            <div className="flex items-center gap-4">
              <Skeleton className="h-5 w-24 rounded-md" />
              <Skeleton className="h-11 w-32 rounded-full" />
            </div>
            <Skeleton className="h-14 w-full sm:w-64 rounded-full" />
          </div>

          {/* Cards de Conservação e Alérgenos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <Skeleton className="h-28 rounded-2xl" />
            <Skeleton className="h-28 rounded-2xl" />
          </div>
        </div>
      </div>

      {/* Carrossel de Recomendados Skeleton */}
      <div className="space-y-6 pt-10 border-t border-border">
        <div className="space-y-1">
          <Skeleton className="h-3 w-28 rounded-full" />
          <Skeleton className="h-7 w-48 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-72 rounded-3xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
