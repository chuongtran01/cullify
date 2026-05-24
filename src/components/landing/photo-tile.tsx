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
        "relative overflow-hidden rounded-xl border border-hairline bg-surface-card",
        className,
      )}
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#e7d5c9,#f7f7f4_38%,#b7c5aa_70%,#736f65)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_24%,rgba(255,255,255,0.85),transparent_22%),radial-gradient(circle_at_28%_76%,rgba(38,37,30,0.2),transparent_28%)]" />
      {state === "pick" ? (
        <Badge className="absolute left-3 top-3 font-semibold uppercase">
          AI Pick
        </Badge>
      ) : null}
      {state === "blur" ? (
        <Badge
          variant="outline"
          className="absolute left-3 top-3 border-hairline bg-surface-card font-semibold uppercase text-semantic-error"
        >
          <CircleAlert />
          Blur
        </Badge>
      ) : null}
      {label ? (
        <Badge
          variant="secondary"
          className="absolute bottom-3 left-3 bg-white/85 font-mono font-normal text-ink"
        >
          {label}
        </Badge>
      ) : null}
    </div>
  );
}
