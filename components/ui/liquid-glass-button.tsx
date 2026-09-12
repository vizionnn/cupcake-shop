"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { BorderBeamPreset, PRESET_GRADIENTS, BorderBeam } from "./border-beam";

const buttonVariants = cva(
  "inline-flex items-center cursor-pointer justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.96]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20",
        destructive:
          "bg-destructive text-primary-foreground hover:bg-destructive/90 shadow-sm",
        cool: "border border-b-2 border-zinc-950/40 bg-gradient-to-t from-primary to-primary/85 shadow-md shadow-primary/20 ring-1 ring-inset ring-white/25 transition-all duration-200 hover:brightness-110 active:brightness-90 text-primary-foreground dark:border-t-0 dark:border-primary/50 dark:ring-white/10",
        outline:
          "border border-input bg-background/80 backdrop-blur-md hover:bg-accent hover:text-accent-foreground shadow-xs",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 font-semibold shadow-xs",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2.5 text-sm min-h-[44px]",
        sm: "h-9 rounded-xl px-3 text-xs min-h-[36px]",
        lg: "h-12 rounded-2xl px-8 text-base font-semibold min-h-[48px]",
        icon: "h-11 w-11 min-h-[44px] min-w-[44px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

/* ==========================================================================
   Liquid Glass Button Variants (taste-skill + transitions.dev + ux-designer)
   Paleta artesanal: Framboesa Glaciada, Baunilha Porcelana e Vidro Fosco
   ========================================================================== */
const liquidbuttonVariants = cva(
  "relative inline-flex items-center justify-center cursor-pointer gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-[0.96] hover:-translate-y-0.5 hover:brightness-105 select-none",
  {
    variants: {
      variant: {
        // Framboesa Glaciada Líquida (CTA Principal com alto impacto gastronômico)
        default:
          "bg-transparent text-white shadow-lg shadow-primary/25",
        berry:
          "bg-transparent text-white shadow-lg shadow-primary/25",
        // Baunilha Porcelana (Superfícies claras, texto cacau nobre #3B2318)
        light:
          "bg-transparent text-[#3B2318] dark:text-[#faf5f0] shadow-sm",
        cream:
          "bg-transparent text-[#3B2318] dark:text-[#faf5f0] shadow-sm",
        // Vidro Fosco Aveludado (Backdrop blur)
        outline:
          "bg-transparent text-foreground shadow-xs",
        frosted:
          "bg-transparent text-foreground shadow-xs",
        // Caramelo Artesanal
        secondary:
          "bg-transparent text-[#3B2318] shadow-md shadow-amber-500/20",
        // Ganache de Cacau Noturno
        dark:
          "bg-transparent text-white shadow-lg shadow-black/40",
        destructive:
          "bg-transparent text-white shadow-md shadow-destructive/25",
        ghost:
          "bg-transparent text-muted-foreground hover:text-primary",
        link:
          "bg-transparent text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2.5 has-[>svg]:px-3.5 min-h-[44px]",
        sm: "h-9 text-xs gap-1.5 px-3.5 has-[>svg]:px-3 min-h-[36px]",
        lg: "h-12 rounded-full px-7 has-[>svg]:px-5 min-h-[48px] text-base",
        xl: "h-14 rounded-full px-9 has-[>svg]:px-6 min-h-[56px] text-base font-bold",
        xxl: "h-16 rounded-full px-10 has-[>svg]:px-8 min-h-[64px] text-lg font-bold",
        icon: "size-11 min-h-[44px] min-w-[44px] rounded-full p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface LiquidButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof liquidbuttonVariants> {
  asChild?: boolean;
  preset?: BorderBeamPreset;
  hasBeam?: boolean;
  duration?: number;
  tone?: "dark" | "light" | "auto";
  contentClassName?: string;
}

const LiquidButton = React.forwardRef<HTMLButtonElement, LiquidButtonProps>(
  (
    {
      className,
      variant = "default",
      size,
      asChild = false,
      children,
      preset = "berry",
      hasBeam = true,
      duration = 4,
      tone,
      contentClassName,
      ...props
    },
    ref
  ) => {
    const isLight = variant === "light" || variant === "cream" || tone === "light";
    const isFrosted = variant === "outline" || variant === "frosted";
    const isDark = variant === "dark";
    const isSecondary = variant === "secondary";
    const isDestructive = variant === "destructive";
    const isGhost = variant === "ghost" || variant === "link";

    // Preset selecionado de forma harmoniosa com a paleta
    const activePreset: BorderBeamPreset =
      preset ||
      (isLight ? "gold" : isSecondary ? "gold" : isDark ? "silver" : "berry");

    const renderInnerContent = (content: React.ReactNode) => (
      <>
        {/* 1. Feixe rotativo perimetral via BorderBeam mascarado */}
        {hasBeam && !isGhost && (
          <BorderBeam
            preset={activePreset}
            duration={duration}
            borderWidth={1.5}
            className="z-20"
          />
        )}

        {/* 2. Miolo com textura e acabamento artesanal gastronômico (taste-skill):
            - isLight / cream: porcelana baunilha aveludada com brilho sutil
            - isFrosted: vidro fosco com backdrop-blur-md
            - default / berry: framboesa glaciada translúcida rica com specular highlight
            - isSecondary: caramelo e manteiga artesanal
            - isDark: ganache cacau nobre
        */}
        {!isGhost && (
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-[1.5px] z-0 rounded-[inherit] transition-all duration-300",
              isLight
                ? "bg-white/95 dark:bg-[#281b15]/90 border border-[#EBD9CC] dark:border-border/60 shadow-[0_2px_8px_rgba(59,35,24,0.06),inset_0_1px_1.5px_rgba(255,255,255,0.95)] group-hover:bg-[#FDF6F0] dark:group-hover:bg-[#34241c]"
                : isFrosted
                ? "bg-white/50 dark:bg-card/50 backdrop-blur-md border border-border/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] group-hover:bg-white/80 dark:group-hover:bg-card/80"
                : isSecondary
                ? "bg-gradient-to-b from-[#fde68a] to-[#f59e0b] border border-white/30 shadow-[0_2px_8px_rgba(245,158,11,0.3),inset_0_1px_1.5px_rgba(255,255,255,0.8)] group-hover:brightness-105"
                : isDark
                ? "bg-[#1c130e]/95 border border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.15)] group-hover:bg-[#261a14]"
                : isDestructive
                ? "bg-gradient-to-b from-destructive/90 to-destructive border border-white/20 shadow-[0_2px_8px_rgba(239,68,68,0.35),inset_0_1px_1.5px_rgba(255,255,255,0.4)]"
                : "bg-gradient-to-b from-[#f43f5e]/90 via-[#e85d75]/95 to-[#be123c]/95 border border-white/25 shadow-[0_4px_14px_rgba(232,93,117,0.35),inset_0_1px_1.5px_rgba(255,255,255,0.55)] group-hover:from-[#fb7185] group-hover:to-[#a3223b]"
            )}
          />
        )}

        {/* 3. Camada de brilho especular líquido de topo (Gloss Sheen) */}
        {!isGhost && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-2 top-[2px] h-[35%] rounded-t-[inherit] bg-gradient-to-b from-white/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity z-10"
          />
        )}

        {/* 4. Conteúdo elevado com contraste nítido e feedback tátil */}
        <span
          className={cn(
            "relative z-30 flex items-center justify-center gap-2 font-semibold",
            contentClassName,
            isLight
              ? "text-[#3B2318] dark:text-[#faf5f0] group-hover:text-primary transition-colors"
              : isFrosted
              ? "text-foreground group-hover:text-primary transition-colors"
              : isSecondary
              ? "text-[#3B2318]"
              : "text-white"
          )}
        >
          {content}
        </span>
      </>
    );

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<any>;
      const childProps = child.props || {};

      const assignRef = (node: any) => {
        if (typeof ref === "function") {
          ref(node);
        } else if (ref && "current" in ref) {
          (ref as React.MutableRefObject<any>).current = node;
        }
        const childRef = (child as any).ref;
        if (typeof childRef === "function") {
          childRef(node);
        } else if (childRef && "current" in childRef) {
          childRef.current = node;
        }
      };

      return React.cloneElement(child, {
        ...props,
        ...childProps,
        ref: assignRef,
        "data-slot": "button",
        className: cn(
          liquidbuttonVariants({ variant, size, className }),
          "group relative overflow-hidden",
          childProps.className
        ),
        onClick: (e: React.MouseEvent) => {
          childProps.onClick?.(e);
          (props as any).onClick?.(e);
        },
        children: renderInnerContent(childProps.children),
      });
    }

    return (
      <button
        ref={ref}
        data-slot="button"
        className={cn(
          liquidbuttonVariants({ variant, size, className }),
          "group relative overflow-hidden"
        )}
        {...props}
      >
        {renderInnerContent(children)}
      </button>
    );
  }
);
LiquidButton.displayName = "LiquidButton";

