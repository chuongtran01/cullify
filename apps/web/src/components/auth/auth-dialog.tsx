"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
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

export type AuthMode = "sign-in" | "sign-up";

type AuthDialogCopy = {
  title: string;
  description: string;
  submit: string;
  switchLabel: string;
};

const defaultAuthCopy = {
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
} satisfies Record<AuthMode, AuthDialogCopy>;

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

function authFieldId(mode: AuthMode, field: string) {
  return `${mode}-${field}`;
}

type AuthDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialMode?: AuthMode;
  copy?: Partial<Record<AuthMode, Partial<AuthDialogCopy>>>;
  onAuthenticated?: () => void | Promise<void>;
};

export function AuthDialog({
  open,
  onOpenChange,
  initialMode = "sign-in",
  copy,
  onAuthenticated,
}: AuthDialogProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const activeCopy = {
    ...defaultAuthCopy[mode],
    ...copy?.[mode],
  };

  async function completeAuth() {
    onOpenChange(false);
    signInForm.reset();
    signUpForm.reset();
    await onAuthenticated?.();
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

    await completeAuth();
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

    await completeAuth();
  }

  function switchMode() {
    const nextMode = mode === "sign-in" ? "sign-up" : "sign-in";
    setMode(nextMode);
    setError(null);
    signInForm.reset();
    signUpForm.reset();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-2rem)] gap-6 rounded-[1.5rem] border border-hairline bg-canvas p-6 shadow-2xl sm:max-w-md">
        <DialogHeader className="gap-3">
          <DialogTitle className="text-2xl font-semibold leading-tight text-ink">
            {activeCopy.title}
          </DialogTitle>
          <DialogDescription className="text-sm leading-6 text-body">
            {activeCopy.description}
          </DialogDescription>
        </DialogHeader>

        {mode === "sign-in" ? (
          <form
            key="sign-in"
            className="grid gap-4"
            onSubmit={signInForm.handleSubmit(handleSignIn)}
          >
            <Controller
              name="email"
              control={signInForm.control}
              render={({ field, fieldState }) => {
                const inputId = authFieldId("sign-in", "email");
                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={inputId}>Email</FieldLabel>
                    <Input
                      {...field}
                      id={inputId}
                      type="email"
                      aria-invalid={fieldState.invalid}
                      placeholder="you@example.com"
                      autoComplete="username"
                    />
                    {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                  </Field>
                );
              }}
            />

            <Controller
              name="password"
              control={signInForm.control}
              render={({ field, fieldState }) => {
                const inputId = authFieldId("sign-in", "password");
                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={inputId}>Password</FieldLabel>
                    <Input
                      {...field}
                      id={inputId}
                      type="password"
                      aria-invalid={fieldState.invalid}
                      placeholder="Password"
                      autoComplete="current-password"
                    />
                    {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                  </Field>
                );
              }}
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
              {activeCopy.submit}
            </Button>
          </form>
        ) : (
          <form
            key="sign-up"
            className="grid gap-4"
            onSubmit={signUpForm.handleSubmit(handleSignUp)}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                name="firstName"
                control={signUpForm.control}
                render={({ field, fieldState }) => {
                  const inputId = authFieldId("sign-up", "firstName");
                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={inputId}>First name</FieldLabel>
                      <Input
                        {...field}
                        id={inputId}
                        aria-invalid={fieldState.invalid}
                        placeholder="First"
                        autoComplete="given-name"
                      />
                      {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                    </Field>
                  );
                }}
              />

              <Controller
                name="lastName"
                control={signUpForm.control}
                render={({ field, fieldState }) => {
                  const inputId = authFieldId("sign-up", "lastName");
                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={inputId}>Last name</FieldLabel>
                      <Input
                        {...field}
                        id={inputId}
                        aria-invalid={fieldState.invalid}
                        placeholder="Last"
                        autoComplete="family-name"
                      />
                      {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                    </Field>
                  );
                }}
              />
            </div>

            <Controller
              name="email"
              control={signUpForm.control}
              render={({ field, fieldState }) => {
                const inputId = authFieldId("sign-up", "email");
                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={inputId}>Email</FieldLabel>
                    <Input
                      {...field}
                      id={inputId}
                      type="email"
                      aria-invalid={fieldState.invalid}
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                    {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                  </Field>
                );
              }}
            />

            <Controller
              name="password"
              control={signUpForm.control}
              render={({ field, fieldState }) => {
                const inputId = authFieldId("sign-up", "password");
                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={inputId}>Password</FieldLabel>
                    <Input
                      {...field}
                      id={inputId}
                      type="password"
                      aria-invalid={fieldState.invalid}
                      placeholder="8+ characters"
                      autoComplete="new-password"
                    />
                    <FieldDescription>Uppercase, lowercase, number, symbol.</FieldDescription>
                    {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                  </Field>
                );
              }}
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
              {activeCopy.submit}
            </Button>
          </form>
        )}

        <button
          className="text-sm font-medium text-body transition-colors hover:text-action-blue"
          onClick={switchMode}
          type="button"
        >
          {activeCopy.switchLabel}
        </button>
      </DialogContent>
    </Dialog>
  );
}
