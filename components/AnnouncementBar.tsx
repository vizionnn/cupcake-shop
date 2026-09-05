"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Copy, Check } from "lucide-react";

export function AnnouncementBar() {
  const [copied, setCopied] = useState(false);

  const copyCoupon = () => {
    navigator.clipboard.writeText("NUVEM10");
    setCopied(true);
    toast.success("Cupom NUVEM10 copiado com sucesso! 🎉", {
      description: "Cole no checkout para garantir 10% de desconto.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <aside
      className="bg-primary text-primary-foreground py-2.5 px-4 text-xs font-medium border-b border-primary/20 shadow-sm"
      aria-label="Avisos e promoções em destaque"
    >
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center">
        <div className="flex items-center gap-1.5">
          <span>✨ Ganhe 10% OFF na primeira caixinha:</span>
          <button
            type="button"
            onClick={copyCoupon}
            className="inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white px-2 py-0.5 rounded-full font-mono font-bold tracking-wider transition-colors active:scale-95"
            title="Clique para copiar o cupom NUVEM10"
            aria-label="Copiar cupom de desconto NUVEM10"
          >
            <span>NUVEM10</span>
            {copied ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3 opacity-80" />}
          </button>
        </div>

        <span className="opacity-40 hidden sm:inline">•</span>

        <div className="flex items-center gap-1">
          <span>🚚 <strong>Frete Grátis</strong> para compras acima de R$ 49,90</span>
        </div>

        <span className="opacity-40 hidden md:inline">•</span>

        <div className="hidden md:flex items-center gap-1">
          <span>🧁 Assados diariamente com ingredientes nobres</span>
        </div>
      </div>
    </aside>
  );
}