type ColorVariant =
  | "default"
  | "primary"
  | "success"
  | "error"
  | "gold"
  | "bronze";

export interface MetalButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ColorVariant;
  preset?: BorderBeamPreset;
  hasBeam?: boolean;
  duration?: number;
}

const colorVariants: Record<
  ColorVariant,
  {
    outer: string;
    inner: string;
    button: string;
    textColor: string;
    textShadow: string;
  }
> = {
  default: {
    outer: "bg-gradient-to-b from-[#888888] via-[#222222] to-[#aaaaaa]",
    inner: "bg-gradient-to-b from-[#ffffff] via-[#2a2a2a] to-[#cccccc]",
    button: "bg-gradient-to-b from-[#242830] to-[#11141a] hover:from-[#2e3440] hover:to-[#181c24]",
    textColor: "text-white font-semibold",
    textShadow: "[text-shadow:_0_-1px_1px_rgba(0,0,0,0.9)]",
  },
  primary: {
    outer: "bg-gradient-to-b from-[#f43f5e] via-[#e85d75] to-[#c7415a]",
    inner: "bg-gradient-to-b from-[#fda4af] via-[#881337] to-[#fecdd3]",
    button: "bg-gradient-to-b from-[#e85d75] to-[#9f1239] hover:from-[#f43f5e] hover:to-[#be123c]",
    textColor: "text-white font-bold",
    textShadow: "[text-shadow:_0_-1px_1px_rgba(159,18,57,0.9),0_1px_2px_rgba(0,0,0,0.6)]",
  },
  success: {
    outer: "bg-gradient-to-b from-[#34d399] via-[#059669] to-[#10b981]",
    inner: "bg-gradient-to-b from-[#a7f3d0] via-[#064e3b] to-[#6ee7b7]",
    button: "bg-gradient-to-b from-[#059669] to-[#047857] hover:from-[#047857] hover:to-[#065f46]",
    textColor: "text-white font-bold",
    textShadow: "[text-shadow:_0_-1px_1px_rgba(6,78,59,0.9)]",
  },
  error: {
    outer: "bg-gradient-to-b from-[#f87171] via-[#dc2626] to-[#ef4444]",
    inner: "bg-gradient-to-b from-[#fecaca] via-[#7f1d1d] to-[#fca5a5]",
    button: "bg-gradient-to-b from-[#dc2626] to-[#991b1b] hover:from-[#b91c1c] hover:to-[#7f1d1d]",
    textColor: "text-white font-bold",
    textShadow: "[text-shadow:_0_-1px_1px_rgba(127,29,29,0.9)]",
  },
  gold: {
    outer: "bg-gradient-to-b from-[#fbbf24] via-[#b45309] to-[#f59e0b]",
    inner: "bg-gradient-to-b from-[#fef3c7] via-[#78350f] to-[#fde68a]",
    button: "bg-gradient-to-b from-[#d97706] to-[#92400e] hover:from-[#b45309] hover:to-[#78350f]",
    textColor: "text-[#FFFDE5] font-bold",
    textShadow: "[text-shadow:_0_-1px_1px_rgba(120,53,15,0.9)]",
  },
  bronze: {
    outer: "bg-gradient-to-b from-[#fb923c] via-[#9a3412] to-[#ea580c]",
    inner: "bg-gradient-to-b from-[#ffedd5] via-[#7c2d12] to-[#fed7aa]",
    button: "bg-gradient-to-b from-[#c2410c] to-[#7c2d12] hover:from-[#9a3412] hover:to-[#6c2810]",
    textColor: "text-[#FFF7F0] font-bold",
    textShadow: "[text-shadow:_0_-1px_1px_rgba(124,45,18,0.9)]",
  },
};

