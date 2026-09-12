# Guia de Engenharia: Vitrine Dinâmica, Hover Intent & Design System de Botões

> **Finalidade:** Documentação técnica detalhada e blueprint de implementação passo a passo para replicar a arquitetura da Vitrine (expansão contínua de 500ms, hover intent de repouso, camadas duplas persistentes no DOM) e o Design System de Botões Táteis com Feixe Perimetral Confinado em outros projetos frontend (Next.js / React / Tailwind).

---

## 1. Problemas Críticos da Abordagem Ingênua & Causa Raiz

Antes de implementar, é crucial entender por que abordagens comuns falham:

| Problema Comum | O Que Acontecia na Prática | Causa Raiz de Engenharia | Solução Arquitetural |
| :--- | :--- | :--- | :--- |
| **Expansão em Cascata Acidental** | O usuário apenas move o cursor pela grade e vários cards abrem ao mesmo tempo, cobrindo a tela. | O evento `onMouseEnter` ou coordenadas globais disparavam sem validar se o cursor estava parado. | **Hover Intent Estacionário (500ms):** O cursor deve permanecer repousado ($\Delta \le 3\text{px}$) por 500ms ininterruptos. Movimento contínuo reinicia o timer. |
| **Salto de Layout (Snapping) ao Abrir** | O card abre instantaneamente (em 0ms) ou a imagem se expande de forma brusca, sem transição fluida de tamanho. | O componente alternava entre classes `relative` e `sm:absolute`. O CSS **não interpola** transições entre esquemas de posicionamento diferentes. | **Posicionamento Contínuo no Desktop:** O card permanece **sempre em `sm:absolute sm:top-0 sm:left-0 sm:w-full`**, animando puramente a propriedade `height: 120px` para `height: 430px`. |
| **Fechamento Brusco sem Animação Reversa (Exit Snapping)** | Ao tirar o cursor, o card grande sumia em 0ms e o card pequeno surgia fazendo uma animação repentina de dentro para fora. | O React usava renderização condicional `{isExpanded ? <Expanded /> : <Compact />}`. Ao virar `false`, o conteúdo expandido era desmontado do DOM instantaneamente. | **Camadas Duplas Persistentes no DOM:** Ambas as camadas coexistem dentro de `overflow-hidden`, transicionando `opacity`, `scale` e `transform` sincronizadas em 500ms. |
| **Corte Sob Cards Adjacentes ao Fechar** | Enquanto o card estava encolhendo, ele caía atrás dos produtos vizinhos na grade. | O `z-index` caía de `z-40` para `z-10` no mesmo instante do `mouseleave`. | **Estado `isClosing` (500ms):** Mantém o `z-index: 40` e sombras elevados durante todo o meio segundo em que o card está encolhendo. |
| **Botões com Fundo Deslocado do Tema** | Botões brancos em páginas escuras (Landing Page / Console) ou pretos em páginas claras (Admin). | O componente de botão utilizava uma cor fixa ou misturava tokens de modo claro/escuro sem controle de variantes. | **Separação de Variantes:** `variant="default"` (vidro escuro) para páginas escuras e `variant="light"` para superfícies claras. |

---

## 2. Passo a Passo de Implementação: Vitrine Dinâmica

### Passo 1: Coordenação de Card Único no Componente Pai (Catálogo)

Nunca delegue o controle total de expansão para instâncias isoladas de cards. O componente pai da grade deve coordenar o ID do item aberto:

```tsx
// components/CatalogClient.tsx
import React, { useState } from "react";
import { ProductCard } from "@/components/ProductCard";

export function CatalogClient({ products }: { products: Product[] }) {
  // Guarda o ID do card aberto no catálogo inteiro (apenas 1 por vez)
  const [activeExpandedId, setActiveExpandedId] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-start pb-28">
      {products.map((product) => {
        const isThisExpanded = activeExpandedId === product.id;

        return (
          <div
            key={product.id}
            // Aumenta a elevação da célula na grade quando o card dentro dela estiver aberto
            className={`relative ${isThisExpanded ? "z-40" : "z-0 hover:z-20"} focus-within:z-40`}
          >
            <ProductCard
              product={product}
              isExpandedControlled={isThisExpanded}
              onExpandControlled={() => setActiveExpandedId(product.id)}
              onCollapseControlled={() => {
                setActiveExpandedId((current) => (current === product.id ? null : current));
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
```

