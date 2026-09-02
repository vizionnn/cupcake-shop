# Nuvem de Açúcar — E-commerce de Cupcakes Gourmet

Aplicação web responsiva desenvolvida como continuação do Projeto de Intervenção (PIT), implementando as histórias de usuário definidas na etapa de documentação (PIT 1): vitrine virtual, carrinho, pedidos e pagamento.

## Stack

- **Back-end:** Node.js + Express
- **Banco de dados:** SQLite (via `better-sqlite3`)
- **Front-end:** HTML, CSS e JavaScript puro (sem framework), servido como arquivos estáticos pelo próprio Express
- **Modo de codificação:** Tradicional

## Estrutura do projeto

```
cupcake-shop/
├── server.js           # servidor Express e rotas da API
├── db/
│   ├── database.js      # conexão e criação das tabelas
│   └── seed.js           # popula o catálogo inicial
└── public/                # front-end estático
    ├── index.html          # vitrine
    ├── cart.html            # carrinho
    ├── checkout.html         # pagamento
    ├── confirmacao.html       # confirmação do pedido
    ├── css/style.css
    └── js/
        ├── cart.js            # lógica de carrinho (localStorage)
        ├── catalog.js
        ├── cart-page.js
        ├── checkout.js
        └── confirmation.js
```

## Rodando localmente

```bash
npm install
npm run seed      # popula o banco com os produtos
npm start          # inicia o servidor em http://localhost:3000
```

## Rotas da API

| Método | Rota                | Descrição                          |
|--------|----------------------|--------------------------------------|
| GET    | /api/products         | Lista os produtos da vitrine          |
| GET    | /api/products/:id      | Detalhe de um produto                  |
| POST   | /api/orders             | Cria um pedido (baixa estoque)          |
| GET    | /api/orders/:id          | Consulta um pedido e seus itens          |

## Deploy (Render, camada gratuita)

1. Suba o projeto para um repositório no GitHub (veja passo a passo abaixo).
2. Crie uma conta em render.com e clique em **New > Web Service**.
3. Conecte o repositório do GitHub.
4. Configure:
   - **Build Command:** `npm install && npm run seed`
   - **Start Command:** `npm start`
5. O Render vai gerar uma URL pública (ex: `https://nuvem-de-acucar.onrender.com`) — esse é o link da "solução em funcionamento" para preencher no PIT 2.

> Atenção: o SQLite salva o arquivo no disco do servidor. No plano gratuito do Render, o disco não é persistente entre deploys — para o propósito do PIT (demonstração funcional) isso não é um problema, mas não use esse banco para produção real.

## Subindo para o GitHub

```bash
cd cupcake-shop
git init
git add .
git commit -m "Implementação inicial do e-commerce de cupcakes (PIT 2)"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/cupcake-shop.git
git push -u origin main
```

## Ligação com as histórias de usuário do PIT 1

- **Vitrine virtual:** `GET /api/products` + `index.html`, com filtro por sabor.
- **Carrinho:** `cart.js` (estado local) + `cart.html`, com ajuste de quantidade e remoção.
- **Pedidos:** `POST /api/orders`, que valida estoque, calcula total e grava o pedido com seus itens.
- **Pagamentos:** seleção de forma de pagamento (Pix, Cartão, Dinheiro na entrega) no checkout — simulado, sem gateway real, adequado ao escopo acadêmico do PIT.
