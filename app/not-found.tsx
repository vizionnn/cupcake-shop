import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[65vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6 bg-card border border-border/80 p-8 sm:p-10 rounded-4xl shadow-sm">
        <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 text-primary mx-auto flex items-center justify-center text-4xl shadow-inner">
          🧁🔍
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
            <Compass className="w-3.5 h-3.5" />
            <span>Erro 404 · Receita não encontrada</span>
          </span>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-foreground">
            Parece que essa página sumiu como açúcar
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            O endereço digitado não existe ou o cupcake em questão saiu temporariamente do nosso cardápio.
          </p>
        </div>

        <div className="pt-2">
          <Button
            asChild
            className="w-full sm:w-auto rounded-full bg-primary hover:bg-[#C7415A] text-white font-semibold gap-2 shadow-lg shadow-primary/25 px-8 py-3"
          >
            <Link href="/">
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar para o Cardápio</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