---

### Passo 2: Algoritmo de Hover Intent Estacionário (500ms Parado)

O card **apenas e exclusivamente expande** se o mouse parar sobre o produto por 500ms. Se o cursor estiver em movimento contínuo pelo card, o temporizador é cancelado.

```tsx
// Dentro de components/ProductCard.tsx
const cardRef = useRef<HTMLDivElement>(null);
const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);
const closeTimerRef = useRef<NodeJS.Timeout | null>(null);
const lastPosRef = useRef<{ x: number; y: number } | null>(null);
const [isHoverSupported, setIsHoverSupported] = useState(false);
const [isClosing, setIsClosing] = useState(false);

// 1. Detecta mouse com precisão (evita disparar hover em telas touch)
useEffect(() => {
  if (typeof window !== "undefined") {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    setIsHoverSupported(media.matches);
    const listener = (e: MediaQueryListEvent) => setIsHoverSupported(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }
}, []);

// 2. Dispara timer de 500ms de repouso
const startHoverIntentTimer = () => {
  if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
  hoverTimerRef.current = setTimeout(() => {
    setIsClosing(false);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    if (onExpandControlled) onExpandControlled();
    hoverTimerRef.current = null;
  }, 500);
};

// 3. Medição de movimento: delta > 3px indica trânsito -> cancela timer
const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
  if (!isHoverSupported) return;
  if (isExpanded) return; // Se já expandido, mantém aberto e estável

  if (lastPosRef.current) {
    const dx = Math.abs(e.clientX - lastPosRef.current.x);
    const dy = Math.abs(e.clientY - lastPosRef.current.y);
    if (dx > 3 || dy > 3) {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
        hoverTimerRef.current = null;
      }
    }
  }
  lastPosRef.current = { x: e.clientX, y: e.clientY };

  // Se o timer estiver nulo (porque houve movimento), reinicia a verificação de repouso
  if (!hoverTimerRef.current) {
    startHoverIntentTimer();
  }
};

// 4. Saída do mouse: cancela abertura e agenda fechamento reverso de 500ms
const handleMouseLeave = () => {
  if (!isHoverSupported) return;

  if (hoverTimerRef.current) {
    clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = null;
  }
  lastPosRef.current = null;

  if (isExpanded) {
    setIsClosing(true);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setIsClosing(false);
      closeTimerRef.current = null;
    }, 500); // Garante z-index durante o recolhimento
  }

  if (onCollapseControlled) onCollapseControlled();
};
```

---

### Passo 3: Posicionamento Contínuo no CSS (Zero Layout Snapping)

No desktop, o slot na grade tem `sm:h-[120px]`. O card fica **permanentemente em `sm:absolute sm:top-0 sm:left-0 sm:w-full`**, de modo que a transição de altura é suavemente interpolada pelo navegador:

```tsx
<div
  className={`w-full transition-all duration-500 ease-in-out ${
    isExpanded
      ? "relative h-[430px] sm:relative sm:h-[120px] z-30 sm:z-40"
      : isClosing
      ? "relative h-[116px] sm:relative sm:h-[120px] z-30 sm:z-40"
      : "relative h-[116px] sm:h-[120px] z-0 hover:z-20"
  }`}
>
  <div
    ref={cardRef}
    onMouseMove={handleMouseMove}
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
    className={`group w-full p-[1.5px] rounded-3xl bg-border/60 dark:bg-border/40 transition-all duration-500 ease-in-out sm:absolute sm:top-0 sm:left-0 sm:w-full ${
      isExpanded
        ? "relative h-[430px] sm:h-[430px] shadow-2xl shadow-black/40 ring-1 ring-primary/25 z-40"
        : isClosing
        ? "relative h-[116px] sm:h-[120px] shadow-lg ring-0 z-40"
        : "relative h-[116px] sm:h-[120px] border-transparent shadow-xs hover:shadow-md z-10"
    }`}
  >
    {/* Contêiner interno com overflow-hidden e camadas persistentes */}
  </div>
</div>
```

---

### Passo 4: Camadas Duplas Persistentes no DOM com Crossfade & Morph

Ambas as camadas de conteúdo (Compacta e Expandida) existem simultaneamente no DOM:

```tsx
<div className="relative rounded-[calc(1.5rem-1.5px)] bg-card text-card-foreground overflow-hidden z-[2] w-full h-full">

  {/* =========================================================================
      CAMADA 1: COMPACTA (h-[120px]) - Anima saída e entrada em 500ms
     ========================================================================= */}
  <div
    aria-hidden={isExpanded}
    className={`absolute inset-x-0 top-0 h-[116px] sm:h-[120px] p-3 sm:p-3.5 flex items-center gap-3 transition-all duration-500 ease-in-out ${
      isExpanded
        ? "opacity-0 pointer-events-none scale-95 -translate-y-2"
        : "opacity-100 pointer-events-auto scale-100 translate-y-0"
    }`}
  >
    {/* Foto Miniatura */}
    <Link
      href={`/produto/${product.id}`}
      tabIndex={isExpanded ? -1 : 0}
      className="relative w-16 h-16 sm:w-18 sm:h-18 shrink-0 rounded-2xl overflow-hidden"
    >
      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
    </Link>

    {/* Informações: Título, Tag, Preço */}
    <div className="flex-1 min-w-0">
      <h3 className="font-bold text-sm truncate">{product.name}</h3>
      <p className="text-xs text-muted-foreground line-clamp-1">{product.description}</p>
    </div>

    {/* Botão Espiar e Preço */}
    <div className="shrink-0 flex flex-col items-end justify-between self-stretch">
      <button
        type="button"
        tabIndex={isExpanded ? -1 : 0}
        onClick={handleOpenMobile}
        className="text-xs font-semibold px-3 py-1.5 rounded-full bg-muted min-h-[44px]"
      >
        Espiar ↓
      </button>
      <span className="font-bold text-sm text-primary">{formatBRL(product.price)}</span>
    </div>
  </div>

  {/* =========================================================================
      CAMADA 2: EXPANDIDA (h-[430px]) - Anima entrada e saída em 500ms
     ========================================================================= */}
  <div
    aria-hidden={!isExpanded}
    className={`absolute inset-x-0 top-0 h-[430px] p-4 sm:p-5 flex flex-col gap-3 transition-all duration-500 ease-in-out ${
      isExpanded
        ? "opacity-100 pointer-events-auto scale-100 translate-y-0"
        : "opacity-0 pointer-events-none scale-95 translate-y-3"
    }`}
  >
    {/* Imagem Ampla com Altura Fixa (h-44 mobile / h-52 desktop) */}
    <Link
      href={`/produto/${product.id}`}
      tabIndex={isExpanded ? 0 : -1}
      className="block relative h-44 sm:h-52 w-full shrink-0 rounded-2xl overflow-hidden"
    >
      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
    </Link>

    {/* Título Completo & Botão Fechar no Mobile */}
    <div className="flex items-center justify-between">
      <h3 className="font-bold text-base sm:text-lg truncate">{product.name}</h3>
      <button
        type="button"
        tabIndex={isExpanded ? 0 : -1}
        onClick={handleCloseMobile}
        className="text-xs font-semibold px-3 py-1.5 rounded-full bg-muted min-h-[44px]"
      >
        Fechar ↑
      </button>
    </div>

    <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>

    {/* Ações Inferiores (Preço & Botão Adicionar ao Carrinho) */}
    <div className="pt-2 border-t border-border flex items-center justify-between mt-auto">
      <span className="font-bold text-lg text-primary">{formatBRL(product.price)}</span>
      <button
        type="button"
        tabIndex={isExpanded ? 0 : -1}
        onClick={handleAddToCart}
        className="rounded-full px-5 py-2.5 bg-primary text-white font-bold text-xs min-h-[44px]"
      >
        Adicionar ao Carrinho
      </button>
    </div>
  </div>

</div>
```

---

## 3. Passo a Passo de Implementação: Design System de Botões Táteis

### Passo 5: Máscara Perimetral Estrita para Feixe de Borda (`BorderBeam`)

Para que o gradiente rotativo percorra **estritamente a fita de 1.5px da borda** sem invadir o miolo do botão, utilizamos a máscara CSS com `maskComposite: "exclude"`:

