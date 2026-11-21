"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

import {
  AuthAlert,
  AuthDivider,
  AuthField,
  AuthShell,
  authControlClass,
  authLinkClass,
  authPrimaryButtonClass,
} from "@/components/auth/auth-shell";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import { authClient } from "@/lib/auth-client";

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [callbackUrl, setCallbackUrl] = useState("/");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const target =
        searchParams.get("callbackUrl") || searchParams.get("redirectTo");
      if (target) {
        setCallbackUrl(target);
      }
    }
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    setError(null);
    setPending(true);

    try {
      const { error: signInError } = await authClient.signIn.email({
        email: email.trim(),
        password,
        rememberMe: true,
      });

      if (signInError) {
        setError(signInError.message || "Invalid email or password.");
        return;
      }

      router.replace(callbackUrl);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Welcome Back"
      title="Sign In to Equiply"
      subtitle="Access your rentals, equipment, and dashboard."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link
            href={
              callbackUrl !== "/"
                ? `/sign-up?callbackUrl=${encodeURIComponent(callbackUrl)}`
                : "/sign-up"
            }
            className={authLinkClass}
          >
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <AuthAlert>{error}</AuthAlert>}

        <AuthField htmlFor="email" label="Email address">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className={authControlClass}
          />
        </AuthField>

        <AuthField htmlFor="password" label="Password">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            className={authControlClass}
          />
        </AuthField>

        <button
          type="submit"
          disabled={pending}
          className={authPrimaryButtonClass}
        >
          {pending ? "Signing in..." : "Sign In"}
        </button>

        <AuthDivider />

        <GoogleAuthButton callbackURL={callbackUrl} onError={setError} />
      </form>
    </AuthShell>
  );
}
