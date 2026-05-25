import { Sparkles } from "lucide-react";

export function Logo() {
  return (
    <a href="#" className="flex items-center gap-2 text-ink">
      <span className="grid size-8 place-items-center rounded-lg border border-hairline-strong bg-surface-card">
        <Sparkles className="size-4 text-primary" />
      </span>
      <span className="text-lg font-semibold">Cullify</span>
    </a>
  );
}
