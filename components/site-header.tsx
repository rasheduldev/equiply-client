
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";

import { BrandLogo } from "@/components/brand-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

type AuthUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

type AuthActionsProps = {
  user: AuthUser | null;
  pending: boolean;
  signingOut: boolean;
  onSignOut: () => void;
  onNavigate?: () => void;
  mobile?: boolean;
};

function AuthActions({
  user,
  pending,
  signingOut,
  onSignOut,
  onNavigate,
  mobile = false,
}: AuthActionsProps) {
  if (pending) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-9 w-16 animate-pulse rounded-md bg-white/15" />
        <div className="h-9 w-20 animate-pulse rounded-md bg-white/15" />
      </div>
    );
  }

  if (user) {
    const name =
      user.name?.trim() ||
      user.email?.split("@")[0] ||
      "Account";

    const initials = name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();

    return (
      <div
        className={cn(
          "flex items-center gap-3",
          mobile && "flex-col items-stretch"
        )}
      >
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className="flex min-w-0 items-center gap-2"
        >
          <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-navy-soft text-xs font-bold text-white ring-2 ring-brand-amber">
            {user.image ? (
              <Image
                src={user.image}
                alt="Profile"
                width={36}
                height={36}
                unoptimized
                referrerPolicy="no-referrer"
                className="size-full object-cover"
              />
            ) : (
              initials || "A"
            )}
          </span>

          <span className="max-w-30 truncate text-sm font-semibold text-white">
            {name}
          </span>
        </Link>

        <button
          type="button"
          onClick={onSignOut}
          disabled={signingOut}
          className={cn(
            "rounded-md bg-white/10 px-5 py-2.5 text-xs font-bold tracking-wide text-white uppercase ring-1 ring-white/15 transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60",
            mobile && "w-full"
          )}
        >
          {signingOut ? "Signing out..." : "Logout"}
        </button>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", mobile && "w-full")}>
      <Link
        href="/sign-in"
        onClick={onNavigate}
        className={cn(
          "rounded-md px-4 py-2.5 text-xs font-bold tracking-wide text-white/80 uppercase transition-colors hover:text-brand-amber",
          mobile && "flex-1 border border-white/20 text-center"
        )}
      >
        Login
      </Link>

      <Link
        href="/sign-up"
        onClick={onNavigate}
        className={cn(
          "group inline-flex items-center justify-center gap-2 rounded-md bg-brand-amber px-5 py-2.5 text-xs font-bold tracking-wide text-brand-navy uppercase transition-colors hover:bg-brand-sand",
          mobile && "flex-1"
        )}
      >
        Register
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const user = session?.user ?? null;

  async function handleSignOut() {
    if (signingOut) return;

    setSigningOut(true);

    try {
      const { error } = await authClient.signOut();

      if (error) return;

      setMobileOpen(false);
      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Sign out failed:", error);
    } finally {
      setSigningOut(false);
    }
  }

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/equipment", label: "All Equipment" },
    ...(user ? [{ href: "/dashboard", label: "Dashboard" }] : []),
  ];

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-brand-navy shadow-lg shadow-brand-navy/20">

      {/* Desktop Navbar */}
      <div className="mx-auto hidden h-22 max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 lg:grid lg:px-8">

        {/* Left: Logo and Brand Name */}
        <BrandLogo variant="inverse" />

        {/* Center: Navigation Links */}
        <nav
          aria-label="Primary navigation"
          className="flex h-full items-center gap-2"
        >
          {navItems.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-md px-4 py-3 text-xs font-bold tracking-wide uppercase transition-colors",
                  active
                    ? "bg-brand-amber text-brand-navy"
                    : "text-white/75 hover:bg-white/10 hover:text-white"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Theme Toggle and Authentication */}
        <div className="flex items-center justify-end gap-3">
          <ThemeToggle />

          <AuthActions
            user={user}
            pending={isPending}
            signingOut={signingOut}
            onSignOut={handleSignOut}
          />
        </div>
      </div>

      {/* Mobile and Tablet Navbar */}
      <div className="flex h-19 items-center justify-between gap-3 px-4 lg:hidden">

        <BrandLogo variant="inverse" />

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="flex size-10 items-center justify-center rounded-md bg-white/10 text-white ring-1 ring-white/15 transition-colors hover:bg-white/20"
          >
            {mobileOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-white/10 bg-brand-navy px-4 py-4 lg:hidden"
        >
          <nav
            aria-label="Mobile navigation"
            className="flex flex-col"
          >
            {navItems.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-12 items-center justify-between border-b border-white/10 px-3 text-sm font-semibold",
                    active ? "text-brand-amber" : "text-white"
                  )}
                >
                  {item.label}

                  {active && (
                    <span className="size-2 rounded-full bg-brand-amber" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="pt-5">
            <AuthActions
              user={user}
              pending={isPending}
              signingOut={signingOut}
              onSignOut={handleSignOut}
              onNavigate={() => setMobileOpen(false)}
              mobile
            />
          </div>
        </div>
      )}
    </header>
  );
}
