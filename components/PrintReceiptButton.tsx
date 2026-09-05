"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

export function PrintReceiptButton() {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => window.print()}
      className="rounded-full px-6 gap-2 font-semibold border-border bg-white hover:bg-muted print:hidden"
    >
      <Printer className="w-4 h-4" />
      <span>Imprimir Recibo / Salvar PDF</span>
    </Button>
  );
}
