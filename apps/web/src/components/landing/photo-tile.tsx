import { CircleAlert } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function PhotoTile({
  className,
  label,
  state,
}: {
  className?: string;
  label?: string;
  state?: "pick" | "blur";
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border border-hairline-strong bg-surface-card",
        className,
      )}
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--hairline)_0%,var(--canvas)_42%,var(--surface-strong)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_24%,rgba(255,255,255,0.92),transparent_22%),radial-gradient(circle_at_30%_78%,rgba(23,23,23,0.12),transparent_30%)]" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent" />
      {state === "pick" ? (
        <Badge className="absolute left-3 top-3 h-auto rounded-full border-transparent bg-primary px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.88px] text-on-primary">
          AI Pick
        </Badge>
      ) : null}
      {state === "blur" ? (
        <Badge className="absolute left-3 top-3 h-auto rounded-full border-transparent bg-surface-card px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.88px] text-semantic-error">
          <CircleAlert className="size-3" />
          Blur
        </Badge>
      ) : null}
      {label ? (
        <Badge className="absolute bottom-3 left-3 h-auto rounded-full border-transparent bg-surface-card/95 px-2.5 py-1 font-mono text-[11px] font-normal uppercase tracking-[0.88px] text-ink">
          {label}
        </Badge>
      ) : null}
    </div>
  );
}