const metalButtonVariants = (
  variant: ColorVariant = "default",
  isPressed: boolean,
  isHovered: boolean,
  isTouchDevice: boolean
) => {
  const colors = colorVariants[variant];
  const transitionStyle = "all 250ms cubic-bezier(0.1, 0.4, 0.2, 1)";

  return {
    wrapper: cn(
      "relative inline-flex transform-gpu rounded-full p-[1.5px] will-change-transform shadow-lg shadow-black/40",
      colors.outer
    ),
    wrapperStyle: {
      transform: isPressed
        ? "translateY(2.5px) scale(0.98)"
        : "translateY(0) scale(1)",
      boxShadow: isPressed
        ? "0 2px 4px rgba(0, 0, 0, 0.3)"
        : isHovered && !isTouchDevice
        ? "0 8px 24px rgba(232, 93, 117, 0.35), 0 2px 6px rgba(0, 0, 0, 0.4)"
        : "0 4px 14px rgba(0, 0, 0, 0.3)",
      transition: transitionStyle,
      transformOrigin: "center center",
    },
    inner: cn(
      "absolute inset-[1px] transform-gpu rounded-full will-change-transform",
      colors.inner
    ),
    innerStyle: {
      transition: transitionStyle,
      transformOrigin: "center center",
      filter:
        isHovered && !isPressed && !isTouchDevice ? "brightness(1.15)" : "none",
    },
    button: cn(
      "relative z-10 m-[1px] inline-flex h-12 min-h-[48px] transform-gpu cursor-pointer items-center justify-center overflow-hidden rounded-full px-7 py-3 text-sm sm:text-base leading-none font-bold will-change-transform outline-none transition-all",
      colors.button,
      colors.textColor,
      colors.textShadow
    ),
    buttonStyle: {
      transform: isPressed ? "scale(0.97)" : "scale(1)",
      transition: transitionStyle,
      transformOrigin: "center center",
      filter:
        isHovered && !isPressed && !isTouchDevice ? "brightness(1.08)" : "none",
    },
  };
};

