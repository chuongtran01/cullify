"use client";

import { useState } from "react";
import { ArrowRight, LayoutDashboard, Loader2, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { AuthDialog, type AuthMode } from "@/components/auth/auth-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

function getInitials(user: { name?: string | null; email?: string | null }) {
  const label = user.name || user.email || "User";
  const words = label
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2);

  return words.map((word) => word[0]?.toUpperCase()).join("") || "U";
}

export function AuthNavActions() {
  const router = useRouter();
  const { data: session, refetch } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [isSigningOut, setIsSigningOut] = useState(false);

  function openAuth(nextMode: AuthMode) {
    setMode(nextMode);
    setOpen(true);
  }

  async function handleSignOut() {
    setIsSigningOut(true);
    await authClient.signOut();
    setIsSigningOut(false);
    await refetch();
    router.push("/");
    router.refresh();
  }

  if (session?.user) {
    const userLabel = session.user.name || session.user.email || "Account";
    const userDetail =
      session.user.email && session.user.email !== userLabel
        ? session.user.email
        : "Signed in";

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar
            className="cursor-pointer rounded-full transition-colors hover:bg-surface-stone"
            aria-label="Open account menu"
          >
            <AvatarFallback className="bg-surface-stone text-xs font-semibold text-ink transition-colors hover:bg-surface-strong">
              {getInitials(session.user)}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-56">
          <DropdownMenuLabel className="font-normal">
            <span className="block truncate text-sm font-medium text-ink">
              {userLabel}
            </span>
            <span className="block truncate text-xs text-muted-foreground">
              {userDetail}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/dashboard">
              <LayoutDashboard aria-hidden="true" />
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onSelect={(event) => {
              event.preventDefault();
              void handleSignOut();
            }}
            disabled={isSigningOut}
          >
            {isSigningOut ? (
              <Loader2 className="animate-spin" aria-hidden="true" />
            ) : (
              <LogOut aria-hidden="true" />
            )}
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <button
          className={cn(
            buttonVariants({ variant: "link" }),
            "h-10 px-0 text-sm font-medium text-ink no-underline hover:text-text-link hover:no-underline",
          )}
          onClick={() => openAuth("sign-in")}
          type="button"
        >
          Sign In
        </button>
        <Button
          className="h-10 gap-2 rounded-md px-4.5 text-sm font-medium"
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
        redirectTo="/dashboard"
      />
    </>
  );
}
