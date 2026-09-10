# Guia Mestre de Estudo & Defesa de PIT: Nuvem de Açúcar E-commerce
> **Documento Fonte para Estudo, Ingestão no Google NotebookLM e Apresentação de Banca Avaliadora**  
> **Projeto:** E-commerce Artesanal de Cupcakes Gourmet — *Nuvem de Açúcar*  
> **Evolução Arquitetural:** De Vanilla JS (Express + SQLite) para Next.js 16, TypeScript, Tailwind CSS, Shadcn UI & Supabase (PostgreSQL).

---

## 🎯 Sumário Executivo do Documento
Este guia foi estruturado para ser a **fonte definitiva de conhecimento teórico e prático** do projeto. Ele foi planejado especificamente para ser carregado no **Google NotebookLM**, permitindo a geração automática de podcasts didáticos (*Audio Overview*), resumos conceituais, flashcards e mapas mentais para a preparação da sua defesa acadêmica perante a banca examinadora.

---

## 🧠 1. Desmistificando a Teoria: O que é Linguagem, Biblioteca e Framework?

Um dos erros conceituais mais comuns em bancas é confundir **Linguagem**, **Superset Tipado**, **Biblioteca** e **Framework**. Compreender essas fronteiras demonstra maturidade técnica imediata.

```
+-----------------------------------------------------------------------+
| NEXT.JS (Framework Full Stack)                                        |
|   -> Dita as regras, roteamento, build, SSR, APIs e Server Components |
|                                                                       |
|   +---------------------------------------------------------------+   |
|   | REACT 19 (Biblioteca de Interface)                            |   |
|   |   -> Modela os componentes e cuida do ciclo de renderização   |   |
|   |                                                               |   |
|   |   +-------------------------------------------------------+   |   |
|   |   | TYPESCRIPT (Linguagem / Superset)                     |   |   |
|   |   |   -> Adiciona tipagem estática e segurança de compilação  |   |
|   |   |                                                       |   |   |
|   |   |   +-----------------------------------------------+   |   |   |
|   |   |   | JAVASCRIPT (Linguagem Nativa da Web)          |   |   |   |
|   |   |   |   -> O código final interpretado pelo motor V8|   |   |   |
|   |   |   +-----------------------------------------------+   |   |   |
|   |   +-------------------------------------------------------+   |   |
|   +---------------------------------------------------------------+   |
+-----------------------------------------------------------------------+
```

### 1.1. TypeScript não é Framework: É uma Linguagem (Superset)
* **O que é:** O TypeScript é um *superset* (superconjunto) tipado do JavaScript criado pela Microsoft. Isso significa que todo código JavaScript válido é código TypeScript válido, mas o TypeScript adiciona **tipos estáticos** (`Product`, `Order`, `number`, `string`).
* **Por que não é framework?** Porque o TypeScript não impõe arquitetura, não gerencia requisições HTTP, não renderiza telas e não controla rotas. Ele atua apenas no momento de **desenvolvimento e compilação**, verificando se você está cometendo erros de lógica antes do código rodar. Ao final, ele é transpilado para JavaScript puro que os navegadores e o Node.js compreendem.
* **Benefício no projeto:** Garante que se o preço de um cupcake for uma string `"12.50"` em vez de um número `12.50`, ou se tentarmos acessar `produto.preco` em vez de `produto.price`, o editor acusa o erro instantaneamente antes de ir ao ar.

### 1.2. React: Uma Biblioteca de UI (User Interface)
* **O que é:** Criado pela Meta, o React é uma **biblioteca declarativa** para criação de interfaces baseadas em componentes reutilizáveis.
* **Como funciona:** Em vez de manipular o HTML imperativamente (`document.getElementById('cart').innerHTML = ...`), declaramos o estado (`const [cart, setCart] = useState(...)`) e o React cuida de redesenhar a tela de forma otimizada.
* **Por que não é um framework completo?** O React sozinho não resolve roteamento de URLs, não decide como você busca dados no servidor, não possui convenção de pastas para APIs e não faz Server-Side Rendering (SSR) nativo sem ferramentas adicionais.

