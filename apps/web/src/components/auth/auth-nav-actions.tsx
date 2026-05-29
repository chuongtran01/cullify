"use client";

import { useState } from "react";
import { ArrowRight, Loader2, LogOut, UserRound } from "lucide-react";

import { AuthDialog, type AuthMode } from "@/components/auth/auth-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export function AuthNavActions() {
  const { data: session, refetch } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [isSigningOut, setIsSigningOut] = useState(false);

  const userLabel = session?.user.name || session?.user.email;

  function openAuth(nextMode: AuthMode) {
    setMode(nextMode);
    setOpen(true);
  }

  async function handleSignOut() {
    setIsSigningOut(true);
    await authClient.signOut();
    setIsSigningOut(false);
    await refetch();
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-3">
        <div className="hidden max-w-40 items-center gap-2 rounded-full border border-hairline bg-surface-card px-3 py-2 text-sm text-body lg:flex">
          <UserRound className="size-4 text-muted" aria-hidden="true" />
          <span className="truncate">{userLabel}</span>
        </div>
        <Button
          variant="outline"
          className="h-10 rounded-full px-4"
          onClick={handleSignOut}
          disabled={isSigningOut}
        >
          {isSigningOut ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <LogOut className="size-4" aria-hidden="true" />
          )}
          Sign out
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <button
          className={cn(
            buttonVariants({ variant: "link" }),
            "h-10 px-0 text-ink no-underline hover:text-action-blue hover:no-underline",
          )}
          onClick={() => openAuth("sign-in")}
          type="button"
        >
          Sign In
        </button>
        <Button
          className="h-11 rounded-full px-5"
          onClick={() => openAuth("sign-up")}
        >
          Get Started
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
      </div>

      <AuthDialog
        key={`${open}-${mode}`}
        open={open}
        onOpenChange={setOpen}
        initialMode={mode}
        onAuthenticated={refetch}
      />
    </>
  );
}
