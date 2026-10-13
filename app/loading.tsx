import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Esqueleto espelhando a estrutura da home: hero em 2 colunas, faixa de pilares e grade de 4 colunas.
export default function LoadingHome() {
  return (
    <div aria-busy="true" aria-label="Carregando catálogo da confeitaria...">
      <section className="mx-auto grid max-w-6xl gap-12 px-4 pb-20 pt-10 sm:px-6 sm:pt-16 lg:grid-cols-12 lg:items-center">
        <div className="space-y-5 lg:col-span-7">
          <Skeleton className="h-3 w-48 rounded-none" />
          <Skeleton className="h-12 w-full max-w-lg rounded-none sm:h-16" />
          <Skeleton className="h-12 w-3/4 max-w-md rounded-none sm:h-16" />
          <Skeleton className="h-5 w-full max-w-xl rounded-none" />
          <Skeleton className="h-11 w-full rounded-md sm:w-44" />
        </div>
        <Skeleton className="mx-auto aspect-[4/5] w-full max-w-md rounded-t-[999px] rounded-b-none lg:col-span-5" />
      </section>

      <div className="h-48 bg-[#3B2318]/60" />

      <section className="mx-auto max-w-6xl px-4 pt-20 sm:px-6">
        <Skeleton className="h-10 w-48 rounded-none" />
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="border border-border bg-card">
              <Skeleton className="aspect-square w-full rounded-none" />
              <div className="space-y-2 p-3 sm:p-4">
                <Skeleton className="h-5 w-3/4 rounded-none" />
                <Skeleton className="h-4 w-full rounded-none" />
                <Skeleton className="mt-3 h-10 w-full rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
