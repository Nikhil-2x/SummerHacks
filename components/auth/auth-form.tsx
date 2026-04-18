"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AuthMode = "login" | "signup";

type AuthFormProps = {
  mode: AuthMode;
};

export default function AuthForm({ mode }: AuthFormProps) {
  const isLogin = mode === "login";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const copy = useMemo(
    () =>
      isLogin
        ? {
            title: "Welcome back",
            description:
              "Sign in with your email and password to continue to LabLens.",
            submitLabel: "Sign in",
            prompt: "Don\'t have an account?",
            promptLinkLabel: "Create account",
            promptLinkHref: "/signup",
          }
        : {
            title: "Create your account",
            description:
              "Use email and password to get started with your personalized dashboard.",
            submitLabel: "Create account",
            prompt: "Already have an account?",
            promptLinkLabel: "Sign in",
            promptLinkHref: "/login",
          },
    [isLogin],
  );

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      if (isLogin) {
        const response = await authClient.signIn.email({
          email,
          password,
          callbackURL: "/",
        });

        if (response.error) {
          setErrorMessage(response.error.message || "Unable to sign in.");
        }
      } else {
        const response = await authClient.signUp.email({
          name: name.trim() || email.split("@")[0],
          email,
          password,
          callbackURL: "/",
        });

        if (response.error) {
          setErrorMessage(
            response.error.message || "Unable to create account.",
          );
        }
      }
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative z-10 w-full max-w-md">
      <Card className="border-border/70 bg-card/90 shadow-xl backdrop-blur supports-backdrop-filter:bg-card/75">
        <CardHeader className="space-y-3">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wide text-primary">
            <ShieldCheck className="h-3.5 w-3.5" />
            Secure authentication
          </div>
          <CardTitle className="text-2xl font-serif tracking-tight">
            {copy.title}
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            {copy.description}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={onSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete={isLogin ? "current-password" : "new-password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 8 characters"
                minLength={8}
                required
              />
            </div>

            {errorMessage ? (
              <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {errorMessage}
              </p>
            ) : null}

            <Button
              type="submit"
              className="h-10 w-full text-sm font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                <>
                  {copy.submitLabel}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {copy.prompt}{" "}
            <Link
              href={copy.promptLinkHref}
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              {copy.promptLinkLabel}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