const ShineEffect = ({ isPressed }: { isPressed: boolean }) => {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-20 overflow-hidden transition-opacity duration-300",
        isPressed ? "opacity-30" : "opacity-0"
      )}
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/40 to-transparent" />
    </div>
  );
};

const MetalButton = React.forwardRef<
  HTMLButtonElement,
  MetalButtonProps
>(({ children, className, variant = "default", preset, hasBeam = true, duration = 4, ...props }, ref) => {
  const [isPressed, setIsPressed] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const [isTouchDevice, setIsTouchDevice] = React.useState(false);

  React.useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  const buttonText = children || "Button";
  const variants = metalButtonVariants(
    variant,
    isPressed,
    isHovered,
    isTouchDevice
  );

  const beamPreset: BorderBeamPreset =
    preset ||
    (variant === "gold" || variant === "bronze"
      ? "gold"
      : variant === "primary"
      ? "berry"
      : "silver");

  const handleInternalMouseDown = () => setIsPressed(true);
  const handleInternalMouseUp = () => setIsPressed(false);
  const handleInternalMouseLeave = () => {
    setIsPressed(false);
    setIsHovered(false);
  };
  const handleInternalMouseEnter = () => {
    if (!isTouchDevice) setIsHovered(true);
  };
  const handleInternalTouchStart = () => setIsPressed(true);
  const handleInternalTouchEnd = () => setIsPressed(false);
  const handleInternalTouchCancel = () => setIsPressed(false);

  return (
    <div
      className={cn(variants.wrapper, "overflow-hidden relative inline-flex select-none group")}
      style={variants.wrapperStyle}
    >
      {/* 1. Feixe rotativo estritamente na borda via BorderBeam mascarado */}
      {hasBeam && (
        <BorderBeam
          preset={beamPreset}
          duration={duration}
          borderWidth={1.5}
          className="z-20"
        />
      )}

      {/* 2. Bisel metálico interno */}
      <div className={variants.inner} style={variants.innerStyle}></div>

      {/* 3. Botão sólido metálico com miolo 100% opaco */}
      <button
        ref={ref}
        className={cn(variants.button, className)}
        style={variants.buttonStyle}
        {...props}
        onMouseDown={handleInternalMouseDown}
        onMouseUp={handleInternalMouseUp}
        onMouseLeave={handleInternalMouseLeave}
        onMouseEnter={handleInternalMouseEnter}
        onTouchStart={handleInternalTouchStart}
        onTouchEnd={handleInternalTouchEnd}
        onTouchCancel={handleInternalTouchCancel}
      >
        <ShineEffect isPressed={isPressed} />
        <span className="relative z-10 flex items-center justify-center gap-2 font-bold">
          {buttonText}
        </span>
        {isHovered && !isPressed && !isTouchDevice && (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t rounded-full from-transparent via-white/10 to-white/20" />
        )}
      </button>
    </div>
  );
});

MetalButton.displayName = "MetalButton";

export { Button, buttonVariants, liquidbuttonVariants, LiquidButton, BorderBeam, MetalButton };