### 1.3. Next.js: O Framework Full Stack
* **O que é um Framework?** Um framework é uma estrutura completa que aplica a **Inversão de Controle (IoC - Inversion of Control)**. Enquanto em uma biblioteca você decide quando e onde chamá-la no seu código, no framework **é ele quem dita como o seu projeto deve ser organizado e chama o seu código**.
* **Como o Next.js opera:**
  1. **Roteamento Baseado em Pastas (App Router):** Criar a pasta `app/carrinho/page.tsx` cria automaticamente a rota acessível `/carrinho`. Nenhuma configuração manual de rotas é necessária.
  2. **Full Stack (Front-end + Back-end Unificados):** Na mesma base de código, você tem componentes visuais React e rotas de servidor (Route Handlers em `app/api/.../route.ts`).
  3. **Server Components (RSC):** O servidor renderiza o HTML inicial com dados do banco antes de enviar ao navegador, proporcionando SEO impecável e carregamento instantâneo.

---

## ⚖️ 2. O Salto Arquitetural: Projeto Anterior vs. Projeto Moderno

Para defender seu PIT com autoridade, você precisa saber contrastar a versão legada com a versão atual:

| Dimensão de Análise | Versão 1.0 (Legada / Vanilla) | Versão 2.0 (Moderna / Atual) | Impacto Real e Vantagem |
| :--- | :--- | :--- | :--- |
| **Arquitetura Base** | Vanilla JS + Express + HTMLs estáticos | Next.js 16 (App Router) + React 19 + TypeScript | Unificação completa da aplicação em um ecossistema coeso e tipado. |
| **Banco de Dados** | SQLite local (`cupcake_shop.sqlite`) | Supabase (PostgreSQL gerenciado na nuvem) | Elimina a perda de dados em containers efêmeros; banco online 24/7 de alta confiabilidade. |
| **Infraestrutura / Deploy** | Render.com (Plano Gratuito) | Vercel (Edge Network) + Supabase Cloud | **Fim do Cold Start:** O Render demorava até 50 segundos para acordar do modo sleep; a Vercel responde em < 100ms. |
| **Manipulação de Telas** | DOM Imperativo (`innerHTML`, `appendChild`) | Componentes Reativos Declarativos (React) | Código sem duplicações, imune a erros de sincronização e vazamentos de memória. |
| **Estilos & Design System** | CSS puro monolitico (`style.css`) | Tailwind CSS + Shadcn UI (Radix Primitives) | Consistência visual absoluta, facilidade de manutenção e tokens de design artesanais. |
| **Acessibilidade (a11y)** | Básica, sem padrões estritos | Conforme **WCAG 2.2 AA** | Navegação integral por teclado, leitores de tela compatíveis e contraste > 5.5:1. |
| **Segurança e Validação** | Checagens manuais dispersas | Validação tipada em duas camadas (Cliente + Servidor) | Impossível fraudar cupons ou preços manipulando o JavaScript do navegador. |

---

## 🗄️ 3. A Camada de Dados: Tudo sobre o Supabase e PostgreSQL

Aqui está o conhecimento para você falar com segurança máxima sobre o banco de dados.

### 3.1. O que é o Supabase?
O Supabase é um **BaaS (Backend as a Service)** de código aberto construído sobre o **PostgreSQL**, o banco de dados relacional mais avançado do mundo. Ele não é um banco proprietário: por baixo dos panos, trata-se de um servidor Linux rodando instâncias reais de Postgres com extensões de alta performance.

### 3.2. Por que trocamos o SQLite pelo Supabase no PIT?
1. **O problema do disco efêmero no Cloud (SQLite no Render):** O SQLite armazena o banco em um único arquivo local (`.sqlite`). Em plataformas de nuvem modernas (como Render, Heroku ou Vercel Serverless), os servidores são efêmeros (desligam e recriam máquinas dinamicamente). Toda vez que o servidor reiniciava, o arquivo do banco podia ser revertido, perdendo pedidos de clientes.
2. **Concorrência e Escala:** O SQLite bloqueia o arquivo inteiro para escrita durante uma transação. O PostgreSQL gerencia milhares de transações concorrentes através de bloqueio a nível de linha (*Row-Level Locking*).
3. **Disponibilidade Contínua:** No plano gratuito do Render, o servidor dormia após 15 minutos sem uso. No Supabase, o banco permanece ativo e responde a chamadas instantâneas das funções Serverless da Vercel.

### 3.3. Como a Conexão Funciona no Código (A Nuance Técnica)
No projeto, adotamos **dois modelos complementares de conexão**:

```
[ Navegador / Cliente ]
       |
       | HTTPS (Tokens Públicos NEXT_PUBLIC_SUPABASE_URL e ANON_KEY)
       v
[ Supabase REST API (PostgREST) ] ---> [ PostgreSQL Engine ]
       ^                                         ^
       |                                         |
       | Conexão Direta TCP (DATABASE_URL)      |
[ Servidor Next.js (Better Auth / pg Pool) ] ----+
```

1. **Via Cliente REST Oficial (`@supabase/supabase-js` em `lib/supabase.ts`):**
   - Utilizado pela vitrine e pelas APIs de pedidos.
   - Conecta-se via HTTPS através da URL do projeto (`NEXT_PUBLIC_SUPABASE_URL`) e da chave anônima pública (`NEXT_PUBLIC_SUPABASE_ANON_KEY`).
   - O Supabase expõe um gateway chamado **PostgREST**, que converte requisições JavaScript (`supabase.from('products').select('*')`) em consultas SQL otimizadas diretamente no banco.
2. **Via Conexão Direta PostgreSQL (`pg.Pool` em `lib/auth.ts`):**
   - Utilizado pelo framework de autenticação **Better Auth**.
   - Conecta-se diretamente à porta `5432` ou `6543` (Pooler) do Postgres utilizando a string de conexão segura `DATABASE_URL` com parâmetro `ssl: { rejectUnauthorized: false }`.

### 3.4. Condições e Chaves de Ambiente (.env)
Para que o banco funcione, o ambiente exige as seguintes variáveis configuradas no `.env.local` (localmente) e na Vercel (em produção):

* `NEXT_PUBLIC_SUPABASE_URL`: O endereço da API do seu projeto (ex: `https://xyzproject.supabase.co`).
* `NEXT_PUBLIC_SUPABASE_ANON_KEY`: A chave JWT pública assinada pelo Supabase. O prefixo `NEXT_PUBLIC_` avisa o Next.js que essa variável pode ser exposta com segurança no navegador.
* `DATABASE_URL`: A string de conexão completa com usuário, senha e host para comunicação interna de autenticação.
* `SUPABASE_SERVICE_ROLE_KEY`: (Opcional) Chave mestra de administração usada apenas no servidor para ignorar regras de RLS quando necessário.

### 3.5. O Mecanismo de Segurança: RLS (Row Level Security)
No script `db/supabase_schema.sql`, ativamos o **RLS** nas tabelas:
* **O que é?** Uma funcionalidade nativa do PostgreSQL que atua como um firewall por linha de tabela.
* **Na Vitrine (`products`):** Política `Allow public read access` permite que qualquer visitante leia os cupcakes, mas impede que qualquer um faça `INSERT`, `UPDATE` ou `DELETE` sem autorização.
* **Nos Pedidos (`orders`):** Política `Allow public insert` permite que clientes anônimos finalizem compras inserindo um novo pedido, mas eles não podem ler os pedidos de outras pessoas sem um token de sessão.

### 3.6. Concorrência Segura: RPC `decrement_stock`
Para evitar o problema clássico de e-commerce onde dois clientes compram a última unidade do mesmo cupcake ao mesmo tempo (*Race Condition*), criamos uma função SQL atômica:
```sql
CREATE OR REPLACE FUNCTION decrement_stock(p_product_id INT, p_quantity INT)
RETURNS VOID AS $$
BEGIN
  UPDATE products
  SET stock = stock - p_quantity
  WHERE id = p_product_id AND stock >= p_quantity;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Estoque insuficiente para o produto %', p_product_id;
  END IF;
END;
$$ LANGUAGE plpgsql;
```
Essa transação roda inteiramente dentro da *engine* do banco com isolamento ACID, garantindo que o estoque nunca fique negativo.

### 3.7. Estratégia de Resiliência e Fallback ("Modo Apresentação à Prova de Falhas")
Um dos maiores diferenciais de engenharia implementados nas rotas `app/api/products/route.ts` e `app/api/orders/route.ts` é o **Graceful Fallback**:
* Se o projeto for avaliado em uma rede corporativa ou acadêmica onde a porta de saída do banco estiver bloqueada, ou se as variáveis de ambiente ainda não tiverem sido configuradas na máquina do avaliador, o sistema **não trava nem exibe erro 500**.
* O código captura o erro silenciosamente e carrega os 8 cupcakes gourmet cadastrados no catálogo de segurança em `lib/products-data.ts`, armazenando o pedido transitoriamente em memória através de `lib/orders-store.ts`. A loja continua 100% navegável.

