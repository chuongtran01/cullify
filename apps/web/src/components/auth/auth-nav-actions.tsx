"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2, LogOut, UserRound } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
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

const signInSchema = z.object({
  email: z.string().email("Enter a valid email."),
  password: z.string().min(1, "Required."),
});

const strongPassword = z
  .string()
  .min(8, "Use 8+ characters.")
  .regex(/[A-Z]/, "Add uppercase.")
  .regex(/[a-z]/, "Add lowercase.")
  .regex(/[0-9]/, "Add a number.")
  .regex(/[^A-Za-z0-9]/, "Add a symbol.");

const signUpSchema = z.object({
  firstName: z.string().trim().min(1, "Required."),
  lastName: z.string().trim().min(1, "Required."),
  email: z.string().email("Enter a valid email."),
  password: strongPassword,
});

type SignInValues = z.infer<typeof signInSchema>;
type SignUpValues = z.infer<typeof signUpSchema>;

export function AuthNavActions() {
  const { data: session, refetch } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const signInForm = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signUpForm = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const copy = authCopy[mode];
  const userLabel = session?.user.name || session?.user.email;

  function openAuth(nextMode: AuthMode) {
    setMode(nextMode);
    setOpen(true);
    setError(null);
  }

  async function handleSignIn(values: SignInValues) {
    setError(null);
    setIsSubmitting(true);

    const result = await authClient.signIn.email({
      email: values.email,
      password: values.password,
    });

    setIsSubmitting(false);

    if (result.error) {
      setError(result.error.message || "Authentication failed. Please try again.");
      return;
    }

    setOpen(false);
    signInForm.reset();
    await refetch();
  }

  async function handleSignUp(values: SignUpValues) {
    setError(null);
    setIsSubmitting(true);

    const result = await authClient.signUp.email({
      email: values.email,
      password: values.password,
      name: `${values.firstName.trim()} ${values.lastName.trim()}`,
    });

    setIsSubmitting(false);

    if (result.error) {
      setError(result.error.message || "Authentication failed. Please try again.");
      return;
    }

    setOpen(false);
    signUpForm.reset();
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

          {mode === "sign-in" ? (
            <form className="grid gap-4" onSubmit={signInForm.handleSubmit(handleSignIn)}>
              <Controller
                name="email"
                control={signInForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="email"
                      aria-invalid={fieldState.invalid}
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                    {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                  </Field>
                )}
              />

              <Controller
                name="password"
                control={signInForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="password"
                      aria-invalid={fieldState.invalid}
                      placeholder="Password"
                      autoComplete="current-password"
                    />
                    {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                  </Field>
                )}
              />

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
          ) : (
            <form className="grid gap-4" onSubmit={signUpForm.handleSubmit(handleSignUp)}>
              <div className="grid gap-4 sm:grid-cols-2">
                <Controller
                  name="firstName"
                  control={signUpForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>First name</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="First"
                        autoComplete="given-name"
                      />
                      {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                    </Field>
                  )}
                />

                <Controller
                  name="lastName"
                  control={signUpForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Last name</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="Last"
                        autoComplete="family-name"
                      />
                      {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                    </Field>
                  )}
                />
              </div>

              <Controller
                name="email"
                control={signUpForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="email"
                      aria-invalid={fieldState.invalid}
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                    {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                  </Field>
                )}
              />

              <Controller
                name="password"
                control={signUpForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="password"
                      aria-invalid={fieldState.invalid}
                      placeholder="8+ characters"
                      autoComplete="new-password"
                    />
                    <FieldDescription>Uppercase, lowercase, number, symbol.</FieldDescription>
                    {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                  </Field>
                )}
              />

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
          )}

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
