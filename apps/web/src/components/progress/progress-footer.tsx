import { Clock3 } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ProgressFooter() {
  return (
    <footer className="flex flex-col gap-3 rounded-lg border border-hairline bg-canvas-soft px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3 text-sm text-body">
        <Clock3 className="size-4 text-primary" />
        <span>
          You can leave this page. Processing will continue in the background.
        </span>
      </div>
      <Button disabled className="w-full sm:w-auto">
        Review Results
      </Button>
    </footer>
  );
}
