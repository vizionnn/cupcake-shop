"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CartItem, Product } from "@/types";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { LiquidButton } from "@/components/ui/liquid-glass-button";

interface CartContextType {
  items: CartItem[];
  count: number;
  subtotal: number;
  shippingFee: number;
  diffForFreeShipping: number;
  grandTotal: number;
  isDrawerOpen: boolean;
  isLoaded: boolean;
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: number, delta: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  setIsDrawerOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_KEY = "cupcake_shop_cart_v2";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Carrega do localStorage apenas no cliente (previne Hydration Mismatch)
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(CART_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Erro ao carregar carrinho do localStorage:", e);
    }
  }, []);

  // Salva no localStorage sempre que houver alteração
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Erro ao salvar carrinho no localStorage:", e);
    }
  }, [items, mounted]);

  const count = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = subtotal >= 49.9 ? 0 : 9.9;
  const diffForFreeShipping = Math.max(0, 49.9 - subtotal);
  const grandTotal = subtotal + shippingFee;

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const addToCart = (product: Product, quantity = 1) => {
    const qty = quantity > 0 ? quantity : 1;

    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.product_id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + qty,
        };
        return updated;
      }
      return [
        ...prev,
        {
          product_id: product.id,
          name: product.name,
          price: product.price,
          emoji: product.image_emoji,
          quantity: qty,
        },
      ];
    });

    // Emite o Toast elegante com o botão Liquid Glass nativo
    toast.custom(
      (t) => (
        <div className="flex items-center justify-between gap-3 w-full bg-[#FFF8F9] dark:bg-[#24140E] border-2 border-[#E85D75]/35 dark:border-[#E85D75]/50 shadow-[0_12px_36px_-4px_rgba(232,93,117,0.28),0_4px_12px_rgba(59,35,24,0.06)] dark:shadow-[0_12px_36px_-4px_rgba(0,0,0,0.6)] rounded-2xl p-3.5 sm:p-4 text-foreground min-w-[320px] max-w-md">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#E85D75] text-white shadow-sm shrink-0">
              <Check className="h-4 w-4 stroke-[3]" />
            </div>
            <div className="truncate">
              <div className="text-[#C7415A] dark:text-[#FF8FA3] font-bold text-sm tracking-tight flex items-center gap-1.5">
                <span>Adicionado à sua sacola!</span>
                <span>🧁</span>
              </div>
              <div className="text-[#5C2430] dark:text-[#DFCDC5] font-semibold text-xs truncate">
                {qty > 1 ? `${qty}x ` : ""}{product.name}
              </div>
            </div>
          </div>
          <LiquidButton
            size="sm"
            preset="berry"
            hasBeam={true}
            duration={3}
            className="px-4 py-2 text-xs font-bold shadow-md shadow-primary/30 shrink-0 min-h-[36px]"
            onClick={() => {
              setIsDrawerOpen(true);
              toast.dismiss(t);
            }}
          >
            <span>Ver sacola</span>
          </LiquidButton>
        </div>
      ),
      { duration: 3500 }
    );
  };

  const updateQuantity = (productId: number, delta: number) => {
    setItems((prev) => {
      return prev
        .map((item) => {
          if (item.product_id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (productId: number) => {
    setItems((prev) => prev.filter((item) => item.product_id !== productId));
    toast.info("Item removido da sacola.");
  };

  const clearCart = () => {
    setItems([]);
    setIsDrawerOpen(false);
    try {
      localStorage.removeItem(CART_KEY);
    } catch (_) {}
  };


  return (
    <CartContext.Provider
      value={{
        items,
        count,
        subtotal,
        shippingFee,
        diffForFreeShipping,
        grandTotal,
        isDrawerOpen,
        isLoaded: mounted,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        openDrawer,
        closeDrawer,
        setIsDrawerOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart deve ser utilizado dentro de um CartProvider");
  }
  return context;
}
