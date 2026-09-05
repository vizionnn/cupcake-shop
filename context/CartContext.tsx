"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CartItem, Product } from "@/types";
import { toast } from "sonner";

interface CartContextType {
  items: CartItem[];
  count: number;
  subtotal: number;
  shippingFee: number;
  diffForFreeShipping: number;
  grandTotal: number;
  isDrawerOpen: boolean;
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

    // Emite o Toast elegante com o Sonner
    toast.success("Adicionado à sua sacola! 🧁", {
      description: `${qty > 1 ? `${qty}x ` : ""}${product.name}`,
      action: {
        label: "Ver sacola",
        onClick: () => setIsDrawerOpen(true),
      },
      duration: 3000,
    });
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
