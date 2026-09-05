"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RefreshCw, ArrowLeft, AlertCircle } from "lucide-react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("Erro capturado pelo Error Boundary da aplicação:", error);
  }, [error]);

  return (
    <div
      className="min-h-[65vh] flex items-center justify-center px-4 py-16"
      role="alert"
      aria-live="assertive"
    >
      <div className="max-w-md w-full text-center space-y-6 bg-card border border-border/80 p-8 sm:p-10 rounded-4xl shadow-sm">
        <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 text-primary mx-auto flex items-center justify-center text-4xl shadow-inner">
          🍰
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Ops! Algo saiu do ponto</span>
          </span>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-foreground">
            Tivemos um contratempo nos fornos
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Não conseguimos processar esta requisição no momento. Nenhuma informação de pedido ou sacola foi perdida.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto rounded-full bg-primary hover:bg-[#C7415A] text-white font-semibold gap-2 shadow-md shadow-primary/20 px-6 py-2.5"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Tentar Novamente</span>
          </Button>

          <Button
            variant="outline"
            asChild
            className="w-full sm:w-auto rounded-full border-border hover:bg-muted font-semibold gap-2 px-6 py-2.5"
          >
            <Link href="/">
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar ao Cardápio</span>
            </Link>
          </Button>
        </div>

        {process.env.NODE_ENV === "development" && error.message && (
          <div className="text-left bg-muted/50 p-3 rounded-xl text-[11px] font-mono text-muted-foreground break-all">
            <strong>Log Técnico:</strong> {error.message}
          </div>
        )}
      </div>
    </div>
  );
}
