import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingHome() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-16 py-6 sm:py-10 animate-fade-in" aria-busy="true" aria-label="Carregando catálogo da confeitaria...">
      {/* Hero Section Skeleton */}
      <section className="relative overflow-hidden rounded-3xl sm:rounded-4xl bg-muted/40 border border-border/80 p-8 sm:p-14 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <Skeleton className="h-6 w-36 rounded-full mx-auto lg:mx-0" />
            <div className="space-y-3">
              <Skeleton className="h-10 sm:h-14 w-full max-w-lg rounded-2xl mx-auto lg:mx-0" />
              <Skeleton className="h-10 sm:h-14 w-3/4 max-w-md rounded-2xl mx-auto lg:mx-0" />
            </div>
            <Skeleton className="h-5 w-full max-w-xl rounded-lg mx-auto lg:mx-0" />
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Skeleton className="h-14 w-full sm:w-48 rounded-full" />
              <Skeleton className="h-10 w-60 rounded-full" />
            </div>
          </div>
          <div className="lg:col-span-5 flex items-center justify-center py-6">
            <Skeleton className="w-64 h-64 sm:w-72 sm:h-72 rounded-full" />
          </div>
        </div>
      </section>

      {/* Features Bar Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-5 rounded-3xl bg-card border border-border/80 shadow-2xs flex items-start gap-3.5">
            <Skeleton className="w-11 h-11 rounded-2xl shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4 rounded-md" />
              <Skeleton className="h-3 w-full rounded-md" />
            </div>
          </div>
        ))}
      </div>

      {/* Seção Vitrine Skeleton */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <Skeleton className="h-4 w-32 mx-auto rounded-full" />
          <Skeleton className="h-8 sm:h-10 w-72 mx-auto rounded-2xl" />
          <Skeleton className="h-4 w-96 max-w-full mx-auto rounded-md" />
        </div>

        {/* Filtros Skeleton */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-full" />
          ))}
        </div>

        {/* 8 Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-3xl border border-border bg-card p-4 space-y-3">
              <Skeleton className="aspect-4/3 w-full rounded-2xl" />
              <div className="space-y-2 pt-2">
                <Skeleton className="h-4 w-20 rounded-full" />
                <Skeleton className="h-6 w-3/4 rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
                <div className="flex justify-between items-center pt-2">
                  <Skeleton className="h-7 w-20 rounded-md" />
                  <Skeleton className="h-10 w-28 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