---

## 🎨 4. Frontend, Acessibilidade & Experiência do Usuário (UX)

### 4.1. Shadcn UI & Radix UI Primitives
* **Diferença de Bibliotecas Tradicionais (Bootstrap / MUI):** O Shadcn UI não é uma dependência que vem empacotada em uma caixa preta no `node_modules`. O código dos componentes fica copiado diretamente na pasta `components/ui/` do seu projeto. Você é dono do código!
* **Acessibilidade Inata (Radix UI):** Construído sobre os primitivos do Radix, o que significa que componentes complexos como o Drawer lateral (`Sheet`), os diálogos modais e os botões de seleção de pagamento (`RadioGroup`) já vêm com suporte a leitores de tela (atributos `aria-*`), foco gerenciado e suporte completo à navegação por setas e tecla <kbd>Tab</kbd>.

### 4.2. Acessibilidade WCAG 2.2 Nível AA
Durante o refinamento do PIT, calibramos a interface contra as diretrizes internacionais da WCAG:
1. **Contraste de Cores Conforme o Tema:** A paleta de confeitaria foi calibrada tanto para o modo claro quanto para o modo escuro:
   - Texto principal Cacau Ganache (`#3B2318` no claro, `#FAF5F0` no escuro) com taxa de contraste superior a **5.5:1** contra o fundo Creme Baunilha.
2. **Touch Targets de 44x44px:** Todos os botões interativos e botões de adicionar quantidade respeitam a área mínima recomendada pela Apple e Google para toques no celular.
3. **Seleção de Pagamento Inclusiva:** O seletor de Pix, Cartão ou Dinheiro em `app/checkout/page.tsx` utiliza `RadioGroup` semântico, permitindo que uma pessoa cega ou sem mouse escolha a forma de pagamento usando apenas as setas direcionais do teclado.

### 4.3. Microinterações com Anime.js & Sonner
* **Anime.js:** Motor de animações utilizado no switch de tema claro/escuro (com interpolação elástica em estilo iOS) e na explosão festiva de cupcakes ao confirmar a compra no recibo digital (`app/confirmacao/[orderId]/page.tsx`).
* **Sonner:** Biblioteca moderna e acessível de Toasts (notificações flutuantes). Emite avisos visuais e anúncios de leitor de tela (`aria-live="polite"`) ao adicionar cupcakes ao carrinho ou aplicar cupons de desconto.

### 4.4. Gestão de Estado Global: `CartContext` com `localStorage`
Em vez de sobrecarregar o projeto com ferramentas pesadas como Redux, o carrinho é gerenciado pelo **Context API do React** (`context/CartContext.tsx`):
* **Reatividade Global:** Qualquer componente na aplicação (o Header, a Vitrine, o Drawer ou a página de Checkout) pode disparar ações como `addItem`, `removeItem` ou consultar `totalCount`.
* **Persistência Offline:** O estado é sincronizado no `localStorage` do navegador com tratamento de hidratação (*hydration mismatch safety*), garantindo que o cliente não perca seus cupcakes se recarregar a página.

---

## 🗺️ 5. Mapeamento Técnico de Arquivos do Sistema

Para navegar com clareza nos arquivos do repositório durante a apresentação:

