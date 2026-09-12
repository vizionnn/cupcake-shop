"use client";

import React from "react";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { Printer } from "lucide-react";

export function PrintReceiptButton() {
  return (
    <LiquidButton
      type="button"
      variant="light"
      preset="silver"
      size="default"
      onClick={() => window.print()}
      className="px-6 gap-2 font-semibold print:hidden shadow-xs"
    >
      <Printer className="w-4 h-4" />
      <span>Imprimir Recibo / Salvar PDF</span>
    </LiquidButton>
  );
}
