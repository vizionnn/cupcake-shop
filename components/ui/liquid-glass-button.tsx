"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { BorderBeamPreset, PRESET_GRADIENTS, BorderBeam } from "./border-beam";

const buttonVariants = cva(
  "inline-flex items-center cursor-pointer justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]",
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

const liquidbuttonVariants = cva(
  "inline-flex items-center transition-all justify-center cursor-pointer gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-[color,box-shadow,transform] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 active:scale-[0.97]",
  {
    variants: {
      variant: {
        default:
          "bg-transparent text-slate-100 hover:text-white",
        dark:
          "bg-transparent text-slate-100 hover:text-white",
        light:
          "bg-transparent text-slate-800 hover:text-slate-950 focus-visible:ring-primary/40",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2.5 has-[>svg]:px-3 min-h-[44px]",
        sm: "h-9 text-xs gap-1.5 px-4 has-[>svg]:px-4 min-h-[36px]",
        lg: "h-12 rounded-full px-6 has-[>svg]:px-4 min-h-[48px] text-base",
        xl: "h-13 rounded-full px-8 has-[>svg]:px-6 min-h-[52px] text-base",
        xxl: "h-14 rounded-full px-10 has-[>svg]:px-8 min-h-[56px] text-lg",
        icon: "size-11 min-h-[44px] min-w-[44px]",
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
}

function LiquidButton({
  className,
  variant = "default",
  size,
  asChild = false,
  children,
  preset = "berry",
  hasBeam = true,
  duration = 4,
  tone,
  ...props
}: LiquidButtonProps) {
  const Comp = asChild ? Slot : "button";
  const isLight = variant === "light" || tone === "light";

  return (
    <Comp
      data-slot="button"
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden rounded-full transition-all group cursor-pointer select-none",
        liquidbuttonVariants({ variant, size, className })
      )}
      {...props}
    >
      {/* 1. Feixe rotativo estritamente na borda via BorderBeam mascarado */}
      {hasBeam && (
        <BorderBeam
          preset={preset}
          duration={duration}
          borderWidth={1.5}
          className="z-20"
        />
      )}

      {/* 2. Miolo com acabamento adaptado:
          - isLight: acabamento claro para superfícies claras (fundo branco/creme, texto cacau escuro)
          - default / dark: acabamento vidro líquido translúcido para temas escuros
      */}
      <div
        className={cn(
          "absolute inset-[1.5px] z-0 rounded-full transition-all duration-300",
          isLight
            ? "bg-white/95 text-slate-800 border border-slate-200/90 shadow-[0_2px_6px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.95)] group-hover:bg-slate-50"
            : "bg-slate-900/90 text-slate-100 border border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.4)] group-hover:bg-slate-800/90"
        )}
      />

      {/* 3. Conteúdo com contraste e feedback tátil */}
      <div
        className={cn(
          "relative z-30 flex items-center justify-center gap-2 font-semibold",
          isLight ? "text-slate-800 group-hover:text-slate-950" : "text-slate-100 group-hover:text-white"
        )}
      >
        {children}
      </div>
    </Comp>
  );
}

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
