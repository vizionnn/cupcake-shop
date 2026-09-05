import type { Metadata } from "next";
import { Fraunces, Karla } from "next/font/google";
import "@/app/globals.css";
import { CartProvider } from "@/context/CartContext";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";
import { CartDrawer } from "@/components/CartDrawer";
import { Toaster } from "@/components/ui/sonner";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const karla = Karla({
  subsets: ["latin"],
  variable: "--font-karla",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nuvem de Açúcar — Cupcakes Artesanais Gourmet",
  description:
    "Cupcakes feitos à mão com ingredientes nobres e entregues no mesmo dia. Monte sua caixinha exclusiva com receitas artesanais.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${karla.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col bg-background font-sans text-foreground antialiased selection:bg-primary/20 selection:text-primary">
        <CartProvider>
          <AnnouncementBar />
          <Header />
          <CartDrawer />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-border bg-card py-8 text-center text-xs text-muted-foreground mt-16">
            <div className="max-w-6xl mx-auto px-4">
              <p className="font-display font-medium text-foreground text-sm mb-1">
                Nuvem de Açúcar Confeitaria Artesanal
              </p>
              <p>Feito com amor e ingredientes nobres · Recife/PE · Projeto acadêmico e profissional.</p>
            </div>
          </footer>
          <Toaster position="bottom-right" />
        </CartProvider>
      </body>
    </html>
  );
}
