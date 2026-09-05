"use client";

import React, { useState } from "react";
import { PhotoOrEmoji } from "@/components/PhotoOrEmoji";
import { ChevronLeft, ChevronRight, Sparkles, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductImageGalleryProps {
  imageEmoji: string;
  name: string;
}

export function ProductImageGallery({ imageEmoji, name }: ProductImageGalleryProps) {
  // Visões do carrossel do produto:
  // 1: Foto Principal Oficial do Cupcake
  // 2: Zoom nos Detalhes & Textura Artesanal
  // 3: Embalagem para Presente
  const slides = [
    {
      title: "Foto Principal",
      subtitle: "Acabamento gourmet",
      image: imageEmoji,
      tag: "✨ Assado na data de hoje",
    },
    {
      title: "Detalhes do Recheio",
      subtitle: "Ingredientes nobres",
      image: imageEmoji,
      tag: "🧁 Feito 100% à mão",
    },
    {
      title: "Caixa Presente",
      subtitle: "Embalagem para entrega",
      image: imageEmoji,
      tag: "🎁 Prontinho para presentear",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const currentSlide = slides[currentIndex];

  return (
    <div className="space-y-4">
      {/* Moldura Principal com Carrossel */}
      <div className="relative aspect-square w-full rounded-4xl bg-gradient-to-b from-[#FDF0E9] to-white border border-border flex items-center justify-center overflow-hidden shadow-lg shadow-primary/5 p-8 group">
        {/* Imagem do Slide Atual */}
        <div className="relative w-full h-full flex items-center justify-center transition-all duration-300">
          <PhotoOrEmoji
            photoOrEmoji={currentSlide.image}
            name={`${name} - ${currentSlide.title}`}
            className="w-full h-full object-contain drop-shadow-md transition-transform duration-500 hover:scale-105"
            emojiClassName="text-9xl"
          />
        </div>

        {/* Badge do Slide */}
        <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-border/80 shadow-2xs">
            {currentSlide.tag}
          </span>
        </div>

        {/* Indicador Numérico */}
        <div className="absolute top-4 right-4 z-10">
          <span className="text-[11px] font-semibold text-foreground/80 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-border/80 shadow-2xs">
            {currentIndex + 1} / {slides.length}
          </span>
        </div>

        {/* Controles do Carrossel (Anterior / Próximo) */}
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Ver imagem anterior"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-foreground shadow-md border border-border flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-110 active:scale-95"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={nextSlide}
          aria-label="Ver próxima imagem"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-foreground shadow-md border border-border flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-110 active:scale-95"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Miniaturas Interativas (Thumbnails) */}
      <div className="grid grid-cols-3 gap-3">
        {slides.map((slide, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentIndex(idx)}
            className={`flex items-center gap-2 p-2 rounded-2xl border text-left transition-all ${
              currentIndex === idx
                ? "border-primary bg-primary/5 shadow-xs ring-2 ring-primary/20"
                : "border-border/80 bg-card hover:bg-muted/50 hover:border-border"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-white border border-border/60 flex items-center justify-center overflow-hidden shrink-0">
              <PhotoOrEmoji
                photoOrEmoji={slide.image}
                name={slide.title}
                className="w-full h-full object-contain p-1"
                emojiClassName="text-lg"
              />
            </div>
            <div className="min-w-0 pr-1">
              <div className="text-xs font-semibold text-foreground truncate">
                {slide.title}
              </div>
              <div className="text-[10px] text-muted-foreground truncate">
                {slide.subtitle}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
