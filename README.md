# Nuvem de Açúcar — E-commerce de Cupcakes Gourmet

Aplicação web moderna, responsiva e acessível desenvolvida com **Next.js (App Router)**, **TypeScript**, **Shadcn UI** e integrada com **Supabase (PostgreSQL)** para deploy com zero tempo de inatividade na **Vercel**.

---

## 🛠️ Stack Tecnológica Moderna

- **Framework Fullstack:** [Next.js](https://nextjs.org/) (App Router, Server Components para SEO e performance de ponta).
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/) estrito (`strict: true`).
- **Design System & UI:** [Tailwind CSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/) (baseada em primitivos acessíveis do Radix UI).
- **Componentes Essenciais:** `Button`, `Card`, `Sheet` (Cart Drawer), `Badge`, `Input`, `Textarea`, `RadioGroup`, `Skeleton`, `Separator`, `Sonner` (Toasts).
- **Banco de Dados em Nuvem:** [Supabase](https://supabase.com/) (PostgreSQL gerenciado, 24/7 online, sem "sleep mode").
- **Hospedagem & Deploy:** [Vercel](https://vercel.com/) (Rede Edge global com recarregamento instantâneo).

---

## 📁 Estrutura do Projeto

```
cupcake-shop/
├── app/                        # App Router do Next.js
│   ├── api/                    # Route Handlers (endpoints de API)
│   │   ├── coupon/             # Validação de cupons
│   │   ├── orders/             # Criação e consulta de pedidos
│   │   └── products/           # Vitrine e recomendados
│   ├── carrinho/               # Página dedicada do carrinho
│   ├── checkout/               # Checkout acessível (WCAG) com ViaCEP
│   ├── confirmacao/[orderId]/  # Recibo comercial com animação e impressão limpa
│   ├── produto/[id]/           # Detalhes do cupcake com SSR
│   ├── globals.css             # Design tokens e paleta artesanal
│   ├── layout.tsx              # Shell global com Header, AnnouncementBar e Sonner
│   └── page.tsx                # Vitrine principal com busca e filtros
├── components/                 # Componentes React e Shadcn UI
│   ├── ui/                     # Primitivos Shadcn (button, sheet, card, etc.)
│   ├── CartDrawer.tsx          # Drawer lateral do carrinho com frete regional
│   ├── CatalogClient.tsx       # Filtros reativos e busca da vitrine
│   └── Header.tsx              # Cabeçalho com indicador de itens no carrinho
├── context/                    # Estado global da aplicação
│   └── CartContext.tsx         # Carrinho reativo com persistência no localStorage
├── db/
│   └── supabase_schema.sql     # Schema SQL completo e Seed dos 8 cupcakes gourmet
├── lib/
│   ├── supabase.ts             # Cliente de conexão Supabase resiliente
│   └── utils.ts                # Utilitários de formatação (BRL, CN, etc.)
├── public/                     # Ativos estáticos públicos
│   └── images/                 # Fotos reais dos cupcakes gourmet
└── types/                      # Contratos e tipagens TypeScript
    └── index.ts                # Tipos de Produto, Pedido, Carrinho e Checkout
```

---

## 🚀 Como Rodar Localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/vizionnn/cupcake-shop.git
   cd cupcake-shop
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure o arquivo de variáveis de ambiente:**
   Copie o arquivo `.env.example` para `.env.local` e preencha com suas chaves do Supabase:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-publica-aqui
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

5. **Para testar o build de produção:**
   ```bash
   npm run build
   npm start
   ```

---

## 🗄️ Configuração do Banco de Dados no Supabase

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard).
2. Vá no **SQL Editor** (`>_`) e clique em **New query**.
3. Copie todo o conteúdo do arquivo `db/supabase_schema.sql` e execute com **Run**.
4. Suas tabelas e os 8 cupcakes artesanais estarão prontos para uso imediatamente.

---

## 🌐 Deploy na Vercel

1. Importe o repositório na [Vercel](https://vercel.com).
2. Adicione as variáveis de ambiente em **Settings > Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. A Vercel executará o `next build` e fará o deploy automático a cada push no GitHub!
