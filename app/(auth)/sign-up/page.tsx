
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import {
  AuthAlert,
  AuthField,
  AuthShell,
  authControlClass,
  authLinkClass,
  authPrimaryButtonClass,
} from "@/components/auth/auth-shell";

import { authClient } from "@/lib/auth-client";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (pending) return;

    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one uppercase letter.");
      return;
    }

    if (!/[a-z]/.test(password)) {
      setError("Password must contain at least one lowercase letter.");
      return;
    }

    setPending(true);

    try {
      const { error: signUpError } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        image: photo.trim() || undefined,
      });

      if (signUpError) {
        setError(
          signUpError.message ||
            "Unable to create your account. Please try again."
        );
        return;
      }

      router.replace("/");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Join Equiply"
      title="Create Your Account"
      subtitle="Find the equipment you need or list your own fleet."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/sign-in" className={authLinkClass}>
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {error && <AuthAlert>{error}</AuthAlert>}

        <AuthField htmlFor="name" label="Full name">
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your full name"
            className={authControlClass}
          />
        </AuthField>

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

        <AuthField htmlFor="photo" label="Profile photo">
          <input
            id="photo"
            name="photo"
            type="url"
            inputMode="url"
            value={photo}
            onChange={(event) => setPhoto(event.target.value)}
            placeholder="https://example.com/photo.jpg"
            className={authControlClass}
          />
        </AuthField>

        <AuthField
          htmlFor="password"
          label="Password"
          hint="At least 6 characters, including uppercase and lowercase letters."
        >
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Create a password"
            className={authControlClass}
          />
        </AuthField>

        <button
          type="submit"
          disabled={pending}
          className={authPrimaryButtonClass}
        >
          {pending ? "Creating account..." : "Create Account"}
        </button>
      </form>
    </AuthShell>
  );
}
