import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex h-10 items-center justify-center gap-2 rounded-[8px] px-[18px] text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "border border-primary bg-primary text-on-primary hover:bg-primary-active",
        secondary:
          "border border-hairline-strong bg-surface-card text-ink hover:bg-canvas-soft",
        ink: "border border-ink bg-ink text-canvas hover:bg-[#343229]",
        text: "px-0 text-ink hover:text-primary",
        ghost: "border border-hairline bg-surface-card text-ink hover:bg-canvas-soft",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({
  className,
  variant,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant }), className)}
      {...props}
    />
  );
}
