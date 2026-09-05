"use client";

import React, { useState, useEffect } from "react";
import { getDeliveryEstimateByCep } from "@/lib/delivery";
import { DeliveryEstimate } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Truck, MapPin, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface CepCalculatorProps {
  onEstimateChange?: (estimate: DeliveryEstimate, address?: string) => void;
  compact?: boolean;
}

export function CepCalculator({ onEstimateChange, compact = false }: CepCalculatorProps) {
  const [cep, setCep] = useState("");
  const [loading, setLoading] = useState(false);
  const [estimate, setEstimate] = useState<DeliveryEstimate | null>(null);
  const [cityInfo, setCityInfo] = useState<string>("");

  useEffect(() => {
    // Carrega CEP salvo anteriormente
    const savedCep = localStorage.getItem("cupcake_user_cep") || "";
    const savedCity = localStorage.getItem("cupcake_user_city") || "";
    if (savedCep && savedCep.length === 8) {
      const formatted = savedCep.replace(/^(\d{5})(\d)/, "$1-$2");
      setCep(formatted);
      const est = getDeliveryEstimateByCep(savedCep);
      setEstimate(est);
      setCityInfo(savedCity);
      if (onEstimateChange) onEstimateChange(est);
    }
  }, []);

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "").substring(0, 8);
    if (val.length > 5) {
      val = val.replace(/^(\d{5})(\d)/, "$1-$2");
    }
    setCep(val);
  };

  const handleSearch = async () => {
    const rawCep = cep.replace(/\D/g, "");
    if (rawCep.length !== 8) {
      toast.error("CEP incompleto", {
        description: "Por favor, digite um CEP com 8 dígitos.",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${rawCep}/json/`);
      const data = await res.json();

      if (data.erro) {
        toast.error("CEP não localizado", {
          description: "Verifique o número digitado ou preencha o endereço manualmente.",
        });
        setLoading(false);
        return;
      }

      const est = getDeliveryEstimateByCep(rawCep);
      const city = `${data.localidade} - ${data.uf}`;
      const addressString = `${data.logradouro || ""}${data.bairro ? ` - ${data.bairro}` : ""}, ${city}`;

      setEstimate(est);
      setCityInfo(city);

      localStorage.setItem("cupcake_user_cep", rawCep);
      localStorage.setItem("cupcake_user_city", city);
      localStorage.setItem("cupcake_user_address", addressString);

      if (onEstimateChange) {
        onEstimateChange(est, addressString);
      }

      toast.success("Frete e prazo calculados!", {
        description: `${est.badge}: ${est.desc}`,
      });
    } catch (err) {
      console.error(err);
      toast.error("Erro na consulta do CEP", {
        description: "Não foi possível conectar ao serviço dos Correios.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-muted/40 border border-border rounded-2xl p-4 ${compact ? "text-xs" : "text-sm"}`}>
      <div className="flex items-center gap-2 mb-2.5 font-medium text-foreground">
        <Truck className="w-4 h-4 text-primary" />
        <span>Calcular entrega e prazo</span>
      </div>

      <div className="flex gap-2">
        <Input
          type="text"
          value={cep}
          onChange={handleCepChange}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Ex: 50010-000"
          className="h-10 text-sm bg-card dark:bg-[#20150f] text-foreground"
          maxLength={9}
          aria-label="CEP para cálculo de entrega"
        />
        <Button
          type="button"
          onClick={handleSearch}
          disabled={loading}
          variant="outline"
          size="sm"
          className="h-10 px-4 font-semibold shrink-0"
        >
          {loading ? "Buscando..." : "Calcular"}
        </Button>
      </div>

      {estimate && (
        <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 rounded-xl text-emerald-900 dark:text-emerald-200 flex items-start gap-2.5 animate-in fade-in-50">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <div className="font-bold flex items-center justify-between">
              <span>{estimate.title}</span>
              <span className="text-[11px] bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                {estimate.badge}
              </span>
            </div>
            <p className="mt-0.5 text-emerald-800 font-medium">{estimate.desc}</p>
            {cityInfo && (
              <p className="mt-1 text-[11px] text-emerald-700/80 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {cityInfo}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
