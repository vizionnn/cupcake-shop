import type { Metadata } from "next";
import { Fraunces, Karla, JetBrains_Mono } from "next/font/google";
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

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nuvem de Açúcar — Cupcakes Artesanais Gourmet",
  description:
    "Cupcakes feitos à mão com ingredientes nobres e entregues no mesmo dia. Monte sua caixinha exclusiva com receitas artesanais.",
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🧁</text></svg>",
        type: "image/svg+xml",
      },
    ],
    apple: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🧁</text></svg>",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${fraunces.variable} ${karla.variable} ${jetbrains.variable} scroll-smooth`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('theme');
                  var supportDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (stored === 'dark' || (!stored && supportDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-background font-sans text-foreground antialiased selection:bg-primary/20 selection:text-primary">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:font-semibold focus:rounded-full focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all"
        >
          Pular para o conteúdo principal
        </a>
        <CartProvider>
          <AnnouncementBar />
          <Header />
          <CartDrawer />
          <main id="main-content" className="flex-1">{children}</main>
          <footer className="mt-24 border-t border-border bg-[#3B2318] pb-safe text-[#FDF6F0]">
            <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-12">
              <div className="md:col-span-5">
                <p className="font-display text-2xl font-bold">Nuvem de Açúcar</p>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#FDF6F0]/75">
                  Confeitaria artesanal em Recife. Cupcakes assados todas as manhãs, com manteiga e cacau nobre.
                </p>
              </div>
              <nav aria-label="Rodapé" className="md:col-span-3">
                <p className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-[#F2C14E]">Loja</p>
                <ul className="mt-3">
                  {[
                    ["/#cardapio", "Cardápio"],
                    ["/carrinho", "Sacola"],
                    ["/#abordagem", "Como fazemos"],
                  ].map(([href, label]) => (
                    <li key={href}>
                      <a href={href} className="inline-flex min-h-[44px] items-center text-sm hover:text-[#F2C14E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2C14E]">
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="md:col-span-4">
                <p className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-[#F2C14E]">Entrega</p>
                <p className="mt-3 text-sm leading-relaxed text-[#FDF6F0]/75">
                  Recife e Região Metropolitana, em até 3 horas. Frete grátis acima de R$ 49,90.
                </p>
              </div>
            </div>
            <div className="border-t border-[#FDF6F0]/15">
              <p className="mx-auto max-w-6xl px-4 py-5 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-[#FDF6F0]/60 sm:px-6">
                Nuvem de Açúcar · Recife/PE · Projeto acadêmico e profissional
              </p>
            </div>
          </footer>
          <Toaster position="bottom-right" />
        </CartProvider>
      </body>
    </html>
  );
}
