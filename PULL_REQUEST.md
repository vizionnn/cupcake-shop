# Pull Request: Migração Completa para Next.js 15, TypeScript, Shadcn UI, Supabase & Better Auth

**URL para abrir este PR no GitHub com 1 clique:**
👉 [Criar Pull Request no GitHub](https://github.com/vizionnn/cupcake-shop/compare/main...feature/nextjs-shadcn-migration?expand=1)

---

## 📌 Título Sugerido do PR
```
feat: migração corporativa para Next.js 15, TypeScript, Shadcn UI, Supabase e Better Auth
```

---

## 📝 Descrição Completa do PR

### 🎯 Visão Geral
Este Pull Request consolida a modernização completa do e-commerce artesanal **Nuvem de Açúcar**, migrando a aplicação da arquitetura inicial (Vanilla JS + Express + SQLite local no Render) para uma stack moderna, corporativa, com acessibilidade WCAG 2.2 AA, zero tempo de inatividade e pronta para escala na **Vercel** e **Supabase**.

---

### 📦 Principais Entregas e Funcionalidades

#### 1. Frontend & Design System (Next.js 15 + Tailwind CSS + Shadcn UI)
- **App Router:** Renderização otimizada com Server Components para SEO instantâneo e Client Components para interatividade suave.
- **Shadcn UI & Radix Primitives:** Componentes acessíveis implementados: `Button`, `Card`, `Sheet` (Cart Drawer), `Badge`, `Input`, `Textarea`, `RadioGroup`, `Skeleton`, `Separator` e `Sonner` (Toasts elegantes).
- **Acessibilidade e Usabilidade:** 
  - Seleção de pagamento via teclado com feedback auditivo/visual conforme WCAG 2.2 AA.
  - Alvos de toque otimizados para mobile (touch targets de 44x44px).
  - Empty states enriquecidos com ilustração e botão direto para o cardápio.
  - Skeletons de carregamento na vitrine.
- **Carrosséis Interativos de Produto:**
  - `ProductImageGallery`: carrossel com visão principal, detalhes do recheio artesanal e caixinha para presente, com miniaturas e controles táteis.
  - `RecommendedCarousel`: carrossel de recomendados (*"Você também vai amar"*) com navegação por setas e snap scroll horizontal.

#### 2. Banco de Dados & Infraestrutura em Nuvem (Supabase + Vercel)
- **Zero Sleep:** Fim do modo de suspensão de 15 minutos do Render. A Vercel entrega respostas em < 100ms via Edge Network e o Supabase mantém o PostgreSQL 24/7 online.
- **Esquema Relacional PostgreSQL:** Script `db/supabase_schema.sql` com tabelas `products`, `orders`, `order_items` e as 4 tabelas de autenticação do Better Auth (`user`, `session`, `account`, `verification`).
- **Segurança RLS (Row Level Security):** Políticas granulares configuradas para vitrine pública e criação segura de pedidos.
- **Baixa Atômica de Estoque:** Função RPC `decrement_stock` para evitar concorrência ou compras duplicadas.
- **Resiliência:** Implementado fallback gracioso no frontend e nas APIs com todos os 8 cupcakes artesanais cadastrados em `lib/products-data.ts`.

#### 3. Autenticação Moderna Pronta para Expansão (Better Auth)
- **Instalação do Better Auth:** Framework de autenticação TypeScript-first instalado com driver PostgreSQL (`pg`).
- **Endpoints Prontos:** Rota catch-all em `app/api/auth/[...all]/route.ts`.
- **Cliente React:** Utilitário `lib/auth-client.ts` com métodos `signIn`, `signUp`, `signOut` e `useSession` prontos para conexão com interfaces futuras de login/cadastro.

#### 4. Limpeza da Arquitetura Legada
- **Remoção de 100 pacotes obsoletos:** Eliminados `express`, `cors`, `better-sqlite3` e dependências nativas em C++.
- **Exclusão de arquivos mortos:** Removidos todos os HTMLs estáticos (`public/*.html`), scripts Vanilla (`public/js/*.js`), estilos legados (`public/css/style.css`) e servidores antigos (`server.js`, `db/database.js`, `db/seed.js`).
- **Preservação de Ativos:** Fotos reais dos 8 cupcakes mantidas intactas em `public/images/`.

---

### 🧪 Testes e Validações Executados

- [x] **Checagem de Tipagem Estática:** `npx tsc --noEmit` aprovado com **0 erros**.
- [x] **Compilação de Produção Turbopack:** `npm run build` gerou com sucesso as 12 rotas dinâmicas e estáticas em **1.2s**.
- [x] **Conexão com Supabase:** Testado via script live contra o endpoint do projeto.
- [x] **Fluxo de Navegação e Carrinho:** Vitrine -> Detalhes -> Carrinho -> Drawer -> Checkout -> Recibo de Confirmação com chuva de cupcakes.

---

### 🚀 Instruções para Deploy e Homologação

1. Fazer o merge deste PR na branch `main`.
2. No Supabase Dashboard, executar a query contida em `db/supabase_schema.sql` no **SQL Editor**.
3. Na Vercel, configurar as variáveis de ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (ou `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`)
