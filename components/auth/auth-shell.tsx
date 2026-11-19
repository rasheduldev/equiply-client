import type { ReactNode } from "react";
import Link from "next/link";

export const authControlClass =
  "h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 text-sm text-brand-navy outline-none transition focus:border-brand-amber focus:bg-white focus:ring-2 focus:ring-brand-amber/25 placeholder:text-slate-400 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:bg-white/10 dark:placeholder:text-white/35";

export const authPrimaryButtonClass =
  "flex h-11 w-full items-center justify-center rounded-lg bg-brand-amber px-5 text-sm font-bold text-brand-navy transition hover:bg-brand-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-amber focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus-visible:ring-offset-brand-navy-soft";

export const authLinkClass =
  "font-semibold text-brand-amber underline-offset-4 hover:underline";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: AuthShellProps) {
  return (
    <main className="flex min-h-svh items-center justify-center bg-[#eef2f8] px-4 py-8 dark:bg-[#08172a]">
      <div className="mx-auto w-full max-w-md">
        <div className="overflow-hidden rounded-2xl bg-white shadow-[0_20px_55px_-25px_rgba(13,32,55,0.35)] ring-1 ring-brand-navy/5 dark:bg-brand-navy-soft dark:ring-white/10">
          <header className="bg-brand-navy px-6 py-6 text-center sm:px-8">
            <Link
              href="/"
              className="mb-4 inline-block text-sm font-extrabold tracking-[0.18em] text-white uppercase"
            >
              Equiply
            </Link>

            <p className="text-[10px] font-bold tracking-[0.2em] text-brand-amber uppercase">
              {eyebrow}
            </p>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-white">
              {title}
            </h1>

            <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-white/65">
              {subtitle}
            </p>
          </header>

          <div className="px-6 py-6 sm:px-8 sm:py-7">
            {children}

            {footer && (
              <p className="mt-6 text-center text-sm text-brand-muted dark:text-white/55">
                {footer}
              </p>
            )}
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-brand-muted dark:text-white/40">
          © {new Date().getFullYear()} Equiply. All rights reserved.
        </p>
      </div>
    </main>
  );
}

type AuthFieldProps = {
  htmlFor: string;
  label: string;
  hint?: string;
  children: ReactNode;
};

export function AuthField({
  htmlFor,
  label,
  hint,
  children,
}: AuthFieldProps) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className="block text-xs font-semibold text-brand-muted dark:text-white/65"
      >
        {label}
      </label>

      {children}

      {hint && (
        <p className="text-xs text-brand-muted dark:text-white/45">{hint}</p>
      )}
    </div>
  );
}

export function AuthDivider() {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
      <span className="text-xs text-brand-muted dark:text-white/40">OR</span>
      <span className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
    </div>
  );
}

export function AuthAlert({ children }: { children: ReactNode }) {
  return (
    <p
      role="alert"
      className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
    >
      {children}
    </p>
  );
}