import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

export function Accordion({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn("divide-y divide-hairline", className)} {...props} />;
}

export function AccordionItem({
  className,
  ...props
}: React.ComponentProps<"details">) {
  return <details className={cn("group p-5", className)} {...props} />;
}

export function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<"summary">) {
  return (
    <summary
      className={cn(
        "flex cursor-pointer list-none items-center justify-between gap-4 text-left text-[18px] font-semibold text-ink",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDown className="size-5 shrink-0 transition-transform group-open:rotate-180" />
    </summary>
  );
}

export function AccordionContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mt-4 max-w-2xl text-sm leading-6 text-body", className)}
      {...props}
    />
  );
}