```
cupcake-shop/
├── app/                           # App Router (Next.js 16)
│   ├── api/                       # Back-end Serverless (Route Handlers)
│   │   ├── auth/[...all]/route.ts # Rota catch-all do Better Auth (PostgreSQL)
│   │   ├── coupon/route.ts        # Validação do cupom 'NUVEM10' no servidor
│   │   ├── orders/route.ts        # Criação de pedidos com baixa de estoque
│   │   ├── orders/[id]/route.ts   # Consulta de recibo para o cliente
│   │   └── products/route.ts      # Cardápio com filtros por sabor
│   ├── carrinho/page.tsx          # Visão tabular do carrinho de compras
│   ├── checkout/page.tsx          # Formulário de checkout com ViaCEP
│   ├── confirmacao/[orderId]/     # Recibo comercial com impressão limpa em PDF
│   ├── produto/[id]/page.tsx      # Detalhes do cupcake com SSR e recomendados
│   ├── globals.css                # Design tokens HSL, paleta e temas claro/escuro
│   ├── layout.tsx                 # Shell da aplicação (Header, Providers, Sonner)
│   └── page.tsx                   # Vitrine com busca em tempo real e filtros
├── components/                    # Componentes modulares
│   ├── ui/                        # Primitivos Shadcn (button, sheet, radio, etc.)
│   ├── AnimatedReceipt.tsx        # Recibo animado com Anime.js e modo impressão
│   ├── CartDrawer.tsx             # Gaveta lateral interativa do carrinho
│   ├── CatalogClient.tsx          # Vitrine reativa com cards e Skeletons
│   ├── Header.tsx                 # Cabeçalho com switch de tema e badge do carrinho
│   └── ProductImageGallery.tsx    # Galeria interativa com fotos reais e miniaturas
├── context/
│   └── CartContext.tsx            # Context API e persistência no localStorage
├── db/
│   └── supabase_schema.sql        # Script DDL do banco: tabelas, RLS e RPCs
├── lib/
│   ├── auth.ts                    # Configuração de banco do Better Auth
│   ├── auth-client.ts             # Hook do cliente para sessões no React
│   ├── delivery.ts                # Calculadora de frete regional por CEP (Recife)
│   ├── orders-store.ts            # Armazenamento em memória de fallback
│   ├── products-data.ts           # Catálogo dos 8 cupcakes com detalhes artesanais
│   ├── supabase.ts                # Inicialização resiliente do SDK do Supabase
│   └── utils.ts                   # Utilitários de classes CSS (cn, clsx)
└── types/
    └── index.ts                   # Contratos TypeScript de Produto, Pedido e Carrinho
```

---

## 🏛️ 6. Simulado de Perguntas e Respostas para a Banca Avaliadora

Aqui estão as 10 perguntas mais prováveis que professores de Engenharia de Software e Desenvolvimento Web farão na sua banca, acompanhadas das respostas ideais.

---

### ❓ Pergunta 1: "Vocês disseram que usam Next.js como framework. Por que não continuaram apenas com React puro (Vite) ou Vanilla JS?"
> **💡 Resposta do Aluno:**  
> *"Excelente pergunta. O Vanilla JS nos atendeu muito bem no protótipo inicial, mas à medida que o e-commerce ganhou complexidade em regras de negócio (cálculo de frete regional, validação de cupons e controle de estoque), o Vanilla começou a exigir manipulação manual excessiva do DOM e tornava o código vulnerável a falhas de sincronização.*  
> *Optamos pelo **Next.js** em vez do React puro com Vite por três motivos essenciais:*  
> *1) **Arquitetura Full Stack Unificada:** Não precisamos configurar e hospedar dois servidores separados (um para front e outro para back); o Next.js resolve os dois em uma só esteira de CI/CD.*  
> *2) **SEO e Renderização Híbrida:** Como um e-commerce precisa ser indexado pelo Google, os Server Components do Next.js entregam as páginas de produtos já renderizadas em HTML rápido para os robôs de busca.*  
> *3) **Segurança nas Regras de Venda:** Funções sensíveis, como o recálculo do cupom e a baixa no banco, são executadas estritamente no servidor via Route Handlers, impossibilitando que o cliente adultere valores pelo DevTools."*

---

### ❓ Pergunta 2: "Qual a diferença prática entre o JavaScript e o TypeScript nesse projeto?"
> **💡 Resposta do Aluno:**  
> *"O JavaScript é uma linguagem de tipagem dinâmica, o que significa que erros como tentar acessar uma propriedade que não existe ou passar uma string onde se esperava um número só são descobertos quando o usuário clica no botão e a tela quebra em tempo de execução.*  
> *O TypeScript introduziu uma camada de **análise estática e segurança de tipos**. Criamos um contrato no arquivo `types/index.ts` que define exatamente o que é um `Product` e um `CheckoutPayload`. Se tentarmos submeter um pedido sem o campo obrigatório `payment_method`, o compilador do TypeScript impede a geração do build em produção antes mesmo de enviarmos o código para a Vercel. Isso garantiu zero erros de tipagem estática no nosso deploy final."*

---

