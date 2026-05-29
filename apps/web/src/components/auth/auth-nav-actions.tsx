"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, Loader2, LogOut, UserRound } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

type AuthMode = "sign-in" | "sign-up";

const authCopy = {
  "sign-in": {
    title: "Welcome back",
    description: "Sign in to continue managing your photo review batches.",
    submit: "Sign in",
    switchLabel: "Create an account",
  },
  "sign-up": {
    title: "Create your account",
    description: "Start with email and password. Team and provider auth can come later.",
    submit: "Create account",
    switchLabel: "I already have an account",
  },
} satisfies Record<
  AuthMode,
  {
    title: string;
    description: string;
    submit: string;
    switchLabel: string;
  }
>;

export function AuthNavActions() {
  const { data: session, refetch } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const copy = authCopy[mode];
  const userLabel = session?.user.name || session?.user.email;

  function openAuth(nextMode: AuthMode) {
    setMode(nextMode);
    setOpen(true);
    setError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result =
      mode === "sign-in"
        ? await authClient.signIn.email({ email, password })
        : await authClient.signUp.email({ email, password, name });

    setIsSubmitting(false);

    if (result.error) {
      setError(result.error.message || "Authentication failed. Please try again.");
      return;
    }

    setOpen(false);
    setPassword("");
    await refetch();
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[calc(100%-2rem)] gap-6 rounded-[1.5rem] border border-hairline bg-canvas p-6 shadow-2xl sm:max-w-md">
          <DialogHeader className="gap-3">
            <DialogTitle className="text-2xl font-semibold leading-tight text-ink">
              {copy.title}
            </DialogTitle>
            <DialogDescription className="text-sm leading-6 text-body">
              {copy.description}
            </DialogDescription>
          </DialogHeader>

          <form className="grid gap-4" onSubmit={handleSubmit}>
            {mode === "sign-up" ? (
              <label className="grid gap-2 text-sm font-medium text-ink">
                Name
                <input
                  className="h-12 rounded-xl border border-hairline bg-surface-card px-4 text-sm text-ink outline-none transition focus:border-ink focus:ring-4 focus:ring-action-blue/10"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                  required
                />
              </label>
            ) : null}

            <label className="grid gap-2 text-sm font-medium text-ink">
              Email
              <input
                className="h-12 rounded-xl border border-hairline bg-surface-card px-4 text-sm text-ink outline-none transition focus:border-ink focus:ring-4 focus:ring-action-blue/10"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </label>

            <label className="grid gap-2 text-sm font-medium text-ink">
              Password
              <input
                className="h-12 rounded-xl border border-hairline bg-surface-card px-4 text-sm text-ink outline-none transition focus:border-ink focus:ring-4 focus:ring-action-blue/10"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 8 characters"
                autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
                minLength={8}
                required
              />
            </label>

            {error ? (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            <Button className="h-12 rounded-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : null}
              {copy.submit}
            </Button>
          </form>

          <button
            className="text-sm font-medium text-body transition-colors hover:text-action-blue"
            onClick={() => {
              setMode(mode === "sign-in" ? "sign-up" : "sign-in");
              setError(null);
            }}
            type="button"
          >
            {copy.switchLabel}
          </button>
        </DialogContent>
      </Dialog>
    </>
  );
}
