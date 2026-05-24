import type * as React from "react";
import { type VariantProps } from "class-variance-authority";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ButtonLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof buttonVariants>;

export function ButtonLink({
  children,
  className,
  href = "#",
  variant,
  ...props
}: ButtonLinkProps) {
  return (
    <a
      href={href}
      className={cn(buttonVariants({ variant }), className)}
      {...props}
    >
      {children}
    </a>
  );
}