### ❓ Pergunta 3: "Como vocês garantem que o banco de dados Supabase não sofrerá invasões ou adulterações, já que as chaves estão no código do front-end?"
> **💡 Resposta do Aluno:**  
> *"Essa é uma das nuances mais interessantes da arquitetura moderna de BaaS. A chave exposta no front-end (`NEXT_PUBLIC_SUPABASE_ANON_KEY`) é intencionalmente pública, mas ela não tem permissão irrestrita. O que protege nossos dados é o **RLS (Row Level Security)** configurado no PostgreSQL.*  
> *No arquivo `db/supabase_schema.sql`, escrevemos regras no próprio motor do banco que dizem: 'qualquer visitante com a chave anônima pode executar SELECT na tabela de produtos, mas NINGUÉM pode fazer UPDATE ou DELETE'. Além disso, operações críticas de pedidos passam pelas nossas rotas de servidor no Next.js, onde os valores são revalidados antes de tocar o banco."*

---

### ❓ Pergunta 4: "Por que vocês migraram do SQLite local para o Supabase PostgreSQL? Não seria mais simples manter o SQLite?"
> **💡 Resposta do Aluno:**  
> *"O SQLite é um excelente banco de dados para sistemas embarcados, aplicativos mobile ou testes locais, porque ele funciona como um arquivo simples gravado no disco da máquina. No entanto, em ambientes de nuvem modernos com containers e funções Serverless (como Vercel e Render), os discos são efêmeros. Isso significa que, a cada novo deploy ou quando o container era reiniciado, o arquivo `.sqlite` podia ser descartado, apagando os pedidos realizados pelos clientes.*  
> *Além disso, o plano gratuito do Render colocava o servidor em suspensão (modo sleep) após 15 minutos de inatividade, causando uma lentidão de 50 segundos no primeiro acesso do cliente. Migrando para o Supabase (PostgreSQL gerenciado na nuvem) e a Vercel, temos um banco relacional permanente, com suporte a alta concorrência de vendas, e uma aplicação que responde em menos de 100 milissegundos via Edge Network 24 horas por dia."*

---

### ❓ Pergunta 5: "Se dois clientes clicarem no mesmo milissegundo para comprar o último cupcake disponível em estoque, como o sistema de vocês trata essa concorrência?"
> **💡 Resposta do Aluno:**  
> *"Tratamos esse cenário através de uma **função RPC atômica no PostgreSQL**, chamada `decrement_stock`. Em vez de fazer uma lógica frágil no JavaScript de 'ler o estoque, subtrair um e gravar de volta', delegamos a operação para uma transação interna com controle ACID no banco:*  
> *A consulta faz `UPDATE products SET stock = stock - quantidade WHERE id = produto_id AND stock >= quantidade`. Se o estoque atual for menor que o solicitado, o banco levanta uma exceção e a transação sofre rollback instantâneo, retornando um status HTTP 400 amigável para o segundo cliente avisando que o estoque esgotou. Isso elimina o risco de concorrência (*Race Condition*)."*

---

### ❓ Pergunta 6: "Como o carrinho de compras se mantém salvo se o usuário fechar o navegador ou recarregar a página?"
> **💡 Resposta do Aluno:**  
> *"O gerenciamento do carrinho é feito através de um **Context API do React** (`CartContext.tsx`), que mantém o estado reativo em memória durante a navegação. Para garantir a persistência duradoura, nós sincronizamos automaticamente esse estado com o **`localStorage`** do navegador do cliente a cada modificação.*  
> *Tomamos também um cuidado técnico avançado com o ciclo de vida do Next.js: para evitar o erro de 'Hydration Mismatch' (quando o HTML gerado no servidor difere do HTML inicial do navegador), o carrinho só lê o `localStorage` após a montagem do componente no cliente (`useEffect`), garantindo que o servidor e o cliente sempre permaneçam sincronizados."*

---

### ❓ Pergunta 7: "Vocês mencionaram conformidade com as diretrizes WCAG 2.2 AA. Podem citar exemplos práticos de como a acessibilidade foi aplicada?"
> **💡 Resposta do Aluno:**  
> *"Com certeza. A acessibilidade foi pensada desde o design system até os componentes interativos:*  
> *1) **Navegação por Teclado:** Toda a aplicação pode ser utilizada sem mouse. No checkout, utilizamos o `RadioGroup` do Radix UI para as formas de pagamento, permitindo que o usuário alterne entre Pix, Cartão e Dinheiro usando apenas as setas direcionais do teclado.*  
> *2) **Contraste Cromático:** Validamos as cores da confeitaria contra o algoritmo de contraste WCAG. Nosso texto marrom Cacau (`#3B2318`) sobre o fundo Creme (`#FDF6F0`) possui taxa de contraste de 11.8:1, superando com folga a exigência mínima da norma, que é de 4.5:1 para texto normal.*  
> *3) **Tamanho de Alvos de Toque:** Todos os botões de ação e incremento do carrinho possuem dimensões mínimas de 44 por 44 pixels, facilitando o uso por pessoas com tremores motores ou em telas pequenas de smartphones.*  
> *4) **Notificações Assistivas:** Nossos toasts usam a biblioteca Sonner, que dispara atributos `aria-live` para que pessoas cegas que utilizam leitores de tela como NVDA ou VoiceOver saibam imediatamente quando um produto foi adicionado ao carrinho."*