```tsx
// components/ui/border-beam.tsx
export function BorderBeam({
  borderWidth = 1.5,
  duration = 4,
  preset = "silver", // "silver" | "cyan" | "berry" | "gold"
}: BorderBeamProps) {
  // Gradientes tailormade por preset...
  return (
    <div
      style={{
        WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
        padding: `${borderWidth}px`,
      }}
      className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden"
    >
      <div
        className="absolute inset-[-100%] animate-spin"
        style={{
          animationDuration: `${duration}s`,
          background: `conic-gradient(from 0deg, transparent 0deg, ${colorFrom} 120deg, ${colorTo} 180deg, transparent 240deg)`,
        }}
      />
    </div>
  );
}
```

---

### Passo 6: Botão `LiquidButton` com Suporte Dual (Dark Glass vs Light Mode)

O componente separa explicitamente as variantes de cor:

```tsx
// components/ui/liquid-glass-button.tsx
export function LiquidButton({
  variant = "default", // "default" (Dark Glass) | "light" (Modo Claro)
  preset = "silver",
  hasBeam = true,
  children,
  className,
  ...props
}: LiquidButtonProps) {
  const isLight = variant === "light";

  return (
    <button
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden rounded-full transition-all group cursor-pointer select-none",
        isLight ? "text-slate-800 hover:text-slate-950" : "text-slate-100 hover:text-white",
        className
      )}
      {...props}
    >
      {/* 1. Feixe rotativo confinado na borda perimetral */}
      {hasBeam && <BorderBeam preset={preset} borderWidth={1.5} />}

      {/* 2. Miolo com relevo tátil adaptado ao tema */}
      <div
        className={cn(
          "absolute inset-[1.5px] z-0 rounded-full transition-all duration-300",
          isLight
            ? "bg-white/95 border border-slate-200/90 shadow-[0_2px_6px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.95)] group-hover:bg-slate-50"
            : "bg-slate-900/90 border border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.4)] group-hover:bg-slate-800/90"
        )}
      />

      {/* 3. Conteúdo elevado com feedback tátil */}
      <div className="relative z-30 flex items-center justify-center gap-2 font-semibold">
        {children}
      </div>
    </button>
  );
}
```

* **Uso em Páginas Escuras (Landing Page, Super Admin Cockpit):**
  `<LiquidButton variant="default" preset="cyan">Gerenciar</LiquidButton>`
* **Uso em Páginas Claras (Painel Admin da Loja, Tabelas Claras):**
  `<LiquidButton variant="light" preset="silver">Atualizar Gráficos</LiquidButton>`

---

## 4. Acessibilidade (WCAG 2.2 AA) & Regras Multi-Tenant

1. **Touch Targets (44 × 44px):**
   - Qualquer elemento clicável (botão de adicionar, botão de fechar, pílula de categoria, botão de espiar) deve ter tamanho físico mínimo de `44px` (`min-h-[44px] min-w-[44px]`).
2. **Navegação por Teclado e Leitores de Tela:**
   - A camada oculta deve possuir `aria-hidden={true}` e seus links/botões `tabIndex={-1}` para não prender o foco do teclado do usuário cego ou motor.
3. **Isolamento de Links Multi-Tenant:**
   - Botões "Voltar ao Cardápio" no checkout, carrinho ou confirmação **NUNCA** devem direcionar para `/` ou `/#cardapio`. Devem apontar dinamicamente para `/${unitSlug}#cardapio`.

---

## 5. Checklist de Verificação de Qualidade

Ao aplicar no novo projeto, valide os seguintes pontos no navegador:

- [ ] **Hover Intent:** Mover o mouse rapidamente pela tela não abre nenhum card.
- [ ] **Repouso de 500ms:** Manter o cursor parado por meio segundo engatilha a abertura suave de 120px para 430px.
- [ ] **Fechamento Reverso Fluido:** Tirar o cursor do card encolhe de 430px de volta para 120px durante 500ms, sem sumiço abrupto de imagens.
- [ ] **Card Único:** Nunca existem 2 cards abertos simultaneamente.
- [ ] **Botões no Modo Escuro:** Não possuem contornos ou fundos brancos acidentais.
- [ ] **Botões no Modo Claro:** Têm fundo claro com texto escuro e contraste $\ge 4.5:1$.
- [ ] **TypeScript:** Compilação com `tsc --noEmit` executa com 0 erros.
