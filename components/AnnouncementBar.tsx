"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Copy, Check } from "lucide-react";

export function AnnouncementBar() {
  const [copied, setCopied] = useState(false);

  const copyCoupon = () => {
    navigator.clipboard.writeText("NUVEM10");
    setCopied(true);
    toast.success("Cupom NUVEM10 copiado", {
      description: "Cole no checkout para garantir 10% de desconto.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <aside className="bg-[#3B2318] text-[#FDF6F0]" aria-label="Avisos e promoções">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-0 px-4 text-center font-mono text-[0.6875rem] uppercase tracking-[0.12em] sm:px-6">
        <button
          type="button"
          onClick={copyCoupon}
          className="inline-flex min-h-[44px] items-center gap-2 transition-colors duration-200 hover:text-[#F2C14E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2C14E] motion-reduce:transition-none"
          aria-label="Copiar cupom de desconto NUVEM10"
        >
          <span>10% off na 1ª caixinha</span>
          <span className="inline-flex items-center gap-1.5 border border-[#F2C14E] px-2 py-0.5 font-bold text-[#F2C14E]">
            NUVEM10
            {copied ? <Check className="h-3 w-3" aria-hidden /> : <Copy className="h-3 w-3" aria-hidden />}
          </span>
        </button>
        <span className="hidden sm:inline">Frete grátis acima de R$ 49,90</span>
      </div>
    </aside>
  );
}