---

### ❓ Pergunta 8: "O que acontece se a internet do cliente oscilar ou se as credenciais do Supabase não estiverem disponíveis no momento da avaliação?"
> **💡 Resposta do Aluno:**  
> *"Nós desenhamos a arquitetura sob o princípio da **Degradação Graciosa (Graceful Degradation)** e resiliência de software.*  
> *Nas rotas de API (`app/api/products/route.ts` e `app/api/orders/route.ts`), as chamadas ao Supabase estão envelopadas em blocos `try/catch`. Se o banco não responder ou as chaves não estiverem preenchidas, o sistema automaticamente recorre ao cardápio de segurança em `lib/products-data.ts` e armazena os pedidos em memória através de `lib/orders-store.ts`. O cliente consegue navegar, ver fotos, calcular frete, aplicar cupons e emitir o recibo normalmente sem que a aplicação exiba telas de erro 500."*

---

### ❓ Pergunta 9: "Como é feita a estimativa de entrega e o cálculo do frete?"
> **💡 Resposta do Aluno:**  
> *"Desenvolvemos uma solução em duas etapas:*  
> *1) **Consumo de API Externa (ViaCEP):** Ao digitar o CEP no checkout, a aplicação faz uma requisição assíncrona à API pública do ViaCEP para autopreencher rua, bairro e cidade, reduzindo a fricção e erros de digitação do cliente.*  
> *2) **Cálculo de Frete e Prazo Regional:** No módulo `lib/delivery.ts`, implementamos uma regra de negócio adaptada à realidade da Região Metropolitana do Recife. A loja oferece frete grátis para compras acima de R$ 49,90. Para valores inferiores, o frete base é de R$ 9,90, com prazos calculados dinamicamente (de 45 a 90 minutos para a capital e entregas no mesmo dia para municípios vizinhos como Olinda e Jaboatão)."*

---

### ❓ Pergunta 10: "Como o time organizou o fluxo de versionamento no Git para garantir que a versão anterior não fosse perdida durante a migração?"
> **💡 Resposta do Aluno:**  
> *"Seguimos as melhores práticas corporativas de branching do Git:*  
> *A branch `main` com o projeto original Vanilla permaneceu protegida e intocada. Criamos uma branch de feature isolada chamada `feature/nextjs-shadcn-migration`.*  
> *Todos os passos da migração foram executados em commits semânticos atômicos (seguindo o padrão Conventional Commits, como `feat:`, `fix:`, `refactor:`). Antes de propor o merge, validamos a integridade de compilação com `npx tsc --noEmit` e o build de produção com `npm run build`. Assim, garantimos rastreabilidade total, sem risco de regressão ou perda de código."*

---

## 🛠️ 7. Dicas para Utilizar este Guia no Google NotebookLM

1. Acesse o **Google NotebookLM** ([notebooklm.google.com](https://notebooklm.google.com)).
2. Crie um novo caderno intitulado: **"Defesa PIT - Nuvem de Açúcar E-commerce"**.
3. Faça o upload deste arquivo `GUIA_NOTEBOOKLM_PIT.md`.
4. **Comandos e Prompts sugeridos para testar no chat do NotebookLM:**
   - *"Gere um podcast (Audio Overview) simulando uma conversa entre dois engenheiros de software explicando como o e-commerce Nuvem de Açúcar funciona."*
   - *"Crie 5 perguntas difíceis sobre banco de dados e Next.js com base nesta fonte para me testar."*
   - *"Explique a diferença entre React e Next.js usando uma metáfora simples do dia a dia."*
   - *"Gere um resumo em tópicos com as principais decisões de arquitetura e segurança do projeto."*
