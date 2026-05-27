import { Clock3 } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ProgressFooter() {
  return (
    <footer className="flex flex-col gap-3 rounded-[16px] border border-hairline bg-canvas px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3 text-sm text-body">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-surface-stone text-primary">
          <Clock3 className="size-4" />
        </span>
        <span>
          You can leave this page. Processing will continue in the background.
        </span>
      </div>
      <Button disabled className="h-11 w-full rounded-full px-5 sm:w-auto">
        Review Results
      </Button>
    </footer>
  );
}
