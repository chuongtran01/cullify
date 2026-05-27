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
        "relative overflow-hidden rounded-[22px] border border-white/20 bg-surface-card",
        className,
      )}
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#d9d9dd,#ffffff_34%,#edfce9_57%,#003c33)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_24%,rgba(255,255,255,0.9),transparent_20%),radial-gradient(circle_at_30%_78%,rgba(23,23,28,0.24),transparent_28%)]" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent" />
      {state === "pick" ? (
        <Badge className="absolute left-3 top-3 font-semibold uppercase">
          AI Pick
        </Badge>
      ) : null}
      {state === "blur" ? (
        <Badge
          variant="outline"
          className="absolute left-3 top-3 border-coral-soft bg-white/90 font-mono font-normal uppercase text-semantic-error"
        >
          <CircleAlert />
          Blur
        </Badge>
      ) : null}
      {label ? (
        <Badge
          variant="secondary"
          className="absolute bottom-3 left-3 bg-white/90 font-mono font-normal text-ink"
        >
          {label}
        </Badge>
      ) : null}
    </div>
  );
}
